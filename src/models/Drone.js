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

  // Controle de manutenção e horas de voo
  manutencao: {
    horasVooTotal: { type: Number, default: 0 },          // horas acumuladas
    horasUltimaManutencao: { type: Number, default: 0 },  // horas no momento da última manutenção
    dataUltimaManutencao: { type: Date },                 // data da última manutenção
    intervaloManutencao: { type: Number, default: 50 },   // revisão a cada N horas de voo
    proximaManutencaoData: { type: Date },                // data prevista para próxima revisão
    historicoManutencoes: [{
      data: { type: Date },
      horasVoo: { type: Number },
      descricao: { type: String },
      tecnico: { type: String }
    }]
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

droneSchema.index({ companyId: 1 });

module.exports = mongoose.model('Drone', droneSchema);
