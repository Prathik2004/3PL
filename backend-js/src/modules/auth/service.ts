import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../../models/user";
import { transporter } from "../../config/mailer";
import { UserRole } from "../../types";

// Helper to handle the "any" cast to bypass the Query type error
const UserAny = User as any;

const generateShortToken = (): string =>
  crypto.randomBytes(4).toString("hex");

export const createUserByAdmin = async (
  name: string,
  email: string,
  role: UserRole
) => {
  // Use explicit filter
  const existing = await UserAny.findOne({ email: email });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);
  const resetToken = generateShortToken();

  const user = await UserAny.create({
    name,
    email,
    password_hash: hashedPassword,
    role,
    mustResetPassword: true,
    resetToken,
    resetTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

  console.log(`Sending account creation email to: ${email}...`);
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Walkwel 3PL - Account Created",
      html: `<h3>Your account has been created</h3><p><a href="${resetLink}">Reset Password Link</a></p>`,
    });
  } catch (mailError) {
    console.error("Failed to send email:", mailError);
  }

  return user;
};

export const requestPasswordReset = async (email: string) => {
  const user = await UserAny.findOne({ email });
  if (!user) throw new Error("User with this email does not exist");

  const resetToken = generateShortToken();
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5000";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Walkwel 3PL - Password Reset",
      html: `<p>Reset Link: <a href="${resetLink}">${resetLink}</a></p>`,
    });
  } catch (mailError) {
    throw new Error("Failed to send reset email.");
  }
};

export const refreshAccessToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as { id: string };

  // Logic Check: Ensure your model uses 'userId' as a field, 
  // otherwise use '_id: decoded.id'
  const user = await UserAny.findOne({ userId: decoded.id });

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

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await UserAny.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) throw new Error("Invalid or expired reset token");

  user.password_hash = await bcrypt.hash(newPassword, 10);
  user.mustResetPassword = false;
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password_hash");
  if (!user) throw new Error("Invalid credentials");

  // Use .get() to ensure we bypass any TypeScript/Mongoose getter confusion
  const dbHash = user.get('password_hash');

  console.log("Verified Hash from .get():", !!dbHash);

  if (user.mustResetPassword) {
    throw new Error("Please reset your password before login");
  }

  // Use the dbHash variable here
  const match = await bcrypt.compare(password, dbHash);
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