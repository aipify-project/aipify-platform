import { CertifiedSalesPartnerContactPanel } from "@/components/partners-portal/CertifiedSalesPartnerContactPanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { getSupportIntakeGateState } from "@/lib/support-intake";

export default async function PartnersHelpContactPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const p = "partnersPortal.certifiedSalesPartner.guides.contact";
  const labels = buildCspWorkspaceLabels(t, `${p}.title`, `${p}.subtitle`);
  const gate = getSupportIntakeGateState();

  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerContactPanel
        ticketLive={gate.live}
        labels={{
          title: t(`${p}.title`),
          intro: t(`${p}.intro`),
          category: t(`${p}.category`),
          subject: t(`${p}.subject`),
          description: t(`${p}.description`),
          submit: t(`${p}.submit`),
          submitting: t(`${p}.submitting`),
          blockedTitle: t(`${p}.blockedTitle`),
          blockedBody: t(`${p}.blockedBody`),
          mailtoCta: t(`${p}.mailtoCta`),
          messagesCta: t(`${p}.messagesCta`),
          success: t(`${p}.success`),
          error: t(`${p}.error`),
          categories: {
            general: t(`${p}.categories.general`),
            payout: t(`${p}.categories.payout`),
            academy: t(`${p}.categories.academy`),
            company: t(`${p}.categories.company`),
            technical: t(`${p}.categories.technical`),
          },
        }}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
