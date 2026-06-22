import type { CompanionCommunityContext } from "./companion-community-context";
import type { CompanionFinanceContext } from "./companion-finance-context";
import type { CompanionHrContext } from "./companion-hr-context";
import type { CompanionOperationalContext } from "./companion-operational-context";
import type { CompanionProactiveContext } from "./companion-proactive-context";
import type { CompanionSalesContext } from "./companion-sales-context";
import type { CompanionSecurityContext } from "./companion-security-context";
import type { CompanionSupportContext } from "./companion-support-context";
import type { CompanionWarehouseContext } from "./companion-warehouse-context";
import {
  collectDomainCommandBriefSignals,
  type CommandBriefDomainSignalSource,
  type CommandBriefRawDomainSignal,
} from "@/lib/integration-intelligence/command-brief";
import { buildBookingCommandBriefSignals } from "./booking-read-orchestrator";
import { buildSupportCommandBriefSignals } from "./support-read-orchestrator";
import { buildVerificationCommandBriefSignals } from "./verification-read-orchestrator";

export type CommandBriefDomainContexts = {
  hrContext: CompanionHrContext;
  warehouseContext: CompanionWarehouseContext;
  financeContext: CompanionFinanceContext;
  salesContext: CompanionSalesContext;
  securityContext: CompanionSecurityContext;
  communityContext: CompanionCommunityContext;
  operationalContext: CompanionOperationalContext;
  proactiveContext: CompanionProactiveContext;
  supportContext?: CompanionSupportContext;
};

function toRawSignals(
  signals: ReadonlyArray<{ signal_key: string; count: number | null }>,
  sourceExact?: boolean,
): CommandBriefRawDomainSignal[] {
  return signals.map((entry) => ({
    signal_key: entry.signal_key,
    count: entry.count,
    source_exact: sourceExact,
  }));
}

export function buildCommandBriefDomainSources(
  contexts: CommandBriefDomainContexts,
  input?: {
    verification_queue?: Parameters<typeof buildVerificationCommandBriefSignals>[0]["queue"];
    verification_source_exact?: boolean;
    booking_candidates?: Parameters<typeof buildBookingCommandBriefSignals>[0];
    supportContext?: CompanionSupportContext;
  },
): CommandBriefDomainSignalSource[] {
  const sources: CommandBriefDomainSignalSource[] = [
    {
      source_module: "hr",
      source_provider: "hr_engine",
      signals: toRawSignals(contexts.hrContext.command_brief_signals),
      required_permission: "hr.view",
      related_capability: "employee.read",
    },
    {
      source_module: "warehouse",
      source_provider: "warehouse_engine",
      signals: toRawSignals(contexts.warehouseContext.command_brief_signals),
      required_permission: "warehouse.view",
      related_capability: "inventory.read",
    },
    {
      source_module: "finance",
      source_provider: "finance_engine",
      signals: toRawSignals(contexts.financeContext.command_brief_signals),
      required_permission: "billing.view",
      related_capability: "invoice.read",
    },
    {
      source_module: "sales",
      source_provider: "sales_engine",
      signals: toRawSignals(contexts.salesContext.command_brief_signals),
      required_permission: "sales.view",
      related_capability: "lead.read",
    },
    {
      source_module: "security",
      source_provider: "security_engine",
      signals: toRawSignals(contexts.securityContext.command_brief_signals),
      required_permission: "security.view",
      related_capability: "risk.read",
    },
    {
      source_module: "community",
      source_provider: "community_network_center",
      signals: toRawSignals(contexts.communityContext.command_brief_signals),
      required_permission: "customer_community.view",
      related_capability: "community.read",
    },
  ];

  if (input?.verification_queue && input.verification_source_exact) {
    sources.push({
      source_module: "verification",
      source_provider: "verification_queue",
      signals: toRawSignals(
        buildVerificationCommandBriefSignals({
          queue: input.verification_queue,
          source_exact: true,
        }),
        true,
      ),
      required_permission: "verification.view",
      related_capability: "verification.read",
    });
  }

  if (input?.booking_candidates?.length) {
    sources.push({
      source_module: "booking",
      source_provider: "appointment_booking",
      signals: toRawSignals(buildBookingCommandBriefSignals(input.booking_candidates), true),
      required_permission: "appointments.view",
      related_capability: "booking.read",
    });
  }

  if (
    input?.supportContext?.support_source_exact &&
    input.supportContext.queue_summary
  ) {
    sources.push({
      source_module: "support",
      source_provider: "autonomous_support_operations",
      signals: toRawSignals(
        buildSupportCommandBriefSignals({
          queue: input.supportContext.queue_summary,
          cases: input.supportContext.case_summaries,
          pending_drafts_count: input.supportContext.pending_drafts_count,
          source_exact: true,
        }),
        true,
      ),
      required_permission: "support.view",
      related_capability: "support_queue.read",
    });
  }

  return sources;
}

export function collectCommandBriefSignalsFromDomainContexts(input: {
  organization_id: string;
  contexts: CommandBriefDomainContexts;
  verification_queue?: Parameters<typeof buildVerificationCommandBriefSignals>[0]["queue"];
  verification_source_exact?: boolean;
  booking_candidates?: Parameters<typeof buildBookingCommandBriefSignals>[0];
  supportContext?: CompanionSupportContext;
}): ReturnType<typeof collectDomainCommandBriefSignals> {
  const sources = buildCommandBriefDomainSources(input.contexts, {
    verification_queue: input.verification_queue,
    verification_source_exact: input.verification_source_exact,
    booking_candidates: input.booking_candidates,
    supportContext: input.supportContext ?? input.contexts.supportContext,
  });

  return collectDomainCommandBriefSignals({
    organization_id: input.organization_id,
    sources,
  });
}
