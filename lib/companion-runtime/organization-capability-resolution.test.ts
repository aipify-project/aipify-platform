import assert from "node:assert/strict";
import {
  assessOrganizationCapabilityReadiness,
  resolveOrganizationCapabilityRoute,
} from "@/lib/companion-runtime/organization-capability-resolution";
import { ORGANIZATION_CAPABILITY_REGISTRY } from "@/lib/companion-runtime/organization-capability-registry";

const E2E_QUESTIONS: Array<{
  query: string;
  expectedKind: string;
  expectedCapability: string;
}> = [
  {
    query: "Vis aktive medlemmer.",
    expectedKind: "member_active_list",
    expectedCapability: "member.search",
  },
  {
    query: "Vis medlemmer med brukernavn, medlems-ID og status.",
    expectedKind: "member_detail_list",
    expectedCapability: "member.search",
  },
  {
    query: "Hvilke medlemmer venter på verifisering?",
    expectedKind: "member_pending_verification",
    expectedCapability: "verification_queue.read",
  },
  {
    query: "Er medlem [TESTBRUKER] verifisert?",
    expectedKind: "member_verification_status",
    expectedCapability: "verification_queue.read",
  },
  {
    query: "Hvilke supportsaker nærmer seg eller har brutt SLA?",
    expectedKind: "support_sla",
    expectedCapability: "support_sla.read",
  },
  {
    query: "Hva bør jeg prioritere i dag?",
    expectedKind: "prioritize_today",
    expectedCapability: "command_brief.prioritize",
  },
];

for (const { query, expectedKind, expectedCapability } of E2E_QUESTIONS) {
  const route = resolveOrganizationCapabilityRoute(query, "no");
  assert.ok(route, `expected route for: ${query}`);
  assert.equal(route!.execution_kind, expectedKind, query);
  assert.equal(route!.capability_key, expectedCapability, query);
}

const navigationQuery = "Hvor finner jeg medlemsoversikten i appen?";
assert.equal(resolveOrganizationCapabilityRoute(navigationQuery, "no"), null);

for (const entry of ORGANIZATION_CAPABILITY_REGISTRY) {
  const readiness = assessOrganizationCapabilityReadiness({
    module_id: entry.module_id,
    capability_key: entry.capability_key,
    provider_key: entry.provider_key,
    execution_kind: "member_count",
    member_reference: null,
    confidence: "high",
    resolution_source: "manifest_schema",
  });
  assert.ok(readiness.status, `${entry.module_id} readiness`);
}

console.log("organization-capability-resolution.test.ts: all assertions passed");
