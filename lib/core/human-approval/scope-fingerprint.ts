import { createHash } from "node:crypto";

/**
 * Canonical JSON contract shared with SQL `_cha_canonical_text()`.
 * Object keys sorted lexicographically; array order preserved.
 */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

export function canonicalizeScope(scope: Record<string, unknown>): Record<string, unknown> {
  return sortRecord(scope);
}

export function computeScopeFingerprint(scope: Record<string, unknown> | readonly string[]): string {
  const payload =
    Array.isArray(scope) ? { scope_keys: [...scope].sort() } : canonicalizeScope(scope);
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

function sortRecord(value: Record<string, unknown>): Record<string, unknown> {
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(value).sort()) {
    const entry = value[key];
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      sorted[key] = sortRecord(entry as Record<string, unknown>);
    } else if (Array.isArray(entry)) {
      sorted[key] = [...entry];
    } else {
      sorted[key] = entry;
    }
  }
  return sorted;
}

export const CANONICAL_HASH_TEST_VECTORS = [
  {
    name: "reordered object keys",
    scope: { b: 2, a: 1 },
    expectedCanonical: '{"a":1,"b":2}',
  },
  {
    name: "nested objects",
    scope: { outer: { z: true, a: null }, action_name: "draft" },
    expectedCanonical: '{"action_name":"draft","outer":{"a":null,"z":true}}',
  },
  {
    name: "array order preserved",
    scope: { tags: ["beta", "alpha"], action_name: "sync" },
    expectedCanonical: '{"action_name":"sync","tags":["beta","alpha"]}',
  },
  {
    name: "escaped string",
    scope: { note: 'Quote "inside"', action_name: "notify" },
    expectedCanonical: '{"action_name":"notify","note":"Quote \\"inside\\""}',
  },
] as const;

export function buildTrustActionScope(input: {
  action_name: string;
  resource_type: string | null;
  resource_id: string | null;
  skill_key: string | null;
}): Record<string, unknown> {
  return {
    action_name: input.action_name,
    resource_id: input.resource_id,
    resource_type: input.resource_type,
    skill_key: input.skill_key,
  };
}

export function summarizeScope(scope: Record<string, unknown>): string {
  const parts: string[] = [];
  if (typeof scope.action_name === "string" && scope.action_name) {
    parts.push(scope.action_name);
  }
  if (typeof scope.resource_type === "string" && scope.resource_type) {
    parts.push(scope.resource_type);
  }
  if (typeof scope.resource_id === "string" && scope.resource_id) {
    parts.push(scope.resource_id);
  }
  if (typeof scope.skill_key === "string" && scope.skill_key) {
    parts.push(scope.skill_key);
  }
  return parts.length > 0 ? parts.join(" · ") : "Approved operational scope";
}
