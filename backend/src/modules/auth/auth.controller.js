const authService = require("./auth.service");
const { asyncHandler } = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/http-response");
const { AppError } = require("../../shared/errors/AppError");

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  return sendSuccess(res, data, "Login exitoso");
});

const me = asyncHandler(async (req, res) => {
  const data = await authService.me(req.user.sub);
  return sendSuccess(res, data, "Perfil autenticado");
});

const recoverPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError("El correo electrónico es requerido", 400);
  const data = await authService.recoverPassword(email);
  return sendSuccess(res, data, "Correo enviado");
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    throw new AppError("Token y nueva contraseña son requeridos", 400);
  if (newPassword.length < 6)
    throw new AppError("La contraseña debe tener al menos 6 caracteres", 400);
  const data = await authService.resetPassword(token, newPassword);
  return sendSuccess(res, data, "Contraseña restablecida");
});

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  return sendSuccess(res, data, "Usuario registrado", 201);
});

// ✅ AGREGADO register
module.exports = { login, me, recoverPassword, resetPassword, register };
