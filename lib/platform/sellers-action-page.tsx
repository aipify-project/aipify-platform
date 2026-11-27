import {
  CertifiedSellersLivePanel,
  type SellersLiveSection,
} from "@/components/platform/sellers/CertifiedSellersLivePanel";
import { PlatformSellersHubShell } from "@/components/platform/sellers/PlatformSellersHubShell";
import { buildSellersActionLabels, buildSellersLiveLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPlatformSellersHubLabels } from "@/lib/platform/sellers-hub-labels";

/**
 * Core-wired Platform > Selgere page. Data is loaded client-side from the fail-closed
 * `/api/platform/sellers/*` routes; the server only resolves locale and translated copy.
 * Backend readiness is decided by those APIs (Core RPC result), not by a build-time flag.
 */
export async function renderPlatformSellersLivePage(input: {
  titleKey: string;
  subtitleKey: string;
  section: SellersLiveSection;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformSellersHubShell labels={buildPlatformSellersHubLabels(t)}>
      <CertifiedSellersLivePanel
        section={input.section}
        locale={locale}
        title={t(input.titleKey)}
        subtitle={t(input.subtitleKey)}
        notReadyTitle={t("platform.sellers.backend.notReadyTitle")}
        notReadyBody={t("platform.sellers.backend.notReadyBody")}
        labels={buildSellersLiveLabels(t)}
        actionLabels={buildSellersActionLabels(t)}
      />
    </PlatformSellersHubShell>
  );
}

type ActionSection = "partners" | "settlements" | "products" | "commissions";

export async function renderPlatformSellersActionPage(input: {
  titleKey: string;
  subtitleKey: string;
  section: ActionSection;
}) {
  return renderPlatformSellersLivePage(input);
}
