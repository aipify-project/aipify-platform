import {
  PartnerPortalAuthGuard,
  PartnerPortalShell,
} from "@/components/partner-portal";
import { buildPartnerPortalNavLabels } from "@/lib/partner-portal/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary(await getLocale(), ["common", "auth", "partnerPortal"]);
  const t = createTranslator(dict);
  const p = "partnerPortal";

  return (
    <PartnerPortalAuthGuard
      loadingLabel={t(`${p}.loading`)}
      deniedLabel={t(`${p}.accessDenied`)}
    >
      <PartnerPortalShell
        portalTitle={t(`${p}.portalTitle`)}
        portalSubtitle={t(`${p}.portalSubtitle`)}
        signOutLabel={t("auth.logout.signOut")}
        navLabels={buildPartnerPortalNavLabels(t)}
        governanceNote={t(`${p}.governanceNote`)}
      >
        {children}
      </PartnerPortalShell>
    </PartnerPortalAuthGuard>
  );
}
