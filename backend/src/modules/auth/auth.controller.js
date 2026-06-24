const authService = require("./auth.service");
const { asyncHandler } = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/http-response");

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  return sendSuccess(res, data, "Login exitoso");
});

const me = asyncHandler(async (req, res) => {
  const data = await authService.me(req.user.sub);
  return sendSuccess(res, data, "Perfil autenticado");
});

module.exports = { login, me };
