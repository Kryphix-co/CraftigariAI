"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiClientError, apiGet, apiPost } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [artisan, setArtisan] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const refreshAuth = useCallback(async ({ signal, showLoading = true } = {}) => {
    if (showLoading) setStatus("loading");
    setError("");
    try {
      const data = await apiGet("/api/auth/me", { signal });
      setArtisan(data.artisan);
      setProfileComplete(Boolean(data.profileComplete));
      setStatus("authenticated");
      return data;
    } catch (requestError) {
      if (requestError.name === "AbortError") return null;
      setArtisan(null);
      setProfileComplete(false);
      if (requestError instanceof ApiClientError && requestError.status === 401) {
        setStatus("unauthenticated");
      } else {
        setError(requestError.message || "Unable to check your session.");
        setStatus("error");
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      refreshAuth({ signal: controller.signal, showLoading: false });
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    await apiPost("/api/auth/logout");
    setArtisan(null);
    setProfileComplete(false);
    setStatus("unauthenticated");
  }, []);

  const updateAuthenticatedArtisan = useCallback((nextArtisan, complete) => {
    setArtisan(nextArtisan);
    setProfileComplete(Boolean(complete));
    setStatus("authenticated");
  }, []);

  const value = useMemo(
    () => ({
      artisan,
      error,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      logout,
      profileComplete,
      refreshAuth,
      status,
      updateAuthenticatedArtisan,
    }),
    [
      artisan,
      error,
      logout,
      profileComplete,
      refreshAuth,
      status,
      updateAuthenticatedArtisan,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
