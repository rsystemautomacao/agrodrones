const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Client = require('../models/Client');
const Drone = require('../models/Drone');
const Operator = require('../models/Operator');
const Company = require('../models/Company');
const File = require('../models/File');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireOnboarding } = require('../middleware/auth');

router.use(requireOnboarding);

// Configurar multer para upload de evidências
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/evidencias');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.session.user.companyId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image|pdf/.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens e PDFs são permitidos'));
    }
  }
});

// Upload com fields para evidências e croqui separados
const uploadFields = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image|pdf/.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens e PDFs são permitidos'));
    }
  }
}).fields([
  { name: 'evidencias', maxCount: 10 },
  { name: 'croqui', maxCount: 1 }
]);

// Listar aplicações
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const applications = await Application.find({ companyId: req.session.user.companyId })
      .populate('clientId', 'nomeRazaoSocial propriedadeFazenda municipio uf')
      .populate('droneId', 'marcaModelo identificacaoRegistro')
      .populate('operatorId', 'nome')
      .sort({ dataHoraInicio: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Application.countDocuments({ companyId: req.session.user.companyId });
    
    res.render('applications/index', {
      title: 'Aplicações',
      applications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      query: req.query
    });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar aplicações.' });
  }
});

// Formulário de nova aplicação
router.get('/new', async (req, res) => {
  try {
    const clients = await Client.find({ companyId: req.session.user.companyId }).sort({ nomeRazaoSocial: 1 });
    const drones = await Drone.find({ companyId: req.session.user.companyId, active: true }).sort({ marcaModelo: 1 });
    const operators = await Operator.find({ companyId: req.session.user.companyId, active: true }).sort({ nome: 1 });
    const company = await Company.findById(req.session.user.companyId);
    
    res.render('applications/form', {
      title: 'Nova Aplicação',
      application: null,
      clients,
      drones,
      operators,
      company,
      defaults: company.configuracoes || {}
    });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar formulário.' });
  }
});

// Formulário de edição
router.get('/:id/edit', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      companyId: req.session.user.companyId
    })
      .populate('clientId')
      .populate('droneId')
      .populate('operatorId')
      .populate('evidencias');
    
    if (!application) {
      return res.status(404).render('error', {
        title: 'Aplicação não encontrada',
        message: 'Aplicação não encontrada.'
      });
    }
    
    const clients = await Client.find({ companyId: req.session.user.companyId }).sort({ nomeRazaoSocial: 1 });
    const drones = await Drone.find({ companyId: req.session.user.companyId, active: true }).sort({ marcaModelo: 1 });
    const operators = await Operator.find({ companyId: req.session.user.companyId, active: true }).sort({ nome: 1 });
    const company = await Company.findById(req.session.user.companyId);
    
    res.render('applications/form', {
      title: 'Editar Aplicação',
      application,
      clients,
      drones,
      operators,
      company,
      defaults: company.configuracoes || {}
    });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar aplicação.' });
  }
});

// Visualizar aplicação
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      companyId: req.session.user.companyId
    })
      .populate('clientId')
      .populate('droneId')
      .populate('operatorId')
      .populate('evidencias')
      .populate('createdBy', 'name');
    
    if (!application) {
      return res.status(404).render('error', {
        title: 'Aplicação não encontrada',
        message: 'Aplicação não encontrada.'
      });
    }
    
    res.render('applications/view', {
      title: 'Aplicação',
      application
    });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar aplicação.' });
  }
});

// Criar aplicação
router.post('/', uploadFields, async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const company = await Company.findById(companyId);
    
    // Validar campos obrigatórios
    const requiredFields = [
      'clientId', 'droneId', 'operatorId', 'dataHoraInicio', 'dataHoraTermino',
      'coordenadasGeograficas', 'culturaTratada', 'areaTratada', 'tipoAtividade',
      'marcaComercial', 'volume', 'dosagemAplicada', 'alturaVoo',
      'temperatura', 'umidadeRelativa', 'direcaoVento', 'velocidadeVento'
    ];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        const clients = await Client.find({ companyId }).sort({ nomeRazaoSocial: 1 });
        const drones = await Drone.find({ companyId, active: true }).sort({ marcaModelo: 1 });
        const operators = await Operator.find({ companyId, active: true }).sort({ nome: 1 });
        
        return res.render('applications/form', {
          title: 'Nova Aplicação',
          application: req.body,
          clients,
          drones,
          operators,
          company,
          defaults: company.configuracoes || {},
          error: `O campo ${field} é obrigatório.`
        });
      }
    }
    
    // Processar uploads
    const evidenciasIds = [];
    let croquiPath = null;
    
    if (req.files) {
      // Processar evidências
      if (req.files.evidencias && req.files.evidencias.length > 0) {
        for (const file of req.files.evidencias) {
          const fileDoc = new File({
            companyId,
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            uploadedBy: req.session.user.id,
            category: 'evidencia'
          });
          await fileDoc.save();
          evidenciasIds.push(fileDoc._id);
        }
      }
      
      // Processar croqui
      if (req.files.croqui && req.files.croqui.length > 0) {
        const croquiFile = req.files.croqui[0];
        const croquiDoc = new File({
          companyId,
          filename: croquiFile.filename,
          originalName: croquiFile.originalname,
          mimeType: croquiFile.mimetype,
          size: croquiFile.size,
          path: croquiFile.path,
          uploadedBy: req.session.user.id,
          category: 'croqui'
        });
        await croquiDoc.save();
        croquiPath = croquiFile.path;
      }
    }
    
    // Criar aplicação
    const application = new Application({
      companyId,
      clientId: req.body.clientId,
      droneId: req.body.droneId,
      operatorId: req.body.operatorId,
      dataHoraInicio: new Date(req.body.dataHoraInicio),
      dataHoraTermino: new Date(req.body.dataHoraTermino),
      coordenadasGeograficas: req.body.coordenadasGeograficas,
      culturaTratada: req.body.culturaTratada,
      areaTratada: parseFloat(req.body.areaTratada),
      tipoAtividade: req.body.tipoAtividade,
      marcaComercial: req.body.marcaComercial,
      volume: parseFloat(req.body.volume),
      dosagemAplicada: req.body.dosagemAplicada,
      alturaVoo: parseFloat(req.body.alturaVoo),
      meteorologia: {
        temperatura: parseFloat(req.body.temperatura),
        umidadeRelativa: parseFloat(req.body.umidadeRelativa),
        direcaoVento: req.body.direcaoVento,
        velocidadeVento: parseFloat(req.body.velocidadeVento)
      },
      relatorioOperacional: {
        contratante: req.body.contratante || '',
        propriedade: req.body.propriedade || '',
        localizacao: req.body.localizacao || '',
        registroMAPA: req.body.registroMAPA || company.numeroRegistroMAPA || '',
        municipio: req.body.municipio || '',
        uf: req.body.uf || '',
        cpfCnpj: req.body.cpfCnpj || '',
        produto: req.body.produto || '',
        formulacao: req.body.formulacao || '',
        dosagem: req.body.dosagem || '',
        classeToxicologica: req.body.classeToxicologica || '',
        adjuvante: req.body.adjuvante || '',
        volume: req.body.volumeRelatorio || '',
        outros: req.body.outros || '',
        receituarioAgronomico: {
          numero: req.body.receituarioNumero || '',
          dataEmissao: req.body.receituarioData ? new Date(req.body.receituarioData) : null
        },
        parametrosBasicos: {
          temperaturaMax: req.body.tempMax ? parseFloat(req.body.tempMax) : null,
          temperaturaMin: req.body.tempMin ? parseFloat(req.body.tempMin) : null,
          umidadeRelativaMin: req.body.umidadeMin ? parseFloat(req.body.umidadeMin) : null,
          velocidadeVentoMax: req.body.ventoMax ? parseFloat(req.body.ventoMax) : null,
          equipamento: req.body.equipamento || company.configuracoes?.equipamentoPadrao || '',
          modelo: req.body.modelo || company.configuracoes?.modeloPadrao || '',
          tipo: req.body.tipo || company.configuracoes?.tipoPadrao || company.configuracoes?.pontaPulverizacaoPadrao || '',
          angulo: req.body.angulo || company.configuracoes?.anguloPadrao || '',
          alturaVoo: req.body.alturaVooRelatorio ? parseFloat(req.body.alturaVooRelatorio) : parseFloat(req.body.alturaVoo),
          larguraFaixa: req.body.larguraFaixa ? parseFloat(req.body.larguraFaixa) : null
        },
        croqui: croquiPath,
        observacoes: req.body.observacoes || company.configuracoes?.observacoesPadrao || '',
        assinaturas: {
          responsavelTecnico: {
            nome: req.body.rtNome || company.responsavelTecnico?.nome || '',
            registro: req.body.rtRegistro || company.responsavelTecnico?.crea || '',
            assinatura: req.body.rtAssinatura || ''
          },
          aplicador: {
            nome: req.body.aplicadorNome || '',
            registro: req.body.aplicadorRegistro || '',
            assinatura: req.body.aplicadorAssinatura || ''
          }
        }
      },
      evidencias: evidenciasIds,
      createdBy: req.session.user.id
    });
    
    await application.save();
    res.redirect(`/applications/${application._id}?success=Aplicação criada com sucesso`);
  } catch (error) {
    console.error('Erro:', error);
    const clients = await Client.find({ companyId: req.session.user.companyId }).sort({ nomeRazaoSocial: 1 });
    const drones = await Drone.find({ companyId: req.session.user.companyId, active: true }).sort({ marcaModelo: 1 });
    const operators = await Operator.find({ companyId: req.session.user.companyId, active: true }).sort({ nome: 1 });
    const company = await Company.findById(req.session.user.companyId);
    
    res.render('applications/form', {
      title: 'Nova Aplicação',
      application: req.body,
      clients,
      drones,
      operators,
      company,
      defaults: company.configuracoes || {},
      error: 'Erro ao criar aplicação. Verifique os dados e tente novamente.'
    });
  }
});

// Atualizar aplicação
router.post('/:id', uploadFields, async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const application = await Application.findOne({
      _id: req.params.id,
      companyId
    });
    
    if (!application) {
      return res.status(404).render('error', {
        title: 'Aplicação não encontrada',
        message: 'Aplicação não encontrada.'
      });
    }
    
    // Processar novos uploads
    const novasEvidenciasIds = [...application.evidencias.map(e => e.toString())];
    let croquiPath = application.relatorioOperacional?.croqui || null;
    
    if (req.files) {
      // Processar novas evidências
      if (req.files.evidencias && req.files.evidencias.length > 0) {
        for (const file of req.files.evidencias) {
          const fileDoc = new File({
            companyId,
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            uploadedBy: req.session.user.id,
            applicationId: application._id,
            category: 'evidencia'
          });
          await fileDoc.save();
          novasEvidenciasIds.push(fileDoc._id);
        }
      }
      
      // Processar croqui
      if (req.files.croqui && req.files.croqui.length > 0) {
        const croquiFile = req.files.croqui[0];
        const croquiDoc = new File({
          companyId,
          filename: croquiFile.filename,
          originalName: croquiFile.originalname,
          mimeType: croquiFile.mimetype,
          size: croquiFile.size,
          path: croquiFile.path,
          uploadedBy: req.session.user.id,
          applicationId: application._id,
          category: 'croqui'
        });
        await croquiDoc.save();
        croquiPath = croquiFile.path;
      }
    }
    
    // Atualizar aplicação
    Object.assign(application, {
      clientId: req.body.clientId,
      droneId: req.body.droneId,
      operatorId: req.body.operatorId,
      dataHoraInicio: new Date(req.body.dataHoraInicio),
      dataHoraTermino: new Date(req.body.dataHoraTermino),
      coordenadasGeograficas: req.body.coordenadasGeograficas,
      culturaTratada: req.body.culturaTratada,
      areaTratada: parseFloat(req.body.areaTratada),
      tipoAtividade: req.body.tipoAtividade,
      marcaComercial: req.body.marcaComercial,
      volume: parseFloat(req.body.volume),
      dosagemAplicada: req.body.dosagemAplicada,
      alturaVoo: parseFloat(req.body.alturaVoo),
      meteorologia: {
        temperatura: parseFloat(req.body.temperatura),
        umidadeRelativa: parseFloat(req.body.umidadeRelativa),
        direcaoVento: req.body.direcaoVento,
        velocidadeVento: parseFloat(req.body.velocidadeVento)
      },
      evidencias: novasEvidenciasIds
    });
    
    // Atualizar relatório operacional se fornecido
    if (req.body.produto !== undefined) {
      application.relatorioOperacional = {
        ...application.relatorioOperacional,
        contratante: req.body.contratante || '',
        propriedade: req.body.propriedade || '',
        localizacao: req.body.localizacao || '',
        registroMAPA: req.body.registroMAPA || '',
        municipio: req.body.municipio || '',
        uf: req.body.uf || '',
        cpfCnpj: req.body.cpfCnpj || '',
        produto: req.body.produto || '',
        formulacao: req.body.formulacao || '',
        dosagem: req.body.dosagem || '',
        classeToxicologica: req.body.classeToxicologica || '',
        adjuvante: req.body.adjuvante || '',
        volume: req.body.volumeRelatorio || '',
        outros: req.body.outros || '',
        receituarioAgronomico: {
          numero: req.body.receituarioNumero || '',
          dataEmissao: req.body.receituarioData ? new Date(req.body.receituarioData) : null
        },
        parametrosBasicos: {
          temperaturaMax: req.body.tempMax ? parseFloat(req.body.tempMax) : null,
          temperaturaMin: req.body.tempMin ? parseFloat(req.body.tempMin) : null,
          umidadeRelativaMin: req.body.umidadeMin ? parseFloat(req.body.umidadeMin) : null,
          velocidadeVentoMax: req.body.ventoMax ? parseFloat(req.body.ventoMax) : null,
          equipamento: req.body.equipamento || '',
          modelo: req.body.modelo || '',
          tipo: req.body.tipo || '',
          angulo: req.body.angulo || '',
          alturaVoo: req.body.alturaVooRelatorio ? parseFloat(req.body.alturaVooRelatorio) : parseFloat(req.body.alturaVoo),
          larguraFaixa: req.body.larguraFaixa ? parseFloat(req.body.larguraFaixa) : null
        },
        croqui: croquiPath,
        observacoes: req.body.observacoes || '',
        assinaturas: {
          responsavelTecnico: {
            nome: req.body.rtNome || '',
            registro: req.body.rtRegistro || '',
            assinatura: req.body.rtAssinatura || ''
          },
          aplicador: {
            nome: req.body.aplicadorNome || '',
            registro: req.body.aplicadorRegistro || '',
            assinatura: req.body.aplicadorAssinatura || ''
          }
        }
      };
    }
    
    await application.save();
    res.redirect(`/applications/${application._id}?success=Aplicação atualizada com sucesso`);
  } catch (error) {
    console.error('Erro:', error);
    res.redirect(`/applications/${req.params.id}/edit?error=Erro ao atualizar aplicação`);
  }
});

// Duplicar aplicação
router.post('/:id/duplicate', async (req, res) => {
  try {
    const original = await Application.findOne({
      _id: req.params.id,
      companyId: req.session.user.companyId
    });
    
    if (!original) {
      return res.status(404).render('error', {
        title: 'Aplicação não encontrada',
        message: 'Aplicação não encontrada.'
      });
    }
    
    const duplicated = new Application({
      ...original.toObject(),
      _id: undefined,
      dataHoraInicio: new Date(),
      dataHoraTermino: new Date(),
      evidencias: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await duplicated.save();
    res.redirect(`/applications/${duplicated._id}/edit?duplicated=true`);
  } catch (error) {
    console.error('Erro:', error);
    res.redirect('/applications?error=Erro ao duplicar aplicação');
  }
});

// Deletar aplicação
router.post('/:id/delete', async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      companyId: req.session.user.companyId
    });
    
    if (!application) {
      return res.status(404).render('error', {
        title: 'Aplicação não encontrada',
        message: 'Aplicação não encontrada.'
      });
    }
    
    res.redirect('/applications?success=Aplicação deletada com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.redirect('/applications?error=Erro ao deletar aplicação');
  }
});

module.exports = router;

