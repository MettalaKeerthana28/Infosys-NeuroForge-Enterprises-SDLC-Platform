import type { JwtClaims } from "./types";

function base64UrlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? 0 : 4 - (input.length % 4);
  const b64 = (input + "=".repeat(pad)).replace(/-/g, "+").replace(/_/g, "/");
  if (typeof atob === "function") {
    try {
      return decodeURIComponent(
        atob(b64)
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(""),
      );
    } catch {
      return atob(b64);
    }
  }
  // Node fallback
  return Buffer.from(b64, "base64").toString("utf-8");
}

export function decodeJwt(token: string): JwtClaims | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return payload as JwtClaims;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string, skewSeconds = 30): boolean {
  const claims = decodeJwt(token);
  if (!claims?.exp) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return claims.exp - skewSeconds <= nowSec;
}

/** Build a fake JWT for mock/dev usage. */
export function encodeMockJwt(claims: JwtClaims): string {
  const header = { alg: "none", typ: "JWT" };
  const enc = (obj: unknown) =>
    (typeof btoa === "function"
      ? btoa(JSON.stringify(obj))
      : Buffer.from(JSON.stringify(obj)).toString("base64")
    )
      .replace(/=+$/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  return `${enc(header)}.${enc(claims)}.mock`;
}
