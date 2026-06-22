import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CompanionSchemaCollection } from "./companion-schema-context";
import { hasApprovedSchemaEntities } from "./companion-schema-context";

function formatEntityKeys(collection: CompanionSchemaCollection): string {
  return collection.availableEntities.slice(0, 5).join(", ");
}

function formatOperations(collection: CompanionSchemaCollection): string {
  return collection.availableOperations.join(", ");
}

export function enrichAnswerWithSchemaContext(
  answer: PlatformKnowledgeAnswer,
  schemaContext: CompanionSchemaCollection,
  t: Translator,
): PlatformKnowledgeAnswer {
  if (schemaContext.permissionDenied) {
    return {
      ...answer,
      explanation: [
        answer.explanation,
        t("customerApp.companionPlatformKnowledge.schema.accessDenied"),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  if (schemaContext.appEntitlementBlocked) {
    return {
      ...answer,
      explanation: [
        answer.explanation,
        t("customerApp.companionPlatformKnowledge.schema.entitlementBlocked"),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  if (!hasApprovedSchemaEntities(schemaContext)) {
    return {
      ...answer,
      explanation: [answer.explanation, t("customerApp.companionPlatformKnowledge.schema.empty")]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  let contextLine = t("customerApp.companionPlatformKnowledge.schema.entitiesSummary")
    .replace("{count}", String(schemaContext.availableEntities.length))
    .replace("{entities}", formatEntityKeys(schemaContext));

  if (schemaContext.availableOperations.length > 0) {
    contextLine = `${contextLine} ${t("customerApp.companionPlatformKnowledge.schema.operationsSummary")
      .replace("{operations}", formatOperations(schemaContext))}`;
  }

  if (!schemaContext.availableOperations.includes("write")) {
    contextLine = `${contextLine} ${t("customerApp.companionPlatformKnowledge.schema.readOnlyNote")}`;
  }

  return {
    ...answer,
    explanation: [answer.explanation, contextLine].filter(Boolean).join("\n\n"),
    sources: [
      ...answer.sources,
      {
        id: "schema-context",
        label: t("customerApp.companionPlatformKnowledge.schema.sourceLabel"),
        kind: "customer_context",
      },
    ],
  };
}
