// src/utils/email.ts
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send email using Ethereal (no credentials needed)
 */
export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    // Generate a test account (no real email needed)
    const testAccount = await nodemailer.createTestAccount();

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      tls: {
        rejectUnauthorized: false, // ⚡ ignore self-signed cert
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"Walkwel 3PL" <${testAccount.user}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent!");
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw err;
  }
};
