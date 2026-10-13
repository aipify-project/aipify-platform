type TranslateFn = (key: string) => string;

/**
 * Customer APP labels for Employee Knowledge / Kompis Bedrift Ansattkunnskap.
 * UI language only — distinct from future knowledge-content locales.
 */
export function buildEmployeeKnowledgeLabels(t: TranslateFn) {
  const p = "customerApp.employeeKnowledge";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    save: t(`${p}.save`),
    saved: t(`${p}.saved`),
    privacy: t(`${p}.privacy`),
    viewBusinessDna: t(`${p}.viewBusinessDna`),
    youControl: t(`${p}.youControl`),
    empty: t(`${p}.empty`),
    sections: {
      health: t(`${p}.sections.health`),
      coverage: t(`${p}.sections.coverage`),
      gaps: t(`${p}.sections.gaps`),
      onboarding: t(`${p}.sections.onboarding`),
      permissions: t(`${p}.sections.permissions`),
      sources: t(`${p}.sections.sources`),
      pending: t(`${p}.sections.pending`),
      ask: t(`${p}.sections.ask`),
      search: t(`${p}.sections.search`),
      audit: t(`${p}.sections.audit`),
      ethics: t(`${p}.sections.ethics`),
      settings: t(`${p}.sections.settings`),
    },
    settings: {
      assistant: t(`${p}.settings.assistant`),
      gapDetection: t(`${p}.settings.gapDetection`),
      onboarding: t(`${p}.settings.onboarding`),
      improvementLoop: t(`${p}.settings.improvementLoop`),
      adminApproval: t(`${p}.settings.adminApproval`),
      videoSupport: t(`${p}.settings.videoSupport`),
    },
    ask: {
      placeholder: t(`${p}.ask.placeholder`),
      run: t(`${p}.ask.run`),
      confidence: t(`${p}.ask.confidence`),
      escalate: t(`${p}.ask.escalate`),
      steps: t(`${p}.ask.steps`),
    },
    search: {
      placeholder: t(`${p}.search.placeholder`),
      run: t(`${p}.search.run`),
    },
    create: {
      title: t(`${p}.create.title`),
      category: t(`${p}.create.category`),
      content: t(`${p}.create.content`),
      submit: t(`${p}.create.submit`),
    },
    workspace: {
      createFaq: t(`${p}.workspace.createFaq`),
      articles: t(`${p}.workspace.articles`),
      pendingReview: t(`${p}.workspace.pendingReview`),
      gaps: t(`${p}.workspace.gaps`),
      askTest: t(`${p}.workspace.askTest`),
      searchKnowledge: t(`${p}.workspace.searchKnowledge`),
      recentTitle: t(`${p}.workspace.recentTitle`),
      seeAllArticles: t(`${p}.workspace.seeAllArticles`),
      questionLabel: t(`${p}.workspace.questionLabel`),
      answerLabel: t(`${p}.workspace.answerLabel`),
      saveDraft: t(`${p}.workspace.saveDraft`),
      sendForApproval: t(`${p}.workspace.sendForApproval`),
      statusDraft: t(`${p}.workspace.statusDraft`),
      statusApproved: t(`${p}.workspace.statusApproved`),
      statusPending: t(`${p}.workspace.statusPending`),
      emptyArticlesTitle: t(`${p}.workspace.emptyArticlesTitle`),
      emptyArticlesBody: t(`${p}.workspace.emptyArticlesBody`),
      emptyAnswerBlocked: t(`${p}.workspace.emptyAnswerBlocked`),
      multilingualGapTitle: t(`${p}.workspace.multilingualGapTitle`),
      multilingualGapBody: t(`${p}.workspace.multilingualGapBody`),
      approve: t(`${p}.workspace.approve`),
      editUnavailable: t(`${p}.workspace.editUnavailable`),
      createSuccess: t(`${p}.workspace.createSuccess`),
      createError: t(`${p}.workspace.createError`),
      filterAll: t(`${p}.workspace.filterAll`),
      filterDraft: t(`${p}.workspace.filterDraft`),
      filterApproved: t(`${p}.workspace.filterApproved`),
      updatedLabel: t(`${p}.workspace.updatedLabel`),
      noRecent: t(`${p}.workspace.noRecent`),
      roleLabel: t(`${p}.workspace.roleLabel`),
      retry: t(`${p}.workspace.retry`),
      loadError: t(`${p}.workspace.loadError`),
    },
  };
}

export type EmployeeKnowledgeLabels = ReturnType<typeof buildEmployeeKnowledgeLabels>;
