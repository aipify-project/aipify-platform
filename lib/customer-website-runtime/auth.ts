import "server-only";

import { isInstallTokenFormat } from "@/lib/auth/install-token";

const TOKEN_HEADER = "x-aipify-installation-token";
const AUTH_HEADER = "authorization";

/** Extract install token from Authorization Bearer or dedicated header. Never log the value. */
export function extractInstallationToken(request: Request): string | null {
  const dedicated = request.headers.get(TOKEN_HEADER)?.trim();
  if (dedicated && isInstallTokenFormat(dedicated)) return dedicated;

  const auth = request.headers.get(AUTH_HEADER)?.trim();
  if (auth?.toLowerCase().startsWith("bearer ")) {
    const token = auth.slice(7).trim();
    if (isInstallTokenFormat(token)) return token;
  }

  return null;
}

export function isValidRuntimeIdempotencyKey(key: unknown): key is string {
  return typeof key === "string" && key.length >= 8 && key.length <= 128;
}

export const RUNTIME_NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
} as const;
