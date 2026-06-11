import { PlatformInstallDashboardPanel } from "@/components/app/platform-install";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformInstallPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.platformInstall";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PlatformInstallDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          installProgress: t(`${p}.installProgress`),
          stepsCompleted: t(`${p}.stepsCompleted`),
          trialStatus: t(`${p}.trialStatus`),
          startWizard: t(`${p}.startWizard`),
          registerPayment: t(`${p}.registerPayment`),
          generateBriefing: t(`${p}.generateBriefing`),
          installAssistantMessages: t(`${p}.installAssistantMessages`),
          choosePlatform: t(`${p}.choosePlatform`),
          selectPlatform: t(`${p}.selectPlatform`),
          otherPlatformPlaceholder: t(`${p}.otherPlatformPlaceholder`),
          connectPlatform: t(`${p}.connectPlatform`),
          domainPlaceholder: t(`${p}.domainPlaceholder`),
          connect: t(`${p}.connect`),
          verifyPermissions: t(`${p}.verifyPermissions`),
          runHealthCheck: t(`${p}.runHealthCheck`),
          installationErrors: t(`${p}.installationErrors`),
          fixRecommendation: t(`${p}.fixRecommendation`),
          wizardSteps: t(`${p}.wizardSteps`),
          healthChecks: t(`${p}.healthChecks`),
          trialReminders: t(`${p}.trialReminders`),
          cancelTrial: t(`${p}.cancelTrial`),
          recentBriefings: t(`${p}.recentBriefings`),
          installAssistant: t(`${p}.installAssistant`),
          billing: t(`${p}.billing`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
        }}
      />
    </div>
  );
}
