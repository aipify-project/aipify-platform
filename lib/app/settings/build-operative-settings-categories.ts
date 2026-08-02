import {
  OPERATIVE_SETTINGS_CATEGORIES,
  isUnsafeSettingsPresentationText,
  type OperativeSettingsCategoryId,
} from "@/lib/app/settings/operative-settings";
import { lookupDictionaryString } from "@/lib/i18n/lookup-dictionary-string";
import type { Dictionary } from "@/lib/i18n/translate";

export type OperativeSettingsCategoryView = {
  id: OperativeSettingsCategoryId;
  title: string;
  description: string;
  links: Array<{ href: string; label: string }>;
};

/**
 * Builds customer-facing settings categories from the operative allowlist + locale leaves.
 * Missing/unsafe labels fail closed (link omitted). Empty categories are omitted.
 */
export function buildOperativeSettingsCategories(dict: Dictionary): OperativeSettingsCategoryView[] {
  const root = "customerApp.settings.operativeCategories";
  const categories: OperativeSettingsCategoryView[] = [];

  for (const category of OPERATIVE_SETTINGS_CATEGORIES) {
    const title = lookupDictionaryString(dict, `${root}.${category.id}.title`);
    const description = lookupDictionaryString(dict, `${root}.${category.id}.description`);
    if (!title || !description) continue;
    if (isUnsafeSettingsPresentationText(title) || isUnsafeSettingsPresentationText(description)) {
      continue;
    }

    const links: Array<{ href: string; label: string }> = [];
    for (const link of category.links) {
      const label = lookupDictionaryString(dict, `${root}.${category.id}.links.${link.id}.label`);
      const href =
        lookupDictionaryString(dict, `${root}.${category.id}.links.${link.id}.href`) ?? link.href;
      if (!label || isUnsafeSettingsPresentationText(label)) continue;
      if (!href.startsWith("/app/")) continue;
      if (isUnsafeSettingsPresentationText(href)) continue;
      links.push({ href, label });
    }

    if (links.length === 0) continue;
    categories.push({ id: category.id, title, description, links });
  }

  return categories;
}
