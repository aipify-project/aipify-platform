import { Suspense } from "react";
import PlatformSupportCenterPanel from "@/components/platform/support-center/PlatformSupportCenterPanel";
import type { SupportCenterLabels } from "@/components/platform/support-center/support-center-labels";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

const SC = "platform.supportCenter";

function pick<K extends string>(
  t: (key: string) => string,
  prefix: string,
  keys: readonly K[],
): Record<K, string> {
  const out = {} as Record<K, string>;
  for (const key of keys) {
    out[key] = t(`${SC}.${prefix}.${key}`);
  }
  return out;
}

function buildSupportCenterLabels(t: (key: string) => string): SupportCenterLabels {
  const s = (key: string) => t(`${SC}.${key}`);

  const statusKeys = [
    "new",
    "open",
    "in_progress",
    "waiting_for_customer",
    "waiting_internal",
    "resolved",
    "closed",
    "reopened",
    "archived",
  ] as const;
  const priorityKeys = ["low", "normal", "high", "critical", "urgent"] as const;
  const categoryKeys = [
    "general",
    "onboarding",
    "billing",
    "technical",
    "business_packs",
    "security",
    "feedback",
    "bug",
  ] as const;
  const channelKeys = ["app_portal", "email", "chat", "phone", "assistant", "web", "partner"] as const;
  const templateCategoryKeys = [
    "intake",
    "followup",
    "access",
    "billing",
    "product",
    "partner",
    "status",
    "resolution",
    "bug",
    "feedback",
  ] as const;
  const localeKeys = ["en", "no", "sv", "da", "pl", "uk", "es"] as const;
  const entryKindKeys = ["internal_note", "reply_draft", "reply", "event"] as const;
  const deliveryKeys = [
    "blocked_unconfigured",
    "draft",
    "queued",
    "sent",
    "failed",
  ] as const;
  const writeErrorKeys = [
    "core_not_applied",
    "feature_gate_off",
    "validation",
    "forbidden",
    "unauthorized",
    "unknown",
  ] as const;

  return {
    title: s("title"),
    subtitle: s("subtitle"),
    loading: s("loading"),
    empty: s("empty"),
    emptyTitle: s("emptyTitle"),
    emptyMineTitle: s("emptyMineTitle"),
    emptyMine: s("emptyMine"),
    emptyMineBody: s("emptyMineBody"),
    emptySearchTitle: s("emptySearchTitle"),
    emptySearch: s("emptySearch"),
    emptySearchBody: s("emptySearchBody"),
    clearFilters: s("clearFilters"),
    goToAll: s("goToAll"),
    emptyCoreBlockedTitle: s("emptyCoreBlockedTitle"),
    emptyCoreBlocked: s("emptyCoreBlocked"),
    errorTitle: s("errorTitle"),
    errorBody: s("errorBody"),
    retry: s("retry"),
    coreBlockedTitle: s("coreBlockedTitle"),
    coreBlockedBody: s("coreBlockedBody"),
    customer: s("customer"),
    category: s("category"),
    priority: s("priority"),
    assignee: s("assignee"),
    lastUpdated: s("lastUpdated"),
    subject: s("subject"),
    reference: s("reference"),
    channel: s("channel"),
    product: s("product"),
    status: s("status"),
    unassigned: s("unassigned"),
    assignedToMe: s("assignedToMe"),
    assignedToColleague: s("assignedToColleague"),
    assignToMe: s("assignToMe"),
    openTicket: s("openTicket"),
    viewCustomer: s("viewCustomer"),
    pulseLabel: t("branding.pulseLabel"),
    refresh: s("refresh"),
    filterAll: s("filterAll"),
    search: s("search"),
    searchPlaceholder: s("searchPlaceholder"),
    mineScopeNote: s("mineScopeNote"),
    dirtyLeave: s("dirtyLeave"),
    saved: s("saved"),
    tabAll: s("tabs.all"),
    tabMine: s("tabs.mine"),
    tabTemplates: s("tabs.templates"),
    tabSignature: s("tabs.signature"),
    tabChannels: s("tabs.channels"),
    tabsAria: s("tabs.aria"),
    kpiNew: s("kpi.new"),
    kpiInProgress: s("kpi.inProgress"),
    kpiWaiting: s("kpi.waiting"),
    kpiCritical: s("kpi.critical"),
    kpiResolved: s("kpi.resolved"),
    kpiUnavailable: s("kpi.unavailable"),
    kpiLoading: s("kpi.loading"),
    kpiSourceNote: s("kpi.sourceNote"),
    kpiPageNote: s("kpi.pageNote"),
    statusLabels: pick(t, "statusLabels", statusKeys),
    categoryLabels: pick(t, "categoryLabels", categoryKeys),
    priorityLabels: pick(t, "priorityLabels", priorityKeys),
    channelLabels: pick(t, "channelLabels", channelKeys),
    templates: {
      ...pick(t, "templates", [
        "title",
        "subtitle",
        "starterBadge",
        "preview",
        "insertDraft",
        "persistBlocked",
        "variables",
        "localeNote",
        "category",
        "subject",
        "body",
        "name",
        "searchPlaceholder",
        "listAria",
        "noMatches",
        "newTemplate",
        "selectHint",
        "previewHeading",
        "editHeading",
        "newHeading",
        "edit",
        "cancel",
        "save",
        "saved",
        "archive",
        "archiveConfirm",
        "archived",
        "insertNeedsTicket",
        "confirmOverwriteDraft",
        "inserted",
        "errorGeneric",
        "errorValidation",
        "statusDraft",
        "statusActive",
        "statusArchived",
        "filterStatus",
        "filterLanguage",
        "filterAll",
        "saveDraft",
        "activate",
        "restore",
        "delete",
        "draftBlocked",
        "deleteBlocked",
        "activateConfirm",
        "restoreConfirm",
        "savedActive",
        "restored",
        "versionLabel",
        "statusLabel",
        "persistReady",
        "confirmAction",
        "cancelConfirm",
      ] as const),
      categoryLabels: pick(t, "templates.categoryLabels", templateCategoryKeys),
      localeLabels: pick(t, "templates.localeLabels", localeKeys),
    },
    signature: pick(t, "signature", [
      "title",
      "subtitle",
      "displayName",
      "agentName",
      "agentTitle",
      "companyName",
      "website",
      "supportEmail",
      "phone",
      "address",
      "includeLogo",
      "active",
      "previewLight",
      "previewDark",
      "previewText",
      "persistBlocked",
      "resetDefaults",
      "resetDone",
      "resetAndSave",
      "resetAndSaveConfirm",
      "resetSaved",
      "save",
      "saveConfirm",
      "saved",
      "unsaved",
      "usingDefaults",
      "customSaved",
      "loadFailed",
      "saveFailed",
      "errorInvalidEmail",
      "errorInvalidWebsite",
      "errorNameRequired",
      "technicalDisplayNotice",
      "supportEmailStatus",
      "supportEmailMissing",
      "confirmAction",
      "cancelConfirm",
    ] as const),
    channels: pick(t, "channels", [
      "title",
      "subtitle",
      "active",
      "notActivated",
      "preparedOnly",
      "incomingLive",
      "stagingOnly",
      "web",
      "webNote",
      "app",
      "appNote",
      "partner",
      "partnerNote",
      "module",
      "moduleNote",
      "kompis",
      "kompisNote",
      "emailSendBlocked",
    ] as const),
    reply: pick(t, "reply", [
      "title",
      "draft",
      "customerReplyHint",
      "replyPlaceholder",
      "chooseTemplate",
      "preview",
      "saveDraft",
      "draftSaved",
      "emailOff",
      "internalNote",
      "internalNoteHint",
      "notePlaceholder",
      "saveNote",
      "noteSaved",
      "attachSignature",
      "signatureAttached",
    ] as const),
    detail: {
      ...pick(t, "detail", [
        "title",
        "back",
        "loadingDetail",
        "detailError",
        "description",
        "noDescription",
        "activity",
        "noHistory",
        "messagesBlocked",
        "statusLabel",
        "updateStatus",
        "statusUpdated",
        "assignmentUpdated",
      ] as const),
      entryKinds: pick(t, "detail.entryKinds", entryKindKeys),
      deliveryLabels: pick(t, "detail.deliveryLabels", deliveryKeys),
      writeErrors: pick(t, "detail.writeErrors", writeErrorKeys),
    },
  };
}

export default async function PlatformSupportPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <Suspense
      fallback={<AipifyLoader label={t("platform.supportCenter.loading")} />}
    >
      <PlatformSupportCenterPanel
        locale={locale}
        labels={buildSupportCenterLabels(t)}
      />
    </Suspense>
  );
}
