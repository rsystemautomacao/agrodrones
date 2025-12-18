const express = require('express');
const router = express.Router();
const File = require('../models/File');
const path = require('path');
const fs = require('fs');
const { requireOnboarding } = require('../middleware/auth');

router.use(requireOnboarding);

// Download de arquivo
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      companyId: req.session.user.companyId
    });
    
    if (!file) {
      return res.status(404).send('Arquivo não encontrado');
    }
    
    // Normalizar o caminho do arquivo
    let filePath = file.path;
    if (!path.isAbsolute(filePath)) {
      filePath = path.join(__dirname, '../../', file.path);
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Arquivo não encontrado no servidor');
    }
    
    res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimeType);
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('Erro ao servir arquivo:', error);
    res.status(500).send('Erro ao servir arquivo');
  }
});

module.exports = router;

