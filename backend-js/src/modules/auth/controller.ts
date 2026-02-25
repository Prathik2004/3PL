import { Request, Response } from "express";
import {
  createUserByAdmin,
  resetPassword,
  loginUser,
  refreshAccessToken,
  requestPasswordReset,
} from "./service";
import { AuthRequest } from "../../middleware/authenticate";
import { User } from "../../models/user";
import { createAuditLog } from "../../utils/auditLogger";

export const createUser = async (req: Request, res: Response) => {
  console.log("POST /api/auth/create-user - Request received:", req.body);
  const actorId = (req as any).user?.id;
  const actorRole = (req as any).user?.role;
  try {
    const { name, email, role } = req.body;
    const user = await createUserByAdmin(name, email, role);
    await createAuditLog({
      user_id: actorId,
      user_role: actorRole,
      action: `New user "${name}" (${role}) created`,
      status: "Success",
      event_type: "user",
      ip_address: req.ip,
    });
    res.status(201).json({ message: "User created & email sent", user });
  } catch (error: any) {
    await createAuditLog({
      user_id: actorId,
      user_role: actorRole,
      action: `Failed to create user: ${error.message}`,
      status: "Failed",
      event_type: "user",
      ip_address: req.ip,
    });
    res.status(400).json({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await requestPasswordReset(email);
    await createAuditLog({
      user_id: null,
      user_role: "System",
      action: `Password reset email sent to ${email}`,
      status: "Success",
      event_type: "security",
      ip_address: req.ip,
    });
    res.json({ message: "Password reset email sent" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const reset = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
    await createAuditLog({
      user_id: null,
      user_role: "System",
      action: "Password reset successfully",
      status: "Success",
      event_type: "security",
      ip_address: req.ip,
    });
    res.json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const token = await refreshAccessToken(refreshToken);
    res.json(token);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const tokens = await loginUser(email, password);
    // Resolve user for logging
    const dbUser = await User.findOne({ email });
    await createAuditLog({
      user_id: dbUser?.userId || null,
      user_role: dbUser?.role || "Unknown",
      action: `User "${dbUser?.name || email}" logged in`,
      status: "Success",
      event_type: "security",
      ip_address: req.ip,
    });
    res.json(tokens);
  } catch (error: any) {
    await createAuditLog({
      user_id: null,
      user_role: "Unknown",
      action: `Failed login attempt for ${email}`,
      status: "Failed",
      event_type: "security",
      ip_address: req.ip,
    });
    res.status(400).json({ error: error.message });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ userId: req.user?.id } as any);
    if (user) {
      (user as any).refreshToken = null;
      await user.save();
    }
    await createAuditLog({
      user_id: req.user?.id || null,
      user_role: req.user?.role || "Unknown",
      action: `User "${user?.name || req.user?.id}" logged out`,
      status: "Success",
      event_type: "security",
      ip_address: req.ip,
    });
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Logout failed" });
  }
};