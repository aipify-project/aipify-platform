import { PlatformTrustScaffold, TrustAccessDenied, TrustDomainPageHeader } from "@/components/platform/trust";
import {
  ALLOWED_STORAGE_CATEGORIES,
  DATA_ACCESS_LEVELS,
  PROHIBITED_STORAGE_CATEGORIES,
} from "@/lib/trust";
import { canAccessTrustDomain } from "@/lib/platform/trust-center/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { getPlatformProfile } from "@/lib/tenant/get-platform-profile";

export default async function TrustSecurityPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const supabase = await createClient();
  const profile = await getPlatformProfile(supabase);

  if (!canAccessTrustDomain("security", profile?.role)) {
    return <TrustAccessDenied message={t("platform.trustCenter.accessDenied")} />;
  }

  const { data: governance } = await supabase.rpc("get_platform_trust_governance");

  const statsValue = governance
    ? t("platform.trust.statsValue")
        .replace("{allowed}", String(ALLOWED_STORAGE_CATEGORIES.length))
        .replace("{prohibited}", String(PROHIBITED_STORAGE_CATEGORIES.length))
        .replace("{levels}", String(DATA_ACCESS_LEVELS.length))
        .replace("{audits}", String(governance.audit_event_count ?? 0))
    : undefined;

  return (
    <>
      <TrustDomainPageHeader
        title={t("platform.trustCenter.domains.security.title")}
        subtitle={t("platform.trustCenter.pageSubtitles.security")}
      />
      <PlatformTrustScaffold
        title={t("platform.trustCenter.securityDetail.title")}
        subtitle={t("platform.trustCenter.securityDetail.subtitle")}
        statsLabel={t("platform.trust.statsLabel")}
        statsValue={statsValue}
        responsibility={
          typeof governance?.platform_responsibility === "string"
            ? governance.platform_responsibility
            : t("platform.trust.responsibility")
        }
        areas={[
          t("platform.trust.areas.governance"),
          t("platform.trust.areas.audit"),
          t("platform.trust.areas.learning"),
          t("platform.trust.areas.skills"),
          t("platform.trust.areas.offboarding"),
        ]}
      />
    </>
  );
}
