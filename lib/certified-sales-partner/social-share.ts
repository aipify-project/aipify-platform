/**
 * CSP social share helpers — pure, client-safe.
 *
 * Aipify never publishes on a partner's behalf. For platforms that offer a public "share" web
 * intent (Facebook, X, LinkedIn) we can open it prefilled; for the rest (Instagram, TikTok,
 * Snapchat) there is no supported web prefill, so the partner copies the text and downloads the
 * image, then posts inside the app themselves.
 */

export const CSP_SOCIAL_PLATFORMS = ["instagram", "facebook", "x", "linkedin", "tiktok", "snapchat"] as const;
export type CspSocialPlatform = (typeof CSP_SOCIAL_PLATFORMS)[number];

/** Channels a partner may use that are not social platforms (still valid self-service Core channels). */
export const CSP_OTHER_SELF_SERVICE_CHANNELS = ["referral_link", "email", "qr", "partner_code", "other"] as const;

export function isCspSocialPlatform(value: unknown): value is CspSocialPlatform {
  return typeof value === "string" && (CSP_SOCIAL_PLATFORMS as readonly string[]).includes(value);
}

/** True when a public web share intent exists for the platform. */
export function cspSocialPlatformSupportsWebShare(platform: CspSocialPlatform): boolean {
  return platform === "facebook" || platform === "x" || platform === "linkedin";
}

/**
 * Builds the platform's public share intent URL, or `null` when unsupported or when `url` is not
 * an absolute http(s) URL. The returned URL is always https on a fixed, allow-listed host.
 */
export function buildCspSocialShareUrl(
  platform: CspSocialPlatform,
  input: { url: string; text?: string },
): string | null {
  let target: URL;
  try {
    target = new URL(input.url);
  } catch {
    return null;
  }
  if (target.protocol !== "https:" && target.protocol !== "http:") return null;
  const u = encodeURIComponent(target.toString());
  const text = encodeURIComponent((input.text ?? "").slice(0, 280));
  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case "x":
      return `https://x.com/intent/post?text=${text}&url=${u}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    default:
      return null;
  }
}

/** Text + link as one clipboard payload. */
export function composeCspShareText(text: string, url: string): string {
  const body = text.trim();
  return body ? `${body}\n${url}` : url;
}
