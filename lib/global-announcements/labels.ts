import type { Translator } from "@/lib/i18n/translate";
import type { GlobalAnnouncementLabels } from "./types";
import {
  ANNOUNCEMENT_CATEGORIES,
  ANNOUNCEMENT_STATUSES,
  DELIVERY_CHANNELS,
  TARGET_AUDIENCES,
} from "./constants";

export function buildGlobalAnnouncementLabels(t: Translator): GlobalAnnouncementLabels {
  const p = "platform.globalAnnouncements";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      announcements: t(`${p}.sections.announcements`),
      create: t(`${p}.sections.create`),
      analytics: t(`${p}.sections.analytics`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
    },
    overview: {
      active: t(`${p}.overview.active`),
      scheduled: t(`${p}.overview.scheduled`),
      drafts: t(`${p}.overview.drafts`),
      campaigns: t(`${p}.overview.campaigns`),
      deliveryRate: t(`${p}.overview.deliveryRate`),
      requiringReview: t(`${p}.overview.requiringReview`),
    },
    table: {
      title: t(`${p}.table.title`),
      category: t(`${p}.table.category`),
      audience: t(`${p}.table.audience`),
      status: t(`${p}.table.status`),
      scheduledDate: t(`${p}.table.scheduledDate`),
      createdBy: t(`${p}.table.createdBy`),
      actions: t(`${p}.table.actions`),
      views: t(`${p}.table.views`),
      emailOpens: t(`${p}.table.emailOpens`),
      clickRate: t(`${p}.table.clickRate`),
      deliverySuccess: t(`${p}.table.deliverySuccess`),
      event: t(`${p}.table.event`),
    },
    categories: Object.fromEntries(
      ANNOUNCEMENT_CATEGORIES.map((key) => [key, t(`${p}.categories.${key}`)])
    ) as GlobalAnnouncementLabels["categories"],
    audiences: Object.fromEntries(
      TARGET_AUDIENCES.map((key) => [key, t(`${p}.audiences.${key}`)])
    ) as GlobalAnnouncementLabels["audiences"],
    statuses: Object.fromEntries(
      ANNOUNCEMENT_STATUSES.map((key) => [key, t(`${p}.statuses.${key}`)])
    ) as GlobalAnnouncementLabels["statuses"],
    channels: Object.fromEntries(
      DELIVERY_CHANNELS.map((key) => [key, t(`${p}.channels.${key}`)])
    ) as GlobalAnnouncementLabels["channels"],
    form: {
      title: t(`${p}.form.title`),
      summary: t(`${p}.form.summary`),
      fullContent: t(`${p}.form.fullContent`),
      category: t(`${p}.form.category`),
      audience: t(`${p}.form.audience`),
      channels: t(`${p}.form.channels`),
      publishDate: t(`${p}.form.publishDate`),
      expirationDate: t(`${p}.form.expirationDate`),
      scheduledDate: t(`${p}.form.scheduledDate`),
      requiresApproval: t(`${p}.form.requiresApproval`),
      create: t(`${p}.form.create`),
      country: t(`${p}.form.country`),
      language: t(`${p}.form.language`),
      plan: t(`${p}.form.plan`),
    },
    actions: {
      view: t(`${p}.actions.view`),
      edit: t(`${p}.actions.edit`),
      duplicate: t(`${p}.actions.duplicate`),
      publish: t(`${p}.actions.publish`),
      schedule: t(`${p}.actions.schedule`),
      archive: t(`${p}.actions.archive`),
      approve: t(`${p}.actions.approve`),
      cancel: t(`${p}.actions.cancel`),
      applying: t(`${p}.actions.applying`),
    },
    filters: {
      category: t(`${p}.filters.category`),
      audience: t(`${p}.filters.audience`),
      status: t(`${p}.filters.status`),
      country: t(`${p}.filters.country`),
      language: t(`${p}.filters.language`),
      plan: t(`${p}.filters.plan`),
      allCategories: t(`${p}.filters.allCategories`),
      allAudiences: t(`${p}.filters.allAudiences`),
      allStatuses: t(`${p}.filters.allStatuses`),
      apply: t(`${p}.filters.apply`),
    },
  };
}
