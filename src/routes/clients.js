const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Client = require('../models/Client');
const Application = require('../models/Application');
const { requireOnboarding } = require('../middleware/auth');

router.use(requireOnboarding);

// Listar clientes
router.get('/', async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const clients = await Client.find({ companyId }).sort({ nomeRazaoSocial: 1 });

    // Para cada cliente, buscar total de aplicações e área tratada
    const companyObjId = new mongoose.Types.ObjectId(companyId);
    const stats = await Application.aggregate([
      { $match: { companyId: companyObjId, status: { $ne: 'cancelada' } } },
      { $group: { _id: '$clientId', totalApps: { $sum: 1 }, totalArea: { $sum: '$areaTratada' }, ultimaApp: { $max: '$dataHoraInicio' } } }
    ]);

    const statsMap = {};
    stats.forEach(s => { statsMap[s._id.toString()] = s; });

    res.render('clients/index', {
      title: 'Clientes',
      clients,
      statsMap,
      query: req.query
    });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar clientes.' });
  }
});

// Formulário de novo cliente
router.get('/new', (req, res) => {
  res.render('clients/form', { title: 'Novo Cliente', client: null });
});

// Perfil/histórico do cliente
router.get('/:id', async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const client = await Client.findOne({ _id: req.params.id, companyId });

    if (!client) {
      return res.status(404).render('error', { title: 'Cliente não encontrado', message: 'Cliente não encontrado.' });
    }

    const companyObjId = new mongoose.Types.ObjectId(companyId);
    const clientObjId = new mongoose.Types.ObjectId(req.params.id);

    // Estatísticas gerais do cliente
    const statsAgg = await Application.aggregate([
      { $match: { companyId: companyObjId, clientId: clientObjId } },
      {
        $group: {
          _id: null,
          totalApps: { $sum: 1 },
          totalArea: { $sum: '$areaTratada' },
          totalVolume: { $sum: '$volume' },
          totalFaturamento: {
            $sum: { $multiply: ['$areaTratada', { $ifNull: ['$valorHectare', 0] }] }
          },
          appsComValor: { $sum: { $cond: [{ $gt: ['$valorHectare', 0] }, 1, 0] } },
          ultimaApp: { $max: '$dataHoraInicio' },
          primeiraApp: { $min: '$dataHoraInicio' }
        }
      }
    ]);

    const clientStats = statsAgg.length > 0 ? statsAgg[0] : {
      totalApps: 0, totalArea: 0, totalVolume: 0,
      totalFaturamento: 0, appsComValor: 0, ultimaApp: null, primeiraApp: null
    };

    // Área por tipo de atividade
    const porTipoAgg = await Application.aggregate([
      { $match: { companyId: companyObjId, clientId: clientObjId, status: { $ne: 'cancelada' } } },
      { $group: { _id: '$tipoAtividade', count: { $sum: 1 }, area: { $sum: '$areaTratada' } } },
      { $sort: { area: -1 } }
    ]);

    // Área por cultura
    const porCulturaAgg = await Application.aggregate([
      { $match: { companyId: companyObjId, clientId: clientObjId, status: { $ne: 'cancelada' } } },
      { $group: { _id: '$culturaTratada', count: { $sum: 1 }, area: { $sum: '$areaTratada' } } },
      { $sort: { area: -1 } },
      { $limit: 5 }
    ]);

    // Últimas aplicações deste cliente
    const aplicacoes = await Application.find({ companyId, clientId: req.params.id })
      .populate('droneId', 'marcaModelo identificacaoRegistro')
      .populate('operatorId', 'nome')
      .sort({ dataHoraInicio: -1 })
      .limit(20);

    res.render('clients/view', {
      title: client.nomeRazaoSocial,
      client,
      clientStats,
      porTipoAgg,
      porCulturaAgg,
      aplicacoes
    });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar histórico do cliente.' });
  }
});

// Formulário de edição
router.get('/:id/edit', async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      companyId: req.session.user.companyId
    });

    if (!client) {
      return res.status(404).render('error', {
        title: 'Cliente não encontrado',
        message: 'Cliente não encontrado.'
      });
    }

    res.render('clients/form', { title: 'Editar Cliente', client });
  } catch (error) {
    res.render('error', { title: 'Erro', message: 'Erro ao carregar cliente.' });
  }
});

// Criar cliente
router.post('/', async (req, res) => {
  try {
    const { nomeRazaoSocial, cpfCnpj, propriedadeFazenda, enderecoLocalizacao, municipio, uf, observacoes } = req.body;

    if (!nomeRazaoSocial || !municipio || !uf) {
      return res.render('clients/form', {
        title: 'Novo Cliente',
        client: req.body,
        error: 'Nome/Razão Social, Município e UF são obrigatórios.'
      });
    }

    const client = new Client({
      companyId: req.session.user.companyId,
      nomeRazaoSocial,
      cpfCnpj: cpfCnpj ? cpfCnpj.replace(/\D/g, '') : '',
      propriedadeFazenda,
      enderecoLocalizacao,
      municipio,
      uf: uf.toUpperCase(),
      observacoes
    });

    await client.save();
    res.redirect('/clients?success=Cliente criado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.render('clients/form', {
      title: 'Novo Cliente',
      client: req.body,
      error: 'Erro ao criar cliente. Tente novamente.'
    });
  }
});

// Atualizar cliente
router.post('/:id', async (req, res) => {
  try {
    const { nomeRazaoSocial, cpfCnpj, propriedadeFazenda, enderecoLocalizacao, municipio, uf, observacoes } = req.body;

    if (!nomeRazaoSocial || !municipio || !uf) {
      return res.render('clients/form', {
        title: 'Editar Cliente',
        client: { ...req.body, _id: req.params.id },
        error: 'Nome/Razão Social, Município e UF são obrigatórios.'
      });
    }

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, companyId: req.session.user.companyId },
      {
        nomeRazaoSocial,
        cpfCnpj: cpfCnpj ? cpfCnpj.replace(/\D/g, '') : '',
        propriedadeFazenda,
        enderecoLocalizacao,
        municipio,
        uf: uf.toUpperCase(),
        observacoes
      },
      { new: true }
    );

    if (!client) {
      return res.status(404).render('error', {
        title: 'Cliente não encontrado',
        message: 'Cliente não encontrado.'
      });
    }

    res.redirect('/clients?success=Cliente atualizado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.render('clients/form', {
      title: 'Editar Cliente',
      client: { ...req.body, _id: req.params.id },
      error: 'Erro ao atualizar cliente. Tente novamente.'
    });
  }
});

// Deletar cliente
router.post('/:id/delete', async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      companyId: req.session.user.companyId
    });

    if (!client) {
      return res.status(404).render('error', {
        title: 'Cliente não encontrado',
        message: 'Cliente não encontrado.'
      });
    }

    res.redirect('/clients?success=Cliente deletado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.redirect('/clients?error=Erro ao deletar cliente');
  }
});

module.exports = router;
