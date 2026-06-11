import { inferPersonType } from "./person-types";

export type RelationshipSignal = {
  detected: boolean;
  personName: string | null;
  relationship: string | null;
  personType: ReturnType<typeof inferPersonType>;
  topic: "birthday" | "anniversary" | "milestone" | "preference" | "gift" | "follow_up" | "general";
  favoriteActivity: string | null;
  askToRemember: boolean;
  thoughtfulPrompt: string | null;
};

const RELATIONSHIP_PATTERNS = [
  /\bmy (wife|husband|daughter|son|mother|father|parents|friend|colleague|client|mentor)\b/i,
  /\b(birthday|anniversary|wedding)\b/i,
  /\b(loves?|enjoys?|mentioned wanting)\b/i,
  /\b(starts school|milestone|promotion|health update)\b/i,
  /\b(weekend getaway|fishing|spa)\b/i,
  /\b(call|check in|congratulate|follow up with)\b/i,
] as const;

export function detectRelationshipSignal(message: string): RelationshipSignal {
  const trimmed = message.trim();
  const detected = RELATIONSHIP_PATTERNS.some((p) => p.test(trimmed));

  const relMatch = trimmed.match(
    /\b(wife|husband|daughter|son|mother|father|friend|colleague|client|mentor|parents?)\b/i
  );
  const nameMatch = trimmed.match(/\b([A-Z][a-z]+)\b/);

  let topic: RelationshipSignal["topic"] = "general";
  if (/birthday/i.test(trimmed)) topic = "birthday";
  else if (/anniversary|wedding/i.test(trimmed)) topic = "anniversary";
  else if (/starts school|milestone|promotion/i.test(trimmed)) topic = "milestone";
  else if (/loves?|enjoys?|fishing|spa|getaway/i.test(trimmed)) topic = "preference";
  else if (/gift|flowers/i.test(trimmed)) topic = "gift";
  else if (/call|check in|congratulate|follow up/i.test(trimmed)) topic = "follow_up";

  const activityMatch = trimmed.match(/\b(loves?|enjoys?)\s+(.+?)(?:\.|$)/i);

  let thoughtfulPrompt: string | null = null;
  if (topic === "birthday" || topic === "anniversary") {
    thoughtfulPrompt = "Would you like reminders before the date?";
  } else if (topic === "preference" || topic === "gift") {
    thoughtfulPrompt = "Would you like gift suggestions?";
  } else if (topic === "follow_up") {
    thoughtfulPrompt = "When should I remind you?";
  } else if (detected) {
    thoughtfulPrompt = "Would you like me to remember this?";
  }

  return {
    detected,
    personName: nameMatch?.[1] ?? relMatch?.[1] ?? null,
    relationship: relMatch?.[1]?.toLowerCase() ?? null,
    personType: inferPersonType(trimmed),
    topic,
    favoriteActivity: activityMatch?.[2]?.trim() ?? null,
    askToRemember: detected && !/remember this|don'?t let me forget/i.test(trimmed),
    thoughtfulPrompt,
  };
}
