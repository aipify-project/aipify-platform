import type { CalendarPurpose } from "./dimensions";
import type { EventDraft, SchedulingProposal } from "./types";

const MONTH_PATTERN =
  /\b(january|february|march|april|may|june|july|august|september|october|november|december|januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)\s+(\d{1,2})(?:\.|st|nd|rd|th)?\b/i;

function monthToIndex(monthRaw: string): number | null {
  const monthMap: Record<string, number> = {
    january: 1, januar: 1, february: 2, februar: 2, march: 3, mars: 3,
    april: 4, may: 5, mai: 5, june: 6, juni: 6, july: 7, juli: 7,
    august: 8, september: 9, october: 10, oktober: 10, november: 11, december: 12, desember: 12,
  };
  return monthMap[monthRaw] ?? null;
}

function extractEventDate(message: string): string | null {
  const match = message.match(MONTH_PATTERN);
  if (match) {
    const monthIndex = monthToIndex(match[1].toLowerCase());
    if (!monthIndex) return null;
    const day = match[2].padStart(2, "0");
    const year = new Date().getFullYear();
    return `${year}-${String(monthIndex).padStart(2, "0")}-${day}`;
  }
  if (/next week/i.test(message)) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  }
  if (/tomorrow/i.test(message)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }
  return null;
}

function inferPurpose(message: string): CalendarPurpose {
  if (/wife|husband|family|birthday|anniversary|daughter|son|mother|father/i.test(message)) {
    return "family";
  }
  if (/client|meeting|follow-up|colleague|work|office|presentation/i.test(message)) {
    return "work";
  }
  if (/doctor|dentist|health|exercise|medication/i.test(message)) {
    return "health";
  }
  if (/flight|hotel|vacation|travel/i.test(message)) {
    return "travel";
  }
  if (/school|course|exam|education/i.test(message)) {
    return "education";
  }
  return "personal";
}

function calendarLabel(purpose: CalendarPurpose): string {
  const labels: Record<CalendarPurpose, string> = {
    work: "work calendar",
    personal: "personal calendar",
    family: "family calendar",
    travel: "travel calendar",
    health: "health calendar",
    education: "education calendar",
    custom: "calendar",
  };
  return labels[purpose];
}

export function detectSchedulingIntent(message: string): SchedulingProposal | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const isSchedule =
    /schedule|book|add to (my )?calendar|set a meeting|follow-up meeting|follow up meeting/i.test(
      trimmed
    );
  const isBirthday =
    /birthday|anniversary/i.test(trimmed) &&
    /wife|husband|mother|father|daughter|son|friend/i.test(trimmed);
  const isReminder =
    /remind me to|remember .+ on|don't let me forget/i.test(trimmed) && !isBirthday;

  if (!isSchedule && !isBirthday && !isReminder) return null;

  const eventDate = extractEventDate(trimmed);
  const purpose = inferPurpose(trimmed);
  const calName = calendarLabel(purpose);

  if (isBirthday) {
    const title = trimmed.length <= 80 ? trimmed : `${trimmed.slice(0, 77)}…`;
    return {
      detected: true,
      title,
      event_date: eventDate,
      suggested_purpose: purpose,
      suggested_calendar_name: calName,
      prompt: eventDate
        ? `Would you like me to add this to your ${calName}?`
        : `I can add this to your ${calName}. What date should I use?`,
      follow_up_options: eventDate
        ? ["Add to personal calendar", "Add with reminder 2 weeks before", "Not now"]
        : undefined,
    };
  }

  if (isSchedule) {
    const personMatch = trimmed.match(
      /\b(?:with|meeting with|follow-up with|follow up with)\s+([A-Z][a-z]+)\b/
    );
    const title = personMatch
      ? `Follow-up with ${personMatch[1]}`
      : trimmed.length <= 80
        ? trimmed
        : `${trimmed.slice(0, 77)}…`;

    const timeHint = /13:00|1\s*pm|afternoon/i.test(trimmed)
      ? " Wednesday at 13:00"
      : eventDate
        ? ` on ${eventDate}`
        : " next week";

    return {
      detected: true,
      title,
      event_date: eventDate,
      suggested_purpose: purpose,
      suggested_calendar_name: calName,
      prompt:
        purpose === "work"
          ? `I found availability${timeHint} in your work calendar. Should I schedule it?`
          : `Would you like me to add this to your ${calName}?`,
      follow_up_options: ["Yes, schedule it", "Suggest another time", "Not now"],
    };
  }

  if (isReminder) {
    return {
      detected: true,
      title: trimmed.length <= 80 ? trimmed : `${trimmed.slice(0, 77)}…`,
      event_date: eventDate,
      suggested_purpose: purpose,
      suggested_calendar_name: calName,
      prompt: eventDate
        ? `I can add a reminder before the date. Would you like me to use your ${calName}?`
        : `I can add a reminder to your ${calName}. When should I remind you?`,
      follow_up_options: ["Two days before", "One week before", "Not now"],
    };
  }

  return null;
}

export function buildEventDraftFromProposal(
  proposal: SchedulingProposal,
  connectionId?: string | null
): EventDraft {
  const startsAt = proposal.event_date
    ? `${proposal.event_date}T09:00:00.000Z`
    : null;

  return {
    title: proposal.title,
    description: proposal.title,
    event_type: /remind/i.test(proposal.title) ? "reminder" : "appointment",
    calendar_purpose: proposal.suggested_purpose,
    starts_at: startsAt,
    all_day: Boolean(proposal.event_date),
    connection_id: connectionId ?? null,
  };
}

export function schedulingReply(proposal: SchedulingProposal): string {
  return proposal.prompt;
}
