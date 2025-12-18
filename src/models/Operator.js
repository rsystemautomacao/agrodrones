const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  nome: { type: String, required: true },
  funcao: { 
    type: String, 
    enum: ['piloto_remoto', 'aplicador', 'aux_aplicacao', 'rt', 'admin'],
    required: true 
  },
  documentoRegistro: { type: String },
  telefone: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

operatorSchema.index({ companyId: 1 });

module.exports = mongoose.model('Operator', operatorSchema);

