import mongoose from "mongoose";
import Exception from "../models/Exception.model";
import { transporter } from "../config/mailer";
import { IUser } from "../models/user";
import { IShipment, Shipment } from "../models/shipment";
import { ShipmentStatus } from "../models/shipment";

type ShipmentPopulated = Omit<IShipment, "created_by"> & { created_by?: IUser };

export const resolveExceptionService = async (
  exceptionId: string,
  resolutionNote?: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(exceptionId)) {
    throw new Error("Invalid exception ID");
  }

  const exception = await Exception.findById(exceptionId)
    .populate<{
      shipment_id: IShipment & { created_by: IUser };
    }>({
      path: "shipment_id",
      populate: {
        path: "created_by",
        model: "User",
      },
    })
    .orFail();

  if (!exception) {
    throw new Error("Exception not found");
  }

  if (exception.resolved) {
    console.log("Exception already resolved:", exceptionId);
    return exception;
  }

  // Mark as resolved
  exception.resolved = true;
  exception.resolved_at = new Date();
  if (resolutionNote) exception.resolution_note = resolutionNote;

  await exception.save();

  // Send email to user
  const shipment = exception.shipment_id;

  // ✅ FIX ROOT CAUSE BASED ON TYPE
  const shipmentDoc = await Shipment.findById(shipment._id);

  if (shipmentDoc) {
    switch (exception.exception_type) {
      case "Delay":
        shipmentDoc.status = ShipmentStatus.DELIVERED;
        shipmentDoc.delivered_date = new Date();
        break;

      case "MissingPOD":
        shipmentDoc.pod_received = true;
        break;

      case "NotDispatched":
        shipmentDoc.status = ShipmentStatus.DISPATCHED;
        break;

      case "NoUpdate":
        shipmentDoc.last_status_update = new Date();
        break;
    }

    await shipmentDoc.save();
  }
  console.log(
    "Attempting to resolve exception for shipment:",
    shipment?.created_by?.email,
  );
  if (shipment?.created_by?.email) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: shipment.created_by.email,
        subject: `Walkwel 3PL - Exception Resolved: ${exception.exception_type}`,
        html: `
          <h3>Your shipment exception has been resolved</h3>
          <p><b>Shipment ID:</b> ${shipment.shipment_id}</p>
          <p><b>Exception Type:</b> ${exception.exception_type}</p>
          ${
            resolutionNote
              ? `<p><b>Resolution Note:</b> ${resolutionNote}</p>`
              : ""
          }
        `,
      });
      console.log(`Resolution email sent to ${shipment.created_by.email}`);
    } catch (err) {
      console.error("Failed to send resolution email:", err);
    }
  } else {
    console.warn("Shipment has no user email. Cannot send resolution email.");
  }

  return exception;
};
