import { Request, Response } from 'express';
import { ShipmentService } from './service';
import { Shipment } from '../../models/shipment';
import { createShipmentSchema, updateStatusSchema } from './validator';
import { ShipmentStatus } from '../../types';
import { createAuditLog } from '../../utils/auditLogger';

export class ShipmentController {

  // backend-js\src\modules\shipment\controller.ts

  static async create(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    try {
      const validData = createShipmentSchema.parse(req.body);
      const result = await ShipmentService.createShipment(validData, userId);
      await createAuditLog({
        user_id: userId, user_role: userRole,
        action: `Created shipment ${validData.shipment_id}`,
        status: 'Success', event_type: 'user', ip_address: req.ip,
      });
      return res.status(201).json({ message: "Shipment created successfully", id: result.id });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({
          message: error.errors.map((e: any) => e.message).join(", "),
          errors: error.errors
        });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const userRole = (req as any).user?.role;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Forward ALL filter params to the service
      const filters = {
        status: req.query.status as string | undefined,
        client: req.query.client as string | undefined,
        carrier: req.query.carrier as string | undefined,
        exception: req.query.exception as string | undefined,
        search: req.query.search as string | undefined,
      };

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

      if (!id || !userId || !userRole) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
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

  /** GET /api/shipments/clients — distinct client names for filter bar */
  static async getClients(req: Request, res: Response) {
    try {
      const clients: string[] = await Shipment.distinct('client_name');
      return res.status(200).json({ data: clients.filter(Boolean).sort() });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /** GET /api/shipments/carriers — distinct carrier names for filter bar */
  static async getCarriers(req: Request, res: Response) {
    try {
      const carriers: string[] = await Shipment.distinct('carrier_name');
      return res.status(200).json({ data: carriers.filter(Boolean).sort() });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/shipments/trends?days=90
   * Returns daily shipment counts and active user placeholders for the Analytics AreaChart.
   */
  static async getTrends(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 90;
      const since = new Date();
      since.setDate(since.getDate() - days);

      const groups = await Shipment.aggregate([
        { $match: { created_at: { $gte: since }, status: { $ne: ShipmentStatus.CANCELLED } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: '$_id', orders: 1 } },
      ]);

      return res.status(200).json({ data: groups });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}