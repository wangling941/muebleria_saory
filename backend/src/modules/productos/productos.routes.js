const express = require("express");
const productosController = require("./productos.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../../shared/middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  productosController.listar,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  productosController.crear,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  productosController.actualizar,
);
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("ADMIN"),
  productosController.cambiarEstado,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  productosController.eliminar,
);

module.exports = router;
