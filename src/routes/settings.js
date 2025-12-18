const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { requireOnboarding, requireRole } = require('../middleware/auth');

router.use(requireOnboarding);
router.use(requireRole('admin'));

// Página de configurações
router.get('/', async (req, res) => {
  try {
    const company = await Company.findById(req.session.user.companyId);
    res.render('settings/index', {
      title: 'Configurações',
      company,
      query: req.query
    });
  } catch (error) {
    console.error('Erro:', error);
    res.render('error', { title: 'Erro', message: 'Erro ao carregar configurações.' });
  }
});

// Atualizar configurações
router.post('/', async (req, res) => {
  try {
    const {
      pontaPulverizacaoPadrao,
      alturaVooPadrao,
      equipamentoPadrao,
      modeloPadrao,
      tipoPadrao,
      anguloPadrao,
      unidadesPadrao,
      observacoesPadrao
    } = req.body;
    
    await Company.findByIdAndUpdate(req.session.user.companyId, {
      configuracoes: {
        pontaPulverizacaoPadrao: pontaPulverizacaoPadrao || '',
        alturaVooPadrao: alturaVooPadrao ? parseFloat(alturaVooPadrao) : null,
        equipamentoPadrao: equipamentoPadrao || '',
        modeloPadrao: modeloPadrao || '',
        tipoPadrao: tipoPadrao || '',
        anguloPadrao: anguloPadrao || '',
        unidadesPadrao: unidadesPadrao || 'L/ha',
        observacoesPadrao: observacoesPadrao || ''
      }
    });
    
    res.redirect('/settings?success=Configurações atualizadas com sucesso');
  } catch (error) {
    console.error('Erro:', error);
    res.redirect('/settings?error=Erro ao atualizar configurações');
  }
});

module.exports = router;

