export const AIPIFY_ELDER_CARE_COMPANION_FUTURE_ROUTE = "/app/companion/elder-care";

export const AIPIFY_ELDER_CARE_COMPANION_FUTURE_STATUS = "planted" as const;

export const AIPIFY_ELDER_CARE_COMPANION_CORE_PRINCIPLE =
  "Help people remain independent for as long as possible — strengthen support systems, never replace family or caregivers.";

export const AIPIFY_ELDER_CARE_COMPANION_POSITIONING =
  "Companion Module for aging individuals and those who care about them — dignity-first, not medical care.";

export const AIPIFY_ELDER_CARE_COMPANION_PREREQUISITES = [
  "companion_core",
  "life_events",
  "memory_foundations",
  "presence",
  "family_companion",
  "action_framework",
] as const;

export const AIPIFY_ELDER_CARE_COMPANION_MEDICAL_BOUNDARY =
  "Never diagnose, make medical decisions, or replace healthcare professionals. Medication reminders are scheduling only.";

export const AIPIFY_ELDER_CARE_COMPANION_EMERGENCY_BOUNDARY =
  "Coordinate preparedness only — emergency response remains human-led.";
