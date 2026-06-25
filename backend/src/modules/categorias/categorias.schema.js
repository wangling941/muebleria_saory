const { z } = require("zod");

const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = { createCategorySchema, updateCategorySchema };
