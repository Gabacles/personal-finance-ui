"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import {
  useAuthControllerLogin,
  useAuthControllerRegister,
} from "@/generated/api/auth/auth";
import type {
  AuthControllerLogin200,
  AuthControllerRegister201,
} from "@/generated/api/personalFinanceAPI.schemas";
import { extractApiError } from "@/modules/auth/utils/errors";
import { persistSession, clearSession } from "@/lib/auth-session";
import type {
  LoginFormData,
  RegisterFormData,
} from "@/modules/auth/types/auth.types";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

export interface AuthContextValue {
  /** True while the initial session check is in-flight (page refresh). */
  isLoading: boolean;
  /** True once the user has a valid session cookie. */
  isAuthenticated: boolean;
  /** True while a login or register request is in-flight. */
  isPending: boolean;
  /** Error message from the last failed login or register attempt. */
  error: string | null;
  login: (data: LoginFormData) => void;
  logout: () => Promise<void>;
  register: (data: RegisterFormData) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  function extractTokenFromAuthResponse(
    data: AuthControllerLogin200 | AuthControllerRegister201,
  ): string {
    // The OpenAPI spec declares accessToken at the top level, but the actual
    // API wraps the payload inside a "data" envelope: { data: { accessToken } }.
    // After customInstance unwraps the Axios response layer (.then(({ data }) => data)),
    // we may still have a nested { data: { accessToken } } structure.
    // We handle both shapes here so the token is always extracted correctly.
    const nested = (data as unknown as { data?: AuthControllerLogin200 }).data;
    const token = data.accessToken ?? nested?.accessToken;
    if (!token) {
      throw new Error(
        `Authentication response did not include accessToken. Received keys: ${Object.keys(data as object).join(", ")}`,
      );
    }
    return token;
  }

  // Restore session state on mount / page refresh.
  // The token is HttpOnly so JS cannot read it directly — we ask the server
  // whether the cookie exists without revealing its value.
  useEffect(() => {
    fetch("/api/auth/status")
      .then<{ authenticated: boolean }>((res) => res.json())
      .then(({ authenticated }) => setIsAuthenticated(authenticated))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  // ---------------------------------------------------------------------------
  // Mutations (owned here so the whole app shares a single auth state)
  // ---------------------------------------------------------------------------

  const loginMutation = useAuthControllerLogin({
    mutation: {
      onSuccess: async (data) => {
        try {
          setSessionError(null);
          const token = extractTokenFromAuthResponse(data);
          await persistSession(token);
          setIsAuthenticated(true);
          router.push("/dashboard");
        } catch {
          setIsAuthenticated(false);
          setSessionError("Could not create your session. Please try again.");
        }
      },
      onError: () => setSessionError(null),
    },
  });

  const registerMutation = useAuthControllerRegister({
    mutation: {
      onSuccess: async (data) => {
        try {
          setSessionError(null);
          const token = extractTokenFromAuthResponse(data);
          await persistSession(token);
          setIsAuthenticated(true);
          router.push("/dashboard");
        } catch {
          setIsAuthenticated(false);
          setSessionError("Could not create your session. Please try again.");
        }
      },
      onError: () => setSessionError(null),
    },
  });

  // ---------------------------------------------------------------------------
  // Public actions
  // ---------------------------------------------------------------------------

  function login(data: LoginFormData) {
    loginMutation.mutate({ data });
  }

  function register(data: RegisterFormData) {
    registerMutation.mutate({ data });
  }

  async function logout() {
    await clearSession();
    // Clear all cached API data so a future login doesn't see a previous
    // user's data even momentarily.
    queryClient.clear();
    setIsAuthenticated(false);
    router.push("/login");
  }

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const isPending = loginMutation.isPending || registerMutation.isPending;

  const rawError = loginMutation.error ?? registerMutation.error;
  const error =
    sessionError ??
    (rawError
      ? extractApiError(
          rawError,
          loginMutation.error
            ? "Invalid credentials. Please try again."
            : "Registration failed. Please try again.",
        )
      : null);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        isPending,
        error,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
