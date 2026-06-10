import { DEFAULT_LOCALE, type Locale, type Namespace } from "./config";

export async function getDictionary(
  locale: Locale = DEFAULT_LOCALE,
  namespaces: Namespace[] = ["common", "dashboard"]
) {
  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await import(`@/locales/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    })
  );

  return Object.fromEntries(entries);
}
