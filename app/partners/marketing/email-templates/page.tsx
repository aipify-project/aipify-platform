import { CertifiedSalesPartnerEmailTemplatesPanel } from "@/components/partners-portal/CertifiedSalesPartnerEmailTemplatesPanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersMarketingEmailTemplatesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const p = "partnersPortal.certifiedSalesPartner.emailTemplates";
  const labels = buildCspWorkspaceLabels(
    t,
    `${p}.title`,
    `${p}.intro`,
  );

  const panelLabels = {
    title: t(`${p}.title`),
    intro: t(`${p}.intro`),
    productLabel: t(`${p}.productLabel`),
    templateTypeLabel: t(`${p}.templateTypeLabel`),
    localeLabel: t(`${p}.localeLabel`),
    localeNote: t(`${p}.localeNote`),
    localeUnavailable: t(`${p}.localeUnavailable`),
    recipientLabel: t(`${p}.recipientLabel`),
    recipientHint: t(`${p}.recipientHint`),
    previewTitle: t(`${p}.previewTitle`),
    sendCta: t(`${p}.sendCta`),
    sendLockedTitle: t(`${p}.sendLockedTitle`),
    sendLockedBody: t(`${p}.sendLockedBody`),
    consentLabel: t(`${p}.consentLabel`),
    certRequired: t(`${p}.certRequired`),
    noTemplates: t(`${p}.noTemplates`),
    previewSubject: t(`${p}.previewSubject`),
    types: {
      product_introduction: t(`${p}.types.product_introduction`),
      follow_up: t(`${p}.types.follow_up`),
      meeting_request: t(`${p}.types.meeting_request`),
      product_information: t(`${p}.types.product_information`),
    },
    products: {
      kompis_web: t("partnersPortal.certifiedSalesPartner.marketing.filterKompisWeb"),
      kompis_bedrift: t("partnersPortal.certifiedSalesPartner.marketing.filterKompisBedrift"),
    },
  };

  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerEmailTemplatesPanel labels={panelLabels} portalLocale={locale} />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
