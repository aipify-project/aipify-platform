import { TrustCenterOperationsPanel } from "@/components/app/trust-center-operations";
import { buildTrustCenterOperationsLabels } from "@/lib/trust-center-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustDevicesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "trustCenterOperations");
  const labels = buildTrustCenterOperationsLabels(createTranslator(dict));

  return (
    <TrustCenterOperationsPanel
      backHref="/app/trust"
      initialTab="devices"
      visibleTabs={["overview", "devices", "sessions", "security", "audit"]}
      titleOverride={labels.devicesPage.title}
      subtitleOverride={labels.devicesPage.subtitle}
      labels={labels}
    />
  );
}
