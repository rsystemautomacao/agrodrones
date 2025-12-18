const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Client = require('../models/Client');
const Drone = require('../models/Drone');
const { requireOnboarding } = require('../middleware/auth');

router.use(requireOnboarding);

router.get('/', async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Estatísticas
    const aplicacoesMes = await Application.countDocuments({
      companyId,
      dataHoraInicio: { $gte: startOfMonth }
    });
    
    const aplicacoesHoje = await Application.countDocuments({
      companyId,
      dataHoraInicio: { $gte: today, $lt: tomorrow }
    });
    
    const totalClientes = await Client.countDocuments({ companyId });
    const totalDrones = await Drone.countDocuments({ companyId, active: true });
    
    // Últimas aplicações
    const ultimasAplicacoes = await Application.find({ companyId })
      .populate('clientId', 'nomeRazaoSocial propriedadeFazenda municipio uf')
      .populate('droneId', 'marcaModelo identificacaoRegistro')
      .populate('operatorId', 'nome')
      .sort({ dataHoraInicio: -1 })
      .limit(10);
    
    res.render('dashboard/index', {
      title: 'Dashboard',
      user: req.session.user,
      stats: {
        aplicacoesMes,
        aplicacoesHoje,
        totalClientes,
        totalDrones
      },
      ultimasAplicacoes
    });
  } catch (error) {
    console.error('Erro no dashboard:', error);
    res.render('error', {
      title: 'Erro',
      message: 'Erro ao carregar dashboard.'
    });
  }
});

module.exports = router;

