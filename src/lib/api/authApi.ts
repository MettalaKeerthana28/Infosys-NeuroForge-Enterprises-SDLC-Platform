import { AUTH_API_URL, USE_MOCK_DATA } from "@/lib/env";
import { encodeMockJwt } from "@/lib/auth/jwt";
import type { AppRole, ApiEnvelope, AuthTokens } from "@/lib/auth/types";

async function request<T>(
  path: string,
  init: RequestInit & { query?: Record<string, string> } = {},
): Promise<ApiEnvelope<T>> {
  const url = new URL(path, AUTH_API_URL);
  if (init.query) for (const [k, v] of Object.entries(init.query)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !body?.success) {
    const message = body?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

// ---------- Mock helpers ----------
const MOCK_USERS: Record<string, { name: string; role: AppRole; password: string }> = {
  "super@neuroforge.dev": { name: "Ada Root", role: "SUPER_ADMIN", password: "Password@123" },
  "admin@neuroforge.dev": { name: "Oren Admin", role: "ORG_ADMIN", password: "Password@123" },
  "pm@neuroforge.dev": { name: "Priya Manager", role: "PROJECT_MANAGER", password: "Password@123" },
  "dev@neuroforge.dev": { name: "Dev Chen", role: "DEVELOPER", password: "Password@123" },
  "qa@neuroforge.dev": { name: "Quinn Tester", role: "QA_TESTER", password: "Password@123" },
  "stake@neuroforge.dev": { name: "Sasha Stake", role: "STAKEHOLDER", password: "Password@123" },
};

function mintMockTokens(email: string, name: string, role: AppRole): AuthTokens {
  const now = Math.floor(Date.now() / 1000);
  const access = encodeMockJwt({
    sub: email,
    id: `u_${email}`,
    name,
    role,
    purpose: "ACCESS",
    exp: now + 60 * 60 * 24,
  });
  const refresh = encodeMockJwt({
    sub: email,
    id: `u_${email}`,
    name,
    role,
    purpose: "REFRESH",
    exp: now + 60 * 60 * 24 * 7,
  });
  return { accessToken: access, refreshToken: refresh, tokenType: "Bearer", expiresIn: 86400000 };
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- API ----------
export const authApi = {
  async sendOtp(email: string) {
    if (USE_MOCK_DATA) {
      await wait(400);
      return { success: true, message: "OTP sent (mock: use 123456)", data: null };
    }
    return request<null>("/auth/send-otp", { method: "POST", query: { email } });
  },

  async register(input: { name: string; email: string; otp: string; password: string }) {
    if (USE_MOCK_DATA) {
      await wait(500);
      if (input.otp !== "123456") throw new Error("Invalid OTP");
      return { success: true, message: "User registered successfully", data: null };
    }
    return request<null>("/auth/register", { method: "POST", body: JSON.stringify(input) });
  },

  async login(input: { email: string; password: string }): Promise<AuthTokens> {
    if (USE_MOCK_DATA) {
      await wait(500);
      const key = input.email.trim().toLowerCase();
      const user = MOCK_USERS[key];
      if (!user || user.password !== input.password) {
        throw new Error("Invalid credentials. Try any demo email with Password@123");
      }
      return mintMockTokens(key, user.name, user.role);
    }
    const res = await request<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return res.data;
  },

  async forgotPasswordSendOtp(email: string) {
    if (USE_MOCK_DATA) {
      await wait(400);
      return { success: true, message: "OTP sent (mock: use 123456)", data: null };
    }
    return request<null>("/auth/forgot-password/send-otp", {
      method: "PATCH",
      query: { email },
    });
  },

  async resetPassword(input: { email: string; otp: string; password: string }) {
    if (USE_MOCK_DATA) {
      await wait(500);
      if (input.otp !== "123456") throw new Error("Invalid OTP");
      return { success: true, message: "Password reset", data: null };
    }
    return request<null>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    if (USE_MOCK_DATA) {
      await wait(200);
      throw new Error("Refresh unavailable in mock mode");
    }
    const res = await request<AuthTokens>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    return res.data;
  },

  googleLoginUrl(): string {
    return `${AUTH_API_URL}/oauth/google-login`;
  },
};

export { MOCK_USERS };
