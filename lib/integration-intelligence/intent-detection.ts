import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { getIntegrationProviderManifest } from "./manifest-registry";
import {
  hasProviderContext,
  mentionsProvider,
  resolveFollowUpEntityKeys,
} from "./entity-resolution";
import { normalizeIntegrationQuery } from "./normalize-text";
import type {
  GenericIntegrationIntent,
  IntegrationCapabilityKey,
  IntegrationIntelligenceContext,
  IntegrationPresentationMode,
} from "./types";

function asksModuleActivation(q: string): boolean {
  return /(aktiv|active|aktivert|enabled|slatt pa|turned on|rapporter|report|reported|fungerer|working)/.test(
    q,
  );
}

function asksYesNoQuestion(q: string): boolean {
  return /^(er |is |ar |czy |es |chi |har |gjor |do )/.test(q) || /\?(.*\b(er|is|are|czy)\b)/.test(q);
}

function asksFullPlatformOverview(q: string): boolean {
  return /(full live drift|driftsoversikt|komplett plattform|full platform|complete platform|full live overview|full live operational|all platform metadata|hele plattform|full oversikt|komplett oversikt|full live driftsoversikt)/.test(
    q,
  );
}

function asksPlatformCheckedAt(q: string): boolean {
  return /(nar ble.*kontrollert|when.*checked|sist kontrollert live|checked live|kontrolltidspunkt|nar ble opplysningene|when were.*checked|last checked live)/.test(
    q,
  );
}

function asksPlatformLanguages(q: string): boolean {
  return (
    /(sprak|language|locale|idiom|jezyk|mova)/.test(q) &&
    /(rapporter|report|stott|support|aktive|active|plattform|platform|provider)/.test(q) &&
    !/(scope|tilgang|access|integrasjon.*stott|integration.*support)/.test(q)
  );
}

function asksPlatformVersion(q: string): boolean {
  if (/(api.?versjon|api version|integrasjon|integration|tilkobling|connection)/.test(q)) {
    return false;
  }
  return /(plattformversjon|platform version|versjon av|version of|version rapporter)/.test(q);
}

function asksPlatformAvailability(q: string): boolean {
  return /(tilgjengelig|available|tillganglig|disponible|dostepn|dostupn)/.test(q);
}

function asksPlatformEnvironment(q: string): boolean {
  return /(miljo|milo|environment|produksjon|production|staging|testmiljo|entorno|srodowisko|seredovishche|kjorer plattformen|platform.*running)/.test(
    q,
  );
}

function asksActiveCapabilities(q: string): boolean {
  return (
    /(modul|module|funksjon|funksjoner|function|functions|feature|funktion|funcion|funkc|capabilit)/.test(q) &&
    /(aktiv|active|rapporter|report|hva kan aipify se|what can aipify see|forklar|explain|vanlig|readable|available|tilgjengelig)/.test(
      q,
    )
  );
}

function asksForbiddenData(q: string): boolean {
  const asksToShowPrivateContent = /(vis|show|hent|get|siste|last|recent|latest|read|les|open|apne)/.test(q);
  const mentionsPrivateMessages =
    /(private melding|private message|private chat|dm|innboks|inbox|samtale|conversation)/.test(q) &&
    !asksModuleActivation(q);
  return asksToShowPrivateContent && mentionsPrivateMessages;
}

function asksUnsupportedMetric(q: string): boolean {
  return (
    /(medlem|medlemmer|member|members|bruker|users|subscriber|abonnent|antall|how many|count|tall)/.test(q) &&
    !/(scope|integrasjon|tilkobling|status|sprak|language|locale|tilgang|access|rolle|role|endre|change)/.test(
      q,
    )
  );
}

function asksConnectionStatus(q: string): boolean {
  return /(koblet|connected|tilkoblet|skrivebeskytt|read.?only|verifis|integrasjon|integration|tilkobling|connection|scope|tillatel|permission|tilgangstype|access type|organisasjon|organization)/.test(
    q,
  );
}

function isComprehensiveIntegrationStatusQuery(q: string): boolean {
  const signals = [
    /organisasjon|organization/.test(q),
    /api.?versjon|api version/.test(q),
    /scope|tillatel|permission/.test(q),
    /sprak|locale|language/.test(q),
    /tilgang|access|tilkoblingsinformasjon|connection metadata|live tilkoblingsinformasjon/.test(q),
  ].filter(Boolean).length;

  return signals >= 2;
}

function buildIntent(
  providerKey: string,
  capability: IntegrationCapabilityKey,
  queryKind: GenericIntegrationIntent["queryKind"],
  presentationMode: IntegrationPresentationMode,
  targetEntityKeys?: readonly string[],
): GenericIntegrationIntent {
  return {
    providerKey,
    requiresLive: true,
    blocksKnowledgeCenter: true,
    queryKind,
    presentationMode,
    capability,
    targetEntityKeys,
  };
}

export function detectGenericIntegrationIntent(
  query: string,
  providerKey: string,
  locale: CustomerActiveLocale,
  options?: IntegrationIntelligenceContext,
): GenericIntegrationIntent | null {
  const manifest = getIntegrationProviderManifest(providerKey);
  if (!manifest) return null;

  const q = normalizeIntegrationQuery(query);
  const contextual = hasProviderContext(manifest, options) || mentionsProvider(q, manifest);
  if (!contextual) return null;

  if (asksForbiddenData(q)) {
    return {
      providerKey,
      requiresLive: false,
      blocksKnowledgeCenter: true,
      queryKind: "forbidden_data_request",
      presentationMode: "direct_fact",
      capability: "platform_snapshot",
    };
  }

  if (asksUnsupportedMetric(q)) {
    return {
      providerKey,
      requiresLive: true,
      blocksKnowledgeCenter: true,
      queryKind: "unsupported_metric",
      presentationMode: "direct_fact",
      capability: "platform_snapshot",
    };
  }

  if (asksFullPlatformOverview(q)) {
    return buildIntent(providerKey, "platform_snapshot", "full_platform_summary", "full_snapshot");
  }

  if (isComprehensiveIntegrationStatusQuery(q)) {
    return null;
  }

  if (asksPlatformCheckedAt(q)) {
    return buildIntent(providerKey, "platform_snapshot", "platform_checked_at", "direct_fact");
  }

  const targetEntityKeys = resolveFollowUpEntityKeys(q, providerKey, locale, options?.snapshotContext);
  if (
    targetEntityKeys.length > 0 &&
    (asksModuleActivation(q) || asksYesNoQuestion(q) || /(blant dem|among them|bland dem)/.test(q))
  ) {
    return buildIntent(
      providerKey,
      "platform_snapshot",
      "entity_active_status",
      "direct_fact",
      targetEntityKeys,
    );
  }

  if (asksPlatformLanguages(q)) {
    return buildIntent(providerKey, "platform_snapshot", "platform_supported_languages", "direct_fact");
  }

  if (asksPlatformVersion(q)) {
    return buildIntent(providerKey, "platform_snapshot", "platform_version", "direct_fact");
  }

  if (asksActiveCapabilities(q)) {
    return buildIntent(providerKey, "platform_snapshot", "list_capabilities", "multi_item_summary");
  }

  if (/(hva kan aipify se|what can aipify see|hva kan.*se fra|what.*see from)/.test(q)) {
    return buildIntent(providerKey, "platform_snapshot", "visibility_summary", "multi_item_summary");
  }

  if (asksPlatformAvailability(q) && asksPlatformEnvironment(q)) {
    return buildIntent(providerKey, "platform_snapshot", "platform_environment", "direct_fact");
  }

  if (asksPlatformAvailability(q)) {
    return buildIntent(providerKey, "platform_snapshot", "platform_availability", "direct_fact");
  }

  if (asksPlatformEnvironment(q)) {
    return buildIntent(providerKey, "platform_snapshot", "platform_environment", "direct_fact");
  }

  if (contextual && /(plattformmetadata|platform metadata|platform-snapshot|platform snapshot)/.test(q)) {
    return buildIntent(providerKey, "platform_snapshot", "full_platform_summary", "full_snapshot");
  }

  if (asksConnectionStatus(q) && !asksModuleActivation(q)) {
    return buildIntent(providerKey, "connection_status", "connection_status", "multi_item_summary");
  }

  return null;
}

export function isPlatformOperationalQuery(
  query: string,
  providerKey: string,
  locale: CustomerActiveLocale,
  options?: IntegrationIntelligenceContext,
): boolean {
  const intent = detectGenericIntegrationIntent(query, providerKey, locale, options);
  if (!intent) return false;
  if (intent.queryKind === "unsupported_metric" || intent.queryKind === "forbidden_data_request") {
    return false;
  }
  return intent.capability === "platform_snapshot" && intent.queryKind !== "connection_status";
}
