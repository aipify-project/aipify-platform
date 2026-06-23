import type { IntegrationStatusCardPayload, PlatformSnapshotCardPayload } from "@/lib/companion-platform-knowledge/types";
import type { CompanionCapabilityId, CompanionQuickActionId } from "./constants";

export type CompanionChatMessageRole = "user" | "aipify";

export type CompanionChatCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export type CompanionAnswerSource = {
  id: string;
  label: string;
  kind:
    | "platform_corpus"
    | "route_registry"
    | "knowledge_center"
    | "customer_context"
    | "org_knowledge"
    | "verified_integration";
  meta?: string;
};

export type CompanionAnswerFeedbackState = "helpful" | "not_helpful" | "org_confirm" | null;

export type CompanionChatAttachmentSummary = {
  attachment_id: string;
  filename: string;
  mime_type: string;
  category: "image" | "pdf" | "document" | "text" | "other";
  byte_size: number;
  preview_url?: string;
};

export type CompanionChatMessage = {
  id: string;
  role: CompanionChatMessageRole;
  content: string;
  attachments?: CompanionChatAttachmentSummary[];
  activeArtifactId?: string | null;
  directAnswer?: string;
  explanation?: string;
  integrationStatusCard?: IntegrationStatusCardPayload;
  platformSnapshotCard?: PlatformSnapshotCardPayload;
  steps?: string[];
  ctas?: CompanionChatCta[];
  sources?: CompanionAnswerSource[];
  question?: string;
  sourceId?: string;
  confidence?: "high" | "moderate" | "low";
  showSupportEscalation?: boolean;
  feedback?: CompanionAnswerFeedbackState;
  negativeReason?: string;
  orgConfirmEligible?: boolean;
  orgConfirmBlockedReason?: string;
  liveIntegrationToolUsed?: boolean;
  requestedLiveIntegration?: boolean;
  timestamp: number;
};

export type CompanionConversationPreview = {
  id: string;
  title: string;
  preview: string;
  pinned: boolean;
  updatedAt: number;
  locale?: string;
  messages?: CompanionChatMessage[];
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
  companionAvailable: string;
  ariaCompanionAvailable: string;
  sessionConversationUnavailable: string;
  feedbackHelpful: string;
  feedbackNotHelpful: string;
  feedbackOrgConfirm: string;
  feedbackThanks: string;
  feedbackReasonTitle: string;
  feedbackReasonWrongInfo: string;
  feedbackReasonOutdated: string;
  feedbackReasonMisunderstood: string;
  feedbackReasonWrongLink: string;
  feedbackReasonTooVague: string;
  feedbackReasonOther: string;
  feedbackSubmitReason: string;
  feedbackOrgConfirmThanks: string;
  feedbackOrgConfirmBlocked: string;
  feedbackOrgConfirmBlockedHint: string;
  sourcesTitle: string;
  sourcesShow: string;
  sourcesHide: string;
  sourcePlatformCorpus: string;
  sourceRouteRegistry: string;
  sourceKnowledgeCenter: string;
  sourceCustomerContext: string;
  sourceOrgKnowledge: string;
  sourceVerifiedIntegration: string;
  recentDelete: string;
  recentActive: string;
  supportEscalationHint: string;
  scrollToLatest: string;
  scrollToLatestAria: string;
  ariaUserMessage: string;
  ariaUserMessageIdentity: string;
  attachments: {
    addAttachment: string;
    stagedTitle: string;
    activeArtifactLabel: string;
    activeBadge: string;
    remove: string;
    removeAttachment: string;
    statusUploading: string;
    dropHint: string;
    previewAlt: string;
    errors: {
      filenameMissing: string;
      emptyFile: string;
      fileTooLarge: string;
      typeNotAllowed: string;
      tooManyFiles: string;
      uploadFailed: string;
      removeFailed: string;
    };
    context: {
      resolvedActive: string;
      unresolvedReference: string;
      noBinaryNote: string;
    };
    externalHandoff: {
      adapterMissing: string;
      partial: string;
      consentRequired: string;
      permissionDenied: string;
      ready: string;
    };
    canvaHandoff: {
      title: string;
      subtitle: string;
      fileLabel: string;
      typeLabel: string;
      recipientLabel: string;
      recipient: string;
      accessLabel: string;
      accessScope: string;
      actionLabel: string;
      expectedUpload: string;
      expectedImport: string;
      expectedUnsupported: string;
      connectRequired: string;
      connectCanva: string;
      approveSend: string;
      cancel: string;
      sendToCanva: string;
      loadingPreview: string;
      successOpen: string;
      errors: {
        previewFailed: string;
        connectFailed: string;
        notConnected: string;
        unsupportedType: string;
        handoffFailed: string;
      };
    };
  };
  externalApplications: {
    useInApplication: string;
    chooseApplication: string;
    noApplicationsAvailable: string;
    handoff: {
      adapterMissing: string;
      partial: string;
      consentRequired: string;
      permissionDenied: string;
      ready: string;
      unsupported: string;
    };
    providers: Record<string, string>;
  };
};
