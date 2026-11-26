/**
 * Partner marketing banner formats — UI contract only.
 * Never invents hosted banner assets. HTML is built only when a published
 * https (or same-origin) image URL and personal /p/{code}/{product} link exist.
 */

export const CSP_BANNER_FORMATS = [
  { id: "leaderboard", width: 728, height: 90, labelKey: "format728x90" },
  { id: "medium_rectangle", width: 300, height: 250, labelKey: "format300x250" },
  { id: "skyscraper", width: 160, height: 600, labelKey: "format160x600" },
  { id: "square", width: 1080, height: 1080, labelKey: "format1080x1080" },
] as const;

export type CspBannerFormatId = (typeof CSP_BANNER_FORMATS)[number]["id"];

export type CspBannerHtmlInput = {
  imageUrl: string;
  linkUrl: string;
  width: number;
  height: number;
  alt: string;
};

function isSafeHttpsOrRelativeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2048) return false;
  if (trimmed.startsWith("/")) {
    return !trimmed.startsWith("//") && !trimmed.includes("<") && !trimmed.includes('"');
  }
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Builds a minimal anchor+img banner snippet. Returns null when URLs are unsafe
 * or dimensions are invalid — never invents assets.
 */
export function buildCspBannerHtml(input: CspBannerHtmlInput): string | null {
  if (!Number.isFinite(input.width) || !Number.isFinite(input.height)) return null;
  if (input.width <= 0 || input.height <= 0 || input.width > 4000 || input.height > 4000) return null;
  if (!isSafeHttpsOrRelativeUrl(input.imageUrl) || !isSafeHttpsOrRelativeUrl(input.linkUrl)) return null;
  const alt = escapeHtmlAttr(input.alt.trim().slice(0, 120) || "Aipify");
  const href = escapeHtmlAttr(input.linkUrl.trim());
  const src = escapeHtmlAttr(input.imageUrl.trim());
  return `<a href="${href}" target="_blank" rel="noopener noreferrer"><img src="${src}" width="${Math.floor(input.width)}" height="${Math.floor(input.height)}" alt="${alt}" style="display:block;border:0;" /></a>`;
}

/** Match Core materials that look like a given banner format (by filename hints). */
export function matchBannerMaterial(
  materials: ReadonlyArray<{ assetPath?: string; href?: string; category?: string }>,
  format: (typeof CSP_BANNER_FORMATS)[number],
): { href: string } | null {
  const needle = `${format.width}x${format.height}`;
  for (const item of materials) {
    const path = String(item.assetPath ?? item.href ?? "");
    if (!path) continue;
    if (path.toLowerCase().includes(needle) || path.toLowerCase().includes(format.id.replace("_", "-"))) {
      return { href: path };
    }
  }
  return null;
}
