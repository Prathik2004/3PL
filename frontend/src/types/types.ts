export interface StatusIconProps {
  // text: "In Transit" | "Dispatched" | "Delayed" | "Created" | "Delivered"
  text: string
}

export interface ShipmentRowProps{
    shipmentId: string;
    client: string;
    lastUpdated: string;
    carrier: string;
    dest: string;
    // expDel: Date;
    expDel: string
    alert: string;
    alertColor?: "Yellow" | "Red" | "None";
    status: string
}

export interface ModalProps {
  onClose: () => void
}

// --- API Types ---

export interface ShipmentResponse {
  shipment_id: string;
  client_name: string;
  origin: string;
  destination: string;
  dispatch_date: string;
  expected_delivery_date: string;
  carrier_name: string;
  status: string;
  created_at?: string;
  delivered_date?: string;
  pod_received?: boolean;
}

export interface PaginatedShipments {
  total: number;
  page: number;
  limit: number;
  data: ShipmentResponse[];
}

export interface CreateShipmentPayload {
  shipment_id: string;
  client_name: string;
  origin: string;
  destination: string;
  dispatch_date: string;
  expected_delivery_date: string;
  carrier_name: string;
}

export interface UpdateShipmentStatusPayload {
  status: string;
  delivered_date?: string;
  pod_received?: boolean;
}

export interface BulkUploadResponse {
  total_processed: number;
  successful_count: number;
  successes: string[];
  error_count: number;
  errors: { row: number; shipment_id: string; issues: string[] }[];
}

export type Roles="Viewer" | "Operations" | "Admin";