import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  isNordicKompisLocale,
  kompisFamilyName,
  kompisProductDisplayName,
  kompisWebSalesBrowserTitle,
  localizeKompisBuddyCopy,
  NORDIC_KOMPIS_LOCALES,
} from "./kompis-buddy-display";

assert.deepEqual([...NORDIC_KOMPIS_LOCALES], ["no", "sv", "da"]);
assert.equal(isNordicKompisLocale("no"), true);
assert.equal(isNordicKompisLocale("SV"), true);
assert.equal(isNordicKompisLocale("en"), false);
assert.equal(isNordicKompisLocale("pl"), false);

assert.equal(kompisFamilyName("no"), "Kompis");
assert.equal(kompisFamilyName("en"), "Buddy");
assert.equal(kompisFamilyName("es"), "Buddy");

assert.equal(kompisProductDisplayName("kompis_web", "no"), "Kompis Web");
assert.equal(kompisProductDisplayName("kompis_web", "en"), "Buddy Web");
assert.equal(kompisProductDisplayName("kompis_bedrift", "sv"), "Kompis Bedrift");
assert.equal(kompisProductDisplayName("kompis_bedrift", "pl"), "Buddy Business");
assert.equal(kompisProductDisplayName("website_kompis", "da"), "Website Kompis");
assert.equal(kompisProductDisplayName("website_kompis", "uk"), "Website Buddy");

assert.equal(
  localizeKompisBuddyCopy("Explore Kompis Web and Kompis Bedrift with Website Kompis", "en"),
  "Explore Buddy Web and Buddy Business with Website Buddy",
);
assert.equal(
  localizeKompisBuddyCopy("Kompis Web and Kompis Bedrift", "no"),
  "Kompis Web and Kompis Bedrift",
);
assert.equal(
  localizeKompisBuddyCopy("Keep id kompis_web unchanged", "en"),
  "Keep id kompis_web unchanged",
);

assert.equal(kompisWebSalesBrowserTitle("en"), "Aipify works for you | Buddy Web");
assert.equal(kompisWebSalesBrowserTitle("no"), "Aipify works for you | Kompis Web");

/** Walk locale JSON values and assert brand naming policy. */
const LOCALES_ROOT = path.join(process.cwd(), "locales");
const NON_NORDIC = ["en", "pl", "uk", "es"] as const;
const NORDIC = ["no", "sv", "da"] as const;

/** Paths (relative to locales/{locale}/) skipped — technical notes that intentionally cite IDs. */
const ALLOWLIST_PATH_SUBSTRINGS: readonly string[] = [];

function walkStrings(
  value: unknown,
  pathParts: string[],
  visit: (text: string, path: string) => void,
): void {
  if (typeof value === "string") {
    visit(value, pathParts.join("."));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkStrings(item, [...pathParts, String(i)], visit));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      walkStrings(child, [...pathParts, key], visit);
    }
  }
}

function collectJsonFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...collectJsonFiles(full));
    else if (name.endsWith(".json")) out.push(full);
  }
  return out;
}

function stripProtectedProductNames(text: string, nordic: boolean): string {
  if (nordic) {
    return text
      .replaceAll("Kompis Web", "«PW»")
      .replaceAll("Kompis Bedrift", "«PB»")
      .replaceAll("Website Kompis", "«WK»")
      .replaceAll("Aipify Kompis", "«AK»");
  }
  return text
    .replaceAll("Buddy Web", "«PW»")
    .replaceAll("Buddy Business", "«PB»")
    .replaceAll("Website Buddy", "«WK»")
    .replaceAll("Aipify Buddy", "«AK»");
}

const leaks: string[] = [];

for (const locale of NON_NORDIC) {
  const root = path.join(LOCALES_ROOT, locale);
  for (const file of collectJsonFiles(root)) {
    const rel = path.relative(LOCALES_ROOT, file);
    if (ALLOWLIST_PATH_SUBSTRINGS.some((s) => rel.includes(s))) continue;
    const json = JSON.parse(readFileSync(file, "utf8")) as unknown;
    walkStrings(json, [], (text, keyPath) => {
      const stripped = stripProtectedProductNames(text, false);
      if (/\bKompis\b/.test(stripped)) {
        leaks.push(`${rel} :: ${keyPath} :: ${text}`);
      }
    });
  }
}

for (const locale of NORDIC) {
  const root = path.join(LOCALES_ROOT, locale);
  for (const file of collectJsonFiles(root)) {
    const rel = path.relative(LOCALES_ROOT, file);
    const json = JSON.parse(readFileSync(file, "utf8")) as unknown;
    walkStrings(json, [], (text, keyPath) => {
      // Lowercase Norwegian "kompis" (friend) may appear; only flag product Buddy.
      if (/\bBuddy\b/.test(text)) {
        leaks.push(`${rel} :: ${keyPath} :: unexpected Buddy :: ${text}`);
      }
    });
  }
}

assert.equal(
  leaks.length,
  0,
  `Kompis/Buddy locale naming leaks:\n${leaks.slice(0, 25).join("\n")}${leaks.length > 25 ? `\n…+${leaks.length - 25} more` : ""}`,
);

console.log(
  "kompis-buddy-display: PASS",
  `nordic=${NORDIC.join(",")}`,
  `buddy=${NON_NORDIC.join(",")}`,
);
