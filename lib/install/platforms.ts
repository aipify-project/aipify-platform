import type { DetectedSystem } from "./types";
import type { InstallPlatformOption } from "./experience";

export const PLATFORM_DETECTION_HINTS: Record<string, InstallPlatformOption> = {
  "myshopify.com": "shopify",
  shopify: "shopify",
  "wp-admin": "wordpress",
  wordpress: "wordpress",
  woocommerce: "woocommerce",
  "woocommerce.com": "woocommerce",
};

export function detectPlatformFromHints(
  hints: string[]
): { platform: InstallPlatformOption | null; confident: boolean } {
  const normalized = hints.map((h) => h.toLowerCase().trim()).filter(Boolean);
  if (normalized.length === 0) {
    return { platform: null, confident: false };
  }

  const matches = new Set<InstallPlatformOption>();
  for (const hint of normalized) {
    for (const [key, platform] of Object.entries(PLATFORM_DETECTION_HINTS)) {
      if (hint.includes(key)) {
        matches.add(platform);
      }
    }
  }

  if (matches.size === 1) {
    return { platform: [...matches][0], confident: true };
  }
  if (matches.size > 1) {
    return { platform: null, confident: false };
  }
  return { platform: null, confident: false };
}

export function mapPlatformToDetectedSystem(
  platform: InstallPlatformOption
): DetectedSystem {
  switch (platform) {
    case "shopify":
      return "shopify";
    case "wordpress":
      return "wordpress";
    case "woocommerce":
      return "woocommerce";
    case "custom_website":
    case "developer_setup":
    case "not_sure":
      return "other";
    default:
      return "other";
  }
}

export function mapPlatformToSystemType(
  platform: InstallPlatformOption
): "wordpress" | "shopify" | "custom" | "other" {
  switch (platform) {
    case "shopify":
      return "shopify";
    case "wordpress":
    case "woocommerce":
      return "wordpress";
    case "developer_setup":
      return "custom";
    default:
      return "other";
  }
}
