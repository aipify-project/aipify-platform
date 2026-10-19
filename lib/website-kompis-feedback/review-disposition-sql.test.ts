/**
 * Static contract for the unapplied review disposition candidate.
 * This does not connect to a database and does not apply SQL.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FEEDBACK_REVIEW_CLOSE_READY } from "@/lib/website-kompis-feedback/operations-model";

const ROOT = process.cwd();
const relative = "docs/platform/NOT_APPLIED_website_kompis_feedback_review_disposition_v1.sql";
const sql = readFileSync(join(ROOT, relative), "utf8");

assert.match(sql, /^-- NOT APPLIED/);
assert.equal(FEEDBACK_REVIEW_CLOSE_READY, false);
assert.doesNotMatch(sql, /delete from public\.website_kompis_answer_feedback/i);
assert.doesNotMatch(sql, /drop function if exists public\.get_website_kompis_answer_feedback_overview/i);
assert.match(sql, /complete_website_kompis_feedback_review_as_published/);
assert.match(sql, /reject_website_kompis_feedback_review/);
assert.match(sql, /review_disposition = 'published'/);
assert.match(sql, /review_disposition = 'rejected'/);
assert.match(sql, /v_faq\.status is distinct from 'published'/);
assert.match(sql, /v_faq\.install_id is distinct from v_row\.install_id/);
assert.match(sql, /_wpkf_auth_tenant_id/);
assert.match(sql, /_wpkf_auth_is_owner_admin/);
assert.match(sql, /on delete restrict/);
assert.match(sql, /grant execute on function public\.reject_website_kompis_feedback_review\(uuid, boolean\) to authenticated/);
assert.doesNotMatch(sql, /grant execute[\s\S]*to anon/i);
assert.doesNotMatch(sql, /FEEDBACK_REVIEW_CLOSE_READY = true/);

const model = readFileSync(join(ROOT, "lib/website-kompis-feedback/operations-model.ts"), "utf8");
assert.match(model, /FEEDBACK_REVIEW_CLOSE_READY = false/);

console.log("review-disposition-sql.test.ts: OK");
