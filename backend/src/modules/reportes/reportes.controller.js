const reportesService = require("./reportes.service");
const { asyncHandler } = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/http-response");

const resumen = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const data = await reportesService.obtenerReporte({ from, to });
  return sendSuccess(res, data, "Reporte general");
});

const ventasPorDia = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const data = await reportesService.obtenerVentasPorDia({ from, to });
  return sendSuccess(res, data, "Ventas por día");
});

const exportarReporte = asyncHandler(async (req, res) => {
  // Aquí podrías generar un CSV o PDF
  return sendSuccess(res, null, "Reporte exportado");
});

module.exports = { resumen, ventasPorDia, exportarReporte };
