const express = require("express");
const authController = require("./auth.controller");
const { authenticate } = require("../../shared/middlewares/auth.middleware");

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", authenticate, authController.me);

// 👇 NUEVAS RUTAS
router.post("/recover", authController.recoverPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/register", authController.register);
module.exports = router;
