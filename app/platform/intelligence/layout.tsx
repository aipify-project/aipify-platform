import IntelligenceSubNav from "@/components/platform/IntelligenceSubNav";
import { INTELLIGENCE_NAV } from "@/lib/platform/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <div className="space-y-6">
      <IntelligenceSubNav
        items={INTELLIGENCE_NAV.map((item) => ({
          id: item.id,
          href: item.href,
          label: t(item.labelKey),
        }))}
      />
      {children}
    </div>
  );
}
