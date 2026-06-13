import { AipifyInstallDiscoveryPanel } from "@/components/app/onboarding";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyInstallOnboardingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const ns = "customerApp.aipifyInstallDiscovery";

  return (
    <AipifyInstallDiscoveryPanel
      labels={{
        title: t(`${ns}.title`),
        subtitle: t(`${ns}.subtitle`),
        loading: t(`${ns}.loading`),
        corePrinciple: t(`${ns}.corePrinciple`),
        philosophy: t(`${ns}.philosophy`),
        currentPhase: t(`${ns}.currentPhase`),
        runPhase: t(`${ns}.runPhase`),
        running: t(`${ns}.running`),
        introductionTitle: t(`${ns}.introductionTitle`),
        systemsTitle: t(`${ns}.systemsTitle`),
        knowledgeTitle: t(`${ns}.knowledgeTitle`),
        workflowsTitle: t(`${ns}.workflowsTitle`),
        actionsTitle: t(`${ns}.actionsTitle`),
        peopleTitle: t(`${ns}.peopleTitle`),
        readinessTitle: t(`${ns}.readinessTitle`),
        recommendationsTitle: t(`${ns}.recommendationsTitle`),
        auditTitle: t(`${ns}.auditTitle`),
        noAudit: t(`${ns}.noAudit`),
        overallReadiness: t(`${ns}.overallReadiness`),
        confidence: t(`${ns}.confidence`),
        installEngineLink: t(`${ns}.installEngineLink`),
        modernInstallLink: t(`${ns}.modernInstallLink`),
        onboardingLink: t(`${ns}.onboardingLink`),
        privacyNote: t(`${ns}.privacyNote`),
        phases: {
          "1": t(`${ns}.phases.organizationProfile`),
          "2": t(`${ns}.phases.systemDiscovery`),
          "3": t(`${ns}.phases.knowledgeDiscovery`),
          "4": t(`${ns}.phases.workflowDiscovery`),
          "5": t(`${ns}.phases.actionDiscovery`),
          "6": t(`${ns}.phases.peopleDiscovery`),
          "7": t(`${ns}.phases.readinessAssessment`),
        },
        readinessStates: {
          not_ready: t(`${ns}.readinessStates.notReady`),
          learning: t(`${ns}.readinessStates.learning`),
          partially_ready: t(`${ns}.readinessStates.partiallyReady`),
          ready_to_assist: t(`${ns}.readinessStates.readyToAssist`),
          ready_to_execute: t(`${ns}.readinessStates.readyToExecute`),
        },
      }}
    />
  );
}
