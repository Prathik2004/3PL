import { Request, Response } from "express";
import mongoose from "mongoose";
import Exception from "../../models/Exception.model";

/**
 * GET All Exceptions
 * Query: ?resolved=true/false
 */
export const getAllExceptions = async (req: Request, res: Response) => {
  try {
    const { resolved } = req.query;

    const filter: { resolved?: boolean } = {};
    if (resolved !== undefined) {
      filter.resolved = resolved === "true";
    }

    const exceptions = await Exception.find(filter)
      .populate("shipment_id")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      total: exceptions.length,
      data: exceptions,
    });
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
export const resolveException = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;

    if (Array.isArray(id)) id = id[0];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid exception ID" });
    }

    const exception = await Exception.findByIdAndUpdate(
      id,
      { resolved: true },
      { new: true },
    );

    if (!exception) {
      return res.status(404).json({ error: "Exception not found" });
    }

    return res.status(200).json({
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
