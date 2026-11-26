/**
 * Partners portal profile photo — client-side resize + re-encode.
 *
 * Typical phone photos are several MB, far above the server cap (`PARTNERS_AVATAR_MAX_BYTES`).
 * Before rejecting, the browser re-draws the image on a canvas and encodes WebP (or JPEG when WebP
 * encoding is unavailable) under the cap. Re-encoding also strips EXIF/GPS metadata, and the
 * orientation is baked in so the photo is not rotated.
 *
 * The server keeps its own MIME / magic-byte / size checks — this module only prepares the upload.
 */
import { PARTNERS_AVATAR_MAX_BYTES } from "./avatar";

/** Largest original we are willing to decode in the browser (memory safety). */
export const PARTNERS_AVATAR_MAX_SOURCE_BYTES = 25 * 1024 * 1024;
/** Encode under the server cap with a small margin for multipart overhead differences. */
export const PARTNERS_AVATAR_TARGET_BYTES = PARTNERS_AVATAR_MAX_BYTES - 16 * 1024;

export const PARTNERS_AVATAR_EDGE_STEPS = [1024, 768, 512, 384, 256] as const;
export const PARTNERS_AVATAR_QUALITY_STEPS = [0.86, 0.76, 0.66, 0.55] as const;

export type AvatarOutputMime = "image/webp" | "image/jpeg";

/** Scales down to fit `maxEdge` on the longest side; never upscales; always at least 1px. */
export function fitWithin(width: number, height: number, maxEdge: number): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (!(longest > 0)) return { width: 1, height: 1 };
  const scale = Math.min(1, maxEdge / longest);
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export type AvatarAttempt = { width: number; height: number; quality: number };

/** Ordered attempts: biggest dimension + best quality first, degrading until something fits. */
export function planAvatarAttempts(width: number, height: number): AvatarAttempt[] {
  const attempts: AvatarAttempt[] = [];
  const seen = new Set<string>();
  for (const edge of PARTNERS_AVATAR_EDGE_STEPS) {
    const size = fitWithin(width, height, edge);
    const key = `${size.width}x${size.height}`;
    if (seen.has(key)) continue;
    seen.add(key);
    for (const quality of PARTNERS_AVATAR_QUALITY_STEPS) attempts.push({ ...size, quality });
  }
  return attempts;
}

export type AvatarRenderResult = { blob: Blob; type: string } | null;

/**
 * Walks the attempt plan until a render fits `targetBytes`. `render` must return the encoded blob
 * and its real MIME type (browsers fall back to PNG when WebP encoding is unsupported).
 */
export async function runAvatarEncodingPlan(input: {
  width: number;
  height: number;
  targetBytes?: number;
  render: (attempt: AvatarAttempt, mime: AvatarOutputMime) => Promise<AvatarRenderResult>;
}): Promise<{ blob: Blob; mime: AvatarOutputMime } | null> {
  const target = input.targetBytes ?? PARTNERS_AVATAR_TARGET_BYTES;
  const attempts = planAvatarAttempts(input.width, input.height);
  if (attempts.length === 0) return null;

  // Decide the output format once: WebP when the browser really encodes it, otherwise JPEG.
  let mime: AvatarOutputMime = "image/webp";
  const probe = await input.render(attempts[0], mime);
  if (!probe || probe.type !== "image/webp") mime = "image/jpeg";

  for (const attempt of attempts) {
    const out = attempt === attempts[0] && mime === "image/webp" && probe ? probe : await input.render(attempt, mime);
    if (!out || out.type !== mime) continue;
    if (out.blob.size > 0 && out.blob.size <= target) return { blob: out.blob, mime };
  }
  return null;
}

export type AvatarCompressResult =
  | { ok: true; file: File; originalBytes: number }
  | { ok: false; reason: "decode" | "too_large" };

type DecodedImage = {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  release: () => void;
};

async function decodeImage(file: File): Promise<DecodedImage | null> {
  if (typeof createImageBitmap === "function") {
    try {
      // `from-image` applies the EXIF orientation so the re-encoded photo is upright.
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
        release: () => bitmap.close(),
      };
    } catch {
      // fall through to <img>
    }
  }
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h),
        release: () => URL.revokeObjectURL(url),
      });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => resolve(blob), mime, quality);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Browser-only. Always re-encodes (strips EXIF) — even photos already under the cap. Returns a
 * `File` of type WebP/JPEG under `PARTNERS_AVATAR_MAX_BYTES`, or a typed failure.
 */
export async function compressPartnersAvatar(file: File): Promise<AvatarCompressResult> {
  if (file.size > PARTNERS_AVATAR_MAX_SOURCE_BYTES) return { ok: false, reason: "too_large" };
  const decoded = await decodeImage(file);
  if (!decoded || decoded.width < 1 || decoded.height < 1) return { ok: false, reason: "decode" };

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return { ok: false, reason: "decode" };

    const encoded = await runAvatarEncodingPlan({
      width: decoded.width,
      height: decoded.height,
      render: async (attempt, mime) => {
        canvas.width = attempt.width;
        canvas.height = attempt.height;
        ctx.clearRect(0, 0, attempt.width, attempt.height);
        if (mime === "image/jpeg") {
          // JPEG has no alpha — flatten transparent PNGs onto white instead of black.
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, attempt.width, attempt.height);
        }
        decoded.draw(ctx, attempt.width, attempt.height);
        const blob = await canvasToBlob(canvas, mime, attempt.quality);
        return blob ? { blob, type: blob.type } : null;
      },
    });
    if (!encoded) return { ok: false, reason: "too_large" };

    const extension = encoded.mime === "image/webp" ? "webp" : "jpg";
    return {
      ok: true,
      originalBytes: file.size,
      file: new File([encoded.blob], `avatar.${extension}`, { type: encoded.mime }),
    };
  } finally {
    decoded.release();
  }
}
