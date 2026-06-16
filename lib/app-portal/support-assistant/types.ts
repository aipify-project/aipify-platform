export type SupportAssistantArticleId =
  | "contact-support"
  | "connect-integration"
  | "manage-subscription"
  | "invite-team-members"
  | "install-business-pack"
  | "upgrade-plan"
  | "what-is-aipify"
  | "what-are-business-packs"
  | "view-invoices"
  | "role-management"
  | "feature-access";

export type SupportAssistantArticle = {
  id: SupportAssistantArticleId | string;
  title: string;
  summary: string;
  steps: string[];
  category: string;
  related_module?: string;
  related_articles: Array<{ id: string; title: string }>;
  searchText: string;
};

export type SupportAssistantSearchResult = {
  found: boolean;
  query: string;
  articles: SupportAssistantArticle[];
};

export type SupportAssistantContextResponse = {
  prepared: boolean;
  context_id?: string;
  context?: Record<string, unknown>;
  requires_confirmation?: boolean;
  support_request_route?: string;
};

export type SupportAssistantLabels = {
  title: string;
  subtitle: string;
  loading: string;
  emptyPrompt: string;
  searchPlaceholder: string;
  searchButton: string;
  suggestedTitle: string;
  answerTitle: string;
  stepsTitle: string;
  relatedTitle: string;
  stillNeedHelp: string;
  createSupportRequest: string;
  noResults: string;
  principle: string;
  suggested: Record<string, { title: string; summary: string; steps: string[] }>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    replacesHuman: string;
    replacesHumanAnswer: string;
    canCreateRequest: string;
    canCreateRequestAnswer: string;
  };
};

export const SUPPORT_ASSISTANT_SUGGESTED_IDS = [
  "contact-support",
  "connect-integration",
  "manage-subscription",
  "invite-team-members",
  "install-business-pack",
  "upgrade-plan",
] as const;

export const SUPPORT_ASSISTANT_CORPUS_IDS = [
  ...SUPPORT_ASSISTANT_SUGGESTED_IDS,
  "what-is-aipify",
  "what-are-business-packs",
  "view-invoices",
  "role-management",
  "feature-access",
] as const;
