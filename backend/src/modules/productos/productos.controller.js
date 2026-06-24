const productosService = require("./productos.service");
const { asyncHandler } = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/http-response");

const listar = asyncHandler(async (req, res) => {
  const { search, estado } = req.query;
  const data = await productosService.listarProductos(search, estado);
  return sendSuccess(res, data, "Listado de productos");
});

const crear = asyncHandler(async (req, res) => {
  const data = await productosService.crearProducto(req.body);
  return sendSuccess(res, data, "Producto creado", 201);
});

const actualizar = asyncHandler(async (req, res) => {
  const data = await productosService.actualizarProducto(
    Number(req.params.id),
    req.body,
  );
  return sendSuccess(res, data, "Producto actualizado");
});

const cambiarEstado = asyncHandler(async (req, res) => {
  const data = await productosService.cambiarEstado(
    Number(req.params.id),
    req.body,
  );
  return sendSuccess(res, data, "Estado del producto actualizado");
});

const eliminar = asyncHandler(async (req, res) => {
  const data = await productosService.eliminarProducto(Number(req.params.id));
  return sendSuccess(res, data, "Producto eliminado");
});

module.exports = { listar, crear, actualizar, cambiarEstado, eliminar };
