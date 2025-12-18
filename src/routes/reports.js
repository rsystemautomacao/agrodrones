const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Client = require('../models/Client');
const Drone = require('../models/Drone');
const Operator = require('../models/Operator');
const Company = require('../models/Company');
const { requireOnboarding } = require('../middleware/auth');
const { exportApplicationsToCSV, buildQuery } = require('../services/exportService');
const { generateRelatorioOperacional, generateRelatorioConsolidado } = require('../services/pdfService');

router.use(requireOnboarding);

// Página de relatórios
router.get('/', async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    
    const clients = await Client.find({ companyId }).sort({ nomeRazaoSocial: 1 });
    const drones = await Drone.find({ companyId, active: true }).sort({ marcaModelo: 1 });
    const operators = await Operator.find({ companyId, active: true }).sort({ nome: 1 });
    
    // Buscar aplicações com filtros se houver
    const filters = {
      dataInicio: req.query.dataInicio || '',
      dataFim: req.query.dataFim || '',
      clientId: req.query.clientId || '',
      municipio: req.query.municipio || '',
      uf: req.query.uf || '',
      tipoAtividade: req.query.tipoAtividade || '',
      droneId: req.query.droneId || '',
      operatorId: req.query.operatorId || '',
      cultura: req.query.cultura || ''
    };
    
    let query = buildQuery(filters, companyId);
    
    // Filtrar por município e UF após popula
    let applications = await Application.find(query)
      .populate('clientId', 'nomeRazaoSocial propriedadeFazenda municipio uf')
      .populate('droneId', 'marcaModelo identificacaoRegistro')
      .populate('operatorId', 'nome')
      .sort({ dataHoraInicio: -1 });
    
    // Aplicar filtros de município e UF em memória (devido ao populate)
    if (filters.municipio) {
      applications = applications.filter(app => 
        app.clientId && app.clientId.municipio && 
        app.clientId.municipio.toLowerCase().includes(filters.municipio.toLowerCase())
      );
    }
    
    if (filters.uf) {
      applications = applications.filter(app => 
        app.clientId && app.clientId.uf && app.clientId.uf.toUpperCase() === filters.uf.toUpperCase()
      );
    }
    
    applications = applications.slice(0, 100);
    
    res.render('reports/index', {
      title: 'Relatórios',
      filters,
      applications,
      clients,
      drones,
      operators
    });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar relatórios.' });
  }
});

// Exportar CSV
router.get('/export/csv', async (req, res) => {
  try {
    const filters = {
      dataInicio: req.query.dataInicio || '',
      dataFim: req.query.dataFim || '',
      clientId: req.query.clientId || '',
      municipio: req.query.municipio || '',
      uf: req.query.uf || '',
      tipoAtividade: req.query.tipoAtividade || '',
      droneId: req.query.droneId || '',
      operatorId: req.query.operatorId || '',
      cultura: req.query.cultura || ''
    };
    
    const csv = await exportApplicationsToCSV(filters, req.session.user.companyId);
    
    const filename = `aplicacoes_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    res.status(500).send('Erro ao exportar CSV');
  }
});

// Gerar PDF individual (Anexo XI)
router.get('/application/:id/pdf', async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      companyId: req.session.user.companyId
    })
      .populate('clientId')
      .populate('droneId')
      .populate('operatorId');
    
    if (!application) {
      return res.status(404).send('Aplicação não encontrada');
    }
    
    const company = await Company.findById(req.session.user.companyId);
    
    const pdfBuffer = await generateRelatorioOperacional(application, company);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio_operacional_${application._id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).send('Erro ao gerar PDF');
  }
});

// Gerar PDF consolidado
router.get('/export/pdf', async (req, res) => {
  try {
    const filters = {
      dataInicio: req.query.dataInicio || '',
      dataFim: req.query.dataFim || '',
      clientId: req.query.clientId || '',
      municipio: req.query.municipio || '',
      uf: req.query.uf || '',
      tipoAtividade: req.query.tipoAtividade || '',
      droneId: req.query.droneId || '',
      operatorId: req.query.operatorId || '',
      cultura: req.query.cultura || ''
    };
    
    const query = buildQuery(filters, req.session.user.companyId);
    const applications = await Application.find(query)
      .populate('clientId', 'nomeRazaoSocial propriedadeFazenda municipio uf')
      .populate('droneId', 'marcaModelo identificacaoRegistro')
      .populate('operatorId', 'nome')
      .sort({ dataHoraInicio: -1 });
    
    const company = await Company.findById(req.session.user.companyId);
    
    const periodo = filters.dataInicio && filters.dataFim
      ? `${new Date(filters.dataInicio).toLocaleDateString('pt-BR')} a ${new Date(filters.dataFim).toLocaleDateString('pt-BR')}`
      : 'Todos os períodos';
    
    const pdfBuffer = await generateRelatorioConsolidado(applications, company, periodo);
    
    const filename = `relatorio_consolidado_${new Date().toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erro ao gerar PDF consolidado:', error);
    res.status(500).send('Erro ao gerar PDF consolidado');
  }
});

module.exports = router;

