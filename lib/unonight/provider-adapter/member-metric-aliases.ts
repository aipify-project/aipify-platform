/** Unonight member metric alias groups for Core binding resolution — provider-specific only. */
export const UNONIGHT_MEMBER_METRIC_ALIASES: Readonly<Record<string, readonly string[]>> = {
  new_members: [
    "new_members",
    "members_since_last",
    "members_today",
    "members_last_7_days",
    "members_last_30_days",
  ],
  members_today: ["members_today", "new_members"],
  members_last_7_days: ["members_last_7_days", "new_members"],
  members_last_30_days: ["members_last_30_days", "new_members"],
};
