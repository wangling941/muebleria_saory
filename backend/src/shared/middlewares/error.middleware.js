const { AppError } = require("../errors/AppError");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }
  return res.status(500).json({
    ok: false,
    message: "Error interno del servidor",
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
};

module.exports = { errorHandler, notFound };
