import { resolveBaseUrl } from "./urlResolver";
import { AppApiError } from "../errors/AppError";

type ApiFetchOptions = RequestInit & {
  isForm?: boolean;
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Check for both common keys just in case
    return localStorage.getItem("accessToken") || localStorage.getItem("token") || null;
  }
  return null;
};

/**
 * Standardized API client wrapping native fetch to auto-inject the active backend URL,
 * authentication headers, and throw specific `AppApiError` types on failure.
 */
export async function apiClient<T>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const baseUrl = resolveBaseUrl();
  const token = getToken();

  // Make sure endpoint starts with `/` if baseUrl ends with `/` appropriately, or let URL handle it
  // Ensure consistent leading slash
  if (!endpoint.startsWith("/")) {
    endpoint = `/${endpoint}`;
  }

  const url = `${baseUrl}${endpoint}`;
  const headers = new Headers(options.headers || {});

  // Inject Authorization Header
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Inject standard content type if not FormData
  if (!options.isForm && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (response.status === 204) {
      return {} as T;
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // If it's not JSON, capture the text
        const textError = await response.text();
        throw new AppApiError(textError || "An unexpected error occurred", "HTTP_ERROR", response.status);
      }

      // Read standard standardized API payload or fallback to legacy format
      const message = errorData?.error?.message || errorData?.message || errorData?.error || "An API Error Occurred";
      const code = errorData?.error?.code || "BACKEND_ERROR";
      const details = errorData?.error?.details || errorData?.details;

      throw new AppApiError(message, code, response.status, details);
    }

    // Success
    return await response.json();
  } catch (error) {
    if (error instanceof AppApiError) {
      throw error;
    }
    // Network errors (CORS, Unreachable)
    throw new AppApiError(
      error instanceof Error ? error.message : "Network failure",
      "NETWORK_ERROR",
      0
    );
  }
}
