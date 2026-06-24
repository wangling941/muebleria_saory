const { ZodError } = require("zod");
const bcrypt = require("bcryptjs");
const { AppError } = require("../../shared/errors/AppError");
const usuariosRepository = require("./usuarios.repository");
const {
  createUsuarioSchema,
  updateUsuarioSchema,
  updateStatusSchema,
} = require("./usuarios.schema");

async function listarUsuarios() {
  return usuariosRepository.findAll();
}

async function crearUsuario(payload) {
  try {
    const parsed = createUsuarioSchema.parse(payload);
    const existing = await usuariosRepository.findByUsernameOrEmail(
      parsed.username,
      parsed.email,
    );
    if (existing) {
      throw new AppError("Ya existe un usuario con ese username o email", 409);
    }
    const passwordHash = await bcrypt.hash(parsed.password, 10);
    return usuariosRepository.create({
      username: parsed.username,
      email: parsed.email.toLowerCase(),
      fullName: parsed.fullName,
      passwordHash,
      role: parsed.role,
      isActive: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Payload de usuario inválido", 400, error.flatten());
    }
    throw error;
  }
}

async function actualizarUsuario(id, payload) {
  try {
    const parsed = updateUsuarioSchema.parse(payload);
    const user = await usuariosRepository.findById(id);
    if (!user) throw new AppError("Usuario no encontrado", 404);
    const conflict = await usuariosRepository.findByUsernameOrEmail(
      parsed.username,
      parsed.email,
      id,
    );
    if (conflict)
      throw new AppError(
        "Ya existe otro usuario con ese username o email",
        409,
      );
    const updateData = {
      username: parsed.username,
      email: parsed.email.toLowerCase(),
      fullName: parsed.fullName,
      role: parsed.role,
    };
    if (parsed.password) {
      updateData.passwordHash = await bcrypt.hash(parsed.password, 10);
    }
    return usuariosRepository.updateUser(id, updateData);
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
    return usuariosRepository.updateStatus(id, parsed.isActive);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Payload de estado inválido", 400, error.flatten());
    }
    throw error;
  }
}

async function eliminarUsuario(id) {
  const user = await usuariosRepository.findById(id);
  if (!user) throw new AppError("Usuario no encontrado", 404);
  return usuariosRepository.deleteUser(id);
}

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstado,
  eliminarUsuario,
};
