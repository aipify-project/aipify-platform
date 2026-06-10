import { PlatformTrustScaffold } from "@/components/platform/trust";
import {
  ALLOWED_STORAGE_CATEGORIES,
  DATA_ACCESS_LEVELS,
  PROHIBITED_STORAGE_CATEGORIES,
} from "@/lib/trust";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformTrustPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  const supabase = await createClient();
  const { data: governance } = await supabase.rpc("get_platform_trust_governance");

  const statsValue = governance
    ? t("platform.trust.statsValue")
        .replace("{allowed}", String(ALLOWED_STORAGE_CATEGORIES.length))
        .replace("{prohibited}", String(PROHIBITED_STORAGE_CATEGORIES.length))
        .replace("{levels}", String(DATA_ACCESS_LEVELS.length))
        .replace("{audits}", String(governance.audit_event_count ?? 0))
    : undefined;

  return (
    <PlatformTrustScaffold
      title={t("platform.trust.title")}
      subtitle={t("platform.trust.subtitle")}
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
  );
}
