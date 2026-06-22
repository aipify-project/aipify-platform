import { orchestrateCompanionSearch } from "@/lib/companion-runtime/orchestrator";
import type { PlatformSearchOptions, PlatformSearchResult } from "./types";

export async function searchPlatformKnowledge(
  query: string,
  options: PlatformSearchOptions,
): Promise<PlatformSearchResult> {
  return orchestrateCompanionSearch(query, options);
}

export { resolveArticleIdForQuery } from "./search-helpers";
