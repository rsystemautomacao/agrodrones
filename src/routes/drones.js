const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Drone = require('../models/Drone');
const Application = require('../models/Application');
const { requireOnboarding } = require('../middleware/auth');

router.use(requireOnboarding);

// Listar drones
router.get('/', async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const companyObjId = new mongoose.Types.ObjectId(companyId);
    const drones = await Drone.find({ companyId }).sort({ marcaModelo: 1 });

    // Estatísticas de aplicação por drone
    const statsAgg = await Application.aggregate([
      { $match: { companyId: companyObjId, status: { $ne: 'cancelada' } } },
      {
        $group: {
          _id: '$droneId',
          totalApps: { $sum: 1 },
          totalArea: { $sum: '$areaTratada' },
          ultimaApp: { $max: '$dataHoraInicio' }
        }
      }
    ]);
    const statsMap = {};
    statsAgg.forEach(s => { statsMap[s._id.toString()] = s; });

    res.render('drones/index', { title: 'Drones', drones, statsMap, query: req.query });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar drones.' });
  }
});

// Formulário de novo drone
router.get('/new', (req, res) => {
  res.render('drones/form', { title: 'Novo Drone', drone: null });
});

// Formulário de edição
router.get('/:id/edit', async (req, res) => {
  try {
    const drone = await Drone.findOne({
      _id: req.params.id,
      companyId: req.session.user.companyId
    });

    if (!drone) {
      return res.status(404).render('error', {
        title: 'Drone não encontrado',
        message: 'Drone não encontrado.'
      });
    }

    res.render('drones/form', { title: 'Editar Drone', drone });
  } catch (error) {
    res.render('error', { title: 'Erro', message: 'Erro ao carregar drone.' });
  }
});

// Criar drone
router.post('/', async (req, res) => {
  try {
    const { marcaModelo, identificacaoRegistro, capacidadeTanque, observacoes,
      horasVooTotal, intervaloManutencao, dataUltimaManutencao, proximaManutencaoData } = req.body;

    if (!marcaModelo || !identificacaoRegistro) {
      return res.render('drones/form', {
        title: 'Novo Drone',
        drone: req.body,
        error: 'Marca/Modelo e Identificação/Registro são obrigatórios.'
      });
    }

    const drone = new Drone({
      companyId: req.session.user.companyId,
      marcaModelo,
      identificacaoRegistro,
      capacidadeTanque: capacidadeTanque || null,
      observacoes,
      manutencao: {
        horasVooTotal: parseFloat(horasVooTotal) || 0,
        intervaloManutencao: parseFloat(intervaloManutencao) || 50,
        dataUltimaManutencao: dataUltimaManutencao ? new Date(dataUltimaManutencao) : null,
        proximaManutencaoData: proximaManutencaoData ? new Date(proximaManutencaoData) : null
      }
    });

    await drone.save();
    res.redirect('/drones?success=Drone criado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.render('drones/form', {
      title: 'Novo Drone',
      drone: req.body,
      error: 'Erro ao criar drone. Tente novamente.'
    });
  }
});

// Atualizar drone
router.post('/:id', async (req, res) => {
  try {
    const { marcaModelo, identificacaoRegistro, capacidadeTanque, observacoes,
      horasVooTotal, intervaloManutencao, dataUltimaManutencao, proximaManutencaoData } = req.body;

    if (!marcaModelo || !identificacaoRegistro) {
      return res.render('drones/form', {
        title: 'Editar Drone',
        drone: { ...req.body, _id: req.params.id },
        error: 'Marca/Modelo e Identificação/Registro são obrigatórios.'
      });
    }

    const drone = await Drone.findOneAndUpdate(
      { _id: req.params.id, companyId: req.session.user.companyId },
      {
        marcaModelo,
        identificacaoRegistro,
        capacidadeTanque: capacidadeTanque || null,
        observacoes,
        'manutencao.horasVooTotal': parseFloat(horasVooTotal) || 0,
        'manutencao.intervaloManutencao': parseFloat(intervaloManutencao) || 50,
        'manutencao.dataUltimaManutencao': dataUltimaManutencao ? new Date(dataUltimaManutencao) : null,
        'manutencao.proximaManutencaoData': proximaManutencaoData ? new Date(proximaManutencaoData) : null,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!drone) {
      return res.status(404).render('error', {
        title: 'Drone não encontrado',
        message: 'Drone não encontrado.'
      });
    }

    res.redirect('/drones?success=Drone atualizado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.render('drones/form', {
      title: 'Editar Drone',
      drone: { ...req.body, _id: req.params.id },
      error: 'Erro ao atualizar drone. Tente novamente.'
    });
  }
});

// Registrar manutenção
router.post('/:id/manutencao', async (req, res) => {
  try {
    const { descricao, tecnico, proximaManutencaoData } = req.body;
    const drone = await Drone.findOne({ _id: req.params.id, companyId: req.session.user.companyId });

    if (!drone) return res.redirect('/drones?error=Drone não encontrado');

    const horasAtual = drone.manutencao?.horasVooTotal || 0;

    await Drone.findByIdAndUpdate(req.params.id, {
      'manutencao.horasUltimaManutencao': horasAtual,
      'manutencao.dataUltimaManutencao': new Date(),
      'manutencao.proximaManutencaoData': proximaManutencaoData ? new Date(proximaManutencaoData) : null,
      $push: {
        'manutencao.historicoManutencoes': {
          data: new Date(),
          horasVoo: horasAtual,
          descricao: descricao || 'Manutenção registrada',
          tecnico: tecnico || ''
        }
      }
    });

    res.redirect('/drones?success=Manutenção registrada com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.redirect('/drones?error=Erro ao registrar manutenção');
  }
});

// Desativar drone (soft delete)
router.post('/:id/delete', async (req, res) => {
  try {
    const drone = await Drone.findOneAndUpdate(
      { _id: req.params.id, companyId: req.session.user.companyId },
      { active: false },
      { new: true }
    );

    if (!drone) {
      return res.status(404).render('error', {
        title: 'Drone não encontrado',
        message: 'Drone não encontrado.'
      });
    }

    res.redirect('/drones?success=Drone desativado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.redirect('/drones?error=Erro ao desativar drone');
  }
});

module.exports = router;
