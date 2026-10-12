import type { AccessControlCorrelationId } from "./types";

/** Opaque correlation id for access-plane logs (no PII / secrets). Client-safe. */
export function createAccessCorrelationId(): AccessControlCorrelationId {
  const webCrypto = globalThis.crypto;
  if (webCrypto && typeof webCrypto.randomUUID === "function") {
    return `acp_${webCrypto.randomUUID()}`;
  }
  return `acp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
