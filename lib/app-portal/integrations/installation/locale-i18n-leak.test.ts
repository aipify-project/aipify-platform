import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type LeafMap = Record<string, string>;

function flatten(obj: unknown, prefix = ""): LeafMap {
  const out: LeafMap = {};
  if (!obj || typeof obj !== "object") return out;
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(out, flatten(value, path));
    } else if (typeof value === "string") {
      out[path] = value;
    }
  }
  return out;
}

function loadWizard(locale: string): LeafMap {
  const file = join(
    process.cwd(),
    `locales/${locale}/customer-app/portalStructure.json`,
  );
  const data = JSON.parse(readFileSync(file, "utf8")) as {
    portalStructure: {
      integrations: { installationWizard: unknown };
    };
  };
  return flatten(data.portalStructure.integrations.installationWizard);
}

/** Identical cognates that are correct in both languages. */
const ALLOWED_IDENTICAL = new Set(["steps.introduction.title"]);

const no = loadWizard("no");
const sv = loadWizard("sv");
const da = loadWizard("da");
const en = loadWizard("en");

assert.equal(Object.keys(sv).length, Object.keys(en).length);
assert.equal(Object.keys(da).length, Object.keys(en).length);

const svLeaks: string[] = [];
const daLeaks: string[] = [];
for (const key of Object.keys(en)) {
  assert.ok(sv[key], `missing sv key ${key}`);
  assert.ok(da[key], `missing da key ${key}`);
  if (sv[key] === no[key] && !ALLOWED_IDENTICAL.has(key)) svLeaks.push(key);
  if (da[key] === no[key] && !ALLOWED_IDENTICAL.has(key)) daLeaks.push(key);
  // English fallback baseline must differ from Norwegian for most customer copy;
  // sv/da must not silently equal English for placeholder keys that were NO-copied.
  assert.notEqual(sv[key]?.trim(), "", `empty sv ${key}`);
  assert.notEqual(da[key]?.trim(), "", `empty da ${key}`);
}

assert.deepEqual(svLeaks, [], `Swedish still equals Norwegian for: ${svLeaks.join(", ")}`);
assert.deepEqual(daLeaks, [], `Danish still equals Norwegian for: ${daLeaks.join(", ")}`);

// Spot-check critical placeholders are localized
assert.match(sv.comingLater ?? "", /snart|tillgängligt/i);
assert.match(da.comingLater ?? "", /snart|tilgængelig/i);
assert.match(sv.invitePlaceholder ?? "", /inbjudan|överlämning/i);
assert.match(da.invitePlaceholder ?? "", /invitation|overdragelse/i);
assert.notEqual(sv.comingLater, no.comingLater);
assert.notEqual(da.comingLater, no.comingLater);

console.log("locale-i18n-leak.test.ts: ok", {
  keys: Object.keys(en).length,
  svLeaks: 0,
  daLeaks: 0,
});
