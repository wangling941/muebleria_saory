const { z } = require("zod");

const ventaItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().int().positive(),
});

const createVentaSchema = z.object({
  customerId: z.coerce.number().int().positive(),
  items: z.array(ventaItemSchema).min(1),
  paymentMethod: z.enum(["CASH", "CARD", "TRANSFER"]),
  discount: z.coerce.number().min(0).default(0),
});

module.exports = { createVentaSchema };
