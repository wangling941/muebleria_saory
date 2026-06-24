const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de salud
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ ok: true, message: "API Mueblería IGEN is running" });
});

// Middleware de errores (básico)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, message: "Error interno del servidor" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
