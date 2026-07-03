import { orchestrateCompanionSearch } from "@/lib/companion-runtime/orchestrator";
import { tryResolveCapabilityHelpPlatformSearch } from "./search-helpers";
import type { PlatformSearchOptions, PlatformSearchResult } from "./types";

export async function searchPlatformKnowledge(
  query: string,
  options: PlatformSearchOptions,
): Promise<PlatformSearchResult> {
  const capabilityResult = await tryResolveCapabilityHelpPlatformSearch(query, options);
  if (capabilityResult) return capabilityResult;
  return orchestrateCompanionSearch(query, options);
}

export { resolveArticleIdForQuery } from "./search-helpers";
