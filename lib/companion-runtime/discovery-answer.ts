import type { Translator } from "@/lib/i18n/translate";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";
import type { CompanionDiscoveryContext } from "./companion-discovery-context";

function formatSystemNames(discovery: CompanionDiscoveryContext): string {
  return discovery.discoveredSystems
    .filter((system) => system.approvalStatus === "approved")
    .map((system) => system.systemName)
    .slice(0, 5)
    .join(", ");
}

export function enrichAnswerWithInstallDiscovery(
  answer: PlatformKnowledgeAnswer,
  discovery: CompanionDiscoveryContext,
  t: Translator,
): PlatformKnowledgeAnswer {
  if (discovery.permissionDenied || discovery.discoveryStatus === "permission_denied") {
    return {
      ...answer,
      explanation: [answer.explanation, t("customerApp.companionPlatformKnowledge.discovery.accessDenied")]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  if (discovery.discoveryStatus === "unavailable") {
    return answer;
  }

  if (discovery.discoveredSystems.length === 0 && discovery.approvedSources.length === 0) {
    return {
      ...answer,
      explanation: [answer.explanation, t("customerApp.companionPlatformKnowledge.discovery.empty")]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  const systemsSummary = formatSystemNames(discovery);
  const domainCount = discovery.discoveredDataDomains.filter(
    (domain) => domain.approvalStatus === "approved",
  ).length;

  let contextLine = t("customerApp.companionPlatformKnowledge.discovery.connectedSummary")
    .replace("{count}", String(discovery.discoveredSystems.length))
    .replace("{systems}", systemsSummary);

  if (domainCount > 0) {
    contextLine = `${contextLine} ${t("customerApp.companionPlatformKnowledge.discovery.domainsSummary")
      .replace("{count}", String(domainCount))}`;
  }

  if (discovery.unavailableDomains.length > 0) {
    contextLine = `${contextLine} ${t("customerApp.companionPlatformKnowledge.discovery.missingDomains")
      .replace("{domains}", discovery.unavailableDomains.slice(0, 4).join(", "))}`;
  }

  if (discovery.discoveryFreshness === "stale") {
    contextLine = `${contextLine} ${t("customerApp.companionPlatformKnowledge.discovery.stale")}`;
  }

  return {
    ...answer,
    explanation: [answer.explanation, contextLine].filter(Boolean).join("\n\n"),
    sources: [
      ...answer.sources,
      {
        id: "install-discovery",
        label: t("customerApp.companionPlatformKnowledge.discovery.sourceLabel"),
        kind: "customer_context",
        meta: discovery.discoveryFreshness,
      },
    ],
  };
}

export function hasApprovedInstallDiscovery(discovery: CompanionDiscoveryContext): boolean {
  return (
    discovery.discoveryStatus === "ready" ||
    discovery.discoveryStatus === "partial" ||
    discovery.discoveredSystems.some((system) => system.approvalStatus === "approved") ||
    discovery.approvedSources.length > 0
  );
}
