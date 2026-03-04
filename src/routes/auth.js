const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
const { requireAuth } = require('../middleware/auth');

// Login - GET
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', {
    title: 'Login',
    error: null,
    success: req.query.success || null
  });
});

// Login - POST
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Email e senha são obrigatórios.',
        success: null
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate('companyId');

    if (!user) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Credenciais inválidas.',
        success: null
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Credenciais inválidas.',
        success: null
      });
    }

    // Gravar sessão
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

    // Aguardar salvamento da sessão antes de redirecionar
    req.session.save((err) => {
      if (err) {
        console.error('Erro ao salvar sessão no login:', err);
        return res.render('auth/login', {
          title: 'Login',
          error: 'Erro interno de sessão. Tente novamente.',
          success: null
        });
      }

      if (!user.companyId.onboardingCompleted) {
        return res.redirect('/onboarding');
      }

      res.redirect('/dashboard');
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.render('auth/login', {
      title: 'Login',
      error: 'Erro ao fazer login. Tente novamente.',
      success: null
    });
  }
});

// Registro - GET
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/register', { title: 'Registrar', error: null });
});

// Registro - POST
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

    // Limpar CNPJ
    const cnpjClean = cnpj.replace(/\D/g, '');

    if (cnpjClean.length !== 14) {
      return res.render('auth/register', {
        title: 'Registrar',
        error: 'CNPJ inválido. Deve conter 14 dígitos.'
      });
    }

    // Verificar se CNPJ já existe
    const existingCompany = await Company.findOne({ cnpj: cnpjClean });
    if (existingCompany) {
      return res.render('auth/register', {
        title: 'Registrar',
        error: `Este CNPJ já está cadastrado. Empresa: ${existingCompany.razaoSocial || 'N/A'}.`
      });
    }

    // Criar empresa
    const company = new Company({
      razaoSocial: companyName,
      cnpj: cnpjClean,
      email: email.toLowerCase(),
      onboardingCompleted: false
    });

    try {
      await company.save();
    } catch (saveError) {
      if (saveError.code === 11000 && saveError.keyPattern?.cnpj) {
        const confirmCompany = await Company.findOne({ cnpj: cnpjClean });
        return res.render('auth/register', {
          title: 'Registrar',
          error: confirmCompany
            ? `Este CNPJ já está cadastrado. Empresa: ${confirmCompany.razaoSocial || 'N/A'}.`
            : 'Erro ao cadastrar CNPJ. Execute: npm run fix-indexes'
        });
      }
      throw saveError;
    }

    // Criar usuário admin
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
      companyId: company._id
    });

    await user.save();

    // Gravar sessão
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

    // Aguardar salvamento da sessão antes de redirecionar
    req.session.save((err) => {
      if (err) {
        console.error('Erro ao salvar sessão no registro:', err);
        // Fallback: redireciona para login com mensagem de sucesso
        return res.redirect('/auth/login?success=Cadastro+realizado!+Faça+login.');
      }
      res.redirect('/onboarding');
    });
  } catch (error) {
    console.error('Erro no registro:', error);

    let errorMessage = 'Erro ao registrar. Tente novamente.';
    if (error.code === 11000) {
      if (error.keyPattern?.cnpj) errorMessage = 'Este CNPJ já está cadastrado.';
      else if (error.keyPattern?.email) errorMessage = 'Este email já está cadastrado.';
      else errorMessage = 'Já existe um cadastro com estes dados.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.render('auth/register', { title: 'Registrar', error: errorMessage });
  }
});

// Logout - POST
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Erro ao fazer logout:', err);
    res.redirect('/auth/login');
  });
});

// Logout - GET
router.get('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Erro ao fazer logout:', err);
    res.redirect('/auth/login');
  });
});

module.exports = router;
