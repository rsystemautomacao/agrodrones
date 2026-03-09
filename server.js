require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrodroneops';

// Extrai o nome do banco a partir da URI (ex: "agrodrones" ou "agrodroneops")
const MONGODB_DBNAME = MONGODB_URI.split('/').pop().split('?')[0] || 'agrodroneops';

// ─────────────────────────────────────────────────────────────────────────────
// CONEXÃO ÚNICA ao MongoDB — compartilhada entre Mongoose E MongoStore.
// Isso resolve o race condition de cold start no Vercel serverless:
// sem isso, cada instância criava 2 conexões independentes e a sessão
// não era encontrada pelo MongoStore antes do middleware de autenticação rodar.
// ─────────────────────────────────────────────────────────────────────────────
const clientPromise = mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB conectado');
    return mongoose.connection.getClient(); // retorna o MongoClient subjacente
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar MongoDB:', err);
    throw err;
  });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de sessão
// Usa a MESMA conexão do Mongoose via clientPromise,
// eliminando o problema de duas conexões separadas no Vercel.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-this-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise, // ← conexão compartilhada com o Mongoose
      dbName: MONGODB_DBNAME,
      ttl: 14 * 24 * 60 * 60, // 14 dias
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 dias
    },
  })
);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para tornar sessão e caminho atual disponíveis nas views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.company = req.session.company || null;
  res.locals.currentPath =
    req.path === '/' ? req.originalUrl : '/' + req.originalUrl.split('/')[1];
  next();
});

// Rotas
const authRoutes = require('./src/routes/auth');
const onboardingRoutes = require('./src/routes/onboarding');
const dashboardRoutes = require('./src/routes/dashboard');
const clientRoutes = require('./src/routes/clients');
const droneRoutes = require('./src/routes/drones');
const operatorRoutes = require('./src/routes/operators');
const applicationRoutes = require('./src/routes/applications');
const reportRoutes = require('./src/routes/reports');
const fileRoutes = require('./src/routes/files');
const settingsRoutes = require('./src/routes/settings');

app.use('/auth', authRoutes);
app.use('/onboarding', onboardingRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/clients', clientRoutes);
app.use('/drones', droneRoutes);
app.use('/operators', operatorRoutes);
app.use('/applications', applicationRoutes);
app.use('/reports', reportRoutes);
app.use('/files', fileRoutes);
app.use('/settings', settingsRoutes);

// Rota raiz
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/auth/login');
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Página não encontrada',
    message: 'A página que você procura não existe.',
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).render('error', {
    title: 'Erro interno',
    message: err.message || 'Ocorreu um erro inesperado.',
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CRÍTICO PARA VERCEL: exportar o app para que o runtime @vercel/node
// use o Express diretamente como handler serverless.
// Sem isso, cada requisição no Vercel sofria cold start com reconexão
// ao MongoDB, causando perda de sessão após o redirect do login.
// ─────────────────────────────────────────────────────────────────────────────
module.exports = app;

// Iniciar servidor HTTP apenas em desenvolvimento local (não no Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}
