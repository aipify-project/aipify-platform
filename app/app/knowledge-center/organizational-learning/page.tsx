import { OrganizationalLearningCenterPanel } from "@/components/app/organizational-learning-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalLearningCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalLearningCenter";

  return (
    <OrganizationalLearningCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        knowledgeCenterLink: t(`${p}.knowledgeCenterLink`),
        organizationalMemoryLink: t(`${p}.organizationalMemoryLink`),
        learningReviewLink: t(`${p}.learningReviewLink`),
        knowledgeEngineLink: t(`${p}.knowledgeEngineLink`),
        continuousImprovementLink: t(`${p}.continuousImprovementLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        domainsTitle: t(`${p}.domainsTitle`),
        lessonsTitle: t(`${p}.lessonsTitle`),
        patternsTitle: t(`${p}.patternsTitle`),
        bestPracticesTitle: t(`${p}.bestPracticesTitle`),
        validationTitle: t(`${p}.validationTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        publishLesson: t(`${p}.publishLesson`),
        completeReview: t(`${p}.completeReview`),
        generateSummary: t(`${p}.generateSummary`),
        generateReport: t(`${p}.generateReport`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        whatHappened: t(`${p}.whatHappened`),
        whatWorked: t(`${p}.whatWorked`),
        whatDidNotWork: t(`${p}.whatDidNotWork`),
        whatShouldChange: t(`${p}.whatShouldChange`),
        whatShouldRemain: t(`${p}.whatShouldRemain`),
        validationStage: t(`${p}.validationStage`),
        domains: {
          support: t(`${p}.domains.support`),
          operational: t(`${p}.domains.operational`),
          incident: t(`${p}.domains.incident`),
          executive: t(`${p}.domains.executive`),
          workforce: t(`${p}.domains.workforce`),
          customer: t(`${p}.domains.customer`),
        },
        patternTypes: {
          recurring_issue: t(`${p}.patternTypes.recurring_issue`),
          operational_failure: t(`${p}.patternTypes.operational_failure`),
          successful_intervention: t(`${p}.patternTypes.successful_intervention`),
          emerging_opportunity: t(`${p}.patternTypes.emerging_opportunity`),
        },
        practiceTypes: {
          workflow: t(`${p}.practiceTypes.workflow`),
          communication: t(`${p}.practiceTypes.communication`),
          operational: t(`${p}.practiceTypes.operational`),
          leadership: t(`${p}.practiceTypes.leadership`),
          customer_success: t(`${p}.practiceTypes.customer_success`),
        },
        healthLabels: {
          excellent: t(`${p}.healthLabels.excellent`),
          healthy: t(`${p}.healthLabels.healthy`),
          developing: t(`${p}.healthLabels.developing`),
          needs_attention: t(`${p}.healthLabels.needs_attention`),
        },
        validationStages: {
          captured: t(`${p}.validationStages.captured`),
          review: t(`${p}.validationStages.review`),
          confirmed: t(`${p}.validationStages.confirmed`),
          published: t(`${p}.validationStages.published`),
          informed: t(`${p}.validationStages.informed`),
          monitored: t(`${p}.validationStages.monitored`),
        },
        metrics: {
          lessonsCaptured: t(`${p}.metrics.lessonsCaptured`),
          lessonsPublished: t(`${p}.metrics.lessonsPublished`),
          validation: t(`${p}.metrics.validation`),
          utilization: t(`${p}.metrics.utilization`),
          adoption: t(`${p}.metrics.adoption`),
          participation: t(`${p}.metrics.participation`),
          trust: t(`${p}.metrics.trust`),
        },
        executiveFields: {
          strategic: t(`${p}.executiveFields.strategic`),
          maturity: t(`${p}.executiveFields.maturity`),
          opportunities: t(`${p}.executiveFields.opportunities`),
          momentum: t(`${p}.executiveFields.momentum`),
        },
      }}
    />
  );
}
