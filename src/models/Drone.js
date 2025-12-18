const mongoose = require('mongoose');

const droneSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  marcaModelo: { type: String, required: true },
  identificacaoRegistro: { type: String, required: true }, // ANAC
  capacidadeTanque: { type: Number }, // em litros
  observacoes: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

droneSchema.index({ companyId: 1 });

module.exports = mongoose.model('Drone', droneSchema);

