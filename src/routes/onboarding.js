const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User');
const Operator = require('../models/Operator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');

// Configurar multer para upload da logo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/logos');
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

// Middleware para verificar se precisa de onboarding
router.use(requireAuth);
router.use(async (req, res, next) => {
  if (req.session.company && req.session.company.onboardingCompleted) {
    return res.redirect('/dashboard');
  }
  next();
});

// Passo 1: Dados da empresa
router.get('/', async (req, res) => {
  try {
    const company = await Company.findById(req.session.user.companyId);
    res.render('onboarding/step1', {
      title: 'Onboarding - Dados da Empresa',
      step: 1,
      company: company
    });
  } catch (error) {
    console.error('Erro:', error);
    res.redirect('/auth/login');
  }
});

router.post('/step1', async (req, res) => {
  try {
    const { razaoSocial, nomeFantasia, cnpj, inscricaoEstadual, telefone, email } = req.body;
    
    if (!razaoSocial || !cnpj || !telefone || !email) {
      const company = await Company.findById(req.session.user.companyId);
      return res.render('onboarding/step1', {
        title: 'Onboarding - Dados da Empresa',
        step: 1,
        company: company,
        error: 'Todos os campos marcados com * são obrigatórios.'
      });
    }
    
    await Company.findByIdAndUpdate(req.session.user.companyId, {
      razaoSocial,
      nomeFantasia: nomeFantasia || '',
      cnpj: cnpj.replace(/\D/g, ''),
      inscricaoEstadual: inscricaoEstadual || '',
      telefone,
      email
    });
    
    res.redirect('/onboarding/step2');
  } catch (error) {
    console.error('Erro:', error);
    const company = await Company.findById(req.session.user.companyId);
    res.render('onboarding/step1', {
      title: 'Onboarding - Dados da Empresa',
      step: 1,
      company: company,
      error: 'Erro ao salvar dados. Tente novamente.'
    });
  }
});

// Passo 2: Endereço
router.get('/step2', async (req, res) => {
  try {
    const company = await Company.findById(req.session.user.companyId);
    res.render('onboarding/step2', {
      title: 'Onboarding - Endereço',
      step: 2,
      company: company
    });
  } catch (error) {
    res.redirect('/onboarding');
  }
});

router.post('/step2', async (req, res) => {
  try {
    const { logradouro, numero, complemento, bairro, cidade, uf, cep } = req.body;
    
    if (!logradouro || !numero || !bairro || !cidade || !uf || !cep) {
      const company = await Company.findById(req.session.user.companyId);
      return res.render('onboarding/step2', {
        title: 'Onboarding - Endereço',
        step: 2,
        company: company,
        error: 'Todos os campos marcados com * são obrigatórios.'
      });
    }
    
    await Company.findByIdAndUpdate(req.session.user.companyId, {
      logradouro,
      numero,
      complemento: complemento || '',
      bairro,
      cidade,
      uf: uf.toUpperCase(),
      cep: cep.replace(/\D/g, '')
    });
    
    res.redirect('/onboarding/step3');
  } catch (error) {
    console.error('Erro ao salvar endereço:', error);
    const company = await Company.findById(req.session.user.companyId);
    res.render('onboarding/step2', {
      title: 'Onboarding - Endereço',
      step: 2,
      company: company,
      error: 'Erro ao salvar endereço. Tente novamente.'
    });
  }
});

// Passo 3: Registro e conformidade
router.get('/step3', async (req, res) => {
  try {
    const company = await Company.findById(req.session.user.companyId);
    res.render('onboarding/step3', {
      title: 'Onboarding - Registro e Conformidade',
      step: 3,
      company: company
    });
  } catch (error) {
    res.redirect('/onboarding');
  }
});

router.post('/step3', async (req, res) => {
  try {
    const { numeroRegistroMAPA, responsavelTecnicoNome, responsavelTecnicoCrea, cursoCredencial, observacoes } = req.body;
    
    await Company.findByIdAndUpdate(req.session.user.companyId, {
      numeroRegistroMAPA,
      responsavelTecnico: {
        nome: responsavelTecnicoNome,
        crea: responsavelTecnicoCrea
      },
      cursoCredencial,
      observacoes
    });
    
    res.redirect('/onboarding/step4');
  } catch (error) {
    res.render('onboarding/step3', {
      title: 'Onboarding - Registro e Conformidade',
      step: 3,
      error: 'Erro ao salvar dados. Tente novamente.'
    });
  }
});

// Passo 4: Serviços prestados
router.get('/step4', async (req, res) => {
  try {
    const company = await Company.findById(req.session.user.companyId);
    res.render('onboarding/step4', {
      title: 'Onboarding - Serviços Prestados',
      step: 4,
      company: company
    });
  } catch (error) {
    res.redirect('/onboarding');
  }
});

router.post('/step4', async (req, res) => {
  try {
    const servicosPrestados = Array.isArray(req.body.servicosPrestados) 
      ? req.body.servicosPrestados 
      : req.body.servicosPrestados ? [req.body.servicosPrestados] : [];
    
    await Company.findByIdAndUpdate(req.session.user.companyId, {
      servicosPrestados,
      servicosOutros: req.body.servicosOutros
    });
    
    res.redirect('/onboarding/step5');
  } catch (error) {
    res.render('onboarding/step4', {
      title: 'Onboarding - Serviços Prestados',
      step: 4,
      error: 'Erro ao salvar serviços. Tente novamente.'
    });
  }
});

// Passo 5: Equipe e identidade visual
router.get('/step5', async (req, res) => {
  try {
    const company = await Company.findById(req.session.user.companyId);
    const operators = await Operator.find({ companyId: req.session.user.companyId });
    res.render('onboarding/step5', {
      title: 'Onboarding - Equipe e Identidade Visual',
      step: 5,
      company: company,
      operators: operators
    });
  } catch (error) {
    res.redirect('/onboarding');
  }
});

router.post('/step5', upload.single('logo'), async (req, res) => {
  try {
    const updates = {};
    
    if (req.file) {
      // Salvar caminho relativo para servir via rota de arquivos
      updates.logo = `uploads/logos/${req.file.filename}`;
    }
    
    if (req.body.nomeColaborador && req.body.funcaoColaborador) {
      const operators = Array.isArray(req.body.nomeColaborador) 
        ? req.body.nomeColaborador.map((nome, index) => ({
            nome,
            funcao: Array.isArray(req.body.funcaoColaborador) ? req.body.funcaoColaborador[index] : req.body.funcaoColaborador
          }))
        : [{ nome: req.body.nomeColaborador, funcao: req.body.funcaoColaborador }];
      
      for (const op of operators) {
        if (op.nome && op.funcao) {
          await Operator.create({
            companyId: req.session.user.companyId,
            nome: op.nome,
            funcao: op.funcao
          });
        }
      }
    }
    
    await Company.findByIdAndUpdate(req.session.user.companyId, updates);
    
    // Completar onboarding
    await Company.findByIdAndUpdate(req.session.user.companyId, {
      onboardingCompleted: true
    });
    
    // Atualizar sessão
    req.session.company.onboardingCompleted = true;
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Erro:', error);
    res.render('onboarding/step5', {
      title: 'Onboarding - Equipe e Identidade Visual',
      step: 5,
      error: 'Erro ao salvar dados. Tente novamente.'
    });
  }
});

module.exports = router;

