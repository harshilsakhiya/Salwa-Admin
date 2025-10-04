/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";

const TOKEN_KEY = "authToken";

type AuthContextValue = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  authFetch: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const login = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const authFetch = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const activeToken = localStorage.getItem(TOKEN_KEY);
      if (!activeToken) {
        logout();
        throw new Error("Authentication required");
      }

      const headers = new Headers(init.headers ?? {});
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${activeToken}`);
      }

      const response = await fetch(input, { ...init, headers });

      if (response.status === 401) {
        logout();
        showToast("Session expired. Please log in again.", "error");
        throw new Error("Session expired");
      }

      return response;
    },
    [logout, showToast]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ token, login, logout, authFetch }),
    [token, login, logout, authFetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
