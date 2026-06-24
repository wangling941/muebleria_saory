const dashboardService = require("./dashboard.service");
const { asyncHandler } = require("../../shared/utils/async-handler");
const { sendSuccess } = require("../../shared/utils/http-response");

const obtenerDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.obtenerDashboard();
  return sendSuccess(res, data, "Dashboard");
});

module.exports = { obtenerDashboard };
