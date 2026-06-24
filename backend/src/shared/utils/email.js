const nodemailer = require("nodemailer");

// Configuración del transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envía un correo de recuperación de contraseña
 */
async function sendRecoveryEmail(to, token, fullName = "Usuario") {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8100";
  const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0a5c2e;">Recuperación de contraseña</h2>
      <p>Hola <strong>${fullName}</strong>,</p>
      <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <p style="margin: 24px 0;">
        <a href="${resetLink}" 
           style="background-color: #0a5c2e; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 8px; font-weight: bold;">
          Restablecer contraseña
        </a>
      </p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p>El enlace expirará en <strong>1 hora</strong>.</p>
      <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e5e7eb;" />
      <p style="color: #6b7280; font-size: 0.85rem;">
        Mueblería IGEN - Especialistas en muebles metálicos
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"Mueblería IGEN" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: "Recuperación de contraseña - Mueblería IGEN",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Correo de recuperación enviado a ${to}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    // No lanzamos error para no revelar información sensible
    return { success: false, error: error.message };
  }
}

module.exports = { sendRecoveryEmail };
