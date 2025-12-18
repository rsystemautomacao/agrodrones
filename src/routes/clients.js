const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { requireOnboarding } = require('../middleware/auth');

router.use(requireOnboarding);

// Listar clientes
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find({ companyId: req.session.user.companyId })
      .sort({ nomeRazaoSocial: 1 });
    res.render('clients/index', { title: 'Clientes', clients, query: req.query });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar clientes.' });
  }
});

// Formulário de novo cliente
router.get('/new', (req, res) => {
  res.render('clients/form', { title: 'Novo Cliente', client: null });
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

