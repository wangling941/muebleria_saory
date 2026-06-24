const express = require("express");
const dashboardController = require("./dashboard.controller");
const {
  authenticate,
  authorizeRoles,
} = require("../../shared/middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  dashboardController.obtenerDashboard,
);

module.exports = router;
