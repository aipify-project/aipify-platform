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
  | "industryPackEcosystemEngine"
  | "hospitalityAccommodationPack"
  | "commerceRetailOperationsPack"
  | "realEstatePortfolioOperationsPack"
  | "constructionProjectFieldOperationsPack"
  | "logisticsTransportationFleetOperationsPack"
  | "manufacturingProductionIndustrialOperationsPack"
  | "educationTrainingLearningOperationsPack"
  | "healthcareClinicPatientOperationsPack"
  | "legalComplianceCaseOperationsPack"
  | "professionalServicesConsultingClientDeliveryPack"
  | "digitalEmployeeLifecycleEngine"
  | "digitalEmployeeCenter"
  | "digitalWorkforceRecruitmentEngine"
  | "digitalWorkforceValueEngine"
  | "digitalWorkforceGovernanceEngine"
  | "enterpriseOrganizationalMemoryEngine"
  | "enterpriseStrategicIntelligenceAdvisoryEngine"
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
  | "implementationOnboardingCenter"
  | "subscriptionPlanManagementEngine"
  | "selfSupportEngine"
  | "qualityGuardianEngine"
  | "aipifyModeration"
  | "governancePolicyEngine"
  | "unonightPilotOperationsEngine"
  | "analyticsInsightsEngine"
  | "notificationCommunicationEngine"
  | "deploymentEnvironmentManagementEngine"
  | "globalDeploymentEnterpriseInfrastructureEngine"
  | "observabilityPlatformHealthEngine"
  | "aipifyInstallEngine"
  | "moduleMarketplaceFoundationEngine"
  | "aipifyInternalOperationsEngine"
  | "launchReadinessEngine"
  | "customerSuccessEngine"
  | "customerSuccessAdoptionCenter"
  | "appointmentBookingEngine"
  | "clientRelationshipEngine"
  | "timeAttendance"
  | "compensation"
  | "profitability"
  | "revenueGrowthCenter"
  | "customerExperienceAdoptionDelightEngine"
  | "platformExcellenceEngine"
  | "enterpriseTrustReputationConfidenceEngine"
  | "enterpriseInnovationRdFutureEngine"
  | "enterpriseEcosystemPartnerNetworkEngine"
  | "globalBusinessNetworkEngine"
  | "companionFederationEngine"
  | "companionFutureReadinessEngine"
  | "companionResilienceEngine"
  | "companionProactiveEngine"
  | "companionAutopilotEngine"
  | "companionExecutiveCopilotEngine"
  | "companionHeadquartersEngine"
  | "companionExpertiseEngine"
  | "companionDecisionMemoryEngine"
  | "companionOrganizationalLearningEngine"
  | "companionMaturityEvolutionEngine"
  | "companionMemoryGraphEngine"
  | "companionDigitalTwinSimulationEngine"
  | "companionExecutionOutcomeEngine"
  | "companionWorkflowProcessEngine"
  | "companionResourceCapacityEngine"
  | "enterpriseValueRealizationRoiEngine"
  | "autonomousEnterpriseOperationsEngine"
  | "autonomousOrganizationEngine"
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
  | "corporateBrainEngine"
  | "organizationalConsciousnessEngine"
  | "industryIntelligenceEngine"
  | "economicIntelligenceEngine"
  | "marketIntelligenceEngine"
  | "globalExpansionIntelligenceEngine"
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
  | "companionGovernanceEngine"
  | "companionEcosystemEngine"
  | "companionServicesMarketplace"
  | "companionRealWorldCoordinationEngine"
  | "companionBookingsEngine"
  | "companionExtensionsMarketplaceEngine"
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
  | "companionIdentityCenter"
  | "companionFeedbackCenter"
  | "knowledgeFabricCenter"
  | "aosCenter"
  | "evolutionCenter"
  | "businessContinuityCenter"
  | "absenceCoverage"
  | "companionRelationshipEngine"
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
  | "executiveDigitalBoardMemberEngine"
  | "executiveDecisionSupportEngine"
  | "executive"
  | "presence"
  | "assistant"
  | "recommendations"
  | "learning"
  | "skills"
  | "companionActionMarketplaceEngine"
  | "marketplace"
  | "appStore"
  | "appAnalytics"
  | "appLicenses"
  | "appEmployees"
  | "appPeople"
  | "appKnowledge"
  | "appDocuments"
  | "appPlaybooks"
  | "appCustomers"
  | "appCases"
  | "appFinance"
  | "appProjects"
  | "appSales"
  | "appMarketing"
  | "appScheduling"
  | "appCalendar"
  | "appEvents"
  | "appSystemHealth"
  | "appBookings"
  | "appNotifications"
  | "appExecutiveAlerts"
  | "appMobileApiIntegration"
  | "appAssets"
  | "appProcurement"
  | "appQualityOperations"
  | "appRiskOperations"
  | "appStrategicIntelligence"
  | "appAutomationOperations"
  | "appUniversalSearch"
  | "appActivityOperations"
  | "appCompanionCommandCenter"
  | "appKnowledgeGraph"
  | "appKnowledgeNetwork"
  | "appMarketObservatory"
  | "appRevenueOperations"
  | "appAiWorkforce"
  | "appCompanionSkills"
  | "appIntegrationHub"
  | "appSimulationOperations"
  | "appExecutionOperations"
  | "appCompanionPresenceOperations"
  | "appInventory"
  | "appForms"
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
  | "workforceScheduling"
  | "serviceCheckout"
  | "humanSuccessEngine"
  | "customerLifecycleEngine"
  | "platformIntegrityEngine"
  | "ecosystemIntelligenceEngine"
  | "ecosystemOrchestrationEngine"
  | "communityIntelligenceEngine"
  | "marketplaceGovernanceEngine"
  | "partnerCertificationEngine"
  | "growthPartnerOperationsEngine"
  | "growthPartnerDashboard"
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
  | "realWorldActionServiceOrchestrationEngine"
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
  | "enterpriseGovernanceTrustEngine"
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
  { id: "overview", href: "/app", labelKey: "navigation.nav.overview" },
  { id: "workspaceProductivityHub", href: "/app/workspace", labelKey: "navigation.nav.workspaceProductivityHub" },
  { id: "aipifyCorePlatformEngine", href: "/app/aipify-core", labelKey: "navigation.nav.aipifyCorePlatformEngine" },
  { id: "multiTenantArchitectureEngine", href: "/app/multi-tenant", labelKey: "navigation.nav.multiTenantArchitectureEngine" },
  {
    id: "organizationWorkspaceEngine",
    href: "/app/organization-workspace-engine",
    labelKey: "navigation.nav.organizationWorkspaceEngine",
  },
  {
    id: "enterpriseOrganizationEngine",
    href: "/app/organizations",
    labelKey: "navigation.nav.enterpriseOrganizationEngine",
  },
  {
    id: "industryPackEcosystemEngine",
    href: "/app/industry-packs",
    labelKey: "navigation.nav.industryPackEcosystemEngine",
  },
  {
    id: "hospitalityAccommodationPack",
    href: "/app/hospitality",
    labelKey: "navigation.nav.hospitalityAccommodationPack",
  },
  {
    id: "commerceRetailOperationsPack",
    href: "/app/commerce",
    labelKey: "navigation.nav.commerceRetailOperationsPack",
  },
  {
    id: "realEstatePortfolioOperationsPack",
    href: "/app/real-estate",
    labelKey: "navigation.nav.realEstatePortfolioOperationsPack",
  },
  {
    id: "constructionProjectFieldOperationsPack",
    href: "/app/construction",
    labelKey: "navigation.nav.constructionProjectFieldOperationsPack",
  },
  {
    id: "logisticsTransportationFleetOperationsPack",
    href: "/app/logistics",
    labelKey: "navigation.nav.logisticsTransportationFleetOperationsPack",
  },
  {
    id: "manufacturingProductionIndustrialOperationsPack",
    href: "/app/manufacturing",
    labelKey: "navigation.nav.manufacturingProductionIndustrialOperationsPack",
  },
  {
    id: "educationTrainingLearningOperationsPack",
    href: "/app/education",
    labelKey: "navigation.nav.educationTrainingLearningOperationsPack",
  },
  {
    id: "healthcareClinicPatientOperationsPack",
    href: "/app/healthcare",
    labelKey: "navigation.nav.healthcareClinicPatientOperationsPack",
  },
  {
    id: "legalComplianceCaseOperationsPack",
    href: "/app/legal",
    labelKey: "navigation.nav.legalComplianceCaseOperationsPack",
  },
  {
    id: "professionalServicesConsultingClientDeliveryPack",
    href: "/app/professional-services",
    labelKey: "navigation.nav.professionalServicesConsultingClientDeliveryPack",
  },
  {
    id: "digitalEmployeeCenter",
    href: "/app/digital-employees",
    labelKey: "navigation.nav.digitalEmployeeCenter",
  },
  {
    id: "digitalWorkforceRecruitmentEngine",
    href: "/app/digital-workforce/recruitment",
    labelKey: "navigation.nav.digitalWorkforceRecruitmentEngine",
  },
  {
    id: "digitalWorkforceValueEngine",
    href: "/app/digital-workforce/value",
    labelKey: "navigation.nav.digitalWorkforceValueEngine",
  },
  {
    id: "contextIntelligenceEngine",
    href: "/app/context-intelligence-engine",
    labelKey: "navigation.nav.contextIntelligenceEngine",
  },
  { id: "identityPermissionsEngine", href: "/app/identity-access", labelKey: "navigation.nav.identityPermissionsEngine" },
  { id: "secureAiActionEngine", href: "/app/secure-ai-actions", labelKey: "navigation.nav.secureAiActionEngine" },
  { id: "auditAccountabilityEngine", href: "/app/audit-accountability", labelKey: "navigation.nav.auditAccountabilityEngine" },
  { id: "knowledgeCenterEngine", href: "/app/knowledge-center-engine", labelKey: "navigation.nav.knowledgeCenterEngine" },
  { id: "adminAssistantEngine", href: "/app/admin-assistant-engine", labelKey: "navigation.nav.adminAssistantEngine" },
  { id: "supportAiEngine", href: "/app/support-ai-engine", labelKey: "navigation.nav.supportAiEngine" },
  { id: "integrationEngine", href: "/app/integration-engine", labelKey: "navigation.nav.integrationEngine" },
  { id: "apiPlatformEngine", href: "/app/api-platform-engine", labelKey: "navigation.nav.apiPlatformEngine" },
  { id: "operationsDashboardEngine", href: "/app/operations-dashboard-engine", labelKey: "navigation.nav.operationsDashboardEngine" },
  { id: "customerOnboardingEngine", href: "/app/customer-onboarding-engine", labelKey: "navigation.nav.customerOnboardingEngine" },
  {
    id: "implementationOnboardingCenter",
    href: "/app/onboarding",
    labelKey: "navigation.nav.implementationOnboardingCenter",
  },
  {
    id: "subscriptionPlanManagementEngine",
    href: "/app/subscription-plan-management-engine",
    labelKey: "navigation.nav.subscriptionPlanManagementEngine",
  },
  { id: "selfSupportEngine", href: "/app/self-support-engine", labelKey: "navigation.nav.selfSupportEngine" },
  { id: "qualityGuardianEngine", href: "/app/quality-guardian-engine", labelKey: "navigation.nav.qualityGuardianEngine" },
  { id: "aipifyModeration", href: "/app/aipify-moderation", labelKey: "navigation.nav.aipifyModeration" },
  { id: "governancePolicyEngine", href: "/app/governance-policy-engine", labelKey: "navigation.nav.governancePolicyEngine" },
  {
    id: "unonightPilotOperationsEngine",
    href: "/app/unonight-pilot-operations-engine",
    labelKey: "navigation.nav.unonightPilotOperationsEngine",
  },
  { id: "analyticsInsightsEngine", href: "/app/analytics-insights-engine", labelKey: "navigation.nav.analyticsInsightsEngine" },
  {
    id: "notificationCommunicationEngine",
    href: "/app/notification-communication-engine",
    labelKey: "navigation.nav.notificationCommunicationEngine",
  },
  {
    id: "deploymentEnvironmentManagementEngine",
    href: "/app/deployment-environment-management-engine",
    labelKey: "navigation.nav.deploymentEnvironmentManagementEngine",
  },
  {
    id: "globalDeploymentEnterpriseInfrastructureEngine",
    href: "/app/infrastructure/global",
    labelKey: "navigation.nav.globalDeploymentEnterpriseInfrastructureEngine",
  },
  {
    id: "observabilityPlatformHealthEngine",
    href: "/app/observability-platform-health-engine",
    labelKey: "navigation.nav.observabilityPlatformHealthEngine",
  },
  {
    id: "aipifyInstallEngine",
    href: "/app/aipify-install-engine",
    labelKey: "navigation.nav.aipifyInstallEngine",
  },
  {
    id: "moduleMarketplaceFoundationEngine",
    href: "/app/module-marketplace-foundation-engine",
    labelKey: "navigation.nav.moduleMarketplaceFoundationEngine",
  },
  {
    id: "aipifyInternalOperationsEngine",
    href: "/app/aipify-internal-operations-engine",
    labelKey: "navigation.nav.aipifyInternalOperationsEngine",
  },
  {
    id: "launchReadinessEngine",
    href: "/app/launch-readiness-engine",
    labelKey: "navigation.nav.launchReadinessEngine",
  },
  {
    id: "revenueGrowthCenter",
    href: "/app/revenue-growth",
    labelKey: "navigation.nav.revenueGrowthCenter",
  },
  {
    id: "customerSuccessAdoptionCenter",
    href: "/app/customer-success",
    labelKey: "navigation.nav.customerSuccessAdoptionCenter",
  },
  {
    id: "appointmentBookingEngine",
    href: "/app/appointments",
    labelKey: "navigation.nav.appointmentBookingEngine",
  },
  {
    id: "clientRelationshipEngine",
    href: "/app/client-relationships",
    labelKey: "navigation.nav.clientRelationshipEngine",
  },
  {
    id: "timeAttendance",
    href: "/app/time-attendance",
    labelKey: "navigation.nav.timeAttendance",
  },
  {
    id: "compensation",
    href: "/app/compensation",
    labelKey: "navigation.nav.compensation",
  },
  {
    id: "profitability",
    href: "/app/profitability",
    labelKey: "navigation.nav.profitability",
  },
  {
    id: "customerSuccessEngine",
    href: "/app/customer-success-engine",
    labelKey: "navigation.nav.customerSuccessEngine",
  },
  {
    id: "customerExperienceAdoptionDelightEngine",
    href: "/app/platform/customer-experience",
    labelKey: "navigation.nav.customerExperienceAdoptionDelightEngine",
  },
  {
    id: "platformExcellenceEngine",
    href: "/app/platform/excellence",
    labelKey: "navigation.nav.platformExcellenceEngine",
  },
  {
    id: "enterpriseTrustReputationConfidenceEngine",
    href: "/app/trust-center",
    labelKey: "navigation.nav.enterpriseTrustReputationConfidenceEngine",
  },
  {
    id: "enterpriseInnovationRdFutureEngine",
    href: "/app/innovation",
    labelKey: "navigation.nav.enterpriseInnovationRdFutureEngine",
  },
  {
    id: "enterpriseEcosystemPartnerNetworkEngine",
    href: "/app/ecosystem",
    labelKey: "navigation.nav.enterpriseEcosystemPartnerNetworkEngine",
  },
  {
    id: "globalBusinessNetworkEngine",
    href: "/app/network",
    labelKey: "navigation.nav.globalBusinessNetworkEngine",
  },
  {
    id: "companionFederationEngine",
    href: "/app/federation",
    labelKey: "navigation.nav.companionFederationEngine",
  },
  {
    id: "companionFutureReadinessEngine",
    href: "/app/future-readiness",
    labelKey: "navigation.nav.companionFutureReadinessEngine",
  },
  {
    id: "companionResilienceEngine",
    href: "/app/resilience",
    labelKey: "navigation.nav.companionResilienceEngine",
  },
  {
    id: "companionProactiveEngine",
    href: "/app/proactive",
    labelKey: "navigation.nav.companionProactiveEngine",
  },
  {
    id: "companionAutopilotEngine",
    href: "/app/autopilot",
    labelKey: "navigation.nav.companionAutopilotEngine",
  },
  {
    id: "companionExecutiveCopilotEngine",
    href: "/app/executive-copilot",
    labelKey: "navigation.nav.companionExecutiveCopilotEngine",
  },
  {
    id: "companionHeadquartersEngine",
    href: "/app/headquarters",
    labelKey: "navigation.nav.companionHeadquartersEngine",
  },
  {
    id: "companionExpertiseEngine",
    href: "/app/expertise",
    labelKey: "navigation.nav.companionExpertiseEngine",
  },
  {
    id: "companionDecisionMemoryEngine",
    href: "/app/decisions",
    labelKey: "navigation.nav.companionDecisionMemoryEngine",
  },
  {
    id: "companionOrganizationalLearningEngine",
    href: "/app/learning-center",
    labelKey: "navigation.nav.companionOrganizationalLearningEngine",
  },
  {
    id: "companionMaturityEvolutionEngine",
    href: "/app/maturity",
    labelKey: "navigation.nav.companionMaturityEvolutionEngine",
  },
  {
    id: "companionMemoryGraphEngine",
    href: "/app/memory-graph",
    labelKey: "navigation.nav.companionMemoryGraphEngine",
  },
  {
    id: "companionDigitalTwinSimulationEngine",
    href: "/app/digital-twin-center",
    labelKey: "navigation.nav.companionDigitalTwinSimulationEngine",
  },
  {
    id: "companionExecutionOutcomeEngine",
    href: "/app/execution-center",
    labelKey: "navigation.nav.companionExecutionOutcomeEngine",
  },
  {
    id: "companionWorkflowProcessEngine",
    href: "/app/workflow-center",
    labelKey: "navigation.nav.companionWorkflowProcessEngine",
  },
  {
    id: "companionResourceCapacityEngine",
    href: "/app/resource-center",
    labelKey: "navigation.nav.companionResourceCapacityEngine",
  },
  {
    id: "enterpriseValueRealizationRoiEngine",
    href: "/app/value",
    labelKey: "navigation.nav.enterpriseValueRealizationRoiEngine",
  },
  {
    id: "autonomousEnterpriseOperationsEngine",
    href: "/app/autonomous",
    labelKey: "navigation.nav.autonomousEnterpriseOperationsEngine",
  },
  {
    id: "autonomousOrganizationEngine",
    href: "/app/autonomy",
    labelKey: "navigation.nav.autonomousOrganizationEngine",
  },
  {
    id: "statusTransparencyEngine",
    href: "/app/status-transparency-engine",
    labelKey: "navigation.nav.statusTransparencyEngine",
  },
  {
    id: "enterpriseReadinessEngine",
    href: "/app/enterprise-readiness-engine",
    labelKey: "navigation.nav.enterpriseReadinessEngine",
  },
  {
    id: "enterpriseDeploymentDeviceRolloutEngine",
    href: "/app/enterprise-deployment-device-rollout-engine",
    labelKey: "navigation.nav.enterpriseDeploymentDeviceRolloutEngine",
  },
  {
    id: "learningTrainingEngine",
    href: "/app/learning-training-engine",
    labelKey: "navigation.nav.learningTrainingEngine",
  },
  {
    id: "aipifyUniversityEngine",
    href: "/app/aipify-university",
    labelKey: "navigation.nav.aipifyUniversityEngine",
  },
  {
    id: "certificationAchievementEngine",
    href: "/app/certification-achievement-engine",
    labelKey: "navigation.nav.certificationAchievementEngine",
  },
  {
    id: "innovationImpactEngine",
    href: "/app/innovation-impact-engine",
    labelKey: "navigation.nav.innovationImpactEngine",
  },
  {
    id: "complianceRegulatoryReadinessEngine",
    href: "/app/compliance-regulatory-readiness-engine",
    labelKey: "navigation.nav.complianceRegulatoryReadinessEngine",
  },
  {
    id: "strategicIntelligenceFoundationEngine",
    href: "/app/strategic-intelligence-foundation-engine",
    labelKey: "navigation.nav.strategicIntelligenceFoundationEngine",
  },
  {
    id: "strategicForesightEngine",
    href: "/app/strategic-foresight-engine",
    labelKey: "navigation.nav.strategicForesightEngine",
  },
  {
    id: "decisionIntelligenceEngine",
    href: "/app/intelligence/decisions",
    labelKey: "navigation.nav.decisionIntelligenceEngine",
  },
  {
    id: "corporateBrainEngine",
    href: "/app/intelligence/corporate-brain",
    labelKey: "navigation.nav.corporateBrainEngine",
  },
  {
    id: "organizationalConsciousnessEngine",
    href: "/app/intelligence/consciousness",
    labelKey: "navigation.nav.organizationalConsciousnessEngine",
  },
  {
    id: "industryIntelligenceEngine",
    href: "/app/intelligence/industry",
    labelKey: "navigation.nav.industryIntelligenceEngine",
  },
  {
    id: "economicIntelligenceEngine",
    href: "/app/intelligence/economy",
    labelKey: "navigation.nav.economicIntelligenceEngine",
  },
  {
    id: "marketIntelligenceEngine",
    href: "/app/intelligence/market",
    labelKey: "navigation.nav.marketIntelligenceEngine",
  },
  {
    id: "globalExpansionIntelligenceEngine",
    href: "/app/intelligence/global-expansion",
    labelKey: "navigation.nav.globalExpansionIntelligenceEngine",
  },
  {
    id: "collectiveDecisionCouncilEngine",
    href: "/app/collective-decision-council-engine",
    labelKey: "navigation.nav.collectiveDecisionCouncilEngine",
  },
  {
    id: "organizationalWisdomEngine",
    href: "/app/organizational-wisdom-engine",
    labelKey: "navigation.nav.organizationalWisdomEngine",
  },
  {
    id: "operationsCenterFoundationEngine",
    href: "/app/operations-center-foundation-engine",
    labelKey: "navigation.nav.operationsCenterFoundationEngine",
  },
  {
    id: "continuousImprovementEngine",
    href: "/app/intelligence/improvements",
    labelKey: "navigation.nav.continuousImprovementEngine",
  },
  {
    id: "workflowOrchestrationEngine",
    href: "/app/workflow-orchestration-engine",
    labelKey: "navigation.nav.workflowOrchestrationEngine",
  },
  {
    id: "humanOversightEngine",
    href: "/app/human-oversight-engine",
    labelKey: "navigation.nav.humanOversightEngine",
  },
  {
    id: "proactiveOrganizationEngine",
    href: "/app/proactive-organization-engine",
    labelKey: "navigation.nav.proactiveOrganizationEngine",
  },
  {
    id: "humanPotentialAugmentedWorkEngine",
    href: "/app/human-potential-augmented-work-engine",
    labelKey: "navigation.nav.humanPotentialAugmentedWorkEngine",
  },
  {
    id: "augmentedOrganizationEngine",
    href: "/app/augmented-organization-engine",
    labelKey: "navigation.nav.augmentedOrganizationEngine",
  },
  {
    id: "globalKnowledgeExchangeEngine",
    href: "/app/global-knowledge-exchange-engine",
    labelKey: "navigation.nav.globalKnowledgeExchangeEngine",
  },
  {
    id: "jointOperationsEngine",
    href: "/app/joint-operations-engine",
    labelKey: "navigation.nav.jointOperationsEngine",
  },
  {
    id: "globalGovernanceDiplomacyEngine",
    href: "/app/global-governance-diplomacy-engine",
    labelKey: "navigation.nav.globalGovernanceDiplomacyEngine",
  },
  {
    id: "globalTalentExpertNetworkEngine",
    href: "/app/global-talent-expert-network-engine",
    labelKey: "navigation.nav.globalTalentExpertNetworkEngine",
  },
  {
    id: "globalEcosystemMarketplaceEngine",
    href: "/app/global-ecosystem-marketplace-engine",
    labelKey: "navigation.nav.globalEcosystemMarketplaceEngine",
  },
  {
    id: "globalStewardshipCollectiveFutureEngine",
    href: "/app/global-stewardship-collective-future-engine",
    labelKey: "navigation.nav.globalStewardshipCollectiveFutureEngine",
  },
  {
    id: "futureLeadersEngine",
    href: "/app/future-leaders-engine",
    labelKey: "navigation.nav.futureLeadersEngine",
  },
  {
    id: "organizationalSensemakingEngine",
    href: "/app/organizational-sensemaking-engine",
    labelKey: "navigation.nav.organizationalSensemakingEngine",
  },
  {
    id: "livingEnterpriseEngine",
    href: "/app/living-enterprise-engine",
    labelKey: "navigation.nav.livingEnterpriseEngine",
  },
  {
    id: "civicCollaborationEngine",
    href: "/app/civic-collaboration-engine",
    labelKey: "navigation.nav.civicCollaborationEngine",
  },
  {
    id: "crossSectorIntelligenceEngine",
    href: "/app/cross-sector-intelligence-engine",
    labelKey: "navigation.nav.crossSectorIntelligenceEngine",
  },
  {
    id: "civilizationalMemoryEngine",
    href: "/app/civilizational-memory-engine",
    labelKey: "navigation.nav.civilizationalMemoryEngine",
  },
  {
    id: "civilizationalLearningEngine",
    href: "/app/civilizational-learning-engine",
    labelKey: "navigation.nav.civilizationalLearningEngine",
  },
  {
    id: "civilizationalForesightEngine",
    href: "/app/civilizational-foresight-engine",
    labelKey: "navigation.nav.civilizationalForesightEngine",
  },
  {
    id: "civilizationalCoordinationEngine",
    href: "/app/civilizational-coordination-engine",
    labelKey: "navigation.nav.civilizationalCoordinationEngine",
  },
  {
    id: "sharedProsperityEngine",
    href: "/app/shared-prosperity-engine",
    labelKey: "navigation.nav.sharedProsperityEngine",
  },
  {
    id: "constructiveDialogueEngine",
    href: "/app/constructive-dialogue-engine",
    labelKey: "navigation.nav.constructiveDialogueEngine",
  },
  {
    id: "socialCohesionEngine",
    href: "/app/social-cohesion-engine",
    labelKey: "navigation.nav.socialCohesionEngine",
  },
  {
    id: "humanFlourishingEngine",
    href: "/app/human-flourishing-engine",
    labelKey: "navigation.nav.humanFlourishingEngine",
  },
  {
    id: "multiGenerationalFuturesEngine",
    href: "/app/multi-generational-futures-engine",
    labelKey: "navigation.nav.multiGenerationalFuturesEngine",
  },
  {
    id: "intergenerationalGuardianshipEngine",
    href: "/app/intergenerational-guardianship-engine",
    labelKey: "navigation.nav.intergenerationalGuardianshipEngine",
  },
  {
    id: "humanIdentityMeaningEngine",
    href: "/app/human-identity-meaning-engine",
    labelKey: "navigation.nav.humanIdentityMeaningEngine",
  },
  {
    id: "humanCreativityImaginationEngine",
    href: "/app/human-creativity-imagination-engine",
    labelKey: "navigation.nav.humanCreativityImaginationEngine",
  },
  {
    id: "humanWisdomAugmentedJudgmentEngine",
    href: "/app/human-wisdom-augmented-judgment-engine",
    labelKey: "navigation.nav.humanWisdomAugmentedJudgmentEngine",
  },
  {
    id: "humanAgencyAutonomyEngine",
    href: "/app/human-agency-autonomy-engine",
    labelKey: "navigation.nav.humanAgencyAutonomyEngine",
  },
  {
    id: "humanDignityHumilityEngine",
    href: "/app/human-dignity-humility-engine",
    labelKey: "navigation.nav.humanDignityHumilityEngine",
  },
  {
    id: "humanHopePossibilityEngine",
    href: "/app/human-hope-possibility-engine",
    labelKey: "navigation.nav.humanHopePossibilityEngine",
  },
  {
    id: "humanWonderExplorationEngine",
    href: "/app/human-wonder-exploration-engine",
    labelKey: "navigation.nav.humanWonderExplorationEngine",
  },
  {
    id: "humanLegacyEternalStewardshipEngine",
    href: "/app/human-legacy-eternal-stewardship-engine",
    labelKey: "navigation.nav.humanLegacyEternalStewardshipEngine",
  },
  {
    id: "universalStewardshipSharedFuturesEngine",
    href: "/app/universal-stewardship-shared-futures-engine",
    labelKey: "navigation.nav.universalStewardshipSharedFuturesEngine",
  },
  {
    id: "collectiveWisdomSharedLearningEngine",
    href: "/app/collective-wisdom-shared-learning-engine",
    labelKey: "navigation.nav.collectiveWisdomSharedLearningEngine",
  },
  {
    id: "sharedPurposeContributionEngine",
    href: "/app/shared-purpose-contribution-engine",
    labelKey: "navigation.nav.sharedPurposeContributionEngine",
  },
  {
    id: "sharedResilienceAdaptiveCapacityEngine",
    href: "/app/shared-resilience-adaptive-capacity-engine",
    labelKey: "navigation.nav.sharedResilienceAdaptiveCapacityEngine",
  },
  {
    id: "sharedTrustCooperativeIntelligenceEngine",
    href: "/app/shared-trust-cooperative-intelligence-engine",
    labelKey: "navigation.nav.sharedTrustCooperativeIntelligenceEngine",
  },
  {
    id: "sharedCompassionReciprocalCareEngine",
    href: "/app/shared-compassion-reciprocal-care-engine",
    labelKey: "navigation.nav.sharedCompassionReciprocalCareEngine",
  },
  {
    id: "sharedCourageResponsibleActionEngine",
    href: "/app/shared-courage-responsible-action-engine",
    labelKey: "navigation.nav.sharedCourageResponsibleActionEngine",
  },
  {
    id: "sharedGratitudeAppreciativeStewardshipEngine",
    href: "/app/shared-gratitude-appreciative-stewardship-engine",
    labelKey: "navigation.nav.sharedGratitudeAppreciativeStewardshipEngine",
  },
  {
    id: "sharedLegacyFlourishingEngine",
    href: "/app/shared-legacy-flourishing-engine",
    labelKey: "navigation.nav.sharedLegacyFlourishingEngine",
  },
  {
    id: "aipifyConstitutionPerpetualPrinciplesEngine",
    href: "/app/aipify-constitution-perpetual-principles-engine",
    labelKey: "navigation.nav.aipifyConstitutionPerpetualPrinciplesEngine",
  },
  {
    id: "aipifyEthicalEvolutionResponsibleInnovationEngine",
    href: "/app/aipify-ethical-evolution-responsible-innovation-engine",
    labelKey: "navigation.nav.aipifyEthicalEvolutionResponsibleInnovationEngine",
  },
  {
    id: "aipifyGuardianshipSuccessionEngine",
    href: "/app/aipify-guardianship-succession-engine",
    labelKey: "navigation.nav.aipifyGuardianshipSuccessionEngine",
  },
  {
    id: "aipifyLegacyPreservationKnowledgeContinuityEngine",
    href: "/app/aipify-legacy-preservation-knowledge-continuity-engine",
    labelKey: "navigation.nav.aipifyLegacyPreservationKnowledgeContinuityEngine",
  },
  {
    id: "aipifyPrinciplesEnforcementEngine",
    href: "/app/aipify-principles-enforcement-engine",
    labelKey: "navigation.nav.aipifyPrinciplesEnforcementEngine",
  },
  {
    id: "aipifyValuesTransmissionCulturalContinuityEngine",
    href: "/app/aipify-values-transmission-cultural-continuity-engine",
    labelKey: "navigation.nav.aipifyValuesTransmissionCulturalContinuityEngine",
  },
  {
    id: "aipifyDecisionTransparencyEngine",
    href: "/app/aipify-decision-transparency-engine",
    labelKey: "navigation.nav.aipifyDecisionTransparencyEngine",
  },
  {
    id: "aipifyStrategicAlignmentPrioritizationEngine",
    href: "/app/aipify-strategic-alignment-prioritization-engine",
    labelKey: "navigation.nav.aipifyStrategicAlignmentPrioritizationEngine",
  },
  {
    id: "aipifyExecutiveOperatingSystemFoundersCockpitEngine",
    href: "/app/aipify-executive-operating-system-founders-cockpit-engine",
    labelKey: "navigation.nav.aipifyExecutiveOperatingSystemFoundersCockpitEngine",
  },
  {
    id: "aipifyKnowledgeDiscoveryIntelligentSearchEngine",
    href: "/app/aipify-knowledge-discovery-intelligent-search-engine",
    labelKey: "navigation.nav.aipifyKnowledgeDiscoveryIntelligentSearchEngine",
  },
  {
    id: "aipifyActionCenterExecutionEngine",
    href: "/app/aipify-action-center-execution-engine",
    labelKey: "navigation.nav.aipifyActionCenterExecutionEngine",
  },
  {
    id: "aipifyEnterpriseCommitmentAccountabilityEngine",
    href: "/app/aipify-enterprise-commitment-accountability-engine",
    labelKey: "navigation.nav.aipifyEnterpriseCommitmentAccountabilityEngine",
  },
  {
    id: "aipifyOperationsOrchestrationEngine",
    href: "/app/aipify-operations-orchestration-engine",
    labelKey: "navigation.nav.aipifyOperationsOrchestrationEngine",
  },
  {
    id: "aipifyResourceCapacityWorkloadBalanceEngine",
    href: "/app/aipify-resource-capacity-workload-balance-engine",
    labelKey: "navigation.nav.aipifyResourceCapacityWorkloadBalanceEngine",
  },
  {
    id: "aipifyDecisionCenterGovernanceEngine",
    href: "/app/aipify-decision-center-governance-engine",
    labelKey: "navigation.nav.aipifyDecisionCenterGovernanceEngine",
  },
  {
    id: "aipifyOrganizationalRhythmsOperatingCadenceEngine",
    href: "/app/aipify-organizational-rhythms-operating-cadence-engine",
    labelKey: "navigation.nav.aipifyOrganizationalRhythmsOperatingCadenceEngine",
  },
  {
    id: "continuousImprovementOptimizationEngine",
    href: "/app/aipify-continuous-improvement-optimization-engine",
    labelKey: "navigation.nav.continuousImprovementOptimizationEngine",
  },
  {
    id: "aipifyInnovationOpportunityDiscoveryEngine",
    href: "/app/aipify-innovation-opportunity-discovery-engine",
    labelKey: "navigation.nav.aipifyInnovationOpportunityDiscoveryEngine",
  },
  {
    id: "aipifyCustomerSuccessValueRealizationEngine",
    href: "/app/aipify-customer-success-value-realization-engine",
    labelKey: "navigation.nav.aipifyCustomerSuccessValueRealizationEngine",
  },
  {
    id: "aipifyCustomerJourneyExperienceOrchestrationEngine",
    href: "/app/aipify-customer-journey-experience-orchestration-engine",
    labelKey: "navigation.nav.aipifyCustomerJourneyExperienceOrchestrationEngine",
  },
  {
    id: "aipifyOnboardingAdoptionAccelerationEngine",
    href: "/app/aipify-onboarding-adoption-acceleration-engine",
    labelKey: "navigation.nav.aipifyOnboardingAdoptionAccelerationEngine",
  },
  {
    id: "aipifyEnterpriseTrainingCertificationEngine",
    href: "/app/aipify-enterprise-training-certification-engine",
    labelKey: "navigation.nav.aipifyEnterpriseTrainingCertificationEngine",
  },
  {
    id: "aipifyOrganizationalCommunicationAnnouncementsEngine",
    href: "/app/aipify-organizational-communication-announcements-engine",
    labelKey: "navigation.nav.aipifyOrganizationalCommunicationAnnouncementsEngine",
  },
  {
    id: "aipifyEmployeeRecognitionCelebrationEngine",
    href: "/app/aipify-employee-recognition-celebration-engine",
    labelKey: "navigation.nav.aipifyEmployeeRecognitionCelebrationEngine",
  },
  {
    id: "aipifyMentorshipKnowledgeTransferEngine",
    href: "/app/aipify-mentorship-knowledge-transfer-engine",
    labelKey: "navigation.nav.aipifyMentorshipKnowledgeTransferEngine",
  },
  {
    id: "aipifySuccessionPlanningOrganizationalContinuityEngine",
    href: "/app/aipify-succession-planning-organizational-continuity-engine",
    labelKey: "navigation.nav.aipifySuccessionPlanningOrganizationalContinuityEngine",
  },
  {
    id: "aipifyOrganizationalHealthWorkforceInsightsEngine",
    href: "/app/aipify-organizational-health-workforce-insights-engine",
    labelKey: "navigation.nav.aipifyOrganizationalHealthWorkforceInsightsEngine",
  },
  {
    id: "aipifySkillsInternalTalentMarketplaceEngine",
    href: "/app/aipify-skills-internal-talent-marketplace-engine",
    labelKey: "navigation.nav.aipifySkillsInternalTalentMarketplaceEngine",
  },
  {
    id: "aipifyInnovationIdeaManagementEngine",
    href: "/app/aipify-innovation-idea-management-engine",
    labelKey: "navigation.nav.aipifyInnovationIdeaManagementEngine",
  },
  {
    id: "aipifyOrganizationalGoalsAlignmentEngine",
    href: "/app/aipify-organizational-goals-alignment-engine",
    labelKey: "navigation.nav.aipifyOrganizationalGoalsAlignmentEngine",
  },
  {
    id: "aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine",
    href: "/app/aipify-enterprise-resource-planning-capacity-intelligence-engine",
    labelKey: "navigation.nav.aipifyEnterpriseResourcePlanningCapacityIntelligenceEngine",
  },
  {
    id: "aipifyProjectPortfolioStrategicExecutionEngine",
    href: "/app/aipify-project-portfolio-strategic-execution-engine",
    labelKey: "navigation.nav.aipifyProjectPortfolioStrategicExecutionEngine",
  },
  {
    id: "aipifyDecisionIntelligenceRecommendationEngine",
    href: "/app/aipify-decision-intelligence-recommendation-engine",
    labelKey: "navigation.nav.aipifyDecisionIntelligenceRecommendationEngine",
  },
  {
    id: "aipifyEnterpriseActionPrioritizationFocusEngine",
    href: "/app/aipify-enterprise-action-prioritization-focus-engine",
    labelKey: "navigation.nav.aipifyEnterpriseActionPrioritizationFocusEngine",
  },
  {
    id: "aipifyEnterpriseGovernancePolicyAutomationEngine",
    href: "/app/aipify-enterprise-governance-policy-automation-engine",
    labelKey: "navigation.nav.aipifyEnterpriseGovernancePolicyAutomationEngine",
  },
  {
    id: "aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine",
    href: "/app/aipify-enterprise-knowledge-validation-quality-assurance-engine",
    labelKey: "navigation.nav.aipifyEnterpriseKnowledgeValidationQualityAssuranceEngine",
  },
  {
    id: "aipifyEnterpriseExternalIntelligenceMarketAwarenessEngine",
    href: "/app/aipify-enterprise-external-intelligence-market-awareness-engine",
    labelKey: "navigation.nav.aipifyEnterpriseExternalIntelligenceMarketAwarenessEngine",
  },
  {
    id: "aipifyEnterpriseActionOrchestrationEngine",
    href: "/app/aipify-enterprise-action-orchestration-engine",
    labelKey: "navigation.nav.aipifyEnterpriseActionOrchestrationEngine",
  },
  {
    id: "aipifyEnterpriseDecisionEscalationGovernanceEngine",
    href: "/app/aipify-enterprise-decision-escalation-governance-engine",
    labelKey: "navigation.nav.aipifyEnterpriseDecisionEscalationGovernanceEngine",
  },
  {
    id: "aipifyEnterpriseContinuousImprovementEngine",
    href: "/app/aipify-enterprise-continuous-improvement-engine",
    labelKey: "navigation.nav.aipifyEnterpriseContinuousImprovementEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalMemoryEngine",
    href: "/app/aipify-enterprise-organizational-memory-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOrganizationalMemoryEngine",
  },
  {
    id: "aipifyEnterpriseResilienceBusinessContinuityEngine",
    href: "/app/aipify-enterprise-resilience-business-continuity-engine",
    labelKey: "navigation.nav.aipifyEnterpriseResilienceBusinessContinuityEngine",
  },
  {
    id: "aipifyEnterpriseTrustRelationshipIntelligenceEngine",
    href: "/app/aipify-enterprise-trust-relationship-intelligence-engine",
    labelKey: "navigation.nav.aipifyEnterpriseTrustRelationshipIntelligenceEngine",
  },
  {
    id: "aipifyEnterpriseStrategicExecutionEngine",
    href: "/app/aipify-enterprise-strategic-execution-engine",
    labelKey: "navigation.nav.aipifyEnterpriseStrategicExecutionEngine",
  },
  {
    id: "aipifyEnterpriseOpportunityDiscoveryEngine",
    href: "/app/aipify-enterprise-opportunity-discovery-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOpportunityDiscoveryEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalAdaptabilityEngine",
    href: "/app/aipify-enterprise-organizational-adaptability-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOrganizationalAdaptabilityEngine",
  },
  {
    id: "aipifyEnterpriseAutonomousCoordinationEngine",
    href: "/app/aipify-enterprise-autonomous-coordination-engine",
    labelKey: "navigation.nav.aipifyEnterpriseAutonomousCoordinationEngine",
  },
  {
    id: "aipifyEnterpriseExecutiveCopilotEngine",
    href: "/app/aipify-enterprise-executive-copilot-engine",
    labelKey: "navigation.nav.aipifyEnterpriseExecutiveCopilotEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalFocusEngine",
    href: "/app/aipify-enterprise-organizational-focus-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOrganizationalFocusEngine",
  },
  {
    id: "aipifyEnterpriseExecutionConfidenceEngine",
    href: "/app/aipify-enterprise-execution-confidence-engine",
    labelKey: "navigation.nav.aipifyEnterpriseExecutionConfidenceEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalWisdomEngine",
    href: "/app/aipify-enterprise-organizational-wisdom-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOrganizationalWisdomEngine",
  },
  {
    id: "aipifyEnterpriseLegacyStewardshipEngine",
    href: "/app/aipify-enterprise-legacy-stewardship-engine",
    labelKey: "navigation.nav.aipifyEnterpriseLegacyStewardshipEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalConsciousnessEngine",
    href: "/app/aipify-enterprise-organizational-consciousness-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOrganizationalConsciousnessEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalEnergyEngine",
    href: "/app/aipify-enterprise-organizational-energy-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOrganizationalEnergyEngine",
  },
  {
    id: "aipifyEnterpriseCollectiveIntelligenceEngine",
    href: "/app/aipify-enterprise-collective-intelligence-engine",
    labelKey: "navigation.nav.aipifyEnterpriseCollectiveIntelligenceEngine",
  },
  {
    id: "aipifyEnterpriseFutureReadinessEngine",
    href: "/app/aipify-enterprise-future-readiness-engine",
    labelKey: "navigation.nav.aipifyEnterpriseFutureReadinessEngine",
  },
  {
    id: "aipifyEnterprisePurposeValuesAlignmentEngine",
    href: "/app/aipify-enterprise-purpose-values-alignment-engine",
    labelKey: "navigation.nav.aipifyEnterprisePurposeValuesAlignmentEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalClarityEngine",
    href: "/app/aipify-enterprise-organizational-clarity-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOrganizationalClarityEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalSimplicityEngine",
    href: "/app/aipify-enterprise-organizational-simplicity-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOrganizationalSimplicityEngine",
  },
  {
    id: "aipifyEnterpriseOrganizationalTrustEngine",
    href: "/app/aipify-enterprise-organizational-trust-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOrganizationalTrustEngine",
  },
  {
    id: "aipifyEmployeeGrowthCareerDevelopmentEngine",
    href: "/app/aipify-employee-growth-career-development-engine",
    labelKey: "navigation.nav.aipifyEmployeeGrowthCareerDevelopmentEngine",
  },
  {
    id: "aipifyWellbeingSustainablePerformanceEngine",
    href: "/app/aipify-wellbeing-sustainable-performance-engine",
    labelKey: "navigation.nav.aipifyWellbeingSustainablePerformanceEngine",
  },
  {
    id: "aipifyHosts",
    href: "/app/aipify-hosts",
    labelKey: "navigation.nav.aipifyHosts",
  },
  {
    id: "aipifyTalentAcquisitionWorkforcePlanningEngine",
    href: "/app/aipify-talent-acquisition-workforce-planning-engine",
    labelKey: "navigation.nav.aipifyTalentAcquisitionWorkforcePlanningEngine",
  },
  {
    id: "aipifyPerformanceGoalAlignmentEngine",
    href: "/app/aipify-performance-goal-alignment-engine",
    labelKey: "navigation.nav.aipifyPerformanceGoalAlignmentEngine",
  },
  {
    id: "aipifyOrganizationalInsightsExecutiveIntelligenceEngine",
    href: "/app/aipify-organizational-insights-executive-intelligence-engine",
    labelKey: "navigation.nav.aipifyOrganizationalInsightsExecutiveIntelligenceEngine",
  },
  {
    id: "aipifyCustomerFeedbackVoiceOfTheCustomerEngine",
    href: "/app/aipify-customer-feedback-voice-of-the-customer-engine",
    labelKey: "navigation.nav.aipifyCustomerFeedbackVoiceOfTheCustomerEngine",
  },
  {
    id: "aipifyEnterprisePolicyComplianceManagementEngine",
    href: "/app/aipify-enterprise-policy-compliance-management-engine",
    labelKey: "navigation.nav.aipifyEnterprisePolicyComplianceManagementEngine",
  },
  {
    id: "aipifyEnterpriseRiskResilienceEngine",
    href: "/app/aipify-enterprise-risk-resilience-engine",
    labelKey: "navigation.nav.aipifyEnterpriseRiskResilienceEngine",
  },
  {
    id: "aipifyBusinessContinuityCrisisManagementEngine",
    href: "/app/aipify-business-continuity-crisis-management-engine",
    labelKey: "navigation.nav.aipifyBusinessContinuityCrisisManagementEngine",
  },
  {
    id: "aipifyVendorThirdPartyRelationshipEngine",
    href: "/app/aipify-vendor-third-party-relationship-engine",
    labelKey: "navigation.nav.aipifyVendorThirdPartyRelationshipEngine",
  },
  {
    id: "aipifyStudioCreativeIntelligenceEngine",
    href: "/app/aipify-studio-creative-intelligence-engine",
    labelKey: "navigation.nav.aipifyStudioCreativeIntelligenceEngine",
  },
  {
    id: "aipifyDocumentIntelligenceEnterpriseDocumentEngine",
    href: "/app/aipify-document-intelligence-enterprise-document-engine",
    labelKey: "navigation.nav.aipifyDocumentIntelligenceEnterpriseDocumentEngine",
  },
  {
    id: "aipifyEnterpriseWorkflowAutomationEngine",
    href: "/app/aipify-enterprise-workflow-automation-engine",
    labelKey: "navigation.nav.aipifyEnterpriseWorkflowAutomationEngine",
  },
  {
    id: "aipifyEnterpriseIntegrationHubEngine",
    href: "/app/aipify-enterprise-integration-hub-engine",
    labelKey: "navigation.nav.aipifyEnterpriseIntegrationHubEngine",
  },
  {
    id: "aipifyEnterpriseNotificationAttentionManagementEngine",
    href: "/app/aipify-enterprise-notification-attention-management-engine",
    labelKey: "navigation.nav.aipifyEnterpriseNotificationAttentionManagementEngine",
  },
  {
    id: "aipifyEnterpriseSearchUniversalKnowledgeAccessEngine",
    href: "/app/aipify-enterprise-search-universal-knowledge-access-engine",
    labelKey: "navigation.nav.aipifyEnterpriseSearchUniversalKnowledgeAccessEngine",
  },
  {
    id: "aipifyEnterpriseAnalyticsOperationalIntelligenceEngine",
    href: "/app/aipify-enterprise-analytics-operational-intelligence-engine",
    labelKey: "navigation.nav.aipifyEnterpriseAnalyticsOperationalIntelligenceEngine",
  },
  {
    id: "aipifyDesktopCompanionCreativeBridgeEngine",
    href: "/app/aipify-desktop-companion-creative-bridge-engine",
    labelKey: "navigation.nav.aipifyDesktopCompanionCreativeBridgeEngine",
  },
  {
    id: "aipifyEnterpriseCalendarPersonalAssistantEngine",
    href: "/app/aipify-enterprise-calendar-personal-assistant-engine",
    labelKey: "navigation.nav.aipifyEnterpriseCalendarPersonalAssistantEngine",
  },
  {
    id: "aipifyTranslateMultilingualWorkforceEngine",
    href: "/app/aipify-translate-multilingual-workforce-engine",
    labelKey: "navigation.nav.aipifyTranslateMultilingualWorkforceEngine",
  },
  {
    id: "aipifyEnterpriseOnboardingGuidedAdoptionEngine",
    href: "/app/aipify-enterprise-onboarding-guided-adoption-engine",
    labelKey: "navigation.nav.aipifyEnterpriseOnboardingGuidedAdoptionEngine",
  },
  {
    id: "aipifyEnterpriseMeetingIntelligenceCollaborationEngine",
    href: "/app/aipify-enterprise-meeting-intelligence-collaboration-engine",
    labelKey: "navigation.nav.aipifyEnterpriseMeetingIntelligenceCollaborationEngine",
  },
  {
    id: "aipifyMeetingIntelligenceFollowUpEngine",
    href: "/app/aipify-meeting-intelligence-follow-up-engine",
    labelKey: "navigation.nav.aipifyMeetingIntelligenceFollowUpEngine",
  },
  {
    id: "aipifyUnifiedWorkspaceEngine",
    href: "/app/aipify-unified-workspace-engine",
    labelKey: "navigation.nav.aipifyUnifiedWorkspaceEngine",
  },
  {
    id: "aipifyGlobalCommandCenterEngine",
    href: "/app/aipify-global-command-center-engine",
    labelKey: "navigation.nav.aipifyGlobalCommandCenterEngine",
  },
  {
    id: "aipifyDigitalHeadquartersEngine",
    href: "/app/aipify-digital-headquarters-engine",
    labelKey: "navigation.nav.aipifyDigitalHeadquartersEngine",
  },
  {
    id: "aipifyOrganizationalHealthEarlyWarningEngine",
    href: "/app/aipify-organizational-health-early-warning-engine",
    labelKey: "navigation.nav.aipifyOrganizationalHealthEarlyWarningEngine",
  },
  {
    id: "businessPacksFoundationEngine",
    href: "/app/business-packs-foundation-engine",
    labelKey: "navigation.nav.businessPacksFoundationEngine",
  },
  {
    id: "businessPackIdentityEngine",
    href: "/app/business-pack-identity-engine",
    labelKey: "navigation.nav.businessPackIdentityEngine",
  },
  {
    id: "businessPackLicenseEngine",
    href: "/app/business-pack-license-engine",
    labelKey: "navigation.nav.businessPackLicenseEngine",
  },
  {
    id: "businessPackLanguageEngine",
    href: "/app/business-pack-language-engine",
    labelKey: "navigation.nav.businessPackLanguageEngine",
  },
  {
    id: "businessPackLegalEngine",
    href: "/app/business-pack-legal-engine",
    labelKey: "navigation.nav.businessPackLegalEngine",
  },
  {
    id: "businessPackKnowledgeEngine",
    href: "/app/business-pack-knowledge-engine",
    labelKey: "navigation.nav.businessPackKnowledgeEngine",
  },
  {
    id: "businessPackMarketplaceEngine",
    href: "/app/business-pack-marketplace-engine",
    labelKey: "navigation.nav.businessPackMarketplaceEngine",
  },
  {
    id: "industryIntelligenceFoundationEngine",
    href: "/app/industry-intelligence-foundation-engine",
    labelKey: "navigation.nav.industryIntelligenceFoundationEngine",
  },
  {
    id: "marketplacePartnerEcosystemFoundationEngine",
    href: "/app/marketplace-partner-ecosystem-foundation-engine",
    labelKey: "navigation.nav.marketplacePartnerEcosystemFoundationEngine",
  },
  {
    id: "salesExpertEngine",
    href: "/app/sales-expert-engine",
    labelKey: "navigation.nav.salesExpertEngine",
  },
  {
    id: "aiEthicsResponsibleUseEngine",
    href: "/app/ai-ethics-responsible-use-engine",
    labelKey: "navigation.nav.aiEthicsResponsibleUseEngine",
  },
  {
    id: "changeManagementEngine",
    href: "/app/change-management-engine",
    labelKey: "navigation.nav.changeManagementEngine",
  },
  {
    id: "valueRealizationEngine",
    href: "/app/value-realization-engine",
    labelKey: "navigation.nav.valueRealizationEngine",
  },
  {
    id: "organizationalResilienceEngine",
    href: "/app/organizational-resilience-engine",
    labelKey: "navigation.nav.organizationalResilienceEngine",
  },
  {
    id: "securityTrustEngine",
    href: "/app/security-trust-engine",
    labelKey: "navigation.nav.securityTrustEngine",
  },
  {
    id: "incidentResponseCoordinationEngine",
    href: "/app/incident-response-coordination-engine",
    labelKey: "navigation.nav.incidentResponseCoordinationEngine",
  },
  {
    id: "serviceLevelCommitmentEngine",
    href: "/app/service-level-commitment-engine",
    labelKey: "navigation.nav.serviceLevelCommitmentEngine",
  },
  {
    id: "stakeholderCommunicationEngine",
    href: "/app/stakeholder-communication-engine",
    labelKey: "navigation.nav.stakeholderCommunicationEngine",
  },
  {
    id: "organizationalDecisionSupportEngine",
    href: "/app/organizational-decision-support-engine",
    labelKey: "navigation.nav.organizationalDecisionSupportEngine",
  },
  {
    id: "strategicAlignmentEngine",
    href: "/app/strategic-alignment-engine",
    labelKey: "navigation.nav.strategicAlignmentEngine",
  },
  {
    id: "organizationalHealthEngine",
    href: "/app/intelligence/health",
    labelKey: "navigation.nav.organizationalHealthEngine",
  },
  {
    id: "capabilityMaturityEngine",
    href: "/app/intelligence/maturity",
    labelKey: "navigation.nav.capabilityMaturityEngine",
  },
  {
    id: "organizationalBenchmarkingEngine",
    href: "/app/organizational-benchmarking-engine",
    labelKey: "navigation.nav.organizationalBenchmarkingEngine",
  },
  {
    id: "documentOutputEngine",
    href: "/app/document-output-engine",
    labelKey: "navigation.nav.documentOutputEngine",
  },
  {
    id: "recordsRetentionManagementEngine",
    href: "/app/records-retention-management-engine",
    labelKey: "navigation.nav.recordsRetentionManagementEngine",
  },
  {
    id: "meetingCollaborationIntelligenceEngine",
    href: "/app/meeting-collaboration-intelligence-engine",
    labelKey: "navigation.nav.meetingCollaborationIntelligenceEngine",
  },
  {
    id: "unifiedTaskFollowUpEngine",
    href: "/app/unified-task-follow-up-engine",
    labelKey: "navigation.nav.unifiedTaskFollowUpEngine",
  },
  {
    id: "resourcePlanningEngine",
    href: "/app/resource-planning-engine",
    labelKey: "navigation.nav.resourcePlanningEngine",
  },
  {
    id: "capacityWorkloadManagementEngine",
    href: "/app/capacity-workload-management-engine",
    labelKey: "navigation.nav.capacityWorkloadManagementEngine",
  },
  {
    id: "goalsOkrEngine",
    href: "/app/goals-okr-engine",
    labelKey: "navigation.nav.goalsOkrEngine",
  },
  {
    id: "predictiveInsightsEngine",
    href: "/app/predictive-insights-engine",
    labelKey: "navigation.nav.predictiveInsightsEngine",
  },
  {
    id: "crossTenantIntelligenceEngine",
    href: "/app/cross-tenant-intelligence-engine",
    labelKey: "navigation.nav.crossTenantIntelligenceEngine",
  },
  {
    id: "partnerSuccessEngine",
    href: "/app/partner-success-engine",
    labelKey: "navigation.nav.partnerSuccessEngine",
  },
  {
    id: "relationshipIntelligenceEngine",
    href: "/app/intelligence/relationships",
    labelKey: "navigation.nav.relationshipIntelligenceEngine",
  },
  {
    id: "trustReputationEngine",
    href: "/app/trust-reputation-engine",
    labelKey: "navigation.nav.trustReputationEngine",
  },
  {
    id: "aiCostGovernanceEngine",
    href: "/app/ai-cost-governance-engine",
    labelKey: "navigation.nav.aiCostGovernanceEngine",
  },
  {
    id: "personalProductivityEngine",
    href: "/app/personal-productivity-engine",
    labelKey: "navigation.nav.personalProductivityEngine",
  },
  {
    id: "companionContextEngine",
    href: "/app/companion/context",
    labelKey: "navigation.nav.companionContextEngine",
  },
  {
    id: "companionMemoryExpansionEngine",
    href: "/app/companion/memory",
    labelKey: "navigation.nav.companionMemoryExpansionEngine",
  },
  {
    id: "companionRecommendationEngine",
    href: "/app/companion/recommendations",
    labelKey: "navigation.nav.companionRecommendationEngine",
  },
  {
    id: "companionProactiveInsightsEngine",
    href: "/app/companion/proactive-insights",
    labelKey: "navigation.nav.companionProactiveInsightsEngine",
  },
  {
    id: "companionPersonalizationEngine",
    href: "/app/companion/personalization",
    labelKey: "navigation.nav.companionPersonalizationEngine",
  },
  {
    id: "companionDailyBriefingCenter",
    href: "/app/companion/daily-briefing",
    labelKey: "navigation.nav.companionDailyBriefingCenter",
  },
  {
    id: "companionWorkPrioritizationEngine",
    href: "/app/companion/work-prioritization",
    labelKey: "navigation.nav.companionWorkPrioritizationEngine",
  },
  {
    id: "companionFollowUpEngine",
    href: "/app/companion/follow-ups",
    labelKey: "navigation.nav.companionFollowUpEngine",
  },
  {
    id: "companionRelationshipIntelligenceEngine",
    href: "/app/companion/relationship-intelligence",
    labelKey: "navigation.nav.companionRelationshipIntelligenceEngine",
  },
  {
    id: "companionExecutiveLayer",
    href: "/app/companion/executive",
    labelKey: "navigation.nav.companionExecutiveLayer",
  },
  {
    id: "companionOrchestrationEngine",
    href: "/app/companion/orchestration",
    labelKey: "navigation.nav.companionOrchestrationEngine",
  },
  {
    id: "companionGovernanceEngine",
    href: "/app/companion/governance",
    labelKey: "navigation.nav.companionGovernanceEngine",
  },
  {
    id: "companionEcosystemEngine",
    href: "/app/companion/ecosystem",
    labelKey: "navigation.nav.companionEcosystemEngine",
  },
  {
    id: "companionServicesMarketplace",
    href: "/app/companion/services",
    labelKey: "navigation.nav.companionServicesMarketplace",
  },
  {
    id: "companionRealWorldCoordinationEngine",
    href: "/app/companion/services/actions",
    labelKey: "navigation.nav.companionRealWorldCoordinationEngine",
  },
  {
    id: "companionBookingsEngine",
    href: "/app/companion/bookings",
    labelKey: "navigation.nav.companionBookingsEngine",
  },
  {
    id: "companionExtensionsMarketplaceEngine",
    href: "/app/companion/marketplace",
    labelKey: "navigation.nav.companionExtensionsMarketplaceEngine",
  },
  {
    id: "companionActionApprovalEngine",
    href: "/app/companion/actions",
    labelKey: "navigation.nav.companionActionApprovalEngine",
  },
  {
    id: "companionActionMemoryEngine",
    href: "/app/companion/action-memory",
    labelKey: "navigation.nav.companionActionMemoryEngine",
  },
  {
    id: "presenceContinuityEngine",
    href: "/app/companion/presence-continuity",
    labelKey: "navigation.nav.presenceContinuityEngine",
  },
  {
    id: "companionIdentityCenter",
    href: "/app/companion/identity",
    labelKey: "navigation.nav.companionIdentityCenter",
  },
  {
    id: "companionIdentityRelationshipEngine",
    href: "/app/companion/identity-relationship",
    labelKey: "navigation.nav.companionIdentityRelationshipEngine",
  },
  {
    id: "companionRelationshipEngine",
    href: "/app/companion/relationship",
    labelKey: "navigation.nav.companionRelationshipEngine",
  },
  {
    id: "lifeEventsEngine",
    href: "/app/companion/life-events",
    labelKey: "navigation.nav.lifeEventsEngine",
  },
  {
    id: "trustAdoptionEngine",
    href: "/app/companion/trust-adoption",
    labelKey: "navigation.nav.trustAdoptionEngine",
  },
  {
    id: "proactiveCompanionEngine",
    href: "/app/proactive-companion-engine",
    labelKey: "navigation.nav.proactiveCompanionEngine",
  },
  {
    id: "companionDeviceEcosystemEngine",
    href: "/app/companion-device-ecosystem-engine",
    labelKey: "navigation.nav.companionDeviceEcosystemEngine",
  },
  {
    id: "selfLoveEngine",
    href: "/app/self-love-engine",
    labelKey: "navigation.nav.selfLoveEngine",
  },
  {
    id: "growthEvolutionEngine",
    href: "/app/growth-evolution-engine",
    labelKey: "navigation.nav.growthEvolutionEngine",
  },
  {
    id: "priorityFocusEngine",
    href: "/app/priority-focus-engine",
    labelKey: "navigation.nav.priorityFocusEngine",
  },
  {
    id: "purposeValuesEngine",
    href: "/app/purpose-values-engine",
    labelKey: "navigation.nav.purposeValuesEngine",
  },
  {
    id: "inclusionHumanityEngine",
    href: "/app/inclusion-humanity-engine",
    labelKey: "navigation.nav.inclusionHumanityEngine",
  },
  {
    id: "companionIdentityEngine",
    href: "/app/companion-identity-engine",
    labelKey: "navigation.nav.companionIdentityEngine",
  },
  {
    id: "abosImpactEngine",
    href: "/app/impact-engine",
    labelKey: "navigation.nav.abosImpactEngine",
  },
  {
    id: "socialImpactPurposeEngine",
    href: "/app/social-impact-purpose-engine",
    labelKey: "navigation.nav.socialImpactPurposeEngine",
  },
  {
    id: "legacyEngine",
    href: "/app/legacy-engine",
    labelKey: "navigation.nav.legacyEngine",
  },
  {
    id: "curiosityDiscoveryEngine",
    href: "/app/curiosity-discovery-engine",
    labelKey: "navigation.nav.curiosityDiscoveryEngine",
  },
  {
    id: "wonderEngine",
    href: "/app/wonder-engine",
    labelKey: "navigation.nav.wonderEngine",
  },
  {
    id: "gratitudeRecognitionEngine",
    href: "/app/gratitude-recognition-engine",
    labelKey: "navigation.nav.gratitudeRecognitionEngine",
  },
  {
    id: "presenceComfortProtocol",
    href: "/app/presence-comfort-protocol",
    labelKey: "navigation.nav.presenceComfortProtocol",
  },
  {
    id: "dedicationEngine",
    href: "/app/dedication-engine",
    labelKey: "navigation.nav.dedicationEngine",
  },
  {
    id: "hopeEngine",
    href: "/app/hope-engine",
    labelKey: "navigation.nav.hopeEngine",
  },
  {
    id: "wisdomEngine",
    href: "/app/wisdom-engine",
    labelKey: "navigation.nav.wisdomEngine",
  },
  {
    id: "wisdomInterventionProtocol",
    href: "/app/wisdom-intervention-protocol",
    labelKey: "navigation.nav.wisdomInterventionProtocol",
  },
  { id: "briefing", href: "/app/briefing", labelKey: "navigation.nav.briefing" },
  {
    id: "executiveIntelligenceEngine",
    href: "/app/executive-intelligence",
    labelKey: "navigation.nav.executiveIntelligenceEngine",
  },
  { id: "organizationalIdentityCenterEngine", href: "/app/executive/organizational-identity", labelKey: "navigation.nav.organizationalIdentityCenterEngine" },
  { id: "organizationalPresenceCenterEngine", href: "/app/executive/organizational-presence", labelKey: "navigation.nav.organizationalPresenceCenterEngine" },
  { id: "organizationalBalanceCenterEngine", href: "/app/executive/organizational-balance", labelKey: "navigation.nav.organizationalBalanceCenterEngine" },
  { id: "organizationalAdaptiveIntelligenceCenterEngine", href: "/app/executive/organizational-adaptive-intelligence", labelKey: "navigation.nav.organizationalAdaptiveIntelligenceCenterEngine" },
  { id: "organizationalWisdomTransferCenterEngine", href: "/app/executive/organizational-wisdom-transfer", labelKey: "navigation.nav.organizationalWisdomTransferCenterEngine" },
  { id: "organizationalHopeCenterEngine", href: "/app/executive/organizational-hope", labelKey: "navigation.nav.organizationalHopeCenterEngine" },
  { id: "organizationalCourageCenterEngine", href: "/app/executive/organizational-courage", labelKey: "navigation.nav.organizationalCourageCenterEngine" },
  { id: "organizationalCuriosityCenterEngine", href: "/app/executive/organizational-curiosity", labelKey: "navigation.nav.organizationalCuriosityCenterEngine" },
  { id: "organizationalHarmonyCenterEngine", href: "/app/executive/organizational-harmony", labelKey: "navigation.nav.organizationalHarmonyCenterEngine" },
  { id: "organizationalAwarenessCenterEngine", href: "/app/executive/organizational-awareness", labelKey: "navigation.nav.organizationalAwarenessCenterEngine" },
  { id: "organizationalIntentionalityCenterEngine", href: "/app/executive/organizational-intentionality", labelKey: "navigation.nav.organizationalIntentionalityCenterEngine" },
  { id: "organizationalClarityCenterEngine", href: "/app/executive/organizational-clarity", labelKey: "navigation.nav.organizationalClarityCenterEngine" },
  { id: "organizationalSteadfastnessCenterEngine", href: "/app/executive/organizational-steadfastness", labelKey: "navigation.nav.organizationalSteadfastnessCenterEngine" },
  { id: "organizationalCompoundingCenterEngine", href: "/app/executive/organizational-compounding", labelKey: "navigation.nav.organizationalCompoundingCenterEngine" },
  { id: "organizationalTransformationCenterEngine", href: "/app/executive/organizational-transformation", labelKey: "navigation.nav.organizationalTransformationCenterEngine" },
  { id: "organizationalSustainabilityCenterEngine", href: "/app/executive/organizational-sustainability", labelKey: "navigation.nav.organizationalSustainabilityCenterEngine" },
  { id: "organizationalRenewalCenterEngine", href: "/app/executive/organizational-renewal", labelKey: "navigation.nav.organizationalRenewalCenterEngine" },
  { id: "organizationalFlourishingCenterEngine", href: "/app/executive/organizational-flourishing", labelKey: "navigation.nav.organizationalFlourishingCenterEngine" },
  { id: "organizationalConfidenceCenterEngine", href: "/app/executive/organizational-confidence", labelKey: "navigation.nav.organizationalConfidenceCenterEngine" },
  { id: "organizationalDecisionQualityCenterEngine", href: "/app/executive/organizational-decision-quality", labelKey: "navigation.nav.organizationalDecisionQualityCenterEngine" },
  { id: "organizationalImpactCenterEngine", href: "/app/executive/organizational-impact", labelKey: "navigation.nav.organizationalImpactCenterEngine" },
  { id: "organizationalExcellenceCenterEngine", href: "/app/executive/organizational-excellence", labelKey: "navigation.nav.organizationalExcellenceCenterEngine" },
  { id: "organizationalContinuityCenterEngine", href: "/app/executive/organizational-continuity", labelKey: "navigation.nav.organizationalContinuityCenterEngine" },
  { id: "organizationalCoherenceCenterEngine", href: "/app/executive/organizational-coherence", labelKey: "navigation.nav.organizationalCoherenceCenterEngine" },
  { id: "organizationalFuturesCenterEngine", href: "/app/executive/organizational-futures", labelKey: "navigation.nav.organizationalFuturesCenterEngine" },
  { id: "organizationalMomentumCenterEngine", href: "/app/executive/organizational-momentum", labelKey: "navigation.nav.organizationalMomentumCenterEngine" },
  { id: "organizationalTrustCenterEngine", href: "/app/executive/organizational-trust", labelKey: "navigation.nav.organizationalTrustCenterEngine" },
  { id: "organizationalSignalCenterEngine", href: "/app/executive/organizational-signals", labelKey: "navigation.nav.organizationalSignalCenterEngine" },
  { id: "organizationalSimplicityCenterEngine", href: "/app/executive/organizational-simplicity", labelKey: "navigation.nav.organizationalSimplicityCenterEngine" },
  { id: "organizationalStewardshipCenterEngine", href: "/app/executive/organizational-stewardship", labelKey: "navigation.nav.organizationalStewardshipCenterEngine" },
  { id: "organizationalPurposeCenterEngine", href: "/app/executive/organizational-purpose", labelKey: "navigation.nav.organizationalPurposeCenterEngine" },
  { id: "organizationalLegacyCenterEngine", href: "/app/executive/organizational-legacy", labelKey: "navigation.nav.organizationalLegacyCenterEngine" },
  { id: "organizationalWisdomCenterEngine", href: "/app/executive/organizational-wisdom", labelKey: "navigation.nav.organizationalWisdomCenterEngine" },
  { id: "organizationalAdaptabilityCenterEngine", href: "/app/executive/organizational-adaptability", labelKey: "navigation.nav.organizationalAdaptabilityCenterEngine" },
  { id: "organizationalEnergyCenterEngine", href: "/app/executive/organizational-energy", labelKey: "navigation.nav.organizationalEnergyCenterEngine" },
  { id: "organizationalFocusCenterEngine", href: "/app/executive/organizational-focus", labelKey: "navigation.nav.organizationalFocusCenterEngine" },
  { id: "organizationalAlignmentCenterEngine", href: "/app/executive/organizational-alignment", labelKey: "navigation.nav.organizationalAlignmentCenterEngine" },
  { id: "organizationalPurposefulExecutionCenterEngine", href: "/app/executive/purposeful-execution", labelKey: "navigation.nav.organizationalPurposefulExecutionCenterEngine" },
  { id: "executionExcellenceCenterEngine", href: "/app/executive/execution-excellence", labelKey: "navigation.nav.executionExcellenceCenterEngine" },
  { id: "capabilityMaturityCenterEngine", href: "/app/executive/capability-maturity", labelKey: "navigation.nav.capabilityMaturityCenterEngine" },
  { id: "organizationalDigitalTwinCenterEngine", href: "/app/executive/organizational-digital-twin", labelKey: "navigation.nav.organizationalDigitalTwinCenterEngine" },
  { id: "changeManagementCenterEngine", href: "/app/executive/change-management", labelKey: "navigation.nav.changeManagementCenterEngine" },
  { id: "organizationalHealthCenterEngine", href: "/app/executive/organizational-health", labelKey: "navigation.nav.organizationalHealthCenterEngine" },
  { id: "opportunityDiscoveryCenterEngine", href: "/app/executive/opportunity-discovery", labelKey: "navigation.nav.opportunityDiscoveryCenterEngine" },
  { id: "organizationalResilienceCenterEngine", href: "/app/executive/organizational-resilience", labelKey: "navigation.nav.organizationalResilienceCenterEngine" },
  { id: "continuousImprovementCenterEngine", href: "/app/executive/continuous-improvement", labelKey: "navigation.nav.continuousImprovementCenterEngine" },
  { id: "executiveStrategicIntelligenceEngine", href: "/app/executive/strategic-intelligence", labelKey: "navigation.nav.executiveStrategicIntelligenceEngine" },
  { id: "executiveDigitalBoardMemberEngine", href: "/app/executive/board", labelKey: "navigation.nav.executiveDigitalBoardMemberEngine" },
  {
    id: "enterpriseStrategicIntelligenceAdvisoryEngine",
    href: "/app/intelligence/strategy",
    labelKey: "navigation.nav.enterpriseStrategicIntelligenceAdvisoryEngine",
  },
  { id: "executiveDecisionSupportEngine", href: "/app/executive/decision-support", labelKey: "navigation.nav.executiveDecisionSupportEngine" },
  { id: "executive", href: "/app/executive", labelKey: "navigation.nav.executive" },
  { id: "presence", href: "/app/presence", labelKey: "navigation.nav.presence" },
  { id: "assistant", href: "/app/assistant", labelKey: "navigation.nav.assistant" },
  {
    id: "recommendations",
    href: "/app/recommendations",
    labelKey: "navigation.nav.recommendations",
  },
  { id: "learning", href: "/app/learning", labelKey: "navigation.nav.learning" },
  { id: "skills", href: "/app/skills", labelKey: "navigation.nav.skills" },
  {
    id: "companionActionMarketplaceEngine",
    href: "/app/marketplace/companion-actions",
    labelKey: "navigation.nav.companionActionMarketplaceEngine",
  },
  { id: "marketplace", href: "/app/marketplace", labelKey: "navigation.nav.marketplace" },
  { id: "appStore", href: "/app/store", labelKey: "navigation.nav.appStore" },
  { id: "appAnalytics", href: "/app/analytics", labelKey: "navigation.nav.appAnalytics" },
  { id: "appLicenses", href: "/app/licenses", labelKey: "navigation.nav.appLicenses" },
  { id: "appEmployees", href: "/app/employees", labelKey: "navigation.nav.appEmployees" },
  { id: "appPeople", href: "/app/people", labelKey: "navigation.nav.appPeople" },
  { id: "appKnowledge", href: "/app/knowledge", labelKey: "navigation.nav.appKnowledge" },
  { id: "appDocuments", href: "/app/documents", labelKey: "navigation.nav.appDocuments" },
  { id: "appPlaybooks", href: "/app/playbooks", labelKey: "navigation.nav.appPlaybooks" },
  { id: "appCustomers", href: "/app/customers", labelKey: "navigation.nav.appCustomers" },
  { id: "appCases", href: "/app/cases", labelKey: "navigation.nav.appCases" },
  { id: "appFinance", href: "/app/finance", labelKey: "navigation.nav.appFinance" },
  { id: "appProjects", href: "/app/projects", labelKey: "navigation.nav.appProjects" },
  { id: "appSales", href: "/app/sales", labelKey: "navigation.nav.appSales" },
  { id: "appMarketing", href: "/app/marketing", labelKey: "navigation.nav.appMarketing" },
  { id: "appScheduling", href: "/app/scheduling", labelKey: "navigation.nav.appScheduling" },
  { id: "appCalendar", href: "/app/calendar", labelKey: "navigation.nav.appCalendar" },
  { id: "appEvents", href: "/app/events", labelKey: "navigation.nav.appEvents" },
  { id: "appSystemHealth", href: "/app/system-health", labelKey: "navigation.nav.appSystemHealth" },
  { id: "appBookings", href: "/app/bookings", labelKey: "navigation.nav.appBookings" },
  { id: "appNotifications", href: "/app/notifications", labelKey: "navigation.nav.appNotifications" },
  { id: "appExecutiveAlerts", href: "/app/executive-alerts", labelKey: "navigation.nav.appExecutiveAlerts" },
  { id: "appMobileApiIntegration", href: "/app/integrations/mobile-api", labelKey: "navigation.nav.appMobileApiIntegration" },
  { id: "appIntegrationHub", href: "/app/integrations", labelKey: "navigation.nav.appIntegrationHub" },
  { id: "appSimulationOperations", href: "/app/simulation", labelKey: "navigation.nav.appSimulationOperations" },
  { id: "appExecutionOperations", href: "/app/execution", labelKey: "navigation.nav.appExecutionOperations" },
  { id: "appCompanionPresenceOperations", href: "/app/companion", labelKey: "navigation.nav.appCompanionPresenceOperations" },
  { id: "appAssets", href: "/app/assets", labelKey: "navigation.nav.appAssets" },
  { id: "appProcurement", href: "/app/procurement", labelKey: "navigation.nav.appProcurement" },
  { id: "appQualityOperations", href: "/app/quality-operations", labelKey: "navigation.nav.appQualityOperations" },
  { id: "appRiskOperations", href: "/app/risk", labelKey: "navigation.nav.appRiskOperations" },
  { id: "appStrategicIntelligence", href: "/app/intelligence", labelKey: "navigation.nav.appStrategicIntelligence" },
  { id: "appAutomationOperations", href: "/app/automation", labelKey: "navigation.nav.appAutomationOperations" },
  { id: "appUniversalSearch", href: "/app/search", labelKey: "navigation.nav.appUniversalSearch" },
  { id: "appActivityOperations", href: "/app/activity", labelKey: "navigation.nav.appActivityOperations" },
  { id: "appCompanionCommandCenter", href: "/app/command-center", labelKey: "navigation.nav.appCompanionCommandCenter" },
  { id: "appKnowledgeGraph", href: "/app/knowledge-graph", labelKey: "navigation.nav.appKnowledgeGraph" },
  { id: "appKnowledgeNetwork", href: "/app/knowledge-network", labelKey: "navigation.nav.appKnowledgeNetwork" },
  { id: "appMarketObservatory", href: "/app/market-intelligence", labelKey: "navigation.nav.appMarketObservatory" },
  { id: "appRevenueOperations", href: "/app/revenue", labelKey: "navigation.nav.appRevenueOperations" },
  { id: "appAiWorkforce", href: "/app/workforce", labelKey: "navigation.nav.appAiWorkforce" },
  { id: "appCompanionSkills", href: "/app/companion/skills", labelKey: "navigation.nav.appCompanionSkills" },
  { id: "appInventory", href: "/app/inventory", labelKey: "navigation.nav.appInventory" },
  { id: "appForms", href: "/app/forms", labelKey: "navigation.nav.appForms" },
  { id: "companionMarketplaceEngine", href: "/app/companion-marketplace", labelKey: "navigation.nav.companionMarketplaceEngine" },
  { id: "industryBlueprints", href: "/app/industry-blueprints", labelKey: "navigation.nav.industryBlueprints" },
  { id: "globalLearning", href: "/app/global-learning", labelKey: "navigation.nav.globalLearning" },
  { id: "evolution", href: "/app/evolution", labelKey: "navigation.nav.evolution" },
  { id: "valueEngine", href: "/app/value-engine", labelKey: "navigation.nav.valueEngine" },
  { id: "outcomesEngine", href: "/app/outcomes", labelKey: "navigation.nav.outcomesEngine" },
  { id: "agents", href: "/app/agents", labelKey: "navigation.nav.agents" },
  {
    id: "companionWorkforceEngine",
    href: "/app/companion-workforce-engine",
    labelKey: "navigation.nav.companionWorkforceEngine",
  },
  { id: "appEcosystem", href: "/app/apps", labelKey: "navigation.nav.appEcosystem" },
  { id: "trustEngine", href: "/app/trust", labelKey: "navigation.nav.trustEngine" },
  { id: "digitalTwin", href: "/app/intelligence/digital-twin", labelKey: "navigation.nav.digitalTwin" },
  { id: "simulationLab", href: "/app/simulations", labelKey: "navigation.nav.simulationLab" },
  { id: "operationsCenter", href: "/app/operations", labelKey: "navigation.nav.operationsCenter" },
  { id: "continuityEngine", href: "/app/continuity", labelKey: "navigation.nav.continuityEngine" },
  { id: "strategyEngine", href: "/app/strategy", labelKey: "navigation.nav.strategyEngine" },
  { id: "workforceScheduling", href: "/app/workforce-scheduling", labelKey: "navigation.nav.workforceScheduling" },
  { id: "serviceCheckout", href: "/app/checkout", labelKey: "navigation.nav.serviceCheckout" },
  { id: "humanSuccessEngine", href: "/app/human-success", labelKey: "navigation.nav.humanSuccessEngine" },
  { id: "customerLifecycleEngine", href: "/app/customer-lifecycle", labelKey: "navigation.nav.customerLifecycleEngine" },
  { id: "platformIntegrityEngine", href: "/app/integrity", labelKey: "navigation.nav.platformIntegrityEngine" },
  { id: "ecosystemIntelligenceEngine", href: "/app/ecosystem-intelligence", labelKey: "navigation.nav.ecosystemIntelligenceEngine" },
  {
    id: "ecosystemOrchestrationEngine",
    href: "/app/ecosystem-orchestration",
    labelKey: "navigation.nav.ecosystemOrchestrationEngine",
  },
  { id: "communityIntelligenceEngine", href: "/app/community", labelKey: "navigation.nav.communityIntelligenceEngine" },
  { id: "marketplaceGovernanceEngine", href: "/app/marketplace-governance", labelKey: "navigation.nav.marketplaceGovernanceEngine" },
  { id: "ecosystemGovernanceEngine", href: "/app/ecosystem-governance", labelKey: "navigation.nav.ecosystemGovernanceEngine" },
  { id: "partnerCertificationEngine", href: "/app/partners", labelKey: "navigation.nav.partnerCertificationEngine" },
  { id: "growthPartnerOperationsEngine", href: "/app/growth-partner-operations", labelKey: "navigation.nav.growthPartnerOperationsEngine" },
  { id: "growthPartnerDashboard", href: "/app/growth-partner", labelKey: "navigation.nav.growthPartnerDashboard" },
  { id: "growthPartnerAcademy", href: "/app/growth-partner/academy", labelKey: "navigation.nav.growthPartnerAcademy" },
  { id: "growthPartnerMarketing", href: "/app/growth-partner/marketing", labelKey: "navigation.nav.growthPartnerMarketing" },
  { id: "growthPartnerResourceCenter", href: "/app/growth-partner/resource-center", labelKey: "navigation.nav.growthPartnerResourceCenter" },
  { id: "growthPartnerBusinessPlanning", href: "/app/growth-partner/business-planning", labelKey: "navigation.nav.growthPartnerBusinessPlanning" },
  { id: "commercialModelEngine", href: "/app/commercial", labelKey: "navigation.nav.commercialModelEngine" },
  { id: "academyEngine", href: "/app/academy", labelKey: "navigation.nav.academyEngine" },
  { id: "globalExpansionEngine", href: "/app/global-expansion", labelKey: "navigation.nav.globalExpansionEngine" },
  { id: "innovationLabEngine", href: "/app/innovation-lab", labelKey: "navigation.nav.innovationLabEngine" },
  { id: "futureTechEngine", href: "/app/future-tech", labelKey: "navigation.nav.futureTechEngine" },
  { id: "constitutionEngine", href: "/app/constitution", labelKey: "navigation.nav.constitutionEngine" },
  { id: "manifestoEngine", href: "/app/manifesto", labelKey: "navigation.nav.manifestoEngine" },
  { id: "platformInstallEngine", href: "/app/platform-install", labelKey: "navigation.nav.platformInstallEngine" },
  { id: "commerceCompanionEngine", href: "/app/commerce-companion", labelKey: "navigation.nav.commerceCompanionEngine" },
  { id: "commerceIntelligenceEngine", href: "/app/commerce-intelligence", labelKey: "navigation.nav.commerceIntelligenceEngine" },
  { id: "productAutomationEngine", href: "/app/product-automation", labelKey: "navigation.nav.productAutomationEngine" },
  { id: "dropshippingOperationsEngine", href: "/app/dropshipping-operations", labelKey: "navigation.nav.dropshippingOperationsEngine" },
  { id: "commercePerformanceEngine", href: "/app/commerce-performance", labelKey: "navigation.nav.commercePerformanceEngine" },
  { id: "multiStoreOrchestrationEngine", href: "/app/multi-store", labelKey: "navigation.nav.multiStoreOrchestrationEngine" },
  { id: "globalCommerceExpansionEngine", href: "/app/global-commerce-expansion", labelKey: "navigation.nav.globalCommerceExpansionEngine" },
  { id: "supplierIntelligenceEngine", href: "/app/supplier-intelligence", labelKey: "navigation.nav.supplierIntelligenceEngine" },
  { id: "personalityEngine", href: "/app/personality", labelKey: "navigation.nav.personalityEngine" },
  { id: "approvals", href: "/app/approvals", labelKey: "navigation.nav.approvals" },
  { id: "actionCenter", href: "/app/action-center", labelKey: "navigation.nav.actionCenter" },
  {
    id: "realWorldActionServiceOrchestrationEngine",
    href: "/app/actions",
    labelKey: "navigation.nav.realWorldActionServiceOrchestrationEngine",
  },
  { id: "businessPulse", href: "/app/business-pulse", labelKey: "navigation.nav.businessPulse" },
  { id: "strategicGoals", href: "/app/goals", labelKey: "navigation.nav.strategicGoals" },
  { id: "frictionIntelligence", href: "/app/friction", labelKey: "navigation.nav.frictionIntelligence" },
  { id: "evolutionCenter", href: "/app/evolution", labelKey: "navigation.nav.evolutionCenter" },
  { id: "businessContinuityCenter", href: "/app/business-continuity", labelKey: "navigation.nav.businessContinuityCenter" },
  { id: "absenceCoverage", href: "/app/absence", labelKey: "navigation.nav.absenceCoverage" },
  { id: "aosCenter", href: "/app/aos", labelKey: "navigation.nav.aosCenter" },
  { id: "knowledgeFabricCenter", href: "/app/knowledge-fabric", labelKey: "navigation.nav.knowledgeFabricCenter" },
  { id: "companionFeedbackCenter", href: "/app/feedback", labelKey: "navigation.nav.companionFeedbackCenter" },
  { id: "organizationalMemory", href: "/app/memory", labelKey: "navigation.nav.organizationalMemory" },
  { id: "organizationalIntelligence", href: "/app/organizational-intelligence", labelKey: "navigation.nav.organizationalIntelligence" },
  { id: "predictiveIntelligence", href: "/app/predictions", labelKey: "navigation.nav.predictiveIntelligence" },
  {
    id: "incidentCommandCenterEngine",
    href: "/app/operations/incident-command",
    labelKey: "navigation.nav.incidentCommandCenterEngine",
  },
  {
    id: "platformObservabilityCenterEngine",
    href: "/app/operations/platform-observability",
    labelKey: "navigation.nav.platformObservabilityCenterEngine",
  },
  {
    id: "deploymentGovernanceCenterEngine",
    href: "/app/operations/deployments",
    labelKey: "navigation.nav.deploymentGovernanceCenterEngine",
  },
  {
    id: "databaseGovernanceCenterEngine",
    href: "/app/operations/database-governance",
    labelKey: "navigation.nav.databaseGovernanceCenterEngine",
  },
  {
    id: "automationControlCenterEngine",
    href: "/app/operations/automation-control",
    labelKey: "navigation.nav.automationControlCenterEngine",
  },
  { id: "adaptiveAutomation", href: "/app/automations", labelKey: "navigation.nav.adaptiveAutomation" },
  {
    id: "financialGuardrailsEngine",
    href: "/app/governance/financial-guardrails",
    labelKey: "navigation.nav.financialGuardrailsEngine",
  },
  {
    id: "enterpriseGovernanceTrustEngine",
    href: "/app/governance/trust",
    labelKey: "navigation.nav.enterpriseGovernanceTrustEngine",
  },
  {
    id: "trustTransparencyEngine",
    href: "/app/governance/trust-transparency",
    labelKey: "navigation.nav.trustTransparencyEngine",
  },
  {
    id: "permissionAccessGovernanceEngine",
    href: "/app/governance/permissions-access",
    labelKey: "navigation.nav.permissionAccessGovernanceEngine",
  },
  {
    id: "approvalHumanOversightEngine",
    href: "/app/governance/approval-center",
    labelKey: "navigation.nav.approvalHumanOversightEngine",
  },
  {
    id: "approvalProfilesEngine",
    href: "/app/governance/approval-profiles",
    labelKey: "navigation.nav.approvalProfilesEngine",
  },
  {
    id: "digitalWorkforceGovernanceEngine",
    href: "/app/governance/digital-workforce",
    labelKey: "navigation.nav.digitalWorkforceGovernanceEngine",
  },
  { id: "governance", href: "/app/governance", labelKey: "navigation.nav.governance" },
  { id: "enterprise", href: "/app/enterprise", labelKey: "navigation.nav.enterprise" },
  { id: "quality", href: "/app/quality", labelKey: "navigation.nav.quality" },
  { id: "knowledgeEvolutionCenterEngine", href: "/app/knowledge/evolution", labelKey: "navigation.nav.knowledgeEvolutionCenterEngine" },
  { id: "organizationalLearningCenterEngine", href: "/app/knowledge-center/organizational-learning", labelKey: "navigation.nav.organizationalLearningCenterEngine" },
  { id: "organizationalMemoryCenterEngine", href: "/app/knowledge-center/organizational-memory", labelKey: "navigation.nav.organizationalMemoryCenterEngine" },
  {
    id: "enterpriseOrganizationalMemoryEngine",
    href: "/app/knowledge/memory",
    labelKey: "navigation.nav.enterpriseOrganizationalMemoryEngine",
  },
  { id: "knowledgeCenter", href: "/app/knowledge-center", labelKey: "navigation.nav.knowledgeCenter" },
  { id: "installations", href: "/app/installations", labelKey: "navigation.nav.installations" },
  { id: "domains", href: "/app/domains", labelKey: "navigation.nav.domains" },
  { id: "team", href: "/app/team", labelKey: "navigation.nav.team" },
  { id: "license", href: "/app/license", labelKey: "navigation.nav.license" },
  { id: "security", href: "/app/security", labelKey: "navigation.nav.security" },
  { id: "orchestration", href: "/app/orchestration", labelKey: "navigation.nav.orchestration" },
  { id: "settings", href: "/app/settings", labelKey: "navigation.nav.settings" },
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
  if (pathname.startsWith("/app/industry-packs")) return "industryPackEcosystemEngine";
  if (pathname.startsWith("/app/hospitality")) return "hospitalityAccommodationPack";
  if (pathname === "/app/commerce" || pathname.startsWith("/app/commerce/")) {
    return "commerceRetailOperationsPack";
  }
  if (pathname.startsWith("/app/real-estate")) return "realEstatePortfolioOperationsPack";
  if (pathname.startsWith("/app/construction")) return "constructionProjectFieldOperationsPack";
  if (pathname.startsWith("/app/logistics")) return "logisticsTransportationFleetOperationsPack";
  if (pathname.startsWith("/app/manufacturing")) return "manufacturingProductionIndustrialOperationsPack";
  if (pathname.startsWith("/app/education")) return "educationTrainingLearningOperationsPack";
  if (pathname.startsWith("/app/healthcare")) return "healthcareClinicPatientOperationsPack";
  if (pathname.startsWith("/app/legal")) return "legalComplianceCaseOperationsPack";
  if (pathname.startsWith("/app/professional-services")) {
    return "professionalServicesConsultingClientDeliveryPack";
  }
  if (pathname.startsWith("/app/digital-employees/legacy-lifecycle")) return "digitalEmployeeLifecycleEngine";
  if (
    pathname === "/app/digital-employees" ||
    pathname.startsWith("/app/digital-employees/employees") ||
    pathname.startsWith("/app/digital-employees/roles") ||
    pathname.startsWith("/app/digital-employees/assignments") ||
    pathname.startsWith("/app/digital-employees/performance") ||
    pathname.startsWith("/app/digital-employees/approvals") ||
    pathname.startsWith("/app/digital-employees/permissions") ||
    pathname.startsWith("/app/digital-employees/reports")
  ) {
    return "digitalEmployeeCenter";
  }
  if (pathname.startsWith("/app/digital-employees")) return "digitalEmployeeCenter";
  if (pathname.startsWith("/app/digital-workforce/value")) return "digitalWorkforceValueEngine";
  if (pathname.startsWith("/app/digital-workforce")) return "digitalWorkforceRecruitmentEngine";
  if (pathname.startsWith("/app/context-intelligence-engine")) return "contextIntelligenceEngine";
  if (pathname.startsWith("/app/identity-access")) return "identityPermissionsEngine";
  if (pathname.startsWith("/app/secure-ai-actions")) return "secureAiActionEngine";
  if (pathname.startsWith("/app/audit-accountability")) return "auditAccountabilityEngine";
  if (pathname.startsWith("/app/knowledge-center-engine")) return "knowledgeCenterEngine";
  if (pathname.startsWith("/app/admin-assistant-engine")) return "adminAssistantEngine";
  if (pathname.startsWith("/app/support-ai-engine")) return "supportAiEngine";
  if (pathname.startsWith("/app/integration-engine")) return "integrationEngine";
  if (pathname.startsWith("/app/operations-dashboard-engine")) return "operationsDashboardEngine";
  if (pathname.startsWith("/app/onboarding")) return "implementationOnboardingCenter";
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
  if (pathname.startsWith("/app/infrastructure/global")) {
    return "globalDeploymentEnterpriseInfrastructureEngine";
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
  if (pathname.startsWith("/app/intelligence/relationships")) return "relationshipIntelligenceEngine";
  if (pathname.startsWith("/app/relationship-intelligence-engine")) return "relationshipIntelligenceEngine";
  if (pathname.startsWith("/app/intelligence/corporate-brain")) return "corporateBrainEngine";
  if (pathname.startsWith("/app/intelligence/consciousness")) return "organizationalConsciousnessEngine";
  if (pathname.startsWith("/app/intelligence/industry")) return "industryIntelligenceEngine";
  if (pathname.startsWith("/app/intelligence/economy")) return "economicIntelligenceEngine";
  if (pathname.startsWith("/app/intelligence/market")) return "marketIntelligenceEngine";
  if (pathname.startsWith("/app/intelligence/global-expansion")) return "globalExpansionIntelligenceEngine";
  if (pathname.startsWith("/app/intelligence/decisions")) return "decisionIntelligenceEngine";
  if (pathname.startsWith("/app/intelligence/health")) return "organizationalHealthEngine";
  if (pathname.startsWith("/app/intelligence/digital-twin")) return "digitalTwin";
  if (pathname.startsWith("/app/intelligence/improvements")) return "continuousImprovementEngine";
  if (pathname.startsWith("/app/intelligence/maturity")) return "capabilityMaturityEngine";
  if (pathname.startsWith("/app/trust-reputation-engine")) {
    return "trustReputationEngine";
  }
  if (pathname.startsWith("/app/ai-cost-governance-engine")) {
    return "aiCostGovernanceEngine";
  }
  if (pathname.startsWith("/app/personal-productivity-engine")) {
    return "personalProductivityEngine";
  }
  if (pathname === "/app/companion/skills" || pathname.startsWith("/app/companion/skills/")) {
    return "appCompanionSkills";
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
  if (pathname === "/app/companion/relationship") return "companionRelationshipEngine";
  if (pathname.startsWith("/app/companion/executive")) return "companionExecutiveLayer";
  if (pathname.startsWith("/app/companion/marketplace")) return "companionExtensionsMarketplaceEngine";
  if (pathname.startsWith("/app/companion/services/actions")) return "companionRealWorldCoordinationEngine";
  if (pathname.startsWith("/app/companion/bookings")) return "companionBookingsEngine";
  if (pathname.startsWith("/app/companion/services")) return "companionServicesMarketplace";
  if (pathname.startsWith("/app/companion/ecosystem")) return "companionEcosystemEngine";
  if (pathname.startsWith("/app/companion/governance")) return "companionGovernanceEngine";
  if (pathname.startsWith("/app/companion/orchestration")) return "companionOrchestrationEngine";
  if (pathname.startsWith("/app/companion/actions")) return "companionActionApprovalEngine";
  if (pathname.startsWith("/app/companion/action-memory")) return "companionActionMemoryEngine";
  if (pathname.startsWith("/app/companion/presence-continuity")) return "presenceContinuityEngine";
  if (pathname.startsWith("/app/companion/identity-relationship")) return "companionIdentityRelationshipEngine";
  if (pathname === "/app/companion/identity" || pathname.startsWith("/app/companion/identity/")) {
    return "companionIdentityCenter";
  }
  if (pathname.startsWith("/app/companion/life-events")) return "lifeEventsEngine";
  if (pathname.startsWith("/app/companion/trust-adoption")) return "trustAdoptionEngine";
  if (pathname === "/app/companion") return "appCompanionPresenceOperations";
  if (pathname.startsWith("/app/companion/desktop")) return "appCompanionPresenceOperations";
  if (pathname.startsWith("/app/companion/mobile")) return "appCompanionPresenceOperations";
  if (pathname.startsWith("/app/companion/devices")) return "appCompanionPresenceOperations";
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
  if (pathname.startsWith("/app/revenue-growth")) return "revenueGrowthCenter";
  if (pathname.startsWith("/app/customer-success-engine")) return "customerSuccessEngine";
  if (pathname.startsWith("/app/customer-success")) return "customerSuccessAdoptionCenter";
  if (pathname.startsWith("/app/appointments")) return "appointmentBookingEngine";
  if (pathname.startsWith("/app/client-relationships")) return "clientRelationshipEngine";
  if (pathname.startsWith("/app/time-attendance")) return "timeAttendance";
  if (pathname.startsWith("/app/compensation")) return "compensation";
  if (pathname.startsWith("/app/profitability")) return "profitability";
  if (pathname.startsWith("/app/platform/customer-experience")) {
    return "customerExperienceAdoptionDelightEngine";
  }
  if (pathname.startsWith("/app/platform/excellence")) {
    return "platformExcellenceEngine";
  }
  if (pathname === "/app/innovation" || pathname.startsWith("/app/innovation/")) {
    return "enterpriseInnovationRdFutureEngine";
  }
  if (pathname === "/app/ecosystem" || pathname.startsWith("/app/ecosystem/")) {
    return "enterpriseEcosystemPartnerNetworkEngine";
  }
  if (pathname === "/app/future-readiness" || pathname.startsWith("/app/future-readiness/")) {
    return "companionFutureReadinessEngine";
  }
  if (pathname === "/app/resilience" || pathname.startsWith("/app/resilience/")) {
    return "companionResilienceEngine";
  }
  if (pathname === "/app/proactive" || pathname.startsWith("/app/proactive/")) {
    return "companionProactiveEngine";
  }
  if (pathname === "/app/autopilot" || pathname.startsWith("/app/autopilot/")) {
    return "companionAutopilotEngine";
  }
  if (pathname === "/app/executive-copilot" || pathname.startsWith("/app/executive-copilot/")) {
    return "companionExecutiveCopilotEngine";
  }
  if (pathname === "/app/headquarters" || pathname.startsWith("/app/headquarters/")) {
    return "companionHeadquartersEngine";
  }
  if (pathname === "/app/expertise" || pathname.startsWith("/app/expertise/")) {
    return "companionExpertiseEngine";
  }
  if (pathname === "/app/decisions" || pathname.startsWith("/app/decisions/")) {
    return "companionDecisionMemoryEngine";
  }
  if (pathname === "/app/learning-center" || pathname.startsWith("/app/learning-center/")) {
    return "companionOrganizationalLearningEngine";
  }
  if (pathname === "/app/maturity" || pathname.startsWith("/app/maturity/")) {
    return "companionMaturityEvolutionEngine";
  }
  if (pathname === "/app/memory-graph" || pathname.startsWith("/app/memory-graph/")) {
    return "companionMemoryGraphEngine";
  }
  if (pathname === "/app/digital-twin-center" || pathname.startsWith("/app/digital-twin-center/")) {
    return "companionDigitalTwinSimulationEngine";
  }
  if (pathname === "/app/execution-center" || pathname.startsWith("/app/execution-center/")) {
    return "companionExecutionOutcomeEngine";
  }
  if (pathname === "/app/workflow-center" || pathname.startsWith("/app/workflow-center/")) {
    return "companionWorkflowProcessEngine";
  }
  if (pathname === "/app/resource-center" || pathname.startsWith("/app/resource-center/")) {
    return "companionResourceCapacityEngine";
  }
  if (pathname === "/app/federation" || pathname.startsWith("/app/federation/")) {
    return "companionFederationEngine";
  }
  if (pathname === "/app/network" || pathname.startsWith("/app/network/")) {
    return "globalBusinessNetworkEngine";
  }
  if (pathname === "/app/value" || pathname.startsWith("/app/value/")) {
    return "enterpriseValueRealizationRoiEngine";
  }
  if (pathname === "/app/autonomous" || pathname.startsWith("/app/autonomous/")) {
    return "autonomousEnterpriseOperationsEngine";
  }
  if (pathname === "/app/autonomy" || pathname.startsWith("/app/autonomy/")) {
    return "autonomousOrganizationEngine";
  }
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
  if (pathname.startsWith("/app/intelligence/strategy")) return "enterpriseStrategicIntelligenceAdvisoryEngine";
  if (pathname.startsWith("/app/executive/board")) return "executiveDigitalBoardMemberEngine";
  if (pathname.startsWith("/app/executive/strategic-intelligence")) return "executiveStrategicIntelligenceEngine";
  if (pathname.startsWith("/app/executive/decision-support")) return "executiveDecisionSupportEngine";
  if (pathname.startsWith("/app/executive")) return "executive";
  if (
    pathname === "/app/command-center" ||
    pathname.startsWith("/app/command-center/since-last-login") ||
    pathname.startsWith("/app/command-center/alerts") ||
    pathname.startsWith("/app/command-center/approvals") ||
    pathname.startsWith("/app/command-center/risks") ||
    pathname.startsWith("/app/command-center/opportunities") ||
    pathname.startsWith("/app/command-center/performance") ||
    pathname.startsWith("/app/command-center/companion-briefing") ||
    pathname.startsWith("/app/command-center/actions")
  ) {
    return "appCompanionCommandCenter";
  }
  if (
    pathname.startsWith("/app/presence") ||
    pathname.startsWith("/app/command-center/connect") ||
    pathname.startsWith("/app/desktop")
  ) {
    return "presence";
  }
  if (pathname.startsWith("/app/assistant")) return "assistant";
  if (pathname.startsWith("/app/recommendations")) return "recommendations";
  if (pathname.startsWith("/app/learning")) return "learning";
  if (pathname.startsWith("/app/skills")) return "skills";
  if (pathname.startsWith("/app/companion-marketplace")) return "companionMarketplaceEngine";
  if (pathname.startsWith("/app/store")) return "appStore";
  if (pathname.startsWith("/app/employees")) return "appEmployees";
  if (pathname.startsWith("/app/people")) return "appPeople";
  if (pathname.startsWith("/app/playbooks")) return "appPlaybooks";
  if (pathname.startsWith("/app/documents")) return "appDocuments";
  if (pathname === "/app/knowledge") return "appKnowledge";
  if (pathname.startsWith("/app/cases")) return "appCases";
  if (pathname.startsWith("/app/finance")) return "appFinance";
  if (pathname.startsWith("/app/projects")) return "appProjects";
  if (pathname.startsWith("/app/sales")) return "appSales";
  if (pathname.startsWith("/app/marketing")) return "appMarketing";
  if (pathname === "/app/scheduling") return "appScheduling";
  if (pathname.startsWith("/app/calendar")) return "appCalendar";
  if (
    pathname === "/app/events" ||
    pathname.startsWith("/app/events/live-activity") ||
    pathname.startsWith("/app/events/signals") ||
    pathname.startsWith("/app/events/alerts") ||
    pathname.startsWith("/app/events/subscriptions") ||
    pathname.startsWith("/app/events/sources") ||
    pathname.startsWith("/app/events/history") ||
    pathname.startsWith("/app/events/reports")
  ) {
    return "appEvents";
  }
  if (
    pathname === "/app/system-health" ||
    pathname.startsWith("/app/system-health/connected-apps") ||
    pathname.startsWith("/app/system-health/business-packs") ||
    pathname.startsWith("/app/system-health/workflows") ||
    pathname.startsWith("/app/system-health/domains") ||
    pathname.startsWith("/app/system-health/notifications") ||
    pathname.startsWith("/app/system-health/recent-incidents") ||
    pathname.startsWith("/app/system-health/maintenance") ||
    pathname.startsWith("/app/system-health/support")
  ) {
    return "appSystemHealth";
  }
  if (pathname.startsWith("/app/bookings")) return "appBookings";
  if (pathname.startsWith("/app/notifications")) return "appNotifications";
  if (pathname.startsWith("/app/executive-alerts")) return "appExecutiveAlerts";
  if (pathname.startsWith("/app/integrations/mobile-api")) return "appMobileApiIntegration";
  if (pathname === "/app/integrations" || pathname.startsWith("/app/integrations/")) return "appIntegrationHub";
  if (pathname.startsWith("/app/assets")) return "appAssets";
  if (pathname.startsWith("/app/procurement")) return "appProcurement";
  if (pathname.startsWith("/app/quality-operations")) return "appQualityOperations";
  if (pathname.startsWith("/app/risk")) return "appRiskOperations";
  if (
    pathname === "/app/intelligence" ||
    pathname.startsWith("/app/intelligence/briefing") ||
    pathname.startsWith("/app/intelligence/recommendations") ||
    pathname.startsWith("/app/intelligence/board-reports")
  ) {
    return "appStrategicIntelligence";
  }
  if (
    pathname === "/app/automation" ||
    pathname.startsWith("/app/automation/workflows") ||
    pathname.startsWith("/app/automation/templates")
  ) {
    return "appAutomationOperations";
  }
  if (pathname === "/app/search" || pathname.startsWith("/app/search/")) {
    return "appUniversalSearch";
  }
  if (pathname === "/app/workforce" || pathname.startsWith("/app/workforce/")) {
    return "appAiWorkforce";
  }
  if (pathname === "/app/revenue" || pathname.startsWith("/app/revenue/")) {
    return "appRevenueOperations";
  }
  if (pathname === "/app/market-intelligence" || pathname.startsWith("/app/market-intelligence/")) {
    return "appMarketObservatory";
  }
  if (pathname === "/app/knowledge-network" || pathname.startsWith("/app/knowledge-network/")) {
    return "appKnowledgeNetwork";
  }
  if (pathname === "/app/knowledge-graph" || pathname.startsWith("/app/knowledge-graph/")) {
    return "appKnowledgeGraph";
  }
  if (pathname === "/app/activity" || pathname === "/app/since-last-login" || pathname.startsWith("/app/since-last-login/")) {
    return "appActivityOperations";
  }
  if (pathname.startsWith("/app/inventory")) return "appInventory";
  if (pathname.startsWith("/app/forms")) return "appForms";
  if (pathname.startsWith("/app/customers") || pathname.startsWith("/app/leads")) return "appCustomers";
  if (pathname.startsWith("/app/analytics")) return "appAnalytics";
  if (pathname.startsWith("/app/licenses")) return "appLicenses";
  if (pathname.startsWith("/app/marketplace/packs/")) return "marketplace";
  if (pathname.startsWith("/app/marketplace/companion-actions")) return "companionActionMarketplaceEngine";
  if (pathname.startsWith("/app/marketplace")) return "marketplace";
  if (pathname.startsWith("/app/industry-blueprints")) return "industryBlueprints";
  if (pathname.startsWith("/app/global-learning")) return "globalLearning";
  if (pathname.startsWith("/app/evolution")) return "evolution";
  if (pathname.startsWith("/app/value-engine")) return "valueEngine";
  if (pathname.startsWith("/app/outcomes")) return "outcomesEngine";
  if (pathname.startsWith("/app/companion-workforce-engine")) return "companionWorkforceEngine";
  if (pathname.startsWith("/app/agents")) return "agents";
  if (pathname.startsWith("/app/apps")) return "appEcosystem";
  if (pathname.startsWith("/app/trust-center")) {
    return "enterpriseTrustReputationConfidenceEngine";
  }
  if (pathname.startsWith("/app/trust")) return "trustEngine";
  if (pathname.startsWith("/app/digital-twin")) return "digitalTwin";
  if (pathname === "/app/execution" || pathname.startsWith("/app/execution/")) return "appExecutionOperations";
  if (pathname === "/app/simulation" || pathname.startsWith("/app/simulation/")) return "appSimulationOperations";
  if (pathname.startsWith("/app/simulations")) return "simulationLab";
  if (pathname.startsWith("/app/operations/incident-command")) return "incidentCommandCenterEngine";
  if (pathname.startsWith("/app/operations/platform-observability")) return "platformObservabilityCenterEngine";
  if (pathname.startsWith("/app/operations/deployments")) return "deploymentGovernanceCenterEngine";
  if (pathname.startsWith("/app/operations/database-governance")) return "databaseGovernanceCenterEngine";
  if (pathname.startsWith("/app/operations/automation-control")) return "automationControlCenterEngine";
  if (pathname.startsWith("/app/operations")) return "operationsCenter";
  if (pathname.startsWith("/app/continuity")) return "continuityEngine";
  if (pathname.startsWith("/app/strategy")) return "strategyEngine";
  if (pathname.startsWith("/app/workforce-scheduling")) return "workforceScheduling";
  if (pathname === "/app/checkout" || pathname.startsWith("/app/checkout/")) return "serviceCheckout";
  if (pathname.startsWith("/app/human-success")) return "humanSuccessEngine";
  if (pathname.startsWith("/app/customer-lifecycle")) return "customerLifecycleEngine";
  if (pathname.startsWith("/app/integrity")) return "platformIntegrityEngine";
  if (pathname.startsWith("/app/ecosystem-orchestration")) return "ecosystemOrchestrationEngine";
  if (pathname.startsWith("/app/ecosystem-governance")) return "ecosystemGovernanceEngine";
  if (pathname.startsWith("/app/ecosystem-intelligence")) return "ecosystemIntelligenceEngine";
  if (pathname.startsWith("/app/community")) return "communityIntelligenceEngine";
  if (pathname.startsWith("/app/marketplace-governance")) return "marketplaceGovernanceEngine";
  if (pathname === "/app/growth-partner" || pathname === "/app/growth-partner/") return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/leads")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/opportunities")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/customers")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/commissions")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/payouts")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/resources")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/training")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/certifications")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/performance")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/support")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/resource-center")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner/marketing")) return "growthPartnerMarketing";
  if (pathname.startsWith("/app/growth-partner/business-planning")) return "growthPartnerBusinessPlanning";
  if (pathname.startsWith("/app/growth-partner/academy")) return "growthPartnerDashboard";
  if (pathname.startsWith("/app/growth-partner-operations")) return "growthPartnerOperationsEngine";
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
  if (
    pathname === "/app/actions" ||
    pathname.startsWith("/app/actions/pending") ||
    pathname.startsWith("/app/actions/approved") ||
    pathname.startsWith("/app/actions/completed-actions") ||
    pathname.startsWith("/app/actions/approvals") ||
    pathname.startsWith("/app/actions/permissions") ||
    pathname.startsWith("/app/actions/history") ||
    pathname.startsWith("/app/actions/reports")
  ) {
    return "realWorldActionServiceOrchestrationEngine";
  }
  if (pathname.startsWith("/app/action-center")) return "actionCenter";
  if (pathname.startsWith("/app/actions/")) return "actionCenter";
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
    pathname === "/app/evolution" ||
    pathname.startsWith("/app/evolution/platform") ||
    pathname.startsWith("/app/evolution/companion") ||
    pathname.startsWith("/app/evolution/business-packs") ||
    pathname.startsWith("/app/evolution/roadmaps") ||
    pathname.startsWith("/app/evolution/recommendations") ||
    pathname.startsWith("/app/evolution/opportunities") ||
    pathname.startsWith("/app/evolution/reports")
  ) {
    return "evolutionCenter";
  }
  if (pathname === "/app/business-continuity" || pathname.startsWith("/app/business-continuity/")) {
    return "businessContinuityCenter";
  }
  if (pathname === "/app/absence" || pathname.startsWith("/app/absence/")) {
    return "absenceCoverage";
  }
  if (
    pathname.startsWith("/app/aos/organization") ||
    pathname.startsWith("/app/aos/operations") ||
    pathname.startsWith("/app/aos/companion") ||
    pathname.startsWith("/app/aos/intelligence") ||
    pathname.startsWith("/app/aos/business-packs") ||
    pathname.startsWith("/app/aos/signals") ||
    pathname.startsWith("/app/aos/governance") ||
    pathname.startsWith("/app/aos/reports")
  ) {
    return "aosCenter";
  }
  if (
    pathname === "/app/knowledge-fabric" ||
    pathname.startsWith("/app/knowledge-fabric/sources") ||
    pathname.startsWith("/app/knowledge-fabric/knowledge") ||
    pathname.startsWith("/app/knowledge-fabric/conflicts") ||
    pathname.startsWith("/app/knowledge-fabric/trust") ||
    pathname.startsWith("/app/knowledge-fabric/reviews") ||
    pathname.startsWith("/app/knowledge-fabric/insights") ||
    pathname.startsWith("/app/knowledge-fabric/reports")
  ) {
    return "knowledgeFabricCenter";
  }
  if (
    pathname === "/app/feedback" ||
    pathname.startsWith("/app/feedback/collection") ||
    pathname.startsWith("/app/feedback/suggestions") ||
    pathname.startsWith("/app/feedback/ratings") ||
    pathname.startsWith("/app/feedback/insights") ||
    pathname.startsWith("/app/feedback/improvements") ||
    pathname.startsWith("/app/feedback/reports")
  ) {
    return "companionFeedbackCenter";
  }
  if (
    pathname === "/app/memory" ||
    pathname.startsWith("/app/memory/personal") ||
    pathname.startsWith("/app/memory/organization") ||
    pathname.startsWith("/app/memory/preferences") ||
    pathname.startsWith("/app/memory/relationships") ||
    pathname.startsWith("/app/memory/permissions") ||
    pathname.startsWith("/app/memory/reviews") ||
    pathname.startsWith("/app/memory/reports")
  ) {
    return "organizationalMemory";
  }
  if (
    pathname.startsWith("/app/memory") ||
    pathname.startsWith("/dashboard/memory")
  ) {
    return "organizationalMemory";
  }
  if (pathname.startsWith("/app/organizational-intelligence")) return "organizationalIntelligence";
  if (pathname.startsWith("/app/insights")) return "appAnalytics";
  if (pathname.startsWith("/app/workspaces")) return "organizationWorkspaceEngine";
  if (pathname.startsWith("/app/organization") || pathname.startsWith("/app/workflows")) {
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
  if (pathname.startsWith("/app/governance/digital-workforce")) return "digitalWorkforceGovernanceEngine";
  if (pathname.startsWith("/app/governance/financial-guardrails")) return "financialGuardrailsEngine";
  if (pathname.startsWith("/app/governance/trust-transparency")) return "trustTransparencyEngine";
  if (pathname === "/app/governance/trust") return "enterpriseGovernanceTrustEngine";
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
  if (pathname.startsWith("/app/knowledge/memory")) return "enterpriseOrganizationalMemoryEngine";
  if (pathname.startsWith("/app/knowledge/evolution")) return "knowledgeEvolutionCenterEngine";
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
