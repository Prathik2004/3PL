import { Router } from "express";
import { getLogs } from "./logsController";
import { seedLogs } from "./seedLogs";
import { authenticate } from "../../middleware/authenticate";
import { authorizeRoles } from "../../middleware/rbac";
import { UserRole } from "../../types";

const router = Router();

// Seed demo logs — Admin or Operations
router.post(
    "/seed",
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS),
    seedLogs
);

// Only Admins can view system logs
router.get(
    "/",
    authenticate,
    authorizeRoles(UserRole.ADMIN),
    getLogs
);

export default router;
