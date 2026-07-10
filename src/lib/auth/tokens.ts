import type { AuthTokens } from "./types";

const KEY = "neuroforge.auth.tokens";

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

export const tokenStore = {
  get(): AuthTokens | null {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AuthTokens) : null;
    } catch {
      return null;
    }
  },
  set(tokens: AuthTokens) {
    if (!isBrowser()) return;
    window.localStorage.setItem(KEY, JSON.stringify(tokens));
  },
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(KEY);
  },
};
