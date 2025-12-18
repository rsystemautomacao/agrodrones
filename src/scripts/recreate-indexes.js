require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('../models/Company');

async function recreateIndexes() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrodrones', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado ao MongoDB\n');
    
    // Verificar se a coleção existe
    const collections = await mongoose.connection.db.listCollections().toArray();
    const companiesExists = collections.some(col => col.name === 'companies');
    
    if (companiesExists) {
      console.log('📋 Coleção "companies" existe\n');
      
      // Remover índices antigos (exceto _id)
      try {
        console.log('🗑️  Removendo índices antigos...');
        await Company.collection.dropIndexes();
        console.log('✅ Índices removidos\n');
      } catch (error) {
        if (error.code === 27 || error.codeName === 'IndexNotFound') {
          console.log('ℹ️  Nenhum índice para remover\n');
        } else {
          console.log('⚠️  Erro ao remover índices:', error.message, '\n');
        }
      }
    } else {
      console.log('ℹ️  Coleção "companies" não existe ainda\n');
    }
    
    // Recriar índices usando o schema do Mongoose
    console.log('🔨 Criando índices a partir do schema...');
    
    // Sincronizar índices do modelo
    await Company.createIndexes();
    console.log('✅ Índices recriados com sucesso\n');
    
    // Listar índices criados
    try {
      const indexes = await Company.collection.getIndexes();
      console.log('📑 Índices atuais:');
      console.log(JSON.stringify(indexes, null, 2));
    } catch (error) {
      console.log('⚠️  Não foi possível listar índices:', error.message);
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Processo concluído!');
    console.log('💡 Agora você pode tentar fazer o cadastro novamente.');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

// Executar
recreateIndexes();

