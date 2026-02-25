export interface StatusIconProps {
  // text: "In Transit" | "Dispatched" | "Delayed" | "Created" | "Delivered"
  text: string
}

export interface ShipmentRowProps {
  shipmentId: string;
  client: string;
  lastUpdated: string;
  carrier: string;
  dest: string;
  // expDel: Date;
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
// Re-exporting from the monorepo shared folder to seamlessly bridge frontend to shared definitions
export type {
  ShipmentResponse,
  PaginatedShipments,
  CreateShipmentPayload,
  UpdateShipmentStatusPayload,
  BulkUploadResponse,
  Roles,
} from "../../../shared/types/api.types";