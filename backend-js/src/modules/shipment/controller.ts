import { Request, Response } from 'express';
import { ShipmentService } from './service';
import { createShipmentSchema, getShipmentsQuerySchema, updateStatusSchema } from './validator';

export class ShipmentController {
  // ... (create, getAll, updateStatus, delete, uploadCSV)

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
      const query = getShipmentsQuerySchema.parse(req.query);
      const filters = { status: query.status, client: query.client, carrier: query.carrier };
      const result = await ShipmentService.getShipments(filters, query.page, query.limit, userId, userRole);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ errors: error.errors });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const validData = updateStatusSchema.parse(req.body);
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
<<<<<<< HEAD
      if (!id) {
        return res.status(400).json({ error: "Shipment ID is required" });
      }
      const result = await ShipmentService.updateStatus(id, validData);
=======
      if (!id || !userId || !userRole) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      const result = await ShipmentService.updateStatus(id, validData, userId, userRole);
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
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
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
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
      return res.status(result.error_count > 0 ? 207 : 201).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // NEW EXPORT CONTROLLER
  static async export(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const format = req.query.format === 'xlsx' ? 'xlsx' : 'csv';

      const data = await ShipmentService.exportShipments(userId, userRole, format);

      if (format === 'csv') {
        res.header('Content-Type', 'text/csv');
        res.attachment(`shipments_${Date.now()}.csv`);
        return res.send(data);
      } else {
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment(`shipments_${Date.now()}.xlsx`);
        return res.send(data);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}