"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LoginPayload } from "../../types/auth.types";
import { authService } from "../services/auth.service";
import { AppApiError } from "../errors/AppError";

// A basic User interface. You might decode this from the JWT later.
export interface User {
  name: string;
  email: string;
  role: string | "Admin" | "Operations" | "Viewer";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from LocalStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Fallback if no user is saved
          setUser({ name: "Alex Thompson", email: "user@walkwel.com", role: "Unknown" });
        }
      } catch {
        console.error("Invalid token found in storage");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (payload: LoginPayload) => {
    try {
      const tokens = await authService.login(payload);

      localStorage.setItem("accessToken", tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem("refreshToken", tokens.refreshToken);
      }

      if (tokens.user) {
        const u: User = { name: tokens.user.name, email: tokens.user.email, role: tokens.user.role };
        localStorage.setItem("user", JSON.stringify(u));
        setUser(u);
      } else {
        setUser({ name: "Alex Thompson", email: payload.email, role: "Unknown" });
      }
    } catch (error) {
      if (error instanceof AppApiError) {
        // We throw it so the `useAuth` hook caller (e.g. LoginCard) can show a Toast.
        throw error;
      }
      throw new Error("Login failed unexpectedly");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Backend logout failed", error);
    } finally {
      // Always clear local state even if backend fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to cleanly access the Authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
