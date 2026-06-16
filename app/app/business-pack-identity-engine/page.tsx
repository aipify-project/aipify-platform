import { BusinessPackIdentityEngineDashboardPanel } from "@/components/app/business-pack-identity-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackIdentityEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.businessPackIdentityEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <BusinessPackIdentityEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          platformAdminNote: t(`${p}.platformAdminNote`),
          packsWithIdentity: t(`${p}.packsWithIdentity`),
          activePacks: t(`${p}.activePacks`),
          betaPacks: t(`${p}.betaPacks`),
          identityComplete: t(`${p}.identityComplete`),
          landingExperience: t(`${p}.landingExperience`),
          governance: t(`${p}.governance`),
          catalogTitle: t(`${p}.catalogTitle`),
          viewLanding: t(`${p}.viewLanding`),
          forbiddenTitle: t(`${p}.forbiddenTitle`),
          version: t(`${p}.version`),
          status_active: t("customerApp.businessPackIdentity.statuses.active"),
          status_beta: t("customerApp.businessPackIdentity.statuses.beta"),
          status_coming_soon: t("customerApp.businessPackIdentity.statuses.coming_soon"),
          status_deprecated: t("customerApp.businessPackIdentity.statuses.deprecated"),
          status_retired: t("customerApp.businessPackIdentity.statuses.retired"),
        }}
      />
    </div>
  );
}
