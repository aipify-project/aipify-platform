import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  isUnknownOrganizationSourceIntent,
  hasExplicitOrganizationMemberSearchIntent,
} from "@/lib/companion-runtime/unknown-organization-source-intent";
import {
  resolveOrganizationCapabilityRoute,
  isOrganizationCapabilityQuery,
} from "@/lib/companion-runtime/organization-capability-resolution";
import { classifyCompanionTurnRoute } from "@/lib/companion-runtime/companion-turn-route";
import { classifyCompanionSubmitPath } from "@/lib/companion-runtime/companion-submit-path";
import { resolveOrganizationIntelligenceIntent } from "@/lib/companion-runtime/organization-intelligence-intent";
import { resolveOrganizationIntelligenceAnswer } from "@/lib/companion-runtime/organization-intelligence-routing";
import { buildUnknownOrganizationSourceAnswer } from "@/lib/companion-runtime/unknown-organization-source-answer";
import { createEmptyCompanionTenantContext } from "@/lib/companion-runtime/companion-tenant-context";

const repoRoot = path.join(import.meta.dirname, "..", "..");

function loadJson(relativePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8")) as Record<
    string,
    unknown
  >;
}

function createTranslator(locale: string) {
  const platformKnowledge = loadJson(`locales/${locale}/customer-app/companionPlatformKnowledge.json`);
  const enPlatform =
    locale === "en"
      ? platformKnowledge
      : loadJson("locales/en/customer-app/companionPlatformKnowledge.json");

  return (key: string): string => {
    const parts = key.split(".");
    const rest = parts.slice(2).join(".");
    const root = platformKnowledge.companionPlatformKnowledge as Record<string, unknown>;
    const enRoot = enPlatform.companionPlatformKnowledge as Record<string, unknown>;

    const walk = (node: Record<string, unknown>, dotted: string): unknown =>
      dotted.split(".").reduce<unknown>((acc, part) => {
        if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
          return (acc as Record<string, unknown>)[part];
        }
        return undefined;
      }, node);

    const value = walk(root, rest) ?? walk(enRoot, rest);
    return typeof value === "string" ? value : key;
  };
}

async function main() {
  const guestListQuery = "Hent opp gjestelisten til festen";
  const guestListShort = "Vis gjestelisten";
  const memberSearchQuery = "Finn medlemmet Kari";

  assert.equal(isUnknownOrganizationSourceIntent(guestListQuery, "no"), true);
  assert.equal(isUnknownOrganizationSourceIntent(guestListShort, "no"), true);
  assert.equal(isUnknownOrganizationSourceIntent(memberSearchQuery, "no"), false);
  assert.equal(hasExplicitOrganizationMemberSearchIntent(memberSearchQuery), true);

  assert.equal(resolveOrganizationCapabilityRoute(guestListQuery, "no"), null);
  assert.equal(isOrganizationCapabilityQuery(guestListQuery, "no"), false);
  assert.equal(resolveOrganizationIntelligenceIntent(guestListQuery, "no"), null);
  assert.equal(classifyCompanionTurnRoute(guestListQuery, "no"), "exact_source");
  assert.equal(classifyCompanionSubmitPath(guestListQuery, "no"), "direct");

  const memberRoute = resolveOrganizationCapabilityRoute(memberSearchQuery, "no");
  assert.ok(memberRoute, "member search should still resolve a capability route");
  assert.equal(memberRoute?.capability_key, "member.search");

  const tNo = createTranslator("no");

  const ownerAnswer = buildUnknownOrganizationSourceAnswer({
    t: tNo,
    organizationRole: "organization_owner",
  });
  assert.equal(ownerAnswer.sourceId, "organization-unknown-source");
  assert.match(
    ownerAnswer.directAnswer ?? "",
    /ingen koblet kilde for festplanlegging eller gjestelister/i,
  );
  assert.match(ownerAnswer.explanation ?? "", /koble en kilde/i);

  const employeeAnswer = buildUnknownOrganizationSourceAnswer({
    t: tNo,
    organizationRole: "organization_member",
  });
  assert.match(employeeAnswer.directAnswer ?? "", /ingen koblet kilde/i);
  assert.match(employeeAnswer.explanation ?? "", /eier eller administrator/i);

  const ownerResolved = await resolveOrganizationIntelligenceAnswer(guestListQuery, {
    t: tNo,
    tenantContext: createEmptyCompanionTenantContext({
      locale: "no",
      organizationRole: "organization_owner",
      organizationId: "org-preview",
    }),
    supabase: null,
    activeLocale: "no",
    companionSurface: true,
  });
  assert.equal(ownerResolved?.answer.sourceId, "organization-unknown-source");
  assert.notEqual(ownerResolved?.answer.sourceId, "organization-intelligence-gap");

  const employeeResolved = await resolveOrganizationIntelligenceAnswer(guestListShort, {
    t: tNo,
    tenantContext: createEmptyCompanionTenantContext({
      locale: "no",
      organizationRole: "organization_member",
      organizationId: "org-preview",
    }),
    supabase: null,
    activeLocale: "no",
    companionSurface: true,
  });
  assert.equal(employeeResolved?.answer.sourceId, "organization-unknown-source");
  assert.match(employeeResolved?.answer.explanation ?? "", /eier eller administrator/i);

  console.log("unknown-organization-source-intent.test.ts: all assertions passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
