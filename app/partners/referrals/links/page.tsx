import { CertifiedSalesPartnerLinkPanel } from "@/components/partners-portal/CertifiedSalesPartnerLinkPanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersSalesLinksPage() {
  const dict = await getDictionary(await getLocale(), ["partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.links.title",
    "partnersPortal.certifiedSalesPartner.pages.links.subtitle",
  );
  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerLinkPanel
        labels={{
          title: t("partnersPortal.certifiedSalesPartner.links.panelTitle"),
          productId: t("partnersPortal.certifiedSalesPartner.links.productId"),
          channel: t("partnersPortal.certifiedSalesPartner.links.channel"),
          submit: t("partnersPortal.certifiedSalesPartner.links.submit"),
          howItWorks: t("partnersPortal.certifiedSalesPartner.links.howItWorks"),
          failClosed: t("partnersPortal.certifiedSalesPartner.workspace.notReadyBody"),
          error: t("partnersPortal.certifiedSalesPartner.workspace.errorTitle"),
          success: t("partnersPortal.certifiedSalesPartner.links.success"),
          gatesHint: t("partnersPortal.certifiedSalesPartner.links.gatesHint"),
        }}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
