import type { AppOrganizationRole } from "@/lib/app-portal/nav-config";
import type { UserRole } from "@/lib/tenant/types";

export type PlatformKnowledgeSource =
  | "platform_corpus"
  | "route_match"
  | "knowledge_center"
  | "customer_context"
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
  | "org_knowledge";

export type PlatformKnowledgeSourceRef = {
  id: string;
  label: string;
  kind: PlatformKnowledgeSourceKind;
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
};

export type PlatformKnowledgeAnswer = {
  directAnswer: string;
  explanation?: string;
  status?: string;
  steps: string[];
  actions: PlatformKnowledgeAction[];
  sources: PlatformKnowledgeSourceRef[];
  sourceId: string;
  source: PlatformKnowledgeSource;
  confidence: PlatformKnowledgeConfidence;
  title?: string;
  showSupportEscalation?: boolean;
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
