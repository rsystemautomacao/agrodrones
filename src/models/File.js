const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  filename: { type: String, required: true }, // nome único salvo
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true }, // caminho completo
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  applicationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Application' 
  },
  category: { 
    type: String, 
    enum: ['evidencia', 'croqui', 'assinatura', 'logo', 'outro'] 
  }
});

fileSchema.index({ companyId: 1 });
fileSchema.index({ applicationId: 1 });

module.exports = mongoose.model('File', fileSchema);

