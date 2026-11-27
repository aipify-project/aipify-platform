import { Suspense } from "react";
import { CertifiedSalesPartnerProfilePanel } from "@/components/partners-portal/CertifiedSalesPartnerProfilePanel";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { resolvePartnersAvatarPointer } from "@/lib/partners-portal/avatar";
import { buildCspBankPanelLabels } from "@/lib/partners-portal/csp-section-labels";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { resolvePartnersPortalServerAccess } from "@/lib/partners-portal/server-access";
import { buildPartnersPortalAvatarLabels } from "@/lib/partners-portal/shell-labels";
import { AipifyLoader } from "@/components/ui/aipify-loader";

const PARTNER_STATUS_KEYS = [
  "registered",
  "under_review",
  "needs_information",
  "approved",
  "active",
  "certified",
  "in_academy",
  "rejected",
  "suspended",
  "unknown",
] as const;

export default async function PartnersPortalProfilePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal"]);
  const t = createTranslator(dict);
  // Shares React cache() with layout gate — no duplicate Core round-trip in this request.
  const access = await resolvePartnersPortalServerAccess();
  let avatarUrl: string | null = null;
  let loginEmail: string | null = null;
  if (access.kind === "allowed") {
    try {
      const {
        data: { user },
      } = await access.supabase.auth.getUser();
      avatarUrl = resolvePartnersAvatarPointer(user?.user_metadata?.avatar_url);
      loginEmail = typeof user?.email === "string" && user.email.trim() ? user.email.trim() : null;
    } catch {
      avatarUrl = null;
      loginEmail = null;
    }
  }

  const p = "partnersPortal.certifiedSalesPartner.profilePage";
  const labels = {
    headerTitle: t(`${p}.headerTitle`),
    headerSubtitle: t(`${p}.headerSubtitle`),
    personTab: t(`${p}.personTab`),
    companyTab: t(`${p}.companyTab`),
    payoutTab: t(`${p}.payoutTab`),
    securityTab: t(`${p}.securityTab`),
    displayName: t(`${p}.displayName`),
    status: t(`${p}.status`),
    email: t(`${p}.email`),
    emailUnavailable: t(`${p}.emailUnavailable`),
    phone: t(`${p}.phone`),
    phoneUnavailable: t(`${p}.phoneUnavailable`),
    country: t(`${p}.country`),
    certification: t(`${p}.certification`),
    certificationPassed: t(`${p}.certificationPassed`),
    certificationNone: t(`${p}.certificationNone`),
    readOnlyHint: t(`${p}.readOnlyHint`),
    coreBlockedHint: t(`${p}.coreBlockedHint`),
    formIntroPerson: t(`${p}.formIntroPerson`),
    formIntroCompany: t(`${p}.formIntroCompany`),
    companyContact: t(`${p}.companyContact`),
    organizationNumber: t(`${p}.organizationNumber`),
    address: t(`${p}.address`),
    website: t(`${p}.website`),
    contactCta: t(`${p}.contactCta`),
    companyUnavailableTitle: t(`${p}.companyUnavailableTitle`),
    companyUnavailableBody: t(`${p}.companyUnavailableBody`),
    payoutIntro: t(`${p}.payoutIntro`),
    securityIntro: t(`${p}.securityIntro`),
    securityAccountNote: t(`${p}.securityAccountNote`),
    securityPasswordTitle: t(`${p}.securityPasswordTitle`),
    twoFactorTitle: t(`${p}.twoFactorTitle`),
    openTwoFactor: t(`${p}.openTwoFactor`),
    lockScreenTitle: t(`${p}.lockScreenTitle`),
    lockScreenBody: t(`${p}.lockScreenBody`),
    openSettlement: t(`${p}.openSettlement`),
    notAvailable: t(`${p}.notAvailable`),
    partnerStatus: Object.fromEntries(
      PARTNER_STATUS_KEYS.map((key) => [
        key,
        t(`partnersPortal.certifiedSalesPartner.overview.partnerStatus.${key}`),
      ]),
    ),
  };

  const workspace = buildCspWorkspaceLabels(t, `${p}.headerTitle`, `${p}.headerSubtitle`);

  return (
    <CertifiedSalesPartnerWorkspacePanel labels={workspace}>
      <Suspense fallback={<AipifyLoader centered size="sm" />}>
        <CertifiedSalesPartnerProfilePanel
          labels={labels}
          avatarLabels={buildPartnersPortalAvatarLabels(t)}
          bankLabels={buildCspBankPanelLabels(t)}
          initialAvatarUrl={avatarUrl}
          loginEmail={loginEmail}
          locale={locale}
        />
      </Suspense>
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
