import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import {
  APP_PORTAL_SUPPORT_CHANNEL_VALUES,
  PLATFORM_SUPPORT_LEGACY_KPI_SOURCES_FORBIDDEN,
  PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_PATH,
  PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_SHA256,
  PLATFORM_SUPPORT_TICKETS_READ_ROLES,
  PLATFORM_SUPPORT_TICKETS_READ_RPCS,
  PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED,
  PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED,
  assertPlatformSupportTicketsReadIsFailClosed,
} from "./support-tickets-cross-tenant-read-contract";

assert.ok(assertPlatformSupportTicketsReadIsFailClosed());
assert.equal(PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED, false);
assert.equal(PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED, false);
assert.deepEqual(
  [...PLATFORM_SUPPORT_TICKETS_READ_ROLES],
  ["super_admin", "platform_support"],
);

assert.ok(existsSync(PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_PATH));
assert.doesNotMatch(
  PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_PATH,
  /supabase\/migrations\//,
);

const sql = readFileSync(PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_PATH, "utf8");
const sha = createHash("sha256").update(sql).digest("hex");
assert.equal(sha, PLATFORM_SUPPORT_TICKETS_CROSS_TENANT_READ_SQL_SHA256);

assert.match(sql, /NOT_APPLIED/);
assert.match(sql, /DO NOT EXECUTE/i);
assert.match(sql, /_ppsf258_require_platform_access/);
assert.match(sql, /set search_path = public/);
assert.match(sql, /app_portal_support_requests/);
assert.match(sql, /app_portal_support_request_audit_logs/);
assert.match(sql, /source_locale',\s*null/);
assert.match(sql, /privacy_note/);
assert.match(sql, /revoke all/i);
assert.match(sql, /grant execute[\s\S]*to authenticated/i);
assert.doesNotMatch(sql, /grant execute[\s\S]*to anon/i);
assert.doesNotMatch(sql, /grant execute[\s\S]*to public/i);
// Header/privacy notes may name forbidden sources; FROM clauses must not query them.
assert.doesNotMatch(sql, /from\s+public\.usage_statistics/i);
assert.doesNotMatch(sql, /from\s+public\.support_cases/i);
assert.doesNotMatch(sql, /from\s+public\.organization_support_cases/i);
assert.match(sql, /list_platform_support_queue/); // non-SoT warning in header only

for (const rpc of PLATFORM_SUPPORT_TICKETS_READ_RPCS) {
  assert.match(sql, new RegExp(`create or replace function public\\.${rpc}`));
}

for (const channel of APP_PORTAL_SUPPORT_CHANNEL_VALUES) {
  assert.match(sql, new RegExp(`'${channel}'`));
}

assert.match(sql, /Platform portal access denied/);
assert.match(sql, /p_page_size/);
assert.match(sql, /least\(greatest\(coalesce\(p_page_size/);
assert.match(sql, /description_preview/);
assert.match(sql, /internal_notes/);
assert.match(sql, /timeline/);

// No schema invent: locale column add / channel enum alter forbidden in this prepare.
assert.doesNotMatch(sql, /add column if not exists\s+source_locale/i);
assert.doesNotMatch(sql, /drop constraint if exists app_portal_support_requests_channel_check/);

// APP isolation helpers must not be weakened.
assert.doesNotMatch(sql, /_apsr271_access_context/);
assert.doesNotMatch(sql, /alter table public\.app_portal_support_requests enable row level security/i);
assert.doesNotMatch(sql, /create policy/i);
assert.doesNotMatch(sql, /drop policy/i);

// Forbidden legacy KPI sources remain documented as forbidden.
for (const forbidden of PLATFORM_SUPPORT_LEGACY_KPI_SOURCES_FORBIDDEN) {
  assert.ok(forbidden.length > 0);
}

// Frozen Website Kompis public chain untouched by this job's SQL path.
const frozen = JSON.parse(
  readFileSync(
    "docs/integrations/website-kompis-public-chain-frozen-manifest.json",
    "utf8",
  ),
) as { protectedRuntimeFiles: Array<{ path: string; sha256: string }> };
let ok = 0;
for (const row of frozen.protectedRuntimeFiles) {
  const h = createHash("sha256").update(readFileSync(row.path)).digest("hex");
  if (h === row.sha256) ok += 1;
}
assert.equal(ok, frozen.protectedRuntimeFiles.length);

// Platform Support UI must not already call the new RPCs (not wired).
const supportPanel = readFileSync(
  "components/platform/PlatformSupportPanel.tsx",
  "utf8",
);
assert.match(supportPanel, /list_platform_support_queue/);
assert.doesNotMatch(supportPanel, /list_platform_app_portal_support_requests/);
assert.doesNotMatch(supportPanel, /get_platform_app_portal_support_request/);

console.log(
  "support-tickets-cross-tenant-read-contract: static gates PASS; disposable DB runtime NOT RUN",
);
