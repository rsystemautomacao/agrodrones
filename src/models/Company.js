const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  // Dados básicos
  razaoSocial: { type: String, required: true },
  nomeFantasia: { type: String },
  cnpj: { type: String, required: true, unique: true },
  inscricaoEstadual: { type: String },
  telefone: { type: String },
  email: { type: String, required: true },
  
  // Endereço (será preenchido no onboarding)
  logradouro: { type: String },
  numero: { type: String },
  complemento: { type: String },
  bairro: { type: String },
  cidade: { type: String },
  uf: { type: String, maxlength: 2 },
  cep: { type: String },
  
  // Registro e conformidade
  numeroRegistroMAPA: { type: String },
  responsavelTecnico: {
    nome: { type: String },
    crea: { type: String }
  },
  cursoCredencial: { type: String },
  observacoes: { type: String },
  
  // Serviços prestados
  servicosPrestados: [{
    type: String,
    enum: ['agrotoxicos', 'fertilizantes', 'inoculantes', 'corretivos', 'semeadura', 'outros']
  }],
  servicosOutros: { type: String },
  
  // Identidade visual
  logo: { type: String }, // caminho do arquivo
  
  // Configurações padrão
  configuracoes: {
    pontaPulverizacaoPadrao: { type: String },
    alturaVooPadrao: { type: Number },
    equipamentoPadrao: { type: String },
    modeloPadrao: { type: String },
    tipoPadrao: { type: String },
    anguloPadrao: { type: String },
    unidadesPadrao: { type: String, default: 'L/ha' },
    observacoesPadrao: { type: String }
  },
  
  // Onboarding
  onboardingCompleted: { type: Boolean, default: false },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

companySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Company', companySchema);

