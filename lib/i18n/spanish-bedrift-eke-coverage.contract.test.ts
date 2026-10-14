/**
 * Spanish translation completion — Bedrift hubs + employeeKnowledge scopes.
 * Fails if es silently falls back to English for the in-scope UI strings.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function readJson(rel: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function getAt(root: unknown, dotted: string): unknown {
  let cur: unknown = root;
  for (const part of dotted.split(".")) {
    assert.ok(cur && typeof cur === "object" && !Array.isArray(cur), `missing object at ${part}`);
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

function flattenLeaves(value: unknown, prefix = ""): Array<{ key: string; value: string }> {
  if (value === null || value === undefined) return [];
  if (typeof value !== "object" || Array.isArray(value)) {
    return typeof value === "string" && prefix ? [{ key: prefix, value }] : [];
  }
  const out: Array<{ key: string; value: string }> = [];
  for (const [k, nested] of Object.entries(value as Record<string, unknown>)) {
    const next = prefix ? `${prefix}.${k}` : k;
    out.push(...flattenLeaves(nested, next));
  }
  return out;
}

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{[^}]+\}/g)].map((m) => m[0]).sort();
}

const INTENTIONAL_BRAND_KEYS = new Set([
  "webTitle",
  "bedriftTitle",
]);

const enPortal = readJson("locales/en/customer-app/portalStructure.json");
const esPortal = readJson("locales/es/customer-app/portalStructure.json");
const enCore = readJson("locales/en/customer-app/core.json") as Record<string, unknown>;
const esCore = readJson("locales/es/customer-app/core.json") as Record<string, unknown>;

const scopes = [
  "portalStructure.productHubs.bedrift",
  "portalStructure.productHubs.common",
  "portalStructure.foundationDashboard",
] as const;

let translated = 0;
let brandIdentity = 0;

for (const scope of scopes) {
  const enLeaves = flattenLeaves(getAt(enPortal, scope));
  const esNode = getAt(esPortal, scope);
  const esLeaves = new Map(flattenLeaves(esNode).map((l) => [l.key, l.value]));

  for (const leaf of enLeaves) {
    const relative = leaf.key.includes(".") ? leaf.key.slice(leaf.key.lastIndexOf(".") + 1) : leaf.key;
    // flattenLeaves already returns full path under scope root — normalize
    const leafKey = leaf.key;
    const esValue = esLeaves.get(leafKey);
    assert.ok(typeof esValue === "string" && esValue.length > 0, `es missing ${scope}.${leafKey}`);
    assert.deepEqual(
      placeholders(esValue),
      placeholders(leaf.value),
      `placeholder mismatch ${scope}.${leafKey}`,
    );

    if (INTENTIONAL_BRAND_KEYS.has(relative) && esValue === leaf.value) {
      brandIdentity += 1;
      continue;
    }

    assert.notEqual(
      esValue,
      leaf.value,
      `es still English fallback for ${scope}.${leafKey}`,
    );
    translated += 1;
  }
}

assert.ok(translated >= 50, `expected ≥50 translated Bedrift/foundation strings, got ${translated}`);
assert.equal(brandIdentity, 2, "Kompis Web / Kompis Bedrift titles should remain brand-identical");

assert.ok(esCore.employeeKnowledge, "es core.json must include employeeKnowledge");
const enEk = flattenLeaves(enCore.employeeKnowledge);
const esEk = new Map(flattenLeaves(esCore.employeeKnowledge).map((l) => [l.key, l.value]));
assert.equal(esEk.size, enEk.length, "employeeKnowledge leaf count must match en");

for (const leaf of enEk) {
  const esValue = esEk.get(leaf.key);
  assert.ok(typeof esValue === "string" && esValue.length > 0, `es employeeKnowledge missing ${leaf.key}`);
  assert.deepEqual(placeholders(esValue), placeholders(leaf.value), `ek placeholder ${leaf.key}`);
  // Product name "Business DNA" / "Aipify" may remain; still require non-identical unless short brand token
  if (leaf.value === "Business DNA" || leaf.value === "Aipify") {
    continue;
  }
  assert.notEqual(esValue, leaf.value, `es employeeKnowledge still English: ${leaf.key}`);
}

const manifest = readJson("docs/integrations/website-kompis-public-chain-frozen-manifest.json") as {
  protectedRuntimeFiles: Array<{ path: string; sha256: string }>;
};
assert.equal(manifest.protectedRuntimeFiles.length, 46);
for (const entry of manifest.protectedRuntimeFiles) {
  const actual = createHash("sha256")
    .update(fs.readFileSync(path.join(ROOT, entry.path)))
    .digest("hex");
  assert.equal(actual, entry.sha256, `frozen hash mismatch: ${entry.path}`);
}

console.log(
  `spanish-bedrift-eke-coverage.contract.test.ts: PASS translated=${translated} brand=${brandIdentity} ek=${enEk.length} frozen=46`,
);
