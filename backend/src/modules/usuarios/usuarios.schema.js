const { z } = require("zod");

const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
const fullNameRegex =
  /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+(?:[\s\-'\.][a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+)*$/;

const createUsuarioSchema = z.object({
  username: z.string().min(3).max(30).regex(usernameRegex),
  email: z.string().email().max(100),
  fullName: z.string().min(2).max(100).regex(fullNameRegex),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "SELLER"]),
});

const updateUsuarioSchema = z.object({
  username: z.string().min(3).max(30).regex(usernameRegex),
  email: z.string().email().max(100),
  fullName: z.string().min(2).max(100).regex(fullNameRegex),
  role: z.enum(["ADMIN", "SELLER"]),
  password: z.string().min(6).optional(),
});

const updateStatusSchema = z.object({
  isActive: z.boolean(),
});

module.exports = {
  createUsuarioSchema,
  updateUsuarioSchema,
  updateStatusSchema,
};
