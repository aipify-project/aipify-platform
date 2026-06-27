import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionArtifactContextPayload } from "@/lib/companion-runtime/artifact-context/types";
import type { CompanionExternalProviderHandoff } from "@/lib/companion-runtime/artifact-context/types";
import type { AppOrganizationRole } from "@/lib/app-portal/nav-config";
import type { Translator } from "@/lib/i18n/translate";
import type { UserRole } from "@/lib/tenant/types";

export type PlatformKnowledgeSource =
  | "platform_corpus"
  | "route_match"
  | "knowledge_center"
  | "organization_knowledge"
  | "customer_context"
  | "verified_integration"
  | "fallback";

export type PlatformKnowledgeConfidence = "high" | "moderate" | "low";

export type PlatformKnowledgeCategory =
  | "general"
  | "companion"
  | "navigation"
  | "organization"
  | "billing"
  | "security"
  | "integrations"
  | "support"
  | "business_packs"
  | "account"
  | "governance";

export type PlatformCorpusArticleId =
  | "aipify-overview"
  | "aipify-capabilities"
  | "app-panel-navigation"
  | "add-team-members"
  | "change-roles"
  | "upgrade-subscription"
  | "subscription-pricing"
  | "my-subscription"
  | "find-invoices"
  | "find-receipts"
  | "connect-shopify"
  | "enable-2fa"
  | "install-web-app"
  | "contact-support"
  | "aipify-group-location"
  | "business-packs"
  | "since-last-login"
  | "companion-overview"
  | "command-brief"
  | "knowledge-center"
  | "notifications-preferences"
  | "vacation-mode"
  | "api-access"
  | "what-is-api"
  | "find-api-key"
  | "create-api-key"
  | "connect-system"
  | "aipify-data-access"
  | "approvals"
  | "audit-governance"
  | "language-settings";

export type PlatformKnowledgeSourceKind =
  | "platform_corpus"
  | "route_registry"
  | "knowledge_center"
  | "customer_context"
  | "org_knowledge"
  | "verified_integration";

export type PlatformKnowledgeSourceRef = {
  id: string;
  label: string;
  kind: PlatformKnowledgeSourceKind;
  meta?: string;
};

export type PlatformCorpusEntry = {
  id: PlatformCorpusArticleId;
  titleKey: string;
  directAnswerKey: string;
  explanationKey: string;
  stepKeys: string[];
  searchTermsKey: string;
  category: PlatformKnowledgeCategory;
  primaryRouteKey?: string;
  actionRouteKeys: string[];
  requiredRoles?: UserRole[];
  featureKey?: string;
  requiresCustomerContext?: boolean;
};

export type PlatformRouteEntry = {
  routeKey: string;
  href: string;
  titleKey: string;
  descriptionKey: string;
  category: PlatformKnowledgeCategory;
  featureKey?: string;
  requiredRoles?: UserRole[];
  planRequirements?: string[];
  businessPackRequirements?: string[];
  navId?: string;
};

export type PlatformKnowledgeAction = {
  labelKey: string;
  label: string;
  href: string;
  routeKey: string;
  variant?: "primary" | "secondary";
};

export type IntegrationStatusScopeItem = {
  scope: string;
  description: string;
};

export type IntegrationStatusCardLabels = {
  cardTitle: string;
  cardSupporting: string;
  fieldOrganization: string;
  fieldOrganizationId: string;
  fieldApiVersion: string;
  fieldAccessMode: string;
  fieldConnectionStatus: string;
  fieldBaseUrl: string;
  fieldLastVerified: string;
  fieldLastUsed: string;
  fieldScopes: string;
  fieldSupportedLanguages: string;
  accessModeReadOnly: string;
  statusConnectedVerified: string;
  timestampUnavailable: string;
  scopesExplainShow: string;
  scopesExplainHide: string;
  sourceTitle: string;
  sourceLabel: string;
  sourceMeta: string;
  languagesUnavailable: string;
  scopeItems: IntegrationStatusScopeItem[];
  languageLabels: Record<string, string>;
  ariaCard: string;
  ariaScopesToggle: string;
};

export type IntegrationStatusCardPayload = {
  provider: "unonight";
  organizationName: string;
  organizationId: string;
  apiVersion: string;
  baseUrl: string;
  scopes: string[];
  supportedLocales: string[];
  lastVerifiedAt: string | null;
  lastUsedAt: string | null;
  checkedAt: string;
  labels: IntegrationStatusCardLabels;
};

export type PlatformSnapshotCardLabels = {
  cardTitle: string;
  cardSupporting: string;
  fieldEnvironment: string;
  fieldPlatformVersion: string;
  fieldAvailability: string;
  fieldActiveModules: string;
  fieldSupportedLanguages: string;
  fieldCheckedAt: string;
  timestampUnavailable: string;
  availabilityAvailable: string;
  availabilityDegraded: string;
  availabilityMaintenance: string;
  sourceTitle: string;
  sourceLabel: string;
  sourceMeta: string;
  languagesUnavailable: string;
  languageLabels: Record<string, string>;
  moduleLabels: Record<string, string>;
  ariaCard: string;
  environmentDisplay: string;
  platformVersionDisplay: string;
};

export type PlatformSnapshotCardPayload = {
  provider: "unonight";
  environment: string;
  platformVersion: string;
  availabilityStatus: "available" | "degraded" | "maintenance";
  activeModules: string[];
  supportedLocales: string[];
  checkedAt: string;
  labels: PlatformSnapshotCardLabels;
};

export type PlatformKnowledgeAnswer = {
  directAnswer: string;
  explanation?: string;
  integrationStatusCard?: IntegrationStatusCardPayload;
  platformSnapshotCard?: PlatformSnapshotCardPayload;
  status?: string;
  steps: string[];
  actions: PlatformKnowledgeAction[];
  sources: PlatformKnowledgeSourceRef[];
  sourceId: string;
  source: PlatformKnowledgeSource;
  confidence: PlatformKnowledgeConfidence;
  title?: string;
  showSupportEscalation?: boolean;
  liveIntegrationToolUsed?: boolean;
  orgConfirmEligible?: boolean;
  requestedLiveIntegration?: boolean;
  orgConfirmBlockedReason?: string;
  integrationToolName?: string;
  artifactContext?: CompanionArtifactContextPayload;
  externalHandoff?: CompanionExternalProviderHandoff;
  /** Pending booking write handoff pointer — action request ID only (P1.12C3C). */
  pendingBookingWrite?: {
    actionRequestId: string;
  } | null;
  /** Pending booking clarification draft — proposal-only (P1.12C3ZH). */
  pendingBookingClarification?: import("@/lib/companion-runtime/booking-pending-action-pointer").PendingBookingClarificationState | null;
};

export type ResolvedPlatformArticle = {
  id: PlatformCorpusArticleId;
  title: string;
  directAnswer: string;
  explanation: string;
  steps: string[];
  searchTerms: string[];
  category: PlatformKnowledgeCategory;
  primaryRouteKey?: string;
  actionRouteKeys: string[];
  requiredRoles?: UserRole[];
  featureKey?: string;
  requiresCustomerContext?: boolean;
};

export type PlatformSearchContext = {
  locale: string;
  userRole: UserRole;
  organizationRole?: AppOrganizationRole;
  enabledFeatures?: string[];
  planKey?: string;
};

export type CustomerSubscriptionContext = {
  planKey: string;
  planLabel: string;
  status: string;
  renewalDate?: string;
};

export type PlatformSearchOptions = {
  t: Translator;
  locale: string;
  ctx: PlatformSearchContext;
  getSearchTermsArray: (key: string) => string[];
  subscriptionRaw?: unknown;
  supabase?: SupabaseClient;
  integrationContext?: string | null;
  snapshotContext?: { activeModules?: readonly string[] };
  artifactContext?: CompanionArtifactContextPayload;
  tenantContext?: import("@/lib/companion-runtime/companion-tenant-context").CompanionTenantContext;
  /** True when the user is already inside the Companion chat surface. */
  companionSurface?: boolean;
  /** Active conversation — used for deduplicated playful bell events. */
  conversationId?: string | null;
};

export type PlatformSearchResult = {
  answer: PlatformKnowledgeAnswer;
  matchedArticleId?: PlatformCorpusArticleId;
};

export type UnansweredQuestionRecord = {
  query: string;
  locale: string;
  source: PlatformKnowledgeSource;
  confidence: PlatformKnowledgeConfidence;
  recordedAt: string;
};
