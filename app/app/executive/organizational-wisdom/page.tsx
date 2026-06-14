import { OrganizationalWisdomCenterPanel } from "@/components/app/organizational-wisdom-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalWisdomCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalWisdomCenter";

  return (
    <OrganizationalWisdomCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalMemoryLink: t(`${p}.organizationalMemoryLink`),
        organizationalLearningLink: t(`${p}.organizationalLearningLink`),
        knowledgeEvolutionLink: t(`${p}.knowledgeEvolutionLink`),
        strategicIntelligenceLink: t(`${p}.strategicIntelligenceLink`),
        decisionSupportLink: t(`${p}.decisionSupportLink`),
        purposeValuesLink: t(`${p}.purposeValuesLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        lessonsTitle: t(`${p}.lessonsTitle`),
        reflectionsTitle: t(`${p}.reflectionsTitle`),
        valuesTitle: t(`${p}.valuesTitle`),
        patternsTitle: t(`${p}.patternsTitle`),
        synthesisTitle: t(`${p}.synthesisTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        scheduleReview: t(`${p}.scheduleReview`),
        generateReflection: t(`${p}.generateReflection`),
        generateSummary: t(`${p}.generateSummary`),
        exportInsights: t(`${p}.exportInsights`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        wisdomScore: t(`${p}.wisdomScore`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          operational: t(`${p}.domains.operational`),
          leadership: t(`${p}.domains.leadership`),
          customer: t(`${p}.domains.customer`),
          organizational: t(`${p}.domains.organizational`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          maturing: t(`${p}.healthLabels.maturing`),
          developing: t(`${p}.healthLabels.developing`),
          emerging: t(`${p}.healthLabels.emerging`),
        },
        timelineTypes: {
          major_lesson: t(`${p}.timelineTypes.major_lesson`),
          significant_decision: t(`${p}.timelineTypes.significant_decision`),
          cultural_milestone: t(`${p}.timelineTypes.cultural_milestone`),
          strategic_turning_point: t(`${p}.timelineTypes.strategic_turning_point`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
        },
        reviewTypes: {
          monthly: t(`${p}.reviewTypes.monthly`),
          quarterly: t(`${p}.reviewTypes.quarterly`),
          annual: t(`${p}.reviewTypes.annual`),
          executive_learning: t(`${p}.reviewTypes.executive_learning`),
        },
        metrics: {
          insights: t(`${p}.metrics.insights`),
          lessons: t(`${p}.metrics.lessons`),
          reflection: t(`${p}.metrics.reflection`),
          patterns: t(`${p}.metrics.patterns`),
          learning: t(`${p}.metrics.learning`),
          quality: t(`${p}.metrics.quality`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          themes: t(`${p}.executiveFields.themes`),
          learning: t(`${p}.executiveFields.learning`),
          lessons: t(`${p}.executiveFields.lessons`),
          indicators: t(`${p}.executiveFields.indicators`),
        },
      }}
    />
  );
}
