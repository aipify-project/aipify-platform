import type { SkillCategory } from "@/lib/core/skills/types";
import { SKILLOS_CATEGORIES, type SkillOSCategory } from "./types";

export function isSkillOSCategory(value: string): value is SkillOSCategory {
  return (SKILLOS_CATEGORIES as readonly string[]).includes(value);
}

/** Map Phase 16 registry categories to SkillOS marketplace categories. */
export function mapRegistryCategoryToSkillOS(
  category: SkillCategory
): SkillOSCategory {
  switch (category) {
    case "customer":
      return "Support";
    case "executive":
      return "Executive";
    case "companion":
      return "Companion";
    case "future":
      return "Custom";
    case "installation":
      return "Operational";
    default:
      return "Operational";
  }
}
