import type { SupabaseClient } from "@supabase/supabase-js";
import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import {
  formatKnowledgeCenterAnswerBody,
  searchApprovedOrganizationKnowledge,
  searchCanonicalKnowledgeCenter,
} from "./knowledge-sources";
import { buildOrganizationIntelligenceGapAnswer } from "./organization-intelligence-answer";
import type { CompanionExplicitIntent } from "./companion-explicit-intent";
import type { CompanionTenantContext } from "./companion-tenant-context";
import { assessOrganizationCapabilityReadiness } from "./organization-capability-resolution";
import { resolveVerificationSemanticIntent, collectVerificationDescriptorsFromManifests } from "./verification-semantic-intent";
import { listCommunityProviderManifests } from "@/lib/integration-intelligence/community/registry";

const BASE = "customerApp.companionPlatformKnowledge.explicitIntent";

function groundedAnswer(
  directAnswer: string,
  explanation: string,
  sourceId: string,
  capability: string,
): PlatformKnowledgeAnswer {
  return {
    directAnswer,
    explanation,
    steps: [],
    actions: [],
    sources: [{ id: sourceId, label: capability, kind: "customer_context" }],
    sourceId,
    source: "customer_context",
    confidence: "high",
    orgConfirmEligible: false,
    showSupportEscalation: false,
  };
}

export async function buildCompanionExplicitIntentAnswer(input: {
  intent: CompanionExplicitIntent;
  query: string;
  supabase: SupabaseClient;
  tenantContext: CompanionTenantContext;
  t: Translator;
  locale: CustomerActiveLocale;
}): Promise<PlatformKnowledgeAnswer> {
  const { intent, query, supabase, t, locale } = input;

  if (intent.kind === "companion_registration_meta") {
    return groundedAnswer(
      t(`${BASE}.registrationMetaLead`),
      t(`${BASE}.registrationMetaExplanation`),
      "companion-registration-meta",
      "companion.identity",
    );
  }

  if (intent.kind === "media_verification") {
    const verificationIntent = resolveVerificationSemanticIntent({
      query,
      locale,
      descriptors: collectVerificationDescriptorsFromManifests(listCommunityProviderManifests()),
    });
    const readiness = assessOrganizationCapabilityReadiness({
      module_id: "verification.member",
      capability_key: verificationIntent.capability_key,
      provider_key: "community_member_verification",
      execution_kind: "member_pending_verification",
      member_reference: null,
      confidence: "high",
      resolution_source: "domain_semantic",
    });

    if (readiness.status === "permission_required") {
      return buildOrganizationIntelligenceGapAnswer(input.t, "permission_required", {
        sourceReference: readiness.source_reference,
        capabilityKey: verificationIntent.capability_key,
      });
    }

    if (!readiness.provider_active) {
      return groundedAnswer(
        t(`${BASE}.mediaVerificationUnavailable`),
        t(`${BASE}.mediaVerificationUnavailableExplanation`),
        "verification-media-gap",
        verificationIntent.capability_key,
      );
    }

    return groundedAnswer(
      t(`${BASE}.mediaVerificationLead`),
      t(`${BASE}.mediaVerificationExplanation`).replace(
        "{capability}",
        verificationIntent.capability_key,
      ),
      "verification-media",
      verificationIntent.capability_key,
    );
  }

  if (intent.kind === "knowledge_provider_fetch") {
    const kcArticle = await searchCanonicalKnowledgeCenter(supabase, query, locale);
    if (kcArticle) {
      const body = formatKnowledgeCenterAnswerBody(kcArticle);
      return groundedAnswer(
        body || kcArticle.title,
        t(`${BASE}.knowledgeCenterSource`),
        kcArticle.slug,
        "knowledge_center.search",
      );
    }

    const orgKnowledge = await searchApprovedOrganizationKnowledge(supabase, query);
    if (orgKnowledge.kind === "hit") {
      return groundedAnswer(
        orgKnowledge.hit.summary || orgKnowledge.hit.title,
        t(`${BASE}.organizationKnowledgeSource`),
        orgKnowledge.hit.id,
        "organization_knowledge.search",
      );
    }

    const providerLabel = intent.provider_hint ?? t(`${BASE}.providerFallback`);
    return groundedAnswer(
      t(`${BASE}.knowledgeGapLead`).replace("{provider}", providerLabel),
      t(`${BASE}.knowledgeGapExplanation`),
      "knowledge-provider-gap",
      "knowledge_provider.fetch",
    );
  }

  const integrationLabel =
    intent.integration_hint === "google_analytics"
      ? "Google Analytics"
      : intent.integration_hint ?? t(`${BASE}.integrationFallback`);

  return groundedAnswer(
    t(`${BASE}.integrationCheckLead`).replace("{integration}", integrationLabel),
    t(`${BASE}.integrationCheckExplanation`),
    "integration-install-check",
    "integration.install_status",
  );
}
