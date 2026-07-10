import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { tokenStore } from "./tokens";
import { decodeJwt, encodeMockJwt, isJwtExpired } from "./jwt";
import type { AppRole, AuthTokens, AuthUser } from "./types";

interface AuthContextValue {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
  /** Dev-only: swap current session's role for previewing dashboards. */
  overrideRole: (role: AppRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function userFromTokens(tokens: AuthTokens | null): AuthUser | null {
  if (!tokens?.accessToken) return null;
  const claims = decodeJwt(tokens.accessToken);
  if (!claims) return null;
  return {
    id: claims.id ?? claims.sub,
    name: claims.name ?? claims.sub,
    email: claims.sub,
    role: (claims.role as AppRole) ?? "ROLE_USER",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = tokenStore.get();
    if (stored?.accessToken && !isJwtExpired(stored.accessToken)) {
      setTokens(stored);
    } else if (stored) {
      tokenStore.clear();
    }
    setIsReady(true);
  }, []);

  const login = useCallback((t: AuthTokens) => {
    tokenStore.set(t);
    setTokens(t);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setTokens(null);
  }, []);

  const overrideRole = useCallback(
    (role: AppRole) => {
      if (!tokens) return;
      const claims = decodeJwt(tokens.accessToken);
      if (!claims) return;
      const next: AuthTokens = {
        ...tokens,
        accessToken: encodeMockJwt({ ...claims, role }),
      };
      tokenStore.set(next);
      setTokens(next);
    },
    [tokens],
  );

  const user = useMemo(() => userFromTokens(tokens), [tokens]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      tokens,
      isAuthenticated: !!user,
      isReady,
      login,
      logout,
      overrideRole,
    }),
    [user, tokens, isReady, login, logout, overrideRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
