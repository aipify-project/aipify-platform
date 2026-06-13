import TrustSubNav from "@/components/platform/trust/TrustSubNav";
import { TRUST_NAV } from "@/lib/platform/trust-center/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <TrustSubNav
        items={TRUST_NAV.map((item) => ({
          id: item.id,
          href: item.href,
          label: t(item.labelKey),
        }))}
      />
      {children}
    </div>
  );
}
