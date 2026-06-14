import type { ActionImpactLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildActionImpactLabels(t: Translator): ActionImpactLabels {
  const p = "customerApp.actionCenter.impactAnalysis";
  return {
    sections: {
      summary: t(`${p}.sections.summary`),
      businessImpact: t(`${p}.sections.businessImpact`),
      riskAnalysis: t(`${p}.sections.riskAnalysis`),
      confidence: t(`${p}.sections.confidence`),
      rollback: t(`${p}.sections.rollback`),
      affectedSystems: t(`${p}.sections.affectedSystems`),
      approvalChain: t(`${p}.sections.approvalChain`),
      auditPreview: t(`${p}.sections.auditPreview`),
      relatedActions: t(`${p}.sections.relatedActions`),
      timeline: t(`${p}.sections.timeline`),
      postExecution: t(`${p}.sections.postExecution`),
    },
    summary: {
      status: t(`${p}.summary.status`),
      recommendedBy: t(`${p}.summary.recommendedBy`),
      priority: t(`${p}.summary.priority`),
    },
    businessImpact: {
      expectedBenefits: t(`${p}.businessImpact.expectedBenefits`),
      timeSavings: t(`${p}.businessImpact.timeSavings`),
      affectedTeams: t(`${p}.businessImpact.affectedTeams`),
      customerImpact: t(`${p}.businessImpact.customerImpact`),
    },
    riskAnalysis: {
      riskLevel: t(`${p}.riskAnalysis.riskLevel`),
      sideEffects: t(`${p}.riskAnalysis.sideEffects`),
      mitigation: t(`${p}.riskAnalysis.mitigation`),
    },
    confidence: {
      score: t(`${p}.confidence.score`),
      reasoning: t(`${p}.confidence.reasoning`),
      historicalSuccess: t(`${p}.confidence.historicalSuccess`),
      operatingConditions: t(`${p}.confidence.operatingConditions`),
    },
    rollback: {
      available: t(`${p}.rollback.available`),
      notAvailable: t(`${p}.rollback.notAvailable`),
      recoveryTime: t(`${p}.rollback.recoveryTime`),
      steps: t(`${p}.rollback.steps`),
      manualRequired: t(`${p}.rollback.manualRequired`),
    },
    approvalChain: {
      requestedBy: t(`${p}.approvalChain.requestedBy`),
      requiresApprovalFrom: t(`${p}.approvalChain.requiresApprovalFrom`),
      escalationPath: t(`${p}.approvalChain.escalationPath`),
    },
    auditPreview: {
      intro: t(`${p}.auditPreview.intro`),
      approvalEvent: t(`${p}.auditPreview.approvalEvent`),
      executionEvent: t(`${p}.auditPreview.executionEvent`),
      outcomeEvent: t(`${p}.auditPreview.outcomeEvent`),
      rollbackEvent: t(`${p}.auditPreview.rollbackEvent`),
    },
    relatedActions: {
      similarExecuted: t(`${p}.relatedActions.similarExecuted`),
      averageSuccess: t(`${p}.relatedActions.averageSuccess`),
    },
    timeline: {
      review: t(`${p}.timeline.review`),
      approve: t(`${p}.timeline.approve`),
      execute: t(`${p}.timeline.execute`),
      verify: t(`${p}.timeline.verify`),
      monitor: t(`${p}.timeline.monitor`),
      close: t(`${p}.timeline.close`),
    },
    timelineStatus: {
      pending: t(`${p}.timelineStatus.pending`),
      current: t(`${p}.timelineStatus.current`),
      complete: t(`${p}.timelineStatus.complete`),
      blocked: t(`${p}.timelineStatus.blocked`),
    },
    postExecution: {
      result: t(`${p}.postExecution.result`),
      executionTime: t(`${p}.postExecution.executionTime`),
      unexpectedEvents: t(`${p}.postExecution.unexpectedEvents`),
      businessOutcome: t(`${p}.postExecution.businessOutcome`),
      successful: t(`${p}.postExecution.successful`),
      failed: t(`${p}.postExecution.failed`),
      positive: t(`${p}.postExecution.positive`),
      reviewRequired: t(`${p}.postExecution.reviewRequired`),
      none: t(`${p}.postExecution.none`),
    },
    categories: {
      support: t(`${p}.categories.support`),
      automation: t(`${p}.categories.automation`),
      billing: t(`${p}.categories.billing`),
      installation: t(`${p}.categories.installation`),
      governance: t(`${p}.categories.governance`),
      customer: t(`${p}.categories.customer`),
      growth_partner: t(`${p}.categories.growthPartner`),
      workflow_recovery: t(`${p}.categories.workflowRecovery`),
    },
    empty: t(`${p}.empty`),
    emptyMonitoring: t(`${p}.emptyMonitoring`),
    principle: t(`${p}.principle`),
    actions: {
      approve: t(`${p}.actions.approve`),
      reject: t(`${p}.actions.reject`),
      execute: t(`${p}.actions.execute`),
      back: t(`${p}.actions.back`),
    },
    priority: {
      low: t(`${p}.priority.low`),
      medium: t(`${p}.priority.medium`),
      high: t(`${p}.priority.high`),
      critical: t(`${p}.priority.critical`),
    },
    customerImpact: {
      Positive: t(`${p}.customerImpact.positive`),
      "Monitor closely": t(`${p}.customerImpact.monitorClosely`),
    },
  };
}
