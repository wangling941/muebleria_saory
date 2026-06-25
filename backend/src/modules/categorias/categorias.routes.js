const express = require("express");
const categoriasController = require("./categorias.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../../shared/middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  categoriasController.listar,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  categoriasController.crear,
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  categoriasController.actualizar,
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  categoriasController.eliminar,
);

module.exports = router;
