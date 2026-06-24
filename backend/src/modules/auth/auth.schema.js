const { z } = require("zod");

const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "El identificador debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

module.exports = { loginSchema };
