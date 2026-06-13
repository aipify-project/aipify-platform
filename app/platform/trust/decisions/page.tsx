import PlatformDecisionPanel from "@/components/platform/PlatformDecisionPanel";
import { TrustAccessDenied, TrustDomainPageHeader } from "@/components/platform/trust";
import { buildTrustPanelLabels } from "@/lib/platform/trust-center/panel-labels";
import { canAccessTrustDomain } from "@/lib/platform/trust-center/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";

export default async function TrustDecisionsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const supabase = await createClient();
  const profile = await getPlatformProfile(supabase);

  if (!canAccessTrustDomain("decisions", profile?.role)) {
    return <TrustAccessDenied message={t("platform.trustCenter.accessDenied")} />;
  }

  const labels = buildTrustPanelLabels(t);

  return (
    <>
      <TrustDomainPageHeader
        title={t("platform.trustCenter.domains.decisions.title")}
        subtitle={t("platform.trustCenter.pageSubtitles.decisions")}
      />
      <PlatformDecisionPanel labels={labels.decisionSupport} />
    </>
  );
}
