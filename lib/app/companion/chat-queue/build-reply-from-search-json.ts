import type { Translator } from "@/lib/i18n/translate";
import type { CompanionOrganizationState } from "@/lib/companion/enrichment/companion-response-enrichment-types";
import {
  enrichCompanionSearchJson,
  type CompanionEnrichmentLogContext,
} from "@/lib/companion/enrichment/companion-response-enrichment";
import type { CompanionExperienceLabels } from "../types";
import { buildReplyFromSearchJson } from "./build-reply";
import type { serializeAssistantPayload } from "./message-payload";

export type BuildEnrichedReplyOptions = {
  locale: string;
  organizationState?: CompanionOrganizationState;
  logContext?: CompanionEnrichmentLogContext;
  t?: Translator;
};

/** Enrichment → message + payload — single CTA pipeline entry for companion turns. */
export async function buildEnrichedReplyFromSearchJson(
  searchJson: Record<string, unknown>,
  labels: CompanionExperienceLabels,
  question: string,
  options: BuildEnrichedReplyOptions,
) {
  const enrichedSearchJson = await enrichCompanionSearchJson(searchJson, {
    query: question,
    locale: options.locale,
    organizationState: options.organizationState,
    logContext: options.logContext,
    t: options.t,
  });

  return buildReplyFromSearchJson(enrichedSearchJson, labels, question);
}

export type EnrichedCompanionReply = {
  message: ReturnType<typeof buildReplyFromSearchJson>["message"];
  payload: ReturnType<typeof serializeAssistantPayload>;
};
