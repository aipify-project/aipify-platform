import { CertifiedSalesPartnerEmailInbox } from "@/components/partners-portal/CertifiedSalesPartnerEmailInbox";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersMarketingEmailInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  const p = "partnersPortal.certifiedSalesPartner.emailTemplates";
  const labels = buildCspWorkspaceLabels(t, `${p}.inboxTitle`, `${p}.inboxIntro`);
  const query = await searchParams;
  const lead = typeof query.lead === "string" ? query.lead : null;

  return (
    <CertifiedSalesPartnerWorkspacePanel labels={labels}>
      <CertifiedSalesPartnerEmailInbox
        leadId={lead}
        title={t(`${p}.inboxTitle`)}
        intro={t(`${p}.inboxIntro`)}
        empty={t(`${p}.inboxEmpty`)}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
