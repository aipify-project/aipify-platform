import { CertifiedSalesPartnerEmailTemplatesPanel } from "@/components/partners-portal/CertifiedSalesPartnerEmailTemplatesPanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { resolvePartnersPortalServerAccess } from "@/lib/partners-portal/server-access";
import { publicEmailAvatarUrl } from "@/lib/certified-sales-partner/email-crm/signature";

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
  const access = await resolvePartnersPortalServerAccess();
  let companyName = "";
  let contactEmail = "";
  let avatarUrl: string | null = null;
  if (access.kind === "allowed") {
    const { data } = await access.supabase.auth.getUser();
    const meta = (data.user?.user_metadata ?? {}) as Record<string, unknown>;
    companyName = typeof meta.company_name === "string" ? meta.company_name : typeof meta.company === "string" ? meta.company : "";
    contactEmail = data.user?.email ?? "";
    const rawAvatar = [meta.avatar_url, meta.profile_image_url, meta.picture].find((value) => typeof value === "string") as
      | string
      | undefined;
    avatarUrl = publicEmailAvatarUrl(rawAvatar) || null;
  }

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
    inboxLink: t(`${p}.inboxLink`),
    previewReady: t(`${p}.previewReady`),
    sendNotActivated: t(`${p}.sendNotActivated`),
    copySubject: t(`${p}.copySubject`),
    copyBody: t(`${p}.copyBody`),
    copyWithLink: t(`${p}.copyWithLink`),
    copied: t(`${p}.copied`),
    copyFailed: t(`${p}.copyFailed`),
    howSendingTitle: t(`${p}.howSendingTitle`),
    howSendingBody: t(`${p}.howSendingBody`),
    linkUnavailable: t(`${p}.linkUnavailable`),
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
      <CertifiedSalesPartnerEmailTemplatesPanel
        labels={panelLabels}
        portalLocale={locale}
        companyName={companyName}
        contactEmail={contactEmail}
        avatarUrl={avatarUrl}
      />
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
