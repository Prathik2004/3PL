import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../../models/user";
import { transporter } from "../../config/mailer";
import { UserRole } from "../../types";

// Helper for generating 8-character hex tokens
const generateShortToken = (): string =>
  crypto.randomBytes(4).toString("hex");

/**
 * Create a user via Admin panel and send an invitation email
 */
export const createUserByAdmin = async (
  name: string,
  email: string,
  role: UserRole
) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  // Generate a random temporary password and a reset token
  const temporaryPassword = crypto.randomBytes(16).toString("hex");
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
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

  // Ensure this matches your local frontend port (usually 3000 for Next.js)
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

  console.log(`📧 Sending invitation to: ${email}...`);
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Walkwel 3PL - Account Invitation",
      html: `
        <div style="font-family: sans-serif;">
          <h3>Welcome to Walkwel 3PL, ${name}!</h3>
          <p>An account has been created for you with the role: <b>${role}</b>.</p>
          <p>Please click the link below to set your password and access your dashboard:</p>
          <a href="${resetLink}" style="padding: 10px 20px; background: black; color: white; text-decoration: none; border-radius: 5px;">Set Password</a>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });
  } catch (mailError) {
    console.error("Email delivery failed:", mailError);
    // We don't throw here so the user creation isn't rolled back, 
    // but in production, you'd want a retry logic.
  }

  return user;
};

/**
 * Handle password reset requests for existing users
 */
export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User with this email does not exist");

  const resetToken = generateShortToken();
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Walkwel 3PL - Password Reset",
      html: `<p>You requested a password reset. Click here: <a href="${resetLink}">${resetLink}</a></p>`,
    });
  } catch (mailError) {
    throw new Error("Failed to send reset email.");
  }
};

/**
 * Reset password using the token sent via email
 */
export const resetPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) throw new Error("Invalid or expired reset token");

  user.password_hash = await bcrypt.hash(newPassword, 10);
  user.mustResetPassword = false;
  user.resetToken = undefined; // Use undefined to clear field in Mongo
  user.resetTokenExpiry = undefined;

  await user.save();
};

/**
 * Main Login Logic
 */
export const loginUser = async (email: string, password: string) => {
  // 1. Find user and explicitly include password_hash (it's usually hidden)
  const user = await User.findOne({ email }).select("+password_hash");
  if (!user) throw new Error("Invalid credentials");

  // 2. Check if they need to set their password first (from Admin creation)
  if (user.mustResetPassword) {
    throw new Error("Account not activated. Please use the link sent to your email to set a password.");
  }

  // 3. Compare passwords
  const dbHash = user.password_hash; 
  if (!dbHash) throw new Error("Account configuration error (missing hash)");

  const isMatch = await bcrypt.compare(password, dbHash);
  if (!isMatch) throw new Error("Invalid credentials");

  // 4. Generate Tokens
  // Note: Using user.userId to match your frontend expectations
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

  // 5. Store refresh token for session management
  user.refreshToken = refreshToken;
  await user.save();

  return { 
    accessToken, 
    refreshToken, 
    user: { 
      name: user.name, 
      email: user.email, 
      role: user.role,
      userId: user.userId 
    } 
  };
};

/**
 * Exchange refresh token for a new access token
 */
export const refreshAccessToken = async (token: string) => {
  try {
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
  } catch (err) {
    throw new Error("Session expired. Please login again.");
  }
};