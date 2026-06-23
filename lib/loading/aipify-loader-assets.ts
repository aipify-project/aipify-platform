/** Public paths for the reusable Aipify loading animation (Phase Loading Asset). */
export const AIPIFY_LOADER_ASSETS = {
  lottie: "/loaders/aipify-loader.json",
  webm: "/loaders/aipify-loader.webm",
  gif: "/loaders/aipify-loader.gif",
} as const;

export const AIPIFY_LOADER_DEFAULT_LABEL = "Aipify is preparing your content";

export type AipifyLoaderAnimationMode = "lottie" | "webm" | "gif" | "static";

export const AIPIFY_LOADER_ANIMATION_SIZE = {
  sm: 48,
  md: 64,
  lg: 80,
} as const;
