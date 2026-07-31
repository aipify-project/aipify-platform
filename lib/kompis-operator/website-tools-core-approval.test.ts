import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  KOMPIS_CORE_APPROVAL_TOOL_KEYS,
  toolRequiresCoreApproval,
} from "./core-approval-policy";
import { KOMPIS_OPERATOR_TOOL_KEYS, getKompisOperatorTool } from "./tools-registry";

const ROOT = join(process.cwd());
const MIGRATION = join(
  ROOT,
  "supabase/migrations/20261936100000_kompis_website_tools_core_approval_v1.sql",
);

function extractSqlAllowlist(sql: string): string[] {
  const fn = sql.match(
    /create or replace function public\._kompis_operator_tool_allowed[\s\S]*?as \$\$([\s\S]*?)\$\$;/i,
  );
  assert.ok(fn, "allowlist function missing");
  const body = fn[1];
  assert.doesNotMatch(body, /like\s|~\*|wildcard/i);
  const keys = [...body.matchAll(/'([a-z0-9_]+)'/g)].map((m) => m[1]);
  return [...new Set(keys)];
}

function extractCoreApprovalTools(sql: string): string[] {
  const fn = sql.match(
    /create or replace function public\._kompis_operator_tool_requires_core_approval[\s\S]*?as \$\$([\s\S]*?)\$\$;/i,
  );
  assert.ok(fn, "core approval function missing");
  return [...fn[1].matchAll(/'([a-z0-9_]+)'/g)].map((m) => m[1]);
}

function run() {
  const sql = readFileSync(MIGRATION, "utf8");
  assert.doesNotMatch(sql, /unonight|32d748eb|2b756bf8|180c9d31/i);
  assert.match(sql, /apply-side effects = 0/i);
  assert.match(sql, /set search_path = public/);
  assert.match(sql, /revoke all on function public\._kompis_operator_tool_allowed/);
  assert.match(sql, /request_kompis_operator_core_approval/);
  assert.match(sql, /assert_kompis_operator_core_approval_ready/);
  assert.match(sql, /consume_kompis_operator_core_approval/);
  assert.match(sql, /kompis_operator_core_approval_bindings/);

  const allowed = extractSqlAllowlist(sql);
  for (const key of KOMPIS_OPERATOR_TOOL_KEYS) {
    assert.ok(allowed.includes(key), `SQL missing registry tool: ${key}`);
  }
  assert.equal(allowed.includes("unknown_website_tool"), false);
  assert.equal(allowed.includes("website_page_draft_create"), true);
  assert.equal(allowed.includes("website_draft_preview_create"), true);
  assert.equal(allowed.includes("website_publish_approved_draft"), true);
  assert.equal(allowed.includes("website_publish_rollback"), true);
  assert.equal(allowed.includes("knowledge_search"), true);

  const coreTools = extractCoreApprovalTools(sql);
  assert.deepEqual(coreTools.sort(), [...KOMPIS_CORE_APPROVAL_TOOL_KEYS].sort());

  for (const key of KOMPIS_CORE_APPROVAL_TOOL_KEYS) {
    assert.equal(toolRequiresCoreApproval(key), true);
    const tool = getKompisOperatorTool(key);
    assert.ok(tool);
    assert.equal(tool.requiresApproval, true);
    assert.equal(tool.available, true);
  }
  assert.equal(toolRequiresCoreApproval("website_page_draft_create"), false);
  assert.equal(toolRequiresCoreApproval("website_draft_preview_create"), false);
  assert.equal(toolRequiresCoreApproval("knowledge_search"), false);

  const preview = getKompisOperatorTool("website_draft_preview_create");
  assert.ok(preview);
  assert.equal(preview.requiresApproval, false);

  const executor = readFileSync(join(ROOT, "lib/kompis-operator/executor.ts"), "utf8");
  assert.match(executor, /assertKompisCoreApprovalReady/);
  assert.match(executor, /consumeKompisCoreApproval/);
  assert.match(executor, /publishWebsiteCandidate/);
  assert.match(executor, /rollbackWebsiteVersion/);
  assert.doesNotMatch(executor, /from\(['"]customer_website/);

  const rule = readFileSync(
    join(ROOT, ".cursor/rules/kompis-website-tools-core-approval.mdc"),
    "utf8",
  );
  assert.match(rule, /No wildcard allowlist/);
  assert.match(rule, /CORE\.APPROVAL/);
  assert.match(rule, /No UnoNight hardcoding/);

  console.log("kompis-website-tools-core-approval parity tests passed");
}

run();
