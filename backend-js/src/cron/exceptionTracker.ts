import cron from "node-cron";
import { Shipment, IShipment } from "../models/shipment";
import Exception from "../models/Exception.model";
import { sendEmail } from "../utils/email";

const runExceptionTracker = (): void => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      console.log("Running Exception Tracker...");

      const shipments: IShipment[] = await Shipment.find({
        status: { $ne: "Cancelled" },
      });

      const now = new Date();

      for (const shipment of shipments) {
        // 🔴 Delay
        if (
          shipment.status !== "Delivered" &&
          now > shipment.expected_delivery_date
        ) {
          await createException(shipment._id, "Delay", "Shipment delayed");
        }

        // 🟠 No Update (24 hrs)
        const hoursSinceUpdate =
          (now.getTime() - shipment.last_status_update.getTime()) /
          (1000 * 60 * 60);

        if (shipment.status !== "Delivered" && hoursSinceUpdate > 24) {
          await createException(
            shipment._id,
            "NoUpdate",
            "No status update in 24 hours",
          );
        }

        // 🟡 Missing POD
        if (
          shipment.status === "Delivered" &&
          shipment.pod_received === false
        ) {
          await createException(shipment._id, "MissingPOD", "POD not received");
        }

        // 🔵 Not Dispatched (48 hrs)
        const hoursSinceCreated =
          (now.getTime() - shipment.created_at.getTime()) / (1000 * 60 * 60);

        if (shipment.status === "Created" && hoursSinceCreated > 48) {
          await createException(
            shipment._id,
            "NotDispatched",
            "Shipment not dispatched in 48 hours",
          );
        }
      }
    } catch (error) {
      console.error("Exception Tracker Error:", error);
    }
  });
};

const createException = async (
  shipmentId: any,
  type: "Delay" | "NoUpdate" | "MissingPOD" | "NotDispatched",
  message: string,
) => {
  const existing = await Exception.findOne({
    shipment_id: shipmentId,
    exception_type: type,
    resolved: false,
  });

  if (!existing) {
    await Exception.create({
      shipment_id: shipmentId,
      exception_type: type,
      description: message,
    });

    console.log("✅ Exception Created:", type);

    // Send test email
    await sendEmail({
      to: "recipient@example.com", // Just any dummy email
      subject: `🚨 Exception Created: ${type}`,
      text: `Shipment ID: ${shipmentId}\nType: ${type}\nMessage: ${message}`,
      html: `<h2>🚨 Exception Created: ${type}</h2>
             <p><b>Shipment ID:</b> ${shipmentId}</p>
             <p><b>Description:</b> ${message}</p>`,
    });

    console.log(`🔥 NEW Exception Created → ${type} | Shipment: ${shipmentId}`);
  } else {
    console.log(`⚠️ Already Exists → ${type} | Shipment: ${shipmentId}`);
  }
};

export default runExceptionTracker;
