import type { MetadataRoute } from "next";

const REQUIRED_ICON_SIZES = ["192x192", "512x512"] as const;

export function auditManifest(manifest: MetadataRoute.Manifest): string[] {
  const issues: string[] = [];

  if (manifest.name !== "Aipify") issues.push("name must be Aipify");
  if (manifest.short_name !== "Aipify") issues.push("short_name must be Aipify");
  if (manifest.display !== "standalone") issues.push("display must be standalone");
  if (manifest.theme_color !== "#7C3AED") issues.push("theme_color must be #7C3AED");
  if (manifest.background_color !== "#F7F6F3") issues.push("background_color must be #F7F6F3");

  const startUrl = manifest.start_url ?? "";
  if (!startUrl.startsWith("/login") && startUrl !== "/") {
    issues.push("start_url should be /login for unauthenticated entry");
  }
  if (startUrl.includes("localhost") || startUrl.includes("127.0.0.1")) {
    issues.push("start_url must not contain dev URLs");
  }

  const icons = manifest.icons ?? [];
  for (const size of REQUIRED_ICON_SIZES) {
    if (!icons.some((icon) => icon.sizes === size)) {
      issues.push(`missing icon size ${size}`);
    }
  }

  for (const icon of icons) {
    const src = icon.src ?? "";
    if (src.includes("localhost") || src.includes("127.0.0.1")) {
      issues.push("icon src must not contain dev URLs");
    }
  }

  return issues;
}

export function isFetchNetworkError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("failed to fetch") ||
    normalized.includes("networkerror") ||
    normalized.includes("network request failed") ||
    normalized.includes("load failed")
  );
}
