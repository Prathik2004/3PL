import { Router } from "express";
import {
  getAllExceptions,
  getExceptionsByShipment,
  resolveException,
  createException,
} from "./exceptionController";

import { authorizeRoles } from "../../middleware/rbac";
import { UserRole } from "../../types";

const router = Router();

// Get all exceptions, optional filter by resolved
router.get(
  "/",
  authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
  getAllExceptions,
);

// Get exceptions by shipment ID
router.get("/shipment/:shipmentId", getExceptionsByShipment);

// Resolve an exception by ID
router.put(
  "/:id/resolve",
  authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS),
  resolveException,
);

// Manual create exception
router.post("/", authorizeRoles(UserRole.ADMIN), createException);

export default router;
