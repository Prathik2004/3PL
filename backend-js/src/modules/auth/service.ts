import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../../models/user";
import { transporter } from "../../config/mailer";
import { UserRole } from "../../types";

const generateShortToken = (): string =>
  crypto.randomBytes(4).toString("hex"); // 8 characters

export const createUserByAdmin = async (
  name: string,
  email: string,
  role: UserRole
) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const randomInitialPassword = crypto.randomBytes(16).toString("hex");
  const hashedPassword = await bcrypt.hash(randomInitialPassword, 10);
  const resetToken = generateShortToken();

  const user = await User.create({
    name,
    email,
    password_hash: hashedPassword,
    role,
    mustResetPassword: true,
    resetToken,
    resetTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;
  console.log(`NEW RESET LINK GENERATED for ${email}: ${resetLink}`);
  console.log(`Sending account creation email to: ${email}...`);
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Walkwel 3PL - Account Created",
      html: `
        <h3>Your account has been created</h3>
        <p>Your account has been successfully created on the Walkwel 3PL platform.</p>
        <hr/>
        <p>To set your password and access your account, please click the link below:</p>
        <p><a href="${resetLink}">Reset Password Link</a></p>
        <p>This link will expire in 24 hours.</p>
      `,
    });
    console.log(` Email sent successfully: ${info.messageId}`);
  } catch (mailError) {
    console.error(" Failed to send email:", mailError);
    throw new Error("User created but failed to send email. Please check SMTP settings.");
  }

  return user;
};

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User with this email does not exist");

  const resetToken = generateShortToken();
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;
  console.log(` NEW RESET LINK GENERATED for ${email}: ${resetLink}`);
  console.log(`Sending password reset email to: ${email}...`);
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Walkwel 3PL - Password Reset",
      html: `
        <h3>Password Reset Request</h3>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
    console.log(` Reset email sent: ${info.messageId}`);
  } catch (mailError) {
    console.error(" Failed to send reset email:", mailError);
    throw new Error("Failed to send reset email. Please try again later.");
  }
};

export const refreshAccessToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as { id: string };

  const user = await User.findOne({ userId: decoded.id });

  if (!user || user.refreshToken !== token) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = jwt.sign(
    { id: user.userId, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return { accessToken: newAccessToken };
};

export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  console.log(`Attempting password reset with short token: ${token}`);
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  user.password_hash = await bcrypt.hash(newPassword, 10);
  user.mustResetPassword = false;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();
};



export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  if (user.mustResetPassword) {
    throw new Error("Please reset your password before login");
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");

  const accessToken = jwt.sign(
    { id: user.userId, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};