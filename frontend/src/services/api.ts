const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Check for both common keys just in case
    return localStorage.getItem("accessToken") || localStorage.getItem("token") || null;
  }
  return null;
};

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
      errorMsg = errorData.error || errorData.message || JSON.stringify(errorData);
    } catch { }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}