import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer, PlatformSearchResult } from "@/lib/companion-platform-knowledge/types";
import type { TenantModelPolicy } from "@/lib/intelligence/types";
import type { CompanionTenantContext } from "./companion-tenant-context";
import { buildCompanionModelContext } from "./companion-model-context";
import { selectCompanionModelProfile } from "./companion-model-routing";
import { evaluateCompanionSynthesisEligibility } from "./companion-model-synthesis-governance";
import {
  buildCompanionSynthesisNaturalLead,
  executeCompanionSynthesisAdapter,
} from "./companion-synthesis-adapter";

export type CompanionModelSynthesisResult = {
  answer: PlatformKnowledgeAnswer;
  synthesized: boolean;
  profile_id: string | null;
  fallback_used: boolean;
  error_code: string | null;
};

export type ApplyCompanionModelSynthesisInput = {
  result: PlatformSearchResult;
  query: string;
  tenantContext: CompanionTenantContext;
  locale: CustomerActiveLocale;
  t: Translator;
  skipSynthesis?: boolean;
  liveAnswer?: boolean;
  modelPolicy?: TenantModelPolicy | null;
};

function logSynthesisFailure(errorCode: string, profileId: string | null): void {
  if (process.env.NODE_ENV === "test") return;
  console.warn("[companion-runtime:synthesis]", {
    error_code: errorCode,
    profile_id: profileId,
  });
}

export function synthesizeCompanionAnswer(
  input: ApplyCompanionModelSynthesisInput,
): CompanionModelSynthesisResult {
  const constraintKeys = [
    "customerApp.companionPlatformKnowledge.synthesis.constraints.preserveFacts",
    "customerApp.companionPlatformKnowledge.synthesis.constraints.preserveSources",
    "customerApp.companionPlatformKnowledge.synthesis.constraints.noActions",
    "customerApp.companionPlatformKnowledge.synthesis.constraints.noFabrication",
  ];

  const modelContext = buildCompanionModelContext({
    query: input.query,
    locale: input.locale,
    answer: input.result.answer,
    tenantContext: input.tenantContext,
    liveAnswer: input.liveAnswer,
    constraintKeys,
  });

  const eligibility = evaluateCompanionSynthesisEligibility({
    answer: input.result.answer,
    modelContext,
    skipSynthesis: input.skipSynthesis,
  });

  if (!eligibility.eligible) {
    return {
      answer: input.result.answer,
      synthesized: false,
      profile_id: null,
      fallback_used: true,
      error_code: eligibility.reason,
    };
  }

  const selection = selectCompanionModelProfile({
    modelContext,
    policy: input.modelPolicy ?? input.tenantContext.modelPolicy ?? { mode: "aipify_managed" },
  });

  if (!selection) {
    logSynthesisFailure("routing_unavailable", null);
    return {
      answer: input.result.answer,
      synthesized: false,
      profile_id: null,
      fallback_used: true,
      error_code: "routing_unavailable",
    };
  }

  const synthesis = executeCompanionSynthesisAdapter(selection.provider_key, {
    modelContext,
    deterministicDirect: input.result.answer.directAnswer,
    deterministicExplanation: input.result.answer.explanation,
    locale: input.locale,
    naturalLead: buildCompanionSynthesisNaturalLead(modelContext, input.t),
  });

  if (!synthesis.ok) {
    logSynthesisFailure(synthesis.code, selection.profile_id);
    return {
      answer: input.result.answer,
      synthesized: false,
      profile_id: selection.profile_id,
      fallback_used: true,
      error_code: synthesis.code,
    };
  }

  return {
    answer: {
      ...input.result.answer,
      directAnswer: synthesis.directAnswer,
      explanation: synthesis.explanation ?? input.result.answer.explanation,
      sources: input.result.answer.sources,
      steps: input.result.answer.steps,
      actions: input.result.answer.actions,
    },
    synthesized: true,
    profile_id: selection.profile_id,
    fallback_used: false,
    error_code: null,
  };
}

export function applyCompanionModelSynthesis(
  input: ApplyCompanionModelSynthesisInput,
): PlatformSearchResult {
  const synthesis = synthesizeCompanionAnswer(input);
  return {
    ...input.result,
    answer: synthesis.answer,
  };
}
