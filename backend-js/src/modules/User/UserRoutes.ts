import { Router } from "express";
import { getUsers, updateUser, deleteUser } from "./UserController.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import { validateUpdateUser } from "./UserValidation.js";

const router = Router();

router.get("/", adminMiddleware, getUsers);
router.put("/:id", adminMiddleware, validateUpdateUser, updateUser);
router.delete("/:id", adminMiddleware, deleteUser);

export default router;
