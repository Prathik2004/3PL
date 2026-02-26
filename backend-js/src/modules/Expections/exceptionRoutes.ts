import { Router } from "express";
import {
  getAllExceptions,
  getExceptionsByShipment,
  resolveException,
  createException,
  getExceptionsSummary,
  getExceptionFilterOptions,
} from "./exceptionController";

import { authorizeRoles } from "../../middleware/rbac";
import { UserRole } from "../../types";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

// Summary counts grouped by exception_type (for KPI cards)
router.get(
  "/summary",
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
  getExceptionsSummary
);

// Distinct clients, carriers, and exception types present in exceptions (for filter dropdowns)
router.get(
  "/filter-options",
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
  getExceptionFilterOptions
);

// Get all exceptions, optional filter by resolved
router.get(
  "/",
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
  getAllExceptions,
);

// Get exceptions by shipment ID
router.get(
  "/shipment/:shipmentId",
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
  getExceptionsByShipment,
);

// Resolve an exception by ID
router.put(
  "/:id/resolve",
  authenticate,
  authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS),
  resolveException,
);

// Manual create exception
router.post("/", authenticate, authorizeRoles(UserRole.ADMIN), createException);

export default router;
