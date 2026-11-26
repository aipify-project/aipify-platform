export const ACCOUNT_PROFILE_TABS = ["personal", "company", "relationship", "security"] as const;

export type AccountProfileTab = (typeof ACCOUNT_PROFILE_TABS)[number];

export function parseAccountProfileTab(value: string | null | undefined): AccountProfileTab {
  return ACCOUNT_PROFILE_TABS.includes(value as AccountProfileTab)
    ? (value as AccountProfileTab)
    : "personal";
}
