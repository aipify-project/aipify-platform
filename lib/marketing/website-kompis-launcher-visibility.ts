export type WebsiteKompisLauncherEmbedMetadata = {
  enabled?: boolean;
  available?: boolean;
};

/** Generic embed rule — hide launcher when metadata marks Website Kompis unavailable. */
export function shouldHideWebsiteKompisLauncherFromEmbedMetadata(
  metadata: WebsiteKompisLauncherEmbedMetadata | null | undefined,
): boolean {
  if (!metadata) {
    return false;
  }

  if (metadata.available === false) {
    return true;
  }

  return metadata.enabled === false;
}
