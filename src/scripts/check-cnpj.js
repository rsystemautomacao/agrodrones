require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('../models/Company');

async function checkCNPJ() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrodrones', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado ao MongoDB\n');
    
    // CNPJ a verificar (do exemplo da mensagem de erro)
    const cnpjToCheck = '62490898000180';
    
    console.log(`🔍 Verificando CNPJ: ${cnpjToCheck}\n`);
    
    // Buscar todas as empresas com esse CNPJ
    const companies = await Company.find({ cnpj: cnpjToCheck });
    
    console.log(`📊 Empresas encontradas: ${companies.length}`);
    
    if (companies.length > 0) {
      console.log('\n📋 Detalhes das empresas:');
      companies.forEach((company, index) => {
        console.log(`\n${index + 1}. ID: ${company._id}`);
        console.log(`   Razão Social: ${company.razaoSocial}`);
        console.log(`   CNPJ: ${company.cnpj}`);
        console.log(`   Email: ${company.email}`);
        console.log(`   Criado em: ${company.createdAt}`);
      });
      
      console.log('\n⚠️  Para remover todas as empresas com este CNPJ, descomente as linhas abaixo no código:');
      console.log('// await Company.deleteMany({ cnpj: cnpjToCheck });');
      console.log('// console.log("✅ Empresas removidas");');
    } else {
      console.log('✅ Nenhuma empresa encontrada com este CNPJ');
    }
    
    // Verificar todos os CNPJs duplicados
    console.log('\n🔍 Verificando CNPJs duplicados...\n');
    const duplicates = await Company.aggregate([
      {
        $group: {
          _id: '$cnpj',
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);
    
    if (duplicates.length > 0) {
      console.log(`⚠️  Encontrados ${duplicates.length} CNPJs duplicados:\n`);
      duplicates.forEach((dup, index) => {
        console.log(`${index + 1}. CNPJ: ${dup._id}`);
        console.log(`   Ocorrências: ${dup.count}`);
        console.log(`   IDs: ${dup.ids.join(', ')}`);
      });
    } else {
      console.log('✅ Nenhum CNPJ duplicado encontrado');
    }
    
    // Listar todos os índices da coleção
    console.log('\n📑 Índices da coleção companies:');
    const indexes = await Company.collection.getIndexes();
    console.log(JSON.stringify(indexes, null, 2));
    
    await mongoose.connection.close();
    console.log('\n✅ Verificação concluída');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

// Executar verificação
checkCNPJ();

