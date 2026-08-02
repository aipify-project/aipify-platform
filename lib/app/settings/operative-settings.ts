/**
 * Customer-ready `/app/settings` presentation — fail-closed allowlist.
 * Foundation / unfinished routes must not appear as operative customer settings.
 */

export type OperativeSettingsCategoryId =
  | "accountSecurity"
  | "billingSubscription"
  | "integrations"
  | "developerAccess";

export type OperativeSettingsLinkDef = {
  /** Locale leaf under customerApp.settings.operativeCategories.{category}.links.{id} */
  id: string;
  href: string;
};

export type OperativeSettingsCategoryDef = {
  id: OperativeSettingsCategoryId;
  links: OperativeSettingsLinkDef[];
};

/** Only routes that are production-operative for ordinary customers. */
export const OPERATIVE_SETTINGS_CATEGORIES: readonly OperativeSettingsCategoryDef[] = [
  {
    id: "accountSecurity",
    links: [
      { id: "signInVerification", href: "/app/settings/two-factor" },
      { id: "security", href: "/app/settings/security" },
    ],
  },
  {
    id: "billingSubscription",
    links: [{ id: "billing", href: "/app/settings/billing" }],
  },
  {
    id: "integrations",
    links: [{ id: "connectedApps", href: "/app/platform/integrations/connected" }],
  },
  {
    id: "developerAccess",
    links: [{ id: "developer", href: "/app/settings/developer" }],
  },
] as const;

const FORBIDDEN_LABELS = new Set([
  "label",
  "href",
  "title",
  "description",
  "link",
]);

export function isUnsafeSettingsPresentationText(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("customerApp.") || trimmed.startsWith("settings.")) return true;
  if (trimmed.includes("_") && !trimmed.includes(" ")) return true;
  if (FORBIDDEN_LABELS.has(trimmed.toLowerCase())) return true;
  return false;
}

export function isOperativeSettingsHref(href: string): boolean {
  return OPERATIVE_SETTINGS_CATEGORIES.some((category) =>
    category.links.some((link) => link.href === href)
  );
}
