import type { Translator } from "@/lib/i18n/translate";
import type { ApprovalPresentationLabels } from "./presentation";

export type ApprovalsCenterUiLabels = {
  title: string;
  subtitle: string;
  loading: string;
  empty: string;
  emptyHistory: string;
  emptyFiltered: string;
  resetFilters: string;
  pulseLabel: string;
  openActionCenter: string;
  approve: string;
  reject: string;
  executing: string;
  emergencyStop: string;
  emergencyActive: string;
  emergencyStopConfirm: string;
  emergencyStopReasonPrompt: string;
  emergencyStopHelp: string;
  trustSection: string;
  trustLoadError: string;
  retry: string;
  returnToKompis: string;
  internalReason: string;
  reasonHelp: string;
  reasonPlaceholder: string;
  focusedMissing: string;
  couldNotOpen: string;
  couldNotOpenBody: string;
  backToApprovals: string;
  incompleteScopeTitle: string;
  incompleteScopeBody: string;
  pendingBadge: string;
  searchPlaceholder: string;
  filterStatus: string;
  filterRisk: string;
  filterAll: string;
  listHeading: string;
  detailHeading: string;
  previewTitle: string;
  previewNewDraft: string;
  decisionActionsLabel: string;
  consequencesTitle: string;
  afterApproveLabel: string;
  afterRejectLabel: string;
  reversibilityLabel: string;
  expiresSoon: string;
  createdAtLabel: string;
  expiresAtLabel: string;
  validForLabel: string;
  whatChangesTitle: string;
  whatUnchangedTitle: string;
  recommendationTitle: string;
  riskControlTitle: string;
  decisionTitle: string;
  technicalDetails: string;
  reviewCta: string;
  typeApproval: string;
  pathLabel: string;
  localeLabel: string;
  approverFieldLabel: string;
  companion: {
    section: string;
    empty: string;
    loadError: string;
    openCenter: string;
    reason: string;
    expires: string;
    category: string;
    statusLabels: Record<string, string>;
  };
  presentation: ApprovalPresentationLabels;
  technicalLabels: Record<string, string>;
};

function tOr(t: Translator, key: string, fallback: string): string {
  const value = t(key);
  if (!value || value === key) return fallback;
  return value;
}

export function buildApprovalsCenterLabels(
  t: Translator,
  options: {
    pulseLabel: string;
    companion: ApprovalsCenterUiLabels["companion"];
  },
): ApprovalsCenterUiLabels {
  const statusLabels: Record<string, string> = {
    pending: t("customerApp.approvals.statusLabels.pending"),
    awaiting_approval: tOr(
      t,
      "customerApp.approvals.statusLabels.awaiting_approval",
      t("customerApp.approvals.statusLabels.pending"),
    ),
    approved: t("customerApp.approvals.statusLabels.approved"),
    rejected: t("customerApp.approvals.statusLabels.rejected"),
    completed: t("customerApp.approvals.statusLabels.completed"),
    expired: tOr(t, "customerApp.approvals.statusLabels.expired", "Expired"),
    cancelled: tOr(t, "customerApp.approvals.statusLabels.cancelled", "Cancelled"),
    canceled: tOr(t, "customerApp.approvals.statusLabels.canceled", "Cancelled"),
    consumed: tOr(t, "customerApp.approvals.statusLabels.consumed", "Used"),
    failed: tOr(t, "customerApp.approvals.statusLabels.failed", "Failed"),
    executing: tOr(t, "customerApp.approvals.statusLabels.executing", "Executing"),
    verifying: tOr(t, "customerApp.approvals.statusLabels.verifying", "Verifying"),
    blocked: tOr(t, "customerApp.approvals.statusLabels.blocked", "Blocked"),
    incomplete_scope: tOr(
      t,
      "customerApp.approvals.statusLabels.incomplete_scope",
      "Incomplete information",
    ),
  };

  const riskLevels: Record<string, string> = {
    "0": t("customerApp.approvals.riskLevels.information"),
    "1": t("customerApp.approvals.riskLevels.low"),
    "2": t("customerApp.approvals.riskLevels.medium"),
    "3": t("customerApp.approvals.riskLevels.high"),
    "4": t("customerApp.approvals.riskLevels.critical"),
    information: t("customerApp.approvals.riskLevels.information"),
    low: t("customerApp.approvals.riskLevels.low"),
    medium: t("customerApp.approvals.riskLevels.medium"),
    high: t("customerApp.approvals.riskLevels.high"),
    critical: t("customerApp.approvals.riskLevels.critical"),
  };

  const riskDescriptions: Record<string, string> = {
    "0": tOr(
      t,
      "customerApp.approvals.riskDescriptions.information",
      "No operational change is required.",
    ),
    "1": tOr(
      t,
      "customerApp.approvals.riskDescriptions.low",
      "The action is limited and can normally be reversed.",
    ),
    "2": tOr(
      t,
      "customerApp.approvals.riskDescriptions.medium",
      "The action affects business data or workflows and needs review.",
    ),
    "3": tOr(
      t,
      "customerApp.approvals.riskDescriptions.high",
      "The action may publish content, change access, or affect external systems.",
    ),
    "4": tOr(
      t,
      "customerApp.approvals.riskDescriptions.critical",
      "The action may have serious or irreversible consequences.",
    ),
  };

  const roleLabels: Record<string, string> = {
    owner: tOr(t, "customerApp.approvals.roleLabels.owner", "Owner"),
    admin: tOr(t, "customerApp.approvals.roleLabels.admin", "Administrator"),
    staff: tOr(t, "customerApp.approvals.roleLabels.staff", "Staff"),
    support: tOr(t, "customerApp.approvals.roleLabels.support", "Support"),
    approver: tOr(t, "customerApp.approvals.roleLabels.approver", "Approver"),
    read_only: tOr(t, "customerApp.approvals.roleLabels.read_only", "Read only"),
    platform_admin: tOr(
      t,
      "customerApp.approvals.roleLabels.platform_admin",
      "Platform administrator",
    ),
    super_admin: tOr(t, "customerApp.approvals.roleLabels.super_admin", "Super administrator"),
  };

  const sourceLabels: Record<string, string> = {
    kompis: tOr(t, "customerApp.approvals.websiteKompisSource", "Website Kompis"),
    website_kompis: tOr(t, "customerApp.approvals.websiteKompisSource", "Website Kompis"),
    aipify: tOr(t, "customerApp.approvals.sourceLabels.aipify", "Aipify"),
    default: tOr(t, "customerApp.approvals.sourceLabels.aipify", "Aipify"),
  };

  const localeNames: Record<string, string> = {
    no: tOr(t, "customerApp.approvals.localeNorwegian", "Norwegian"),
    en: tOr(t, "customerApp.approvals.localeEnglish", "English"),
    sv: tOr(t, "customerApp.approvals.localeSwedish", "Swedish"),
    da: tOr(t, "customerApp.approvals.localeDanish", "Danish"),
    pl: tOr(t, "customerApp.approvals.localePolish", "Polish"),
    uk: tOr(t, "customerApp.approvals.localeUkrainian", "Ukrainian"),
    es: tOr(t, "customerApp.approvals.localeSpanish", "Spanish"),
  };

  const presentation: ApprovalPresentationLabels = {
    statusLabels,
    riskLevels,
    riskDescriptions,
    roleLabels,
    sourceLabels,
    categoryLabels: {
      notification: t("customerApp.approvals.categoryLabels.notification"),
      recommendation: t("customerApp.approvals.categoryLabels.recommendation"),
      automation: t("customerApp.approvals.categoryLabels.automation"),
      integration: t("customerApp.approvals.categoryLabels.integration"),
      update: t("customerApp.approvals.categoryLabels.update"),
      action: t("customerApp.approvals.categoryLabels.action"),
    },
    kompisPublishTitle: t("customerApp.approvals.kompisPublishTitle"),
    kompisRollbackTitle: t("customerApp.approvals.kompisRollbackTitle"),
    kompisPublishDetailTitle: t("customerApp.approvals.kompisPublishDetailTitle"),
    websiteKompisSource: t("customerApp.approvals.websiteKompisSource"),
    localeNames,
    createdAtLabel: tOr(t, "customerApp.approvals.createdAtLabel", "Created"),
    expiresAtLabel: tOr(t, "customerApp.approvals.expiresLabel", "Expires"),
    validForLabel: tOr(t, "customerApp.approvals.validForLabel", "Valid for"),
    expiresSoon: tOr(t, "customerApp.approvals.expiresSoon", "Expires soon"),
    whatChangesTitle: tOr(t, "customerApp.approvals.whatChangesTitle", "What changes"),
    whatUnchangedTitle: tOr(t, "customerApp.approvals.whatUnchangedTitle", "What stays the same"),
    recommendationTitle: tOr(
      t,
      "customerApp.approvals.recommendationTitle",
      "Why Aipify recommends this",
    ),
    riskControlTitle: tOr(t, "customerApp.approvals.riskControlTitle", "Risk and control"),
    decisionTitle: tOr(t, "customerApp.approvals.decisionTitle", "Your decision"),
    technicalDetails: tOr(t, "customerApp.approvals.technicalDetails", "Technical details"),
    reviewCta: tOr(t, "customerApp.approvals.reviewCta", "Review"),
    pendingCount: (count: number) =>
      tOr(t, "customerApp.approvals.pendingCount", "{count} waiting").replace(
        "{count}",
        String(count),
      ),
    summaryWebsitePublish: tOr(
      t,
      "customerApp.approvals.summaryWebsitePublish",
      "Kompis has prepared an update. The change applies only to {path}. The homepage and other pages are not affected.",
    ),
    recommendationWebsitePublish: tOr(
      t,
      "customerApp.approvals.recommendationWebsitePublish",
      "The change is prepared as a draft and previewed before publishing. Scope is limited to one page and can later be restored from version history.",
    ),
    reversibilityWebsitePublish: tOr(
      t,
      "customerApp.approvals.reversibilityWebsitePublish",
      "Can be restored later from website version history.",
    ),
    afterApproveWebsitePublish: tOr(
      t,
      "customerApp.approvals.afterApproveWebsitePublish",
      "Aipify publishes the approved draft for the selected page only.",
    ),
    afterRejectWebsitePublish: tOr(
      t,
      "customerApp.approvals.afterRejectWebsitePublish",
      "Nothing is published. The draft remains available for review in Kompis.",
    ),
    whatChangesWebsitePublish: [
      tOr(t, "customerApp.approvals.whatChanges", "Only the approved draft for the selected path is published."),
    ],
    whatUnchangedWebsitePublish: [
      tOr(t, "customerApp.approvals.whatUnchanged", "Other pages and content remain unchanged."),
      tOr(t, "customerApp.approvals.homepageUnchanged", "The homepage is not changed."),
    ],
    fallbackTitle: tOr(t, "customerApp.approvals.fallbackTitle", "Action awaiting approval"),
    typeApproval: tOr(t, "customerApp.approvals.typeApproval", "Approval"),
  };

  return {
    title: t("customerApp.approvals.title"),
    subtitle: t("customerApp.approvals.subtitle"),
    loading: t("customerApp.approvals.loading"),
    empty: tOr(
      t,
      "customerApp.approvals.emptyPending",
      t("customerApp.approvals.empty"),
    ),
    emptyHistory: tOr(t, "customerApp.approvals.emptyHistory", "No earlier approvals"),
    emptyFiltered: tOr(
      t,
      "customerApp.approvals.emptyFiltered",
      "No approvals match the filters",
    ),
    resetFilters: tOr(t, "customerApp.approvals.resetFilters", "Reset filters"),
    pulseLabel: options.pulseLabel,
    openActionCenter: t("customerApp.approvals.openActionCenter"),
    approve: t("customerApp.approvals.approve"),
    reject: t("customerApp.approvals.reject"),
    executing: t("customerApp.approvals.executing"),
    emergencyStop: t("customerApp.approvals.emergencyStop"),
    emergencyActive: t("customerApp.approvals.emergencyActive"),
    emergencyStopConfirm: t("customerApp.approvals.emergencyStopConfirm"),
    emergencyStopReasonPrompt: t("customerApp.approvals.emergencyStopReasonPrompt"),
    emergencyStopHelp: tOr(
      t,
      "customerApp.approvals.emergencyStopHelp",
      "Stops all pending Aipify actions for the organization. This is not the same as rejecting one approval.",
    ),
    trustSection: tOr(t, "customerApp.approvals.trustSection", "Approvals"),
    trustLoadError: t("customerApp.approvals.trustLoadError"),
    retry: t("customerApp.approvals.retry"),
    returnToKompis: t("customerApp.approvals.returnToKompis"),
    internalReason: t("customerApp.approvals.internalReason"),
    reasonHelp: tOr(
      t,
      "customerApp.approvals.reasonHelp",
      "Write briefly why the action is approved or rejected. The reason is stored in the audit trail.",
    ),
    reasonPlaceholder: t("customerApp.approvals.reasonPlaceholder"),
    focusedMissing: t("customerApp.approvals.focusedMissing"),
    couldNotOpen: t("customerApp.approvals.couldNotOpen"),
    couldNotOpenBody: t("customerApp.approvals.couldNotOpenBody"),
    backToApprovals: t("customerApp.approvals.backToApprovals"),
    incompleteScopeTitle: t("customerApp.approvals.incompleteScopeTitle"),
    incompleteScopeBody: t("customerApp.approvals.incompleteScopeBody"),
    pendingBadge: tOr(t, "customerApp.approvals.pendingBadge", "Waiting"),
    searchPlaceholder: tOr(t, "customerApp.approvals.searchPlaceholder", "Search approvals"),
    filterStatus: tOr(t, "customerApp.approvals.filterStatus", "Status"),
    filterRisk: tOr(t, "customerApp.approvals.filterRisk", "Risk"),
    filterAll: tOr(t, "customerApp.approvals.filterAll", "All"),
    listHeading: tOr(t, "customerApp.approvals.listHeading", "Approvals"),
    detailHeading: tOr(t, "customerApp.approvals.detailHeading", "Review approval"),
    previewTitle: tOr(t, "customerApp.approvals.previewTitle", "Preview"),
    previewNewDraft: tOr(
      t,
      "customerApp.approvals.previewNewDraft",
      "This is a prepared draft for the selected page.",
    ),
    decisionActionsLabel: tOr(t, "customerApp.approvals.decisionActionsLabel", "Decision"),
    consequencesTitle: tOr(t, "customerApp.approvals.consequencesTitle", "What happens next"),
    afterApproveLabel: tOr(t, "customerApp.approvals.afterApproveLabel", "If you approve"),
    afterRejectLabel: tOr(t, "customerApp.approvals.afterRejectLabel", "If you reject"),
    reversibilityLabel: tOr(t, "customerApp.approvals.reversibilityLabel", "Reversibility"),
    expiresSoon: presentation.expiresSoon,
    createdAtLabel: presentation.createdAtLabel,
    expiresAtLabel: presentation.expiresAtLabel,
    validForLabel: presentation.validForLabel,
    whatChangesTitle: presentation.whatChangesTitle,
    whatUnchangedTitle: presentation.whatUnchangedTitle,
    recommendationTitle: presentation.recommendationTitle,
    riskControlTitle: presentation.riskControlTitle,
    decisionTitle: presentation.decisionTitle,
    technicalDetails: presentation.technicalDetails,
    reviewCta: presentation.reviewCta,
    typeApproval: presentation.typeApproval,
    pathLabel: t("customerApp.approvals.pathLabel"),
    localeLabel: t("customerApp.approvals.localeLabel"),
    approverFieldLabel: t("customerApp.approvals.fields.approver"),
    companion: options.companion,
    presentation,
    technicalLabels: {
      approvalId: tOr(t, "customerApp.approvals.technical.approvalId", "Approval ID"),
      candidate: t("customerApp.approvals.candidateLabel"),
      currentVersion: t("customerApp.approvals.currentVersionLabel"),
      expectedVersion: t("customerApp.approvals.expectedVersionLabel"),
      checksum: tOr(t, "customerApp.approvals.technical.checksum", "Action checksum"),
      audit: t("customerApp.approvals.auditReferenceLabel"),
      run: tOr(t, "customerApp.approvals.technical.run", "Run"),
      step: tOr(t, "customerApp.approvals.technical.step", "Step"),
      tool: tOr(t, "customerApp.approvals.technical.tool", "Tool"),
    },
  };
}
