/** Aipify Hosts product roadmap — corpus paths and terminology. */
export const AIPIFY_HOSTS_ROADMAP = {
  foundation: "aipify-hosts/FOUNDATION_01_PROPERTY_LICENSING.text",
  phases: {
    airbnb01: "aipify-hosts/PHASE_AIRBNB_01_HOSPITALITY_FOUNDATION.text",
    airbnb02: "aipify-hosts/PHASE_AIRBNB_02_BOOKING_INTELLIGENCE.text",
    airbnb03: "aipify-hosts/PHASE_AIRBNB_03_OPERATIONS_ENGINE.text",
    airbnb04: "aipify-hosts/PHASE_AIRBNB_04_GUEST_INTELLIGENCE.text",
    airbnb05: "aipify-hosts/PHASE_AIRBNB_05_TRUST_AND_COMPLIANCE.text",
    airbnb06: "aipify-hosts/PHASE_AIRBNB_06_EXPANSION_INTELLIGENCE.text",
    airbnb07: "aipify-hosts/PHASE_AIRBNB_07_OWNER_COMPANION.text",
    airbnb08: "aipify-hosts/PHASE_AIRBNB_08_OWNER_PORTAL.text",
  },
  index: "aipify-hosts/INDEX.text",
} as const;

export const AIPIFY_HOSTS_POSITIONING =
  "Aipify Hosts is the Business Operating System for modern hospitality businesses.";

export const AIPIFY_HOSTS_BOOKING_POSITIONING = "One operational center. Every booking channel.";

export const AIPIFY_HOSTS_TERMINOLOGY = {
  guestExperienceCompanion: "Guest Experience Companion",
  ownerCompanion: "Aipify Companion",
  aipifyRecommendations: "Aipify Recommendations",
  aipifyInsights: "Aipify Insights",
  propertyHealthScore: "Property Health Score",
  smartGapFiller: "Smart Gap Filler",
} as const;

export const AIPIFY_HOSTS_FORBIDDEN = [
  "AI assistant",
  "AI-powered",
  "AI recommendations",
  "replaces Airbnb",
  "booking platform replacement",
  "AI chatbot",
] as const;

export const AIPIFY_HOSTS_ROUTES = {
  foundation: "/app/aipify-hosts",
  bookingIntelligence: "/app/aipify-hosts/channel-booking-intelligence",
  operations: "/app/aipify-hosts/operations",
  guestIntelligence: "/app/aipify-hosts/guest-intelligence",
  trustCompliance: "/app/aipify-hosts/trust-compliance",
  expansionIntelligence: "/app/aipify-hosts/expansion-intelligence",
  companion: "/app/aipify-hosts/companion",
  ownerPortal: "/app/aipify-hosts/owner-portal",
} as const;
