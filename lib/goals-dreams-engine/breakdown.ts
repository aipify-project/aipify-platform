import type { GoalCategory } from "./dimensions";

export function suggestActionsForGoal(title: string, category: GoalCategory): string[] {
  if (category === "health") {
    return ["Define what success looks like", "Schedule regular activity", "Track weekly progress"];
  }
  if (category === "financial") {
    return ["Set a clear target", "Review spending habits", "Automate savings"];
  }
  if (category === "education") {
    return ["Choose learning resources", "Schedule practice time", "Set weekly targets"];
  }
  if (category === "career") {
    return ["Clarify the vision", "Identify first milestone", "Block focused work time"];
  }
  if (category === "family") {
    return ["Plan first activity", "Set a recurring time", "Reflect on what works"];
  }
  if (/read|book/i.test(title)) {
    return ["Choose a book", "Schedule reading time", "Set weekly reading targets", "Track progress"];
  }
  return ["Break into first small step", "Schedule time this week", "Review progress in two weeks"];
}
