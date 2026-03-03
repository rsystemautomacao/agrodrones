const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Client = require('../models/Client');
const Drone = require('../models/Drone');
const { requireOnboarding } = require('../middleware/auth');

router.use(requireOnboarding);

router.get('/', async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const companyObjId = new mongoose.Types.ObjectId(companyId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Contagens básicas em paralelo
    const [
      aplicacoesMes,
      aplicacoesHoje,
      totalClientes,
      totalDrones,
      aplicacoesUltMes
    ] = await Promise.all([
      Application.countDocuments({ companyId, dataHoraInicio: { $gte: startOfMonth } }),
      Application.countDocuments({ companyId, dataHoraInicio: { $gte: today, $lt: tomorrow } }),
      Client.countDocuments({ companyId }),
      Drone.countDocuments({ companyId, active: true }),
      Application.countDocuments({ companyId, dataHoraInicio: { $gte: startOfLastMonth, $lte: endOfLastMonth } })
    ]);

    // Área total tratada este mês (excluindo canceladas)
    const areaMesAgg = await Application.aggregate([
      { $match: { companyId: companyObjId, dataHoraInicio: { $gte: startOfMonth }, status: { $ne: 'cancelada' } } },
      { $group: { _id: null, total: { $sum: '$areaTratada' } } }
    ]);
    const areaMes = areaMesAgg.length > 0 ? areaMesAgg[0].total : 0;

    // Dados para gráfico: últimos 6 meses (aplicações + área)
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const mesInicio = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mesFim = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      meses.push({ inicio: mesInicio, fim: mesFim });
    }

    const chartDataPromises = meses.map(({ inicio, fim }) =>
      Application.aggregate([
        { $match: { companyId: companyObjId, dataHoraInicio: { $gte: inicio, $lte: fim }, status: { $ne: 'cancelada' } } },
        { $group: { _id: null, count: { $sum: 1 }, area: { $sum: '$areaTratada' } } }
      ])
    );
    const chartRaw = await Promise.all(chartDataPromises);

    const chartLabels = meses.map(({ inicio }) =>
      inicio.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    );
    const chartAplicacoes = chartRaw.map(r => (r.length > 0 ? r[0].count : 0));
    const chartArea = chartRaw.map(r => (r.length > 0 ? parseFloat(r[0].area.toFixed(1)) : 0));

    // Aplicações por tipo de atividade (todos os tempos)
    const porTipoAgg = await Application.aggregate([
      { $match: { companyId: companyObjId, status: { $ne: 'cancelada' } } },
      { $group: { _id: '$tipoAtividade', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const tipoMap = { agrotoxico: 'Agrotóxico', fertilizante: 'Fertilizante', inoculante: 'Inoculante', corretivo: 'Corretivo', semeadura: 'Semeadura', outros: 'Outros' };
    const tipoLabels = porTipoAgg.map(t => tipoMap[t._id] || t._id);
    const tipoData = porTipoAgg.map(t => t.count);

    // Aplicações por status
    const porStatusAgg = await Application.aggregate([
      { $match: { companyId: companyObjId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusMap = { agendada: 0, em_andamento: 0, concluida: 0, cancelada: 0 };
    porStatusAgg.forEach(s => {
      const key = s._id || 'concluida';
      if (statusMap[key] !== undefined) statusMap[key] += s.count;
      else statusMap.concluida += s.count;
    });

    // Tendência mês atual vs anterior
    const tendencia = aplicacoesUltMes > 0
      ? Math.round(((aplicacoesMes - aplicacoesUltMes) / aplicacoesUltMes) * 100)
      : null;

    // Últimas 10 aplicações
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
        totalDrones,
        areaMes: parseFloat(areaMes.toFixed(1)),
        tendencia
      },
      statusMap,
      chartLabels: JSON.stringify(chartLabels),
      chartAplicacoes: JSON.stringify(chartAplicacoes),
      chartArea: JSON.stringify(chartArea),
      tipoLabels: JSON.stringify(tipoLabels),
      tipoData: JSON.stringify(tipoData),
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
