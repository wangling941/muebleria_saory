const express = require("express");
const inventarioController = require("./inventario.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../../shared/middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/resumen",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  inventarioController.resumen,
);
router.get(
  "/productos-criticos",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  inventarioController.productosCriticos,
);
router.patch(
  "/:id/stock",
  authenticate,
  authorizeRoles("ADMIN"),
  inventarioController.actualizarStock,
);

module.exports = router;
