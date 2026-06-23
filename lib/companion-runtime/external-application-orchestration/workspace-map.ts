import type { CompanionArtifactCategory } from "../artifact-context/types";
import type { ExternalApplicationWorkspace } from "./types";

const SPREADSHEET_MIMES = new Set([
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
]);

const PRESENTATION_MIMES = new Set([
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const DOCUMENT_MIMES = new Set([
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "application/rtf",
  "text/plain",
  "text/markdown",
]);

const AUDIO_VIDEO_MIMES = new Set([
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

export function resolveWorkspaceFromArtifact(input: {
  category: CompanionArtifactCategory;
  mime_type: string;
}): ExternalApplicationWorkspace {
  const mime = input.mime_type.trim().toLowerCase().split(";")[0] ?? "";

  if (input.category === "pdf" || mime === "application/pdf") return "pdf";
  if (input.category === "image" || mime.startsWith("image/")) return "graphic_design";
  if (SPREADSHEET_MIMES.has(mime)) return "spreadsheet";
  if (PRESENTATION_MIMES.has(mime)) return "presentation";
  if (DOCUMENT_MIMES.has(mime) || input.category === "document" || input.category === "text") {
    return "document";
  }
  if (AUDIO_VIDEO_MIMES.has(mime) || mime.startsWith("audio/") || mime.startsWith("video/")) {
    return "audio_video";
  }

  return "general";
}

export function applicationSupportsWorkspace(
  workspaces: readonly ExternalApplicationWorkspace[],
  workspace: ExternalApplicationWorkspace,
): boolean {
  return workspaces.includes(workspace) || workspaces.includes("general");
}
