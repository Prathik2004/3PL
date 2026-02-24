 // src/services/api.ts

// Simulated environment variable for base URL or default
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper to get token (can be replaced with actual auth logic, e.g., getting from localStorage or cookies)
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Replace with real logic if needed
    return localStorage.getItem("token") || "mock_jwt_token";
  }
  return null;
};

/**
 * Basic fetch wrapper to automatically add Authorization headers
 * and handle common JSON parsing and errors.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = "An error occurred while fetching data.";
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || JSON.stringify(errorData);
    } catch {
      // Ignore if parsing fails
    }
    throw new Error(errorMsg);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
