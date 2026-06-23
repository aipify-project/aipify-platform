/**
 * Official Canva Connect API capability audit (POST-P1.02).
 * Source: https://www.canva.dev/docs/connect/ (Connect API, OAuth 2.0 + PKCE)
 *
 * Supported for governed artifact handoff in this adapter:
 * - POST /v1/asset-uploads — images to user content library (scope: asset:write)
 * - GET /v1/asset-uploads/{jobId} — poll upload job
 * - POST /v1/imports — PDF/document design import (scope: design:content:write)
 * - GET /v1/imports/{jobId} — poll import job
 *
 * NOT supported in this adapter (honest partial):
 * - Autofill / brand template population
 * - Silent desktop app control
 * - Direct edit of existing designs without import
 * - Batch operations beyond single active artifact
 */

export const CANVA_CONNECT_API_BASE = "https://api.canva.com/rest/v1" as const;

export const CANVA_OAUTH_AUTHORIZE_URL = "https://www.canva.com/api/oauth/authorize" as const;
export const CANVA_OAUTH_TOKEN_URL = "https://api.canva.com/rest/v1/oauth/token" as const;

export const CANVA_ARTIFACT_HANDOFF_PROVIDER_KEY = "canva" as const;

export const CANVA_HANDOFF_OAUTH_SCOPES = [
  "asset:read",
  "asset:write",
  "design:meta:read",
  "design:content:write",
] as const;

/** MIME types accepted by Canva asset upload (subset — see Canva Assets API). */
export const CANVA_ASSET_UPLOAD_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

/** MIME types accepted by Canva design import (subset). */
export const CANVA_DESIGN_IMPORT_MIMES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const CANVA_HANDOFF_READINESS = "partial" as const;

export const CANVA_HANDOFF_CAPABILITIES = [
  "artifact.handoff.asset_upload",
  "artifact.handoff.design_import",
] as const;

export type CanvaHandoffCapability = (typeof CANVA_HANDOFF_CAPABILITIES)[number];

export function resolveCanvaHandoffAction(mimeType: string): CanvaHandoffCapability | null {
  const mime = mimeType.trim().toLowerCase().split(";")[0] ?? "";
  if (CANVA_ASSET_UPLOAD_MIMES.has(mime)) return "artifact.handoff.asset_upload";
  if (CANVA_DESIGN_IMPORT_MIMES.has(mime)) return "artifact.handoff.design_import";
  return null;
}
