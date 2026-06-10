import ActionSubNav from "@/components/platform/ActionSubNav";
import { ACTION_NAV } from "@/lib/platform/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionsLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <div className="space-y-6">
      <ActionSubNav
        items={ACTION_NAV.map((item) => ({
          id: item.id,
          href: item.href,
          label: t(item.labelKey),
        }))}
      />
      {children}
    </div>
  );
}
