const { ZodError } = require("zod");
const { AppError } = require("../../shared/errors/AppError");
const productosRepository = require("./productos.repository");
const {
  createProductoSchema,
  updateProductoSchema,
  updateStatusSchema,
} = require("./productos.schema");

async function listarProductos(search = "", estado) {
  return productosRepository.findAll(search, estado);
}

async function crearProducto(payload) {
  try {
    const parsed = createProductoSchema.parse(payload);
    return productosRepository.create(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Payload de producto inválido", 400, error.flatten());
    }
    throw error;
  }
}

async function actualizarProducto(id, payload) {
  try {
    const parsed = updateProductoSchema.parse(payload);
    const product = await productosRepository.findById(id);
    if (!product) throw new AppError("Producto no encontrado", 404);
    return productosRepository.update(id, parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(
        "Payload de actualización inválido",
        400,
        error.flatten(),
      );
    }
    throw error;
  }
}

async function cambiarEstado(id, payload) {
  try {
    const parsed = updateStatusSchema.parse(payload);
    return productosRepository.updateStatus(id, parsed.isActive);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Payload de estado inválido", 400, error.flatten());
    }
    throw error;
  }
}

async function eliminarProducto(id) {
  const product = await productosRepository.findById(id);
  if (!product) throw new AppError("Producto no encontrado", 404);
  return productosRepository.remove(id);
}

module.exports = {
  listarProductos,
  crearProducto,
  actualizarProducto,
  cambiarEstado,
  eliminarProducto,
};
