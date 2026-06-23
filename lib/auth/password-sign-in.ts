import { isFetchNetworkError } from "@/lib/pwa/manifest-audit";

export type PasswordSignInFailureCode =
  | "required_fields"
  | "invalid_credentials"
  | "email_not_confirmed"
  | "network"
  | "session_expired"
  | "rate_limited"
  | "auth_failed";

export function classifyPasswordSignInFailure(message: string): PasswordSignInFailureCode {
  const normalized = message.toLowerCase();

  if (isFetchNetworkError(message)) {
    return "network";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("429")
  ) {
    return "rate_limited";
  }

  if (
    normalized.includes("refresh token") ||
    normalized.includes("session expired") ||
    normalized.includes("session missing") ||
    normalized.includes("invalid jwt") ||
    normalized.includes("token has expired")
  ) {
    return "session_expired";
  }

  if (normalized.includes("email not confirmed")) {
    return "email_not_confirmed";
  }

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return "invalid_credentials";
  }

  return "auth_failed";
}

export function parsePasswordSignInPayload(body: unknown): { email: string; password: string } | null {
  if (!body || typeof body !== "object") return null;

  const record = body as Record<string, unknown>;
  const email = normalizeSignInEmail(typeof record.email === "string" ? record.email : "");
  const password = typeof record.password === "string" ? record.password : "";

  if (!email || !password) return null;
  return { email, password };
}

export function normalizeSignInEmail(email: string): string {
  return email.trim().toLowerCase();
}
