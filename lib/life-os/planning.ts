import type { LifeMemoryItem } from "./types";
import { sortByPriority } from "./priorities";

/** Lightweight week-planning recommendations from PAME memories. */
export function buildWeekPlanRecommendations(items: LifeMemoryItem[]): string[] {
  const sorted = sortByPriority(items);
  const tips: string[] = [];

  const critical = sorted.filter((i) => i.priority === "critical");
  const upcoming = sorted.filter(
    (i) => i.memory_date && new Date(i.memory_date) <= daysFromNow(7)
  );

  if (critical.length > 0) {
    tips.push(
      `Start the week with ${critical.length} critical item${critical.length === 1 ? "" : "s"}: ${critical
        .slice(0, 3)
        .map((c) => c.title)
        .join(", ")}.`
    );
  }

  if (upcoming.length >= 4) {
    tips.push(
      "Several commitments cluster this week — consider blocking focus time on lighter days."
    );
  }

  const family = sorted.filter((i) => i.life_area === "family");
  if (family.length > 0) {
    tips.push("Reserve time for family reminders before the weekend.");
  }

  if (tips.length === 0) {
    tips.push("Your week looks manageable. Would you like to add anything to remember?");
  }

  return tips;
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
