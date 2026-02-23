import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    role: Joi.string().valid("admin", "user"),
    password: Joi.string().min(6)
}).min(1);

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map(d => d.message)
        });
    }
<<<<<<< HEAD
    next();
=======
    return next();
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
};
