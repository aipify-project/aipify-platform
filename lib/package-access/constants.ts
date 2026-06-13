export const PACKAGE_TIERS = ["starter", "professional", "business", "enterprise"] as const;

export const GOLD_NUGGET_FEATURES = [
  "taxi_ordering",
  "flower_ordering",
  "food_ordering",
  "travel_booking",
  "procurement_coordination",
  "enterprise_action_orchestration",
  "advanced_companion_actions",
] as const;

export const PACKAGE_ACCESS_ROUTE = "/app/settings/billing/packages";

export const UPGRADE_COMPLETE_MESSAGE = "Upgrade complete. Business features are now active.";

export const PACKAGE_UPGRADE_MESSAGES: Record<string, { en: string; no: string }> = {
  taxi_ordering: {
    en: "Taxi ordering is available in Business. Upgrade now to unlock advanced companion actions.",
    no: "Taxi-bestilling er tilgjengelig i Business. Oppgrader for å låse opp avanserte companion-handlinger.",
  },
  flower_ordering: {
    en: "Order flowers through Aipify. Available in Business.",
    no: "Bestill blomster via Aipify. Tilgjengelig i Business.",
  },
  food_ordering: {
    en: "Food ordering is available in Business. Upgrade to unlock companion actions.",
    no: "Matbestilling er tilgjengelig i Business. Oppgrader for companion-handlinger.",
  },
  travel_booking: {
    en: "Travel booking is available in Enterprise. Upgrade for full orchestration.",
    no: "Reisebooking er tilgjengelig i Enterprise. Oppgrader for full orkestrering.",
  },
};

export const PACKAGE_TIER_LABELS: Record<(typeof PACKAGE_TIERS)[number], string> = {
  starter: "Starter",
  professional: "Professional",
  business: "Business",
  enterprise: "Enterprise",
};
