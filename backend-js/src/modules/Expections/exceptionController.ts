import { Request, Response } from "express";
import { RequestHandler } from "express";
import mongoose from "mongoose";
import Exception from "../../models/Exception.model";
import { resolveExceptionService } from "../../cron/resolveException";


interface ResolveParams {
  id: string;
}
/**
 * GET All Exceptions
 * Query: ?resolved=true/false
 */
export const getAllExceptions = async (req: Request, res: Response) => {
  try {
    const { resolved, client, carrier, exceptions: exceptionType, search } = req.query as Record<string, string>;

    // Build the match stage for Exception fields
    const exceptionMatch: Record<string, any> = {};
    if (resolved !== undefined) {
      exceptionMatch.resolved = resolved === "true";
    }
    if (exceptionType && exceptionType !== 'all') {
      // Map frontend values to DB types
      const typeMap: Record<string, string> = {
        'no_update': 'NoUpdate',
        'missing_pod': 'MissingPOD',
        'critical_delay': 'Delay',
        'not_dispatched': 'NotDispatched',
      };
      exceptionMatch.exception_type = typeMap[exceptionType] || exceptionType;
    }

    // If no client/carrier/search filter, use simple populate query
    if (!client || client === 'all') {
      if (!carrier || carrier === 'all') {
        if (!search) {
          const exceptions = await Exception.find(exceptionMatch)
            .populate("shipment_id")
            .sort({ createdAt: -1 });
          return res.status(200).json({ total: exceptions.length, data: exceptions });
        }
      }
    }

    // Use aggregation to filter by shipment fields
    const pipeline: any[] = [
      { $match: exceptionMatch },
      {
        $lookup: {
          from: "shipments",
          localField: "shipment_id",
          foreignField: "_id",
          as: "shipment_id",
        },
      },
      { $unwind: { path: "$shipment_id", preserveNullAndEmpty: true } },
    ];

    const shipmentMatch: Record<string, any> = {};
    if (client && client !== 'all') {
      shipmentMatch["shipment_id.client_name"] = { $regex: client, $options: 'i' };
    }
    if (carrier && carrier !== 'all') {
      shipmentMatch["shipment_id.carrier_name"] = { $regex: carrier, $options: 'i' };
    }
    if (search) {
      shipmentMatch.$or = [
        { "shipment_id.shipment_id": { $regex: search, $options: 'i' } },
        { "shipment_id.client_name": { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (Object.keys(shipmentMatch).length > 0) {
      pipeline.push({ $match: shipmentMatch });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const exceptions = await Exception.aggregate(pipeline);
    return res.status(200).json({ total: exceptions.length, data: exceptions });
  } catch (error: any) {
    console.error("Get All Exceptions Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET Exceptions By Shipment ID
 */
export const getExceptionsByShipment = async (req: Request, res: Response) => {
  try {
    let { shipmentId } = req.params;

    // Handle string array case
    if (Array.isArray(shipmentId)) shipmentId = shipmentId[0];

    if (!shipmentId || !mongoose.Types.ObjectId.isValid(shipmentId)) {
      return res.status(400).json({ message: "Invalid shipmentId" });
    }

    const objectId = new mongoose.Types.ObjectId(shipmentId);

    const exceptions = await Exception.find({ shipment_id: objectId }).populate(
      "shipment_id",
    );

    if (!exceptions.length) {
      return res
        .status(404)
        .json({ message: "No exceptions found for this shipment" });
    }

    return res.status(200).json({
      total: exceptions.length,
      data: exceptions,
    });
  } catch (error: any) {
    console.error("Get Exceptions By Shipment Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * PUT Resolve Exception
 */
export const resolveException: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params as { id: string };
    const { resolution_note } = req.body as { resolution_note?: string };

    const exception = await resolveExceptionService(id, resolution_note);

    return res.status(200).json({
      success: true,
      message: "Exception resolved successfully",
      data: exception,
    });
  } catch (error: any) {
    console.error("Resolve Exception Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * POST Manual Create Exception
 */
export const createException = async (req: Request, res: Response) => {
  try {
    let { shipment_id, exception_type, description } = req.body;

    // Handle string array if sent accidentally
    if (Array.isArray(shipment_id)) shipment_id = shipment_id[0];

    if (!shipment_id || !mongoose.Types.ObjectId.isValid(shipment_id)) {
      return res.status(400).json({ message: "Valid shipment_id is required" });
    }

    if (
      !exception_type ||
      !["Delay", "NoUpdate", "MissingPOD", "NotDispatched"].includes(
        exception_type,
      )
    ) {
      return res
        .status(400)
        .json({ message: "Valid exception_type is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const exception = await Exception.create({
      shipment_id: new mongoose.Types.ObjectId(shipment_id),
      exception_type,
      description,
    });

    return res.status(201).json({
      message: "Exception created successfully",
      data: exception,
    });
  } catch (error: any) {
    console.error("Create Exception Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/exceptions/summary
 * Returns count of unresolved exceptions grouped by exception_type.
 */
export const getExceptionsSummary = async (req: Request, res: Response) => {
  try {
    const groups = await Exception.aggregate([
      { $match: { resolved: false } },
      { $group: { _id: "$exception_type", count: { $sum: 1 } } },
    ]);

    const summary: Record<string, number> = {
      NoUpdate: 0,
      MissingPOD: 0,
      Delay: 0,
      NotDispatched: 0,
    };

    let total = 0;
    for (const g of groups) {
      if (g._id in summary) {
        summary[g._id] = g.count;
      }
      total += g.count;
    }

    return res.status(200).json({ ...summary, total });
  } catch (error: any) {
    console.error("Get Exceptions Summary Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
