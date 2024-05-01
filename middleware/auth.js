const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'Token não fornecido, acesso não autorizado' });
  }

  try {
    const decoded = jwt.verify(token, 'segredo');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido, acesso não autorizado' });
  }
}

module.exports = autenticarToken;
