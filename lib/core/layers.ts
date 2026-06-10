export type AipifyLayer = "platform" | "app" | "embed";

export const LAYER_ROUTE_PREFIX: Record<AipifyLayer, string> = {
  platform: "/platform",
  app: "/app",
  embed: "/api/embed",
};

export const LAYER_LIB_PATH: Record<AipifyLayer, string> = {
  platform: "lib/platform",
  app: "lib/app",
  embed: "lib/embed",
};

export function layerForPathname(pathname: string): AipifyLayer | null {
  if (pathname.startsWith("/platform")) return "platform";
  if (pathname.startsWith("/app") || pathname.startsWith("/dashboard")) return "app";
  if (pathname.startsWith("/api/embed") || pathname.startsWith("/api/install")) {
    return "embed";
  }
  return null;
}

export function assertLayer(pathname: string, expected: AipifyLayer): boolean {
  return layerForPathname(pathname) === expected;
}
