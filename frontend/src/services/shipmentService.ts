import { apiFetch } from "./api";
import {
  PaginatedShipments,
  CreateShipmentPayload,
  UpdateShipmentStatusPayload,
  BulkUploadResponse,
} from "../types/types";

export interface DashboardStats {
    activeShipments: number;
    delivered: number;
    exceptions: number;
    delayed: number;
    onTimePercent: string;
}

export const shipmentService = {
  // GET /api/shipments
  getAllShipments: async (page: number, limit: number, filters: any) => {
        // FIX: Build query string manually for apiFetch
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });
        
        const response = await apiFetch<PaginatedShipments>(`/shipments?${params.toString()}`);
        return response;
    },

    getStats: async (): Promise<DashboardStats> => {
        const response = await apiFetch<DashboardStats>('/shipments/stats');
        return response;
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