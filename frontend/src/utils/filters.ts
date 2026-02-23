// src/api/filters.ts
// This entire file is dedicated to just speaking with your backend over HTTP/HTTPS.

// Mock response interfaces referencing what your backend might return natively
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

// ----------------------------------------
// API FUNCTIONS
// Replace the URLs with your actual backend endpoints
// ----------------------------------------

export async function fetchClientsApi(): Promise<BackendClientData[]> {
    // try {
    //    const response = await fetch('http://localhost:3000/api/v1/clients'); // Your live NestJS URL
    //    if (!response.ok) throw new Error('Network error');
    //    return await response.json();
    // } catch (e) {
    //    console.error(e);
    //    throw e;
    // }

    // Returning mock data for now so the UI continues working until you hook up the URL
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 'alpha', name: 'Alpha Retail Solutions', active: true },
                { id: 'zion', name: 'Zion Logistics Group', active: true },
                { id: 'metro', name: 'Metro Food Dist.', active: true },
            ]);
        }, 800); // Artificial delay to simulate real network request
    });
}

export async function fetchCarriersApi(): Promise<BackendCarrierData[]> {
    // try {
    //    const response = await fetch('http://localhost:3000/api/v1/carriers'); 
    // ...
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 'fedex', code: 'FDX', name: 'FedEx' },
                { id: 'ups', code: 'UPS', name: 'UPS' },
                { id: 'usps', code: 'USPS', name: 'USPS' },
                { id: 'dhl', code: 'DHL', name: 'DHL' },
            ]);
        }, 800);
    });
}
