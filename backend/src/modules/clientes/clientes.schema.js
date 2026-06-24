const { z } = require("zod");

const dniRegex = /^\d{8}$/;
const phoneRegex = /^\d{9}$/;

const createClienteSchema = z.object({
  name: z.string().min(2).max(100),
  dni: z.string().regex(dniRegex, "DNI debe tener 8 dígitos"),
  phone: z
    .string()
    .regex(phoneRegex, "Teléfono debe tener 9 dígitos")
    .optional(),
  address: z.string().optional(),
});

const updateClienteSchema = createClienteSchema.partial();

module.exports = { createClienteSchema, updateClienteSchema };
