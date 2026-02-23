import { Router } from "express";
import {
  getAllExceptions,
  getExceptionsByShipment,
  resolveException,
  createException,
} from "./exceptionController";

const router = Router();

// Get all exceptions, optional filter by resolved
router.get("/", getAllExceptions);

// Get exceptions by shipment ID
router.get("/shipment/:shipmentId", getExceptionsByShipment);

// Resolve an exception by ID
router.put("/:id/resolve", resolveException);

// Manual create exception
router.post("/", createException);

export default router;
