const clientesService = require("./clientes.service");
const { asyncHandler } = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/http-response");

const listar = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const data = await clientesService.listarClientes(search);
  return sendSuccess(res, data, "Listado de clientes");
});

const crear = asyncHandler(async (req, res) => {
  const data = await clientesService.crearCliente(req.body);
  return sendSuccess(res, data, "Cliente creado", 201);
});

const actualizar = asyncHandler(async (req, res) => {
  const data = await clientesService.actualizarCliente(
    Number(req.params.id),
    req.body,
  );
  return sendSuccess(res, data, "Cliente actualizado");
});

const eliminar = asyncHandler(async (req, res) => {
  const data = await clientesService.eliminarCliente(Number(req.params.id));
  return sendSuccess(res, data, "Cliente eliminado");
});

module.exports = { listar, crear, actualizar, eliminar };
