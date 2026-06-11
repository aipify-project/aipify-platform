export const PERSON_TYPES = [
  "partner",
  "child",
  "parent",
  "friend",
  "colleague",
  "client",
  "mentor",
  "other",
] as const;

export type PersonType = (typeof PERSON_TYPES)[number];

export function isPersonType(value: string): value is PersonType {
  return (PERSON_TYPES as readonly string[]).includes(value);
}

export function inferPersonType(message: string): PersonType {
  if (/\b(wife|husband|partner|spouse)\b/i.test(message)) return "partner";
  if (/\b(daughter|son|child|children)\b/i.test(message)) return "child";
  if (/\b(mother|father|parent|parents)\b/i.test(message)) return "parent";
  if (/\b(client|customer)\b/i.test(message)) return "client";
  if (/\b(colleague|coworker|boss)\b/i.test(message)) return "colleague";
  if (/\b(mentor|coach)\b/i.test(message)) return "mentor";
  if (/\b(friend|best friend)\b/i.test(message)) return "friend";
  return "other";
}
