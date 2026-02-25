// Shared authentication types and interfaces

export interface LoginPayload {
  email: string;
  password?: string; // Optional if we support passwordless or SSO later
}

// Ensure this matches exactly what `loginUser` in backend-js returns
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserSessionData {
  id: string; // The MongoDB ObjectId or UUID
  email: string;
  name: string;
  role: string | "Admin" | "Operations" | "Viewer";
}
