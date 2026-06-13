export const AIPIFY_PET_COMPANION_FUTURE_ROUTE = "/app/companion/pets";

export const AIPIFY_PET_COMPANION_FUTURE_STATUS = "planted" as const;

export const AIPIFY_PET_COMPANION_CORE_PRINCIPLE =
  "Pets are family members — help people care for them more consistently and with less stress.";

export const AIPIFY_PET_COMPANION_POSITIONING =
  "Companion Module for pet ownership routines, milestones, and preventative care coordination — not veterinary care.";

export const AIPIFY_PET_COMPANION_PREREQUISITES = [
  "companion_core",
  "memory_foundations",
  "life_events",
  "presence",
  "family_companion",
  "action_framework",
] as const;

export const AIPIFY_PET_COMPANION_VETERINARY_BOUNDARY =
  "Never diagnose illnesses, recommend medical treatments, or replace veterinarians.";

export const AIPIFY_PET_COMPANION_EMERGENCY_BOUNDARY =
  "Coordinate preparedness only — emergency decisions remain human-led.";
