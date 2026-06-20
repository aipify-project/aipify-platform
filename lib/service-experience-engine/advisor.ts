const COMMUNICATIONS_PATTERNS = [
  /\b(customer message|communication|reminder|reply|delivery failed)\b/i,
  /\b(kommunikasjon|påminnelse|svar|levering)\b/i,
];

const REBOOKING_PATTERNS = [/\b(rebook|rebooking|book again|book another)\b/i, /\b(rebooking|bestill på nytt)\b/i];

const FEEDBACK_PATTERNS = [/\b(feedback|review|service recovery|concern)\b/i, /\b(tilbakemelding|anmeldelse)\b/i];

export function detectServiceExperienceAdvisorIntent(message: string): "communications" | "rebooking" | "feedback" | "quality" | null {
  const text = message.trim();
  if (!text) return null;
  if (REBOOKING_PATTERNS.some((p) => p.test(text))) return "rebooking";
  if (FEEDBACK_PATTERNS.some((p) => p.test(text))) return "feedback";
  if (/\b(quality|service quality|delivery rate)\b/i.test(text)) return "quality";
  if (COMMUNICATIONS_PATTERNS.some((p) => p.test(text))) return "communications";
  return null;
}

export function getServiceExperienceAdvisorRoute(intent: ReturnType<typeof detectServiceExperienceAdvisorIntent>): string {
  switch (intent) {
    case "rebooking":
      return "/app/services/rebooking";
    case "feedback":
      return "/app/services/feedback";
    case "quality":
      return "/app/services/quality";
    default:
      return "/app/services/communications";
  }
}
