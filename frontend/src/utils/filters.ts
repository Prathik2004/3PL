// src/utils/filters.ts
// Speaks to the backend to provide filter dropdown data.

import { apiClient } from "../lib/api/client";

export interface BackendClientData {
    id: string;
    name: string;
    active: boolean;
}

export interface BackendCarrierData {
    id: string;
    code: string;
    name: string;
}

/**
 * Fetches distinct client names from GET /api/shipments/clients
 * Maps them into BackendClientData shape for useFilterOptions.
 */
export async function fetchClientsApi(): Promise<BackendClientData[]> {
    const res = await apiClient<{ data: string[] }>("/shipments/clients");
    return res.data.map((name) => ({ id: name, name, active: true }));
}

/**
 * Fetches distinct carrier names from GET /api/shipments/carriers
 * Maps them into BackendCarrierData shape for useFilterOptions.
 */
export async function fetchCarriersApi(): Promise<BackendCarrierData[]> {
    const res = await apiClient<{ data: string[] }>("/shipments/carriers");
    return res.data.map((name) => ({ id: name, code: name.toUpperCase().slice(0, 5), name }));
}
