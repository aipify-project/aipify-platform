type TranslateFn = (key: string) => string;

export function buildWebsiteKompisKnowledgeLabels(t: TranslateFn) {
  const prefix = "customerApp.websiteKompisKnowledge";
  return {
    title: t(`${prefix}.title`),
    subtitle: t(`${prefix}.subtitle`),
    sections: {
      faq: t(`${prefix}.sections.faq`),
      pages: t(`${prefix}.sections.pages`),
      documents: t(`${prefix}.sections.documents`),
      followUp: t(`${prefix}.sections.followUp`),
    },
    sectionHints: {
      faq: t(`${prefix}.sectionHints.faq`),
      pages: t(`${prefix}.sectionHints.pages`),
      documents: t(`${prefix}.sectionHints.documents`),
      followUp: t(`${prefix}.sectionHints.followUp`),
    },
    counts: {
      published: t(`${prefix}.counts.published`),
      draft: t(`${prefix}.counts.draft`),
      archived: t(`${prefix}.counts.archived`),
      needsReview: t(`${prefix}.counts.needsReview`),
      lastUpdated: t(`${prefix}.counts.lastUpdated`),
      unavailable: t(`${prefix}.counts.unavailable`),
      windowExact: t(`${prefix}.counts.windowExact`),
      windowLimited: t(`${prefix}.counts.windowLimited`),
    },
    pagesUnavailableTitle: t(`${prefix}.pagesUnavailableTitle`),
    pagesUnavailableBody: t(`${prefix}.pagesUnavailableBody`),
    documentsUnavailableTitle: t(`${prefix}.documentsUnavailableTitle`),
    documentsUnavailableBody: t(`${prefix}.documentsUnavailableBody`),
    followUpEmptyTitle: t(`${prefix}.followUpEmptyTitle`),
    followUpEmptyBody: t(`${prefix}.followUpEmptyBody`),
    followUpDrafts: t(`${prefix}.followUpDrafts`),
    followUpFeedback: t(`${prefix}.followUpFeedback`),
    openFaqEditor: t(`${prefix}.openFaqEditor`),
    openFeedback: t(`${prefix}.openFeedback`),
    openConnection: t(`${prefix}.openConnection`),
    createFaq: t(`${prefix}.createFaq`),
    reviewDrafts: t(`${prefix}.reviewDrafts`),
    neverAutoPublish: t(`${prefix}.neverAutoPublish`),
    bedriftNotMixed: t(`${prefix}.bedriftNotMixed`),
    dashboardTitle: t(`${prefix}.dashboardTitle`),
    dashboardDescription: t(`${prefix}.dashboardDescription`),
    overviewTitle: t(`${prefix}.overviewTitle`),
    overviewDescription: t(`${prefix}.overviewDescription`),
    hintPublished: t(`${prefix}.hintPublished`),
    hintDraft: t(`${prefix}.hintDraft`),
    hintArchived: t(`${prefix}.hintArchived`),
  };
}

export type WebsiteKompisKnowledgeLabels = ReturnType<typeof buildWebsiteKompisKnowledgeLabels>;
