const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  nomeRazaoSocial: { type: String, required: true },
  cpfCnpj: { type: String },
  propriedadeFazenda: { type: String },
  enderecoLocalizacao: { type: String },
  municipio: { type: String, required: true },
  uf: { type: String, required: true, maxlength: 2 },
  observacoes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

clientSchema.index({ companyId: 1 });

module.exports = mongoose.model('Client', clientSchema);

