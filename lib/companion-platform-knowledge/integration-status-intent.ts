import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { isCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { isPlatformOperationalQuery } from "./platform-snapshot-intent";

export type LiveIntegrationQueryKind =
  | "status"
  | "last_used"
  | "scopes"
  | "languages"
  | "source_trust"
  | "unsupported_data"
  | "private_data"
  | "role_disambiguation";

export type LiveIntegrationStatusIntent = {
  providerKey: string;
  requiresLive: boolean;
  blocksKnowledgeCenter: boolean;
  queryKind: LiveIntegrationQueryKind;
};

export type LiveIntegrationIntentOptions = {
  integrationContext?: string | null;
  snapshotContext?: { activeModules?: readonly string[] };
  locale?: CustomerActiveLocale;
};

function resolveProviderKey(options?: LiveIntegrationIntentOptions): string {
  return options?.integrationContext ?? "unonight";
}

function resolveLocale(options?: LiveIntegrationIntentOptions): CustomerActiveLocale {
  if (options?.locale && isCustomerActiveLocale(options.locale)) return options.locale;
  return "no";
}

function normalizeQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[?!.]+$/, "");
}

function mentionsUnonight(q: string): boolean {
  return /\bunonight\b/.test(q);
}

function hasIntegrationContext(options?: LiveIntegrationIntentOptions): boolean {
  return Boolean(options?.integrationContext);
}

function asksModuleActivation(q: string): boolean {
  return /(aktiv|active|aktivert|enabled|slatt pa|turned on|rapporter|report|reported)/.test(q);
}

function isComprehensiveStatusQuery(q: string): boolean {
  const signals = [
    /organisasjon|organization/.test(q),
    /api.?versjon|api version/.test(q),
    /scope|tillatel|permission/.test(q),
    /sprak|locale|language/.test(q),
    /tilgang|access|tilkoblingsinformasjon|connection metadata|live tilkoblingsinformasjon/.test(q),
  ].filter(Boolean).length;

  return signals >= 2;
}

function isIntegrationLanguageQuery(q: string): boolean {
  return (
    /(sprak|language|locale|stott|support)/.test(q) &&
    /(integrasjon|integration|tilkobling|connection)/.test(q)
  );
}

function detectQueryKind(q: string, contextual: boolean): LiveIntegrationQueryKind | null {
  const contextualUnonight = mentionsUnonight(q) || contextual;

  const asksToShowPrivateContent = /(vis|show|hent|get|siste|last|recent|latest|read|les|open|apne)/.test(q);
  const mentionsPrivateMessages =
    /(private melding|private message|private chat|dm|innboks|inbox|samtale|conversation)/.test(q) &&
    !asksModuleActivation(q);

  if (contextualUnonight && asksToShowPrivateContent && mentionsPrivateMessages) {
    return "private_data";
  }

  if (
    mentionsUnonight(q) &&
    /(rolle|role|teammedlem|team member|medlem)/.test(q) &&
    /(endre|change|oppdat|update|tildele|assign)/.test(q)
  ) {
    return "role_disambiguation";
  }

  if (
    mentionsUnonight(q) &&
    /(medlem|medlemmer|member|members|bruker|users|subscriber|abonnent|antall|how many|count|tall)/.test(q) &&
    !/(scope|integrasjon|tilkobling|status|språk|language|locale|tilgang|access|rolle|role|endre|change)/.test(q)
  ) {
    return "unsupported_data";
  }

  if (contextualUnonight && isComprehensiveStatusQuery(q)) {
    return "status";
  }

  if (
    contextualUnonight &&
    (/(sist brukt|last used)/.test(q) ||
      (/(når|when)/.test(q) && /(sist|last)/.test(q) && /(brukt|used)/.test(q)) ||
      (contextual && /\b(den|denne|integrasjonen|it)\b/.test(q) && /(brukt|used|sist|last|når|when)/.test(q)))
  ) {
    return "last_used";
  }

  if (isIntegrationLanguageQuery(q)) {
    return "languages";
  }

  if (
    mentionsUnonight(q) &&
    /(oppdatert|updated|fresh|vite|know|trust|verifis|verified|siste kontroll|last check|datakilde|source|how do you know|hvordan vet)/.test(
      q,
    )
  ) {
    return "source_trust";
  }

  if (
    mentionsUnonight(q) &&
    /(lov til|allowed|permission|scope|tillatel|lese fra|read from|hva har .* lov|what.*allowed| ikke lov|not allowed|cannot|can't|ikke.*(gjore|do|endre|write|skrive))/.test(
      q,
    )
  ) {
    return "scopes";
  }

  if (
    contextualUnonight &&
    /(koblet|connected|tilkoblet|skrivebeskytt|read.?only|verifis|integrasjon|integration|tilkobling|connection)/.test(
      q,
    ) &&
    !asksModuleActivation(q)
  ) {
    return "status";
  }

  return null;
}

function requiresLiveForKind(kind: LiveIntegrationQueryKind): boolean {
  return kind !== "private_data" && kind !== "role_disambiguation";
}

/** Detect when Companion must use live verified integration data instead of Knowledge Center. */
export function detectLiveIntegrationStatusIntent(
  query: string,
  options?: LiveIntegrationIntentOptions,
): LiveIntegrationStatusIntent | null {
  if (isPlatformOperationalQuery(query, options)) {
    return null;
  }

  const providerKey = resolveProviderKey(options);
  void resolveLocale(options);
  const q = normalizeQuery(query);
  const contextual = hasIntegrationContext(options);
  const queryKind = detectQueryKind(q, contextual);

  if (queryKind) {
    return {
      providerKey,
      requiresLive: requiresLiveForKind(queryKind),
      blocksKnowledgeCenter: true,
      queryKind,
    };
  }

  const mentionsIntegration =
    /(integrasjon|integration|tilkobling|connection|connector|koblet)/.test(q);
  const mentionsLive =
    /(live|nå|now|akkurat nå|hent|fetch|bruk den aktive|use the active|akti(v|ve)|current)/.test(q);
  const mentionsStatusFields =
    /(status|scope|scopes|tillatel|permission|api.?versjon|api version|read.?only|skrivebeskytt|språk|locale|sist.*brukt|last.?used|verifis|verified|organisasjon|organization|tilgang|access)/.test(
      q,
    );
  const excludesKnowledgeCenter =
    /(ikke bruk knowledge center|not use knowledge center|without knowledge center|ingen knowledge center|no knowledge center|ikke bruk generell|not general information)/.test(
      q,
    );

  if (excludesKnowledgeCenter && (mentionsUnonight(q) || mentionsIntegration)) {
    return {
      providerKey,
      requiresLive: true,
      blocksKnowledgeCenter: true,
      queryKind: "status",
    };
  }

  if (mentionsUnonight(q) && (mentionsLive || mentionsStatusFields) && !asksModuleActivation(q)) {
    return {
      providerKey,
      requiresLive: true,
      blocksKnowledgeCenter: true,
      queryKind: "status",
    };
  }

  if (mentionsIntegration && mentionsLive && (mentionsStatusFields || mentionsUnonight(q))) {
    return {
      providerKey,
      requiresLive: true,
      blocksKnowledgeCenter: true,
      queryKind: "status",
    };
  }

  if (
    /(connected integration|tilkoblet integrasjon|tilkoblingsinformasjon|connection metadata|integration metadata)/.test(
      q,
    ) &&
    (mentionsUnonight(q) || mentionsIntegration || mentionsLive)
  ) {
    return {
      providerKey,
      requiresLive: true,
      blocksKnowledgeCenter: true,
      queryKind: "status",
    };
  }

  return null;
}

export function isLiveIntegrationFollowUpQuery(
  query: string,
  options?: LiveIntegrationIntentOptions,
): boolean {
  const intent = detectLiveIntegrationStatusIntent(query, options);
  return intent !== null && (intent.queryKind === "last_used" || hasIntegrationContext(options));
}
