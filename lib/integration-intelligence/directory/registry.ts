import { DIRECTORY_PROVIDER_MANIFESTS } from "./manifests";
import type { DirectoryProviderManifest } from "./types";

export function listDirectoryProviderManifests(): readonly DirectoryProviderManifest[] {
  return DIRECTORY_PROVIDER_MANIFESTS;
}

export function getDirectoryProviderManifest(providerKey: string): DirectoryProviderManifest | undefined {
  return DIRECTORY_PROVIDER_MANIFESTS.find((manifest) => manifest.provider_key === providerKey);
}
