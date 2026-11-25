/**
 * Mapping between local Academy question ids (`kw_q01`…`kw_q25`, append-only) and Core question
 * positions (`csp_academy_questions.position`, 1-based). Core accepts `p_answers` keyed by position.
 * Pure and client-safe — contains no answers.
 */
const LOCAL_ID_RE = /^kw_q(\d{2,3})$/;

export function localQuestionIdToCorePosition(id: string): number | null {
  const m = LOCAL_ID_RE.exec(id);
  if (!m) return null;
  const position = Number.parseInt(m[1], 10);
  return position > 0 ? position : null;
}

export function corePositionToLocalQuestionId(position: number): string | null {
  if (!Number.isInteger(position) || position < 1 || position > 999) return null;
  return `kw_q${String(position).padStart(2, "0")}`;
}

/** Re-keys local answers (question id → option id) by Core position. Unmapped ids are dropped. */
export function toCoreAnswersByPosition(answers: ReadonlyMap<string, string> | Record<string, string>): Record<string, string> {
  const entries = answers instanceof Map ? Array.from(answers) : Object.entries(answers);
  const out: Record<string, string> = {};
  for (const [id, option] of entries) {
    const position = localQuestionIdToCorePosition(id);
    if (position !== null) out[String(position)] = option;
  }
  return out;
}
