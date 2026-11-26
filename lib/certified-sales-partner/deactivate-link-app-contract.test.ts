import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
const SQL_REL = "docs/platform/sql-candidates/csp_deactivate_attribution_link_v4.sql";
const SQL_SHA =
  "b06db68bfab047c0385e5d7af636042aaa2933070a09dc17e0fedfe46e2815b3";

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

async function main() {
  const sql = read(SQL_REL);
  assert.equal(createHash("sha256").update(sql).digest("hex"), SQL_SHA);
  assert.match(sql, /csp_deactivate_attribution_link/);
  assert.match(sql, /PREPARED_ONLY|attribution_link_deactivated/);

  const route = read("app/api/certified-sales-partner/links/route.ts");
  assert.match(route, /export async function PATCH/);
  assert.match(route, /csp_deactivate_attribution_link/);
  assert.match(route, /failClosedJson/);

  const panel = read("components/partners-portal/CertifiedSalesPartnerLinkPanel.tsx");
  assert.match(panel, /deactivateCspSalesLink/);
  assert.match(panel, /labels\.deactivate/);

  console.log("deactivate-link app contract passed (PREPARED_ONLY SQL)");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
