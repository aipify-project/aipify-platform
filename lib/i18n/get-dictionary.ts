import { DEFAULT_LOCALE, type Locale, type Namespace } from "./config";
import {
  resolveCustomerAppSplitForModule,
  type CustomerAppSplitName,
} from "./customer-app-split-config";
import { loadCustomerAppSplit, loadRootNamespace } from "./load-namespace";
import { injectCompanyIntoDictionary } from "@/lib/company/inject";
import { mergeDictionary } from "./merge-dictionary";
import type { Dictionary } from "./translate";

async function loadNamespaceWithFallback(locale: Locale, ns: Namespace): Promise<Dictionary> {
  const localized = await loadRootNamespace(locale, ns);
  if (locale === DEFAULT_LOCALE) return localized;
  return mergeDictionary(await loadRootNamespace(DEFAULT_LOCALE, ns), localized);
}

async function loadNamespace(locale: Locale, ns: Namespace): Promise<Dictionary> {
  return loadRootNamespace(locale, ns);
}

export async function getDictionary(
  locale: Locale = DEFAULT_LOCALE,
  namespaces: Namespace[] = ["common", "dashboard"]
) {
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

async function loadCustomerAppSplitMerged(
  locale: Locale,
  splits: CustomerAppSplitName[]
): Promise<Dictionary> {
  const uniqueSplits = [...new Set(splits)];
  let merged: Dictionary = {};

  for (const split of uniqueSplits) {
    const localized = await loadCustomerAppSplit(locale, split);
    const withFallback =
      locale === DEFAULT_LOCALE
        ? localized
        : mergeDictionary(await loadCustomerAppSplit(DEFAULT_LOCALE, split), localized);
    merged = mergeDictionary(merged, withFallback);
  }

  return merged;
}

function pickLayoutNavigation(navSplit: Dictionary): Dictionary {
  const navigation: Dictionary = {};
  if (navSplit.nav) navigation.nav = navSplit.nav;
  if (navSplit.navGroups) navigation.navGroups = navSplit.navGroups;
  return navigation;
}

/** Load only the customerApp slices required for a module key — keeps pages off the 1.6MB bundle. */
export async function getCustomerAppDictionaryForModule(
  locale: Locale = DEFAULT_LOCALE,
  moduleKey: string,
  extraSplits: CustomerAppSplitName[] = []
) {
  const primarySplit = resolveCustomerAppSplitForModule(moduleKey);
  const splits = [primarySplit, ...extraSplits];
  const customerApp = await loadCustomerAppSplitMerged(locale, splits);
  const base = await getDictionary(locale, ["common"]);
  return { ...base, customerApp };
}

/** Layout shell — common + shell + navigation (nav labels only). No customerApp monolith. */
export async function getAppLayoutDictionary(locale: Locale = DEFAULT_LOCALE) {
  const [common, shell, navSplit] = await Promise.all([
    loadNamespaceWithFallback(locale, "common"),
    loadNamespaceWithFallback(locale, "shell"),
    loadCustomerAppSplitMerged(locale, ["navigation"]),
  ]);

  return injectCompanyIntoDictionary({
    common,
    shell,
    navigation: pickLayoutNavigation(navSplit),
  });
}

export async function getCustomerAppDictionaryForSplits(
  locale: Locale = DEFAULT_LOCALE,
  splits: CustomerAppSplitName[]
) {
  const customerApp = await loadCustomerAppSplitMerged(locale, splits);
  const base = await getDictionary(locale, ["common"]);
  return { ...base, customerApp };
}

/** Customer App page dict: targeted customerApp splits + root namespaces (e.g. hosts, branding). */
export async function getCustomerAppPageDictionary(
  locale: Locale = DEFAULT_LOCALE,
  options: {
    splits?: CustomerAppSplitName[];
    namespaces?: Namespace[];
  } = {}
) {
  const splits = options.splits ?? ["dashboard"];
  const namespaces = options.namespaces ?? [];
  const [customerAppDict, ...namespaceDicts] = await Promise.all([
    getCustomerAppDictionaryForSplits(locale, splits),
    ...namespaces.map((ns) => getDictionary(locale, [ns])),
  ]);
  return namespaceDicts.reduce((merged, part) => ({ ...merged, ...part }), customerAppDict);
}
