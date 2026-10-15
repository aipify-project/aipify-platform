import type { Translator } from "@/lib/i18n/translate";
import {
  PLATFORM_SUPPORT_INBOX_PRODUCT_TABS,
  type PlatformSupportInboxProductTab,
} from "./support-inbox-ui-contract";

export type PlatformSupportInboxLabels = {
  title: string;
  subtitle: string;
  dormantBannerTitle: string;
  dormantBannerBody: string;
  legacySectionTitle: string;
  legacySectionSubtitle: string;
  statusCards: {
    open: string;
    waiting: string;
    resolved: string;
    total: string;
    unavailable: string;
    scopeNote: string;
  };
  filters: {
    channel: string;
    status: string;
    priority: string;
    search: string;
    searchPlaceholder: string;
    disabledHint: string;
  };
  list: {
    title: string;
    emptyTitle: string;
    emptyBody: string;
    columns: {
      customer: string;
      subject: string;
      channel: string;
      status: string;
      priority: string;
      updated: string;
    };
  };
  detail: {
    title: string;
    empty: string;
    originalLanguage: string;
    norwegianTranslation: string;
    replyTranslation: string;
    internalNotes: string;
    customerVisibleReply: string;
    approveBeforeSend: string;
    sendDisabled: string;
    history: string;
    localeGap: string;
  };
  channels: Record<
    PlatformSupportInboxProductTab,
    { label: string; statusLinked: string; statusNotLinked: string; note: string }
  >;
  linkStatus: {
    linked: string;
    notLinked: string;
  };
};

export function buildPlatformSupportInboxLabels(t: Translator): PlatformSupportInboxLabels {
  const channels = {} as PlatformSupportInboxLabels["channels"];
  for (const key of PLATFORM_SUPPORT_INBOX_PRODUCT_TABS) {
    channels[key] = {
      label: t(`platform.supportInbox.channels.${key}.label`),
      statusLinked: t(`platform.supportInbox.channels.${key}.statusLinked`),
      statusNotLinked: t(`platform.supportInbox.channels.${key}.statusNotLinked`),
      note: t(`platform.supportInbox.channels.${key}.note`),
    };
  }

  return {
    title: t("platform.supportInbox.title"),
    subtitle: t("platform.supportInbox.subtitle"),
    dormantBannerTitle: t("platform.supportInbox.dormantBannerTitle"),
    dormantBannerBody: t("platform.supportInbox.dormantBannerBody"),
    legacySectionTitle: t("platform.supportInbox.legacySectionTitle"),
    legacySectionSubtitle: t("platform.supportInbox.legacySectionSubtitle"),
    statusCards: {
      open: t("platform.supportInbox.statusCards.open"),
      waiting: t("platform.supportInbox.statusCards.waiting"),
      resolved: t("platform.supportInbox.statusCards.resolved"),
      total: t("platform.supportInbox.statusCards.total"),
      unavailable: t("platform.supportInbox.statusCards.unavailable"),
      scopeNote: t("platform.supportInbox.statusCards.scopeNote"),
    },
    filters: {
      channel: t("platform.supportInbox.filters.channel"),
      status: t("platform.supportInbox.filters.status"),
      priority: t("platform.supportInbox.filters.priority"),
      search: t("platform.supportInbox.filters.search"),
      searchPlaceholder: t("platform.supportInbox.filters.searchPlaceholder"),
      disabledHint: t("platform.supportInbox.filters.disabledHint"),
    },
    list: {
      title: t("platform.supportInbox.list.title"),
      emptyTitle: t("platform.supportInbox.list.emptyTitle"),
      emptyBody: t("platform.supportInbox.list.emptyBody"),
      columns: {
        customer: t("platform.supportInbox.list.columns.customer"),
        subject: t("platform.supportInbox.list.columns.subject"),
        channel: t("platform.supportInbox.list.columns.channel"),
        status: t("platform.supportInbox.list.columns.status"),
        priority: t("platform.supportInbox.list.columns.priority"),
        updated: t("platform.supportInbox.list.columns.updated"),
      },
    },
    detail: {
      title: t("platform.supportInbox.detail.title"),
      empty: t("platform.supportInbox.detail.empty"),
      originalLanguage: t("platform.supportInbox.detail.originalLanguage"),
      norwegianTranslation: t("platform.supportInbox.detail.norwegianTranslation"),
      replyTranslation: t("platform.supportInbox.detail.replyTranslation"),
      internalNotes: t("platform.supportInbox.detail.internalNotes"),
      customerVisibleReply: t("platform.supportInbox.detail.customerVisibleReply"),
      approveBeforeSend: t("platform.supportInbox.detail.approveBeforeSend"),
      sendDisabled: t("platform.supportInbox.detail.sendDisabled"),
      history: t("platform.supportInbox.detail.history"),
      localeGap: t("platform.supportInbox.detail.localeGap"),
    },
    channels,
    linkStatus: {
      linked: t("platform.supportInbox.linkStatus.linked"),
      notLinked: t("platform.supportInbox.linkStatus.notLinked"),
    },
  };
}
