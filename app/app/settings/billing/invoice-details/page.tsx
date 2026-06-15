import { EnterpriseInvoiceDetailsPanel } from "@/components/shared/enterprise-invoicing";
import { buildEnterpriseInvoicingLabels } from "@/lib/enterprise-invoicing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseInvoiceDetailsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <EnterpriseInvoiceDetailsPanel
      backHref="/app/settings/billing"
      labels={buildEnterpriseInvoicingLabels(t, "customerApp")}
    />
  );
}
