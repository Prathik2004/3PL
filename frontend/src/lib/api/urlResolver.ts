import { env } from "../../config/env";

export type BackendType = "js" | "php" | "python";

const LS_BACKEND_KEY = "3PL_ACTIVE_BACKEND";

/**
 * Gets the current active backend from localStorage (override) or environment variables.
 * Note: localStorage is only available in the browser.
 */
export const getActiveBackend = (): BackendType => {
  if (typeof window !== "undefined") {
    const override = localStorage.getItem(LS_BACKEND_KEY) as BackendType | null;
    if (override && ["js", "php", "python"].includes(override)) {
      return override;
    }
  }
  return env.NEXT_PUBLIC_ACTIVE_BACKEND;
};

/**
 * Sets the active backend in localStorage to override the environment default.
 */
export const setActiveBackend = (backend: BackendType) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_BACKEND_KEY, backend);
    // You might want to reload the page or trigger a re-fetch event here
  }
};

/**
 * Resolves the base URL for the active backend.
 */
export const resolveBaseUrl = (): string => {
  const activeBackend = getActiveBackend();

  switch (activeBackend) {
    case "js":
      return env.NEXT_PUBLIC_BACKEND_JS_URL;
    case "php":
      return env.NEXT_PUBLIC_BACKEND_PHP_URL;
    case "python":
      return env.NEXT_PUBLIC_BACKEND_PYTHON_URL;
    default:
      return env.NEXT_PUBLIC_BACKEND_JS_URL;
  }
};
