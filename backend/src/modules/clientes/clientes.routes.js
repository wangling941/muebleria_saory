const express = require("express");
const clientesController = require("./clientes.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../../shared/middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  clientesController.listar,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  clientesController.crear,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  clientesController.actualizar,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  clientesController.eliminar,
);

module.exports = router;
