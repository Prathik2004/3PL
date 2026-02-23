import { z } from 'zod';
import { ShipmentStatus } from '../../types';

export const createShipmentSchema = z.object({
  shipment_id: z.string().min(1),
  client_name: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  dispatch_date: z.coerce.date(),
  expected_delivery_date: z.coerce.date(),
  carrier_name: z.string().min(1),
}).superRefine((data, ctx) => {
  if (data.dispatch_date > data.expected_delivery_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Dispatch Date cannot be after Expected Delivery Date",
      path: ["dispatch_date"]
    });
  }
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(ShipmentStatus),
  delivered_date: z.coerce.date().optional(),
  pod_received: z.boolean().optional()
});

export const getShipmentsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  status: z.nativeEnum(ShipmentStatus).optional(),
  client: z.string().optional(),
  carrier: z.string().optional()
});