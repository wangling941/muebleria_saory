const { ZodError } = require("zod");
const bcrypt = require("bcryptjs");
const { signAccessToken } = require("../../config/jwt");
const { AppError } = require("../../shared/errors/AppError");
const authRepository = require("./auth.repository");
const { loginSchema } = require("./auth.schema");

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
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
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

async function me(userId) {
  const profile = await authRepository.findProfileById(userId);
  if (!profile || !profile.isActive) {
    throw new AppError("Usuario no encontrado o inactivo", 404);
  }
  return profile;
}

module.exports = { login, me };
