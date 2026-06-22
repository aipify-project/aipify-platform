import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { isCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import {
  detectGenericIntegrationIntent,
  isPlatformOperationalQuery as isGenericPlatformOperationalQuery,
} from "@/lib/integration-intelligence";
import type {
  GenericIntegrationIntent,
  GenericIntegrationIntentKind,
  IntegrationIntelligenceContext,
  IntegrationPresentationMode,
} from "@/lib/integration-intelligence/types";

export type LivePlatformSnapshotQueryKind =
  | "platform_availability"
  | "platform_environment"
  | "platform_version"
  | "platform_supported_languages"
  | "platform_active_modules"
  | "specific_module_status"
  | "platform_checked_at"
  | "visibility_summary"
  | "full_snapshot";

export type PlatformSnapshotPresentationMode = IntegrationPresentationMode;

export type LivePlatformSnapshotIntent = {
  providerKey: string;
  requiresLive: boolean;
  blocksKnowledgeCenter: boolean;
  queryKind: LivePlatformSnapshotQueryKind;
  presentationMode: PlatformSnapshotPresentationMode;
  targetModules?: readonly string[];
};

export type LivePlatformSnapshotIntentOptions = {
  integrationContext?: string | null;
  snapshotContext?: { activeModules?: readonly string[] };
  locale?: CustomerActiveLocale;
};

function resolveProviderKey(options?: LivePlatformSnapshotIntentOptions): string {
  return options?.integrationContext ?? "unonight";
}

function resolveLocale(options?: LivePlatformSnapshotIntentOptions): CustomerActiveLocale {
  if (options?.locale && isCustomerActiveLocale(options.locale)) return options.locale;
  return "en";
}

function toIntelligenceContext(
  options?: LivePlatformSnapshotIntentOptions,
): IntegrationIntelligenceContext {
  const providerKey = resolveProviderKey(options);
  return {
    activeProviderKey: options?.integrationContext ? providerKey : null,
    snapshotContext: options?.snapshotContext?.activeModules
      ? { activeModuleKeys: options.snapshotContext.activeModules }
      : undefined,
  };
}

function mapQueryKind(kind: GenericIntegrationIntentKind): LivePlatformSnapshotQueryKind | null {
  switch (kind) {
    case "entity_active_status":
      return "specific_module_status";
    case "list_capabilities":
      return "platform_active_modules";
    case "full_platform_summary":
      return "full_snapshot";
    case "platform_availability":
    case "platform_environment":
    case "platform_version":
    case "platform_supported_languages":
    case "platform_checked_at":
    case "visibility_summary":
      return kind;
    default:
      return null;
  }
}

function mapGenericIntent(intent: GenericIntegrationIntent): LivePlatformSnapshotIntent | null {
  const queryKind = mapQueryKind(intent.queryKind);
  if (!queryKind) return null;

  return {
    providerKey: intent.providerKey,
    requiresLive: intent.requiresLive,
    blocksKnowledgeCenter: intent.blocksKnowledgeCenter,
    queryKind,
    presentationMode: intent.presentationMode,
    targetModules: intent.targetEntityKeys,
  };
}

/** Detect when Companion must use live platform snapshot instead of Knowledge Center. */
export function detectLivePlatformSnapshotIntent(
  query: string,
  options?: LivePlatformSnapshotIntentOptions,
): LivePlatformSnapshotIntent | null {
  const providerKey = resolveProviderKey(options);
  const locale = resolveLocale(options);
  const intent = detectGenericIntegrationIntent(
    query,
    providerKey,
    locale,
    toIntelligenceContext(options),
  );
  if (!intent || intent.capability !== "platform_snapshot") return null;
  if (intent.queryKind === "forbidden_data_request" || intent.queryKind === "unsupported_metric") {
    return null;
  }
  return mapGenericIntent(intent);
}

export function isPlatformOperationalQuery(
  query: string,
  options?: LivePlatformSnapshotIntentOptions,
): boolean {
  const providerKey = resolveProviderKey(options);
  const locale = resolveLocale(options);
  return isGenericPlatformOperationalQuery(query, providerKey, locale, toIntelligenceContext(options));
}

export function mapLiveIntentToGeneric(
  intent: Pick<LivePlatformSnapshotIntent, "queryKind" | "presentationMode" | "targetModules">,
): Pick<GenericIntegrationIntent, "queryKind" | "presentationMode" | "targetEntityKeys"> {
  const queryKind: GenericIntegrationIntentKind =
    intent.queryKind === "specific_module_status"
      ? "entity_active_status"
      : intent.queryKind === "platform_active_modules"
        ? "list_capabilities"
        : intent.queryKind === "full_snapshot"
          ? "full_platform_summary"
          : intent.queryKind;

  return {
    queryKind,
    presentationMode: intent.presentationMode,
    targetEntityKeys: intent.targetModules,
  };
}
