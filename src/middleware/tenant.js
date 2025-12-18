// Middleware para garantir que todas as queries sejam filtradas por companyId
const setTenant = (req, res, next) => {
  if (req.session.user && req.session.user.companyId) {
    req.companyId = req.session.user.companyId;
  }
  next();
};

module.exports = {
  setTenant
};

