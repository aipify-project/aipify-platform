import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersSalesPipelinePage() {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.sales.title",
    "partnersPortal.certifiedSalesPartner.pages.sales.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <p className="text-sm text-[color:var(--aipify-text-secondary)]">
        {t("partnersPortal.certifiedSalesPartner.pages.sales.awaitingHint")}
      </p>
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
