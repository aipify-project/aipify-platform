import type { CompanionCapabilityId, CompanionQuickActionId } from "./constants";

export type CompanionChatMessageRole = "user" | "aipify";

export type CompanionChatCta = {
  label: string;
  href: string;
};

export type CompanionChatMessage = {
  id: string;
  role: CompanionChatMessageRole;
  content: string;
  steps?: string[];
  ctas?: CompanionChatCta[];
  timestamp: number;
};

export type CompanionConversationPreview = {
  id: string;
  title: string;
  preview: string;
  pinned: boolean;
  updatedAt: number;
};

export type CompanionExperienceLabels = {
  title: string;
  subtitle: string;
  openCompanion: string;
  askAipify: string;
  askAipifyButton: string;
  newConversation: string;
  viewSuggestions: string;
  secondarySectionsToggle: string;
  secondarySectionsHide: string;
  inputPlaceholder: string;
  activePage: string;
  activeOrganization: string;
  verifiedContext: string;
  contextPending: string;
  orgNameFallback: string;
  roleLabel: string;
  roleFallback: string;
  languageLabel: string;
  modeLabel: string;
  modeAssisted: string;
  capabilitiesTitle: string;
  recentConversationsTitle: string;
  suggestedQuestionsTitle: string;
  pinnedLabel: string;
  emptyWelcomeTitle: string;
  emptyWelcomeBody: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  noResults: string;
  stillNeedHelp: string;
  createSupportRequest: string;
  closeDrawer: string;
  fullPageLink: string;
  quickActions: Record<CompanionQuickActionId, { title: string; description: string }>;
  capabilities: Record<CompanionCapabilityId, string>;
  contextPages: Record<string, string>;
  contextSuggestions: Record<string, string>;
  ariaCompanionPanel: string;
  ariaOpenCompanion: string;
  ariaFloatingButton: string;
};
