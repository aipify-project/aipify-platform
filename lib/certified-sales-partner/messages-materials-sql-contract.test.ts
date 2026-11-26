import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import {
  CSP_MESSAGES_MATERIALS_ERROR_CODES,
  CSP_MESSAGES_MATERIALS_PORTAL_STATUSES,
  CSP_MESSAGES_MATERIALS_REQUIRED_RPCS,
  CSP_MESSAGES_MATERIALS_REQUIRED_TABLES,
  CSP_MESSAGES_MATERIALS_SQL_CANDIDATE_PATH,
  CSP_MESSAGES_MATERIALS_SQL_CANDIDATE_SHA256,
  isCspMessagesMaterialsBackendReady,
} from "./messages-materials-sql-contract";

const ROOT = join(__dirname, "../..");
const SQL_PATH = join(ROOT, CSP_MESSAGES_MATERIALS_SQL_CANDIDATE_PATH);

describe("CSP messages/materials SQL contract V3", () => {
  test("candidate file exists and SHA256 matches freeze", () => {
    const sql = readFileSync(SQL_PATH, "utf8");
    const sha = createHash("sha256").update(sql).digest("hex");
    assert.equal(sha, CSP_MESSAGES_MATERIALS_SQL_CANDIDATE_SHA256);
    assert.match(sql, /PREPARED_ONLY/);
    assert.doesNotMatch(sql, /metadata_probe/);
  });

  test("candidate defines required tables", () => {
    const sql = readFileSync(SQL_PATH, "utf8");
    for (const table of CSP_MESSAGES_MATERIALS_REQUIRED_TABLES) {
      assert.match(sql, new RegExp(`create table if not exists public\\.${table}`, "i"));
      assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
      assert.match(sql, new RegExp(`revoke all on table public\\.${table} from public, anon, authenticated`, "i"));
    }
    assert.match(sql, /add column if not exists avatar_url text/i);
  });

  test("candidate defines required SECURITY DEFINER RPCs with auth gates", () => {
    const sql = readFileSync(SQL_PATH, "utf8");
    for (const rpc of CSP_MESSAGES_MATERIALS_REQUIRED_RPCS) {
      assert.match(sql, new RegExp(`create or replace function public\\.${rpc}\\s*\\(`, "i"));
      assert.match(sql, new RegExp(`grant execute on function public\\.${rpc}`, "i"));
    }
    assert.match(sql, /security definer/i);
    assert.match(sql, /is_platform_admin\(\)/);
    assert.match(sql, /partner_not_active/);
    assert.match(sql, /_csp_messages_portal_status_ok/);
  });

  test("materials default unpublished and partners cannot force include unpublished", () => {
    const sql = readFileSync(SQL_PATH, "utf8");
    assert.match(sql, /published boolean not null default false/);
    assert.match(sql, /v_include := false; -- partners never see drafts/);
    assert.match(sql, /csp_publish_sales_material/);
    assert.match(sql, /csp_withdraw_sales_material/);
  });

  test("message send is idempotent on partner_id + direction + idempotency_key", () => {
    const sql = readFileSync(SQL_PATH, "utf8");
    assert.match(sql, /csp_partner_messages_idempotency_uidx/);
    assert.match(sql, /replayed', true/);
    assert.match(sql, /unique_violation/);
  });

  test("portal status allowlist matches app partner portal gate", () => {
    assert.deepEqual([...CSP_MESSAGES_MATERIALS_PORTAL_STATUSES], [
      "approved",
      "active",
      "certified",
      "in_academy",
    ]);
    assert.ok(CSP_MESSAGES_MATERIALS_ERROR_CODES.includes("partner_not_active"));
    assert.ok(CSP_MESSAGES_MATERIALS_ERROR_CODES.includes("forbidden"));
  });

  test("backend ready helper is fail-closed", () => {
    assert.equal(
      isCspMessagesMaterialsBackendReady({
        hasMessagesTable: false,
        hasMaterialsTable: true,
        hasListMessagesRpc: true,
        hasListMaterialsRpc: true,
      }),
      false,
    );
    assert.equal(
      isCspMessagesMaterialsBackendReady({
        hasMessagesTable: true,
        hasMaterialsTable: true,
        hasListMessagesRpc: true,
        hasListMaterialsRpc: true,
      }),
      true,
    );
  });

  test("avatar URL RPC rejects absolute remote URLs", () => {
    const sql = readFileSync(SQL_PATH, "utf8");
    assert.match(sql, /invalid_avatar_url/);
    assert.match(sql, /v_url !~ '\^\/'/);
  });
});
