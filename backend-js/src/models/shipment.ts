import mongoose, { Schema, Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum ShipmentStatus {
  CREATED = 'Created',
  DISPATCHED = 'Dispatched',
  IN_TRANSIT = 'In Transit',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  DELAYED = 'Delayed',
  CANCELLED = 'Cancelled'
}

// 1. Define the Interface for TypeScript
export interface IShipment extends Document {
  id: string; // Our UUID string
  user_id: Types.ObjectId; // Links shipment to a specific user
  shipment_id: string;
  client_name: string;
  origin: string;
  destination: string;
  dispatch_date: Date;
  expected_delivery_date: Date;
  delivered_date?: Date | null;
  status: ShipmentStatus;
  carrier_name: string;
  last_status_update: Date;
  pod_received: boolean;
  created_at: Date;
  updated_at: Date;
}

// 2. Define the Schema for Mongoose
const ShipmentSchema: Schema = new Schema({
  id: { type: String, default: uuidv4, unique: true }, 
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Added reference
  shipment_id: { type: String, required: true, unique: true },
  client_name: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  dispatch_date: { type: Date, required: true },
  expected_delivery_date: { type: Date, required: true },
  delivered_date: { type: Date, default: null },
  status: { 
    type: String, 
    enum: Object.values(ShipmentStatus), 
    default: ShipmentStatus.CREATED 
  },
  carrier_name: { type: String, required: true },
  last_status_update: { type: Date, default: Date.now },
  pod_received: { type: Boolean, default: false }
}, { 
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

// 3. Export the Model
export const Shipment = mongoose.model<IShipment>('Shipment', ShipmentSchema);