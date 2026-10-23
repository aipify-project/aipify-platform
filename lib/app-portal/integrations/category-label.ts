export const INTEGRATION_CATEGORY_KEYS = [
  "productivity",
  "commerce",
  "finance",
  "crm",
  "support",
  "marketing",
  "storage",
  "communication",
  "analytics",
  "development",
  "custom",
  "general",
] as const;

export type IntegrationCategoryKey = (typeof INTEGRATION_CATEGORY_KEYS)[number];

export type IntegrationCategoryLabels = {
  categoryFallback: string;
  categories: Record<IntegrationCategoryKey, string>;
};

const CATEGORY_KEY_SET = new Set<string>(INTEGRATION_CATEGORY_KEYS);

/** Human label for a provider category. Unknown codes never render as raw enums. */
export function integrationCategoryLabel(
  category: string,
  labels: IntegrationCategoryLabels,
): string {
  const key = category.trim().toLowerCase();
  if (CATEGORY_KEY_SET.has(key)) {
    const label = labels.categories[key as IntegrationCategoryKey]?.trim();
    if (label) return label;
  }
  return labels.categoryFallback;
}
