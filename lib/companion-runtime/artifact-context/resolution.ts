import type {
  CompanionActiveArtifact,
  CompanionArtifactReference,
  CompanionArtifactReferenceKind,
  CompanionConversationAttachment,
} from "./types";

const REFERENCE_PATTERNS: Array<{ kind: CompanionArtifactReferenceKind; pattern: RegExp }> = [
  { kind: "this_logo", pattern: /\b(denne|dette|this|the)\s+(logo(en|et)?|logo)\b/i },
  { kind: "this_image", pattern: /\b(denne|dette|this|the)\s+(bildet?|image|picture|photo)\b/i },
  { kind: "this_file", pattern: /\b(denne|dette|this|the)\s+(filen?|file|document|documentet)\b/i },
  { kind: "this_image", pattern: /\b(bildet|the image|that image|this image)\b/i },
  { kind: "this_file", pattern: /\b(filen|the file|that file|this file)\b/i },
  { kind: "this_logo", pattern: /\b(logoen|the logo|that logo|this logo)\b/i },
  { kind: "latest_upload", pattern: /\b(siste|opplastede|last uploaded|latest upload|recent file)\b/i },
];

export function detectArtifactReferenceIntent(query: string): CompanionArtifactReferenceKind | null {
  const trimmed = query.trim();
  if (!trimmed) return null;
  for (const entry of REFERENCE_PATTERNS) {
    if (entry.pattern.test(trimmed)) return entry.kind;
  }
  return null;
}

export function resolveActiveArtifactReference(input: {
  query: string;
  activeArtifact: CompanionActiveArtifact | null;
  attachments: readonly CompanionConversationAttachment[];
  explicitAttachmentId?: string | null;
}): CompanionArtifactReference {
  if (input.explicitAttachmentId) {
    const match = input.attachments.find((row) => row.attachment_id === input.explicitAttachmentId);
    return {
      kind: "explicit_id",
      attachment_id: match?.attachment_id ?? input.explicitAttachmentId,
      confidence: match ? "high" : "low",
      matched_phrase: null,
    };
  }

  const intent = detectArtifactReferenceIntent(input.query);

  if (intent === "latest_upload" && input.attachments.length > 0) {
    const latest = [...input.attachments].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0]!;
    return {
      kind: "latest_upload",
      attachment_id: latest.attachment_id,
      confidence: "high",
      matched_phrase: intent,
    };
  }

  if (intent && input.activeArtifact) {
    return {
      kind: intent,
      attachment_id: input.activeArtifact.attachment_id,
      confidence: "high",
      matched_phrase: intent,
    };
  }

  if (intent && input.attachments.length === 1) {
    return {
      kind: intent,
      attachment_id: input.attachments[0]!.attachment_id,
      confidence: "moderate",
      matched_phrase: intent,
    };
  }

  if (input.activeArtifact) {
    return {
      kind: "this_file",
      attachment_id: input.activeArtifact.attachment_id,
      confidence: "moderate",
      matched_phrase: null,
    };
  }

  return {
    kind: "this_file",
    attachment_id: null,
    confidence: "low",
    matched_phrase: intent,
  };
}

export function selectDefaultActiveArtifact(
  attachments: readonly CompanionConversationAttachment[],
  previousActiveId?: string | null,
): CompanionActiveArtifact | null {
  if (attachments.length === 0) return null;

  if (previousActiveId) {
    const previous = attachments.find((row) => row.attachment_id === previousActiveId);
    if (previous) {
      return toActiveArtifact(previous);
    }
  }

  const latest = [...attachments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0]!;
  return toActiveArtifact(latest);
}

export function toActiveArtifact(row: CompanionConversationAttachment): CompanionActiveArtifact {
  return {
    attachment_id: row.attachment_id,
    conversation_id: row.conversation_id,
    label: row.original_filename,
    category: row.category,
    mime_type: row.mime_type,
    byte_size: row.byte_size,
    selected_at: new Date().toISOString(),
  };
}
