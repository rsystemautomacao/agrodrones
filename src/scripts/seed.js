require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('../models/Company');
const User = require('../models/User');

async function seed() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrodroneops', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado ao MongoDB');
    
    // Verificar se já existe empresa de exemplo
    const existingCompany = await Company.findOne({ cnpj: '12345678000190' });
    if (existingCompany) {
      console.log('⚠️  Empresa de exemplo já existe. Pulando seed...');
      await mongoose.connection.close();
      return;
    }
    
    // Criar empresa de exemplo
    const company = new Company({
      razaoSocial: 'Agro Drones Exemplo Ltda',
      nomeFantasia: 'Agro Drones Exemplo',
      cnpj: '12345678000190',
      inscricaoEstadual: '123456789',
      telefone: '(11) 99999-9999',
      email: 'admin@example.com',
      logradouro: 'Rua Exemplo',
      numero: '123',
      complemento: 'Sala 101',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01000000',
      numeroRegistroMAPA: 'REG-MAPA-12345',
      responsavelTecnico: {
        nome: 'Dr. João Silva',
        crea: '12345-D/SP'
      },
      cursoCredencial: 'Curso de Aplicação Aérea com Drones - MAPA',
      servicosPrestados: ['agrotoxicos', 'fertilizantes'],
      configuracoes: {
        pontaPulverizacaoPadrao: 'Tipo Cone',
        alturaVooPadrao: 3,
        equipamentoPadrao: 'Sistema de Pulverização',
        modeloPadrao: 'DJI Agras T30',
        tipoPadrao: 'Atomizador',
        anguloPadrao: '45°',
        unidadesPadrao: 'L/ha',
        observacoesPadrao: 'Aplicação realizada conforme boas práticas agrícolas.'
      },
      onboardingCompleted: true
    });
    
    await company.save();
    console.log('✅ Empresa criada:', company.razaoSocial);
    
    // Criar usuário admin
    const user = new User({
      name: 'Administrador',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      companyId: company._id
    });
    
    await user.save();
    console.log('✅ Usuário admin criado');
    console.log('   Email: admin@example.com');
    console.log('   Senha: admin123');
    
    console.log('\n✅ Seed concluído com sucesso!');
    console.log('   Você pode fazer login com:');
    console.log('   Email: admin@example.com');
    console.log('   Senha: admin123\n');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();

