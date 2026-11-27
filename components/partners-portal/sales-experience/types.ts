/** Icon keys for guidance steps. Mapped in the presentation layer, never to a tenant brand. */
export type GuidanceIconKey =
  | "search"
  | "message"
  | "listen"
  | "present"
  | "link"
  | "follow"
  | "product"
  | "need"
  | "commission"
  | "learn";

export type GuidanceAction = {
  href: string;
  label: string;
};

export type GuidanceStepModel = {
  id: string;
  icon: GuidanceIconKey;
  indexLabel: string;
  title: string;
  summary: string;
  why: string;
  say: string;
  example: string;
  action?: GuidanceAction;
};

export type SalesHeroModel = {
  title: string;
  support: string;
  notice?: string;
  actions?: GuidanceAction[];
};

export type SuggestionModel = {
  id: string;
  title: string;
  body: string;
  action?: GuidanceAction;
};

export type HelpCategoryModel = {
  id: string;
  title: string;
  body: string;
  /** Opens an existing page. Omitted when the category is information only. */
  action?: GuidanceAction;
  /** Approved published wording. Omitted when nothing is approved for this category. */
  approvedText?: string | null;
};

export type LearningStageModel = {
  id: string;
  title: string;
  body: string;
  status: string;
  action?: GuidanceAction;
};

export type CommissionStepModel = {
  id: string;
  label: string;
  body: string;
};

export type ExplainerCardModel = {
  id: string;
  title: string;
  body: string;
};

export type EmptyStateModel = {
  title: string;
  body: string;
  action?: GuidanceAction;
};
