import {
  PartnersPortalAuthGuard,
  PartnersPortalShell,
} from "@/components/partners-portal";
import {
  buildPartnersPortalLabels,
  buildPartnersPortalNavLabels,
} from "@/lib/partners-portal/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary(await getLocale(), ["common", "auth", "partnersPortal"]);
  const t = createTranslator(dict);
  const labels = buildPartnersPortalLabels(t);
  const navLabels = buildPartnersPortalNavLabels(t);

  return (
    <PartnersPortalAuthGuard loadingLabel={labels.shell.loading}>
      <PartnersPortalShell
        portalBadge={labels.shell.portalBadge}
        portalTitle={labels.shell.portalTitle}
        portalSubtitle={labels.shell.portalSubtitle}
        signOutLabel={t("auth.logout.signOut")}
        governanceNote={labels.shell.governanceNote}
        navLabels={navLabels}
      >
        {children}
      </PartnersPortalShell>
    </PartnersPortalAuthGuard>
  );
}
