const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
const { requireAuth } = require('../middleware/auth');

// Login
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { title: 'Login', error: null });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render('auth/login', { 
        title: 'Login', 
        error: 'Email e senha são obrigatórios.' 
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() }).populate('companyId');
    
    if (!user) {
      return res.render('auth/login', { 
        title: 'Login', 
        error: 'Credenciais inválidas.' 
      });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.render('auth/login', { 
        title: 'Login', 
        error: 'Credenciais inválidas.' 
      });
    }
    
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId._id.toString()
    };
    
    req.session.company = {
      id: user.companyId._id.toString(),
      name: user.companyId.razaoSocial,
      onboardingCompleted: user.companyId.onboardingCompleted
    };
    
    if (!user.companyId.onboardingCompleted) {
      return res.redirect('/onboarding');
    }
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Erro no login:', error);
    res.render('auth/login', { 
      title: 'Login', 
      error: 'Erro ao fazer login. Tente novamente.' 
    });
  }
});

// Registro
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/register', { title: 'Registrar', error: null });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, companyName, cnpj } = req.body;
    
    if (!name || !email || !password || !passwordConfirm || !companyName || !cnpj) {
      return res.render('auth/register', { 
        title: 'Registrar', 
        error: 'Todos os campos são obrigatórios.' 
      });
    }
    
    if (password !== passwordConfirm) {
      return res.render('auth/register', { 
        title: 'Registrar', 
        error: 'As senhas não coincidem.' 
      });
    }
    
    if (password.length < 6) {
      return res.render('auth/register', { 
        title: 'Registrar', 
        error: 'A senha deve ter pelo menos 6 caracteres.' 
      });
    }
    
    // Verificar se email já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render('auth/register', { 
        title: 'Registrar', 
        error: 'Este email já está cadastrado.' 
      });
    }
    
    // Limpar CNPJ (remover caracteres não numéricos)
    const cnpjClean = cnpj.replace(/\D/g, '');
    
    // Validar se o CNPJ tem 14 dígitos
    if (cnpjClean.length !== 14) {
      return res.render('auth/register', { 
        title: 'Registrar', 
        error: 'CNPJ inválido. Deve conter 14 dígitos.' 
      });
    }
    
    // Verificar se CNPJ já existe
    const existingCompany = await Company.findOne({ cnpj: cnpjClean.trim() });
    
    if (existingCompany) {
      console.log('⚠️ CNPJ já existe no banco:', {
        cnpj: cnpjClean,
        empresaId: existingCompany._id,
        razaoSocial: existingCompany.razaoSocial,
        email: existingCompany.email
      });
      return res.render('auth/register', { 
        title: 'Registrar', 
        error: `Este CNPJ já está cadastrado no sistema. Empresa: ${existingCompany.razaoSocial || 'N/A'}. Se você acabou de excluir, aguarde alguns segundos ou verifique o banco de dados.` 
      });
    }
    
    // Criar empresa (endereço será preenchido no onboarding)
    const company = new Company({
      razaoSocial: companyName,
      cnpj: cnpjClean,
      email: email.toLowerCase(),
      onboardingCompleted: false
    });
    
    await company.save();
    
    // Criar usuário admin
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      companyId: company._id
    });
    
    await user.save();
    
    // Definir sessão
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: company._id.toString()
    };
    
    req.session.company = {
      id: company._id.toString(),
      name: company.razaoSocial,
      onboardingCompleted: false
    };
    
    res.redirect('/onboarding');
  } catch (error) {
    console.error('Erro no registro:', error);
    console.error('Detalhes do erro:', {
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue,
      message: error.message
    });
    
    // Tratar erros específicos do MongoDB
    let errorMessage = 'Erro ao registrar. Tente novamente.';
    
    if (error.code === 11000) {
      // Erro de duplicação (chave única)
      if (error.keyPattern && error.keyPattern.cnpj) {
        errorMessage = 'Este CNPJ já está cadastrado no sistema. Verifique se não há registros duplicados no banco de dados.';
      } else if (error.keyPattern && error.keyPattern.email) {
        errorMessage = 'Este email já está cadastrado.';
      } else {
        errorMessage = 'Já existe um cadastro com estes dados.';
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.render('auth/register', { 
      title: 'Registrar', 
      error: errorMessage
    });
  }
});

// Logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
    }
    res.redirect('/auth/login');
  });
});

router.get('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;

