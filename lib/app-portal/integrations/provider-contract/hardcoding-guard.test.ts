import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const SHARED_APP_SCAN_ROOTS = [
  "components/app/app-portal",
  "components/app/integration-setup",
  "lib/app-portal/integrations",
];

const FORBIDDEN_PATTERNS: Array<{ name: string; re: RegExp; allow?: RegExp }> = [
  {
    name: "hardcoded_unonight_admin_url",
    re: /www\.unonight\.com\/unonight-admin/i,
  },
  {
    name: "provider_switch_unonight",
    re: /providerKey\s*===\s*["']unonight["']|UNONIGHT_PROVIDER_KEY/,
    allow: /provider-contract\/fixtures\.ts$|hardcoding-guard\.test\.ts$/,
  },
];

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry === ".git") continue;
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".d.ts")) {
      out.push(full);
    }
  }
  return out;
}

const files = SHARED_APP_SCAN_ROOTS.flatMap((root) => walk(join(ROOT, root)));
assert.ok(files.length > 10, "expected shared APP sources to exist");

const violations: string[] = [];
for (const file of files) {
  const rel = file.replace(`${ROOT}/`, "");
  if (rel.includes("/provider-contract/fixtures.ts")) continue;
  if (rel.endsWith(".test.ts") || rel.endsWith(".test.tsx")) continue;
  const source = readFileSync(file, "utf8");
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.allow?.test(rel)) continue;
    if (pattern.re.test(source)) {
      violations.push(`${rel} :: ${pattern.name}`);
    }
  }

  if (
    (rel.startsWith("components/app/app-portal/") ||
      rel.startsWith("components/app/integration-setup/")) &&
    /Unonight/.test(source)
  ) {
    violations.push(`${rel} :: visible_Unonight_token`);
  }
}

assert.deepEqual(violations, []);

const panel = readFileSync(
  join(ROOT, "components/app/app-portal/AppPortalIntegrationSetupPanel.tsx"),
  "utf8"
);
assert.doesNotMatch(panel, /UNONIGHT_PROVIDER_KEY/);
assert.doesNotMatch(panel, /www\.unonight\.com/);
assert.match(panel, /parseCoreAppIntegrationProviderContract/);
assert.match(panel, /ProviderConnectionErrorPanel/);

console.log("hardcoding-guard.test.ts: ok");
