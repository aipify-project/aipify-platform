import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlatformKnowledgeConfidence, PlatformKnowledgeSource, UnansweredQuestionRecord } from "./types";

/**
 * Lightweight unanswered-question tracking for Companion platform knowledge review.
 * Uses in-memory buffer for tests; optionally forwards to KC retrieve (creates aipify_knowledge_gaps).
 */
const unansweredBuffer: UnansweredQuestionRecord[] = [];
const MAX_BUFFER = 200;

export function getUnansweredQuestionBuffer(): readonly UnansweredQuestionRecord[] {
  return unansweredBuffer;
}

export function resetUnansweredQuestionBufferForTests(): void {
  unansweredBuffer.length = 0;
}

export function recordUnansweredQuestion(input: {
  query: string;
  locale: string;
  source: PlatformKnowledgeSource;
  confidence: PlatformKnowledgeConfidence;
}): UnansweredQuestionRecord {
  const record: UnansweredQuestionRecord = {
    query: input.query,
    locale: input.locale,
    source: input.source,
    confidence: input.confidence,
    recordedAt: new Date().toISOString(),
  };

  unansweredBuffer.unshift(record);
  if (unansweredBuffer.length > MAX_BUFFER) unansweredBuffer.pop();

  return record;
}

/** Fire-and-forget gap logging via retrieve_knowledge_answer when confidence is low. */
export async function trackLowConfidenceQuery(
  supabase: SupabaseClient,
  query: string,
  locale: string,
  confidence: PlatformKnowledgeConfidence,
): Promise<void> {
  if (confidence !== "low") return;

  recordUnansweredQuestion({
    query,
    locale,
    source: "fallback",
    confidence,
  });

  try {
    await supabase.rpc("retrieve_knowledge_answer", {
      p_query: query,
      p_language: locale,
      p_visibility_context: "authenticated",
      p_source_type: "admin_chat",
    });
  } catch {
    // Gap logging is best-effort
  }
}
