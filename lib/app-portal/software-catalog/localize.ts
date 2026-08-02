import { resolveFeatureAliasKey } from "@/lib/commercial-packages/package-presentation";
import { lookupDictionaryString } from "@/lib/i18n/lookup-dictionary-string";
import type { Dictionary } from "@/lib/i18n/translate";
import type { SoftwareCatalogLocalizers } from "./load-catalog";

const PACKAGE_NS = "customerApp.portalStructure.softwareCatalog.packageCopy";
const MODULE_NS = "customerApp.portalStructure.softwareCatalog.moduleDisplayNames";
const FEATURE_NS = "customerApp.portalStructure.softwareCatalog.featureLabels";

export function buildSoftwareCatalogLocalizers(dict: Dictionary): SoftwareCatalogLocalizers {
  return {
    localizePackage(packageKey: string) {
      const name = lookupDictionaryString(dict, `${PACKAGE_NS}.${packageKey}.name`);
      const description = lookupDictionaryString(dict, `${PACKAGE_NS}.${packageKey}.description`);
      if (!name && !description) return null;
      return { name, description };
    },
    localizeModuleName(moduleKey: string) {
      return lookupDictionaryString(dict, `${MODULE_NS}.${moduleKey}`);
    },
    localizeFeature(feature: string) {
      const alias = resolveFeatureAliasKey(feature);
      if (!alias) return null;
      return lookupDictionaryString(dict, `${FEATURE_NS}.${alias}`);
    },
  };
}
