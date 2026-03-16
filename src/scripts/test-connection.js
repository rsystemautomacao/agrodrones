require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔌 Tentando conectar ao MongoDB Atlas...\n');
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI não encontrada no arquivo .env');
      process.exit(1);
    }
    
    console.log('📍 URI:', uri.replace(/\/\/.*:.*@/, '//***:***@')); // Esconde senha
    console.log('');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conexão estabelecida com sucesso!\n');
    
    // Testar operação básica
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`📊 Coleções encontradas: ${collections.length}`);
    if (collections.length > 0) {
      console.log('Coleções:');
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    } else {
      console.log('ℹ️  Nenhuma coleção ainda (banco novo)');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro ao conectar:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Dica: Verifique se o usuário e senha estão corretos no .env');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Dica: Verifique se o cluster está "Running" no MongoDB Atlas');
      console.log('💡 Dica: Verifique se seu IP está na whitelist (Network Access)');
    } else if (error.message.includes('timed out')) {
      console.log('\n💡 Dica: O cluster pode estar ainda inicializando. Aguarde alguns minutos e tente novamente.');
    }
    
    process.exit(1);
  }
}

testConnection();
