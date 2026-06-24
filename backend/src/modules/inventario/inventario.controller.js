const inventarioService = require("./inventario.service");
const { asyncHandler } = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/http-response");

const resumen = asyncHandler(async (req, res) => {
  const data = await inventarioService.obtenerResumen();
  return sendSuccess(res, data, "Resumen de inventario");
});

const productosCriticos = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const data = await inventarioService.obtenerProductosCriticos(search);
  return sendSuccess(res, data, "Productos críticos");
});

const actualizarStock = asyncHandler(async (req, res) => {
  const data = await inventarioService.actualizarStock(
    Number(req.params.id),
    req.body,
  );
  return sendSuccess(res, data, "Stock actualizado");
});

module.exports = { resumen, productosCriticos, actualizarStock };
