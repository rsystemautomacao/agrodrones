const express = require('express');
const router = express.Router();
const Drone = require('../models/Drone');
const { requireOnboarding } = require('../middleware/auth');

router.use(requireOnboarding);

// Listar drones
router.get('/', async (req, res) => {
  try {
    const drones = await Drone.find({ companyId: req.session.user.companyId })
      .sort({ marcaModelo: 1 });
    res.render('drones/index', { title: 'Drones', drones, query: req.query });
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
    const { marcaModelo, identificacaoRegistro, capacidadeTanque, observacoes } = req.body;
    
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
      observacoes
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
    const { marcaModelo, identificacaoRegistro, capacidadeTanque, observacoes } = req.body;
    
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
        observacoes
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

// Deletar drone (soft delete)
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

