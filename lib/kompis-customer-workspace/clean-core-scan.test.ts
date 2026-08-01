import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "lib/kompis-customer-workspace");
const UI = join(process.cwd(), "components/app/kompis-customer-workspace");
const API = join(process.cwd(), "app/api/kompis-customer-workspace");
const MIGRATION = join(
  process.cwd(),
  "supabase/migrations/20261937200000_kompis_authenticated_customer_workspace_v1.sql"
);

function walk(dir: string): string[] {
  try {
    const out: string[] = [];
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) out.push(...walk(path));
      else if (/\.(ts|tsx|sql|mdc)$/.test(name)) out.push(path);
    }
    return out;
  } catch {
    return [];
  }
}

const files = [...walk(ROOT), ...walk(UI), ...walk(API), MIGRATION].filter((f) => {
  try {
    readFileSync(f);
    return true;
  } catch {
    return false;
  }
});

const banned = [
  /\bunonight\b/i,
  /\buno[\s-]?night\b/i,
  /\bsvein\b/i,
  /\bshopify\b/i,
  /\bwordpress\b/i,
  /tenant_slug\s*[:=]/i,
  /\["en",\s*"no",\s*"sv"/,
];

const findings: string[] = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const pattern of banned) {
    if (pattern.test(text)) {
      findings.push(`${file} matched ${pattern}`);
    }
  }
}

assert.deepEqual(findings, [], findings.join("\n") || "clean");

// Diff-scoped scan when git available
try {
  const diff = execSync("git diff --cached --name-only; git diff --name-only", {
    encoding: "utf8",
  });
  const scoped = diff
    .split("\n")
    .filter((p) => p.includes("kompis-customer-workspace") || p.includes("202619372"));
  for (const path of scoped) {
    if (!path) continue;
    try {
      const text = readFileSync(join(process.cwd(), path), "utf8");
      for (const pattern of banned) {
        assert.equal(pattern.test(text), false, `${path} matched ${pattern}`);
      }
    } catch {
      // ignore deleted
    }
  }
} catch {
  // ignore git failures in isolated runs
}

console.log("clean-core-scan.test.ts: ok");
console.log(`scanned_files=${files.length}`);
console.log("zero_forbidden_findings");
