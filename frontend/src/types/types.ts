export interface StatusIconProps{
    // text: "In Transit" | "Dispatched" | "Delayed" | "Created" | "Delivered"
    text: string
}

// frontend/src/types/types.ts

export interface PaginatedShipments {
    total: number;
    page: number;
    limit: number;
    data: any[]; // Or your specific Shipment interface
}

export interface CreateShipmentPayload {
    shipment_id: string;
    client_name: string;
    carrier_name: string;
    destination: string;
    expected_delivery_date: string;
}

export interface UpdateShipmentStatusPayload {
    status: string;
    delivered_date?: string;
}

export interface BulkUploadResponse {
    total_processed: number;
    successful_count: number;
    successes: string[];
    error_count: number;
    errors: any[];
}

// Ensure ShipmentRowProps is also exported for the Table
export interface ShipmentRowProps {
    shipmentId: string;
    client: string;
    lastUpdated: string;
    carrier: string;
    dest: string;
    expDel: string;
    alert: string;
    alertColor: "Red" | "Yellow" | "None";
    status: string;
}

export interface ModalProps{
    onClose: ()=> void
}

export type Roles="Viewer" | "Operations" | "Admin";