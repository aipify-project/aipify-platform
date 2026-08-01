import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CUSTOMERS_API = join(process.cwd(), "app/api/platform/customers");
const LEGACY_ID = join(CUSTOMERS_API, "[id]");
const CANONICAL = join(CUSTOMERS_API, "[organizationId]");

// A. Exact conflict pair removed — only one dynamic slug under /api/platform/customers
assert.equal(existsSync(LEGACY_ID), false);
assert.equal(existsSync(CANONICAL), true);

const dynamicSiblings = readdirSync(CUSTOMERS_API).filter(
  (name) => name.startsWith("[") && name.endsWith("]")
);
assert.deepEqual(dynamicSiblings, ["[organizationId]"]);

for (const segment of [
  "intelligence",
  "learning",
  "recommendations",
  "timeline",
  "website",
  "website/runtime",
]) {
  const routeFile = join(CANONICAL, segment, "route.ts");
  assert.equal(existsSync(routeFile), true, `missing ${segment}`);
  const src = readFileSync(routeFile, "utf8");
  assert.match(src, /organizationId/);
  assert.equal(src.includes("params: Promise<{ id: string }>"), false);
}

// B. URL pattern unchanged — consumers still call /api/platform/customers/${…}/…
const master = readFileSync(
  join(process.cwd(), "components/platform/CustomerMasterDetailView.tsx"),
  "utf8"
);
assert.match(master, /\/api\/platform\/customers\/\$\{customerId\}\/recommendations/);

const runtimePanel = readFileSync(
  join(
    process.cwd(),
    "components/platform/platform-portal/CustomerWebsiteRuntimeDeliveryPanel.tsx"
  ),
  "utf8"
);
assert.match(
  runtimePanel,
  /\/api\/platform\/customers\/\$\{organizationId\}\/website\/runtime/
);

function collectConflicts(root: string): string[] {
  const conflicts: string[] = [];
  const walk = (dir: string) => {
    const dirents = readdirSync(dir, { withFileTypes: true });
    const dyn = dirents
      .filter((d) => d.isDirectory() && d.name.startsWith("[") && d.name.endsWith("]"))
      .map((d) => d.name);
    const unique = [...new Set(dyn)];
    if (unique.length > 1) {
      conflicts.push(`${dir}: ${unique.join(" vs ")}`);
    }
    for (const d of dirents) {
      if (d.isDirectory()) walk(join(dir, d.name));
    }
  };
  walk(root);
  return conflicts;
}

assert.deepEqual(collectConflicts(join(process.cwd(), "app")), []);

console.log("platform-customers-dynamic-slug.test.ts: ok");
