import { PlatformPartnerSettlementOpsPanel } from "@/components/platform/control-plane/PlatformPartnerSettlementOpsPanel";
import { buildPlatformControlPlaneLabels } from "@/lib/platform-control-plane";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Dictionary } from "@/lib/i18n/translate";

export default async function PlatformPartnerSettlementOpsPage() {
  const locale = await getLocale();
  const dict = (await getDictionary(locale, ["platform"])) as Dictionary;
  const t = createTranslator(dict);
  const labels = buildPlatformControlPlaneLabels(t);

  return (
    <PlatformPartnerSettlementOpsPanel labels={labels} locale={locale} dictionary={dict} />
  );
}
