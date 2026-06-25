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

// Importar rutas
const authRoutes = require("./modules/auth/auth.routes");
const usuariosRoutes = require("./modules/usuarios/usuarios.routes");
const clientesRoutes = require("./modules/clientes/clientes.routes");
const productosRoutes = require("./modules/productos/productos.routes");
const ventasRoutes = require("./modules/ventas/ventas.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const inventarioRoutes = require("./modules/inventario/inventario.routes");
const reportesRoutes = require("./modules/reportes/reportes.routes");
const categoriasRoutes = require("./modules/categorias/categorias.routes");

// Rutas
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/usuarios", usuariosRoutes);
app.use("/api/v1/clientes", clientesRoutes);
app.use("/api/v1/productos", productosRoutes);
app.use("/api/v1/ventas", ventasRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/inventario", inventarioRoutes);
app.use("/api/v1/reportes", reportesRoutes);
app.use("/api/v1/categorias", categoriasRoutes);

// Ruta de salud
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ ok: true, message: "API Mueblería IGEN is running" });
});

// Middleware de errores
const { errorHandler } = require("./shared/middlewares/error.middleware");
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
