import { getAppNavItemsForShell, type AppNavId } from "./nav-config";

export function buildAppNavConfig(
  labels: Partial<Record<AppNavId, string>>
): Array<{ id: string; href: string; label: string }> {
  return getAppNavItemsForShell().map((item) => ({
    id: item.id,
    href: item.href,
    label: labels[item.id] ?? item.labelKey,
  }));
}
