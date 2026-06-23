/**
 * Official Microsoft Graph capability audit (POST-P1.09).
 * Source: https://learn.microsoft.com/en-us/graph/api/resources/onedrive
 *
 * Supported in this adapter (delegated, least-privilege scopes):
 * - GET /me — connected account discovery
 * - GET /me/drive — OneDrive root availability
 * - POST /me/drive/root/children — create Word/Excel/PowerPoint file in OneDrive
 * - PUT /me/drive/root:/{path}:/content — upload / save / export / artifact handoff
 * - GET /me/drive/items/{id} — open existing file (webUrl)
 *
 * NOT supported (honest partial — never simulated):
 * - Local desktop Word/Excel/PowerPoint control
 * - Silent background editing without user opening returned link
 * - SharePoint site libraries beyond the signed-in user's drive
 * - Outlook mail/calendar from this adapter
 */

export const MICROSOFT365_OAUTH_PROVIDER_KEY = "microsoft365" as const;

export const MICROSOFT365_APPLICATION_KEYS = [
  "microsoft_word",
  "microsoft_excel",
  "microsoft_powerpoint",
] as const;

export type Microsoft365ApplicationKey = (typeof MICROSOFT365_APPLICATION_KEYS)[number];

export const MICROSOFT365_GRAPH_BASE = "https://graph.microsoft.com/v1.0" as const;
export const MICROSOFT365_OAUTH_AUTHORIZE_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize" as const;
export const MICROSOFT365_OAUTH_TOKEN_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/token" as const;

/** Minimum delegated scopes for OneDrive file create/open/save/handoff. */
export const MICROSOFT365_OAUTH_SCOPES = ["User.Read", "Files.ReadWrite", "offline_access"] as const;

export const MICROSOFT365_HANDOFF_READINESS = "partial" as const;

export const MICROSOFT365_HANDOFF_CAPABILITIES = [
  "artifact.handoff.onedrive_upload",
  "document.create",
  "spreadsheet.create",
  "presentation.create",
  "document.open",
  "spreadsheet.open",
  "presentation.open",
  "save.onedrive",
  "export.onedrive",
] as const;

export type Microsoft365HandoffCapability = (typeof MICROSOFT365_HANDOFF_CAPABILITIES)[number];

const WORD_MIMES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/pdf",
  "text/plain",
  "application/rtf",
]);

const EXCEL_MIMES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
]);

const POWERPOINT_MIMES = new Set([
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/pdf",
]);

const DEFAULT_EXTENSIONS: Record<Microsoft365ApplicationKey, string> = {
  microsoft_word: "docx",
  microsoft_excel: "xlsx",
  microsoft_powerpoint: "pptx",
};

const DEFAULT_MIMES: Record<Microsoft365ApplicationKey, string> = {
  microsoft_word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  microsoft_excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  microsoft_powerpoint: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export function isMicrosoft365ApplicationKey(value: string): value is Microsoft365ApplicationKey {
  return (MICROSOFT365_APPLICATION_KEYS as readonly string[]).includes(value.trim().toLowerCase());
}

export function resolveMicrosoft365HandoffAction(
  applicationKey: Microsoft365ApplicationKey,
  mimeType: string,
): Microsoft365HandoffCapability | null {
  const mime = mimeType.trim().toLowerCase().split(";")[0] ?? "";
  if (applicationKey === "microsoft_word" && WORD_MIMES.has(mime)) {
    return "artifact.handoff.onedrive_upload";
  }
  if (applicationKey === "microsoft_excel" && EXCEL_MIMES.has(mime)) {
    return "artifact.handoff.onedrive_upload";
  }
  if (applicationKey === "microsoft_powerpoint" && POWERPOINT_MIMES.has(mime)) {
    return "artifact.handoff.onedrive_upload";
  }
  return null;
}

export function defaultMicrosoft365CreateFilename(applicationKey: Microsoft365ApplicationKey): string {
  const stamp = new Date().toISOString().slice(0, 10);
  const ext = DEFAULT_EXTENSIONS[applicationKey];
  const prefix =
    applicationKey === "microsoft_word"
      ? "Document"
      : applicationKey === "microsoft_excel"
        ? "Workbook"
        : "Presentation";
  return `${prefix}-${stamp}.${ext}`;
}

export function defaultMicrosoft365CreateMime(applicationKey: Microsoft365ApplicationKey): string {
  return DEFAULT_MIMES[applicationKey];
}

export function resolveMicrosoft365CreateCapability(
  applicationKey: Microsoft365ApplicationKey,
): Microsoft365HandoffCapability {
  if (applicationKey === "microsoft_excel") return "spreadsheet.create";
  if (applicationKey === "microsoft_powerpoint") return "presentation.create";
  return "document.create";
}

export function resolveMicrosoft365OpenCapability(
  applicationKey: Microsoft365ApplicationKey,
): Microsoft365HandoffCapability {
  if (applicationKey === "microsoft_excel") return "spreadsheet.open";
  if (applicationKey === "microsoft_powerpoint") return "presentation.open";
  return "document.open";
}

export function microsoft365ApplicationSupportsOperation(
  applicationKey: Microsoft365ApplicationKey,
  operation: string,
): boolean {
  switch (operation) {
    case "create":
      return true;
    case "open":
    case "edit":
      return true;
    case "save":
    case "export":
    case "handoff":
      return true;
    default:
      return false;
  }
}
