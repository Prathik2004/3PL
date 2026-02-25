export interface AppApiErrorDetails {
  [key: string]: unknown;
}

export interface AppApiErrorPayload {
  code: string;
  message: string;
  details?: AppApiErrorDetails;
}

export class AppApiError extends Error {
  public code: string;
  public details?: AppApiErrorDetails;
  public status?: number;

  constructor(message: string, code: string = "UNKNOWN_ERROR", status?: number, details?: AppApiErrorDetails) {
    super(message);
    this.name = "AppApiError";
    this.code = code;
    this.status = status;
    this.details = details;

    // Set prototype explicitly for extending Error in TypeScript/ES5 environments
    Object.setPrototypeOf(this, AppApiError.prototype);
  }
}
