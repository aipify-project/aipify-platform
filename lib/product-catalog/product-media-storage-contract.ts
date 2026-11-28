/**
 * Product Center media storage — API contract (not Production-activated).
 *
 * SQL candidate: docs/platform/sql-candidates/csp_product_media_storage_executable_v1.sql
 * Bucket: csp-product-media (private)
 * Path registration after upload: csp_set_product_media_paths (RPC foundation)
 *
 * Feature owner: PLATFORM ADMIN (Product Center) + shared Core storage
 */

export const PRODUCT_MEDIA_STORAGE_BUCKET = "csp-product-media" as const;

export const PRODUCT_MEDIA_MAX_BYTES = 2 * 1024 * 1024;

/** Safe raster only — SVG excluded (scriptable). */
export const PRODUCT_MEDIA_ALLOWED_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export type ProductMediaMime = (typeof PRODUCT_MEDIA_ALLOWED_MIME)[number];

export type ProductMediaKind = "logo" | "hero";

export const PRODUCT_MEDIA_PATH_PATTERN =
  /^products\/[a-z0-9_-]{1,64}\/(logo|hero)\/[a-z0-9-]{8,64}\.(png|jpg|jpeg|webp)$/;

export function buildProductMediaObjectPath(input: {
  productKey: string;
  kind: ProductMediaKind;
  objectId: string;
  mime: ProductMediaMime;
}): string {
  const ext =
    input.mime === "image/png"
      ? "png"
      : input.mime === "image/webp"
        ? "webp"
        : input.mime === "image/jpeg"
          ? "jpg"
          : null;
  if (!ext) {
    throw new Error("unsupported_mime");
  }
  const key = input.productKey.trim().toLowerCase();
  const id = input.objectId.trim().toLowerCase();
  const path = `products/${key}/${input.kind}/${id}.${ext}`;
  if (!PRODUCT_MEDIA_PATH_PATTERN.test(path)) {
    throw new Error("invalid_product_media_path");
  }
  return path;
}

export function isProductMediaPath(path: string): boolean {
  return PRODUCT_MEDIA_PATH_PATTERN.test(path.trim());
}

/**
 * Planned Platform upload API (separate activation YES — not live here).
 *
 * 1) POST /api/platform-portal/products/[productKey]/media/upload-intent
 *    - auth: platform admin session
 *    - body: { kind, mime, byteSize }
 *    - validates MIME/size; returns { bucket, path, uploadToken/signedUpload }
 * 2) Client uploads bytes to Storage using signed upload (or server streams)
 * 3) Server magic-byte sniff; reject mismatch
 * 4) POST …/media/commit → csp_set_product_media_paths({ product_key, logo_path|hero_path })
 * 5) Prior object keys are left in place (no auto-delete); path pointer moves
 *
 * Consumer signed download (APP/SALE):
 * - Server checks channel listing + registered path, then issues short-lived signed URL
 * - Never return service-role keys; never expose draft/unregistered objects
 */
export const PRODUCT_MEDIA_UPLOAD_API_CONTRACT = {
  bucket: PRODUCT_MEDIA_STORAGE_BUCKET,
  maxBytes: PRODUCT_MEDIA_MAX_BYTES,
  allowedMime: PRODUCT_MEDIA_ALLOWED_MIME,
  pathPattern: String(PRODUCT_MEDIA_PATH_PATTERN),
  registerRpc: "csp_set_product_media_paths",
  autoDeleteOldObjects: false,
  productionUploadActivated: false,
  requiresSeparateStagingYes: true,
  requiresSeparateProductionYes: true,
} as const;

/** SQL-only vs API-owned controls */
export const PRODUCT_MEDIA_CONTROL_OWNERSHIP = {
  sql: [
    "private bucket create/update",
    "MIME allowlist + 2MiB limit on bucket",
    "admin-only insert/update RLS",
    "no client delete policy",
    "channel-gated select for registered paths",
    "path shape validation helper",
  ],
  uploadApiRequired: [
    "signed upload URL issuance",
    "magic-byte / content sniffing",
    "byte-size enforcement before storage accept",
    "commit → csp_set_product_media_paths",
    "consumer signed download after channel auth",
    "actor audit beyond storage.owner",
  ],
} as const;
