const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  
  // Relacionamentos
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  droneId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Drone', 
    required: true 
  },
  operatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Operator', 
    required: true 
  },
  
  // Campos obrigatórios MAPA (Portaria 298/2021, art. 10)
  dataHoraInicio: { type: Date, required: true },
  dataHoraTermino: { type: Date, required: true },
  coordenadasGeograficas: { type: String, required: true },
  culturaTratada: { type: String, required: true },
  areaTratada: { type: Number, required: true }, // hectares
  tipoAtividade: { 
    type: String, 
    enum: ['agrotoxico', 'fertilizante', 'inoculante', 'corretivo', 'semeadura', 'outros'],
    required: true 
  },
  marcaComercial: { type: String, required: true },
  volume: { type: Number, required: true },
  dosagemAplicada: { type: String, required: true },
  alturaVoo: { type: Number, required: true },
  
  // Dados meteorológicos
  meteorologia: {
    temperatura: { type: Number, required: true },
    umidadeRelativa: { type: Number, required: true },
    direcaoVento: { type: String, required: true },
    velocidadeVento: { type: Number, required: true }
  },
  
  // Relatório Operacional (Anexo XI)
  relatorioOperacional: {
    // Empresa (autopreenchido)
    contratante: { type: String },
    propriedade: { type: String },
    localizacao: { type: String },
    registroMAPA: { type: String },
    municipio: { type: String },
    uf: { type: String },
    cpfCnpj: { type: String },
    
    // Produto
    produto: { type: String },
    formulacao: { type: String },
    dosagem: { type: String },
    classeToxicologica: { type: String },
    adjuvante: { type: String },
    volume: { type: String }, // L ou kg/ha
    outros: { type: String },
    
    // Receituário Agronômico
    receituarioAgronomico: {
      numero: { type: String },
      dataEmissao: { type: Date }
    },
    
    // Parâmetros básicos
    parametrosBasicos: {
      temperaturaMax: { type: Number },
      temperaturaMin: { type: Number },
      umidadeRelativaMin: { type: Number },
      velocidadeVentoMax: { type: Number },
      equipamento: { type: String },
      modelo: { type: String },
      tipo: { type: String },
      angulo: { type: String },
      alturaVoo: { type: Number },
      larguraFaixa: { type: Number }
    },
    
    // Croqui
    croqui: { type: String }, // caminho do arquivo
    observacoes: { type: String },
    
    // Assinaturas
    assinaturas: {
      responsavelTecnico: {
        nome: { type: String },
        registro: { type: String },
        assinatura: { type: String } // caminho da imagem
      },
      aplicador: {
        nome: { type: String },
        registro: { type: String },
        assinatura: { type: String }
      }
    }
  },
  
  // Evidências
  evidencias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
});

applicationSchema.index({ companyId: 1 });
applicationSchema.index({ dataHoraInicio: -1 });
applicationSchema.index({ clientId: 1 });

module.exports = mongoose.model('Application', applicationSchema);

