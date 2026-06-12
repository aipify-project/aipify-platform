export const ORGANIZATIONAL_MEMORY_MISSION =
  "Help organizations remember important events, decisions and learning experiences so future actions become wiser and more effective.";

export const ORGANIZATIONAL_MEMORY_KNOWLEDGE_VS_MEMORY =
  "Knowledge explains how things should work. Memory captures how things actually unfolded.";

export const ORGANIZATIONAL_MEMORY_ABOS_PRINCIPLE =
  "Knowledge tells us what we know. Memory reminds us who we have become.";

export const ORGANIZATIONAL_MEMORY_CAPABILITY_EXAMPLES = [
  "A similar issue occurred six months ago. Here is how it was resolved.",
  "This decision aligns with a previously successful strategy.",
  "Several lessons emerged from a comparable situation.",
  "You have faced challenges like this before — and you found a way through.",
] as const;

export function getOrganizationalMemoryEngineVocabulary() {
  return {
    mission: ORGANIZATIONAL_MEMORY_MISSION,
    knowledgeVsMemory: ORGANIZATIONAL_MEMORY_KNOWLEDGE_VS_MEMORY,
    abosPrinciple: ORGANIZATIONAL_MEMORY_ABOS_PRINCIPLE,
    capabilityExamples: ORGANIZATIONAL_MEMORY_CAPABILITY_EXAMPLES,
  };
}
