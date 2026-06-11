import type { RetrieveKnowledgeAnswerInput } from "./types";
import { parseKnowledgeAnswer } from "./parse";

export async function retrieveKnowledgeAnswer(
  fetcher: (rpc: string, params: Record<string, unknown>) => Promise<unknown>,
  input: RetrieveKnowledgeAnswerInput
) {
  const data = await fetcher("retrieve_knowledge_answer", {
    p_query: input.query,
    p_language: input.language ?? "en",
    p_visibility_context: input.visibilityContext ?? "authenticated",
    p_source_type: input.sourceType ?? "admin_chat",
  });
  return parseKnowledgeAnswer(data);
}
