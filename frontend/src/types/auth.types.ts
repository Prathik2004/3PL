// Authentication types and interfaces

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user?: {
    name: string;
    email: string;
    role: string;
    userId: string;
  };
}

export interface UserSessionData {
  id: string; // The MongoDB ObjectId or UUID
  email: string;
  name: string;
  role: string | "Admin" | "Operations" | "Viewer";
}
