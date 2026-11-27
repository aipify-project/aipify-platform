import { CertifiedSalesPartnerProductCatalogPanel } from "@/components/partners-portal/CertifiedSalesPartnerProductCatalogPanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspCatalogLabels, buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { buildProductExperience } from "@/lib/partners-portal/sales-experience-content";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersProductCatalogPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.products.title",
    "partnersPortal.certifiedSalesPartner.pages.products.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerProductCatalogPanel
        labels={buildCspCatalogLabels(t)}
        locale={locale}
        experience={buildProductExperience(t)}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
