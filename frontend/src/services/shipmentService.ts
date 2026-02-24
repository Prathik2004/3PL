import { apiFetch } from "./api";
import {
  PaginatedShipments,
  CreateShipmentPayload,
  UpdateShipmentStatusPayload,
  BulkUploadResponse,
} from "../types/types";

export const shipmentService = {
  // GET /api/shipments
  getAllShipments: async (page = 1, limit = 50, filters?: Record<string, string>): Promise<PaginatedShipments> => {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...filters,
    });
    return apiFetch<PaginatedShipments>(`/shipments?${queryParams}`);
  },

  // POST /api/shipments
  createShipment: async (payload: CreateShipmentPayload): Promise<{ message: string; id: string }> => {
    return apiFetch<{ message: string; id: string }>("/shipments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // POST /api/shipments/upload
  bulkUpload: async (file: File): Promise<BulkUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    // apiFetch automatically handles not overriding multipart/form-data headers
    return apiFetch<BulkUploadResponse>("/shipments/upload", {
      method: "POST",
      body: formData,
    });
  },

  // PUT /api/shipments/:id/status
  updateShipmentStatus: async (
    id: string,
    payload: UpdateShipmentStatusPayload
  ): Promise<{ id: string; status: string; last_status_update: string }> => {
    return apiFetch<{ id: string; status: string; last_status_update: string }>(`/shipments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // DELETE /api/shipments/:id
  cancelShipment: async (id: string): Promise<{ id: string; status: string }> => {
    return apiFetch<{ id: string; status: string }>(`/shipments/${id}`, {
      method: "DELETE",
    });
  },
};
