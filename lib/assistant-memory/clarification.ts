import type { PameMemoryType } from "./categories";

export type ClarificationContext = {
  category: PameMemoryType;
  hasDate: boolean;
  hasPerson: boolean;
  missingReminder: boolean;
};

export function buildClarificationQuestion(ctx: ClarificationContext): string {
  if (ctx.category === "important_people" && ctx.hasDate) {
    return "Would you like reminders before the date?";
  }
  if (ctx.category === "tasks" && !ctx.hasDate) {
    return "When should I remind you?";
  }
  if (ctx.category === "events" && ctx.hasDate && ctx.missingReminder) {
    return "How about two weeks before, one week before, and the day before?";
  }
  if (ctx.hasPerson && !ctx.hasDate) {
    return "When would you like me to remind you?";
  }
  return "Would you like me to remember this?";
}
