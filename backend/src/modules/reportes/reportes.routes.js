const express = require("express");
const reportesController = require("./reportes.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../../shared/middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/resumen",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  reportesController.resumen,
);
router.get(
  "/ventas-por-dia",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  reportesController.ventasPorDia,
);
router.post(
  "/exportar",
  authenticate,
  authorizeRoles("ADMIN"),
  reportesController.exportarReporte,
);

module.exports = router;
