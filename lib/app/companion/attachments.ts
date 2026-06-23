import type { CompanionArtifactProvenanceSource } from "@/lib/companion-runtime/artifact-context/types";

export type CompanionPendingAttachment = {
  localId: string;
  attachmentId?: string;
  filename: string;
  mimeType: string;
  byteSize: number;
  category: "image" | "pdf" | "document" | "text" | "other";
  status: "uploading" | "ready" | "error";
  errorMessage?: string;
  previewUrl?: string;
  provenance: CompanionArtifactProvenanceSource;
};

export type CompanionAttachmentApiRecord = {
  attachment_id: string;
  conversation_id: string;
  original_filename: string;
  mime_type: string;
  category: CompanionPendingAttachment["category"];
  byte_size: number;
  security_status: "pending" | "approved" | "rejected";
  provenance_source: CompanionArtifactProvenanceSource;
  created_at: string;
  preview_available: boolean;
  preview_url?: string;
};

export function formatAttachmentByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function createLocalAttachmentId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function uploadCompanionAttachment(input: {
  file: File;
  conversationId: string;
  provenance: CompanionArtifactProvenanceSource;
}): Promise<CompanionAttachmentApiRecord> {
  const form = new FormData();
  form.append("file", input.file);
  form.append("conversation_id", input.conversationId);
  form.append("provenance_source", input.provenance);

  const res = await fetch("/api/aipify/companion/attachments", {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as { ok?: boolean; attachment?: CompanionAttachmentApiRecord; error?: string; message_key?: string };
  if (!res.ok || !data.ok || !data.attachment) {
    throw new Error(data.error ?? data.message_key ?? "upload_failed");
  }
  return data.attachment;
}

export async function deleteCompanionAttachment(attachmentId: string): Promise<void> {
  const res = await fetch(`/api/aipify/companion/attachments/${attachmentId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("delete_failed");
}

export async function setCompanionActiveArtifact(
  conversationId: string,
  attachmentId: string,
): Promise<void> {
  const res = await fetch("/api/aipify/companion/attachments/active", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_id: conversationId,
      attachment_id: attachmentId,
    }),
  });
  if (!res.ok) throw new Error("active_artifact_failed");
}

export async function fetchCompanionAttachmentPreviewUrl(
  attachmentId: string,
): Promise<string | null> {
  const res = await fetch(`/api/aipify/companion/attachments/${attachmentId}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { ok?: boolean; preview_url?: string };
  return data.ok && data.preview_url ? data.preview_url : null;
}
