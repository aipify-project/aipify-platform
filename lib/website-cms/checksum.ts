/**
 * Pure, dependency-free checksum helpers for client-side display and
 * optimistic-conflict hints. The authoritative checksum is always computed
 * server-side (md5 via `_website_cms_checksum`) inside the candidate-build
 * and publish RPCs — these helpers never gate a publish decision on their own.
 */

/** Deterministic key ordering so equal objects always produce the same string. */
export function canonicalStringify(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value));
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    const result: Record<string, unknown> = {};
    for (const [key, val] of entries) {
      result[key] = sortKeysDeep(val);
    }
    return result;
  }
  return value;
}

/** FNV-1a 32-bit hash, hex-encoded — fast, pure, and stable across runtimes. */
export function fingerprint(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function fingerprintContent(content: unknown, seo: unknown = {}): string {
  return fingerprint(`${canonicalStringify(content)}|${canonicalStringify(seo)}`);
}

export function fingerprintsMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  return a === b;
}
