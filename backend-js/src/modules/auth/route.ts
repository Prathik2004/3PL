import { Router } from "express";
import { createUser, reset, login, refresh, logout, forgotPassword } from "./controller";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/rbac";
import { UserRole } from "../../types";
import {
  validate,
  loginSchema,
  createUserSchema,
  resetPasswordSchema,
  refreshSchema,
  forgotPasswordSchema,
} from "./validator";

const router = Router();



router.post(
  "/create-user",
  authenticate,
  authorizeRoles(UserRole.ADMIN),
  validate(createUserSchema),
  createUser
);

router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), reset);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", authenticate, logout);

export default router;