import fs from 'fs';
import csv from 'csv-parser';
import { Shipment } from '../../models/shipment';
import { ShipmentStatus, UserRole } from '../../types';
import { createShipmentSchema } from './validator';

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
                    const successfulInserts: string[] = []; // Explicitly type as string array

                    for (const item of results) {
                        try {
                            const validData = createShipmentSchema.parse(item.data);

                            const existing = await Shipment.findOne({ shipment_id: validData.shipment_id });
                            if (existing) {
                                throw new Error("Duplicate shipment_id");
                            }

                            const newShipment = await Shipment.create({
                                ...validData,
                                created_by: userId, // Changed from user_id to created_by
                                status: ShipmentStatus.CREATED,
                                pod_received: false,
                                last_status_update: new Date(),
                            });

                            successfulInserts.push(newShipment.shipment_id);
                        } catch (error: any) {
                            errors.push({
                                row: item.row,
                                shipment_id: item.data.shipment_id || 'Unknown',
                                issues: error.errors?.map((e: any) => e.message) || [error.message]
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
            created_by: userId, // Changed from user_id to created_by
            status: ShipmentStatus.CREATED,
            last_status_update: new Date()
        });
    }

    static async getShipments(filters: any, page: number, limit: number, userId: string, userRole: string) {
        const skip = (page - 1) * limit;
        
        const query: any = { status: { $ne: ShipmentStatus.CANCELLED } };

        // Admin/Operations see everything, others only see what they created
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.OPERATIONS) {
            query.created_by = userId; // Changed from user_id to created_by
        }

        if (filters.status) query.status = filters.status;
        if (filters.client) query.client_name = { $regex: filters.client, $options: 'i' };

        const [data, total] = await Promise.all([
            Shipment.find(query).sort({ created_at: -1 }).skip(skip).limit(limit),
            Shipment.countDocuments(query)
        ]);

        return { total, page, limit, data };
    }

    static async updateStatus(id: string, updateData: any, userId: string, userRole: string) {
        const query: any = { id };
        
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.OPERATIONS) {
            query.created_by = userId; // Changed from user_id to created_by
        }

        const shipment = await Shipment.findOne(query);
        if (!shipment) throw new Error("Shipment not found or unauthorized");

        if (updateData.status === ShipmentStatus.DELIVERED && updateData.delivered_date) {
            if (new Date(updateData.delivered_date) < new Date(shipment.dispatch_date)) {
                throw new Error("Delivered Date cannot be before Dispatch Date");
            }
        }

        return await Shipment.findOneAndUpdate(
            query, 
            { ...updateData, last_status_update: new Date() },
            { new: true }
        );
    }

    static async cancelShipment(id: string, userId: string, userRole: string) {
        const query: any = { id };
        
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.OPERATIONS) {
            query.created_by = userId; // Changed from user_id to created_by
        }

        const shipment = await Shipment.findOneAndUpdate(
            query,
            { status: ShipmentStatus.CANCELLED, last_status_update: new Date() },
            { new: true }
        );
        
        if (!shipment) throw new Error("Shipment not found or unauthorized");
        return shipment;
    }
}