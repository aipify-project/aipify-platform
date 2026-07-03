import { createHash } from "node:crypto";

/** Stable JSON serialization — keys sorted recursively (matches SQL jsonb sort intent). */
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

export function computeScopeFingerprint(scope: Record<string, unknown> | readonly string[]): string {
  const payload =
    Array.isArray(scope) ? { scope_keys: [...scope].sort() } : sortRecord(scope);
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
        scope_json: sortRecord(input.scope),
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
