import { createHash } from "crypto";

export function deriveSessionFingerprint(accessToken: string): string {
  return createHash("sha256").update(accessToken).digest("hex");
}
