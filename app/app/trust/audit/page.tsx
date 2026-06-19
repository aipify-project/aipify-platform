import { TrustCenterOperationsPanel } from "@/components/app/trust-center-operations";
import { buildTrustCenterOperationsLabels } from "@/lib/trust-center-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustAuditPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "trustCenterOperations");
  const labels = buildTrustCenterOperationsLabels(createTranslator(dict));

  return (
    <TrustCenterOperationsPanel
      backHref="/app/trust"
      initialTab="audit"
      visibleTabs={["overview", "audit", "permissions", "security", "compliance", "executive"]}
      titleOverride={labels.auditPage.title}
      subtitleOverride={labels.auditPage.subtitle}
      labels={labels}
    />
  );
}
