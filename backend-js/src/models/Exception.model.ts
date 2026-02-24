import mongoose, { Document, Schema } from "mongoose";

export interface IException extends Document {
  shipment_id: mongoose.Types.ObjectId;
  exception_type: "Delay" | "NoUpdate" | "MissingPOD" | "NotDispatched";
  description: string;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
  resolved_at: Date; // when resolved
  resolution_note: string; // optional note on resolution
}

const ExceptionSchema: Schema = new Schema(
  {
    shipment_id: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },
    exception_type: {
      type: String,
      enum: ["Delay", "NoUpdate", "MissingPOD", "NotDispatched"],
      required: true,
    },
    description: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    resolved_at: { type: Date }, // when resolved
    resolution_note: { type: String }, // optional note on resolution
  },
  { timestamps: true },
);

export default mongoose.model<IException>("Exception", ExceptionSchema);
