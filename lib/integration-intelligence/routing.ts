import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { detectGenericIntegrationIntent } from "./intent-detection";
import type { CompanionLiveToolName, IntegrationIntelligenceContext } from "./types";

export type CompanionLiveRoutingResult = {
  tool: CompanionLiveToolName;
  intent: ReturnType<typeof detectGenericIntegrationIntent>;
};

export function resolveCompanionLiveToolRouting(
  query: string,
  providerKey: string,
  locale: CustomerActiveLocale,
  options?: IntegrationIntelligenceContext,
): CompanionLiveRoutingResult {
  const intent = detectGenericIntegrationIntent(query, providerKey, locale, options);
  if (!intent) {
    return { tool: "none", intent: null };
  }

  if (intent.queryKind === "forbidden_data_request") {
    return { tool: "forbidden_data_denied", intent };
  }

  if (intent.queryKind === "unsupported_metric") {
    return { tool: "unsupported_live_metric", intent };
  }

  if (intent.capability === "connection_status") {
    return { tool: "get_connection_status", intent };
  }

  return { tool: "get_platform_snapshot", intent };
}
