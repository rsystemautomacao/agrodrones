const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator');
const { requireOnboarding } = require('../middleware/auth');

router.use(requireOnboarding);

// Listar operadores
router.get('/', async (req, res) => {
  try {
    const operators = await Operator.find({ companyId: req.session.user.companyId })
      .sort({ nome: 1 });
    res.render('operators/index', { title: 'Operadores', operators, query: req.query });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar operadores.' });
  }
});

// Formulário de novo operador
router.get('/new', (req, res) => {
  res.render('operators/form', { title: 'Novo Operador', operator: null });
});

// Formulário de edição
router.get('/:id/edit', async (req, res) => {
  try {
    const operator = await Operator.findOne({
      _id: req.params.id,
      companyId: req.session.user.companyId
    });
    
    if (!operator) {
      return res.status(404).render('error', {
        title: 'Operador não encontrado',
        message: 'Operador não encontrado.'
      });
    }
    
    res.render('operators/form', { title: 'Editar Operador', operator });
  } catch (error) {
    res.render('error', { title: 'Erro', message: 'Erro ao carregar operador.' });
  }
});

// Criar operador
router.post('/', async (req, res) => {
  try {
    const { nome, funcao, documentoRegistro, telefone } = req.body;
    
    if (!nome || !funcao) {
      return res.render('operators/form', {
        title: 'Novo Operador',
        operator: req.body,
        error: 'Nome e Função são obrigatórios.'
      });
    }
    
    const operator = new Operator({
      companyId: req.session.user.companyId,
      nome,
      funcao,
      documentoRegistro,
      telefone
    });
    
    await operator.save();
    res.redirect('/operators?success=Operador criado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.render('operators/form', {
      title: 'Novo Operador',
      operator: req.body,
      error: 'Erro ao criar operador. Tente novamente.'
    });
  }
});

// Atualizar operador
router.post('/:id', async (req, res) => {
  try {
    const { nome, funcao, documentoRegistro, telefone } = req.body;
    
    if (!nome || !funcao) {
      return res.render('operators/form', {
        title: 'Editar Operador',
        operator: { ...req.body, _id: req.params.id },
        error: 'Nome e Função são obrigatórios.'
      });
    }
    
    const operator = await Operator.findOneAndUpdate(
      { _id: req.params.id, companyId: req.session.user.companyId },
      {
        nome,
        funcao,
        documentoRegistro,
        telefone
      },
      { new: true }
    );
    
    if (!operator) {
      return res.status(404).render('error', {
        title: 'Operador não encontrado',
        message: 'Operador não encontrado.'
      });
    }
    
    res.redirect('/operators?success=Operador atualizado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.render('operators/form', {
      title: 'Editar Operador',
      operator: { ...req.body, _id: req.params.id },
      error: 'Erro ao atualizar operador. Tente novamente.'
    });
  }
});

// Deletar operador (soft delete)
router.post('/:id/delete', async (req, res) => {
  try {
    const operator = await Operator.findOneAndUpdate(
      { _id: req.params.id, companyId: req.session.user.companyId },
      { active: false },
      { new: true }
    );
    
    if (!operator) {
      return res.status(404).render('error', {
        title: 'Operador não encontrado',
        message: 'Operador não encontrado.'
      });
    }
    
    res.redirect('/operators?success=Operador desativado com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.redirect('/operators?error=Erro ao desativar operador');
  }
});

module.exports = router;

