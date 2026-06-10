import PlatformSystemStatusPanel from "@/components/platform/PlatformSystemStatusPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformSystemPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformSystemStatusPanel
      labels={{
        title: t("platform.system.title"),
        subtitle: t("platform.system.subtitle"),
        loading: t("platform.system.loading"),
        empty: t("platform.system.empty"),
        operational: t("platform.system.operational"),
        degraded: t("platform.system.degraded"),
        outage: t("platform.system.outage"),
        pending: t("platform.system.pending"),
        pulseLabel: t("branding.pulseLabel"),
        services: {
          supabase: t("platform.system.services.supabase"),
          resend: t("platform.system.services.resend"),
          klarna: t("platform.system.services.klarna"),
          stripe: t("platform.system.services.stripe"),
          aipifyApi: t("platform.system.services.aipifyApi"),
          webhooks: t("platform.system.services.webhooks"),
        },
        details: {
          supabase: t("platform.system.details.supabase"),
          resend: t("platform.system.details.resend"),
          klarna: t("platform.system.details.klarna"),
          stripe: t("platform.system.details.stripe"),
          aipifyApi: t("platform.system.details.aipifyApi"),
          webhooks: t("platform.system.details.webhooks"),
        },
      }}
    />
  );
}
