import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "lib/app-portal/integrations/installation");
const WIZARD = join(process.cwd(), "components/app/app-portal/InstallationWizard.tsx");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith(".test.ts")) out.push(path);
  }
  return out;
}

const files = [...walk(ROOT), WIZARD];
const banned = [/\bunonight\b/i, /\buno[\s-]?night\b/i, /\bsvein\b/i];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const pattern of banned) {
    assert.equal(pattern.test(text), false, `${file} matched ${pattern}`);
  }
}

const wizardText = readFileSync(WIZARD, "utf8");
assert.ok(wizardText.includes("listInstallationLocales"));
assert.equal(/locale\s*:\s*["']en["']\s*\|\s*["']no["']/.test(wizardText), false);
assert.equal(/\["en",\s*"no",\s*"sv"/.test(wizardText), false);
assert.equal(/fallbackLocale\s*[:=]\s*["']no["']/.test(wizardText), false);

const localeModule = readFileSync(join(ROOT, "locale.ts"), "utf8");
assert.ok(localeModule.includes("from \"@/lib/i18n/config\""));
assert.ok(localeModule.includes("LOCALES"));
assert.equal(/\[\s*["']en["']\s*,\s*["']no["']/.test(localeModule), false);
assert.equal(/fallback.*["']no["']/.test(localeModule), false);

// Scan wizard scope for forbidden hardcoded locale unions
const forbiddenFindings: string[] = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  if (/\["en",\s*"no",\s*"sv"/.test(text)) {
    forbiddenFindings.push(`${file}: hardcoded locale union`);
  }
  if (/locale\s*===\s*["']no["']\s*\?/.test(text)) {
    forbiddenFindings.push(`${file}: Norwegian ternary locale branch`);
  }
}
assert.deepEqual(forbiddenFindings, [], forbiddenFindings.join("\n"));

console.log("hardcoding-guard.test.ts: ok", { scanned: files.length, forbiddenFindings: 0 });
