import type { SupportAssistantContextResponse, SupportAssistantSearchResult } from "./types";
import type { PlatformKnowledgeAction, PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parsePlatformAction(raw: unknown): PlatformKnowledgeAction | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const href = str(row.href);
  if (!href) return null;
  return {
    labelKey: str(row.labelKey),
    label: str(row.label),
    href,
    routeKey: str(row.routeKey),
    variant:
      row.variant === "primary" || row.variant === "secondary" ? row.variant : undefined,
  };
}

function parsePlatformSource(raw: unknown): PlatformKnowledgeAnswer["sources"][number] | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const id = str(row.id);
  const label = str(row.label);
  if (!id || !label) return null;
  return {
    id,
    label,
    kind: str(row.kind, "platform_corpus") as PlatformKnowledgeAnswer["sources"][number]["kind"],
    meta: str(row.meta) || undefined,
  };
}

function parseIntegrationStatusCard(raw: unknown): PlatformKnowledgeAnswer["integrationStatusCard"] {
  if (!raw || typeof raw !== "object") return undefined;
  const row = raw as Record<string, unknown>;
  const labelsRaw = row.labels;
  if (!labelsRaw || typeof labelsRaw !== "object") return undefined;
  const labels = labelsRaw as Record<string, unknown>;
  const scopeItems = Array.isArray(labels.scopeItems)
    ? labels.scopeItems
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const scopeRow = item as Record<string, unknown>;
          const scope = str(scopeRow.scope);
          const description = str(scopeRow.description);
          if (!scope) return null;
          return { scope, description };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
    : [];
  const languageLabels =
    labels.languageLabels && typeof labels.languageLabels === "object"
      ? Object.fromEntries(
          Object.entries(labels.languageLabels as Record<string, unknown>).map(([key, value]) => [
            key,
            str(value),
          ]),
        )
      : {};

  return {
    provider: "unonight",
    organizationName: str(row.organizationName),
    organizationId: str(row.organizationId),
    apiVersion: str(row.apiVersion),
    baseUrl: str(row.baseUrl),
    scopes: Array.isArray(row.scopes) ? row.scopes.map((s) => str(s)).filter(Boolean) : [],
    supportedLocales: Array.isArray(row.supportedLocales)
      ? row.supportedLocales.map((s) => str(s)).filter(Boolean)
      : [],
    lastVerifiedAt: str(row.lastVerifiedAt) || null,
    lastUsedAt: str(row.lastUsedAt) || null,
    checkedAt: str(row.checkedAt),
    labels: {
      cardTitle: str(labels.cardTitle),
      cardSupporting: str(labels.cardSupporting),
      fieldOrganization: str(labels.fieldOrganization),
      fieldOrganizationId: str(labels.fieldOrganizationId),
      fieldApiVersion: str(labels.fieldApiVersion),
      fieldAccessMode: str(labels.fieldAccessMode),
      fieldConnectionStatus: str(labels.fieldConnectionStatus),
      fieldBaseUrl: str(labels.fieldBaseUrl),
      fieldLastVerified: str(labels.fieldLastVerified),
      fieldLastUsed: str(labels.fieldLastUsed),
      fieldScopes: str(labels.fieldScopes),
      fieldSupportedLanguages: str(labels.fieldSupportedLanguages),
      accessModeReadOnly: str(labels.accessModeReadOnly),
      statusConnectedVerified: str(labels.statusConnectedVerified),
      timestampUnavailable: str(labels.timestampUnavailable),
      scopesExplainShow: str(labels.scopesExplainShow),
      scopesExplainHide: str(labels.scopesExplainHide),
      sourceTitle: str(labels.sourceTitle),
      sourceLabel: str(labels.sourceLabel),
      sourceMeta: str(labels.sourceMeta),
      languagesUnavailable: str(labels.languagesUnavailable),
      scopeItems,
      languageLabels,
      ariaCard: str(labels.ariaCard),
      ariaScopesToggle: str(labels.ariaScopesToggle),
    },
  };
}

function parsePlatformSnapshotCard(raw: unknown): PlatformKnowledgeAnswer["platformSnapshotCard"] {
  if (!raw || typeof raw !== "object") return undefined;
  const row = raw as Record<string, unknown>;
  const labelsRaw = row.labels;
  if (!labelsRaw || typeof labelsRaw !== "object") return undefined;
  const labels = labelsRaw as Record<string, unknown>;
  const languageLabels =
    labels.languageLabels && typeof labels.languageLabels === "object"
      ? Object.fromEntries(
          Object.entries(labels.languageLabels as Record<string, unknown>).map(([key, value]) => [
            key,
            str(value),
          ]),
        )
      : {};
  const moduleLabels =
    labels.moduleLabels && typeof labels.moduleLabels === "object"
      ? Object.fromEntries(
          Object.entries(labels.moduleLabels as Record<string, unknown>).map(([key, value]) => [
            key,
            str(value),
          ]),
        )
      : {};

  const availabilityStatus = str(row.availabilityStatus, "available") as
    | "available"
    | "degraded"
    | "maintenance";

  return {
    provider: "unonight",
    environment: str(row.environment),
    platformVersion: str(row.platformVersion),
    availabilityStatus,
    activeModules: Array.isArray(row.activeModules)
      ? row.activeModules.map((entry) => str(entry)).filter(Boolean)
      : [],
    supportedLocales: Array.isArray(row.supportedLocales)
      ? row.supportedLocales.map((entry) => str(entry)).filter(Boolean)
      : [],
    checkedAt: str(row.checkedAt),
    labels: {
      cardTitle: str(labels.cardTitle),
      cardSupporting: str(labels.cardSupporting),
      fieldEnvironment: str(labels.fieldEnvironment),
      fieldPlatformVersion: str(labels.fieldPlatformVersion),
      fieldAvailability: str(labels.fieldAvailability),
      fieldActiveModules: str(labels.fieldActiveModules),
      fieldSupportedLanguages: str(labels.fieldSupportedLanguages),
      fieldCheckedAt: str(labels.fieldCheckedAt),
      timestampUnavailable: str(labels.timestampUnavailable),
      availabilityAvailable: str(labels.availabilityAvailable),
      availabilityDegraded: str(labels.availabilityDegraded),
      availabilityMaintenance: str(labels.availabilityMaintenance),
      sourceTitle: str(labels.sourceTitle),
      sourceLabel: str(labels.sourceLabel),
      sourceMeta: str(labels.sourceMeta),
      languagesUnavailable: str(labels.languagesUnavailable),
      languageLabels,
      moduleLabels,
      ariaCard: str(labels.ariaCard),
    },
  };
}

function parsePlatformAnswer(raw: unknown): PlatformKnowledgeAnswer | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const row = raw as Record<string, unknown>;
  const actions = Array.isArray(row.actions)
    ? row.actions.map(parsePlatformAction).filter((a): a is PlatformKnowledgeAction => a !== null)
    : [];
  const sources = Array.isArray(row.sources)
    ? row.sources.map(parsePlatformSource).filter((s): s is NonNullable<ReturnType<typeof parsePlatformSource>> => s !== null)
    : [];
  return {
    directAnswer: str(row.directAnswer),
    explanation: str(row.explanation) || undefined,
    integrationStatusCard: parseIntegrationStatusCard(row.integrationStatusCard),
    platformSnapshotCard: parsePlatformSnapshotCard(row.platformSnapshotCard),
    status: str(row.status) || undefined,
    steps: Array.isArray(row.steps) ? row.steps.map((s) => str(s)) : [],
    actions,
    sources,
    sourceId: str(row.sourceId),
    source: str(row.source, "platform_corpus") as PlatformKnowledgeAnswer["source"],
    confidence: str(row.confidence, "moderate") as PlatformKnowledgeAnswer["confidence"],
    title: str(row.title) || undefined,
    showSupportEscalation: row.showSupportEscalation === true,
    liveIntegrationToolUsed: row.liveIntegrationToolUsed === true,
    orgConfirmEligible: row.orgConfirmEligible !== false,
    requestedLiveIntegration: row.requestedLiveIntegration === true,
    orgConfirmBlockedReason: str(row.orgConfirmBlockedReason) || undefined,
    integrationToolName: str(row.integrationToolName) || undefined,
  };
}

export type EnrichedSupportAssistantSearchResult = SupportAssistantSearchResult & {
  answer?: PlatformKnowledgeAnswer;
  source?: string;
  confidence?: string;
  matched_article_id?: string;
  corpus_version?: string;
};

export function parseSupportAssistantSearch(data: unknown): EnrichedSupportAssistantSearchResult {
  if (!data || typeof data !== "object") {
    return { found: false, query: "", articles: [] };
  }
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    query: str(d.query),
    answer: parsePlatformAnswer(d.answer),
    source: str(d.source) || undefined,
    confidence: str(d.confidence) || undefined,
    matched_article_id: str(d.matched_article_id) || undefined,
    corpus_version: str(d.corpus_version) || undefined,
    articles: Array.isArray(d.articles)
      ? d.articles.map((a) => {
          const row = a as Record<string, unknown>;
          return {
            id: str(row.id),
            title: str(row.title),
            summary: str(row.summary),
            steps: Array.isArray(row.steps) ? row.steps.map((s) => str(s)) : [],
            category: str(row.category, "general"),
            related_module: str(row.related_module) || undefined,
            related_articles: Array.isArray(row.related_articles)
              ? row.related_articles.map((r) => {
                  const rel = r as Record<string, unknown>;
                  return { id: str(rel.id), title: str(rel.title) };
                })
              : [],
            searchText: str(row.searchText),
          };
        })
      : [],
  };
}

export function parseSupportAssistantContext(data: unknown): SupportAssistantContextResponse {
  if (!data || typeof data !== "object") return { prepared: false };
  const d = data as Record<string, unknown>;
  return {
    prepared: d.prepared === true,
    context_id: str(d.context_id) || undefined,
    context: typeof d.context === "object" && d.context ? (d.context as Record<string, unknown>) : undefined,
    requires_confirmation: d.requires_confirmation === true,
    support_request_route: str(d.support_request_route) || undefined,
  };
}
