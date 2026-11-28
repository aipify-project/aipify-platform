/**
 * Magic-byte validation for Product Center media.
 * Never trust client-declared MIME alone.
 */

import {
  PRODUCT_MEDIA_ALLOWED_MIME,
  PRODUCT_MEDIA_MAX_BYTES,
  type ProductMediaMime,
} from "./product-media-storage-contract";

export type ProductMediaBytesValidation =
  | { ok: true; mime: ProductMediaMime; byteSize: number }
  | { ok: false; code: "empty" | "too_large" | "unsupported_type" | "svg_rejected" };

export function isProductMediaMime(value: string): value is ProductMediaMime {
  return (PRODUCT_MEDIA_ALLOWED_MIME as readonly string[]).includes(value);
}

/** Detect raster type from magic bytes — SVG/XML rejected. */
export function detectProductMediaMime(bytes: Uint8Array): ProductMediaMime | null {
  if (bytes.length >= 5) {
    const head = String.fromCharCode(...bytes.slice(0, Math.min(64, bytes.length))).toLowerCase();
    if (head.includes("<svg") || head.includes("<?xml")) return null;
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export function validateProductMediaBytes(
  bytes: Uint8Array,
  declaredMime: string,
): ProductMediaBytesValidation {
  if (bytes.length === 0) return { ok: false, code: "empty" };
  if (bytes.length > PRODUCT_MEDIA_MAX_BYTES) return { ok: false, code: "too_large" };
  if (declaredMime === "image/svg+xml" || declaredMime.includes("svg")) {
    return { ok: false, code: "svg_rejected" };
  }
  const detected = detectProductMediaMime(bytes);
  if (!detected) return { ok: false, code: "unsupported_type" };
  if (!isProductMediaMime(declaredMime) || detected !== declaredMime) {
    return { ok: false, code: "unsupported_type" };
  }
  return { ok: true, mime: detected, byteSize: bytes.length };
}
