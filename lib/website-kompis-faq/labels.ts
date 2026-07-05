import {
  WPKF_CONTENT_TYPES,
  WPKF_LOCALES,
  WPKF_STATUSES,
} from "@/lib/website-kompis-faq/constants";

type TranslateFn = (key: string) => string;

export function buildWebsiteKompisFaqLabels(t: TranslateFn) {
  const prefix = "customerApp.websiteKompisFaq";

  const contentTypes = Object.fromEntries(
    WPKF_CONTENT_TYPES.map((type) => [type, t(`${prefix}.contentTypes.${type}`)]),
  ) as Record<(typeof WPKF_CONTENT_TYPES)[number], string>;

  const statuses = Object.fromEntries(
    WPKF_STATUSES.map((status) => [status, t(`${prefix}.statuses.${status}`)]),
  ) as Record<(typeof WPKF_STATUSES)[number], string>;

  const locales = Object.fromEntries(
    WPKF_LOCALES.map((locale) => [locale, t(`${prefix}.locales.${locale}`)]),
  ) as Record<(typeof WPKF_LOCALES)[number], string>;

  return {
    title: t(`${prefix}.title`),
    subtitle: t(`${prefix}.subtitle`),
    navTitle: t(`${prefix}.navTitle`),
    warningBanner: t(`${prefix}.warningBanner`),
    loading: t(`${prefix}.loading`),
    accessDenied: t(`${prefix}.accessDenied`),
    back: t(`${prefix}.back`),
    saveDraft: t(`${prefix}.saveDraft`),
    saved: t(`${prefix}.saved`),
    publish: t(`${prefix}.publish`),
    unpublish: t(`${prefix}.unpublish`),
    archive: t(`${prefix}.archive`),
    restore: t(`${prefix}.restore`),
    createFirst: t(`${prefix}.createFirst`),
    emptyTitle: t(`${prefix}.emptyTitle`),
    emptyDescription: t(`${prefix}.emptyDescription`),
    edit: t(`${prefix}.edit`),
    create: t(`${prefix}.create`),
    cancel: t(`${prefix}.cancel`),
    confirmPublishTitle: t(`${prefix}.confirmPublishTitle`),
    confirmPublishBody: t(`${prefix}.confirmPublishBody`),
    confirmPublishAction: t(`${prefix}.confirmPublishAction`),
    riskyWordsWarning: t(`${prefix}.riskyWordsWarning`),
    previewTitle: t(`${prefix}.previewTitle`),
    previewHint: t(`${prefix}.previewHint`),
    previewGroundingNote: t(`${prefix}.previewGroundingNote`),
    filters: {
      status: t(`${prefix}.filters.status`),
      locale: t(`${prefix}.filters.locale`),
      contentType: t(`${prefix}.filters.contentType`),
      search: t(`${prefix}.filters.search`),
      all: t(`${prefix}.filters.all`),
    },
    columns: {
      title: t(`${prefix}.columns.title`),
      locale: t(`${prefix}.columns.locale`),
      category: t(`${prefix}.columns.category`),
      contentType: t(`${prefix}.columns.contentType`),
      status: t(`${prefix}.columns.status`),
      publicSafe: t(`${prefix}.columns.publicSafe`),
      priority: t(`${prefix}.columns.priority`),
      publishedAt: t(`${prefix}.columns.publishedAt`),
      lastReviewedAt: t(`${prefix}.columns.lastReviewedAt`),
      actions: t(`${prefix}.columns.actions`),
    },
    fields: {
      title: t(`${prefix}.fields.title`),
      question: t(`${prefix}.fields.question`),
      answer: t(`${prefix}.fields.answer`),
      category: t(`${prefix}.fields.category`),
      locale: t(`${prefix}.fields.locale`),
      contentType: t(`${prefix}.fields.contentType`),
      tags: t(`${prefix}.fields.tags`),
      sourceUrl: t(`${prefix}.fields.sourceUrl`),
      validFrom: t(`${prefix}.fields.validFrom`),
      validUntil: t(`${prefix}.fields.validUntil`),
      priority: t(`${prefix}.fields.priority`),
      publicSafe: t(`${prefix}.fields.publicSafe`),
      publicSafeHint: t(`${prefix}.fields.publicSafeHint`),
      lastReviewedAt: t(`${prefix}.fields.lastReviewedAt`),
    },
    yes: t(`${prefix}.yes`),
    no: t(`${prefix}.no`),
    errorGeneric: t(`${prefix}.errorGeneric`),
    publishDisabledHint: t(`${prefix}.publishDisabledHint`),
    contentTypes,
    statuses,
    locales,
  };
}

export type WebsiteKompisFaqLabels = ReturnType<typeof buildWebsiteKompisFaqLabels>;
