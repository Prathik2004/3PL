import { Router } from "express";
import { getUsers, updateUser, deleteUser } from "./UserController.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validateUpdateUser } from "./UserValidation.js";

const router = Router();

router.get("/", authenticate, getUsers);
router.put("/:id", authenticate, validateUpdateUser, updateUser);
router.delete("/:id", authenticate, deleteUser);

export default router;
