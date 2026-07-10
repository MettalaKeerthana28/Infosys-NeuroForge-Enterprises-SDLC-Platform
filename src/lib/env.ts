export const AUTH_API_URL =
  (import.meta.env.VITE_AUTH_API_URL as string | undefined) ?? "http://localhost:8081";
export const CORE_API_URL =
  (import.meta.env.VITE_CORE_API_URL as string | undefined) ?? "http://localhost:8080";
export const USE_MOCK_DATA =
  String(import.meta.env.VITE_USE_MOCK_DATA ?? "true").toLowerCase() === "true";
