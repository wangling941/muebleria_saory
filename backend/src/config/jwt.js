const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "muebleria_igen_secret";

function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signAccessToken, verifyAccessToken };
