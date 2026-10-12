import Link from "next/link";
import { AppContentWidth, AppPageHeader } from "@/components/app/design";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Thin Web settings hub — points at connection, appearance, and preserved operator. */
export default async function WebsiteKompisSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);

  const links = [
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebConnection,
      label: t("customerApp.portalStructure.nav.kompisWebConnection"),
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisWebAppearance,
      label: t("customerApp.portalStructure.nav.kompisWebAppearance"),
    },
    {
      href: FOUNDATION_NAV_BINDINGS.kompisOperatorPreserved,
      label: t("customerApp.portalStructure.webHub.operatorLink"),
    },
  ];

  return (
    <AppContentWidth>
      <AppPageHeader
        eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
        title={t("customerApp.portalStructure.nav.kompisWebSettings")}
        description={t("customerApp.portalStructure.webHub.settingsDescription")}
      />
      <ul className={`${AppLayoutClasses.card} divide-y divide-aipify-border`}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center justify-between px-1 py-4 text-sm font-medium text-aipify-text transition hover:text-aipify-companion focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus"
            >
              <span>{link.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </AppContentWidth>
  );
}
