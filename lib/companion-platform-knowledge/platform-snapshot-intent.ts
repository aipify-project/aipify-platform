export type LivePlatformSnapshotQueryKind =
  | "active_modules"
  | "supported_languages"
  | "environment_status"
  | "platform_version"
  | "visibility_summary"
  | "full_snapshot";

export type LivePlatformSnapshotIntent = {
  providerKey: "unonight";
  requiresLive: boolean;
  blocksKnowledgeCenter: boolean;
  queryKind: LivePlatformSnapshotQueryKind;
};

export type LivePlatformSnapshotIntentOptions = {
  integrationContext?: "unonight" | null;
};

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?!.]+$/, "");
}

function mentionsUnonight(q: string): boolean {
  return /\bunonight\b/.test(q);
}

function hasIntegrationContext(options?: LivePlatformSnapshotIntentOptions): boolean {
  return options?.integrationContext === "unonight";
}

function requestsLivePlatformData(q: string): boolean {
  return /(live|direkte|direct|verifisert|verified|hent.*fra|fetch.*from|integrasjon|integration)/.test(q);
}

function detectPlatformQueryKind(q: string, contextual: boolean): LivePlatformSnapshotQueryKind | null {
  const contextualUnonight = mentionsUnonight(q) || contextual;

  if (
    contextualUnonight &&
    /(modul|module|active_modules|aktive moduler|funksjon|feature)/.test(q)
  ) {
    return "active_modules";
  }

  if (mentionsUnonight(q) && /(språk|language|locale|støtt)/.test(q) && !/(scope|tilgang|access|lov)/.test(q)) {
    return "supported_languages";
  }

  if (
    mentionsUnonight(q) &&
    /(produksjon|production|miljø|environment|tilgjengelig|available|drift)/.test(q)
  ) {
    return "environment_status";
  }

  if (mentionsUnonight(q) && /(plattformversjon|platform version|versjon|version)/.test(q)) {
    return "platform_version";
  }

  if (
    mentionsUnonight(q) &&
    /(hva kan aipify se|what can aipify see|hva kan.*se fra|what.*see from)/.test(q)
  ) {
    return "visibility_summary";
  }

  if (contextualUnonight && /(plattformmetadata|platform metadata|platform-snapshot|platform snapshot)/.test(q)) {
    return "full_snapshot";
  }

  if (mentionsUnonight(q) && requestsLivePlatformData(q) && /(plattform|platform|modul|module)/.test(q)) {
    return "full_snapshot";
  }

  return null;
}

/** Detect when Companion must use live Unonight platform snapshot instead of Knowledge Center. */
export function detectLivePlatformSnapshotIntent(
  query: string,
  options?: LivePlatformSnapshotIntentOptions,
): LivePlatformSnapshotIntent | null {
  const q = normalizeQuery(query);
  const queryKind = detectPlatformQueryKind(q, hasIntegrationContext(options));
  if (!queryKind) return null;

  return {
    providerKey: "unonight",
    requiresLive: true,
    blocksKnowledgeCenter: true,
    queryKind,
  };
}
