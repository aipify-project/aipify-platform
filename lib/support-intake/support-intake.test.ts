import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import {
  sanitizeSupportIntakePayload,
  stripUnresolvedTemplatePlaceholders,
} from "./sanitize";
import {
  getSupportIntakeGateState,
  httpStatusForIntakeDenial,
  submitSupportIntake,
} from "./submit";
import {
  mapIntakeCategoryToAppCategory,
  mapIntakePriorityToAppPriority,
  SUPPORT_INTAKE_CSP_CATEGORIES,
} from "./categories";
import {
  APP_PORTAL_SUPPORT_CREATE_LIVE,
  SUPPORT_EMAIL_TRANSPORT_ENABLED,
  SUPPORT_INTAKE_FEATURE_GATE,
  SUPPORT_INTAKE_RPC_CONNECTED,
} from "./types";
import {
  __resetSupportTemplateStoreForTests,
  archiveSupportTemplate,
  createSupportTemplate,
  listEditableSupportTemplates,
} from "@/lib/platform-portal/support-center/template-store";
import {
  canTransitionSupportStatus,
  getSupportWriteGateState,
  postExternalReply,
  postInternalNote,
} from "@/lib/platform-portal/support-center/write-ops";

async function main() {
  const previousSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL =
    "https://qbcqoixhrvhnuwphefvw.supabase.co";

  assert.equal(SUPPORT_INTAKE_RPC_CONNECTED, false);
  assert.equal(SUPPORT_INTAKE_FEATURE_GATE, false);
  assert.equal(SUPPORT_EMAIL_TRANSPORT_ENABLED, false);
  assert.equal(APP_PORTAL_SUPPORT_CREATE_LIVE, true);
  assert.equal(getSupportIntakeGateState().live, false);
  assert.equal(mapIntakeCategoryToAppCategory("billing"), "billing");
  assert.equal(mapIntakeCategoryToAppCategory("product"), "business_packs");
  assert.equal(mapIntakePriorityToAppPriority("critical"), "urgent");
  assert.equal(mapIntakePriorityToAppPriority("normal"), "medium");
  assert.ok(SUPPORT_INTAKE_CSP_CATEGORIES.includes("partner_commission"));
  // Write/read live on Production Core; intake stays closed until intake RPC.
  assert.equal(getSupportWriteGateState().live, true);
  assert.equal(getSupportWriteGateState().stagingBound, false);

  const badTenant = sanitizeSupportIntakePayload({
    source: "web",
    subject: "Hjelp med innlogging",
    message: "Jeg får ikke logget inn på kontoen.",
    contactName: "Ada",
    contactEmail: "ada@example.com",
    company_id: "should-be-ignored-by-sanitize",
  });
  assert.equal(badTenant.ok, true);

  const missingEmail = sanitizeSupportIntakePayload(
    {
      subject: "Test",
      message: "Dette er en testmelding.",
      contactName: "Ada",
    },
    "web",
  );
  assert.equal(missingEmail.ok, false);

  const denied = await submitSupportIntake({
    payload: {
      source: "web",
      subject: "Hjelp med innlogging",
      message: "Jeg får ikke logget inn på kontoen.",
      contactName: "Ada",
      contactEmail: "ada@example.com",
    },
    actor: { kind: "guest" },
  });
  assert.equal(denied.ok, false);
  if (!denied.ok) {
    assert.equal(denied.code, "core_not_applied");
    assert.equal(httpStatusForIntakeDenial(denied.code), 503);
  }

  const partnerDenied = await submitSupportIntake({
    payload: {
      source: "partner",
      subject: "Partner hjelp",
      message: "Trenger hjelp med partnerportalen.",
    },
    actor: { kind: "partner", userId: "u1", partnerId: "p1" },
  });
  assert.equal(partnerDenied.ok, false);

  const appWrongActor = await submitSupportIntake({
    payload: {
      source: "app",
      subject: "APP hjelp",
      message: "Trenger hjelp i appen min her.",
    },
    actor: { kind: "guest" },
  });
  assert.equal(appWrongActor.ok, false);

  assert.equal(
    stripUnresolvedTemplatePlaceholders(
      "Hei {{customer_name}} — sak {{ticket_number}}",
    ),
    "Hei — sak",
  );

  assert.equal(canTransitionSupportStatus("open", "in_progress"), true);
  assert.equal(canTransitionSupportStatus("closed", "open"), false);

  // Gates open on Production Core, but without an rpc client the write path
  // still fails closed (no silent fake success).
  const note = await postInternalNote({
    ticketId: "00000000-0000-0000-0000-000000000001",
    body: "Internt notat",
    agentUserId: "agent",
  });
  assert.equal(note.ok, false);
  if (!note.ok) assert.equal(note.code, "unknown");

  const reply = await postExternalReply({
    ticketId: "00000000-0000-0000-0000-000000000001",
    body: "Svar til kunde",
    agentUserId: "agent",
    includeSignature: true,
  });
  assert.equal(reply.ok, false);
  if (!reply.ok) assert.equal(reply.code, "unknown");

  __resetSupportTemplateStoreForTests();
  assert.equal(listEditableSupportTemplates().length, 10);
  const created = createSupportTemplate({
    name: "Testmal",
    category: "intake",
    subject: "Emne {{ticket_number}}",
    body: "Hei {{customer_name}}\n\n{{agent_name}}",
  });
  assert.equal(created.ok, true);
  if (created.ok) {
    assert.equal(created.persistConfigured, false);
    const archived = archiveSupportTemplate(created.template.id);
    assert.equal(archived.ok, true);
  }
  assert.equal(listEditableSupportTemplates().length, 10);

  const readRpcPath =
    "docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql";
  assert.ok(existsSync(readRpcPath));
  const readRpcSha = createHash("sha256")
    .update(readFileSync(readRpcPath, "utf8"))
    .digest("hex");
  assert.equal(
    readRpcSha,
    "63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291",
  );

  const stagingPath =
    "docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql";
  assert.ok(existsSync(stagingPath));
  const stagingSql = readFileSync(stagingPath, "utf8");
  const stagingSha = createHash("sha256").update(stagingSql).digest("hex");
  assert.equal(
    stagingSha,
    "96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95",
  );
  assert.match(stagingSql, /PREPARED_ONLY/);
  assert.match(stagingSql, /platform_support_post_internal_note/);
  assert.match(stagingSql, /platform_support_post_external_reply_draft/);
  assert.doesNotMatch(
    stagingSql
      .split("\n")
      .filter((l) => !l.trimStart().startsWith("--"))
      .join("\n"),
    /csp_sales_email_/,
  );

  if (previousSupabaseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_URL = previousSupabaseUrl;
  }

  console.log("support-intake.test.ts: ok");
}

void main();
