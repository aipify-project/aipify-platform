import type { CustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { isCustomerActiveLocale } from "@/lib/i18n/customer-active-locale-registry";
import { resolveCompanionLiveToolRouting as resolveGenericLiveToolRouting } from "@/lib/integration-intelligence/routing";
import type { IntegrationIntelligenceContext } from "@/lib/integration-intelligence/types";
import { detectLiveIntegrationStatusIntent } from "./integration-status-intent";
import {
  detectLivePlatformSnapshotIntent,
  type LivePlatformSnapshotIntent,
} from "./platform-snapshot-intent";

export type CompanionLiveToolName =
  | "get_platform_snapshot"
  | "get_connection_status"
  | "forbidden_data_denied"
  | "unsupported_live_metric"
  | "none";

/** @deprecated Use get_platform_snapshot — kept for legacy test references during migration. */
export type LegacyCompanionLiveToolName =
  | "get_unonight_platform_snapshot"
  | "get_connected_integration_status"
  | CompanionLiveToolName;

export type CompanionLiveRoutingOptions = {
  integrationContext?: string | null;
  snapshotContext?: { activeModules?: readonly string[] };
  locale?: CustomerActiveLocale;
};

export type CompanionLiveRoutingResult = {
  tool: CompanionLiveToolName;
  platformSnapshotIntent: LivePlatformSnapshotIntent | null;
  integrationStatusIntent: ReturnType<typeof detectLiveIntegrationStatusIntent>;
  genericIntent: ReturnType<typeof resolveGenericLiveToolRouting>["intent"];
};

function resolveProviderKey(options?: CompanionLiveRoutingOptions): string {
  return options?.integrationContext ?? "unonight";
}

function resolveLocale(options?: CompanionLiveRoutingOptions): CustomerActiveLocale {
  if (options?.locale && isCustomerActiveLocale(options.locale)) return options.locale;
  return "no";
}

function toIntelligenceContext(options?: CompanionLiveRoutingOptions): IntegrationIntelligenceContext {
  const providerKey = resolveProviderKey(options);
  return {
    activeProviderKey: options?.integrationContext ? providerKey : null,
    snapshotContext: options?.snapshotContext?.activeModules
      ? { activeModuleKeys: options.snapshotContext.activeModules }
      : undefined,
  };
}

export function resolveCompanionLiveToolRouting(
  query: string,
  options?: CompanionLiveRoutingOptions,
): CompanionLiveRoutingResult {
  const providerKey = resolveProviderKey(options);
  const locale = resolveLocale(options);
  const intelligenceContext = toIntelligenceContext(options);

  const genericRouting = resolveGenericLiveToolRouting(
    query,
    providerKey,
    locale,
    intelligenceContext,
  );

  if (genericRouting.tool !== "none") {
    const platformSnapshotIntent =
      genericRouting.intent?.capability === "platform_snapshot" &&
      genericRouting.intent.queryKind !== "forbidden_data_request" &&
      genericRouting.intent.queryKind !== "unsupported_metric"
        ? detectLivePlatformSnapshotIntent(query, options)
        : null;

    return {
      tool: genericRouting.tool,
      platformSnapshotIntent,
      integrationStatusIntent: null,
      genericIntent: genericRouting.intent,
    };
  }

  const integrationStatusIntent = detectLiveIntegrationStatusIntent(query, options);
  if (integrationStatusIntent) {
    if (integrationStatusIntent.queryKind === "private_data") {
      return {
        tool: "forbidden_data_denied",
        platformSnapshotIntent: null,
        integrationStatusIntent,
        genericIntent: null,
      };
    }
    if (integrationStatusIntent.queryKind === "unsupported_data") {
      return {
        tool: "unsupported_live_metric",
        platformSnapshotIntent: null,
        integrationStatusIntent,
        genericIntent: null,
      };
    }
    return {
      tool: "get_connection_status",
      platformSnapshotIntent: null,
      integrationStatusIntent,
      genericIntent: null,
    };
  }

  return {
    tool: "none",
    platformSnapshotIntent: null,
    integrationStatusIntent: null,
    genericIntent: null,
  };
}
