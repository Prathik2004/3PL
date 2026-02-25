import fs from 'fs';
import csv from 'csv-parser';
import { Parser } from 'json2csv';
import * as XLSX from 'xlsx';
import { Shipment } from '../../models/shipment';
import { ShipmentStatus, UserRole } from '../../types';
import { createShipmentSchema } from './validator';
// FIX: Removed curly braces because Exception is a default export
import Exception from '../../models/Exception.model';

export class ShipmentService {

    static async processCsvUpload(filePath: string, userId: string): Promise<any> {
        const results: { row: number, data: any }[] = [];
        const errors: any[] = [];
        let rowNumber = 1;

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    rowNumber++;
                    results.push({ row: rowNumber, data });
                })
                .on('end', async () => {
                    const successfulInserts: string[] = [];

                    for (const item of results) {
                        try {
                            const validData = createShipmentSchema.parse(item.data);
                            const existing = await Shipment.findOne({ shipment_id: validData.shipment_id });
                            if (existing) throw new Error("Duplicate shipment_id");

                            const newShipment = await Shipment.create({
                                ...validData,
                                created_by: userId,
                                status: ShipmentStatus.CREATED,
                                pod_received: false,
                                last_status_update: new Date(),
                            });

                            successfulInserts.push(newShipment.shipment_id);
                            // backend-js\src\modules\shipment\service.ts -> inside processCsvUpload

                            // CHANGE THIS BLOCK:
                        } catch (error: any) {
                            let errorMessages: string[] = [];

                            if (error.name === 'ZodError') {
                                errorMessages = error.errors.map((e: any) => e.message);
                            } else {
                                errorMessages = [error.message || "Unknown error"];
                            }

                            errors.push({
                                row: item.row,
                                shipment_id: item.data.shipment_id || 'Unknown',
                                issues: errorMessages
                            });
                        }
                    }
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    resolve({
                        total_processed: rowNumber - 1,
                        successful_count: successfulInserts.length,
                        successes: successfulInserts,
                        error_count: errors.length,
                        errors: errors
                    });
                })
                .on('error', (error) => {
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    reject(error);
                });
        });
    }

    static async createShipment(data: any, userId: string) {
        const existing = await Shipment.findOne({ shipment_id: data.shipment_id });
        if (existing) throw new Error("Duplicate shipment_id");

        return await Shipment.create({
            ...data,
            created_by: userId,
            status: ShipmentStatus.CREATED,
            last_status_update: new Date()
        });
    }

    static async getShipments(filters: any, page: number, limit: number, userId: string, userRole: string) {
        const skip = (page - 1) * limit;
        const query: any = { status: { $ne: ShipmentStatus.CANCELLED } };

        if (userRole !== UserRole.ADMIN && userRole !== UserRole.OPERATIONS) {
            query.created_by = userId;
        }

        // --- Filters ---
        if (filters.status) {
            // Status filter overrides the base $ne: CANCELLED
            query.status = filters.status;
        }
        if (filters.client) {
            query.client_name = { $regex: filters.client, $options: 'i' };
        }
        if (filters.carrier) {
            query.carrier_name = { $regex: filters.carrier, $options: 'i' };
        }
        if (filters.search) {
            query.$or = [
                { shipment_id: { $regex: filters.search, $options: 'i' } },
                { client_name: { $regex: filters.search, $options: 'i' } },
                { carrier_name: { $regex: filters.search, $options: 'i' } },
            ];
        }

        // --- Exception filter: only shipments WITH an active exception ---
        let restrictToIds: any[] | null = null;
        if (filters.exception && filters.exception !== 'all') {
            const exFilter: any = { resolved: false };
            if (filters.exception !== 'any') {
                // Map frontend value to the DB exception_type
                const typeMap: Record<string, string> = {
                    'no_update': 'NoUpdate',
                    'missing_pod': 'MissingPOD',
                    'critical_delay': 'Delay',
                    'not_dispatched': 'NotDispatched',
                };
                const dbType = typeMap[filters.exception] || filters.exception;
                exFilter.exception_type = dbType;
            }
            const exShipments = await Exception.find(exFilter).select('shipment_id').lean();
            restrictToIds = exShipments.map((e: any) => e.shipment_id);
            query._id = { $in: restrictToIds };
        }

        // 1. Fetch Shipments
        const [shipments, total] = await Promise.all([
            Shipment.find(query)
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Shipment.countDocuments(query)
        ]);

        // 2. Fetch Unresolved Exceptions for this page's shipments
        const shipmentIds = shipments.map(s => s._id);
        const activeExceptions = await Exception.find({
            shipment_id: { $in: shipmentIds },
            resolved: false
        }).lean();

        // 3. Merge Exception data into Shipment data
        const data = shipments.map(shipment => ({
            ...shipment,
            active_exception: activeExceptions.find(
                (ex: any) => ex.shipment_id.toString() === shipment._id.toString()
            ) || null
        }));

        return { total, page, limit, data };
    }

    static async getDashboardStats(userId: string, userRole: string) {
        const query: any = { status: { $ne: ShipmentStatus.CANCELLED } };
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.OPERATIONS) {
            query.created_by = userId;
        }

        const stats = await Shipment.aggregate([
            { $match: query },
            {
                $facet: {
                    active: [{ $count: "count" }],
                    delivered: [{ $match: { status: ShipmentStatus.DELIVERED } }, { $count: "count" }],
                    delayed: [{ $match: { status: ShipmentStatus.DELAYED } }, { $count: "count" }],
                    onTime: [
                        {
                            $match: {
                                status: ShipmentStatus.DELIVERED,
                                $expr: { $lte: ["$delivered_date", "$expected_delivery_date"] }
                            }
                        },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const exceptionCount = await Exception.countDocuments({ resolved: false });
        const res = stats[0];
        const delivered = res.delivered[0]?.count || 0;
        const onTime = res.onTime[0]?.count || 0;

        return {
            activeShipments: res.active[0]?.count || 0,
            delivered,
            exceptions: exceptionCount,
            delayed: res.delayed[0]?.count || 0,
            onTimePercent: delivered > 0 ? `${((onTime / delivered) * 100).toFixed(1)}%` : "100%"
        };
    }

    // src/modules/shipment/service.ts

    static async updateStatus(id: string, updateData: any, userId: string, userRole: string) {
        // CHANGE THIS: query by 'id' (your UUID field), not '_id'
        const query: any = { id: id };

        if (userRole !== UserRole.ADMIN && userRole !== UserRole.OPERATIONS) {
            query.created_by = userId;
        }

        const shipment = await Shipment.findOne(query);
        if (!shipment) throw new Error("Shipment not found or unauthorized");

        return await Shipment.findOneAndUpdate(
            query,
            { ...updateData, last_status_update: new Date() },
            { new: true }
        );
    }

    static async cancelShipment(id: string, userId: string, userRole: string) {
        // CHANGE THIS: query by 'id'
        const query: any = { id: id };

        if (userRole !== UserRole.ADMIN && userRole !== UserRole.OPERATIONS) {
            query.created_by = userId;
        }

        const shipment = await Shipment.findOneAndUpdate(
            query,
            { status: ShipmentStatus.CANCELLED, last_status_update: new Date() },
            { new: true }
        );

        if (!shipment) throw new Error("Shipment not found or unauthorized");
        return shipment;
    }

    static async exportShipments(userId: string, userRole: string, format: 'csv' | 'xlsx') {
        const query: any = {};
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.OPERATIONS) {
            query.created_by = userId;
        }

        // We use populate here too so the export shows names, not just IDs
        const shipments = await Shipment.find(query)
            .sort({ created_at: -1 })
            .populate('creator_details', 'name')
            .lean();

        const exportData = shipments.map((s: any) => ({
            'Shipment ID': s.shipment_id,
            'Client Name': s.client_name,
            'Origin': s.origin,
            'Destination': s.destination,
            'Status': s.status,
            'Carrier': s.carrier_name,
            'Created By': s.creator_details?.name || s.created_by, // Fallback to ID if name not found
            'Dispatch Date': s.dispatch_date ? new Date(s.dispatch_date).toLocaleDateString() : 'N/A',
            'Exp Delivery Date': s.expected_delivery_date ? new Date(s.expected_delivery_date).toLocaleDateString() : 'N/A'
        }));

        if (format === 'csv') {
            const json2csvParser = new Parser();
            return json2csvParser.parse(exportData);
        } else {
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Shipments');
            return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        }
    }
}