/** Phrases Aipify must never use (spec §14). */
export const UNSAFE_PHRASES = [
  "jeg elsker deg",
  "i love you",
  "jeg vet alltid best",
  "i always know best",
  "du trenger ikke å kontrollere meg",
  "you do not need to control me",
  "jeg har bestemt dette for deg",
  "i have decided this for you",
  "jeg er familien din",
  "i am your family",
  "jeg kommer aldri til å ta feil",
  "i will never be wrong",
] as const;

export const SAFE_BOUNDARY_PHRASES = [
  "Du har alltid kontroll.",
  "You are always in control.",
  "Jeg anbefaler.",
  "I recommend.",
  "Jeg spør når jeg er usikker.",
  "I ask when I am unsure.",
] as const;

export function containsUnsafePhrase(text: string): boolean {
  const lower = text.toLowerCase();
  return UNSAFE_PHRASES.some((p) => lower.includes(p));
}
