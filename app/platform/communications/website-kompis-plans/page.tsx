import { WebsiteKompisPlansCommunicationPanel } from "@/components/platform/WebsiteKompisPlansCommunicationPanel";
import { buildWebsiteKompisPlanPlatformLabels } from "@/lib/website-kompis-plans";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Platform communication readiness for Kompis Web plans.
 * Preview-only — no customer email send, Stripe, or entitlement writes.
 */
export default async function PlatformWebsiteKompisPlansPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <WebsiteKompisPlansCommunicationPanel
      labels={buildWebsiteKompisPlanPlatformLabels(t)}
      t={t}
    />
  );
}
