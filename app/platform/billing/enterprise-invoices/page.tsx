import { EnterpriseInvoicesPanel } from "@/components/shared/enterprise-invoicing";
import { buildBillingExperienceLabels } from "@/lib/billing-experience";
import { buildEnterpriseInvoicingLabels } from "@/lib/enterprise-invoicing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformEnterpriseInvoicesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <EnterpriseInvoicesPanel
      backHref="/platform/billing"
      labels={buildEnterpriseInvoicingLabels(t, "platform")}
      billingLabels={buildBillingExperienceLabels(t, "platform")}
    />
  );
}
