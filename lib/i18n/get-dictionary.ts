import { DEFAULT_LOCALE, type Locale, type Namespace } from "./config";
import { injectCompanyIntoDictionary } from "@/lib/company/inject";
import { mergeDictionary } from "./merge-dictionary";
import type { Dictionary } from "./translate";

export async function getDictionary(
  locale: Locale = DEFAULT_LOCALE,
  namespaces: Namespace[] = ["common", "dashboard"]
) {
  const loadNamespace = async (loc: Locale, ns: Namespace) => {
    const mod = await import(`@/locales/${loc}/${ns}.json`);
    return mod.default as Dictionary;
  };

  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      const localized = await loadNamespace(locale, ns);
      if (locale === DEFAULT_LOCALE) {
        return [ns, localized] as const;
      }
      const fallback = await loadNamespace(DEFAULT_LOCALE, ns);
      return [ns, mergeDictionary(fallback, localized)] as const;
    })
  );

  return injectCompanyIntoDictionary(Object.fromEntries(entries));
}
