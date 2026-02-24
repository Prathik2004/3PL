// backend-js\src\middleware\rbac.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user is now populated by the 'authenticate' middleware
    const user = (req as any).user; 

    if (!user || !allowedRoles.includes(user.role)) {
      console.log(`Access Denied. User Role: ${user?.role}. Required: ${allowedRoles}`);
      return res.status(403).json({ 
        error: 'Forbidden: You do not have permission to perform this action' 
      });
    }
    return next();
  };
};