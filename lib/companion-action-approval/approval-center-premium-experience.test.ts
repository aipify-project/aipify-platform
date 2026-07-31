import assert from "node:assert/strict";
import test from "node:test";
import type { CustomerApproval } from "@/lib/app/customer-app/types";
import {
  buildApprovalViewModel,
  resolveApprovalDisplayTitle,
  resolveApprovalRoleLabel,
  resolveApprovalRiskKey,
  resolveApprovalRiskLabel,
  resolveApprovalStatusLabel,
  shortenTechnicalId,
  type ApprovalPresentationLabels,
} from "./presentation";
import { normalizeApprovalDetail } from "./normalize-detail";

const labels: ApprovalPresentationLabels = {
  statusLabels: {
    pending: "Venter på godkjenning",
    approved: "Godkjent",
    rejected: "Avvist",
    expired: "Utløpt",
    consumed: "Brukt",
  },
  riskLevels: {
    "0": "Ingen risiko",
    "1": "Lav risiko",
    "2": "Moderat risiko",
    "3": "Høy risiko",
    "4": "Kritisk handling",
    high: "Høy risiko",
  },
  riskDescriptions: {
    "3": "Handlingen kan publisere, endre tilgang eller påvirke eksterne systemer.",
  },
  roleLabels: {
    owner: "Eier",
    admin: "Administrator",
    staff: "Medarbeider",
    read_only: "Kun lesetilgang",
    approver: "Godkjenner",
  },
  sourceLabels: {
    kompis: "Website Kompis",
    aipify: "Aipify",
  },
  categoryLabels: {
    action: "Aipify-handling",
  },
  kompisPublishTitle: "Publiser nettstedutkast",
  kompisRollbackTitle: "Rull tilbake nettstedversjon",
  kompisPublishDetailTitle: "Publiser nettstedutkast",
  websiteKompisSource: "Website Kompis",
  localeNames: { no: "Norsk", en: "Engelsk" },
  createdAtLabel: "Opprettet",
  expiresAtLabel: "Utløper",
  validForLabel: "Gyldig i",
  expiresSoon: "Utløper snart",
  whatChangesTitle: "Hva som endres",
  whatUnchangedTitle: "Hva som ikke endres",
  recommendationTitle: "Hvorfor",
  riskControlTitle: "Risiko",
  decisionTitle: "Beslutning",
  technicalDetails: "Tekniske detaljer",
  reviewCta: "Gjennomgå",
  pendingCount: (count) => `${count} venter`,
  summaryWebsitePublish: "Endringen gjelder kun {path}.",
  recommendationWebsitePublish: "Anbefaling",
  reversibilityWebsitePublish: "Kan reverseres",
  afterApproveWebsitePublish: "Publiserer",
  afterRejectWebsitePublish: "Publiserer ikke",
  whatChangesWebsitePublish: ["Kun valgt side"],
  whatUnchangedWebsitePublish: ["Forsiden endres ikke"],
  fallbackTitle: "Handling venter",
  typeApproval: "Godkjenning",
};

const productionShape: CustomerApproval = {
  id: "bb098f62-a20a-4fc9-9d32-f174b72d9abc",
  title: "Kompis website publish",
  description: "Godkjenner publisering…",
  category: "action",
  status: "pending",
  risk_level: "3",
  created_at: "2026-07-31T18:17:32.852Z",
  expires_at: "2026-08-01T18:17:32.852Z",
  action_name: "website_publish_approved_draft",
  source: "kompis",
  return_to_kompis: true,
  website_path: "/aipify-cms-qa",
  website_locale: "no",
  candidate_id: "535b6964-0aae-4e3b-b2c9-06ddd97a77a3",
  expected_current_version_id: "7b857e0d-fdb0-4a79-8c33-b8be9e24f5fd",
  current_version_id: "7b857e0d-fdb0-4a79-8c33-b8be9e24f5fd",
  action_checksum: "a8e1801860d0dc104b9881bfc95452889da5a72c0aca01666ae02464d4ffa8d1",
  binding_complete: true,
  approver_role_required: "owner",
  run_id: "86ec08bc-b381-414d-8977-e94944e92c47",
  step_id: "177259f5-b24d-4a20-9c32-51fd0bd53014",
  tool_key: "website_publish_approved_draft",
};

test("status and risk labels never fall back to raw enums for known values", () => {
  assert.equal(resolveApprovalStatusLabel("pending", labels.statusLabels), "Venter på godkjenning");
  assert.equal(resolveApprovalRiskKey(3), "3");
  assert.equal(resolveApprovalRiskLabel(3, labels.riskLevels), "Høy risiko");
  assert.notEqual(resolveApprovalRiskLabel(3, labels.riskLevels), "3");
});

test("roles are localized", () => {
  assert.equal(resolveApprovalRoleLabel("owner", labels.roleLabels), "Eier");
  assert.equal(resolveApprovalRoleLabel("admin", labels.roleLabels), "Administrator");
  assert.equal(resolveApprovalRoleLabel("read_only", labels.roleLabels), "Kun lesetilgang");
});

test("technical IDs are shortened for secondary display", () => {
  assert.equal(shortenTechnicalId(productionShape.id), "bb098f62…");
});

test("website Kompis approval builds premium view model without jargon in primary fields", () => {
  const vm = buildApprovalViewModel(productionShape, {
    locale: "no",
    labels,
    technicalLabels: {
      approvalId: "Godkjennings-ID",
      candidate: "Kandidat",
      currentVersion: "Gjeldende",
      expectedVersion: "Forventet",
      checksum: "Sjekksum",
      audit: "Revisjon",
      run: "Kjøring",
      step: "Steg",
      tool: "Verktøy",
    },
  });
  assert.ok(vm);
  assert.equal(vm!.displayTitle, "Publiser nettstedutkast");
  assert.match(vm!.displaySummary, /\/aipify-cms-qa/);
  assert.equal(vm!.statusLabel, "Venter på godkjenning");
  assert.equal(vm!.riskLabel, "Høy risiko");
  assert.equal(vm!.roleLabel, "Eier");
  assert.equal(vm!.sourceLabel, "Website Kompis");
  assert.equal(vm!.localeLabel, "Norsk");
  assert.ok(vm!.whatUnchanged.includes("Forsiden endres ikke"));
  assert.ok(vm!.technicalRows.some((row) => row.key === "candidate"));
  assert.ok(vm!.decisionAllowed);
});

test("null optional metadata does not throw", () => {
  const sparse = {
    id: "11111111-1111-4111-8111-111111111111",
    title: "",
    description: "",
    category: "action",
    status: "pending",
    risk_level: "2",
    created_at: "",
    action_name: "generic_action",
  } as CustomerApproval;
  const detail = normalizeApprovalDetail(sparse);
  assert.ok(detail);
  assert.equal(detail!.description, "");
  assert.equal(detail!.expiresAt, null);
  const title = resolveApprovalDisplayTitle(detail!, labels);
  assert.equal(title, "Handling venter");
});

test("layout contract constants", () => {
  assert.equal("/app/approvals?request=", "/app/approvals?request=");
  assert.match("/app/approvals?request=bb098f62-a20a-4fc9-9d32-f174b72d9abc", /request=/);
});
