import "server-only";

import { createHash } from "node:crypto";

import { canonicalizeScope, stableStringify } from "./scope-fingerprint-client";

export function computeScopeFingerprint(scope: Record<string, unknown> | readonly string[]): string {
  const payload = Array.isArray(scope)
    ? { scope_keys: [...scope].sort() }
    : canonicalizeScope(scope as Record<string, unknown>);
  return createHash("md5").update(stableStringify(payload)).digest("hex");
}

export function computePayloadHash(input: {
  action_key: string;
  scope: Record<string, unknown>;
  organization_id: string;
  consumer_ref_id: string | null;
}): string {
  return createHash("md5")
    .update(
      stableStringify({
        action_key: input.action_key,
        consumer_ref_id: input.consumer_ref_id,
        organization_id: input.organization_id,
        scope_json: canonicalizeScope(input.scope),
      }),
    )
    .digest("hex");
}
