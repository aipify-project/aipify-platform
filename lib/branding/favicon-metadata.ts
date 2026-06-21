import type { Metadata } from "next";

/** Companion Purple — matches AIPIFY_BRAND.pulse.colors.mono */
export const AIPIFY_FAVICON_COLOR = "#7C3AED";

/**
 * Global favicon and app icon metadata for all Aipify surfaces.
 * Raster assets are generated from assets/brand/aipify-symbol.svg via scripts/generate-favicon-assets.mjs
 */
export const AIPIFY_GLOBAL_ICONS: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
  ],
  shortcut: "/favicon.ico",
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: AIPIFY_FAVICON_COLOR }],
};
