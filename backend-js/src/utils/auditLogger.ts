/**
 * createAuditLog — Fire-and-forget helper to write an audit log entry.
 * Used by route handlers after completing an action.
 */
import { AuditLog, LogEventType, LogStatus } from "../models/AuditLog.model";
import { User } from "../models/user";

export interface AuditLogInput {
    user_id: string | null;
    user_role: string;
    action: string;
    status: LogStatus;
    event_type?: LogEventType;
    /** Pass req.ip — undefined values are simply omitted from the log document */
    ip_address?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
}

export async function createAuditLog(input: AuditLogInput): Promise<void> {
    try {
        let user_name = "System Engine";
        if (input.user_id) {
            const dbUser = await User.findOne({ userId: input.user_id });
            user_name = dbUser?.name ?? input.user_id;
        }

        // Strip undefined / null so Mongoose doesn't store empty fields
        const doc: Record<string, unknown> = {
            timestamp: new Date(),
            user_name,
            user_id: input.user_id,
            user_role: input.user_role,
            action: input.action,
            status: input.status,
            event_type: input.event_type ?? "user",
        };
        if (input.ip_address) doc.ip_address = input.ip_address;
        if (input.metadata) doc.metadata = input.metadata;

        await AuditLog.create(doc);
    } catch (err) {
        // Logging failures must never crash the main request
        console.error("[AuditLog] Failed to write log:", err);
    }
}
