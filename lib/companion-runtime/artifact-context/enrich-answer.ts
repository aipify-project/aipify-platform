import type {
  CompanionArtifactContextPayload,
  CompanionConversationAttachment,
} from "./types";
import type { PlatformKnowledgeAnswer } from "@/lib/companion-platform-knowledge/types";

export type CompanionArtifactEnrichmentLabels = {
  resolvedActive: (filename: string) => string;
  unresolvedReference: string;
  noBinaryNote: string;
};

export function enrichAnswerWithArtifactContext(
  answer: PlatformKnowledgeAnswer,
  context: CompanionArtifactContextPayload,
  attachments: readonly CompanionConversationAttachment[],
  labels: CompanionArtifactEnrichmentLabels,
): PlatformKnowledgeAnswer {
  const reference = context.references[0];
  if (!reference?.attachment_id) {
    if (reference?.matched_phrase && reference.confidence === "low") {
      return {
        ...answer,
        explanation: [answer.explanation, labels.unresolvedReference].filter(Boolean).join("\n\n"),
        artifactContext: context,
      };
    }
    return { ...answer, artifactContext: context };
  }

  const matched =
    attachments.find((row) => row.attachment_id === reference.attachment_id) ??
    (context.active_artifact?.attachment_id === reference.attachment_id
      ? context.active_artifact
      : null);

  const filename =
    matched && "original_filename" in matched
      ? matched.original_filename
      : matched && "label" in matched
        ? matched.label
        : reference.attachment_id;

  return {
    ...answer,
    explanation: [
      answer.explanation,
      labels.resolvedActive(String(filename)),
      labels.noBinaryNote,
    ]
      .filter(Boolean)
      .join("\n\n"),
    artifactContext: context,
  };
}
