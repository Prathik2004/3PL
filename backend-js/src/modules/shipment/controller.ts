import { Request, Response } from 'express';
import { ShipmentService } from './service';
import { createShipmentSchema, getShipmentsQuerySchema, updateStatusSchema } from './validator';

export class ShipmentController {
  
  static async create(req: Request, res: Response) {
    try {
      const validData = createShipmentSchema.parse(req.body);
      const result = await ShipmentService.createShipment(validData);
      return res.status(201).json({ message: "Shipment created successfully", id: result.id }); // [cite: 110]
    } catch (error: any) {
      if (error.message === "Duplicate shipment_id") return res.status(400).json({ error: error.message }); // [cite: 112]
      return res.status(400).json({ errors: error.errors });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const query = getShipmentsQuerySchema.parse(req.query);
      const filters = { status: query.status, client: query.client, carrier: query.carrier };
      const result = await ShipmentService.getShipments(filters, query.page, query.limit);
      return res.status(200).json(result); // [cite: 115]
    } catch (error: any) {
      return res.status(400).json({ errors: error.errors });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const validData = updateStatusSchema.parse(req.body);
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await ShipmentService.updateStatus(id, validData);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ errors: error.errors || error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await ShipmentService.cancelShipment(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}