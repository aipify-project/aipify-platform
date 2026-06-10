import { TrustLicenseCenterPanel } from "@/components/app/license";
import { buildLicenseCenterLabels } from "@/lib/app/license-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export default async function AppLicensePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["license"]);

  return (
    <div className="p-6">
      <TrustLicenseCenterPanel
        locale={locale}
        labels={buildLicenseCenterLabels(dict)}
      />
    </div>
  );
}
