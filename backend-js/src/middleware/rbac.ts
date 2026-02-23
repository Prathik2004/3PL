import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Assuming req.user is populated by your authentication middleware
    const userRole = (req as any).user?.role; 

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden: You do not have permission to perform this action' 
      });
    }
    return next();
  };
};