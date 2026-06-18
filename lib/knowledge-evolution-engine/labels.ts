import type { Translator } from "@/lib/i18n/translate";

export function buildKnowledgeEvolutionEngineLabels(t: Translator) {
  const p = "customerApp.knowledgeEvolutionEngine";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    healthTitle: t(`${p}.healthTitle`),
    healthScore: t(`${p}.healthScore`),
    coverage: t(`${p}.coverage`),
    freshness: t(`${p}.freshness`),
    pendingApprovals: t(`${p}.pendingApprovals`),
    openGaps: t(`${p}.openGaps`),
    sections: {
      knowledgeOpportunities: t(`${p}.sections.knowledgeOpportunities`),
      missingKnowledge: t(`${p}.sections.missingKnowledge`),
      suggestedImprovements: t(`${p}.sections.suggestedImprovements`),
      outdatedContent: t(`${p}.sections.outdatedContent`),
      highRiskGaps: t(`${p}.sections.highRiskGaps`),
    },
    governance: {
      source: t(`${p}.governance.source`),
      owner: t(`${p}.governance.owner`),
      department: t(`${p}.governance.department`),
      status: t(`${p}.governance.status`),
      version: t(`${p}.governance.version`),
      reviewDate: t(`${p}.governance.reviewDate`),
      lastUpdated: t(`${p}.governance.lastUpdated`),
      usage: t(`${p}.governance.usage`),
      occurrences: t(`${p}.governance.occurrences`),
    },
    suggestedAction: t(`${p}.suggestedAction`),
    supportCandidates: {
      title: t(`${p}.supportCandidates.title`),
      empty: t(`${p}.supportCandidates.empty`),
      approvalRequired: t(`${p}.supportCandidates.approvalRequired`),
    },
    intelligence: {
      title: t(`${p}.intelligence.title`),
      mostValuableDocuments: t(`${p}.intelligence.mostValuableDocuments`),
      mostUsedProcedures: t(`${p}.intelligence.mostUsedProcedures`),
      mostSearchedTopics: t(`${p}.intelligence.mostSearchedTopics`),
      mostRequestedInformation: t(`${p}.intelligence.mostRequestedInformation`),
    },
    executive: {
      title: t(`${p}.executive.title`),
      knowledgeHealth: t(`${p}.executive.knowledgeHealth`),
      knowledgeCoverage: t(`${p}.executive.knowledgeCoverage`),
      knowledgeRisks: t(`${p}.executive.knowledgeRisks`),
      knowledgeGrowth: t(`${p}.executive.knowledgeGrowth`),
      pendingApprovals: t(`${p}.executive.pendingApprovals`),
    },
    actions: {
      approve: t(`${p}.actions.approve`),
      reject: t(`${p}.actions.reject`),
      resolve: t(`${p}.actions.resolve`),
      dismiss: t(`${p}.actions.dismiss`),
    },
    status: {
      completed: t(`${p}.status.completed`),
      notAllowed: t(`${p}.status.notAllowed`),
      requiresAttention: t(`${p}.status.requiresAttention`),
      information: t(`${p}.status.information`),
      restricted: t(`${p}.status.restricted`),
      verified: t(`${p}.status.verified`),
      waiting: t(`${p}.status.waiting`),
    },
    improvementTypes: {
      rewrite_article: t(`${p}.improvementTypes.rewriteArticle`),
      add_screenshots: t(`${p}.improvementTypes.addScreenshots`),
      add_video_guide: t(`${p}.improvementTypes.addVideoGuide`),
      add_faq_section: t(`${p}.improvementTypes.addFaqSection`),
      create_article: t(`${p}.improvementTypes.createArticle`),
      add_procedure: t(`${p}.improvementTypes.addProcedure`),
    },
    candidateTypes: {
      faq_suggestion: t(`${p}.candidateTypes.faqSuggestion`),
      knowledge_article: t(`${p}.candidateTypes.knowledgeArticle`),
      training_material: t(`${p}.candidateTypes.trainingMaterial`),
      procedure: t(`${p}.candidateTypes.procedure`),
      compliance_doc: t(`${p}.candidateTypes.complianceDoc`),
      customer_instruction: t(`${p}.candidateTypes.customerInstruction`),
    },
    links: {
      legacyCenter: t(`${p}.links.legacyCenter`),
      knowledgeCenter: t(`${p}.links.knowledgeCenter`),
      employeeKnowledge: t(`${p}.links.employeeKnowledge`),
    },
  };
}

export type KnowledgeEvolutionEngineLabels = ReturnType<typeof buildKnowledgeEvolutionEngineLabels>;
