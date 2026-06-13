export const AIPIFY_COMMUNITY_COMPANION_FUTURE_ROUTE = "/app/companion/community";

export const AIPIFY_COMMUNITY_COMPANION_FUTURE_STATUS = "planted" as const;

export const AIPIFY_COMMUNITY_COMPANION_CORE_PRINCIPLE =
  "Communities thrive when people feel welcomed, valued, and connected — help communities become healthier and more engaging.";

export const AIPIFY_COMMUNITY_COMPANION_POSITIONING =
  "Companion Module for community engagement, health, and moderator support — human moderation remains authoritative.";

export const AIPIFY_COMMUNITY_COMPANION_PREREQUISITES = [
  "companion_core",
  "aipify_verify",
  "community_safety",
  "memory_foundations",
  "presence",
  "governance",
] as const;

export const AIPIFY_COMMUNITY_COMPANION_MODERATION_BOUNDARY =
  "Never make sensitive moderation decisions independently — human moderators retain final authority.";

export const AIPIFY_COMMUNITY_COMPANION_ENGAGEMENT_BOUNDARY =
  "Never manipulate member behavior or encourage unhealthy engagement — member value over platform addiction.";

export const AIPIFY_COMMUNITY_HEALTH_LEVELS = [
  "vulnerable",
  "stable",
  "healthy",
  "thriving",
] as const;
