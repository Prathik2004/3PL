import { Request, Response } from 'express';
import { ShipmentService } from './service';
import { createShipmentSchema, getShipmentsQuerySchema, updateStatusSchema } from './validator';

export class ShipmentController {

  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const validData = createShipmentSchema.parse(req.body);

      const result = await ShipmentService.createShipment(validData, userId);
      return res.status(201).json({ message: "Shipment created successfully", id: result.id });
    } catch (error: any) {
      if (error.message === "Duplicate shipment_id") return res.status(400).json({ error: error.message });
      return res.status(400).json({ errors: error.errors });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = { status: req.query.status, client: req.query.client };

      const result = await ShipmentService.getShipments(filters, page, limit, userId, userRole);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const stats = await ShipmentService.getDashboardStats(userId, userRole);
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const validData = updateStatusSchema.parse(req.body);
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!id) return res.status(400).json({ error: "Shipment ID is required" });

      const result = await ShipmentService.updateStatus(id, validData, userId, userRole);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ errors: error.errors || error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!id) return res.status(400).json({ error: "Shipment ID is required" });

      const result = await ShipmentService.cancelShipment(id, userId, userRole);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  }

  static async uploadCSV(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!req.file) return res.status(400).json({ error: 'No CSV file uploaded' });

      const result = await ShipmentService.processCsvUpload(req.file.path, userId);
      const statusCode = result.error_count > 0 ? 207 : 201;

      return res.status(statusCode).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal server error during CSV processing' });
    }
  }
}