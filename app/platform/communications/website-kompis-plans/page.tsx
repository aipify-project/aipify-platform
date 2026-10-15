import { WebsiteKompisPlansCommunicationPanel } from "@/components/platform/WebsiteKompisPlansCommunicationPanel";
import {
  WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES,
  WEBSITE_KOMPIS_PLAN_CATALOG,
  buildWebsiteKompisEmailPreviewCopy,
  buildWebsiteKompisPlanPlatformLabels,
} from "@/lib/website-kompis-plans";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Platform communication readiness for Kompis Web plans.
 * Preview-only — no customer email send, Stripe, or entitlement writes.
 *
 * Root-cause fix: never pass the server translator function into the client panel
 * (RSC cannot serialize functions → runtime crash on this route).
 */
export default async function PlatformWebsiteKompisPlansPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildWebsiteKompisPlanPlatformLabels(t);

  const previews = Object.fromEntries(
    WEBSITE_KOMPIS_COMMUNICATION_TEMPLATES.map((tpl) => [
      tpl.id,
      buildWebsiteKompisEmailPreviewCopy(tpl.id, t),
    ]),
  ) as Parameters<typeof WebsiteKompisPlansCommunicationPanel>[0]["previews"];

  const planNames = Object.fromEntries(
    WEBSITE_KOMPIS_PLAN_CATALOG.map((plan) => [
      plan.id,
      t(`platform.websiteKompisPlans.plans.${plan.id}.name`),
    ]),
  );

  return (
    <WebsiteKompisPlansCommunicationPanel
      labels={labels}
      previews={previews}
      planNames={planNames}
      backHref="/platform/communications"
      backLabel={t("platform.communications.back")}
    />
  );
}
