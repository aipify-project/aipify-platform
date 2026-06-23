import {
  COMPANION_ATTACHMENT_ALLOWED_MIME_PREFIXES,
  COMPANION_ATTACHMENT_BLOCKED_MIME_PREFIXES,
  COMPANION_ATTACHMENT_MAX_BYTES,
  COMPANION_ATTACHMENT_MAX_COUNT,
} from "./constants";
import type {
  CompanionArtifactCategory,
  CompanionAttachmentValidationResult,
} from "./types";

function normalizeMime(mime: string): string {
  return mime.trim().toLowerCase().split(";")[0] ?? "";
}

export function classifyAttachmentCategory(mimeType: string): CompanionArtifactCategory {
  const mime = normalizeMime(mimeType);
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("text/")) return "text";
  if (
    mime.includes("word") ||
    mime.includes("document") ||
    mime.includes("opendocument") ||
    mime === "application/rtf"
  ) {
    return "document";
  }
  return "other";
}

export function isAllowedAttachmentMime(mimeType: string): boolean {
  const mime = normalizeMime(mimeType);
  if (!mime) return false;
  if (COMPANION_ATTACHMENT_BLOCKED_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix))) {
    return false;
  }
  return COMPANION_ATTACHMENT_ALLOWED_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix));
}

export function validateCompanionAttachmentFile(input: {
  filename: string;
  mime_type: string;
  byte_size: number;
}): CompanionAttachmentValidationResult {
  const mime = normalizeMime(input.mime_type);

  if (!input.filename.trim()) {
    return { ok: false, code: "filename_missing", message_key: "attachments.errors.filenameMissing" };
  }

  if (input.byte_size <= 0) {
    return { ok: false, code: "empty_file", message_key: "attachments.errors.emptyFile" };
  }

  if (input.byte_size > COMPANION_ATTACHMENT_MAX_BYTES) {
    return { ok: false, code: "file_too_large", message_key: "attachments.errors.fileTooLarge" };
  }

  if (!isAllowedAttachmentMime(mime)) {
    return { ok: false, code: "type_not_allowed", message_key: "attachments.errors.typeNotAllowed" };
  }

  return {
    ok: true,
    category: classifyAttachmentCategory(mime),
    mime_type: mime,
  };
}

export function validateAttachmentBatchCount(currentCount: number, incomingCount: number): boolean {
  return currentCount + incomingCount <= COMPANION_ATTACHMENT_MAX_COUNT;
}

export function sanitizeAttachmentFilename(filename: string): string {
  const base = filename.split(/[/\\]/).pop()?.trim() ?? "attachment";
  return base.replace(/[^\w.\-() ]+/g, "_").slice(0, 180) || "attachment";
}

export function isPreviewSafeCategory(category: CompanionArtifactCategory): boolean {
  return category === "image" || category === "text" || category === "pdf";
}
