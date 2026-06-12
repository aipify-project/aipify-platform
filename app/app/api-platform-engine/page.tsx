import { ApiPlatformEngineDashboardPanel } from "@/components/app/api-platform-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ApiPlatformEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.apiPlatformEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ApiPlatformEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          activeKeys: t(`${p}.activeKeys`),
          activeWebhooks: t(`${p}.activeWebhooks`),
          pendingApprovalKeys: t(`${p}.pendingApprovalKeys`),
          auditEvents30d: t(`${p}.auditEvents30d`),
          principles: t(`${p}.principles`),
          developerObjectives: t(`${p}.developerObjectives`),
          apiCategories: t(`${p}.apiCategories`),
          categoryCore: t(`${p}.categoryCore`),
          categoryCompanion: t(`${p}.categoryCompanion`),
          categoryCommerce: t(`${p}.categoryCommerce`),
          categoryPartner: t(`${p}.categoryPartner`),
          scopes: t(`${p}.scopes`),
          securityPrinciples: t(`${p}.securityPrinciples`),
          developerExperience: t(`${p}.developerExperience`),
          blueprintSuccessCriteria: t(`${p}.blueprintSuccessCriteria`),
          trustConnectionBlueprint: t(`${p}.trustConnectionBlueprint`),
          engagementSummary: t(`${p}.engagementSummary`),
          rateLimitTier: t(`${p}.rateLimitTier`),
          sandboxEnabled: t(`${p}.sandboxEnabled`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          apiKeys: t(`${p}.apiKeys`),
          keysMetadataNote: t(`${p}.keysMetadataNote`),
          integrationLinks: t(`${p}.integrationLinks`),
        }}
      />
    </div>
  );
}
