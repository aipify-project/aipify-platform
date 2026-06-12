import { ABOS_FULL_NAME } from "./abos-vocabulary";

/** Rewrite legacy or generic product-category copy to official ABOS terminology. */
export const ABOS_TERMINOLOGY_REWRITES: Array<[RegExp, string]> = [
  [/\bAI Business Operating System\b/gi, ABOS_FULL_NAME],
  [/\bAn AI chatbot for your business\b/gi, ABOS_FULL_NAME],
  [/\bAI chatbot platform\b/gi, ABOS_FULL_NAME],
  [/\bAI assistant platform\b/gi, ABOS_FULL_NAME],
  [/\bAI automation tool\b/gi, ABOS_FULL_NAME],
  [/\bBusiness chatbot\b/gi, ABOS_FULL_NAME],
  [/\bAI helpdesk solution\b/gi, ABOS_FULL_NAME],
];

export function adaptReplyToAbosTerminology(text: string): string {
  let result = text;
  for (const [pattern, replacement] of ABOS_TERMINOLOGY_REWRITES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
