export interface StatusIconProps {
  // text: "In Transit" | "Dispatched" | "Delayed" | "Created" | "Delivered"
  text: string
}

export interface ShipmentRowProps {
  shipmentId: string;      // Human-readable e.g. "SHP-001"
  internalId: string;      // UUID used for PUT/DELETE API calls
  _mongoId?: string;       // MongoDB _id for exception lookups
  client: string;
  lastUpdated: string;
  carrier: string;
  dest: string;
  expDel: string
  alert: string;
  alertColor?: "Yellow" | "Red" | "None";
  status: string;
  origin: string;
}

export interface ModalProps {
  onClose: () => void
}

// --- API Types ---

export interface ShipmentResponse {
  id: string;           // UUID from backend (used for PUT/DELETE)
  _id?: string;         // MongoDB ObjectId
  shipment_id: string;
  client_name: string;
  origin: string;
  destination: string;
  dispatch_date: string;
  expected_delivery_date: string;
  carrier_name: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  delivered_date?: string;
  pod_received?: boolean;
  active_exception?: {
    exception_type: string;
    description: string;
  };
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

export type Roles = "Viewer" | "Operations" | "Admin";