import {
  AdoptionJourneyShowcaseSection,
  AipifyVisionSection,
  AnimatedProductDemo,
  BeforeAfterOutcomesSection,
  BergenBrandSection,
  BosArchitectureDiagramSection,
  BuildingInPublicSection,
  BusinessPackExplorerSection,
  BusinessValueStrip,
  CategoryDifferenceFlowSection,
  CategoryLeadershipSection,
  CategoryStatementSection,
  CompanionConversationDemoSection,
  CompanionNotChatbotSection,
  CompanionOrbDemo,
  CompanionPhilosophySection,
  CompanionTimelineSection,
  CompetitivePositioningSection,
  CustomerJourneySection,
  EarlyAccessExperienceSection,
  EnterpriseConfidenceStrip,
  EnterpriseReadinessSection,
  EnterpriseTrustSection,
  ExecutiveDemoSection,
  ExecutiveVisibilitySection,
  HeroSection,
  HowAipifyWorksSection,
  HumanCenteredAiSection,
  HumanFirstPrincipleSection,
  HumanOversightSection,
  ImplementationJourneySection,
  IndustryExplorerSection,
  LiveWorkflowExamplesSection,
  MarketingCtaBand,
  MarketingNarrativeSection,
  ModernSoftwareProblemSection,
  ModuleShowcase,
  OperationalFrictionSection,
  OperationalIntelligenceLifecycleSection,
  OperationalVisibilitySection,
  OrganizationalMemorySection,
  OutputEngineShowcase,
  PilotStorySection,
  PlatformArchitectureSection,
  PlatformDifferentiationSection,
  PlatformEnginesGrid,
  ProductDepthSection,
  ProductExplorerSection,
  RoleBenefitsExplorerSection,
  SecurityReassuranceSection,
  SinceLastLoginSection,
  TrustCredibilityBar,
  TrustMetricsSection,
  WhatCompanionDoesSection,
  WhatIsBosSection,
  WhyCustomersStaySection,
} from "@/components/marketing";
import type { OrbState } from "@/components/marketing/CompanionOrbDemo";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import {
  getSection,
  parseArchitectureLayers,
  parseBeforeAfter,
  parseBusinessPackExplorerItems,
  parseCategoryDifferenceFlow,
  parseCompanionCapabilities,
  parseCompanionConversationExamples,
  parseCompanionTimelineMilestones,
  parseConfidenceItems,
  parseCategoryPositioningIntro,
  buildMarketingTrustMetricCards,
  parseCtaBandLabels,
  parseDemoSteps,
  parseDifferentiationItems,
  parseHeroOutcomes,
  parseIndustryExplorerItems,
  parseJourneySteps,
  parseLiveWorkflowFlows,
  parseModules,
  parseOperationalVisibilityRoles,
  parseOrbStates,
  parseOutputs,
  parseOversightLadder,
  parseParagraphs,
  parsePilotHighlights,
  parsePlatformEngines,
  parsePlatformPreview,
  parseProductExplorerItems,
  parseRoleBenefitProfiles,
  parseStringList,
  parseTrustBarCards,
  parseTrustPoints,
  parseValueStripCards,
  parseWorkSteps,
} from "@/lib/marketing/parse-marketing";

export default async function MarketingHomePage() {
  const { marketing } = await getMarketingContext();

  const hero = getSection<Record<string, string>>(marketing, "hero");
  const valueStrip = getSection<Record<string, string>>(marketing, "valueStrip");
  const trustBar = getSection<Record<string, string>>(marketing, "trustBar");
  const businessOutcomes = getSection<Record<string, string>>(marketing, "businessOutcomes");
  const operationalFriction = getSection<Record<string, string>>(marketing, "operationalFriction");
  const productExplorer = getSection<{
    title?: string;
    bookDemoLabel?: string;
    labels?: { explanation?: string; workflow?: string; value?: string };
  }>(marketing, "productExplorer");
  const businessPackExplorer = getSection<{
    title?: string;
    subtitle?: string;
    labels?: { purpose?: string; capabilities?: string; audience?: string; benefits?: string };
  }>(marketing, "businessPackExplorer");
  const executiveDemo = getSection<Record<string, string>>(marketing, "executiveDemo");
  const earlyAccessExperience = getSection<Record<string, string>>(marketing, "earlyAccessExperience");
  const productDepth = getSection<Record<string, string>>(marketing, "productDepth");
  const whoIsAipify = getSection<Record<string, string>>(marketing, "whoIsAipify");
  const bergenBrand = getSection<Record<string, string>>(marketing, "bergenBrand");
  const whyWeBuilt = getSection<Record<string, string>>(marketing, "whyWeBuilt");
  const customerJourney = getSection<Record<string, string>>(marketing, "customerJourney");
  const enterpriseReadiness = getSection<Record<string, string>>(marketing, "enterpriseReadiness");
  const humanFirstPrinciple = getSection<Record<string, string>>(marketing, "humanFirstPrinciple");
  const platformAuthority = getSection<Record<string, string>>(marketing, "platformAuthority");
  const animatedDemo = getSection<Record<string, string>>(marketing, "animatedDemo");
  const companionOrb = getSection<Record<string, string>>(marketing, "companionOrb");
  const enterpriseTrust = getSection<Record<string, string>>(marketing, "enterpriseTrust");
  const howItWorks = getSection<Record<string, string>>(marketing, "howItWorks");
  const modulesSection = getSection<Record<string, string>>(marketing, "modules");
  const pilot = getSection<Record<string, string>>(marketing, "pilot");
  const outputs = getSection<Record<string, string>>(marketing, "outputs");
  const humanOversight = getSection<Record<string, string>>(marketing, "humanOversight");
  const ctaBand = parseCtaBandLabels(marketing);
  const categoryPositioning = parseCategoryPositioningIntro(marketing);
  const categoryDifferenceFlow = parseCategoryDifferenceFlow(marketing);
  const operationalVisibility = parseOperationalVisibilityRoles(marketing);
  const bosDiagram = getSection<Record<string, string>>(marketing, "bosDiagram");
  const competitivePositioning = getSection<Record<string, string>>(marketing, "competitivePositioning");
  const executiveVisibility = getSection<Record<string, string>>(marketing, "executiveVisibility");
  const operationalIntelligence = getSection<Record<string, string>>(marketing, "operationalIntelligence");
  const buildingInPublic = getSection<Record<string, string>>(marketing, "buildingInPublic");
  const adoptionJourney = getSection<Record<string, string>>(marketing, "adoptionJourney");
  const whyCustomersStay = getSection<Record<string, string>>(marketing, "whyCustomersStay");
  const securityReassurance = getSection<Record<string, string>>(marketing, "securityReassurance");
  const companionPhilosophy = getSection<Record<string, string>>(marketing, "companionPhilosophy");
  const beforeAfter = parseBeforeAfter(marketing, "businessOutcomes");
  const trustMetricCards = buildMarketingTrustMetricCards(marketing);
  const ctaLabels = parseCtaBandLabels(marketing);

  return (
    <>
      <HeroSection
        labels={hero as Parameters<typeof HeroSection>[0]["labels"]}
        previewItems={parsePlatformPreview(marketing)}
        outcomes={parseHeroOutcomes(marketing)}
      />

      <CategoryStatementSection {...categoryPositioning.categoryStatement} />

      <WhatIsBosSection
        title={categoryPositioning.whatIsBos.title}
        paragraphs={categoryPositioning.whatIsBos.paragraphs}
      />

      <ModernSoftwareProblemSection
        title={getSection<{ title?: string }>(marketing, "modernSoftwareProblem").title ?? ""}
        systems={parseStringList(marketing, "modernSoftwareProblem", "systems")}
        closing={parseStringList(marketing, "modernSoftwareProblem", "closing")}
      />

      <BosArchitectureDiagramSection
        topLayerTitle={bosDiagram.topLayerTitle ?? ""}
        topLayerRoles={parseStringList(marketing, "bosDiagram", "topLayerRoles")}
        middleLayerTitle={bosDiagram.middleLayerTitle ?? ""}
        bottomLayerTitle={bosDiagram.bottomLayerTitle ?? ""}
        bottomLayerSystems={parseStringList(marketing, "bosDiagram", "bottomLayerSystems")}
      />

      <CompetitivePositioningSection
        title={competitivePositioning.title ?? ""}
        paragraphs={parseParagraphs(marketing, "competitivePositioning")}
      />

      <CategoryDifferenceFlowSection
        title={categoryDifferenceFlow.title}
        traditional={categoryDifferenceFlow.traditional}
        aipify={categoryDifferenceFlow.aipify}
      />

      <TrustCredibilityBar title={trustBar.title ?? ""} cards={parseTrustBarCards(marketing)} />

      <BusinessValueStrip title={valueStrip.title ?? ""} cards={parseValueStripCards(marketing)} />

      <BeforeAfterOutcomesSection
        title={businessOutcomes.title ?? ""}
        beforeTitle={businessOutcomes.beforeTitle ?? ""}
        afterTitle={businessOutcomes.afterTitle ?? ""}
        before={beforeAfter.before}
        after={beforeAfter.after}
      />

      <ProductExplorerSection
        title={productExplorer.title ?? ""}
        items={parseProductExplorerItems(marketing)}
        bookDemoLabel={productExplorer.bookDemoLabel ?? ctaLabels.bookDemo}
        labels={{
          explanation: productExplorer.labels?.explanation ?? "What it is",
          workflow: productExplorer.labels?.workflow ?? "Example workflow",
          value: productExplorer.labels?.value ?? "Value delivered",
        }}
      />

      <RoleBenefitsExplorerSection
        title={getSection<{ title?: string }>(marketing, "roleBenefits").title ?? ""}
        roles={parseRoleBenefitProfiles(marketing)}
      />

      <LiveWorkflowExamplesSection
        title={getSection<{ title?: string }>(marketing, "liveWorkflows").title ?? ""}
        flows={parseLiveWorkflowFlows(marketing)}
      />

      <ExecutiveDemoSection
        title={executiveDemo.title ?? ""}
        mockupLabel={executiveDemo.mockupLabel ?? ""}
        items={parseStringList(marketing, "executiveDemo", "items")}
      />

      <CompanionConversationDemoSection
        title={getSection<{ title?: string }>(marketing, "companionConversations").title ?? ""}
        examples={parseCompanionConversationExamples(marketing)}
      />

      <CompanionNotChatbotSection
        title={getSection<{ title?: string }>(marketing, "companionNotChatbot").title ?? ""}
        statements={parseStringList(marketing, "companionNotChatbot", "statements")}
      />

      <WhatCompanionDoesSection
        title={getSection<{ title?: string }>(marketing, "whatCompanionDoes").title ?? ""}
        capabilities={parseCompanionCapabilities(marketing)}
      />

      <SinceLastLoginSection
        title={getSection<{ title?: string }>(marketing, "sinceLastLogin").title ?? ""}
        panelLabel={getSection<{ panelLabel?: string }>(marketing, "sinceLastLogin").panelLabel ?? ""}
        items={parseStringList(marketing, "sinceLastLogin", "items")}
      />

      <OrganizationalMemorySection
        title={getSection<{ title?: string }>(marketing, "organizationalMemory").title ?? ""}
        problems={parseStringList(marketing, "organizationalMemory", "problems")}
        closing={getSection<{ closing?: string }>(marketing, "organizationalMemory").closing ?? ""}
      />

      <CompanionTimelineSection
        title={getSection<{ title?: string }>(marketing, "companionTimeline").title ?? ""}
        milestones={parseCompanionTimelineMilestones(marketing)}
      />

      <OperationalVisibilitySection
        title={operationalVisibility.title}
        roles={operationalVisibility.roles}
        closing={operationalVisibility.closing}
      />

      <BusinessPackExplorerSection
        title={businessPackExplorer.title ?? ""}
        subtitle={businessPackExplorer.subtitle ?? ""}
        packs={parseBusinessPackExplorerItems(marketing)}
        labels={{
          purpose: businessPackExplorer.labels?.purpose ?? "Purpose",
          capabilities: businessPackExplorer.labels?.capabilities ?? "Key capabilities",
          audience: businessPackExplorer.labels?.audience ?? "Who it is for",
          benefits: businessPackExplorer.labels?.benefits ?? "Benefits",
        }}
      />

      <IndustryExplorerSection
        title={getSection<{ title?: string }>(marketing, "industryExplorer").title ?? ""}
        industries={parseIndustryExplorerItems(marketing)}
      />

      <ImplementationJourneySection
        title={getSection<{ title?: string }>(marketing, "implementationJourney").title ?? ""}
        steps={parseJourneySteps(marketing, "implementationJourney")}
      />

      <ProductDepthSection
        title={productDepth.title ?? ""}
        capabilities={parseStringList(marketing, "productDepth", "capabilities")}
      />

      <EarlyAccessExperienceSection
        title={earlyAccessExperience.title ?? ""}
        intro={earlyAccessExperience.intro ?? ""}
        benefits={parseStringList(marketing, "earlyAccessExperience", "benefits")}
        ctaLabel={earlyAccessExperience.ctaLabel ?? ctaLabels.earlyAccess}
      />

      <ExecutiveVisibilitySection
        title={executiveVisibility.title ?? ""}
        paragraphs={parseParagraphs(marketing, "executiveVisibility")}
        highlightsTitle={executiveVisibility.highlightsTitle}
        highlights={parseStringList(marketing, "executiveVisibility", "highlights")}
      />

      <OperationalFrictionSection
        title={operationalFriction.title ?? ""}
        problems={parseStringList(marketing, "operationalFriction", "problems")}
        closing={operationalFriction.closing ?? ""}
      />

      <MarketingNarrativeSection
        id="who-is-aipify"
        title={whoIsAipify.title ?? ""}
        paragraphs={parseParagraphs(marketing, "whoIsAipify")}
        bullets={parseStringList(marketing, "whoIsAipify", "focusAreas")}
        bulletsTitle={whoIsAipify.focusTitle}
        muted
      />

      <BergenBrandSection
        title={bergenBrand.title ?? ""}
        intro={bergenBrand.intro ?? ""}
        valuesTitle={bergenBrand.valuesTitle ?? ""}
        values={parseStringList(marketing, "bergenBrand", "values")}
        closing={bergenBrand.closing ?? ""}
      />

      <MarketingNarrativeSection
        id="why-we-built"
        title={whyWeBuilt.title ?? ""}
        paragraphs={parseParagraphs(marketing, "whyWeBuilt")}
        muted
      />

      <CustomerJourneySection
        title={customerJourney.title ?? ""}
        subtitle={customerJourney.subtitle ?? ""}
        steps={parseJourneySteps(marketing)}
      />

      <PlatformArchitectureSection
        title={platformAuthority.architectureTitle ?? ""}
        subtitle={platformAuthority.architectureSubtitle ?? ""}
        layers={parseArchitectureLayers(marketing)}
      />

      <PlatformEnginesGrid
        title={platformAuthority.enginesTitle ?? ""}
        subtitle={platformAuthority.enginesSubtitle ?? ""}
        engines={parsePlatformEngines(marketing)}
      />

      <ModuleShowcase
        title={modulesSection.title ?? ""}
        subtitle={modulesSection.subtitle ?? ""}
        modules={parseModules(marketing)}
      />

      <EnterpriseReadinessSection
        title={enterpriseReadiness.title ?? ""}
        subtitle={enterpriseReadiness.subtitle}
        items={parseStringList(marketing, "enterpriseReadiness", "items")}
      />

      <EnterpriseConfidenceStrip
        title={platformAuthority.confidenceTitle ?? ""}
        subtitle={platformAuthority.confidenceSubtitle}
        items={parseConfidenceItems(marketing).map(({ name, description }) => ({
          title: name,
          description,
        }))}
      />

      <AnimatedProductDemo
        title={animatedDemo.title ?? ""}
        subtitle={animatedDemo.subtitle ?? ""}
        steps={parseDemoSteps(marketing)}
        mobileSummary={animatedDemo.mobileSummary ?? ""}
      />

      <EnterpriseTrustSection
        title={enterpriseTrust.title ?? ""}
        subtitle={enterpriseTrust.subtitle ?? ""}
        points={parseTrustPoints(marketing)}
      />

      <HumanFirstPrincipleSection
        title={humanFirstPrinciple.title ?? ""}
        principles={parseStringList(marketing, "humanFirstPrinciple", "principles")}
        closing={humanFirstPrinciple.closing ?? ""}
      />

      <OperationalIntelligenceLifecycleSection
        title={operationalIntelligence.title ?? ""}
        steps={parseStringList(marketing, "operationalIntelligence", "steps")}
      />

      <HowAipifyWorksSection
        title={howItWorks.title ?? ""}
        subtitle={howItWorks.subtitle ?? ""}
        steps={parseWorkSteps(marketing)}
      />

      <PilotStorySection
        title={pilot.title ?? ""}
        subtitle={pilot.subtitle ?? ""}
        description={pilot.description ?? ""}
        highlights={parsePilotHighlights(marketing)}
        cta={pilot.cta ?? ""}
        validationTitle={pilot.validationTitle}
      />

      <BuildingInPublicSection
        title={buildingInPublic.title ?? ""}
        paragraphs={parseParagraphs(marketing, "buildingInPublic")}
      />

      <AdoptionJourneyShowcaseSection
        title={adoptionJourney.title ?? ""}
        steps={parseJourneySteps(marketing, "adoptionJourney")}
      />

      <TrustMetricsSection cards={trustMetricCards} />

      <WhyCustomersStaySection
        title={whyCustomersStay.title ?? ""}
        items={parseStringList(marketing, "whyCustomersStay", "items")}
      />

      <SecurityReassuranceSection
        title={securityReassurance.title ?? ""}
        items={parseStringList(marketing, "securityReassurance", "items")}
      />

      <HumanCenteredAiSection
        title={getSection<{ title?: string }>(marketing, "humanCenteredAi").title ?? ""}
        humanLabel={getSection<{ humanLabel?: string }>(marketing, "humanCenteredAi").humanLabel ?? ""}
        companionLabel={getSection<{ companionLabel?: string }>(marketing, "humanCenteredAi").companionLabel ?? ""}
        humanItems={parseStringList(marketing, "humanCenteredAi", "humanItems")}
        companionItems={parseStringList(marketing, "humanCenteredAi", "companionItems")}
      />

      <CompanionPhilosophySection
        title={companionPhilosophy.title ?? ""}
        paragraphs={parseParagraphs(marketing, "companionPhilosophy")}
        principles={parseStringList(marketing, "companionPhilosophy", "principles")}
      />

      <OutputEngineShowcase
        title={outputs.title ?? ""}
        subtitle={outputs.subtitle ?? ""}
        items={parseOutputs(marketing)}
      />

      <HumanOversightSection
        title={humanOversight.title ?? ""}
        subtitle={humanOversight.subtitle ?? ""}
        ladder={parseOversightLadder(marketing)}
      />

      <CompanionOrbDemo
        title={companionOrb.title ?? ""}
        subtitle={companionOrb.subtitle ?? ""}
        clickHint={companionOrb.clickHint ?? ""}
        states={parseOrbStates(marketing) as Record<OrbState, { label: string; description: string }>}
      />

      <PlatformDifferentiationSection
        title={platformAuthority.differentiationTitle ?? ""}
        items={parseDifferentiationItems(marketing)}
      />

      <CategoryLeadershipSection
        title={getSection<{ title?: string }>(marketing, "categoryLeadership").title ?? ""}
        paragraphs={parseParagraphs(marketing, "categoryLeadership")}
      />

      <AipifyVisionSection
        title={getSection<{ title?: string }>(marketing, "aipifyVision").title ?? ""}
        paragraphs={parseParagraphs(marketing, "aipifyVision")}
      />

      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
