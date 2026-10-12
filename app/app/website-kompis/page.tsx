import Link from "next/link";
import { AppContentWidth, AppIconActionCard, AppPageHeader } from "@/components/app/design";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Thin Kompis Web product hub — links to existing admin surfaces. */
export default async function WebsiteKompisHubPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);

  const cards = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebQa,
      title: t("customerApp.portalStructure.nav.kompisWebQa"),
      description: t("customerApp.portalStructure.webHub.qaDescription"),
      tone: "purple" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebFaq,
      title: t("customerApp.portalStructure.nav.kompisWebFaq"),
      description: t("customerApp.portalStructure.webHub.faqDescription"),
      tone: "blue" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
      title: t("customerApp.portalStructure.nav.kompisWebConnection"),
      description: t("customerApp.portalStructure.webHub.connectionDescription"),
      tone: "lavender" as const,
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebAppearance,
      title: t("customerApp.portalStructure.nav.kompisWebAppearance"),
      description: t("customerApp.portalStructure.webHub.appearanceDescription"),
      tone: "lavender" as const,
    },
  ];

  return (
    <AppContentWidth>
      <AppPageHeader
        eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
        title={t("customerApp.portalStructure.nav.kompisWebDashboard")}
        description={t("customerApp.portalStructure.webHub.description")}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <AppIconActionCard
            key={card.href}
            href={card.href}
            title={card.title}
            description={card.description}
            tone={card.tone}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            }
          />
        ))}
      </div>
      <p className="text-sm text-aipify-text-secondary">
        <Link
          href={FOUNDATION_NAV_BINDINGS.kompisOperatorPreserved}
          className="font-medium text-aipify-accent hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
        >
          {t("customerApp.portalStructure.webHub.operatorLink")}
        </Link>
      </p>
    </AppContentWidth>
  );
}
