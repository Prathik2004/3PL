import { apiClient } from "../api/client";
import { LoginPayload, AuthTokens } from "../../types/auth.types";

export const authService = {
  /**
   * Authenticates a user with the backend and returns their JWT tokens.
   */
  login: async (payload: LoginPayload): Promise<AuthTokens> => {
    return apiClient<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Instructs the backend to invalidate the refresh token.
   */
  logout: async (): Promise<{ message: string }> => {
    return apiClient<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  }
};
