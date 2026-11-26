import type { AppLanguageSelectorLabels } from "@/components/app/AppLanguageSelector";
import type { Translator } from "@/lib/i18n/translate";
import type { VocWidgetLabels } from "@/lib/voice-of-the-customer";
import {
  CUSTOMER_STATUSES,
  FEEDBACK_PRIORITIES,
  FEEDBACK_TYPES,
} from "@/lib/voice-of-the-customer/constants";

const P = "partnersPortal.certifiedSalesPartner.topbar";

export type PartnersPortalTopbarLabels = {
  language: AppLanguageSelectorLabels;
  feedback: VocWidgetLabels;
  feedbackUnavailable: string;
  notifications: string;
  notificationsEmpty: string;
  notificationsViewAll: string;
  messages: string;
  profile: string;
  settingsMenu: string;
  avatarAlt: string;
  skipToContent: string;
  mainNavigation: string;
};

/** Seller-portal topbar copy — partnersPortal locale namespace, all core locales. */
export function buildPartnersPortalTopbarLabels(t: Translator): PartnersPortalTopbarLabels {
  const f = `${P}.feedback`;
  const l = `${P}.language`;

  return {
    language: {
      label: t(`${l}.label`),
      activeLanguage: t(`${l}.activeLanguage`),
      changeLanguage: t(`${l}.changeLanguage`),
      switchFailed: t(`${l}.switchFailed`),
      retry: t(`${l}.retry`),
      openMenu: t(`${l}.openMenu`),
    },
    feedback: {
      trigger: t(`${f}.trigger`),
      triggerShort: t(`${f}.triggerShort`),
      title: t(`${f}.title`),
      subtitle: t(`${f}.subtitle`),
      type: t(`${f}.type`),
      feedbackTitle: t(`${f}.feedbackTitle`),
      description: t(`${f}.description`),
      priority: t(`${f}.priority`),
      wantsResponse: t(`${f}.wantsResponse`),
      noResponse: t(`${f}.noResponse`),
      contactMe: t(`${f}.contactMe`),
      includeContext: t(`${f}.includeContext`),
      submit: t(`${f}.submit`),
      submitting: t(`${f}.submitting`),
      acknowledgementTitle: t(`${f}.acknowledgementTitle`),
      acknowledgementBody: t(`${f}.acknowledgementBody`),
      historyTitle: t(`${f}.historyTitle`),
      historyEmpty: t(`${f}.historyEmpty`),
      feedbackTypes: Object.fromEntries(
        FEEDBACK_TYPES.map((key) => [key, t(`${f}.feedbackTypes.${key}`)]),
      ) as VocWidgetLabels["feedbackTypes"],
      priorities: Object.fromEntries(
        FEEDBACK_PRIORITIES.map((key) => [key, t(`${f}.priorities.${key}`)]),
      ) as VocWidgetLabels["priorities"],
      customerStatuses: Object.fromEntries(
        CUSTOMER_STATUSES.map((key) => [key, t(`${f}.customerStatuses.${key}`)]),
      ) as VocWidgetLabels["customerStatuses"],
      close: t(`${f}.close`),
      trustNote: t(`${f}.trustNote`),
      transparencyNote: t(`${f}.transparencyNote`),
      trustStatementLink: t(`${f}.trustStatementLink`),
      trustStatementLinkAria: t(`${f}.trustStatementLinkAria`),
    },
    feedbackUnavailable: t(`${P}.feedbackUnavailable`),
    notifications: t(`${P}.notifications`),
    notificationsEmpty: t(`${P}.notificationsEmpty`),
    notificationsViewAll: t(`${P}.notificationsViewAll`),
    messages: t(`${P}.messages`),
    profile: t(`${P}.profile`),
    settingsMenu: t(`${P}.settingsMenu`),
    avatarAlt: t(`${P}.avatarAlt`),
    skipToContent: t(`${P}.skipToContent`),
    mainNavigation: t(`${P}.mainNavigation`),
  };
}

export type PartnersPortalAvatarLabels = {
  title: string;
  subtitle: string;
  hint: string;
  privacyNote: string;
  empty: string;
  current: string;
  upload: string;
  replace: string;
  remove: string;
  uploading: string;
  optimizing: string;
  removing: string;
  saved: string;
  removed: string;
  errorType: string;
  errorSize: string;
  errorImage: string;
  errorGeneric: string;
  errorUnavailable: string;
  errorSession: string;
  avatarAlt: string;
};

export function buildPartnersPortalAvatarLabels(t: Translator): PartnersPortalAvatarLabels {
  const a = "partnersPortal.certifiedSalesPartner.avatar";
  return {
    title: t(`${a}.title`),
    subtitle: t(`${a}.subtitle`),
    hint: t(`${a}.hint`),
    privacyNote: t(`${a}.privacyNote`),
    empty: t(`${a}.empty`),
    current: t(`${a}.current`),
    upload: t(`${a}.upload`),
    replace: t(`${a}.replace`),
    remove: t(`${a}.remove`),
    uploading: t(`${a}.uploading`),
    optimizing: t(`${a}.optimizing`),
    removing: t(`${a}.removing`),
    saved: t(`${a}.saved`),
    removed: t(`${a}.removed`),
    errorType: t(`${a}.errorType`),
    errorSize: t(`${a}.errorSize`),
    errorImage: t(`${a}.errorImage`),
    errorGeneric: t(`${a}.errorGeneric`),
    errorUnavailable: t(`${a}.errorUnavailable`),
    errorSession: t(`${a}.errorSession`),
    avatarAlt: t(`${P}.avatarAlt`),
  };
}

export type PartnersPortalMessagesLabels = {
  title: string;
  subtitle: string;
  statusLabel: string;
  statusNotActive: string;
  notReadyTitle: string;
  notReadyBody: string;
  nextStep: string;
  notificationsCta: string;
  homeCta: string;
  emptyTitle: string;
  emptyBody: string;
  errorTitle: string;
  errorBody: string;
  retry: string;
  fromAdmin: string;
  fromYou: string;
  replyTitle: string;
  replyPlaceholder: string;
  sendReply: string;
  sending: string;
  sendOk: string;
  sendError: string;
  tabInbox: string;
  tabSent: string;
  searchPlaceholder: string;
  backToList: string;
  noSelectionTitle: string;
  noSelectionBody: string;
  unread: string;
  openRelated: string;
};

export function buildPartnersPortalMessagesLabels(t: Translator): PartnersPortalMessagesLabels {
  const m = "partnersPortal.certifiedSalesPartner.messages";
  return {
    title: t(`${m}.title`),
    subtitle: t(`${m}.subtitle`),
    statusLabel: t(`${m}.statusLabel`),
    statusNotActive: t(`${m}.statusNotActive`),
    notReadyTitle: t(`${m}.notReadyTitle`),
    notReadyBody: t(`${m}.notReadyBody`),
    nextStep: t(`${m}.nextStep`),
    notificationsCta: t(`${m}.notificationsCta`),
    homeCta: t(`${m}.homeCta`),
    emptyTitle: t(`${m}.emptyTitle`),
    emptyBody: t(`${m}.emptyBody`),
    errorTitle: t(`${m}.errorTitle`),
    errorBody: t(`${m}.errorBody`),
    retry: t(`${m}.retry`),
    fromAdmin: t(`${m}.fromAdmin`),
    fromYou: t(`${m}.fromYou`),
    replyTitle: t(`${m}.replyTitle`),
    replyPlaceholder: t(`${m}.replyPlaceholder`),
    sendReply: t(`${m}.sendReply`),
    sending: t(`${m}.sending`),
    sendOk: t(`${m}.sendOk`),
    sendError: t(`${m}.sendError`),
    tabInbox: t(`${m}.tabInbox`),
    tabSent: t(`${m}.tabSent`),
    searchPlaceholder: t(`${m}.searchPlaceholder`),
    backToList: t(`${m}.backToList`),
    noSelectionTitle: t(`${m}.noSelectionTitle`),
    noSelectionBody: t(`${m}.noSelectionBody`),
    unread: t(`${m}.unread`),
    openRelated: t(`${m}.openRelated`),
  };
}
