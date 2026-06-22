import { createHash } from "node:crypto";

import { UNONIGHT_AIPIFY_TOKEN_PREFIX } from "./constants";

export function hashUnonightAipifyToken(token: string): string {
  return createHash("sha256").update(token.trim()).digest("hex");
}

export function maskUnonightAipifyTokenPrefix(prefix = UNONIGHT_AIPIFY_TOKEN_PREFIX): string {
  return `${prefix}••••••••`;
}
