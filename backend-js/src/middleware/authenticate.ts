import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../types";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: "Internal Server Error: Secret not configured" });
      return;
    }

    if (!token) {
      res.status(401).json({ error: "Invalid token format" });
      return;
    }

    const decoded = jwt.verify(token, secret) as any;

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};