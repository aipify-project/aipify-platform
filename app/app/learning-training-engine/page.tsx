import { LearningTrainingEngineDashboardPanel } from "@/components/app/learning-training-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LearningTrainingEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.learningTrainingEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <LearningTrainingEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          onboarding: t(`${p}.onboarding`),
          learningEngine: t(`${p}.learningEngine`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          assigned_paths: t(`${p}.assigned_paths`),
          completed_paths: t(`${p}.completed_paths`),
          in_progress_paths: t(`${p}.in_progress_paths`),
          overdue_paths: t(`${p}.overdue_paths`),
          onboardingIntegration: t(`${p}.onboardingIntegration`),
          currentStep: t(`${p}.currentStep`),
          assignedPaths: t(`${p}.assignedPaths`),
          recommendedPaths: t(`${p}.recommendedPaths`),
          overdueTraining: t(`${p}.overdueTraining`),
          recommendedModules: t(`${p}.recommendedModules`),
          teamReadiness: t(`${p}.teamReadiness`),
          readinessScore: t(`${p}.readinessScore`),
          averageCompletion: t(`${p}.averageCompletion`),
          availablePaths: t(`${p}.availablePaths`),
          minutes: t(`${p}.minutes`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
          trainingObjectives: t(`${p}.trainingObjectives`),
          blueprintLearningPaths: t(`${p}.blueprintLearningPaths`),
          designedFor: t(`${p}.designedFor`),
          learningExperiences: t(`${p}.learningExperiences`),
          certificationPrinciples: t(`${p}.certificationPrinciples`),
          companionExamples: t(`${p}.companionExamples`),
          blueprintSuccessCriteria: t(`${p}.blueprintSuccessCriteria`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnectionBlueprint: t(`${p}.trustConnectionBlueprint`),
          knowledgeCenterConnection: t(`${p}.knowledgeCenterConnection`),
          engagementSummary: t(`${p}.engagementSummary`),
          activeLearningPaths: t(`${p}.activeLearningPaths`),
          userCompletedPaths: t(`${p}.userCompletedPaths`),
          trainingAssessments: t(`${p}.trainingAssessments`),
          userActiveCertificates: t(`${p}.userActiveCertificates`),
          integrationLinks: t(`${p}.integrationLinks`),
          humanPotentialTitle: t(`${p}.humanPotential.title`),
          humanPotentialObjectives: t(`${p}.humanPotential.objectives`),
          humanPotentialDevelopmentQuestions: t(`${p}.humanPotential.developmentQuestions`),
          humanPotentialStrengthBased: t(`${p}.humanPotential.strengthBased`),
          humanPotentialLearningPathways: t(`${p}.humanPotential.learningPathways`),
          humanPotentialCareerCompanion: t(`${p}.humanPotential.careerCompanion`),
          humanPotentialNotAiCoach: t(`${p}.humanPotential.notAiCoach`),
          humanPotentialTalentMobility: t(`${p}.humanPotential.talentMobility`),
          humanPotentialRecognition: t(`${p}.humanPotential.recognition`),
          humanPotentialPrivacy: t(`${p}.humanPotential.privacy`),
          humanPotentialSuccessCriteria: t(`${p}.humanPotential.successCriteria`),
          humanPotentialSelfLove: t(`${p}.humanPotential.selfLove`),
          humanPotentialTrust: t(`${p}.humanPotential.trust`),
          humanPotentialEngagement: t(`${p}.humanPotential.engagement`),
          humanPotentialPathways: t(`${p}.humanPotential.pathways`),
          humanPotentialMobilityDimensions: t(`${p}.humanPotential.mobilityDimensions`),
          humanPotentialDevelopmentQuestionsCount: t(`${p}.humanPotential.developmentQuestionsCount`),
          humanPotentialIntegrationLinks: t(`${p}.humanPotential.integrationLinks`),
        }}
      />
    </div>
  );
}
