const { z } = require("zod");

const createProductoSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  categoryId: z.coerce.number().int().optional(),
});

const updateProductoSchema = createProductoSchema.partial();
const updateStatusSchema = z.object({ isActive: z.boolean() });

module.exports = {
  createProductoSchema,
  updateProductoSchema,
  updateStatusSchema,
};
