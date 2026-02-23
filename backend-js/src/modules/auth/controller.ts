import { Request, Response } from "express";
import {
  createUserByAdmin,
  resetPassword,
  loginUser,
  refreshAccessToken,
} from "./service";
import { AuthRequest } from "../../middleware/authenticate";
import User from "../../models/user";

export const createUser = async (req: Request, res: Response) => {
  console.log("POST /api/auth/create-user - Request received:", req.body);
  try {
    const { name, email, role } = req.body;
    const user = await createUserByAdmin(name, email, role);
    res.status(201).json({ message: "User created & email sent", user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const reset = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
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
  try {
    const { email, password } = req.body;
    const tokens = await loginUser(email, password);
    res.json(tokens);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ userId: req.user?.id });
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Logout failed" });
  }
};