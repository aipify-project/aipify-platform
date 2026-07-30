import type { Translator } from "@/lib/i18n/translate";
import type { KompisOperatorSeverityTone } from "@/lib/kompis-operator/severity";

export type WebsiteCmsLabels = {
  title: string;
  subtitle: string;
  overviewTab: string;
  pagesTab: string;
  draftsTab: string;
  candidatesTab: string;
  previewsTab: string;
  publishesTab: string;
  historyTab: string;
  rollbackTab: string;
  websiteStatus: string;
  statusProvisioned: string;
  statusReady: string;
  statusAttention: string;
  statusArchived: string;
  currentVersion: string;
  noWebsiteTitle: string;
  noWebsiteBody: string;
  ensureWebsite: string;
  pagesEmpty: string;
  pagePath: string;
  pageLocales: string;
  pageLatestRevision: string;
  buildCandidate: string;
  buildCandidateHelp: string;
  selectDrafts: string;
  candidateBuilt: string;
  candidateVersion: string;
  createPreview: string;
  previewCreated: string;
  previewExpires: string;
  previewNoindex: string;
  markPreviewVerified: string;
  previewVerified: string;
  previewRequired: string;
  publishCandidate: string;
  publishConfirmCheckbox: string;
  publishInternalReasonPlaceholder: string;
  publishSuccess: string;
  publishAttention: string;
  publishFailed: string;
  rollbackToVersion: string;
  rollbackConfirmCheckbox: string;
  rollbackSuccess: string;
  rollbackAttention: string;
  reconcile: string;
  reconcileSuccess: string;
  runtimeVerified: string;
  runtimeUnverified: string;
  versionNumber: string;
  versionStatusCandidate: string;
  versionStatusPublished: string;
  versionStatusSuperseded: string;
  versionStatusFailed: string;
  operationPublish: string;
  operationRollback: string;
  operationReconcile: string;
  operationStatusPendingVerification: string;
  operationStatusActive: string;
  operationStatusAttention: string;
  operationStatusFailed: string;
  noVersionsYet: string;
  noPublishHistory: string;
  authoritativePageModelActive: string;
  publishUnavailableNoWebsite: string;
  publishUnavailableNoDelivery: string;
  rollbackUnavailableNoHistory: string;
  neverDeletesHistory: string;
  approvalRoleRequired: string;
  expectedVersionConflict: string;
  openPreview: string;
  previewPageTitle: string;
  previewBanner: string;
  previewExpiredTitle: string;
  previewExpiredBody: string;
  previewNotFoundTitle: string;
  previewNotFoundBody: string;
  previewBackToWorkspace: string;
};

export function buildWebsiteCmsLabels(t: Translator): WebsiteCmsLabels {
  const p = "customerApp.websiteCms";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    overviewTab: t(`${p}.overviewTab`),
    pagesTab: t(`${p}.pagesTab`),
    draftsTab: t(`${p}.draftsTab`),
    candidatesTab: t(`${p}.candidatesTab`),
    previewsTab: t(`${p}.previewsTab`),
    publishesTab: t(`${p}.publishesTab`),
    historyTab: t(`${p}.historyTab`),
    rollbackTab: t(`${p}.rollbackTab`),
    websiteStatus: t(`${p}.websiteStatus`),
    statusProvisioned: t(`${p}.statusProvisioned`),
    statusReady: t(`${p}.statusReady`),
    statusAttention: t(`${p}.statusAttention`),
    statusArchived: t(`${p}.statusArchived`),
    currentVersion: t(`${p}.currentVersion`),
    noWebsiteTitle: t(`${p}.noWebsiteTitle`),
    noWebsiteBody: t(`${p}.noWebsiteBody`),
    ensureWebsite: t(`${p}.ensureWebsite`),
    pagesEmpty: t(`${p}.pagesEmpty`),
    pagePath: t(`${p}.pagePath`),
    pageLocales: t(`${p}.pageLocales`),
    pageLatestRevision: t(`${p}.pageLatestRevision`),
    buildCandidate: t(`${p}.buildCandidate`),
    buildCandidateHelp: t(`${p}.buildCandidateHelp`),
    selectDrafts: t(`${p}.selectDrafts`),
    candidateBuilt: t(`${p}.candidateBuilt`),
    candidateVersion: t(`${p}.candidateVersion`),
    createPreview: t(`${p}.createPreview`),
    previewCreated: t(`${p}.previewCreated`),
    previewExpires: t(`${p}.previewExpires`),
    previewNoindex: t(`${p}.previewNoindex`),
    markPreviewVerified: t(`${p}.markPreviewVerified`),
    previewVerified: t(`${p}.previewVerified`),
    previewRequired: t(`${p}.previewRequired`),
    publishCandidate: t(`${p}.publishCandidate`),
    publishConfirmCheckbox: t(`${p}.publishConfirmCheckbox`),
    publishInternalReasonPlaceholder: t(`${p}.publishInternalReasonPlaceholder`),
    publishSuccess: t(`${p}.publishSuccess`),
    publishAttention: t(`${p}.publishAttention`),
    publishFailed: t(`${p}.publishFailed`),
    rollbackToVersion: t(`${p}.rollbackToVersion`),
    rollbackConfirmCheckbox: t(`${p}.rollbackConfirmCheckbox`),
    rollbackSuccess: t(`${p}.rollbackSuccess`),
    rollbackAttention: t(`${p}.rollbackAttention`),
    reconcile: t(`${p}.reconcile`),
    reconcileSuccess: t(`${p}.reconcileSuccess`),
    runtimeVerified: t(`${p}.runtimeVerified`),
    runtimeUnverified: t(`${p}.runtimeUnverified`),
    versionNumber: t(`${p}.versionNumber`),
    versionStatusCandidate: t(`${p}.versionStatusCandidate`),
    versionStatusPublished: t(`${p}.versionStatusPublished`),
    versionStatusSuperseded: t(`${p}.versionStatusSuperseded`),
    versionStatusFailed: t(`${p}.versionStatusFailed`),
    operationPublish: t(`${p}.operationPublish`),
    operationRollback: t(`${p}.operationRollback`),
    operationReconcile: t(`${p}.operationReconcile`),
    operationStatusPendingVerification: t(`${p}.operationStatusPendingVerification`),
    operationStatusActive: t(`${p}.operationStatusActive`),
    operationStatusAttention: t(`${p}.operationStatusAttention`),
    operationStatusFailed: t(`${p}.operationStatusFailed`),
    noVersionsYet: t(`${p}.noVersionsYet`),
    noPublishHistory: t(`${p}.noPublishHistory`),
    authoritativePageModelActive: t(`${p}.authoritativePageModelActive`),
    publishUnavailableNoWebsite: t(`${p}.publishUnavailableNoWebsite`),
    publishUnavailableNoDelivery: t(`${p}.publishUnavailableNoDelivery`),
    rollbackUnavailableNoHistory: t(`${p}.rollbackUnavailableNoHistory`),
    neverDeletesHistory: t(`${p}.neverDeletesHistory`),
    approvalRoleRequired: t(`${p}.approvalRoleRequired`),
    expectedVersionConflict: t(`${p}.expectedVersionConflict`),
    openPreview: t(`${p}.openPreview`),
    previewPageTitle: t(`${p}.previewPageTitle`),
    previewBanner: t(`${p}.previewBanner`),
    previewExpiredTitle: t(`${p}.previewExpiredTitle`),
    previewExpiredBody: t(`${p}.previewExpiredBody`),
    previewNotFoundTitle: t(`${p}.previewNotFoundTitle`),
    previewNotFoundBody: t(`${p}.previewNotFoundBody`),
    previewBackToWorkspace: t(`${p}.previewBackToWorkspace`),
  };
}

export function websiteCmsStatusLabelKey(status: string): keyof WebsiteCmsLabels {
  switch (status) {
    case "ready":
      return "statusReady";
    case "attention":
      return "statusAttention";
    case "archived":
      return "statusArchived";
    default:
      return "statusProvisioned";
  }
}

export function websiteCmsVersionStatusLabelKey(status: string): keyof WebsiteCmsLabels {
  switch (status) {
    case "published":
      return "versionStatusPublished";
    case "superseded":
      return "versionStatusSuperseded";
    case "failed":
      return "versionStatusFailed";
    default:
      return "versionStatusCandidate";
  }
}

export function websiteCmsOperationStatusLabelKey(status: string): keyof WebsiteCmsLabels {
  switch (status) {
    case "active":
      return "operationStatusActive";
    case "attention":
      return "operationStatusAttention";
    case "failed":
      return "operationStatusFailed";
    default:
      return "operationStatusPendingVerification";
  }
}

export function websiteCmsVersionStatusTone(status: string): KompisOperatorSeverityTone {
  switch (status) {
    case "published":
      return "success";
    case "superseded":
      return "muted";
    case "failed":
      return "danger";
    default:
      return "info";
  }
}

export function websiteCmsOperationStatusTone(status: string): KompisOperatorSeverityTone {
  switch (status) {
    case "active":
      return "success";
    case "attention":
      return "warning";
    case "failed":
      return "danger";
    default:
      return "warning";
  }
}

export function websiteCmsWebsiteStatusTone(status: string): KompisOperatorSeverityTone {
  switch (status) {
    case "ready":
      return "success";
    case "attention":
      return "warning";
    case "archived":
      return "muted";
    default:
      return "info";
  }
}
