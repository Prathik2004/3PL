import { Shipment, ShipmentStatus } from '../../models/shipment';

export class ShipmentService {
  
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