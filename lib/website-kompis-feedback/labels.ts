type TranslateFn = (key: string) => string;

export function buildWebsiteKompisFeedbackLabels(t: TranslateFn) {
  const prefix = "customerApp.websiteKompisFeedback";
  return {
    title: t(`${prefix}.title`),
    subtitle: t(`${prefix}.subtitle`),
    navTitle: t(`${prefix}.navTitle`),
    backToFaq: t(`${prefix}.backToFaq`),
    loading: t(`${prefix}.loading`),
    accessDenied: t(`${prefix}.accessDenied`),
    errorGeneric: t(`${prefix}.errorGeneric`),
    retry: t(`${prefix}.retry`),
    emptyTitle: t(`${prefix}.emptyTitle`),
    emptyDescription: t(`${prefix}.emptyDescription`),
    persistenceUnavailableTitle: t(`${prefix}.persistenceUnavailableTitle`),
    persistenceUnavailableBody: t(`${prefix}.persistenceUnavailableBody`),
    reuseOffNote: t(`${prefix}.reuseOffNote`),
    helpfulNotTruth: t(`${prefix}.helpfulNotTruth`),
    totals: {
      answers: t(`${prefix}.totals.answers`),
      helpful: t(`${prefix}.totals.helpful`),
      notHelpful: t(`${prefix}.totals.notHelpful`),
      withComment: t(`${prefix}.totals.withComment`),
    },
    columns: {
      vote: t(`${prefix}.columns.vote`),
      question: t(`${prefix}.columns.question`),
      answer: t(`${prefix}.columns.answer`),
      comment: t(`${prefix}.columns.comment`),
      page: t(`${prefix}.columns.page`),
      locale: t(`${prefix}.columns.locale`),
      when: t(`${prefix}.columns.when`),
    },
    votes: {
      helpful: t(`${prefix}.votes.helpful`),
      notHelpful: t(`${prefix}.votes.notHelpful`),
    },
  };
}

export type WebsiteKompisFeedbackLabels = ReturnType<typeof buildWebsiteKompisFeedbackLabels>;
