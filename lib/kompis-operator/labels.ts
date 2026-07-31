import type { Translator } from "@/lib/i18n/translate";

export type KompisOperatorLabels = {
  title: string;
  subtitle: string;
  whatCanIHelpWith: string;
  sendTask: string;
  describeTask: string;
  understanding: string;
  planning: string;
  checkingAccess: string;
  searchingAuthorizedData: string;
  foundInformation: string;
  sources: string;
  summary: string;
  plan: string;
  affectedAreas: string;
  riskClass: string;
  risk0: string;
  risk1: string;
  risk2: string;
  risk3: string;
  requiresApproval: string;
  awaitingApproval: string;
  awaitingCoreApproval: string;
  coreApprovalRequired: string;
  coreApproved: string;
  coreRejected: string;
  coreExpired: string;
  verifyingWebsite: string;
  rolledBack: string;
  openApprovalCenter: string;
  approvalRequiredTitle: string;
  approvalRequiredBody: string;
  reviewAndApprove: string;
  approvalCreationFailedTitle: string;
  approvalCreationFailedBody: string;
  returnToKompis: string;
  toolNotAllowed: string;
  approveAndExecute: string;
  rejectPlan: string;
  newPlan: string;
  executing: string;
  verifying: string;
  completed: string;
  partial: string;
  attention: string;
  blocked: string;
  failed: string;
  retry: string;
  history: string;
  activeOrganization: string;
  appLicense: string;
  websiteKompis: string;
  domainInstallation: string;
  lastActivity: string;
  internalReason: string;
  authoritativelyVerified: string;
  nothingChanged: string;
  whatChanged: string;
  whatDidNotChange: string;
  auditReference: string;
  criticalBlocked: string;
  readyTitle: string;
  readyBody: string;
  unavailableTitle: string;
  unavailableBody: string;
  suspendedTitle: string;
  errorTitle: string;
  confirmCheckbox: string;
  createsDraft: string;
  sendsMessage: string;
  providerUnavailable: string;
  usingSafeFallback: string;
  liveAiActive: string;
  liveAiNotEnabled: string;
  liveAiTemporarilyLimited: string;
  continuesWithSafeFallback: string;
  noMatches: string;
  noAuthorizedSources: string;
  supportCases: string;
  notifications: string;
  organizationMembers: string;
  activity: string;
  businessProfile: string;
  contentDraft: string;
  knowledgeDraft: string;
  createSupportCase: string;
  replySupportCase: string;
  markAsRead: string;
  createDraft: string;
  updateDraft: string;
  rateLimited: string;
  suggestionKompis: string;
  suggestionLicense: string;
  suggestionDraftSupport: string;
  suggestionDraftProfile: string;
  suggestionKnowledge: string;
  suggestionMembers: string;
  suggestionActivity: string;
  reasonPlaceholder: string;
  emptyHistory: string;
  statusLabel: string;
  websiteTab: string;
  tasksTab: string;
  websiteOverview: string;
  websitePages: string;
  websiteSeo: string;
  websiteLocales: string;
  websiteDrafts: string;
  websitePublishes: string;
  primaryDomain: string;
  installation: string;
  currentVersion: string;
  lastPublish: string;
  runtimeStatus: string;
  draftCount: string;
  publishUnavailable: string;
  draftsOnlyReady: string;
  suggestionWebsite: string;
  suggestionSeo: string;
  approveAndCreateDraft: string;
  noPublishMechanism: string;
  statuses: Record<string, string>;
  contentLocales: Record<string, string>;
  tools: Record<string, string>;
  plans: Record<string, string>;
  results: Record<string, string>;
  seoFindings: Record<string, string>;
  workspace: Record<string, string>;
};

function readNested(t: Translator, prefix: string, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    out[key] = t(`${prefix}.${key}`);
  }
  return out;
}

export function buildKompisOperatorLabels(t: Translator): KompisOperatorLabels {
  const p = "customerApp.kompisOperator";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    whatCanIHelpWith: t(`${p}.whatCanIHelpWith`),
    sendTask: t(`${p}.sendTask`),
    describeTask: t(`${p}.describeTask`),
    understanding: t(`${p}.understanding`),
    planning: t(`${p}.planning`),
    checkingAccess: t(`${p}.checkingAccess`),
    searchingAuthorizedData: t(`${p}.searchingAuthorizedData`),
    foundInformation: t(`${p}.foundInformation`),
    sources: t(`${p}.sources`),
    summary: t(`${p}.summary`),
    plan: t(`${p}.plan`),
    affectedAreas: t(`${p}.affectedAreas`),
    riskClass: t(`${p}.riskClass`),
    risk0: t(`${p}.risk0`),
    risk1: t(`${p}.risk1`),
    risk2: t(`${p}.risk2`),
    risk3: t(`${p}.risk3`),
    requiresApproval: t(`${p}.requiresApproval`),
    awaitingApproval: t(`${p}.awaitingApproval`),
    awaitingCoreApproval: t(`${p}.awaitingCoreApproval`),
    coreApprovalRequired: t(`${p}.coreApprovalRequired`),
    coreApproved: t(`${p}.coreApproved`),
    coreRejected: t(`${p}.coreRejected`),
    coreExpired: t(`${p}.coreExpired`),
    verifyingWebsite: t(`${p}.verifyingWebsite`),
    rolledBack: t(`${p}.rolledBack`),
    openApprovalCenter: t(`${p}.openApprovalCenter`),
    approvalRequiredTitle: t(`${p}.approvalRequiredTitle`),
    approvalRequiredBody: t(`${p}.approvalRequiredBody`),
    reviewAndApprove: t(`${p}.reviewAndApprove`),
    approvalCreationFailedTitle: t(`${p}.approvalCreationFailedTitle`),
    approvalCreationFailedBody: t(`${p}.approvalCreationFailedBody`),
    returnToKompis: t(`${p}.returnToKompis`),
    toolNotAllowed: t(`${p}.toolNotAllowed`),
    approveAndExecute: t(`${p}.approveAndExecute`),
    rejectPlan: t(`${p}.rejectPlan`),
    newPlan: t(`${p}.newPlan`),
    executing: t(`${p}.executing`),
    verifying: t(`${p}.verifying`),
    completed: t(`${p}.completed`),
    partial: t(`${p}.partial`),
    attention: t(`${p}.attention`),
    blocked: t(`${p}.blocked`),
    failed: t(`${p}.failed`),
    retry: t(`${p}.retry`),
    history: t(`${p}.history`),
    activeOrganization: t(`${p}.activeOrganization`),
    appLicense: t(`${p}.appLicense`),
    websiteKompis: t(`${p}.websiteKompis`),
    domainInstallation: t(`${p}.domainInstallation`),
    lastActivity: t(`${p}.lastActivity`),
    internalReason: t(`${p}.internalReason`),
    authoritativelyVerified: t(`${p}.authoritativelyVerified`),
    nothingChanged: t(`${p}.nothingChanged`),
    whatChanged: t(`${p}.whatChanged`),
    whatDidNotChange: t(`${p}.whatDidNotChange`),
    auditReference: t(`${p}.auditReference`),
    criticalBlocked: t(`${p}.criticalBlocked`),
    readyTitle: t(`${p}.readyTitle`),
    readyBody: t(`${p}.readyBody`),
    unavailableTitle: t(`${p}.unavailableTitle`),
    unavailableBody: t(`${p}.unavailableBody`),
    suspendedTitle: t(`${p}.suspendedTitle`),
    errorTitle: t(`${p}.errorTitle`),
    confirmCheckbox: t(`${p}.confirmCheckbox`),
    createsDraft: t(`${p}.createsDraft`),
    sendsMessage: t(`${p}.sendsMessage`),
    providerUnavailable: t(`${p}.providerUnavailable`),
    usingSafeFallback: t(`${p}.usingSafeFallback`),
    liveAiActive: t(`${p}.liveAiActive`),
    liveAiNotEnabled: t(`${p}.liveAiNotEnabled`),
    liveAiTemporarilyLimited: t(`${p}.liveAiTemporarilyLimited`),
    continuesWithSafeFallback: t(`${p}.continuesWithSafeFallback`),
    noMatches: t(`${p}.noMatches`),
    noAuthorizedSources: t(`${p}.noAuthorizedSources`),
    supportCases: t(`${p}.supportCases`),
    notifications: t(`${p}.notifications`),
    organizationMembers: t(`${p}.organizationMembers`),
    activity: t(`${p}.activity`),
    businessProfile: t(`${p}.businessProfile`),
    contentDraft: t(`${p}.contentDraft`),
    knowledgeDraft: t(`${p}.knowledgeDraft`),
    createSupportCase: t(`${p}.createSupportCase`),
    replySupportCase: t(`${p}.replySupportCase`),
    markAsRead: t(`${p}.markAsRead`),
    createDraft: t(`${p}.createDraft`),
    updateDraft: t(`${p}.updateDraft`),
    rateLimited: t(`${p}.rateLimited`),
    suggestionKompis: t(`${p}.suggestionKompis`),
    suggestionLicense: t(`${p}.suggestionLicense`),
    suggestionDraftSupport: t(`${p}.suggestionDraftSupport`),
    suggestionDraftProfile: t(`${p}.suggestionDraftProfile`),
    suggestionKnowledge: t(`${p}.suggestionKnowledge`),
    suggestionMembers: t(`${p}.suggestionMembers`),
    suggestionActivity: t(`${p}.suggestionActivity`),
    reasonPlaceholder: t(`${p}.reasonPlaceholder`),
    emptyHistory: t(`${p}.emptyHistory`),
    statusLabel: t(`${p}.statusLabel`),
    websiteTab: t(`${p}.websiteTab`),
    tasksTab: t(`${p}.tasksTab`),
    websiteOverview: t(`${p}.websiteOverview`),
    websitePages: t(`${p}.websitePages`),
    websiteSeo: t(`${p}.websiteSeo`),
    websiteLocales: t(`${p}.websiteLocales`),
    websiteDrafts: t(`${p}.websiteDrafts`),
    websitePublishes: t(`${p}.websitePublishes`),
    primaryDomain: t(`${p}.primaryDomain`),
    installation: t(`${p}.installation`),
    currentVersion: t(`${p}.currentVersion`),
    lastPublish: t(`${p}.lastPublish`),
    runtimeStatus: t(`${p}.runtimeStatus`),
    draftCount: t(`${p}.draftCount`),
    publishUnavailable: t(`${p}.publishUnavailable`),
    draftsOnlyReady: t(`${p}.draftsOnlyReady`),
    suggestionWebsite: t(`${p}.suggestionWebsite`),
    suggestionSeo: t(`${p}.suggestionSeo`),
    approveAndCreateDraft: t(`${p}.approveAndCreateDraft`),
    noPublishMechanism: t(`${p}.noPublishMechanism`),
    statuses: readNested(t, `${p}.statuses`, [
      "active",
      "completed",
      "failed",
      "awaitingApproval",
      "ready",
      "draft",
      "published",
      "superseded",
      "candidate",
      "archived",
      "pending",
      "executing",
      "verifying",
      "cancelled",
      "expired",
      "rejected",
      "approved",
      "consumed",
      "attention",
      "blocked",
      "partial",
      "provisioned",
      "notConfigured",
      "fullyVerified",
      "awaitingAcknowledgement",
      "httpVerificationMissing",
      "verificationFailed",
      "readyForPublish",
      "publishRequiresApproval",
      "publishTemporarilyBlocked",
      "publishNotConfigured",
      "currentVersion",
      "unknown",
    ]),
    contentLocales: readNested(t, `${p}.contentLocales`, [
      "english",
      "norwegian",
      "swedish",
      "danish",
      "polish",
      "ukrainian",
      "spanish",
      "unknown",
    ]),
    tools: readNested(t, `${p}.tools`, [
      "websiteOverviewRead",
      "websiteHealthRead",
      "websitePagesRead",
      "websiteKompisStatusRead",
      "domainInstallationStatusRead",
      "knowledgeSearch",
      "supportCaseCreate",
      "websiteSeoAudit",
      "websiteContentQualityAudit",
      "websiteLocaleCoverageRead",
      "websitePublishHistoryRead",
      "websitePreviewStatusRead",
      "websitePageRead",
      "websiteNavigationRead",
      "websitePublishApprovedDraft",
      "websitePublishRollback",
      "customerProfileRead",
      "agreementStatusRead",
      "licenseStatusRead",
      "appAccessStatusRead",
      "supportCasesRead",
      "notificationsRead",
      "organizationMembersRead",
      "activitySummaryRead",
      "contentInventoryRead",
      "operatorHistoryRead",
    ]),
    plans: readNested(t, `${p}.plans`, [
      "planWebsiteOverview",
      "planKnowledgeSearch",
      "planCreateSupportCase",
    ]),
    results: readNested(t, `${p}.results`, [
      "resultTaskCompletedVerified",
      "resultTaskStoppedPartial",
      "resultTaskNeedsFollowUp",
      "resultKnowledgeSearchFailed",
      "knowledgeSearchFailed",
      "knowledgeSearchHits",
      "knowledgeSearchEmpty",
      "task_completed_verified",
      "task_stopped_partial",
      "task_needs_follow_up",
      "knowledge_search_failed",
    ]),
    seoFindings: readNested(t, `${p}.seoFindings`, [
      "runtimeAcknowledgementMissing",
      "primaryDomainMissing",
      "crawlUnavailable",
      "missingTitle",
      "missingMetaDescription",
      "missingCanonical",
      "missingAltText",
      "emptyContent",
      "rawTranslationKey",
      "forbiddenMarkup",
      "nextActionReviewDraft",
      "nextActionConfirmDelivery",
    ]),
    workspace: readNested(t, `${p}.workspace`, [
      "installationConnected",
      "technicalDetails",
      "currentVersionMarker",
      "rollbackToThisVersion",
      "rollbackNotForCurrent",
      "revisionLabel",
      "localeMismatchHint",
      "knowledgeSearchErrorTitle",
      "knowledgeSearchErrorBody",
      "errorCategory",
      "errorSource",
      "retrySafe",
      "recommendedNextAction",
      "technicalReference",
      "temporaryError",
      "permanentError",
      "actionBlockedTitle",
      "selectApprovedDraft",
      "draftLocaleMismatch",
      "runtimeMustBeChecked",
      "conflictingPublish",
      "approvalMissing",
      "stateInconsistent",
      "emptyDate",
      "invalidDate",
      "homepageDisabled",
      "homepageEnabled",
      "coreApprovalId",
      "coreApprovalScope",
      "coreApprovalActor",
      "coreApprovalDecision",
      "coreApprovalExpiry",
      "coreApprovalConsumed",
      "publishedBy",
      "versionSource",
      "verificationStatus",
    ]),
  };
}
