const usuariosService = require("./usuarios.service");
const { asyncHandler } = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/http-response");

const listar = asyncHandler(async (req, res) => {
  const data = await usuariosService.listarUsuarios();
  return sendSuccess(res, data, "Listado de usuarios");
});

const crear = asyncHandler(async (req, res) => {
  const data = await usuariosService.crearUsuario(req.body);
  return sendSuccess(res, data, "Usuario creado", 201);
});

const actualizar = asyncHandler(async (req, res) => {
  const data = await usuariosService.actualizarUsuario(
    Number(req.params.id),
    req.body,
  );
  return sendSuccess(res, data, "Usuario actualizado");
});

const cambiarEstado = asyncHandler(async (req, res) => {
  const data = await usuariosService.cambiarEstado(
    Number(req.params.id),
    req.body,
  );
  return sendSuccess(res, data, "Estado de usuario actualizado");
});

const eliminar = asyncHandler(async (req, res) => {
  const data = await usuariosService.eliminarUsuario(Number(req.params.id));
  return sendSuccess(res, data, "Usuario eliminado permanentemente");
});

module.exports = {
  listar,
  crear,
  actualizar,
  cambiarEstado,
  eliminar,
};
