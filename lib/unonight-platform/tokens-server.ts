import "server-only";

import { createHash } from "node:crypto";

export function hashUnonightAipifyToken(token: string): string {
  return createHash("sha256").update(token.trim()).digest("hex");
}
