import mongoose, { Schema, Document } from "mongoose";

export type LogEventType = "user" | "system" | "security";
export type LogStatus = "Success" | "Failed";

export interface IAuditLog extends Document {
    timestamp: Date;
    user_id: string | null;   // null for system-generated events
    user_name: string;         // "System Engine" for automated events
    user_role: string;
    action: string;
    status: LogStatus;
    event_type: LogEventType;
    ip_address?: string;
    metadata?: Record<string, any>;
}

const AuditLogSchema = new Schema<IAuditLog>(
    {
        timestamp: { type: Date, default: Date.now, index: true },
        user_id: { type: String, default: null },
        user_name: { type: String, required: true },
        user_role: { type: String, required: true },
        action: { type: String, required: true },
        status: { type: String, enum: ["Success", "Failed"], required: true },
        event_type: {
            type: String,
            enum: ["user", "system", "security"],
            default: "user",
        },
        ip_address: { type: String },
        metadata: { type: Schema.Types.Mixed },
    },
    {
        // No automatic timestamps — we manage timestamp ourselves for consistency
        timestamps: false,
    }
);

// TTL index: auto-delete logs older than 90 days to keep the collection lean
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export const AuditLog =
    mongoose.models.AuditLog ||
    mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
