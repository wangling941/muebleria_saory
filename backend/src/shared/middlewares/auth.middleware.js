const { verifyAccessToken } = require("../../config/jwt");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ ok: false, message: "Token de autenticación requerido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ ok: false, message: "Token inválido o expirado" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ ok: false, message: "No autenticado" });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ ok: false, message: "Permisos insuficientes" });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
