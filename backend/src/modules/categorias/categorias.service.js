const { ZodError } = require("zod");
const { AppError } = require("../../shared/errors/AppError");
const categoriasRepository = require("./categorias.repository");
const { prisma } = require("../../config/database");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("./categorias.schema");

async function listarCategorias() {
  return categoriasRepository.findAll();
}

async function crearCategoria(payload) {
  try {
    const parsed = createCategorySchema.parse(payload);
    // Verificar si ya existe
    const existing = await categoriasRepository.findByName(parsed.name);
    if (existing) {
      throw new AppError("Ya existe una categoría con ese nombre", 409);
    }
    return categoriasRepository.create(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Payload inválido", 400, error.flatten());
    }
    throw error;
  }
}

async function actualizarCategoria(id, payload) {
  try {
    const parsed = updateCategorySchema.parse(payload);
    const category = await categoriasRepository.findById(id);
    if (!category) throw new AppError("Categoría no encontrada", 404);
    // Si cambia nombre, verificar duplicado
    if (parsed.name) {
      const existing = await categoriasRepository.findByName(parsed.name);
      if (existing && existing.id !== id) {
        throw new AppError("Ya existe otra categoría con ese nombre", 409);
      }
    }
    return categoriasRepository.update(id, parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Payload inválido", 400, error.flatten());
    }
    throw error;
  }
}

async function eliminarCategoria(id) {
  const category = await categoriasRepository.findById(id);
  if (!category) throw new AppError("Categoría no encontrada", 404);
  // Verificar si tiene productos asociados
  const productsCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productsCount > 0) {
    throw new AppError(
      "No se puede eliminar la categoría porque tiene productos asociados",
      400,
    );
  }
  return categoriasRepository.remove(id);
}

module.exports = {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
