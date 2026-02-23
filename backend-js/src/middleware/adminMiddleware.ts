import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    role: string;
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided. Authorization denied." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided. Authorization denied." });
    }

    try {
        const secret = process.env.JWT_SECRET || "your_secret_key_change_me";
        const decoded = jwt.verify(token, secret) as unknown as JwtPayload;

        if (decoded && decoded.role === "admin") {
            (req as any).user = decoded;
            return next();
        } else {
            return res.status(403).json({ message: "Access denied. Admin role required." });
        }
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid." });
    }
};
