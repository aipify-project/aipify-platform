/** Max single attachment size — 10 MiB */
export const COMPANION_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

/** Max attachments per composer send */
export const COMPANION_ATTACHMENT_MAX_COUNT = 5;

/** Default retention window for conversation attachments (days) */
export const COMPANION_ATTACHMENT_RETENTION_DAYS = 90;

export const COMPANION_ATTACHMENT_STORAGE_BUCKET = "companion-attachments" as const;

export const COMPANION_ATTACHMENT_ALLOWED_MIME_PREFIXES = [
  "image/",
  "application/pdf",
  "text/",
  "application/msword",
  "application/vnd.openxmlformats-officedocument",
  "application/vnd.oasis.opendocument",
  "application/rtf",
] as const;

export const COMPANION_ATTACHMENT_BLOCKED_MIME_PREFIXES = [
  "application/x-msdownload",
  "application/x-executable",
  "application/vnd.microsoft.portable-executable",
  "application/zip",
  "application/x-rar-compressed",
  "application/octet-stream",
] as const;
