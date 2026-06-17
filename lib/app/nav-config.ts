import { resolveAppHref } from "./route-aliases";
import { APP_PORTAL_NAV, getAppPortalActiveNavId } from "../app-portal/nav-config";

export type AppNavId =
  | "overview"
  | "workspaceProductivityHub"
  | "securityHub"
  | "signInVerification"
  | "aipifyCorePlatformEngine"
  | "multiTenantArchitectureEngine"
  | "organizationWorkspaceEngine"
  | "enterpriseOrganizationEngine"
  | "contextIntelligenceEngine"
  | "identityPermissionsEngine"
  | "secureAiActionEngine"
  | "auditAccountabilityEngine"
  | "knowledgeCenterEngine"
  | "adminAssistantEngine"
  | "supportAiEngine"
  | "integrationEngine"
  | "apiPlatformEngine"
  | "operationsDashboardEngine"
  | "customerOnboardingEngine"
  | "subscriptionPlanManagementEngine"
  | "selfSupportEngine"
  | "qualityGuardianEngine"
  | "aipifyModeration"
  | "governancePolicyEngine"
  | "unonightPilotOperationsEngine"
  | "analyticsInsightsEngine"
  | "notificationCommunicationEngine"
  | "deploymentEnvironmentManagementEngine"
  | "observabilityPlatformHealthEngine"
  | "aipifyInstallEngine"
  | "moduleMarketplaceFoundationEngine"
  | "aipifyInternalOperationsEngine"
  | "launchReadinessEngine"
  | "customerSuccessEngine"
  | "statusTransparencyEngine"
  | "enterpriseReadinessEngine"
  | "enterpriseDeploymentDeviceRolloutEngine"
  | "executiveInsightsEngine"
  | "executiveIntelligenceEngine"
  | "companionWorkforceEngine"
  | "learningTrainingEngine"
  | "aipifyUniversityEngine"
  | "certificationAchievementEngine"
  | "innovationImpactEngine"
  | "complianceRegulatoryReadinessEngine"
  | "strategicIntelligenceFoundationEngine"
  | "strategicForesightEngine"
  | "decisionIntelligenceEngine"
  | "collectiveDecisionCouncilEngine"
  | "organizationalWisdomEngine"
  | "operationsCenterFoundationEngine"
  | "continuousImprovementEngine"
  | "workflowOrchestrationEngine"
  | "humanOversightEngine"
  | "proactiveOrganizationEngine"
  | "humanPotentialAugmentedWorkEngine"
  | "augmentedOrganizationEngine"
  | "globalKnowledgeExchangeEngine"
  | "jointOperationsEngine"
  | "globalGovernanceDiplomacyEngine"
  | "globalTalentExpertNetworkEngine"
  | "globalEcosystemMarketplaceEngine"
  | "globalStewardshipCollectiveFutureEngine"
  | "futureLeadersEngine"
  | "organizationalSensemakingEngine"
  | "livingEnterpriseEngine"
  | "civicCollaborationEngine"
  | "crossSectorIntelligenceEngine"
  | "civilizationalMemoryEngine"
  | "civilizationalLearningEngine"
  | "civilizationalForesightEngine"
  | "civilizationalCoordinationEngine"
  | "constructiveDialogueEngine"
  | "sharedProsperityEngine"
  | "socialCohesionEngine"
  | "humanFlourishingEngine"
  | "multiGenerationalFuturesEngine"
  | "intergenerationalGuardianshipEngine"
  | "humanIdentityMeaningEngine"
  | "humanCreativityImaginationEngine"
  | "humanWisdomAugmentedJudgmentEngine"
  | "humanAgencyAutonomyEngine"
  | "humanDignityHumilityEngine"
  | "humanHopePossibilityEngine"
  | "sharedTrustCooperativeIntelligenceEngine"
  | "sharedResilienceAdaptiveCapacityEngine"
  | "sharedPurposeContributionEngine"
  | "humanWonderExplorationEngine"
  | "humanLegacyEternalStewardshipEngine"
  | "universalStewardshipSharedFuturesEngine"
  | "collectiveWisdomSharedLearningEngine"
  | "sharedGratitudeAppreciativeStewardshipEngine"
  | "sharedLegacyFlourishingEngine"
  | "aipifyConstitutionPerpetualPrinciplesEngine"
  | "aipifyEthicalEvolutionResponsibleInnovationEngine"
  | "aipifyGuardianshipSuccessionEngine"
  | "aipifyLegacyPreservationKnowledgeContinuityEngine"
  | "aipifyPrinciplesEnforcementEngine"
  | "aipifyValuesTransmissionCulturalContinuityEngine"
  | "aipifyDecisionTransparencyEngine"
  | "aipifyStrategicAlignmentPrioritizationEngine"
  | "aipifyExecutiveOperatingSystemFoundersCockpitEngine"
  | "aipifyKnowledgeDiscoveryIntelligentSearchEngine"
  | "aipifyActionCenterExecutionEngine"
  | "aipifyEnterpriseCommitmentAccountabilityEngine"
  | "aipifyOperationsOrchestrationEngine"
  | "aipifyResourceCapacityWorkloadBalanceEngine"
  | "aipifyDecisionCenterGovernanceEngine"
  | "aipifyOrganizationalRhythmsOperatingCadenceEngine"
  | "continuousImprovementOptimizationEngine"
  | "aipifyInnovationOpportunityDiscoveryEngine"
  | "aipifyCustomerSuccessValueRealizationEngine"
  | "aipifyEnterpriseTrainingCertificationEngine"
  | "aipifyOrganizationalCommunicationAnnouncementsEngine"
  | "aipifyEmployeeRecognitionCelebrationEngine"
  | "aipifyMentorshipKnowledgeTransferEngine"
  | "aipifySuccessionPlanningOrganizationalContinuityEngine"
  | "aipifyOrganizationalHealthWorkforceInsightsEngine"
  | "aipifySkillsInternalTalentMarketplaceEngine"
  | "aipifyInnovationIdeaManagementEngine"
  | "aipifyOrganizationalGoalsAlignmentEngine"
  | "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine"
  | "aipifyProjectPortfolioStrategicExecutionEngine"
  | "aipifyDecisionIntelligenceRecommendationEngine"
  | "aipifyEnterpriseActionPrioritizationFocusEngine"
  | "aipifyEnterpriseGovernancePolicyAutomationEngine"
  | "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine"
  | "aipifyEnterpriseExternalIntelligenceMarketAwarenessEngine"
  | "aipifyEnterpriseActionOrchestrationEngine"
  | "aipifyEnterpriseDecisionEscalationGovernanceEngine"
  | "aipifyEnterpriseContinuousImprovementEngine"
  | "aipifyEnterpriseOrganizationalMemoryEngine"
  | "aipifyEnterpriseResilienceBusinessContinuityEngine"
  | "aipifyEnterpriseTrustRelationshipIntelligenceEngine"
  | "aipifyEnterpriseStrategicExecutionEngine"
  | "aipifyEnterpriseOpportunityDiscoveryEngine"
  | "aipifyEnterpriseOrganizationalAdaptabilityEngine"
  | "aipifyEnterpriseAutonomousCoordinationEngine"
  | "aipifyEnterpriseExecutiveCopilotEngine"
  | "aipifyEnterpriseOrganizationalFocusEngine"
  | "aipifyEnterpriseExecutionConfidenceEngine"
  | "aipifyEnterpriseOrganizationalWisdomEngine"
  | "aipifyEnterpriseLegacyStewardshipEngine"
  | "aipifyEnterpriseOrganizationalConsciousnessEngine"
  | "aipifyEnterpriseOrganizationalEnergyEngine"
  | "aipifyEnterpriseCollectiveIntelligenceEngine"
  | "aipifyEnterpriseFutureReadinessEngine"
  | "aipifyEnterprisePurposeValuesAlignmentEngine"
  | "aipifyEnterpriseOrganizationalClarityEngine"
  | "aipifyEnterpriseOrganizationalSimplicityEngine"
  | "aipifyEnterpriseOrganizationalTrustEngine"
  | "aipifyWellbeingSustainablePerformanceEngine"
  | "aipifyHosts"
  | "aipifyTalentAcquisitionWorkforcePlanningEngine"
  | "aipifyPerformanceGoalAlignmentEngine"
  | "aipifyOrganizationalInsightsExecutiveIntelligenceEngine"
  | "aipifyCustomerFeedbackVoiceOfTheCustomerEngine"
  | "aipifyEnterprisePolicyComplianceManagementEngine"
  | "aipifyEnterpriseRiskResilienceEngine"
  | "aipifyBusinessContinuityCrisisManagementEngine"
  | "aipifyVendorThirdPartyRelationshipEngine"
  | "aipifyStudioCreativeIntelligenceEngine"
  | "aipifyDocumentIntelligenceEnterpriseDocumentEngine"
  | "aipifyEnterpriseWorkflowAutomationEngine"
  | "aipifyEnterpriseIntegrationHubEngine"
  | "aipifyEnterpriseNotificationAttentionManagementEngine"
  | "aipifyEnterpriseSearchUniversalKnowledgeAccessEngine"
  | "aipifyEnterpriseAnalyticsOperationalIntelligenceEngine"
  | "aipifyDesktopCompanionCreativeBridgeEngine"
  | "aipifyEnterpriseCalendarPersonalAssistantEngine"
  | "aipifyTranslateMultilingualWorkforceEngine"
  | "aipifyEnterpriseOnboardingGuidedAdoptionEngine"
  | "aipifyEnterpriseMeetingIntelligenceCollaborationEngine"
  | "aipifyEmployeeGrowthCareerDevelopmentEngine"
  | "aipifyCustomerJourneyExperienceOrchestrationEngine"
  | "aipifyOnboardingAdoptionAccelerationEngine"
  | "aipifyMeetingIntelligenceFollowUpEngine"
  | "aipifyUnifiedWorkspaceEngine"
  | "aipifyGlobalCommandCenterEngine"
  | "aipifyDigitalHeadquartersEngine"
  | "aipifyOrganizationalHealthEarlyWarningEngine"
  | "sharedCourageResponsibleActionEngine"
  | "sharedCompassionReciprocalCareEngine"
  | "businessPacksFoundationEngine"
  | "businessPackIdentityEngine"
  | "businessPackLicenseEngine"
  | "businessPackLanguageEngine"
  | "businessPackLegalEngine"
  | "businessPackKnowledgeEngine"
  | "businessPackMarketplaceEngine"
  | "industryIntelligenceFoundationEngine"
  | "marketplacePartnerEcosystemFoundationEngine"
  | "aiEthicsResponsibleUseEngine"
  | "changeManagementEngine"
  | "valueRealizationEngine"
  | "organizationalResilienceEngine"
  | "securityTrustEngine"
  | "incidentResponseCoordinationEngine"
  | "serviceLevelCommitmentEngine"
  | "stakeholderCommunicationEngine"
  | "organizationalDecisionSupportEngine"
  | "strategicAlignmentEngine"
  | "organizationalHealthEngine"
  | "capabilityMaturityEngine"
  | "organizationalBenchmarkingEngine"
  | "documentOutputEngine"
  | "recordsRetentionManagementEngine"
  | "meetingCollaborationIntelligenceEngine"
  | "unifiedTaskFollowUpEngine"
  | "resourcePlanningEngine"
  | "capacityWorkloadManagementEngine"
  | "goalsOkrEngine"
  | "predictiveInsightsEngine"
  | "crossTenantIntelligenceEngine"
  | "partnerSuccessEngine"
  | "salesExpertEngine"
  | "relationshipIntelligenceEngine"
  | "trustReputationEngine"
  | "aiCostGovernanceEngine"
  | "personalProductivityEngine"
  | "companionOrchestrationEngine"
  | "companionActionApprovalEngine"
  | "companionContextEngine"
  | "companionMemoryExpansionEngine"
  | "companionRecommendationEngine"
  | "companionProactiveInsightsEngine"
  | "companionPersonalizationEngine"
  | "companionDailyBriefingCenter"
  | "companionWorkPrioritizationEngine"
  | "companionFollowUpEngine"
  | "companionRelationshipIntelligenceEngine"
  | "companionExecutiveLayer"
  | "companionActionMemoryEngine"
  | "presenceContinuityEngine"
  | "companionIdentityRelationshipEngine"
  | "lifeEventsEngine"
  | "trustAdoptionEngine"
  | "proactiveCompanionEngine"
  | "companionDeviceEcosystemEngine"
  | "selfLoveEngine"
  | "growthEvolutionEngine"
  | "priorityFocusEngine"
  | "purposeValuesEngine"
  | "inclusionHumanityEngine"
  | "companionIdentityEngine"
  | "abosImpactEngine"
  | "socialImpactPurposeEngine"
  | "wonderEngine"
  | "legacyEngine"
  | "curiosityDiscoveryEngine"
  | "gratitudeRecognitionEngine"
  | "presenceComfortProtocol"
  | "dedicationEngine"
  | "hopeEngine"
  | "wisdomEngine"
  | "wisdomInterventionProtocol"
  | "briefing"
  | "organizationalIdentityCenterEngine"
  | "organizationalPresenceCenterEngine"
  | "organizationalBalanceCenterEngine"
  | "organizationalAdaptiveIntelligenceCenterEngine"
  | "organizationalWisdomTransferCenterEngine"
  | "organizationalHopeCenterEngine"
  | "organizationalCourageCenterEngine"
  | "organizationalCuriosityCenterEngine"
  | "organizationalHarmonyCenterEngine"
  | "organizationalAwarenessCenterEngine"
  | "organizationalIntentionalityCenterEngine"
  | "organizationalClarityCenterEngine"
  | "organizationalSteadfastnessCenterEngine"
  | "organizationalCompoundingCenterEngine"
  | "organizationalTransformationCenterEngine"
  | "organizationalSustainabilityCenterEngine"
  | "organizationalRenewalCenterEngine"
  | "organizationalFlourishingCenterEngine"
  | "organizationalConfidenceCenterEngine"
  | "organizationalDecisionQualityCenterEngine"
  | "organizationalImpactCenterEngine"
  | "organizationalExcellenceCenterEngine"
  | "organizationalContinuityCenterEngine"
  | "organizationalCoherenceCenterEngine"
  | "organizationalFuturesCenterEngine"
  | "organizationalMomentumCenterEngine"
  | "organizationalTrustCenterEngine"
  | "organizationalSignalCenterEngine"
  | "organizationalSimplicityCenterEngine"
  | "organizationalStewardshipCenterEngine"
  | "organizationalPurposeCenterEngine"
  | "organizationalLegacyCenterEngine"
  | "organizationalWisdomCenterEngine"
  | "organizationalAdaptabilityCenterEngine"
  | "organizationalEnergyCenterEngine"
  | "organizationalFocusCenterEngine"
  | "organizationalAlignmentCenterEngine"
  | "organizationalPurposefulExecutionCenterEngine"
  | "executionExcellenceCenterEngine"
  | "capabilityMaturityCenterEngine"
  | "organizationalDigitalTwinCenterEngine"
  | "changeManagementCenterEngine"
  | "organizationalHealthCenterEngine"
  | "opportunityDiscoveryCenterEngine"
  | "organizationalResilienceCenterEngine"
  | "continuousImprovementCenterEngine"
  | "executiveStrategicIntelligenceEngine"
  | "executiveDecisionSupportEngine"
  | "executive"
  | "presence"
  | "assistant"
  | "recommendations"
  | "learning"
  | "skills"
  | "companionActionMarketplaceEngine"
  | "marketplace"
  | "industryBlueprints"
  | "globalLearning"
  | "evolution"
  | "valueEngine"
  | "outcomesEngine"
  | "agents"
  | "appEcosystem"
  | "trustEngine"
  | "digitalTwin"
  | "simulationLab"
  | "operationsCenter"
  | "continuityEngine"
  | "strategyEngine"
  | "humanSuccessEngine"
  | "customerLifecycleEngine"
  | "platformIntegrityEngine"
  | "ecosystemIntelligenceEngine"
  | "ecosystemOrchestrationEngine"
  | "communityIntelligenceEngine"
  | "marketplaceGovernanceEngine"
  | "partnerCertificationEngine"
  | "growthPartnerOperationsEngine"
  | "growthPartnerAcademy"
  | "growthPartnerMarketing"
  | "growthPartnerResourceCenter"
  | "growthPartnerBusinessPlanning"
  | "ecosystemGovernanceEngine"
  | "commercialModelEngine"
  | "academyEngine"
  | "globalExpansionEngine"
  | "innovationLabEngine"
  | "futureTechEngine"
  | "constitutionEngine"
  | "manifestoEngine"
  | "platformInstallEngine"
  | "companionMarketplaceEngine"
  | "commerceCompanionEngine"
  | "commerceIntelligenceEngine"
  | "productAutomationEngine"
  | "dropshippingOperationsEngine"
  | "commercePerformanceEngine"
  | "multiStoreOrchestrationEngine"
  | "globalCommerceExpansionEngine"
  | "supplierIntelligenceEngine"
  | "personalityEngine"
  | "workstyleEngine"
  | "approvals"
  | "actionCenter"
  | "businessPulse"
  | "strategicGoals"
  | "frictionIntelligence"
  | "organizationalMemory"
  | "organizationalIntelligence"
  | "predictiveIntelligence"
  | "incidentCommandCenterEngine"
  | "platformObservabilityCenterEngine"
  | "deploymentGovernanceCenterEngine"
  | "databaseGovernanceCenterEngine"
  | "automationControlCenterEngine"
  | "adaptiveAutomation"
  | "financialGuardrailsEngine"
  | "trustTransparencyEngine"
  | "permissionAccessGovernanceEngine"
  | "approvalHumanOversightEngine"
  | "approvalProfilesEngine"
  | "governance"
  | "enterprise"
  | "quality"
  | "knowledgeEvolutionCenterEngine"
  | "organizationalLearningCenterEngine"
  | "organizationalMemoryCenterEngine"
  | "knowledgeCenter"
  | "installations"
  | "domains"
  | "team"
  | "license"
  | "security"
  | "orchestration"
  | "settings";

export type AppNavItem = {
  id: AppNavId;
  href: string;
  labelKey: string;
};

/** Canonical Customer App 1.0 navigation (Phase 28). */
export const APP_NAV: AppNavItem[] = [
  { id: "overview", href: "/app", labelKey: "customerApp.nav.overview" },
  { id: "workspaceProductivityHub", href: "/app/workspace", labelKey: "customerApp.nav.workspaceProductivityHub" },
  { id: "aipifyCorePlatformEngine", href: "/app/aipify-core", labelKey: "customerApp.nav.aipifyCorePlatformEngine" },
  { id: "multiTenantArchitectureEngine", href: "/app/multi-tenant", labelKey: "customerApp.nav.multiTenantArchitectureEngine" },
  {
    id: "organizationWorkspaceEngine",
    href: "/app/organization-workspace-engine",
    labelKey: "customerApp.nav.organizationWorkspaceEngine",
  },
  {
    id: "enterpriseOrganizationEngine",
    href: "/app/organizations",
    labelKey: "customerApp.nav.enterpriseOrganizationEngine",
  },
  {
    id: "contextIntelligenceEngine",
    href: "/app/context-intelligence-engine",
    labelKey: "customerApp.nav.contextIntelligenceEngine",
  },
  { id: "identityPermissionsEngine", href: "/app/identity-access", labelKey: "customerApp.nav.identityPermissionsEngine" },
  { id: "secureAiActionEngine", href: "/app/secure-ai-actions", labelKey: "customerApp.nav.secureAiActionEngine" },
  { id: "auditAccountabilityEngine", href: "/app/audit-accountability", labelKey: "customerApp.nav.auditAccountabilityEngine" },
  { id: "knowledgeCenterEngine", href: "/app/knowledge-center-engine", labelKey: "customerApp.nav.knowledgeCenterEngine" },
  { id: "adminAssistantEngine", href: "/app/admin-assistant-engine", labelKey: "customerApp.nav.adminAssistantEngine" },
  { id: "supportAiEngine", href: "/app/support-ai-engine", labelKey: "customerApp.nav.supportAiEngine" },
  { id: "integrationEngine", href: "/app/integration-engine", labelKey: "customerApp.nav.integrationEngine" },
  { id: "apiPlatformEngine", href: "/app/api-platform-engine", labelKey: "customerApp.nav.apiPlatformEngine" },
  { id: "operationsDashboardEngine", href: "/app/operations-dashboard-engine", labelKey: "customerApp.nav.operationsDashboardEngine" },
  { id: "customerOnboardingEngine", href: "/app/customer-onboarding-engine", labelKey: "customerApp.nav.customerOnboardingEngine" },
  {
    id: "subscriptionPlanManagementEngine",
    href: "/app/subscription-plan-management-engine",
    labelKey: "customerApp.nav.subscriptionPlanManagementEngine",
  },
  { id: "selfSupportEngine", href: "/app/self-support-engine", labelKey: "customerApp.nav.selfSupportEngine" },
  { id: "qualityGuardianEngine", href: "/app/quality-guardian-engine", labelKey: "customerApp.nav.qualityGuardianEngine" },
  { id: "aipifyModeration", href: "/app/aipify-moderation", labelKey: "customerApp.nav.aipifyModeration" },
  { id: "governancePolicyEngine", href: "/app/governance-policy-engine", labelKey: "customerApp.nav.governancePolicyEngine" },
  {
    id: "unonightPilotOperationsEngine",
    href: "/app/unonight-pilot-operations-engine",
    labelKey: "customerApp.nav.unonightPilotOperationsEngine",
  },
  { id: "analyticsInsightsEngine", href: "/app/analytics-insights-engine", labelKey: "customerApp.nav.analyticsInsightsEngine" },
  {
    id: "notificationCommunicationEngine",
    href: "/app/notification-communication-engine",
    labelKey: "customerApp.nav.notificationCommunicationEngine",
  },
  {
    id: "deploymentEnvironmentManagementEngine",
    href: "/app/deployment-environment-management-engine",
    labelKey: "customerApp.nav.deploymentEnvironmentManagementEngine",
  },
  {
    id: "observabilityPlatformHealthEngine",
    href: "/app/observability-platform-health-engine",
    labelKey: "customerApp.nav.observabilityPlatformHealthEngine",
  },
  {
    id: "aipifyInstallEngine",
    href: "/app/aipify-install-engine",
    labelKey: "customerApp.nav.aipifyInstallEngine",
  },
  {
    id: "moduleMarketplaceFoundationEngine",
    href: "/app/module-marketplace-foundation-engine",
    labelKey: "customerApp.nav.moduleMarketplaceFoundationEngine",
  },
  {
    id: "aipifyInternalOperationsEngine",
    href: "/app/aipify-internal-operations-engine",
    labelKey: "customerApp.nav.aipifyInternalOperationsEngine",
  },
  {
    id: "launchReadinessEngine",
    href: "/app/launch-readiness-engine",
    labelKey: "customerApp.nav.launchReadinessEngine",
  },
  {
    id: "customerSuccessEngine",
    href: "/app/customer-success-engine",
    labelKey: "customerApp.nav.customerSuccessEngine",
  },
  {
    id: "statusTransparencyEngine",
    href: "/app/status-transparency-engine",
    labelKey: "customerApp.nav.statusTransparencyEngine",
  },
  {
    id: "enterpriseReadinessEngine",
    href: "/app/enterprise-readiness-engine",
    labelKey: "customerApp.nav.enterpriseReadinessEngine",
  },
  {
    id: "enterpriseDeploymentDeviceRolloutEngine",
    href: "/app/enterprise-deployment-device-rollout-engine",
    labelKey: "customerApp.nav.enterpriseDeploymentDeviceRolloutEngine",
  },
  {
    id: "learningTrainingEngine",
    href: "/app/learning-training-engine",
    labelKey: "customerApp.nav.learningTrainingEngine",
  },
  {
    id: "aipifyUniversityEngine",
    href: "/app/aipify-university",
    labelKey: "customerApp.nav.aipifyUniversityEngine",
  },
  {
    id: "certificationAchievementEngine",
    href: "/app/certification-achievement-engine",
    labelKey: "customerApp.nav.certificationAchievementEngine",
  },
  {
    id: "innovationImpactEngine",
    href: "/app/innovation-impact-engine",
    labelKey: "customerApp.nav.innovationImpactEngine",
  },
  {
    id: "complianceRegulatoryReadinessEngine",
    href: "/app/compliance-regulatory-readiness-engine",
    labelKey: "customerApp.nav.complianceRegulatoryReadinessEngine",
  },
  {
    id: "strategicIntelligenceFoundationEngine",
    href: "/app/strategic-intelligence-foundation-engine",
    labelKey: "customerApp.nav.strategicIntelligenceFoundationEngine",
  },
  {
    id: "strategicForesightEngine",
    href: "/app/strategic-foresight-engine",
    labelKey: "customerApp.nav.strategicForesightEngine",
  },
  {
    id: "decisionIntelligenceEngine",
    href: "/app/decision-intelligence-engine",
    labelKey: "customerApp.nav.decisionIntelligenceEngine",
  },
  {
    id: "collectiveDecisionCouncilEngine",
    href: "/app/collective-decision-council-engine",
    labelKey: "customerApp.nav.collectiveDecisionCouncilEngine",
  },
  {
    id: "organizationalWisdomEngine",
    href: "/app/organizational-wisdom-engine",
    labelKey: "customerApp.nav.organizationalWisdomEngine",
  },
  {
    id: "operationsCenterFoundationEngine",
    href: "/app/operations-center-foundation-engine",
    labelKey: "customerApp.nav.operationsCenterFoundationEngine",
  },
  {
    id: "continuousImprovementEngine",
    href: "/app/continuous-improvement-engine",
    labelKey: "customerApp.nav.continuousImprovementEngine",
  },
  {
    id: "workflowOrchestrationEngine",
    href: "/app/workflow-orchestration-engine",
    labelKey: "customerApp.nav.workflowOrchestrationEngine",
  },
  {
    id: "humanOversightEngine",
    href: "/app/human-oversight-engine",
    labelKey: "customerApp.nav.humanOversightEngine",
  },
  {
    id: "proactiveOrganizationEngine",
    href: "/app/proactive-organization-engine",
    labelKey: "customerApp.nav.proactiveOrganizationEngine",
  },
  {
    id: "humanPotentialAugmentedWorkEngine",
    href: "/app/human-potential-augmented-work-engine",
    labelKey: "customerApp.nav.humanPotentialAugmentedWorkEngine",
  },
  {
    id: "augmentedOrganizationEngine",
    href: "/app/augmented-organization-engine",
    labelKey: "customerApp.nav.augmentedOrganizationEngine",
  },
  {
    id: "globalKnowledgeExchangeEngine",
    href: "/app/global-knowledge-exchange-engine",
    labelKey: "customerApp.nav.globalKnowledgeExchangeEngine",
  },
  {
    id: "jointOperationsEngine",
    href: "/app/joint-operations-engine",
    labelKey: "customerApp.nav.jointOperationsEngine",
  },
  {
    id: "globalGovernanceDiplomacyEngine",
    href: "/app/global-governance-diplomacy-engine",
    labelKey: "customerApp.nav.globalGovernanceDiplomacyEngine",
  },
  {
    id: "globalTalentExpertNetworkEngine",
    href: "/app/global-talent-expert-network-engine",
    labelKey: "customerApp.nav.globalTalentExpertNetworkEngine",
  },
  {
    id: "globalEcosystemMarketplaceEngine",
    href: "/app/global-ecosystem-marketplace-engine",
    labelKey: "customerApp.nav.globalEcosystemMarketplaceEngine",
  },
  {
    id: "globalStewardshipCollectiveFutureEngine",
    href: "/app/global-stewardship-collective-future-engine",
    labelKey: "customerApp.nav.globalStewardshipCollectiveFutureEngine",
  },
  {
    id: "futureLeadersEngine",
    href: "/app/future-leaders-engine",
    labelKey: "customerApp.nav.futureLeadersEngine",
  },
  {
    id: "organizationalSensemakingEngine",
    href: "/app/organizational-sensemaking-engine",
    labelKey: "customerApp.nav.organizationalSensemakingEngine",
  },
  {
    id: "livingEnterpriseEngine",
    href: "/app/living-enterprise-engine",
    labelKey: "customerApp.nav.livingEnterpriseEngine",
  },
  {
    id: "civicCollaborationEngine",
    href: "/app/civic-collaboration-engine",
    labelKey: "customerApp.nav.civicCollaborationEngine",
  },
  {
    id: "crossSectorIntelligenceEngine",
    href: "/app/cross-sector-intelligence-engine",
    labelKey: "customerApp.nav.crossSectorIntelligenceEngine",
  },
  {
    id: "civilizationalMemoryEngine",
    href: "/app/civilizational-memory-engine",
    labelKey: "customerApp.nav.civilizationalMemoryEngine",
  },
  {
    id: "civilizationalLearningEngine",
    href: "/app/civilizational-learning-engine",
    labelKey: "customerApp.nav.civilizationalLearningEngine",
  },
  {
    id: "civilizationalForesightEngine",
    href: "/app/civilizational-foresight-engine",
    labelKey: "customerApp.nav.civilizationalForesightEngine",
  },
  {
    id: "civilizationalCoordinationEngine",
    href: "/app/civilizational-coordination-engine",
    labelKey: "customerApp.nav.civilizationalCoordinationEngine",
  },
  {
    id: "sharedProsperityEngine",
    href: "/app/shared-prosperity-engine",
    labelKey: "customerApp.nav.sharedProsperityEngine",
  },
  {
    id: "constructiveDialogueEngine",
    href: "/app/constructive-dialogue-engine",
    labelKey: "customerApp.nav.constructiveDialogueEngine",
  },
  {
    id: "socialCohesionEngine",
    href: "/app/social-cohesion-engine",
    labelKey: "customerApp.nav.socialCohesionEngine",
  },
  {
    id: "humanFlourishingEngine",
    href: "/app/human-flourishing-engine",
    labelKey: "customerApp.nav.humanFlourishingEngine",
  },
  {
    id: "multiGenerationalFuturesEngine",
    href: "/app/multi-generational-futures-engine",
    labelKey: "customerApp.nav.multiGenerationalFuturesEngine",
  },
  {
    id: "intergenerationalGuardianshipEngine",
    href: "/app/intergenerational-guardianship-engine",
    labelKey: "customerApp.nav.intergenerationalGuardianshipEngine",
  },
  {
    id: "humanIdentityMeaningEngine",
    href: "/app/human-identity-meaning-engine",
    labelKey: "customerApp.nav.humanIdentityMeaningEngine",
  },
  {
    id: "humanCreativityImaginationEngine",
    href: "/app/human-creativity-imagination-engine",
    labelKey: "customerApp.nav.humanCreativityImaginationEngine",
  },
  {
    id: "humanWisdomAugmentedJudgmentEngine",
    href: "/app/human-wisdom-augmented-judgment-engine",
    labelKey: "customerApp.nav.humanWisdomAugmentedJudgmentEngine",
  },
  {
    id: "humanAgencyAutonomyEngine",
    href: "/app/human-agency-autonomy-engine",
    labelKey: "customerApp.nav.humanAgencyAutonomyEngine",
  },
  {
    id: "humanDignityHumilityEngine",
    href: "/app/human-dignity-humility-engine",
    labelKey: "customerApp.nav.humanDignityHumilityEngine",
  },
  {
    id: "humanHopePossibilityEngine",
    href: "/app/human-hope-possibility-engine",
    labelKey: "customerApp.nav.humanHopePossibilityEngine",
  },
  {
    id: "humanWonderExplorationEngine",
    href: "/app/human-wonder-exploration-engine",
    labelKey: "customerApp.nav.humanWonderExplorationEngine",
  },
  {
    id: "humanLegacyEternalStewardshipEngine",
    href: "/app/human-legacy-eternal-stewardship-engine",
    labelKey: "customerApp.nav.humanLegacyEternalStewardshipEngine",
  },
  {
    id: "universalStewardshipSharedFuturesEngine",
    href: "/app/universal-stewardship-shared-futures-engine",
    labelKey: "customerApp.nav.universalStewardshipSharedFuturesEngine",
  },
  {
    id: "collectiveWisdomSharedLearningEngine",
    href: "/app/collective-wisdom-shared-learning-engine",
    labelKey: "customerApp.nav.collectiveWisdomSharedLearningEngine",
  },
  {
    id: "sharedPurposeContributionEngine",
    href: "/app/shared-purpose-contribution-engine",
    labelKey: "customerApp.nav.sharedPurposeContributionEngine",
  },
  {
    id: "sharedResilienceAdaptiveCapacityEngine",
    href: "/app/shared-resilience-adaptive-capacity-engine",
    labelKey: "customerApp.nav.sharedResilienceAdaptiveCapacityEngine",
  },
  {
    id: "sharedTrustCooperativeIntelligenceEngine",
    href: "/app/shared-trust-cooperative-intelligence-engine",
    labelKey: "customerApp.nav.sharedTrustCooperativeIntelligenceEngine",
  },
  {
    id: "sharedCompassionReciprocalCareEngine",
    href: "/app/shared-compassion-reciprocal-care-engine",
    labelKey: "customerApp.nav.sharedCompassionReciprocalCareEngine",
  },
  {
    id: "sharedCourageResponsibleActionEngine",
    href: "/app/shared-courage-responsible-action-engine",
    labelKey: "customerApp.nav.sharedCourageResponsibleActionEngine",
  },
  {
    id: "sharedGratitudeAppreciativeStewardshipEngine",
    href: "/app/shared-gratitude-appreciative-stewardship-engine",
    labelKey: "customerApp.nav.sharedGratitudeAppreciativeStewardshipEngine",
  },
  {
    id: "sharedLegacyFlourishingEngine",
    href: "/app/shared-legacy-flourishing-engine",
    labelKey: "customerApp.nav.sharedLegacyFlourishingEngine",
  },
  {
    id: "aipifyConstitutionPerpetualPrinciplesEngine",
    href: "/app/aipify-constitution-perpetual-principles-engine",
    labelKey: "customerApp.nav.aipifyConstitutionPerpetualPrinciplesEngine",
  },
  {
    id: "aipifyEthicalEvolutionResponsibleInnovationEngine",
    href: "/app/aipify-ethical-evolution-responsible-innovation-engine",
    labelKey: "customerApp.nav.aipifyEthicalEvolutionResponsibleInnovationEngine",
  },
  {
    id: "aipifyGuardianshipSuccessionEngine",
    href: "/app/aipify-guardianship-succession-engine",
    labelKey: "customerApp.nav.aipifyGuardianshipSuccessionEngine",
  },
  {
    id: "aipifyLegacyPreservationKnowledgeContinuityEngine",
    href: "/app/aipify-legacy-preservation-knowledge-continuity-engine",
    labelKey: "customerApp.nav.aipifyLegacyPreservationKnowledgeContinuityEngine",
  },
  {
    id: "aipifyPrinciplesEnforcementEngine",
    href: "/app/aipify-principles-enforcement-engine",
    labelKey: "customerApp.nav.aipifyPrinciplesEnforcementEngine",
  },
  {
    id: "aipifyValuesTransmissionCulturalContinuityEngine",
    href: "/app/aipify-values-transmission-cultural-continuity-engine",
    labelKey: "customerApp.nav.aipifyValuesTransmissionCulturalContinuityEngine",
  },
  {
    id: "aipifyDecisionTransparencyEngine",
    href: "/app/aipify-decision-transparency-engine",
    labelKey: "customerApp.nav.aipifyDecisionTransparencyEngine",
  },
  {
    id: "aipifyStrategicAlignmentPrioritizationEngine",
    href: "/app/aipify-strategic-alignment-prioritization-engine",
    labelKey: "customerApp.nav.aipifyStrategicAlignmentPrioritizationEngine",
  },
  {
    id: "aipifyExecutiveOperatingSystemFoundersCockpitEngine",
    href: "/app/aipify-executive-operating-system-founders-cockpit-engine",
    labelKey: "customerApp.nav.aipifyExecutiveOperatingSystemFoundersCockpitEngine",
  },
  {
    id: "aipifyKnowledgeDiscoveryIntelligentSearchEngine",
    href: "/app/aipify-knowledge-discovery-intelligent-search-engine",
    labelKey: "customerApp.nav.aipifyKnowledgeDiscoveryIntelligentSearchEngine",
  },
  {
    id: "aipifyActionCenterExecutionEngine",
    href: "/app/aipify-action-center-execution-engine",
    labelKey: "customerApp.nav.aipifyActionCenterExecutionEngine",
  },
  {
    id: "aipifyEnterpriseCommitmentAccountabilityEngine",
    href: "/app/aipify-enterprise-commitment-accountability-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseCommitmentAccountabilityEngine",
  },
  {
    id: "aipifyOperationsOrchestrationEngine",
    href: "/app/aipify-operations-orchestration-engine",
    labelKey: "customerApp.nav.aipifyOperationsOrchestrationEngine",
  },
  {
    id: "aipifyResourceCapacityWorkloadBalanceEngine",
    href: "/app/aipify-resource-capacity-workload-balance-engine",
    labelKey: "customerApp.nav.aipifyResourceCapacityWorkloadBalanceEngine",
  },
  {
    id: "aipifyDecisionCenterGovernanceEngine",
    href: "/app/aipify-decision-center-governance-engine",
    labelKey: "customerApp.nav.aipifyDecisionCenterGovernanceEngine",
  },
  {
    id: "aipifyOrganizationalRhythmsOperatingCadenceEngine",
    href: "/app/aipify-organizational-rhythms-operating-cadence-engine",
    labelKey: "customerApp.nav.aipifyOrganizationalRhythmsOperatingCadenceEngine",
  },
  {
    id: "continuousImprovementOptimizationEngine",
    href: "/app/aipify-continuous-improvement-optimization-engine",
    labelKey: "customerApp.nav.continuousImprovementOptimizationEngine",
  },
  {
    id: "aipifyInnovationOpportunityDiscoveryEngine",
    href: "/app/aipify-innovation-opportunity-discovery-engine",
    labelKey: "customerApp.nav.aipifyInnovationOpportunityDiscoveryEngine",
  },
  {
    id: "aipifyCustomerSuccessValueRealizationEngine",
    href: "/app/aipify-customer-success-value-realization-engine",
    labelKey: "customerApp.nav.aipifyCustomerSuccessValueRealizationEngine",
  },
  {
    id: "aipifyCustomerJourneyExperienceOrchestrationEngine",
    href: "/app/aipify-customer-journey-experience-orchestration-engine",
    labelKey: "customerApp.nav.aipifyCustomerJourneyExperienceOrchestrationEngine",
  },
  {
    id: "aipifyOnboardingAdoptionAccelerationEngine",
    href: "/app/aipify-onboarding-adoption-acceleration-engine",
    labelKey: "customerApp.nav.aipifyOnboardingAdoptionAccelerationEngine",
  },
  {
    id: "aipifyEnterpriseTrainingCertificationEngine",
    href: "/app/aipify-enterprise-training-certification-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseTrainingCertificationEngine",
  },
  {
    id: "aipifyOrganizationalCommunicationAnnouncementsEngine",
    href: "/app/aipify-organizational-communication-announcements-engine",
    labelKey: "customerApp.nav.aipifyOrganizationalCommunicationAnnouncementsEngine",
  },
  {
    id: "aipifyEmployeeRecognitionCelebrationEngine",
    href: "/app/aipify-employee-recognition-celebration-engine",
    labelKey: "customerApp.nav.aipifyEmployeeRecognitionCelebrationEngine",
  },
  {
    id: "aipifyMentorshipKnowledgeTransferEngine",
    href: "/app/aipify-mentorship-knowledge-transfer-engine",
    labelKey: "customerApp.nav.aipifyMentorshipKnowledgeTransferEngine",
  },
  {
    id: "aipifySuccessionPlanningOrganizationalContinuityEngine",
    href: "/app/aipify-succession-planning-organizational-continuity-engine",
    labelKey: "customerApp.nav.aipifySuccessionPlanningOrganizationalContinuityEngine",
  },
  {
    id: "aipifyOrganizationalHealthWorkforceInsightsEngine",
    href: "/app/aipify-organizational-health-workforce-insights-engine",
    labelKey: "customerApp.nav.aipifyOrganizationalHealthWorkforceInsightsEngine",
  },
  {
    id: "aipifySkillsInternalTalentMarketplaceEngine",
    href: "/app/aipify-skills-internal-talent-marketplace-engine",
    labelKey: "customerApp.nav.aipifySkillsInternalTalentMarketplaceEngine",
  },
  {
    id: "aipifyInnovationIdeaManagementEngine",
    href: "/app/aipify-innovation-idea-management-engine",
    labelKey: "customerApp.nav.aipifyInnovationIdeaManagementEngine",
  },
  {
    id: "aipifyOrganizationalGoalsAlignmentEngine",
    href: "/app/aipify-organizational-goals-alignment-engine",
    labelKey: "customerApp.nav.aipifyOrganizationalGoalsAlignmentEngine",
  },
  {
    id: "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine",
    href: "/app/aipify-enterprise-resource-planning-capacity-intelligence-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine",
  },
  {
    id: "aipifyProjectPortfolioStrategicExecutionEngine",
    href: "/app/aipify-project-portfolio-strategic-execution-engine",
    labelKey: "customerApp.nav.aipifyProjectPortfolioStrategicExecutionEngine",
  },
  {
    id: "aipifyDecisionIntelligenceRecommendationEngine",
    href: "/app/aipify-decision-intelligence-recommendation-engine",
    labelKey: "customerApp.nav.aipifyDecisionIntelligenceRecommendationEngine",
  },
  {
    id: "aipifyEnterpriseActionPrioritizationFocusEngine",
    href: "/app/aipify-enterprise-action-prioritization-focus-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseActionPrioritizationFocusEngine",
  },
  {
    id: "aipifyEnterpriseGovernancePolicyAutomationEngine",
    href: "/app/aipify-enterprise-governance-policy-automation-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseGovernancePolicyAutomationEngine",
  },
  {
    id: "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine",
    href: "/app/aipify-enterprise-knowledge-validation-quality-assurance-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine",
  },
  {
    id: "aipifyEnterpriseExternalIntelligenceMarketAwarenessEngine",
    href: "/app/aipify-enterprise-external-intelligence-market-awareness-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseExternalIntelligenceMarketAwarenessEngine",
  },
  {
    id: "aipifyEnterpriseActionOrchestrationEngine",
    href: "/app/aipify-enterprise-action-orchestration-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseActionOrchestrationEngine",
  },
  {
    id: "aipifyEnterpriseDecisionEscalationGovernanceEngine",
    href: "/app/aipify-enterprise-decision-escalation-governance-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseDecisionEscalationGovernanceEngine",
  },
  {
    id: "aipifyEnterpriseContinuousImprovementEngine",
    href: "/app/aipify-enterprise-continuous-improvement-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseContinuousImprovementEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalMemoryEngine",
    href: "/app/aipify-enterprise-organizational-memory-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOrganizationalMemoryEngine",
  },
  {
    id: "aipifyEnterpriseResilienceBusinessContinuityEngine",
    href: "/app/aipify-enterprise-resilience-business-continuity-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseResilienceBusinessContinuityEngine",
  },
  {
    id: "aipifyEnterpriseTrustRelationshipIntelligenceEngine",
    href: "/app/aipify-enterprise-trust-relationship-intelligence-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseTrustRelationshipIntelligenceEngine",
  },
  {
    id: "aipifyEnterpriseStrategicExecutionEngine",
    href: "/app/aipify-enterprise-strategic-execution-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseStrategicExecutionEngine",
  },
  {
    id: "aipifyEnterpriseOpportunityDiscoveryEngine",
    href: "/app/aipify-enterprise-opportunity-discovery-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOpportunityDiscoveryEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalAdaptabilityEngine",
    href: "/app/aipify-enterprise-organizational-adaptability-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOrganizationalAdaptabilityEngine",
  },
  {
    id: "aipifyEnterpriseAutonomousCoordinationEngine",
    href: "/app/aipify-enterprise-autonomous-coordination-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseAutonomousCoordinationEngine",
  },
  {
    id: "aipifyEnterpriseExecutiveCopilotEngine",
    href: "/app/aipify-enterprise-executive-copilot-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseExecutiveCopilotEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalFocusEngine",
    href: "/app/aipify-enterprise-organizational-focus-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOrganizationalFocusEngine",
  },
  {
    id: "aipifyEnterpriseExecutionConfidenceEngine",
    href: "/app/aipify-enterprise-execution-confidence-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseExecutionConfidenceEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalWisdomEngine",
    href: "/app/aipify-enterprise-organizational-wisdom-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOrganizationalWisdomEngine",
  },
  {
    id: "aipifyEnterpriseLegacyStewardshipEngine",
    href: "/app/aipify-enterprise-legacy-stewardship-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseLegacyStewardshipEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalConsciousnessEngine",
    href: "/app/aipify-enterprise-organizational-consciousness-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOrganizationalConsciousnessEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalEnergyEngine",
    href: "/app/aipify-enterprise-organizational-energy-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOrganizationalEnergyEngine",
  },
  {
    id: "aipifyEnterpriseCollectiveIntelligenceEngine",
    href: "/app/aipify-enterprise-collective-intelligence-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseCollectiveIntelligenceEngine",
  },
  {
    id: "aipifyEnterpriseFutureReadinessEngine",
    href: "/app/aipify-enterprise-future-readiness-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseFutureReadinessEngine",
  },
  {
    id: "aipifyEnterprisePurposeValuesAlignmentEngine",
    href: "/app/aipify-enterprise-purpose-values-alignment-engine",
    labelKey: "customerApp.nav.aipifyEnterprisePurposeValuesAlignmentEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalClarityEngine",
    href: "/app/aipify-enterprise-organizational-clarity-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOrganizationalClarityEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalSimplicityEngine",
    href: "/app/aipify-enterprise-organizational-simplicity-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOrganizationalSimplicityEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalTrustEngine",
    href: "/app/aipify-enterprise-organizational-trust-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOrganizationalTrustEngine",
  },
  {
    id: "aipifyEmployeeGrowthCareerDevelopmentEngine",
    href: "/app/aipify-employee-growth-career-development-engine",
    labelKey: "customerApp.nav.aipifyEmployeeGrowthCareerDevelopmentEngine",
  },
  {
    id: "aipifyWellbeingSustainablePerformanceEngine",
    href: "/app/aipify-wellbeing-sustainable-performance-engine",
    labelKey: "customerApp.nav.aipifyWellbeingSustainablePerformanceEngine",
  },
  {
    id: "aipifyHosts",
    href: "/app/aipify-hosts",
    labelKey: "customerApp.nav.aipifyHosts",
  },
  {
    id: "aipifyTalentAcquisitionWorkforcePlanningEngine",
    href: "/app/aipify-talent-acquisition-workforce-planning-engine",
    labelKey: "customerApp.nav.aipifyTalentAcquisitionWorkforcePlanningEngine",
  },
  {
    id: "aipifyPerformanceGoalAlignmentEngine",
    href: "/app/aipify-performance-goal-alignment-engine",
    labelKey: "customerApp.nav.aipifyPerformanceGoalAlignmentEngine",
  },
  {
    id: "aipifyOrganizationalInsightsExecutiveIntelligenceEngine",
    href: "/app/aipify-organizational-insights-executive-intelligence-engine",
    labelKey: "customerApp.nav.aipifyOrganizationalInsightsExecutiveIntelligenceEngine",
  },
  {
    id: "aipifyCustomerFeedbackVoiceOfTheCustomerEngine",
    href: "/app/aipify-customer-feedback-voice-of-the-customer-engine",
    labelKey: "customerApp.nav.aipifyCustomerFeedbackVoiceOfTheCustomerEngine",
  },
  {
    id: "aipifyEnterprisePolicyComplianceManagementEngine",
    href: "/app/aipify-enterprise-policy-compliance-management-engine",
    labelKey: "customerApp.nav.aipifyEnterprisePolicyComplianceManagementEngine",
  },
  {
    id: "aipifyEnterpriseRiskResilienceEngine",
    href: "/app/aipify-enterprise-risk-resilience-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseRiskResilienceEngine",
  },
  {
    id: "aipifyBusinessContinuityCrisisManagementEngine",
    href: "/app/aipify-business-continuity-crisis-management-engine",
    labelKey: "customerApp.nav.aipifyBusinessContinuityCrisisManagementEngine",
  },
  {
    id: "aipifyVendorThirdPartyRelationshipEngine",
    href: "/app/aipify-vendor-third-party-relationship-engine",
    labelKey: "customerApp.nav.aipifyVendorThirdPartyRelationshipEngine",
  },
  {
    id: "aipifyStudioCreativeIntelligenceEngine",
    href: "/app/aipify-studio-creative-intelligence-engine",
    labelKey: "customerApp.nav.aipifyStudioCreativeIntelligenceEngine",
  },
  {
    id: "aipifyDocumentIntelligenceEnterpriseDocumentEngine",
    href: "/app/aipify-document-intelligence-enterprise-document-engine",
    labelKey: "customerApp.nav.aipifyDocumentIntelligenceEnterpriseDocumentEngine",
  },
  {
    id: "aipifyEnterpriseWorkflowAutomationEngine",
    href: "/app/aipify-enterprise-workflow-automation-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseWorkflowAutomationEngine",
  },
  {
    id: "aipifyEnterpriseIntegrationHubEngine",
    href: "/app/aipify-enterprise-integration-hub-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseIntegrationHubEngine",
  },
  {
    id: "aipifyEnterpriseNotificationAttentionManagementEngine",
    href: "/app/aipify-enterprise-notification-attention-management-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseNotificationAttentionManagementEngine",
  },
  {
    id: "aipifyEnterpriseSearchUniversalKnowledgeAccessEngine",
    href: "/app/aipify-enterprise-search-universal-knowledge-access-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseSearchUniversalKnowledgeAccessEngine",
  },
  {
    id: "aipifyEnterpriseAnalyticsOperationalIntelligenceEngine",
    href: "/app/aipify-enterprise-analytics-operational-intelligence-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseAnalyticsOperationalIntelligenceEngine",
  },
  {
    id: "aipifyDesktopCompanionCreativeBridgeEngine",
    href: "/app/aipify-desktop-companion-creative-bridge-engine",
    labelKey: "customerApp.nav.aipifyDesktopCompanionCreativeBridgeEngine",
  },
  {
    id: "aipifyEnterpriseCalendarPersonalAssistantEngine",
    href: "/app/aipify-enterprise-calendar-personal-assistant-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseCalendarPersonalAssistantEngine",
  },
  {
    id: "aipifyTranslateMultilingualWorkforceEngine",
    href: "/app/aipify-translate-multilingual-workforce-engine",
    labelKey: "customerApp.nav.aipifyTranslateMultilingualWorkforceEngine",
  },
  {
    id: "aipifyEnterpriseOnboardingGuidedAdoptionEngine",
    href: "/app/aipify-enterprise-onboarding-guided-adoption-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseOnboardingGuidedAdoptionEngine",
  },
  {
    id: "aipifyEnterpriseMeetingIntelligenceCollaborationEngine",
    href: "/app/aipify-enterprise-meeting-intelligence-collaboration-engine",
    labelKey: "customerApp.nav.aipifyEnterpriseMeetingIntelligenceCollaborationEngine",
  },
  {
    id: "aipifyMeetingIntelligenceFollowUpEngine",
    href: "/app/aipify-meeting-intelligence-follow-up-engine",
    labelKey: "customerApp.nav.aipifyMeetingIntelligenceFollowUpEngine",
  },
  {
    id: "aipifyUnifiedWorkspaceEngine",
    href: "/app/aipify-unified-workspace-engine",
    labelKey: "customerApp.nav.aipifyUnifiedWorkspaceEngine",
  },
  {
    id: "aipifyGlobalCommandCenterEngine",
    href: "/app/aipify-global-command-center-engine",
    labelKey: "customerApp.nav.aipifyGlobalCommandCenterEngine",
  },
  {
    id: "aipifyDigitalHeadquartersEngine",
    href: "/app/aipify-digital-headquarters-engine",
    labelKey: "customerApp.nav.aipifyDigitalHeadquartersEngine",
  },
  {
    id: "aipifyOrganizationalHealthEarlyWarningEngine",
    href: "/app/aipify-organizational-health-early-warning-engine",
    labelKey: "customerApp.nav.aipifyOrganizationalHealthEarlyWarningEngine",
  },
  {
    id: "businessPacksFoundationEngine",
    href: "/app/business-packs-foundation-engine",
    labelKey: "customerApp.nav.businessPacksFoundationEngine",
  },
  {
    id: "businessPackIdentityEngine",
    href: "/app/business-pack-identity-engine",
    labelKey: "customerApp.nav.businessPackIdentityEngine",
  },
  {
    id: "businessPackLicenseEngine",
    href: "/app/business-pack-license-engine",
    labelKey: "customerApp.nav.businessPackLicenseEngine",
  },
  {
    id: "businessPackLanguageEngine",
    href: "/app/business-pack-language-engine",
    labelKey: "customerApp.nav.businessPackLanguageEngine",
  },
  {
    id: "businessPackLegalEngine",
    href: "/app/business-pack-legal-engine",
    labelKey: "customerApp.nav.businessPackLegalEngine",
  },
  {
    id: "businessPackKnowledgeEngine",
    href: "/app/business-pack-knowledge-engine",
    labelKey: "customerApp.nav.businessPackKnowledgeEngine",
  },
  {
    id: "businessPackMarketplaceEngine",
    href: "/app/business-pack-marketplace-engine",
    labelKey: "customerApp.nav.businessPackMarketplaceEngine",
  },
  {
    id: "industryIntelligenceFoundationEngine",
    href: "/app/industry-intelligence-foundation-engine",
    labelKey: "customerApp.nav.industryIntelligenceFoundationEngine",
  },
  {
    id: "marketplacePartnerEcosystemFoundationEngine",
    href: "/app/marketplace-partner-ecosystem-foundation-engine",
    labelKey: "customerApp.nav.marketplacePartnerEcosystemFoundationEngine",
  },
  {
    id: "salesExpertEngine",
    href: "/app/sales-expert-engine",
    labelKey: "customerApp.nav.salesExpertEngine",
  },
  {
    id: "aiEthicsResponsibleUseEngine",
    href: "/app/ai-ethics-responsible-use-engine",
    labelKey: "customerApp.nav.aiEthicsResponsibleUseEngine",
  },
  {
    id: "changeManagementEngine",
    href: "/app/change-management-engine",
    labelKey: "customerApp.nav.changeManagementEngine",
  },
  {
    id: "valueRealizationEngine",
    href: "/app/value-realization-engine",
    labelKey: "customerApp.nav.valueRealizationEngine",
  },
  {
    id: "organizationalResilienceEngine",
    href: "/app/organizational-resilience-engine",
    labelKey: "customerApp.nav.organizationalResilienceEngine",
  },
  {
    id: "securityTrustEngine",
    href: "/app/security-trust-engine",
    labelKey: "customerApp.nav.securityTrustEngine",
  },
  {
    id: "incidentResponseCoordinationEngine",
    href: "/app/incident-response-coordination-engine",
    labelKey: "customerApp.nav.incidentResponseCoordinationEngine",
  },
  {
    id: "serviceLevelCommitmentEngine",
    href: "/app/service-level-commitment-engine",
    labelKey: "customerApp.nav.serviceLevelCommitmentEngine",
  },
  {
    id: "stakeholderCommunicationEngine",
    href: "/app/stakeholder-communication-engine",
    labelKey: "customerApp.nav.stakeholderCommunicationEngine",
  },
  {
    id: "organizationalDecisionSupportEngine",
    href: "/app/organizational-decision-support-engine",
    labelKey: "customerApp.nav.organizationalDecisionSupportEngine",
  },
  {
    id: "strategicAlignmentEngine",
    href: "/app/strategic-alignment-engine",
    labelKey: "customerApp.nav.strategicAlignmentEngine",
  },
  {
    id: "organizationalHealthEngine",
    href: "/app/organizational-health-engine",
    labelKey: "customerApp.nav.organizationalHealthEngine",
  },
  {
    id: "capabilityMaturityEngine",
    href: "/app/capability-maturity-engine",
    labelKey: "customerApp.nav.capabilityMaturityEngine",
  },
  {
    id: "organizationalBenchmarkingEngine",
    href: "/app/organizational-benchmarking-engine",
    labelKey: "customerApp.nav.organizationalBenchmarkingEngine",
  },
  {
    id: "documentOutputEngine",
    href: "/app/document-output-engine",
    labelKey: "customerApp.nav.documentOutputEngine",
  },
  {
    id: "recordsRetentionManagementEngine",
    href: "/app/records-retention-management-engine",
    labelKey: "customerApp.nav.recordsRetentionManagementEngine",
  },
  {
    id: "meetingCollaborationIntelligenceEngine",
    href: "/app/meeting-collaboration-intelligence-engine",
    labelKey: "customerApp.nav.meetingCollaborationIntelligenceEngine",
  },
  {
    id: "unifiedTaskFollowUpEngine",
    href: "/app/unified-task-follow-up-engine",
    labelKey: "customerApp.nav.unifiedTaskFollowUpEngine",
  },
  {
    id: "resourcePlanningEngine",
    href: "/app/resource-planning-engine",
    labelKey: "customerApp.nav.resourcePlanningEngine",
  },
  {
    id: "capacityWorkloadManagementEngine",
    href: "/app/capacity-workload-management-engine",
    labelKey: "customerApp.nav.capacityWorkloadManagementEngine",
  },
  {
    id: "goalsOkrEngine",
    href: "/app/goals-okr-engine",
    labelKey: "customerApp.nav.goalsOkrEngine",
  },
  {
    id: "predictiveInsightsEngine",
    href: "/app/predictive-insights-engine",
    labelKey: "customerApp.nav.predictiveInsightsEngine",
  },
  {
    id: "crossTenantIntelligenceEngine",
    href: "/app/cross-tenant-intelligence-engine",
    labelKey: "customerApp.nav.crossTenantIntelligenceEngine",
  },
  {
    id: "partnerSuccessEngine",
    href: "/app/partner-success-engine",
    labelKey: "customerApp.nav.partnerSuccessEngine",
  },
  {
    id: "relationshipIntelligenceEngine",
    href: "/app/relationship-intelligence-engine",
    labelKey: "customerApp.nav.relationshipIntelligenceEngine",
  },
  {
    id: "trustReputationEngine",
    href: "/app/trust-reputation-engine",
    labelKey: "customerApp.nav.trustReputationEngine",
  },
  {
    id: "aiCostGovernanceEngine",
    href: "/app/ai-cost-governance-engine",
    labelKey: "customerApp.nav.aiCostGovernanceEngine",
  },
  {
    id: "personalProductivityEngine",
    href: "/app/personal-productivity-engine",
    labelKey: "customerApp.nav.personalProductivityEngine",
  },
  {
    id: "companionContextEngine",
    href: "/app/companion/context",
    labelKey: "customerApp.nav.companionContextEngine",
  },
  {
    id: "companionMemoryExpansionEngine",
    href: "/app/companion/memory",
    labelKey: "customerApp.nav.companionMemoryExpansionEngine",
  },
  {
    id: "companionRecommendationEngine",
    href: "/app/companion/recommendations",
    labelKey: "customerApp.nav.companionRecommendationEngine",
  },
  {
    id: "companionProactiveInsightsEngine",
    href: "/app/companion/proactive-insights",
    labelKey: "customerApp.nav.companionProactiveInsightsEngine",
  },
  {
    id: "companionPersonalizationEngine",
    href: "/app/companion/personalization",
    labelKey: "customerApp.nav.companionPersonalizationEngine",
  },
  {
    id: "companionDailyBriefingCenter",
    href: "/app/companion/daily-briefing",
    labelKey: "customerApp.nav.companionDailyBriefingCenter",
  },
  {
    id: "companionWorkPrioritizationEngine",
    href: "/app/companion/work-prioritization",
    labelKey: "customerApp.nav.companionWorkPrioritizationEngine",
  },
  {
    id: "companionFollowUpEngine",
    href: "/app/companion/follow-ups",
    labelKey: "customerApp.nav.companionFollowUpEngine",
  },
  {
    id: "companionRelationshipIntelligenceEngine",
    href: "/app/companion/relationship-intelligence",
    labelKey: "customerApp.nav.companionRelationshipIntelligenceEngine",
  },
  {
    id: "companionExecutiveLayer",
    href: "/app/companion/executive",
    labelKey: "customerApp.nav.companionExecutiveLayer",
  },
  {
    id: "companionOrchestrationEngine",
    href: "/app/companion/orchestration",
    labelKey: "customerApp.nav.companionOrchestrationEngine",
  },
  {
    id: "companionActionApprovalEngine",
    href: "/app/companion/actions",
    labelKey: "customerApp.nav.companionActionApprovalEngine",
  },
  {
    id: "companionActionMemoryEngine",
    href: "/app/companion/action-memory",
    labelKey: "customerApp.nav.companionActionMemoryEngine",
  },
  {
    id: "presenceContinuityEngine",
    href: "/app/companion/presence-continuity",
    labelKey: "customerApp.nav.presenceContinuityEngine",
  },
  {
    id: "companionIdentityRelationshipEngine",
    href: "/app/companion/identity-relationship",
    labelKey: "customerApp.nav.companionIdentityRelationshipEngine",
  },
  {
    id: "lifeEventsEngine",
    href: "/app/companion/life-events",
    labelKey: "customerApp.nav.lifeEventsEngine",
  },
  {
    id: "trustAdoptionEngine",
    href: "/app/companion/trust-adoption",
    labelKey: "customerApp.nav.trustAdoptionEngine",
  },
  {
    id: "proactiveCompanionEngine",
    href: "/app/proactive-companion-engine",
    labelKey: "customerApp.nav.proactiveCompanionEngine",
  },
  {
    id: "companionDeviceEcosystemEngine",
    href: "/app/companion-device-ecosystem-engine",
    labelKey: "customerApp.nav.companionDeviceEcosystemEngine",
  },
  {
    id: "selfLoveEngine",
    href: "/app/self-love-engine",
    labelKey: "customerApp.nav.selfLoveEngine",
  },
  {
    id: "growthEvolutionEngine",
    href: "/app/growth-evolution-engine",
    labelKey: "customerApp.nav.growthEvolutionEngine",
  },
  {
    id: "priorityFocusEngine",
    href: "/app/priority-focus-engine",
    labelKey: "customerApp.nav.priorityFocusEngine",
  },
  {
    id: "purposeValuesEngine",
    href: "/app/purpose-values-engine",
    labelKey: "customerApp.nav.purposeValuesEngine",
  },
  {
    id: "inclusionHumanityEngine",
    href: "/app/inclusion-humanity-engine",
    labelKey: "customerApp.nav.inclusionHumanityEngine",
  },
  {
    id: "companionIdentityEngine",
    href: "/app/companion-identity-engine",
    labelKey: "customerApp.nav.companionIdentityEngine",
  },
  {
    id: "abosImpactEngine",
    href: "/app/impact-engine",
    labelKey: "customerApp.nav.abosImpactEngine",
  },
  {
    id: "socialImpactPurposeEngine",
    href: "/app/social-impact-purpose-engine",
    labelKey: "customerApp.nav.socialImpactPurposeEngine",
  },
  {
    id: "legacyEngine",
    href: "/app/legacy-engine",
    labelKey: "customerApp.nav.legacyEngine",
  },
  {
    id: "curiosityDiscoveryEngine",
    href: "/app/curiosity-discovery-engine",
    labelKey: "customerApp.nav.curiosityDiscoveryEngine",
  },
  {
    id: "wonderEngine",
    href: "/app/wonder-engine",
    labelKey: "customerApp.nav.wonderEngine",
  },
  {
    id: "gratitudeRecognitionEngine",
    href: "/app/gratitude-recognition-engine",
    labelKey: "customerApp.nav.gratitudeRecognitionEngine",
  },
  {
    id: "presenceComfortProtocol",
    href: "/app/presence-comfort-protocol",
    labelKey: "customerApp.nav.presenceComfortProtocol",
  },
  {
    id: "dedicationEngine",
    href: "/app/dedication-engine",
    labelKey: "customerApp.nav.dedicationEngine",
  },
  {
    id: "hopeEngine",
    href: "/app/hope-engine",
    labelKey: "customerApp.nav.hopeEngine",
  },
  {
    id: "wisdomEngine",
    href: "/app/wisdom-engine",
    labelKey: "customerApp.nav.wisdomEngine",
  },
  {
    id: "wisdomInterventionProtocol",
    href: "/app/wisdom-intervention-protocol",
    labelKey: "customerApp.nav.wisdomInterventionProtocol",
  },
  { id: "briefing", href: "/app/briefing", labelKey: "customerApp.nav.briefing" },
  {
    id: "executiveIntelligenceEngine",
    href: "/app/executive-intelligence",
    labelKey: "customerApp.nav.executiveIntelligenceEngine",
  },
  { id: "organizationalIdentityCenterEngine", href: "/app/executive/organizational-identity", labelKey: "customerApp.nav.organizationalIdentityCenterEngine" },
  { id: "organizationalPresenceCenterEngine", href: "/app/executive/organizational-presence", labelKey: "customerApp.nav.organizationalPresenceCenterEngine" },
  { id: "organizationalBalanceCenterEngine", href: "/app/executive/organizational-balance", labelKey: "customerApp.nav.organizationalBalanceCenterEngine" },
  { id: "organizationalAdaptiveIntelligenceCenterEngine", href: "/app/executive/organizational-adaptive-intelligence", labelKey: "customerApp.nav.organizationalAdaptiveIntelligenceCenterEngine" },
  { id: "organizationalWisdomTransferCenterEngine", href: "/app/executive/organizational-wisdom-transfer", labelKey: "customerApp.nav.organizationalWisdomTransferCenterEngine" },
  { id: "organizationalHopeCenterEngine", href: "/app/executive/organizational-hope", labelKey: "customerApp.nav.organizationalHopeCenterEngine" },
  { id: "organizationalCourageCenterEngine", href: "/app/executive/organizational-courage", labelKey: "customerApp.nav.organizationalCourageCenterEngine" },
  { id: "organizationalCuriosityCenterEngine", href: "/app/executive/organizational-curiosity", labelKey: "customerApp.nav.organizationalCuriosityCenterEngine" },
  { id: "organizationalHarmonyCenterEngine", href: "/app/executive/organizational-harmony", labelKey: "customerApp.nav.organizationalHarmonyCenterEngine" },
  { id: "organizationalAwarenessCenterEngine", href: "/app/executive/organizational-awareness", labelKey: "customerApp.nav.organizationalAwarenessCenterEngine" },
  { id: "organizationalIntentionalityCenterEngine", href: "/app/executive/organizational-intentionality", labelKey: "customerApp.nav.organizationalIntentionalityCenterEngine" },
  { id: "organizationalClarityCenterEngine", href: "/app/executive/organizational-clarity", labelKey: "customerApp.nav.organizationalClarityCenterEngine" },
  { id: "organizationalSteadfastnessCenterEngine", href: "/app/executive/organizational-steadfastness", labelKey: "customerApp.nav.organizationalSteadfastnessCenterEngine" },
  { id: "organizationalCompoundingCenterEngine", href: "/app/executive/organizational-compounding", labelKey: "customerApp.nav.organizationalCompoundingCenterEngine" },
  { id: "organizationalTransformationCenterEngine", href: "/app/executive/organizational-transformation", labelKey: "customerApp.nav.organizationalTransformationCenterEngine" },
  { id: "organizationalSustainabilityCenterEngine", href: "/app/executive/organizational-sustainability", labelKey: "customerApp.nav.organizationalSustainabilityCenterEngine" },
  { id: "organizationalRenewalCenterEngine", href: "/app/executive/organizational-renewal", labelKey: "customerApp.nav.organizationalRenewalCenterEngine" },
  { id: "organizationalFlourishingCenterEngine", href: "/app/executive/organizational-flourishing", labelKey: "customerApp.nav.organizationalFlourishingCenterEngine" },
  { id: "organizationalConfidenceCenterEngine", href: "/app/executive/organizational-confidence", labelKey: "customerApp.nav.organizationalConfidenceCenterEngine" },
  { id: "organizationalDecisionQualityCenterEngine", href: "/app/executive/organizational-decision-quality", labelKey: "customerApp.nav.organizationalDecisionQualityCenterEngine" },
  { id: "organizationalImpactCenterEngine", href: "/app/executive/organizational-impact", labelKey: "customerApp.nav.organizationalImpactCenterEngine" },
  { id: "organizationalExcellenceCenterEngine", href: "/app/executive/organizational-excellence", labelKey: "customerApp.nav.organizationalExcellenceCenterEngine" },
  { id: "organizationalContinuityCenterEngine", href: "/app/executive/organizational-continuity", labelKey: "customerApp.nav.organizationalContinuityCenterEngine" },
  { id: "organizationalCoherenceCenterEngine", href: "/app/executive/organizational-coherence", labelKey: "customerApp.nav.organizationalCoherenceCenterEngine" },
  { id: "organizationalFuturesCenterEngine", href: "/app/executive/organizational-futures", labelKey: "customerApp.nav.organizationalFuturesCenterEngine" },
  { id: "organizationalMomentumCenterEngine", href: "/app/executive/organizational-momentum", labelKey: "customerApp.nav.organizationalMomentumCenterEngine" },
  { id: "organizationalTrustCenterEngine", href: "/app/executive/organizational-trust", labelKey: "customerApp.nav.organizationalTrustCenterEngine" },
  { id: "organizationalSignalCenterEngine", href: "/app/executive/organizational-signals", labelKey: "customerApp.nav.organizationalSignalCenterEngine" },
  { id: "organizationalSimplicityCenterEngine", href: "/app/executive/organizational-simplicity", labelKey: "customerApp.nav.organizationalSimplicityCenterEngine" },
  { id: "organizationalStewardshipCenterEngine", href: "/app/executive/organizational-stewardship", labelKey: "customerApp.nav.organizationalStewardshipCenterEngine" },
  { id: "organizationalPurposeCenterEngine", href: "/app/executive/organizational-purpose", labelKey: "customerApp.nav.organizationalPurposeCenterEngine" },
  { id: "organizationalLegacyCenterEngine", href: "/app/executive/organizational-legacy", labelKey: "customerApp.nav.organizationalLegacyCenterEngine" },
  { id: "organizationalWisdomCenterEngine", href: "/app/executive/organizational-wisdom", labelKey: "customerApp.nav.organizationalWisdomCenterEngine" },
  { id: "organizationalAdaptabilityCenterEngine", href: "/app/executive/organizational-adaptability", labelKey: "customerApp.nav.organizationalAdaptabilityCenterEngine" },
  { id: "organizationalEnergyCenterEngine", href: "/app/executive/organizational-energy", labelKey: "customerApp.nav.organizationalEnergyCenterEngine" },
  { id: "organizationalFocusCenterEngine", href: "/app/executive/organizational-focus", labelKey: "customerApp.nav.organizationalFocusCenterEngine" },
  { id: "organizationalAlignmentCenterEngine", href: "/app/executive/organizational-alignment", labelKey: "customerApp.nav.organizationalAlignmentCenterEngine" },
  { id: "organizationalPurposefulExecutionCenterEngine", href: "/app/executive/purposeful-execution", labelKey: "customerApp.nav.organizationalPurposefulExecutionCenterEngine" },
  { id: "executionExcellenceCenterEngine", href: "/app/executive/execution-excellence", labelKey: "customerApp.nav.executionExcellenceCenterEngine" },
  { id: "capabilityMaturityCenterEngine", href: "/app/executive/capability-maturity", labelKey: "customerApp.nav.capabilityMaturityCenterEngine" },
  { id: "organizationalDigitalTwinCenterEngine", href: "/app/executive/organizational-digital-twin", labelKey: "customerApp.nav.organizationalDigitalTwinCenterEngine" },
  { id: "changeManagementCenterEngine", href: "/app/executive/change-management", labelKey: "customerApp.nav.changeManagementCenterEngine" },
  { id: "organizationalHealthCenterEngine", href: "/app/executive/organizational-health", labelKey: "customerApp.nav.organizationalHealthCenterEngine" },
  { id: "opportunityDiscoveryCenterEngine", href: "/app/executive/opportunity-discovery", labelKey: "customerApp.nav.opportunityDiscoveryCenterEngine" },
  { id: "organizationalResilienceCenterEngine", href: "/app/executive/organizational-resilience", labelKey: "customerApp.nav.organizationalResilienceCenterEngine" },
  { id: "continuousImprovementCenterEngine", href: "/app/executive/continuous-improvement", labelKey: "customerApp.nav.continuousImprovementCenterEngine" },
  { id: "executiveStrategicIntelligenceEngine", href: "/app/executive/strategic-intelligence", labelKey: "customerApp.nav.executiveStrategicIntelligenceEngine" },
  { id: "executiveDecisionSupportEngine", href: "/app/executive/decision-support", labelKey: "customerApp.nav.executiveDecisionSupportEngine" },
  { id: "executive", href: "/app/executive", labelKey: "customerApp.nav.executive" },
  { id: "presence", href: "/app/presence", labelKey: "customerApp.nav.presence" },
  { id: "assistant", href: "/app/assistant", labelKey: "customerApp.nav.assistant" },
  {
    id: "recommendations",
    href: "/app/recommendations",
    labelKey: "customerApp.nav.recommendations",
  },
  { id: "learning", href: "/app/learning", labelKey: "customerApp.nav.learning" },
  { id: "skills", href: "/app/skills", labelKey: "customerApp.nav.skills" },
  {
    id: "companionActionMarketplaceEngine",
    href: "/app/marketplace/companion-actions",
    labelKey: "customerApp.nav.companionActionMarketplaceEngine",
  },
  { id: "marketplace", href: "/app/marketplace", labelKey: "customerApp.nav.marketplace" },
  { id: "companionMarketplaceEngine", href: "/app/companion-marketplace", labelKey: "customerApp.nav.companionMarketplaceEngine" },
  { id: "industryBlueprints", href: "/app/industry-blueprints", labelKey: "customerApp.nav.industryBlueprints" },
  { id: "globalLearning", href: "/app/global-learning", labelKey: "customerApp.nav.globalLearning" },
  { id: "evolution", href: "/app/evolution", labelKey: "customerApp.nav.evolution" },
  { id: "valueEngine", href: "/app/value", labelKey: "customerApp.nav.valueEngine" },
  { id: "outcomesEngine", href: "/app/outcomes", labelKey: "customerApp.nav.outcomesEngine" },
  { id: "agents", href: "/app/agents", labelKey: "customerApp.nav.agents" },
  {
    id: "companionWorkforceEngine",
    href: "/app/companion-workforce-engine",
    labelKey: "customerApp.nav.companionWorkforceEngine",
  },
  { id: "appEcosystem", href: "/app/apps", labelKey: "customerApp.nav.appEcosystem" },
  { id: "trustEngine", href: "/app/trust", labelKey: "customerApp.nav.trustEngine" },
  { id: "digitalTwin", href: "/app/digital-twin", labelKey: "customerApp.nav.digitalTwin" },
  { id: "simulationLab", href: "/app/simulations", labelKey: "customerApp.nav.simulationLab" },
  { id: "operationsCenter", href: "/app/operations", labelKey: "customerApp.nav.operationsCenter" },
  { id: "continuityEngine", href: "/app/continuity", labelKey: "customerApp.nav.continuityEngine" },
  { id: "strategyEngine", href: "/app/strategy", labelKey: "customerApp.nav.strategyEngine" },
  { id: "humanSuccessEngine", href: "/app/human-success", labelKey: "customerApp.nav.humanSuccessEngine" },
  { id: "customerLifecycleEngine", href: "/app/customer-lifecycle", labelKey: "customerApp.nav.customerLifecycleEngine" },
  { id: "platformIntegrityEngine", href: "/app/integrity", labelKey: "customerApp.nav.platformIntegrityEngine" },
  { id: "ecosystemIntelligenceEngine", href: "/app/ecosystem", labelKey: "customerApp.nav.ecosystemIntelligenceEngine" },
  {
    id: "ecosystemOrchestrationEngine",
    href: "/app/ecosystem-orchestration",
    labelKey: "customerApp.nav.ecosystemOrchestrationEngine",
  },
  { id: "communityIntelligenceEngine", href: "/app/community", labelKey: "customerApp.nav.communityIntelligenceEngine" },
  { id: "marketplaceGovernanceEngine", href: "/app/marketplace-governance", labelKey: "customerApp.nav.marketplaceGovernanceEngine" },
  { id: "ecosystemGovernanceEngine", href: "/app/ecosystem-governance", labelKey: "customerApp.nav.ecosystemGovernanceEngine" },
  { id: "partnerCertificationEngine", href: "/app/partners", labelKey: "customerApp.nav.partnerCertificationEngine" },
  { id: "growthPartnerOperationsEngine", href: "/app/growth-partner-operations", labelKey: "customerApp.nav.growthPartnerOperationsEngine" },
  { id: "growthPartnerAcademy", href: "/app/growth-partner/academy", labelKey: "customerApp.nav.growthPartnerAcademy" },
  { id: "growthPartnerMarketing", href: "/app/growth-partner/marketing", labelKey: "customerApp.nav.growthPartnerMarketing" },
  { id: "growthPartnerResourceCenter", href: "/app/growth-partner/resource-center", labelKey: "customerApp.nav.growthPartnerResourceCenter" },
  { id: "growthPartnerBusinessPlanning", href: "/app/growth-partner/business-planning", labelKey: "customerApp.nav.growthPartnerBusinessPlanning" },
  { id: "commercialModelEngine", href: "/app/commercial", labelKey: "customerApp.nav.commercialModelEngine" },
  { id: "academyEngine", href: "/app/academy", labelKey: "customerApp.nav.academyEngine" },
  { id: "globalExpansionEngine", href: "/app/global-expansion", labelKey: "customerApp.nav.globalExpansionEngine" },
  { id: "innovationLabEngine", href: "/app/innovation-lab", labelKey: "customerApp.nav.innovationLabEngine" },
  { id: "futureTechEngine", href: "/app/future-tech", labelKey: "customerApp.nav.futureTechEngine" },
  { id: "constitutionEngine", href: "/app/constitution", labelKey: "customerApp.nav.constitutionEngine" },
  { id: "manifestoEngine", href: "/app/manifesto", labelKey: "customerApp.nav.manifestoEngine" },
  { id: "platformInstallEngine", href: "/app/platform-install", labelKey: "customerApp.nav.platformInstallEngine" },
  { id: "commerceCompanionEngine", href: "/app/commerce-companion", labelKey: "customerApp.nav.commerceCompanionEngine" },
  { id: "commerceIntelligenceEngine", href: "/app/commerce-intelligence", labelKey: "customerApp.nav.commerceIntelligenceEngine" },
  { id: "productAutomationEngine", href: "/app/product-automation", labelKey: "customerApp.nav.productAutomationEngine" },
  { id: "dropshippingOperationsEngine", href: "/app/dropshipping-operations", labelKey: "customerApp.nav.dropshippingOperationsEngine" },
  { id: "commercePerformanceEngine", href: "/app/commerce-performance", labelKey: "customerApp.nav.commercePerformanceEngine" },
  { id: "multiStoreOrchestrationEngine", href: "/app/multi-store", labelKey: "customerApp.nav.multiStoreOrchestrationEngine" },
  { id: "globalCommerceExpansionEngine", href: "/app/global-commerce-expansion", labelKey: "customerApp.nav.globalCommerceExpansionEngine" },
  { id: "supplierIntelligenceEngine", href: "/app/supplier-intelligence", labelKey: "customerApp.nav.supplierIntelligenceEngine" },
  { id: "personalityEngine", href: "/app/personality", labelKey: "customerApp.nav.personalityEngine" },
  { id: "approvals", href: "/app/approvals", labelKey: "customerApp.nav.approvals" },
  { id: "actionCenter", href: "/app/action-center", labelKey: "customerApp.nav.actionCenter" },
  { id: "businessPulse", href: "/app/business-pulse", labelKey: "customerApp.nav.businessPulse" },
  { id: "strategicGoals", href: "/app/goals", labelKey: "customerApp.nav.strategicGoals" },
  { id: "frictionIntelligence", href: "/app/friction", labelKey: "customerApp.nav.frictionIntelligence" },
  { id: "organizationalMemory", href: "/app/memory", labelKey: "customerApp.nav.organizationalMemory" },
  { id: "organizationalIntelligence", href: "/app/insights", labelKey: "customerApp.nav.organizationalIntelligence" },
  { id: "predictiveIntelligence", href: "/app/predictions", labelKey: "customerApp.nav.predictiveIntelligence" },
  {
    id: "incidentCommandCenterEngine",
    href: "/app/operations/incident-command",
    labelKey: "customerApp.nav.incidentCommandCenterEngine",
  },
  {
    id: "platformObservabilityCenterEngine",
    href: "/app/operations/platform-observability",
    labelKey: "customerApp.nav.platformObservabilityCenterEngine",
  },
  {
    id: "deploymentGovernanceCenterEngine",
    href: "/app/operations/deployments",
    labelKey: "customerApp.nav.deploymentGovernanceCenterEngine",
  },
  {
    id: "databaseGovernanceCenterEngine",
    href: "/app/operations/database-governance",
    labelKey: "customerApp.nav.databaseGovernanceCenterEngine",
  },
  {
    id: "automationControlCenterEngine",
    href: "/app/operations/automation-control",
    labelKey: "customerApp.nav.automationControlCenterEngine",
  },
  { id: "adaptiveAutomation", href: "/app/automations", labelKey: "customerApp.nav.adaptiveAutomation" },
  {
    id: "financialGuardrailsEngine",
    href: "/app/governance/financial-guardrails",
    labelKey: "customerApp.nav.financialGuardrailsEngine",
  },
  {
    id: "trustTransparencyEngine",
    href: "/app/governance/trust-transparency",
    labelKey: "customerApp.nav.trustTransparencyEngine",
  },
  {
    id: "permissionAccessGovernanceEngine",
    href: "/app/governance/permissions-access",
    labelKey: "customerApp.nav.permissionAccessGovernanceEngine",
  },
  {
    id: "approvalHumanOversightEngine",
    href: "/app/governance/approval-center",
    labelKey: "customerApp.nav.approvalHumanOversightEngine",
  },
  {
    id: "approvalProfilesEngine",
    href: "/app/governance/approval-profiles",
    labelKey: "customerApp.nav.approvalProfilesEngine",
  },
  { id: "governance", href: "/app/governance", labelKey: "customerApp.nav.governance" },
  { id: "enterprise", href: "/app/enterprise", labelKey: "customerApp.nav.enterprise" },
  { id: "quality", href: "/app/quality", labelKey: "customerApp.nav.quality" },
  { id: "knowledgeEvolutionCenterEngine", href: "/app/knowledge-center/knowledge-evolution", labelKey: "customerApp.nav.knowledgeEvolutionCenterEngine" },
  { id: "organizationalLearningCenterEngine", href: "/app/knowledge-center/organizational-learning", labelKey: "customerApp.nav.organizationalLearningCenterEngine" },
  { id: "organizationalMemoryCenterEngine", href: "/app/knowledge-center/organizational-memory", labelKey: "customerApp.nav.organizationalMemoryCenterEngine" },
  { id: "knowledgeCenter", href: "/app/knowledge-center", labelKey: "customerApp.nav.knowledgeCenter" },
  { id: "installations", href: "/app/installations", labelKey: "customerApp.nav.installations" },
  { id: "domains", href: "/app/domains", labelKey: "customerApp.nav.domains" },
  { id: "team", href: "/app/team", labelKey: "customerApp.nav.team" },
  { id: "license", href: "/app/license", labelKey: "customerApp.nav.license" },
  { id: "security", href: "/app/security", labelKey: "customerApp.nav.security" },
  { id: "orchestration", href: "/app/orchestration", labelKey: "customerApp.nav.orchestration" },
  { id: "settings", href: "/app/settings", labelKey: "customerApp.nav.settings" },
];

export const APP_MOBILE_NAV_IDS: AppNavId[] = [
  "appDashboard" as AppNavId,
  "sinceLastLogin" as AppNavId,
  "teamMembers" as AppNavId,
  "subscription" as AppNavId,
  "knowledgeCenter" as AppNavId,
  "profile" as AppNavId,
];

export function getAppActiveNavId(pathname: string): AppNavId {
  const portalId = getAppPortalActiveNavId(pathname);
  const portalMatch = APP_PORTAL_NAV.find((item) => item.id === portalId);
  if (portalMatch) {
    if (portalMatch.href === "/app" ? pathname === "/app" : pathname.startsWith(portalMatch.href)) {
      return portalId as AppNavId;
    }
  }

  if (pathname === "/app" || pathname === "/dashboard") return "appDashboard" as AppNavId;
  if (pathname.startsWith("/app/workspace")) return "workspaceProductivityHub";
  if (pathname.startsWith("/app/aipify-core")) return "aipifyCorePlatformEngine";
  if (pathname.startsWith("/app/multi-tenant")) return "multiTenantArchitectureEngine";
  if (pathname.startsWith("/app/organization-workspace-engine")) return "organizationWorkspaceEngine";
  if (pathname.startsWith("/app/organizations")) return "enterpriseOrganizationEngine";
  if (pathname.startsWith("/app/context-intelligence-engine")) return "contextIntelligenceEngine";
  if (pathname.startsWith("/app/identity-access")) return "identityPermissionsEngine";
  if (pathname.startsWith("/app/secure-ai-actions")) return "secureAiActionEngine";
  if (pathname.startsWith("/app/audit-accountability")) return "auditAccountabilityEngine";
  if (pathname.startsWith("/app/knowledge-center-engine")) return "knowledgeCenterEngine";
  if (pathname.startsWith("/app/admin-assistant-engine")) return "adminAssistantEngine";
  if (pathname.startsWith("/app/support-ai-engine")) return "supportAiEngine";
  if (pathname.startsWith("/app/integration-engine")) return "integrationEngine";
  if (pathname.startsWith("/app/operations-dashboard-engine")) return "operationsDashboardEngine";
  if (pathname.startsWith("/app/customer-onboarding-engine")) return "customerOnboardingEngine";
  if (pathname.startsWith("/app/subscription-plan-management-engine")) {
    return "subscriptionPlanManagementEngine";
  }
  if (pathname.startsWith("/app/self-support-engine")) return "selfSupportEngine";
  if (pathname.startsWith("/app/quality-guardian-engine")) return "qualityGuardianEngine";
  if (pathname.startsWith("/app/aipify-moderation")) return "aipifyModeration";
  if (pathname.startsWith("/app/governance-policy-engine")) return "governancePolicyEngine";
  if (pathname.startsWith("/app/unonight-pilot-operations-engine")) return "unonightPilotOperationsEngine";
  if (pathname.startsWith("/app/analytics-insights-engine")) return "analyticsInsightsEngine";
  if (pathname.startsWith("/app/notification-communication-engine")) {
    return "notificationCommunicationEngine";
  }
  if (pathname.startsWith("/app/deployment-environment-management-engine")) {
    return "deploymentEnvironmentManagementEngine";
  }
  if (pathname.startsWith("/app/observability-platform-health-engine")) {
    return "observabilityPlatformHealthEngine";
  }
  if (pathname.startsWith("/app/business-pack-language-engine")) {
    return "businessPackLanguageEngine";
  }
  if (pathname.startsWith("/app/business-pack-legal-engine")) {
    return "businessPackLegalEngine";
  }
  if (pathname.startsWith("/app/business-pack-knowledge-engine")) {
    return "businessPackKnowledgeEngine";
  }
  if (pathname.startsWith("/app/business-pack-marketplace-engine")) {
    return "businessPackMarketplaceEngine";
  }
  if (pathname.startsWith("/app/business-pack-license-engine")) {
    return "businessPackLicenseEngine";
  }
  if (pathname.startsWith("/app/business-pack-identity-engine")) {
    return "businessPackIdentityEngine";
  }
  if (pathname.startsWith("/app/business-packs-foundation-engine")) {
    return "businessPacksFoundationEngine";
  }
  if (pathname.startsWith("/app/industry-intelligence-foundation-engine")) {
    return "industryIntelligenceFoundationEngine";
  }
  if (pathname.startsWith("/app/marketplace-partner-ecosystem-foundation-engine")) {
    return "marketplacePartnerEcosystemFoundationEngine";
  }
  if (pathname.startsWith("/app/ai-ethics-responsible-use-engine")) {
    return "aiEthicsResponsibleUseEngine";
  }
  if (pathname.startsWith("/app/change-management-engine")) {
    return "changeManagementEngine";
  }
  if (pathname.startsWith("/app/value-realization-engine")) {
    return "valueRealizationEngine";
  }
  if (pathname.startsWith("/app/organizational-resilience-engine")) {
    return "organizationalResilienceEngine";
  }
  if (pathname.startsWith("/app/security-trust-engine")) {
    return "securityTrustEngine";
  }
  if (pathname.startsWith("/app/incident-response-coordination-engine")) {
    return "incidentResponseCoordinationEngine";
  }
  if (pathname.startsWith("/app/service-level-commitment-engine")) {
    return "serviceLevelCommitmentEngine";
  }
  if (pathname.startsWith("/app/stakeholder-communication-engine")) {
    return "stakeholderCommunicationEngine";
  }
  if (pathname.startsWith("/app/organizational-decision-support-engine")) {
    return "organizationalDecisionSupportEngine";
  }
  if (pathname.startsWith("/app/strategic-alignment-engine")) {
    return "strategicAlignmentEngine";
  }
  if (pathname.startsWith("/app/organizational-health-engine")) {
    return "organizationalHealthEngine";
  }
  if (pathname.startsWith("/app/capability-maturity-engine")) {
    return "capabilityMaturityEngine";
  }
  if (pathname.startsWith("/app/organizational-benchmarking-engine")) {
    return "organizationalBenchmarkingEngine";
  }
  if (pathname.startsWith("/app/document-output-engine")) {
    return "documentOutputEngine";
  }
  if (pathname.startsWith("/app/records-retention-management-engine")) {
    return "recordsRetentionManagementEngine";
  }
  if (pathname.startsWith("/app/meeting-collaboration-intelligence-engine")) {
    return "meetingCollaborationIntelligenceEngine";
  }
  if (pathname.startsWith("/app/unified-task-follow-up-engine")) {
    return "unifiedTaskFollowUpEngine";
  }
  if (pathname.startsWith("/app/resource-planning-engine")) {
    return "resourcePlanningEngine";
  }
  if (pathname.startsWith("/app/capacity-workload-management-engine")) {
    return "capacityWorkloadManagementEngine";
  }
  if (pathname.startsWith("/app/goals-okr-engine")) {
    return "goalsOkrEngine";
  }
  if (pathname.startsWith("/app/predictive-insights-engine")) {
    return "predictiveInsightsEngine";
  }
  if (pathname.startsWith("/app/cross-tenant-intelligence-engine")) {
    return "crossTenantIntelligenceEngine";
  }
  if (pathname.startsWith("/app/partner-success-engine")) {
    return "partnerSuccessEngine";
  }
  if (pathname.startsWith("/app/sales-expert-engine")) {
    return "salesExpertEngine";
  }
  if (pathname.startsWith("/app/relationship-intelligence-engine")) {
    return "relationshipIntelligenceEngine";
  }
  if (pathname.startsWith("/app/trust-reputation-engine")) {
    return "trustReputationEngine";
  }
  if (pathname.startsWith("/app/ai-cost-governance-engine")) {
    return "aiCostGovernanceEngine";
  }
  if (pathname.startsWith("/app/personal-productivity-engine")) {
    return "personalProductivityEngine";
  }
  if (pathname.startsWith("/app/companion/context")) return "companionContextEngine";
  if (pathname.startsWith("/app/companion/memory")) return "companionMemoryExpansionEngine";
  if (pathname.startsWith("/app/companion/recommendations")) return "companionRecommendationEngine";
  if (pathname.startsWith("/app/companion/proactive-insights")) return "companionProactiveInsightsEngine";
  if (pathname.startsWith("/app/companion/personalization")) return "companionPersonalizationEngine";
  if (pathname.startsWith("/app/companion/daily-briefing")) return "companionDailyBriefingCenter";
  if (pathname.startsWith("/app/companion/work-prioritization")) return "companionWorkPrioritizationEngine";
  if (pathname.startsWith("/app/companion/follow-ups")) return "companionFollowUpEngine";
  if (pathname.startsWith("/app/companion/relationship-intelligence")) return "companionRelationshipIntelligenceEngine";
  if (pathname.startsWith("/app/companion/executive")) return "companionExecutiveLayer";
  if (pathname.startsWith("/app/companion/orchestration")) return "companionOrchestrationEngine";
  if (pathname.startsWith("/app/companion/actions")) return "companionActionApprovalEngine";
  if (pathname.startsWith("/app/companion/action-memory")) return "companionActionMemoryEngine";
  if (pathname.startsWith("/app/companion/presence-continuity")) return "presenceContinuityEngine";
  if (pathname.startsWith("/app/companion/identity-relationship")) return "companionIdentityRelationshipEngine";
  if (pathname.startsWith("/app/companion/life-events")) return "lifeEventsEngine";
  if (pathname.startsWith("/app/companion/trust-adoption")) return "trustAdoptionEngine";
  if (pathname.startsWith("/app/proactive-companion-engine")) {
    return "proactiveCompanionEngine";
  }
  if (pathname.startsWith("/app/companion-device-ecosystem-engine")) {
    return "companionDeviceEcosystemEngine";
  }
  if (pathname.startsWith("/app/self-love-engine")) {
    return "selfLoveEngine";
  }
  if (pathname.startsWith("/app/growth-evolution-engine")) {
    return "growthEvolutionEngine";
  }
  if (pathname.startsWith("/app/priority-focus-engine")) {
    return "priorityFocusEngine";
  }
  if (pathname.startsWith("/app/purpose-values-engine")) {
    return "purposeValuesEngine";
  }
  if (pathname.startsWith("/app/inclusion-humanity-engine")) {
    return "inclusionHumanityEngine";
  }
  if (pathname.startsWith("/app/companion-identity-engine")) {
    return "companionIdentityEngine";
  }
  if (pathname.startsWith("/app/impact-engine")) {
    return "abosImpactEngine";
  }
  if (pathname.startsWith("/app/social-impact-purpose-engine")) {
    return "socialImpactPurposeEngine";
  }
  if (pathname.startsWith("/app/legacy-engine")) {
    return "legacyEngine";
  }
  if (pathname.startsWith("/app/curiosity-discovery-engine")) {
    return "curiosityDiscoveryEngine";
  }
  if (pathname.startsWith("/app/wonder-engine")) {
    return "wonderEngine";
  }
  if (pathname.startsWith("/app/gratitude-recognition-engine")) {
    return "gratitudeRecognitionEngine";
  }
  if (pathname.startsWith("/app/presence-comfort-protocol")) {
    return "presenceComfortProtocol";
  }
  if (pathname.startsWith("/app/dedication-engine")) {
    return "dedicationEngine";
  }
  if (pathname.startsWith("/app/hope-engine")) {
    return "hopeEngine";
  }
  if (pathname.startsWith("/app/wisdom-engine")) {
    return "wisdomEngine";
  }
  if (pathname.startsWith("/app/wisdom-intervention-protocol")) {
    return "wisdomInterventionProtocol";
  }
  if (pathname.startsWith("/app/pause-reflection-protocol")) {
    return "wisdomInterventionProtocol";
  }
  if (pathname.startsWith("/app/aipify-install-engine")) return "aipifyInstallEngine";
  if (pathname.startsWith("/app/module-marketplace-foundation-engine")) {
    return "moduleMarketplaceFoundationEngine";
  }
  if (pathname.startsWith("/app/aipify-internal-operations-engine")) {
    return "aipifyInternalOperationsEngine";
  }
  if (pathname.startsWith("/app/launch-readiness-engine")) return "launchReadinessEngine";
  if (pathname.startsWith("/app/customer-success-engine")) return "customerSuccessEngine";
  if (pathname.startsWith("/app/status-transparency-engine")) return "statusTransparencyEngine";
  if (pathname.startsWith("/app/enterprise-readiness-engine")) return "enterpriseReadinessEngine";
  if (pathname.startsWith("/app/enterprise-deployment-device-rollout-engine")) {
    return "enterpriseDeploymentDeviceRolloutEngine";
  }
  if (pathname.startsWith("/app/learning-training-engine")) return "learningTrainingEngine";
  if (pathname.startsWith("/app/aipify-university")) return "aipifyUniversityEngine";
  if (pathname.startsWith("/app/certification-achievement-engine")) return "certificationAchievementEngine";
  if (pathname.startsWith("/app/executive-insights-engine")) return "executiveInsightsEngine";
  if (pathname.startsWith("/app/executive-intelligence")) return "executiveIntelligenceEngine";
  if (pathname.startsWith("/app/innovation-impact-engine")) return "innovationImpactEngine";
  if (pathname.startsWith("/app/compliance-regulatory-readiness-engine")) {
    return "complianceRegulatoryReadinessEngine";
  }
  if (pathname.startsWith("/app/strategic-intelligence-foundation-engine")) {
    return "strategicIntelligenceFoundationEngine";
  }
  if (pathname.startsWith("/app/strategic-foresight-engine")) return "strategicForesightEngine";
  if (pathname.startsWith("/app/decision-intelligence-engine")) return "decisionIntelligenceEngine";
  if (pathname.startsWith("/app/collective-decision-council-engine")) return "collectiveDecisionCouncilEngine";
  if (pathname.startsWith("/app/organizational-wisdom-engine")) return "organizationalWisdomEngine";
  if (pathname.startsWith("/app/operations-center-foundation-engine")) {
    return "operationsCenterFoundationEngine";
  }
  if (pathname.startsWith("/app/continuous-improvement-engine")) return "continuousImprovementEngine";
  if (pathname.startsWith("/app/workflow-orchestration-engine")) return "workflowOrchestrationEngine";
  if (pathname.startsWith("/app/human-oversight-engine")) return "humanOversightEngine";
  if (pathname.startsWith("/app/proactive-organization-engine")) return "proactiveOrganizationEngine";
  if (pathname.startsWith("/app/human-potential-augmented-work-engine")) {
    return "humanPotentialAugmentedWorkEngine";
  }
  if (pathname.startsWith("/app/augmented-organization-engine")) {
    return "augmentedOrganizationEngine";
  }
  if (pathname.startsWith("/app/global-knowledge-exchange-engine")) {
    return "globalKnowledgeExchangeEngine";
  }
  if (pathname.startsWith("/app/joint-operations-engine")) {
    return "jointOperationsEngine";
  }
  if (pathname.startsWith("/app/global-governance-diplomacy-engine")) {
    return "globalGovernanceDiplomacyEngine";
  }
  if (pathname.startsWith("/app/global-talent-expert-network-engine")) {
    return "globalTalentExpertNetworkEngine";
  }
  if (pathname.startsWith("/app/global-ecosystem-marketplace-engine")) {
    return "globalEcosystemMarketplaceEngine";
  }
  if (pathname.startsWith("/app/global-stewardship-collective-future-engine")) {
    return "globalStewardshipCollectiveFutureEngine";
  }
  if (pathname.startsWith("/app/future-leaders-engine")) {
    return "futureLeadersEngine";
  }
  if (pathname.startsWith("/app/organizational-sensemaking-engine")) {
    return "organizationalSensemakingEngine";
  }
  if (pathname.startsWith("/app/living-enterprise-engine")) {
    return "livingEnterpriseEngine";
  }
  if (pathname.startsWith("/app/cross-sector-intelligence-engine")) {
    return "crossSectorIntelligenceEngine";
  }
  if (pathname.startsWith("/app/civic-collaboration-engine")) {
    return "civicCollaborationEngine";
  }
  if (pathname.startsWith("/app/civilizational-foresight-engine")) {
    return "civilizationalForesightEngine";
  }
  if (pathname.startsWith("/app/civilizational-memory-engine")) {
    return "civilizationalMemoryEngine";
  }
  if (pathname.startsWith("/app/civilizational-learning-engine")) {
    return "civilizationalLearningEngine";
  }
  if (pathname.startsWith("/app/civilizational-coordination-engine")) {
    return "civilizationalCoordinationEngine";
  }
  if (pathname.startsWith("/app/shared-prosperity-engine")) {
    return "sharedProsperityEngine";
  }
  if (pathname.startsWith("/app/constructive-dialogue-engine")) {
    return "constructiveDialogueEngine";
  }
  if (pathname.startsWith("/app/social-cohesion-engine")) {
    return "socialCohesionEngine";
  }
  if (pathname.startsWith("/app/human-flourishing-engine")) {
    return "humanFlourishingEngine";
  }
  if (pathname.startsWith("/app/multi-generational-futures-engine")) {
    return "multiGenerationalFuturesEngine";
  }
  if (pathname.startsWith("/app/intergenerational-guardianship-engine")) {
    return "intergenerationalGuardianshipEngine";
  }
  if (pathname.startsWith("/app/human-identity-meaning-engine")) {
    return "humanIdentityMeaningEngine";
  }
  if (pathname.startsWith("/app/human-creativity-imagination-engine")) {
    return "humanCreativityImaginationEngine";
  }
  if (pathname.startsWith("/app/human-wisdom-augmented-judgment-engine")) {
    return "humanWisdomAugmentedJudgmentEngine";
  }
  if (pathname.startsWith("/app/human-agency-autonomy-engine")) {
    return "humanAgencyAutonomyEngine";
  }
  if (pathname.startsWith("/app/human-dignity-humility-engine")) {
    return "humanDignityHumilityEngine";
  }
  if (pathname.startsWith("/app/human-hope-possibility-engine")) {
    return "humanHopePossibilityEngine";
  }
  if (pathname.startsWith("/app/shared-trust-cooperative-intelligence-engine")) {
    return "sharedTrustCooperativeIntelligenceEngine";
  }
  if (pathname.startsWith("/app/shared-resilience-adaptive-capacity-engine")) {
    return "sharedResilienceAdaptiveCapacityEngine";
  }
  if (pathname.startsWith("/app/shared-purpose-contribution-engine")) {
    return "sharedPurposeContributionEngine";
  }
  if (pathname.startsWith("/app/human-wonder-exploration-engine")) {
    return "humanWonderExplorationEngine";
  }
  if (pathname.startsWith("/app/human-legacy-eternal-stewardship-engine")) {
    return "humanLegacyEternalStewardshipEngine";
  }
  if (pathname.startsWith("/app/universal-stewardship-shared-futures-engine")) {
    return "universalStewardshipSharedFuturesEngine";
  }
  if (pathname.startsWith("/app/collective-wisdom-shared-learning-engine")) {
    return "collectiveWisdomSharedLearningEngine";
  }
  if (pathname.startsWith("/app/shared-gratitude-appreciative-stewardship-engine")) {
    return "sharedGratitudeAppreciativeStewardshipEngine";
  }
  if (pathname.startsWith("/app/shared-legacy-flourishing-engine")) {
    return "sharedLegacyFlourishingEngine";
  }
  if (pathname.startsWith("/app/aipify-constitution-perpetual-principles-engine")) {
    return "aipifyConstitutionPerpetualPrinciplesEngine";
  }
  if (pathname.startsWith("/app/aipify-ethical-evolution-responsible-innovation-engine")) {
    return "aipifyEthicalEvolutionResponsibleInnovationEngine";
  }
  if (pathname.startsWith("/app/aipify-guardianship-succession-engine")) {
    return "aipifyGuardianshipSuccessionEngine";
  }
  if (pathname.startsWith("/app/aipify-legacy-preservation-knowledge-continuity-engine")) {
    return "aipifyLegacyPreservationKnowledgeContinuityEngine";
  }
  if (pathname.startsWith("/app/aipify-principles-enforcement-engine")) {
    return "aipifyPrinciplesEnforcementEngine";
  }
  if (pathname.startsWith("/app/aipify-values-transmission-cultural-continuity-engine")) {
    return "aipifyValuesTransmissionCulturalContinuityEngine";
  }
  if (pathname.startsWith("/app/aipify-decision-transparency-engine")) {
    return "aipifyDecisionTransparencyEngine";
  }
  if (pathname.startsWith("/app/aipify-strategic-alignment-prioritization-engine")) {
    return "aipifyStrategicAlignmentPrioritizationEngine";
  }
  if (pathname.startsWith("/app/aipify-executive-operating-system-founders-cockpit-engine")) {
    return "aipifyExecutiveOperatingSystemFoundersCockpitEngine";
  }
  if (pathname.startsWith("/app/aipify-knowledge-discovery-intelligent-search-engine")) {
    return "aipifyKnowledgeDiscoveryIntelligentSearchEngine";
  }
  if (pathname.startsWith("/app/aipify-action-center-execution-engine")) {
    return "aipifyActionCenterExecutionEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-commitment-accountability-engine")) {
    return "aipifyEnterpriseCommitmentAccountabilityEngine";
  }
  if (pathname.startsWith("/app/aipify-operations-orchestration-engine")) {
    return "aipifyOperationsOrchestrationEngine";
  }
  if (pathname.startsWith("/app/aipify-resource-capacity-workload-balance-engine")) {
    return "aipifyResourceCapacityWorkloadBalanceEngine";
  }
  if (pathname.startsWith("/app/aipify-decision-center-governance-engine")) {
    return "aipifyDecisionCenterGovernanceEngine";
  }
  if (pathname.startsWith("/app/aipify-organizational-rhythms-operating-cadence-engine")) {
    return "aipifyOrganizationalRhythmsOperatingCadenceEngine";
  }
  if (pathname.startsWith("/app/aipify-continuous-improvement-optimization-engine")) {
    return "continuousImprovementOptimizationEngine";
  }
  if (pathname.startsWith("/app/aipify-innovation-opportunity-discovery-engine")) {
    return "aipifyInnovationOpportunityDiscoveryEngine";
  }
  if (pathname.startsWith("/app/aipify-customer-success-value-realization-engine")) {
    return "aipifyCustomerSuccessValueRealizationEngine";
  }
  if (pathname.startsWith("/app/aipify-customer-journey-experience-orchestration-engine")) {
    return "aipifyCustomerJourneyExperienceOrchestrationEngine";
  }
  if (pathname.startsWith("/app/aipify-onboarding-adoption-acceleration-engine")) {
    return "aipifyOnboardingAdoptionAccelerationEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-training-certification-engine")) {
    return "aipifyEnterpriseTrainingCertificationEngine";
  }
  if (pathname.startsWith("/app/aipify-organizational-communication-announcements-engine")) {
    return "aipifyOrganizationalCommunicationAnnouncementsEngine";
  }
  if (pathname.startsWith("/app/aipify-employee-recognition-celebration-engine")) {
    return "aipifyEmployeeRecognitionCelebrationEngine";
  }
  if (pathname.startsWith("/app/aipify-mentorship-knowledge-transfer-engine")) {
    return "aipifyMentorshipKnowledgeTransferEngine";
  }
  if (pathname.startsWith("/app/aipify-succession-planning-organizational-continuity-engine")) {
    return "aipifySuccessionPlanningOrganizationalContinuityEngine";
  }
  if (pathname.startsWith("/app/aipify-organizational-health-workforce-insights-engine")) {
    return "aipifyOrganizationalHealthWorkforceInsightsEngine";
  }
  if (pathname.startsWith("/app/aipify-skills-internal-talent-marketplace-engine")) {
    return "aipifySkillsInternalTalentMarketplaceEngine";
  }
  if (pathname.startsWith("/app/aipify-innovation-idea-management-engine")) {
    return "aipifyInnovationIdeaManagementEngine";
  }
  if (pathname.startsWith("/app/aipify-organizational-goals-alignment-engine")) {
    return "aipifyOrganizationalGoalsAlignmentEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-resource-planning-capacity-intelligence-engine")) {
    return "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine";
  }
  if (pathname.startsWith("/app/aipify-project-portfolio-strategic-execution-engine")) {
    return "aipifyProjectPortfolioStrategicExecutionEngine";
  }
  if (pathname.startsWith("/app/aipify-decision-intelligence-recommendation-engine")) {
    return "aipifyDecisionIntelligenceRecommendationEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-action-prioritization-focus-engine")) {
    return "aipifyEnterpriseActionPrioritizationFocusEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-governance-policy-automation-engine")) {
    return "aipifyEnterpriseGovernancePolicyAutomationEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-knowledge-validation-quality-assurance-engine")) {
    return "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-external-intelligence-market-awareness-engine")) {
    return "aipifyEnterpriseExternalIntelligenceMarketAwarenessEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-action-orchestration-engine")) {
    return "aipifyEnterpriseActionOrchestrationEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-decision-escalation-governance-engine")) {
    return "aipifyEnterpriseDecisionEscalationGovernanceEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-continuous-improvement-engine")) {
    return "aipifyEnterpriseContinuousImprovementEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-organizational-memory-engine")) {
    return "aipifyEnterpriseOrganizationalMemoryEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-resilience-business-continuity-engine")) {
    return "aipifyEnterpriseResilienceBusinessContinuityEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-trust-relationship-intelligence-engine")) {
    return "aipifyEnterpriseTrustRelationshipIntelligenceEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-strategic-execution-engine")) {
    return "aipifyEnterpriseStrategicExecutionEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-opportunity-discovery-engine")) {
    return "aipifyEnterpriseOpportunityDiscoveryEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-organizational-adaptability-engine")) {
    return "aipifyEnterpriseOrganizationalAdaptabilityEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-autonomous-coordination-engine")) {
    return "aipifyEnterpriseAutonomousCoordinationEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-executive-copilot-engine")) {
    return "aipifyEnterpriseExecutiveCopilotEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-organizational-focus-engine")) {
    return "aipifyEnterpriseOrganizationalFocusEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-execution-confidence-engine")) {
    return "aipifyEnterpriseExecutionConfidenceEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-organizational-wisdom-engine")) {
    return "aipifyEnterpriseOrganizationalWisdomEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-legacy-stewardship-engine")) {
    return "aipifyEnterpriseLegacyStewardshipEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-organizational-consciousness-engine")) {
    return "aipifyEnterpriseOrganizationalConsciousnessEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-organizational-energy-engine")) {
    return "aipifyEnterpriseOrganizationalEnergyEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-collective-intelligence-engine")) {
    return "aipifyEnterpriseCollectiveIntelligenceEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-future-readiness-engine")) {
    return "aipifyEnterpriseFutureReadinessEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-purpose-values-alignment-engine")) {
    return "aipifyEnterprisePurposeValuesAlignmentEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-organizational-clarity-engine")) {
    return "aipifyEnterpriseOrganizationalClarityEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-organizational-simplicity-engine")) {
    return "aipifyEnterpriseOrganizationalSimplicityEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-organizational-trust-engine")) {
    return "aipifyEnterpriseOrganizationalTrustEngine";
  }
  if (pathname.startsWith("/app/aipify-employee-growth-career-development-engine")) {
    return "aipifyEmployeeGrowthCareerDevelopmentEngine";
  }
  if (pathname.startsWith("/app/aipify-wellbeing-sustainable-performance-engine")) {
    return "aipifyWellbeingSustainablePerformanceEngine";
  }
  if (pathname.startsWith("/app/aipify-hosts")) {
    return "aipifyHosts";
  }
  if (pathname.startsWith("/app/aipify-talent-acquisition-workforce-planning-engine")) {
    return "aipifyTalentAcquisitionWorkforcePlanningEngine";
  }
  if (pathname.startsWith("/app/aipify-performance-goal-alignment-engine")) {
    return "aipifyPerformanceGoalAlignmentEngine";
  }
  if (pathname.startsWith("/app/aipify-organizational-insights-executive-intelligence-engine")) {
    return "aipifyOrganizationalInsightsExecutiveIntelligenceEngine";
  }
  if (pathname.startsWith("/app/aipify-customer-feedback-voice-of-the-customer-engine")) {
    return "aipifyCustomerFeedbackVoiceOfTheCustomerEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-policy-compliance-management-engine")) {
    return "aipifyEnterprisePolicyComplianceManagementEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-risk-resilience-engine")) {
    return "aipifyEnterpriseRiskResilienceEngine";
  }
  if (pathname.startsWith("/app/aipify-business-continuity-crisis-management-engine")) {
    return "aipifyBusinessContinuityCrisisManagementEngine";
  }
  if (pathname.startsWith("/app/aipify-vendor-third-party-relationship-engine")) {
    return "aipifyVendorThirdPartyRelationshipEngine";
  }
  if (pathname.startsWith("/app/aipify-studio-creative-intelligence-engine")) {
    return "aipifyStudioCreativeIntelligenceEngine";
  }
  if (pathname.startsWith("/app/aipify-document-intelligence-enterprise-document-engine")) {
    return "aipifyDocumentIntelligenceEnterpriseDocumentEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-workflow-automation-engine")) {
    return "aipifyEnterpriseWorkflowAutomationEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-integration-hub-engine")) {
    return "aipifyEnterpriseIntegrationHubEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-notification-attention-management-engine")) {
    return "aipifyEnterpriseNotificationAttentionManagementEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-search-universal-knowledge-access-engine")) {
    return "aipifyEnterpriseSearchUniversalKnowledgeAccessEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-analytics-operational-intelligence-engine")) {
    return "aipifyEnterpriseAnalyticsOperationalIntelligenceEngine";
  }
  if (pathname.startsWith("/app/aipify-desktop-companion-creative-bridge-engine")) {
    return "aipifyDesktopCompanionCreativeBridgeEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-calendar-personal-assistant-engine")) {
    return "aipifyEnterpriseCalendarPersonalAssistantEngine";
  }
  if (pathname.startsWith("/app/aipify-translate-multilingual-workforce-engine")) {
    return "aipifyTranslateMultilingualWorkforceEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-onboarding-guided-adoption-engine")) {
    return "aipifyEnterpriseOnboardingGuidedAdoptionEngine";
  }
  if (pathname.startsWith("/app/aipify-enterprise-meeting-intelligence-collaboration-engine")) {
    return "aipifyEnterpriseMeetingIntelligenceCollaborationEngine";
  }
  if (pathname.startsWith("/app/aipify-meeting-intelligence-follow-up-engine")) {
    return "aipifyMeetingIntelligenceFollowUpEngine";
  }
  if (pathname.startsWith("/app/aipify-unified-workspace-engine")) {
    return "aipifyUnifiedWorkspaceEngine";
  }
  if (pathname.startsWith("/app/aipify-global-command-center-engine")) {
    return "aipifyGlobalCommandCenterEngine";
  }
  if (pathname.startsWith("/app/aipify-digital-headquarters-engine")) {
    return "aipifyDigitalHeadquartersEngine";
  }
  if (pathname.startsWith("/app/aipify-organizational-health-early-warning-engine")) {
    return "aipifyOrganizationalHealthEarlyWarningEngine";
  }
  if (pathname.startsWith("/app/shared-courage-responsible-action-engine")) {
    return "sharedCourageResponsibleActionEngine";
  }
  if (pathname.startsWith("/app/shared-compassion-reciprocal-care-engine")) {
    return "sharedCompassionReciprocalCareEngine";
  }
  if (pathname.startsWith("/app/executive/organizational-identity")) return "organizationalIdentityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-presence")) return "organizationalPresenceCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-balance")) return "organizationalBalanceCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-adaptive-intelligence")) return "organizationalAdaptiveIntelligenceCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-wisdom-transfer")) return "organizationalWisdomTransferCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-hope")) return "organizationalHopeCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-courage")) return "organizationalCourageCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-curiosity")) return "organizationalCuriosityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-harmony")) return "organizationalHarmonyCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-awareness")) return "organizationalAwarenessCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-intentionality")) return "organizationalIntentionalityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-clarity")) return "organizationalClarityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-steadfastness")) return "organizationalSteadfastnessCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-compounding")) return "organizationalCompoundingCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-transformation")) return "organizationalTransformationCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-sustainability")) return "organizationalSustainabilityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-renewal")) return "organizationalRenewalCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-flourishing")) return "organizationalFlourishingCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-confidence")) return "organizationalConfidenceCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-decision-quality")) return "organizationalDecisionQualityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-impact")) return "organizationalImpactCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-excellence")) return "organizationalExcellenceCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-continuity")) return "organizationalContinuityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-coherence")) return "organizationalCoherenceCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-futures")) return "organizationalFuturesCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-momentum")) return "organizationalMomentumCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-trust")) return "organizationalTrustCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-signals")) return "organizationalSignalCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-simplicity")) return "organizationalSimplicityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-stewardship")) return "organizationalStewardshipCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-purpose")) return "organizationalPurposeCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-legacy")) return "organizationalLegacyCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-wisdom")) return "organizationalWisdomCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-adaptability")) return "organizationalAdaptabilityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-energy")) return "organizationalEnergyCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-focus")) return "organizationalFocusCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-alignment")) return "organizationalAlignmentCenterEngine";
  if (pathname.startsWith("/app/executive/purposeful-execution")) return "organizationalPurposefulExecutionCenterEngine";
  if (pathname.startsWith("/app/executive/execution-excellence")) return "executionExcellenceCenterEngine";
  if (pathname.startsWith("/app/executive/capability-maturity")) return "capabilityMaturityCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-digital-twin")) return "organizationalDigitalTwinCenterEngine";
  if (pathname.startsWith("/app/executive/change-management")) return "changeManagementCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-health")) return "organizationalHealthCenterEngine";
  if (pathname.startsWith("/app/executive/opportunity-discovery")) return "opportunityDiscoveryCenterEngine";
  if (pathname.startsWith("/app/executive/organizational-resilience")) return "organizationalResilienceCenterEngine";
  if (pathname.startsWith("/app/executive/continuous-improvement")) return "continuousImprovementCenterEngine";
  if (pathname.startsWith("/app/executive/strategic-intelligence")) return "executiveStrategicIntelligenceEngine";
  if (pathname.startsWith("/app/executive/decision-support")) return "executiveDecisionSupportEngine";
  if (pathname.startsWith("/app/executive")) return "executive";
  if (
    pathname.startsWith("/app/presence") ||
    pathname.startsWith("/app/command-center") ||
    pathname.startsWith("/app/desktop")
  ) {
    return "presence";
  }
  if (pathname.startsWith("/app/assistant")) return "assistant";
  if (pathname.startsWith("/app/recommendations")) return "recommendations";
  if (pathname.startsWith("/app/learning")) return "learning";
  if (pathname.startsWith("/app/skills")) return "skills";
  if (pathname.startsWith("/app/companion-marketplace")) return "companionMarketplaceEngine";
  if (pathname.startsWith("/app/marketplace/packs/")) return "marketplace";
  if (pathname.startsWith("/app/marketplace/companion-actions")) return "companionActionMarketplaceEngine";
  if (pathname.startsWith("/app/marketplace")) return "marketplace";
  if (pathname.startsWith("/app/industry-blueprints")) return "industryBlueprints";
  if (pathname.startsWith("/app/global-learning")) return "globalLearning";
  if (pathname.startsWith("/app/evolution")) return "evolution";
  if (pathname.startsWith("/app/value")) return "valueEngine";
  if (pathname.startsWith("/app/outcomes")) return "outcomesEngine";
  if (pathname.startsWith("/app/companion-workforce-engine")) return "companionWorkforceEngine";
  if (pathname.startsWith("/app/agents")) return "agents";
  if (pathname.startsWith("/app/apps")) return "appEcosystem";
  if (pathname.startsWith("/app/trust")) return "trustEngine";
  if (pathname.startsWith("/app/digital-twin")) return "digitalTwin";
  if (pathname.startsWith("/app/simulations")) return "simulationLab";
  if (pathname.startsWith("/app/operations/incident-command")) return "incidentCommandCenterEngine";
  if (pathname.startsWith("/app/operations/platform-observability")) return "platformObservabilityCenterEngine";
  if (pathname.startsWith("/app/operations/deployments")) return "deploymentGovernanceCenterEngine";
  if (pathname.startsWith("/app/operations/database-governance")) return "databaseGovernanceCenterEngine";
  if (pathname.startsWith("/app/operations/automation-control")) return "automationControlCenterEngine";
  if (pathname.startsWith("/app/operations")) return "operationsCenter";
  if (pathname.startsWith("/app/continuity")) return "continuityEngine";
  if (pathname.startsWith("/app/strategy")) return "strategyEngine";
  if (pathname.startsWith("/app/human-success")) return "humanSuccessEngine";
  if (pathname.startsWith("/app/customer-lifecycle")) return "customerLifecycleEngine";
  if (pathname.startsWith("/app/integrity")) return "platformIntegrityEngine";
  if (pathname.startsWith("/app/ecosystem-orchestration")) return "ecosystemOrchestrationEngine";
  if (pathname.startsWith("/app/ecosystem")) return "ecosystemIntelligenceEngine";
  if (pathname.startsWith("/app/community")) return "communityIntelligenceEngine";
  if (pathname.startsWith("/app/marketplace-governance")) return "marketplaceGovernanceEngine";
  if (pathname.startsWith("/app/growth-partner/resource-center")) return "growthPartnerResourceCenter";
  if (pathname.startsWith("/app/growth-partner/marketing")) return "growthPartnerMarketing";
  if (pathname.startsWith("/app/growth-partner/business-planning")) return "growthPartnerBusinessPlanning";
  if (pathname.startsWith("/app/growth-partner/academy")) return "growthPartnerAcademy";
  if (pathname.startsWith("/app/growth-partner-operations")) return "growthPartnerOperationsEngine";
  if (pathname.startsWith("/app/ecosystem-governance")) return "ecosystemGovernanceEngine";
  if (pathname.startsWith("/app/partners")) return "partnerCertificationEngine";
  if (pathname.startsWith("/app/commercial")) return "commercialModelEngine";
  if (pathname.startsWith("/app/academy")) return "academyEngine";
  if (pathname.startsWith("/app/global-expansion")) return "globalExpansionEngine";
  if (pathname.startsWith("/app/innovation-lab")) return "innovationLabEngine";
  if (pathname.startsWith("/app/future-tech")) return "futureTechEngine";
  if (pathname.startsWith("/app/constitution")) return "constitutionEngine";
  if (pathname.startsWith("/app/manifesto")) return "manifestoEngine";
  if (pathname.startsWith("/app/platform-install")) return "platformInstallEngine";
  if (pathname.startsWith("/app/commerce-companion")) return "commerceCompanionEngine";
  if (pathname.startsWith("/app/commerce-intelligence")) return "commerceIntelligenceEngine";
  if (pathname.startsWith("/app/product-automation")) return "productAutomationEngine";
  if (pathname.startsWith("/app/dropshipping-operations")) return "dropshippingOperationsEngine";
  if (pathname.startsWith("/app/commerce-performance")) return "commercePerformanceEngine";
  if (pathname.startsWith("/app/multi-store")) return "multiStoreOrchestrationEngine";
  if (pathname.startsWith("/app/global-commerce-expansion")) return "globalCommerceExpansionEngine";
  if (pathname.startsWith("/app/supplier-intelligence")) return "supplierIntelligenceEngine";
  if (pathname.startsWith("/app/personality")) return "personalityEngine";
  if (pathname.startsWith("/app/approvals")) return "approvals";
  if (pathname.startsWith("/app/action-center") || pathname.startsWith("/app/actions")) {
    return "actionCenter";
  }
  if (pathname.startsWith("/app/business-pulse") || pathname.startsWith("/dashboard/business-pulse")) {
    return "businessPulse";
  }
  if (pathname.startsWith("/app/goals") || pathname.startsWith("/dashboard/goals")) {
    return "strategicGoals";
  }
  if (pathname.startsWith("/app/friction") || pathname.startsWith("/dashboard/friction")) {
    return "frictionIntelligence";
  }
  if (
    pathname.startsWith("/app/memory") ||
    pathname.startsWith("/dashboard/memory")
  ) {
    return "organizationalMemory";
  }
  if (pathname.startsWith("/app/insights") || pathname.startsWith("/app/organization") || pathname.startsWith("/app/workflows")) {
    return "organizationalIntelligence";
  }
  if (pathname.startsWith("/app/predictions")) {
    return "predictiveIntelligence";
  }
  if (
    pathname.startsWith("/app/automations") ||
    pathname.startsWith("/app/automation-library") ||
    pathname.startsWith("/app/automation-executions")
  ) {
    return "adaptiveAutomation";
  }
  if (pathname.startsWith("/app/governance/financial-guardrails")) return "financialGuardrailsEngine";
  if (pathname.startsWith("/app/governance/trust-transparency")) return "trustTransparencyEngine";
  if (pathname.startsWith("/app/governance/permissions-access")) return "permissionAccessGovernanceEngine";
  if (pathname.startsWith("/app/governance/approval-center")) return "approvalHumanOversightEngine";
  if (pathname.startsWith("/app/governance/approval-profiles")) return "approvalProfilesEngine";
  if (pathname.startsWith("/app/governance")) {
    return "governance";
  }
  if (pathname.startsWith("/app/enterprise")) {
    return "enterprise";
  }
  if (pathname.startsWith("/app/quality")) {
    return "quality";
  }
  if (pathname.startsWith("/app/knowledge-center/knowledge-evolution")) return "knowledgeEvolutionCenterEngine";
  if (pathname.startsWith("/app/knowledge-center/organizational-learning")) return "organizationalLearningCenterEngine";
  if (pathname.startsWith("/app/knowledge-center/organizational-memory")) return "organizationalMemoryCenterEngine";
  if (pathname.startsWith("/app/knowledge-center")) {
    return "knowledgeCenter";
  }
  if (
    pathname.startsWith("/app/install") ||
    pathname.startsWith("/app/installations") ||
    pathname.startsWith("/dashboard/installs")
  ) {
    return "installations";
  }
  if (pathname.startsWith("/app/domains")) return "domains";
  if (pathname.startsWith("/app/team") || pathname.startsWith("/dashboard/team")) {
    return "team";
  }
  if (pathname.startsWith("/app/license") || pathname.startsWith("/dashboard/license")) {
    return "license";
  }
  if (pathname.startsWith("/app/settings/two-factor")) return "signInVerification";
  if (pathname.startsWith("/app/settings/security")) return "securityHub";
  if (pathname.startsWith("/app/security")) {
    return "security";
  }
  if (pathname.startsWith("/app/compliance")) {
    return "security";
  }
  if (pathname.startsWith("/app/orchestration")) {
    return "orchestration";
  }
  if (pathname.startsWith("/app/settings/personalization")) return "workstyleEngine";
  if (pathname.startsWith("/app/settings")) return "settings";
  if (pathname.startsWith("/app/welcome")) return "overview";
  return "overview";
}

/** Nav items with hrefs resolved to active routes during /dashboard → /app migration. */
export function getAppNavItemsForShell(): AppNavItem[] {
  return APP_NAV.map((item) => ({
    ...item,
    href: resolveAppHref(item.href),
  }));
}
