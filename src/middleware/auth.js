// Middleware para verificar se o usuário está autenticado
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Middleware para verificar se o onboarding foi completado
const requireOnboarding = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  
  if (!req.session.company || !req.session.company.onboardingCompleted) {
    return res.redirect('/onboarding');
  }
  
  next();
};

// Middleware para verificar roles
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        title: 'Acesso negado',
        message: 'Você não tem permissão para acessar esta página.'
      });
    }
    
    next();
  };
};

module.exports = {
  requireAuth,
  requireOnboarding,
  requireRole
};

