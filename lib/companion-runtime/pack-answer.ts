import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CompanionBusinessPackCollection } from "./companion-business-pack-context";
import { hasActiveBusinessPackEntitlements } from "./companion-business-pack-context";

function formatActivePackKeys(collection: CompanionBusinessPackCollection): string {
  return collection.packs.map((pack) => pack.pack_key).slice(0, 5).join(", ");
}

export function enrichAnswerWithBusinessPackContext(
  answer: PlatformKnowledgeAnswer,
  packContext: CompanionBusinessPackCollection,
  t: Translator,
): PlatformKnowledgeAnswer {
  if (packContext.permissionDenied) {
    return {
      ...answer,
      explanation: [
        answer.explanation,
        t("customerApp.companionPlatformKnowledge.packs.accessDenied"),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  if (packContext.appEntitlementBlocked) {
    return {
      ...answer,
      explanation: [
        answer.explanation,
        t("customerApp.companionPlatformKnowledge.packs.entitlementBlocked"),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  if (!hasActiveBusinessPackEntitlements(packContext)) {
    return {
      ...answer,
      explanation: [answer.explanation, t("customerApp.companionPlatformKnowledge.packs.empty")]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  let contextLine = t("customerApp.companionPlatformKnowledge.packs.activeSummary")
    .replace("{count}", String(packContext.packs.length))
    .replace("{packs}", formatActivePackKeys(packContext));

  if (packContext.entitledCapabilities.length > 0) {
    contextLine = `${contextLine} ${t("customerApp.companionPlatformKnowledge.packs.capabilitiesSummary")
      .replace("{count}", String(packContext.entitledCapabilities.length))}`;
  } else {
    contextLine = `${contextLine} ${t("customerApp.companionPlatformKnowledge.packs.missingEntitlement")}`;
  }

  return {
    ...answer,
    explanation: [answer.explanation, contextLine].filter(Boolean).join("\n\n"),
    sources: [
      ...answer.sources,
      {
        id: "business-pack-context",
        label: t("customerApp.companionPlatformKnowledge.packs.sourceLabel"),
        kind: "customer_context",
      },
    ],
  };
}
