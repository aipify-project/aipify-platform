import GrowthPartnerPortalAuthGuard from "@/components/growth-partner-portal/GrowthPartnerPortalAuthGuard";
import GrowthPartnerPortalShell from "@/components/growth-partner-portal/GrowthPartnerPortalShell";
import { buildGrowthPartnerPortalNavLabels } from "@/lib/growth-partner-portal/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary(await getLocale(), ["common", "auth", "growthPartnerPortal"]);
  const t = createTranslator(dict);
  const p = "growthPartnerPortal";

  return (
    <GrowthPartnerPortalAuthGuard loadingLabel={t(`${p}.loading`)}>
      <GrowthPartnerPortalShell
        portalTitle={t(`${p}.portalTitle`)}
        portalSubtitle={t(`${p}.portalSubtitle`)}
        signOutLabel={t("auth.logout.signOut")}
        navLabels={buildGrowthPartnerPortalNavLabels(t)}
        governanceNote={t(`${p}.governanceNote`)}
      >
        {children}
      </GrowthPartnerPortalShell>
    </GrowthPartnerPortalAuthGuard>
  );
}
