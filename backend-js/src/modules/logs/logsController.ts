import { Request, Response } from "express";
import { AuditLog } from "../../models/AuditLog.model";

/**
 * GET /api/logs
 * Query params:
 *   - page      (default: 1)
 *   - limit     (default: 20)
 *   - event_type  ("user" | "system" | "security" | "all")
 *   - status    ("Success" | "Failed" | "all")
 *   - search    (searches user_name and action fields)
 *   - days      (7 | 30 | default: 7)
 */
export const getLogs = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const eventType = req.query.event_type as string || "all";
        const status = req.query.status as string || "all";
        const search = req.query.search as string || "";
        const days = parseInt(req.query.days as string) || 7;

        const since = new Date();
        since.setDate(since.getDate() - days);

        const filter: Record<string, any> = {
            timestamp: { $gte: since },
        };

        if (eventType !== "all") filter.event_type = eventType;
        if (status !== "all") filter.status = status;
        if (search) {
            filter.$or = [
                { user_name: { $regex: search, $options: "i" } },
                { action: { $regex: search, $options: "i" } },
            ];
        }

        const [logs, total] = await Promise.all([
            AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
            AuditLog.countDocuments(filter),
        ]);

        return res.status(200).json({ total, page, limit, data: logs });
    } catch (error: any) {
        console.error("Get Logs Error:", error);
        return res.status(500).json({ error: error.message });
    }
};
