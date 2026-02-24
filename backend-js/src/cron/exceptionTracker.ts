import cron from "node-cron";
import { Shipment, IShipment } from "../models/shipment";
import Exception from "../models/Exception.model";
import { transporter } from "../config/mailer";
import { IUser } from "../models/user";

// 🔹 Define a type for populated shipments
type ShipmentPopulated = Omit<IShipment, "created_by"> & { created_by?: IUser };

const runExceptionTracker = (): void => {
  cron.schedule("0 */1 * * * *", async () => {
    try {
      console.log("Running Exception Tracker...");

      // Populate 'created_by' so we can access email
      const shipments = await Shipment.find({
        status: { $ne: "Cancelled" },
      }).populate<{ created_by: IUser }>("created_by");

      const now = new Date();

      for (const shipment of shipments) {
        // Convert Mongoose doc to plain object with correct type
        const s: ShipmentPopulated = shipment.toObject();

        // 🔹 Delay
        if (s.status !== "Delivered" && now > s.expected_delivery_date) {
          await createException(s, "Delay", "Shipment delayed");
        }

        // 🔹 No Update (24 hrs)
        const hoursSinceUpdate =
          (now.getTime() - s.last_status_update.getTime()) / (1000 * 60 * 60);

        if (s.status !== "Delivered" && hoursSinceUpdate > 24) {
          await createException(s, "NoUpdate", "No status update in 24 hours");
        }

        // 🔹 Missing POD
        if (s.status === "Delivered" && s.pod_received === false) {
          await createException(s, "MissingPOD", "POD not received");
        }

        // 🔹 Not Dispatched (48 hrs)
        const hoursSinceCreated =
          (now.getTime() - s.created_at.getTime()) / (1000 * 60 * 60);

        if (s.status === "Created" && hoursSinceCreated > 48) {
          await createException(
            s,
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

// 🔹 Use ShipmentPopulated here as well
const createException = async (
  shipment: ShipmentPopulated,
  type: "Delay" | "NoUpdate" | "MissingPOD" | "NotDispatched",
  message: string,
) => {
  const existing = await Exception.findOne({
    shipment_id: shipment._id,
    exception_type: type,
    resolved: false,
  });

  if (!existing) {
    await Exception.create({
      shipment_id: shipment._id,
      exception_type: type,
      description: message,
    });

    console.log("Exception Created:", type);

    if (shipment.created_by?.email) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: shipment.created_by.email,
        subject: `Walkwel 3PL - Exception Created: ${type}`,
        html: `
          <h3>An exception has been created</h3>
          <p><b>Shipment ID:</b> ${shipment.shipment_id}</p>
          <p><b>Type:</b> ${type}</p>
          <p><b>Description:</b> ${message}</p>
        `,
      });
      console.log(`✅ Email sent to ${shipment.created_by.email}`);
    } else {
      console.warn("⚠️ Shipment has no user email. Cannot send notification.");
    }
  } else {
    console.log(
      `⚠️ Already Exists → ${type} | Shipment: ${shipment.shipment_id}`,
    );
  }
};

export default runExceptionTracker;
