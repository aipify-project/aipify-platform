export type LiveIntegrationStatusIntent = {
  providerKey: "unonight";
  requiresLive: boolean;
  blocksKnowledgeCenter: boolean;
};

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?!.]+$/, "");
}

/** Detect when Companion must use live verified integration data instead of Knowledge Center. */
export function detectLiveIntegrationStatusIntent(query: string): LiveIntegrationStatusIntent | null {
  const q = normalizeQuery(query);

  const mentionsUnonight = /\bunonight\b/.test(q);
  const mentionsIntegration =
    /(integrasjon|integration|tilkobling|connection|connector)/.test(q);
  const mentionsLive =
    /(live|nå|now|hent|fetch|bruk den aktive|use the active|akti(v|ve)|current)/.test(q);
  const mentionsStatusFields =
    /(status|scope|scopes|tillatel|permission|api.?versjon|api version|read.?only|skrivebeskytt|språk|locale|sist.*brukt|last.?used|verifis|verified|organisasjon|organization)/.test(
      q,
    );
  const excludesKnowledgeCenter =
    /(ikke bruk knowledge center|not use knowledge center|without knowledge center|ingen knowledge center|no knowledge center|ikke bruk generell|not general information)/.test(
      q,
    );

  if (excludesKnowledgeCenter && (mentionsUnonight || mentionsIntegration)) {
    return {
      providerKey: "unonight",
      requiresLive: true,
      blocksKnowledgeCenter: true,
    };
  }

  if (mentionsUnonight && (mentionsLive || mentionsStatusFields)) {
    return {
      providerKey: "unonight",
      requiresLive: mentionsLive || mentionsStatusFields,
      blocksKnowledgeCenter: true,
    };
  }

  if (
    mentionsIntegration &&
    mentionsLive &&
    (mentionsStatusFields || /unonight/.test(q))
  ) {
    return {
      providerKey: "unonight",
      requiresLive: true,
      blocksKnowledgeCenter: true,
    };
  }

  if (
    /(connected integration|tilkoblet integrasjon|tilkoblingsinformasjon|connection metadata|integration metadata)/.test(
      q,
    ) &&
    (mentionsUnonight || mentionsLive)
  ) {
    return {
      providerKey: "unonight",
      requiresLive: true,
      blocksKnowledgeCenter: true,
    };
  }

  return null;
}
