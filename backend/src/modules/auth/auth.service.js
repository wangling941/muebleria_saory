const { ZodError } = require("zod");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { signAccessToken } = require("../../config/jwt");
const { AppError } = require("../../shared/errors/AppError");
const authRepository = require("./auth.repository");
const { loginSchema } = require("./auth.schema");
const { prisma } = require("../../config/database");
const { sendRecoveryEmail } = require("../../shared/utils/email");

// ---- LOGIN ----
async function login(payload) {
  let parsedData;
  try {
    parsedData = loginSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError("Payload de login inválido", 400, error.flatten());
    }
    throw error;
  }

  const user = await authRepository.findByIdentifier(parsedData.identifier);
  if (!user || !user.isActive) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const passwordIsValid = await bcrypt.compare(
    parsedData.password,
    user.passwordHash,
  );
  if (!passwordIsValid) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
    username: user.username,
    email: user.email,
  });

  return {
    tokenType: "Bearer",
    accessToken,
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      imageUrl: user.imageUrl,
    },
  };
}

// ---- OBTENER PERFIL ----
async function me(userId) {
  const profile = await authRepository.findProfileById(userId);
  if (!profile || !profile.isActive) {
    throw new AppError("Usuario no encontrado o inactivo", 404);
  }
  return profile;
}

// ---- SOLICITAR RECUPERACIÓN DE CONTRASEÑA ----
async function recoverPassword(email) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) {
    // Por seguridad, no revelamos si el usuario existe
    return {
      message: "Si el correo existe, recibirás un enlace de recuperación",
    };
  }

  // Eliminar tokens anteriores no usados del mismo usuario (opcional)
  await prisma.passwordReset.deleteMany({
    where: { userId: user.id, used: false },
  });

  // Generar token seguro
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  // Enviar correo (implementación abajo)
  await sendRecoveryEmail(user.email, token, user.fullName);

  return {
    message: "Si el correo existe, recibirás un enlace de recuperación",
  };
}

// ---- RESTABLECER CONTRASEÑA (usando el token) ----
async function resetPassword(token, newPassword) {
  // Buscar el token y validar
  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      token,
      used: false,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!resetRecord) {
    throw new AppError("Token inválido o expirado", 400);
  }

  // Hashear nueva contraseña
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Actualizar usuario
  await prisma.user.update({
    where: { id: resetRecord.userId },
    data: { passwordHash },
  });

  // Marcar token como usado
  await prisma.passwordReset.update({
    where: { id: resetRecord.id },
    data: { used: true },
  });

  return { message: "Contraseña actualizada correctamente" };
}

// ---- REGISTRAR NUEVO USUARIO ----
async function register(payload) {
  const { username, email, password, fullName, role = "SELLER" } = payload;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: email.toLowerCase() }] },
  });
  if (existing) {
    throw new AppError("El usuario o correo ya existe", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      role,
      isActive: true,
    },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
    },
  });

  return user;
}
module.exports = { login, me, recoverPassword, resetPassword, register };
