import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20261924000000_presence_tenant_auth_fallback_fix.sql"),
  "utf8",
);

assert.match(migration, /v_context_org_id/);
assert.match(migration, /if v_context_org_id is not null then/i);
assert.equal(migration.includes("into v_org_id"), false);

console.log("presence-tenant-auth-fallback.test.ts passed");
