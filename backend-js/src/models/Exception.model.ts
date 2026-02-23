import mongoose, { Document, Schema } from "mongoose";

export interface IException extends Document {
  shipment_id: mongoose.Types.ObjectId;
  exception_type: "Delay" | "NoUpdate" | "MissingPOD" | "NotDispatched";
  description: string;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  },
  { timestamps: true },
);

export default mongoose.model<IException>("Exception", ExceptionSchema);
