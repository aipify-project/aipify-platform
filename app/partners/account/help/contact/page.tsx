import { CertifiedSalesPartnerContactPanel } from "@/components/partners-portal/CertifiedSalesPartnerContactPanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { getSupportIntakeGateState } from "@/lib/support-intake";
import { createClient } from "@/lib/supabase/server";

export default async function PartnersHelpContactPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const p = "partnersPortal.certifiedSalesPartner.guides.contact";
  const labels = buildCspWorkspaceLabels(t, `${p}.title`, `${p}.subtitle`);
  const gate = getSupportIntakeGateState();

  let contactEmail: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    contactEmail = user?.email?.trim() || null;
  } catch {
    contactEmail = null;
  }

  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerContactPanel
        ticketLive={gate.live}
        contactEmail={contactEmail}
        labels={{
          title: t(`${p}.title`),
          intro: t(`${p}.intro`),
          category: t(`${p}.category`),
          priority: t(`${p}.priority`),
          subject: t(`${p}.subject`),
          description: t(`${p}.description`),
          submit: t(`${p}.submit`),
          submitting: t(`${p}.submitting`),
          blockedTitle: t(`${p}.blockedTitle`),
          blockedBody: t(`${p}.blockedBody`),
          mailtoCta: t(`${p}.mailtoCta`),
          messagesCta: t(`${p}.messagesCta`),
          appSupportCta: t(`${p}.appSupportCta`),
          success: t(`${p}.success`),
          error: t(`${p}.error`),
          senderTitle: t(`${p}.senderTitle`),
          senderName: t(`${p}.senderName`),
          senderEmail: t(`${p}.senderEmail`),
          categories: {
            billing: t(`${p}.categories.billing`),
            product: t(`${p}.categories.product`),
            account: t(`${p}.categories.account`),
            technical: t(`${p}.categories.technical`),
            other: t(`${p}.categories.other`),
            partner_commission: t(`${p}.categories.partner_commission`),
          },
          priorities: {
            normal: t(`${p}.priorities.normal`),
            urgent: t(`${p}.priorities.urgent`),
            critical: t(`${p}.priorities.critical`),
          },
        }}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
