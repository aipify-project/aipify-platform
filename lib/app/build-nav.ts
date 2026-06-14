import { getAppNavItemsForShell, type AppNavId } from "./nav-config";

export function buildAppNavConfig(
  labels: Partial<Record<AppNavId, string>>
): Array<{ id: string; href: string; label: string }> {
  const seen = new Set<string>();

  return getAppNavItemsForShell()
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .map((item) => ({
      id: item.id,
      href: item.href,
      label: labels[item.id] ?? item.labelKey,
    }));
}
