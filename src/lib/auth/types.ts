export type AppRole =
  | "SUPER_ADMIN"
  | "ORG_ADMIN"
  | "PROJECT_MANAGER"
  | "DEVELOPER"
  | "QA_TESTER"
  | "STAKEHOLDER"
  | "ROLE_USER";

export const ALL_ROLES: AppRole[] = [
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "PROJECT_MANAGER",
  "DEVELOPER",
  "QA_TESTER",
  "STAKEHOLDER",
  "ROLE_USER",
];

export interface JwtClaims {
  sub: string;
  id: string;
  name: string;
  role: AppRole;
  purpose?: string;
  exp?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp?: string;
}
