const express = require("express");
const ventasController = require("./ventas.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../../shared/middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  ventasController.listar,
);
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  ventasController.crear,
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "SELLER"),
  ventasController.obtener,
);

module.exports = router;
