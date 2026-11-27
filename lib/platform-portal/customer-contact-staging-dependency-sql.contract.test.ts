import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SYNC_REL =
  "docs/sql-candidates/20261127_staging_customer_contact_dependency_sync_v1.sql";
const CONTACT_REL =
  "docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sql";
const SYNC_SHA_REL =
  "docs/sql-candidates/20261127_staging_customer_contact_dependency_sync_v1.sha256.txt";
const CONTACT_SHA_REL =
  "docs/sql-candidates/20261127_update_platform_portal_customer_primary_contact_v1.sha256.txt";

const EXPECTED_SYNC_SHA =
  "5b67e2dfb21bc5cecf7232d5f283097cd43dd388f3a1e2ee59b655e4fd8e2d5f";
const EXPECTED_CONTACT_SHA =
  "0cf8938b6e5114240230bae53e01782d8116e471bd52bd80032d8a059a28cd6b";

function fileSha(rel: string): { sql: string; sha: string } {
  const sql = readFileSync(resolve(process.cwd(), rel), "utf8");
  return { sql, sha: createHash("sha256").update(sql).digest("hex") };
}

function executableBody(sql: string): string {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
}

{
  const { sql, sha } = fileSha(SYNC_REL);
  assert.equal(sha, EXPECTED_SYNC_SHA, `sync SQL SHA drifted — got=${sha}`);

  const ledger = readFileSync(resolve(process.cwd(), SYNC_SHA_REL), "utf8").trim();
  assert.match(ledger, new RegExp(`^${EXPECTED_SYNC_SHA}\\s+`));

  assert.match(sql, /NOT APPLIED/i);
  assert.match(sql, /auedugihkduoaikfusqe/);
  assert.match(sql, /add column if not exists full_name/i);
  assert.match(sql, /add column if not exists phone/i);
  assert.match(sql, /add column if not exists updated_at/i);
  assert.match(sql, /create table if not exists public\.platform_admin_audit_logs/i);
  assert.match(sql, /create or replace function public\.record_platform_admin_audit_event/i);
  assert.match(sql, /is_platform_admin\(\)/);

  const exe = executableBody(sql);
  assert.doesNotMatch(exe, /drop table\s+public\.customers/i);
  assert.doesNotMatch(exe, /delete\s+from\s+public\.customers/i);
  assert.doesNotMatch(exe, /truncate\s+public\.customers/i);
  assert.doesNotMatch(exe, /update_platform_portal_customer_primary_contact/i);
  assert.doesNotMatch(exe, /qbcqoixhrvhnuwphefvw/);
  assert.doesNotMatch(exe, /insert\s+into\s+public\.platform_admins/i);
  assert.doesNotMatch(exe, /create table\s+public\.customers\b/i);
}

{
  const { sql, sha } = fileSha(CONTACT_REL);
  assert.equal(sha, EXPECTED_CONTACT_SHA, `contact RPC SHA drifted — got=${sha}`);

  const ledger = readFileSync(resolve(process.cwd(), CONTACT_SHA_REL), "utf8").trim();
  assert.match(ledger, new RegExp(`^${EXPECTED_CONTACT_SHA}\\s+`));

  assert.match(sql, /update_platform_portal_customer_primary_contact/);
  assert.match(sql, /record_platform_admin_audit_event/);
  assert.match(sql, /customer_primary_contact_update/);
  assert.doesNotMatch(executableBody(sql), /update\s+public\.customers[\s\S]*email\s*=/i);
}

console.log("customer-contact-staging-dependency-sql.contract.test.ts: ok", {
  sync: EXPECTED_SYNC_SHA,
  contact: EXPECTED_CONTACT_SHA,
});
