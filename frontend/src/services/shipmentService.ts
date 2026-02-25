import { apiClient } from "../lib/api/client";
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
  getAllShipments: async (page: number, limit: number, filters: Record<string, string>) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...filters
        });
        
        return apiClient<PaginatedShipments>(`/shipments?${params.toString()}`);
    },

    getStats: async (): Promise<DashboardStats> => {
        return apiClient<DashboardStats>('/shipments/stats');
    },

  // POST /api/shipments
  createShipment: async (payload: CreateShipmentPayload): Promise<{ message: string; id: string }> => {
    return apiClient<{ message: string; id: string }>("/shipments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // POST /api/shipments/upload
  bulkUpload: async (file: File): Promise<BulkUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient<BulkUploadResponse>("/shipments/upload", {
      method: "POST",
      body: formData,
      isForm: true, // Tell client not to force application/json
    });
  },

  // PUT /api/shipments/:id/status
  updateShipmentStatus: async (
    id: string,
    payload: UpdateShipmentStatusPayload
  ): Promise<{ id: string; status: string; last_status_update: string }> => {
    return apiClient<{ id: string; status: string; last_status_update: string }>(`/shipments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // DELETE /api/shipments/:id
  cancelShipment: async (id: string): Promise<{ id: string; status: string }> => {
    return apiClient<{ id: string; status: string }>(`/shipments/${id}`, {
      method: "DELETE",
    });
  },
};