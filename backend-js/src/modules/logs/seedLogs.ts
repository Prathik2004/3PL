import { Request, Response } from "express";
import { AuditLog } from "../../models/AuditLog.model";

const SEED_LOGS = [
    { user_name: "Sarah Mitchell", user_role: "Admin", action: "User 'Sarah Mitchell' logged in", status: "Success", event_type: "security", ip_address: "192.168.1.10" },
    { user_name: "James Carter", user_role: "Operations", action: "Shipment SHP-10021 created for TechFlow Inc", status: "Success", event_type: "user", ip_address: "192.168.1.32" },
    { user_name: "Unknown", user_role: "Unknown", action: "Failed login attempt for hacker@example.com", status: "Failed", event_type: "security", ip_address: "203.0.113.9" },
    { user_name: "Sarah Mitchell", user_role: "Admin", action: "New user 'James Carter' created with role Operations", status: "Success", event_type: "user", ip_address: "192.168.1.10" },
    { user_name: "Emily Zhao", user_role: "Operations", action: "Shipment SHP-10022 status updated to In Transit", status: "Success", event_type: "user", ip_address: "192.168.1.55" },
    { user_name: "System Engine", user_role: "System", action: "Cron: Generated NoUpdate exception for SHP-10019", status: "Success", event_type: "system", ip_address: undefined },
    { user_name: "James Carter", user_role: "Operations", action: "Shipment SHP-10020 deleted (Cancelled)", status: "Success", event_type: "user", ip_address: "192.168.1.32" },
    { user_name: "Emily Zhao", user_role: "Operations", action: "Bulk CSV upload: 12 shipments processed, 1 error", status: "Failed", event_type: "user", ip_address: "192.168.1.55" },
    { user_name: "Sarah Mitchell", user_role: "Admin", action: "Password reset requested for james@example.com", status: "Success", event_type: "security", ip_address: "192.168.1.10" },
    { user_name: "System Engine", user_role: "System", action: "Cron: Resolved MissingPOD exception for SHP-10015", status: "Success", event_type: "system", ip_address: undefined },
    { user_name: "Raj Patel", user_role: "Viewer", action: "User 'Raj Patel' logged in", status: "Success", event_type: "security", ip_address: "10.0.0.14" },
    { user_name: "James Carter", user_role: "Operations", action: "Shipment SHP-10023 created for LogiCorp Ltd", status: "Success", event_type: "user", ip_address: "192.168.1.32" },
    { user_name: "Unknown", user_role: "Unknown", action: "Failed login attempt for test@test.com", status: "Failed", event_type: "security", ip_address: "198.51.100.2" },
    { user_name: "Emily Zhao", user_role: "Operations", action: "Shipment SHP-10016 status updated to Delivered", status: "Success", event_type: "user", ip_address: "192.168.1.55" },
    { user_name: "System Engine", user_role: "System", action: "Cron: Generated Delay exception for SHP-10023", status: "Success", event_type: "system", ip_address: undefined },
    { user_name: "Sarah Mitchell", user_role: "Admin", action: "Password successfully reset for james@example.com", status: "Success", event_type: "security", ip_address: "192.168.1.10" },
    { user_name: "Raj Patel", user_role: "Viewer", action: "Exported shipments report (CSV)", status: "Success", event_type: "user", ip_address: "10.0.0.14" },
    { user_name: "James Carter", user_role: "Operations", action: "Shipment SHP-10024 status updated to Dispatched", status: "Success", event_type: "user", ip_address: "192.168.1.32" },
    { user_name: "Unknown", user_role: "Unknown", action: "Failed login attempt for admin@company.com", status: "Failed", event_type: "security", ip_address: "203.0.113.45" },
    { user_name: "System Engine", user_role: "System", action: "Cron: 3 exceptions auto-resolved after delivery", status: "Success", event_type: "system", ip_address: undefined },
];

/** POST /api/logs/seed — inserts realistic mock logs for demo purposes */
export const seedLogs = async (req: Request, res: Response) => {
    try {
        const existing = await AuditLog.countDocuments();
        if (existing >= 10) {
            return res.status(200).json({ message: "Logs already seeded", count: existing });
        }

        const now = Date.now();
        const docs = SEED_LOGS.map((log, i) => ({
            ...log,
            user_id: null,
            timestamp: new Date(now - i * 2 * 60 * 60 * 1000), // spread over 40h
        }));

        await AuditLog.insertMany(docs);
        return res.status(201).json({ message: "Seeded mock logs", count: docs.length });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};
