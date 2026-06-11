export const REMINDER_OFFSETS = [
  "same_day",
  "1_day_before",
  "7_days_before",
  "14_days_before",
  "custom",
] as const;

export type ReminderOffset = (typeof REMINDER_OFFSETS)[number];

export const REMINDER_STRATEGIES = [
  "single",
  "repeated",
  "escalating",
  "annual",
] as const;

export type ReminderStrategy = (typeof REMINDER_STRATEGIES)[number];

export function defaultEventReminders(): ReminderOffset[] {
  return ["14_days_before", "7_days_before", "1_day_before"];
}

export function offsetsToScheduledDates(
  eventDate: string,
  offsets: string[]
): Array<{ offset: string; scheduled_for: string }> {
  const base = new Date(eventDate);
  if (Number.isNaN(base.getTime())) return [];

  return offsets.map((offset) => {
    const d = new Date(base);
    if (offset === "14_days_before") d.setDate(d.getDate() - 14);
    else if (offset === "7_days_before") d.setDate(d.getDate() - 7);
    else if (offset === "1_day_before") d.setDate(d.getDate() - 1);
    else if (offset === "same_day") {
      /* keep */
    }
    return { offset, scheduled_for: d.toISOString() };
  });
}
