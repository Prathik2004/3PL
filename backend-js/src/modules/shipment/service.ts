import fs from 'fs';
import csv from 'csv-parser';
import { Shipment } from '../../models/shipment';
import { ShipmentStatus } from '../../types';
import { createShipmentSchema } from './validator';

export class ShipmentService {


    static async processCsvUpload(filePath: string): Promise<any> {
        const results: any[] = [];
        const errors: any[] = [];
        let rowNumber = 1; // Header is row 1, data starts at row 2

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    rowNumber++;
                    results.push({ row: rowNumber, data });
                })
                .on('end', async () => {
                    const successfulInserts = [];

                    for (const item of results) {
                        try {
                            // 1. Zod Validation (handles data types and Dispatch < Expected logic)
                            const validData = createShipmentSchema.parse(item.data);

                            // 2. Duplicate ID Check [cite: 46]
                            const existing = await Shipment.findOne({ shipment_id: validData.shipment_id });
                            if (existing) {
                                throw new Error("Duplicate shipment_id");
                            }

                            // 3. Database Insertion
                            const newShipment = await Shipment.create({
                                ...validData,
                                status: ShipmentStatus.CREATED,
                                pod_received: false,
                                last_status_update: new Date(),
                            });

                            successfulInserts.push(newShipment.shipment_id);
                        } catch (error: any) {
                            // Collect row-level errors [cite: 47]
                            errors.push({
                                row: item.row,
                                shipment_id: item.data.shipment_id || 'Unknown',
                                issues: error.errors?.map((e: any) => e.message) || [error.message]
                            });
                        }
                    }

                    // Clean up the uploaded file from the server
                    fs.unlinkSync(filePath);

                    // Resolve with the error report and success metrics
                    resolve({
                        total_processed: rowNumber - 1,
                        successful_count: successfulInserts.length,
                        successes: successfulInserts,
                        error_count: errors.length,
                        errors: errors
                    });
                })
                .on('error', (error) => {
                    // Clean up file on stream error
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    reject(error);
                });
        });
    }

    static async createShipment(data: any) {
        // Now 'Shipment' is a value/model, so .findOne() will work
        const existing = await Shipment.findOne({ shipment_id: data.shipment_id });
        if (existing) throw new Error("Duplicate shipment_id");

        return await Shipment.create({
            ...data,
            status: ShipmentStatus.CREATED,
            last_status_update: new Date()
        });
    }

    static async getShipments(filters: any, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const query: any = { status: { $ne: ShipmentStatus.CANCELLED } };

        if (filters.status) query.status = filters.status;
        if (filters.client) query.client_name = { $regex: filters.client, $options: 'i' };

        const [data, total] = await Promise.all([
            Shipment.find(query).sort({ created_at: -1 }).skip(skip).limit(limit),
            Shipment.countDocuments(query)
        ]);

        return { total, page, limit, data };
    }

    static async updateStatus(id: string, updateData: any) {
        const shipment = await Shipment.findOne({ id });
        if (!shipment) throw new Error("Shipment not found");

        // SRS Logic: Delivered Date cannot be before Dispatch Date
        if (updateData.status === ShipmentStatus.DELIVERED && updateData.delivered_date) {
            if (new Date(updateData.delivered_date) < new Date(shipment.dispatch_date)) {
                throw new Error("Delivered Date cannot be before Dispatch Date");
            }
        }

        return await Shipment.findOneAndUpdate(
            { id },
            { ...updateData, last_status_update: new Date() },
            { new: true }
        );
    }

    static async cancelShipment(id: string) {
        return await Shipment.findOneAndUpdate(
            { id },
            { status: ShipmentStatus.CANCELLED, last_status_update: new Date() },
            { new: true }
        );
    }
}