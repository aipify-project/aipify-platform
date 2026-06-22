import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listFinanceProviderManifests } from "@/lib/integration-intelligence/finance/registry";
import type { FinanceProviderImplementationStatus } from "@/lib/integration-intelligence/finance/types";
import { isFinanceBusinessPackActive } from "@/lib/integration-intelligence/finance/types";
import {
  buildFinanceCapabilityRuntimeRef,
  createEmptyCompanionFinanceContext,
  type CompanionFinanceContext,
  type FinanceCommandBriefSignal,
  type FinanceProviderRuntimeStatus,
} from "./companion-finance-context";

function isPermissionDeniedMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("permission denied") || lower.includes("permission missing");
}

function isAppEntitlementBlocked(subscriptionStatus: string | null): boolean {
  if (!subscriptionStatus) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(subscriptionStatus.toLowerCase());
}

function rpcEnabled(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;
  if (record.found === false) return false;
  if (record.has_access === false) return false;
  if (record.has_customer === false) return false;
  if (record.has_organization === false) return false;
  return true;
}

function resolveProviderRuntimeStatus(input: {
  providerKey: string;
  manifestStatus: FinanceProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): FinanceProviderRuntimeStatus {
  const verified = input.connectedProviders.includes(input.providerKey);

  let implementationStatus = input.manifestStatus;
  if (verified && input.manifestStatus === "implemented_disconnected") {
    implementationStatus = "connected";
  } else if (!verified && input.manifestStatus === "connected") {
    implementationStatus = "implemented_disconnected";
  }

  return {
    provider_key: input.providerKey,
    implementation_status: implementationStatus,
    finance_operations_enabled: input.engineEnabled,
    revenue_operations_enabled: input.engineEnabled,
    unified_billing_enabled: input.engineEnabled,
    payment_providers_enabled: input.engineEnabled,
    enterprise_invoicing_enabled: input.engineEnabled,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    financeOperations: boolean;
    revenueOperations: boolean;
    unifiedBilling: boolean;
    paymentProviders: boolean;
    enterpriseInvoicing: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "finance_operations_center":
      return flags.financeOperations;
    case "revenue_operations":
      return flags.revenueOperations;
    case "unified_billing":
      return flags.unifiedBilling;
    case "payment_providers":
      return flags.paymentProviders;
    case "enterprise_invoicing":
      return flags.enterpriseInvoicing;
    case "finance_pack_adapter":
      return false;
    default:
      return false;
  }
}

function readCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function extractFinanceOperationalSignals(input: {
  financeOpsContext: unknown;
  financeCenterData: unknown;
  revenueAdvisorContext: unknown;
}): {
  overdue_invoice_count: number | null;
  subscription_renewal_count: number | null;
  forecast_warning_count: number | null;
  revenue_deviation_count: number | null;
  command_brief_signals: FinanceCommandBriefSignal[];
} {
  const opsContext =
    input.financeOpsContext && typeof input.financeOpsContext === "object"
      ? (input.financeOpsContext as Record<string, unknown>)
      : {};
  const center =
    input.financeCenterData && typeof input.financeCenterData === "object"
      ? (input.financeCenterData as Record<string, unknown>)
      : {};
  const overview =
    center.overview && typeof center.overview === "object"
      ? (center.overview as Record<string, unknown>)
      : {};
  const revenueAdvisor =
    input.revenueAdvisorContext && typeof input.revenueAdvisorContext === "object"
      ? (input.revenueAdvisorContext as Record<string, unknown>)
      : {};
  const risks = revenueAdvisor.risks;

  const overdueInvoices =
    readCount(opsContext.overdue_invoices) ?? readCount(overview.outstanding_invoices);
  const subscriptionRenewals = readCount(opsContext.subscription_renewals_30d);
  const budgetsExceeded = readCount(opsContext.budgets_exceeded);
  const revenueRiskCount = Array.isArray(risks) ? risks.length : null;

  const signals: FinanceCommandBriefSignal[] = [];
  if (overdueInvoices !== null && overdueInvoices > 0) {
    signals.push({ signal_key: "overdue_invoice", count: overdueInvoices });
  }
  if (subscriptionRenewals !== null && subscriptionRenewals > 0) {
    signals.push({ signal_key: "subscription_change", count: subscriptionRenewals });
  }
  if (budgetsExceeded !== null && budgetsExceeded > 0) {
    signals.push({ signal_key: "forecast_warning", count: budgetsExceeded });
  }
  if (revenueRiskCount !== null && revenueRiskCount > 0) {
    signals.push({ signal_key: "revenue_deviation", count: revenueRiskCount });
  }

  return {
    overdue_invoice_count: overdueInvoices,
    subscription_renewal_count: subscriptionRenewals,
    forecast_warning_count: budgetsExceeded,
    revenue_deviation_count: revenueRiskCount,
    command_brief_signals: signals,
  };
}

export async function loadCompanionFinanceContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
  },
): Promise<CompanionFinanceContext> {
  const businessPackActive = isFinanceBusinessPackActive(input.activeBusinessPacks);

  const [
    financeCenterResult,
    financeOpsContextResult,
    financeSummaryResult,
    revenueCenterResult,
    revenueAdvisorResult,
    unifiedBillingResult,
    paymentProvidersResult,
    enterpriseInvoicingResult,
  ] = await Promise.all([
    supabase.rpc("get_finance_operations_center", { p_section: null }),
    supabase.rpc("get_companion_finance_operations_context"),
    supabase.rpc("get_my_finance_operations_summary"),
    supabase.rpc("get_organization_revenue_operations_center", { p_section: "overview" }),
    supabase.rpc("get_companion_revenue_advisor_context", { p_query: null }),
    supabase.rpc("get_customer_unified_billing_center"),
    supabase.rpc("get_payment_providers_center", { p_scope: "tenant", p_tenant_id: null }),
    supabase.rpc("get_enterprise_invoice_billing_center", { p_scope: "tenant" }),
  ]);

  const permissionDenied = [financeCenterResult, financeOpsContextResult].some(
    (result) => result.error && isPermissionDeniedMessage(result.error.message),
  );

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionFinanceContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const financeOperationsEnabled = rpcEnabled(financeCenterResult.data);
  const revenueOperationsEnabled = rpcEnabled(revenueCenterResult.data);
  const unifiedBillingEnabled = rpcEnabled(unifiedBillingResult.data);
  const paymentProvidersEnabled = rpcEnabled(paymentProvidersResult.data);
  const enterpriseInvoicingEnabled = rpcEnabled(enterpriseInvoicingResult.data);

  const operationalSignals = extractFinanceOperationalSignals({
    financeOpsContext: financeOpsContextResult.data,
    financeCenterData: financeCenterResult.data,
    revenueAdvisorContext: revenueAdvisorResult.data,
  });

  const engineFlags = {
    financeOperations: financeOperationsEnabled,
    revenueOperations: revenueOperationsEnabled,
    unifiedBilling: unifiedBillingEnabled,
    paymentProviders: paymentProvidersEnabled,
    enterpriseInvoicing: enterpriseInvoicingEnabled,
  };

  const anyEngineEnabled = Object.values(engineFlags).some(Boolean);

  const providers: FinanceProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listFinanceProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive: businessPackActive || anyEngineEnabled,
    });

    providerStatus.finance_operations_enabled =
      engineFlags.financeOperations && manifest.source_engine === "finance_operations";
    providerStatus.revenue_operations_enabled =
      engineFlags.revenueOperations && manifest.source_engine === "revenue_operations";
    providerStatus.unified_billing_enabled =
      engineFlags.unifiedBilling && manifest.source_engine === "unified_billing";
    providerStatus.payment_providers_enabled =
      engineFlags.paymentProviders && manifest.source_engine === "payment_providers";
    providerStatus.enterprise_invoicing_enabled =
      engineFlags.enterpriseInvoicing && manifest.source_engine === "enterprise_invoicing";

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildFinanceCapabilityRuntimeRef({
        manifest,
        providerStatus,
        capability,
        hasPermission,
      });

      if (runtimeRef) {
        capabilities.push(runtimeRef);
      }
    }
  }

  return createEmptyCompanionFinanceContext({
    finance_operations_enabled: financeOperationsEnabled,
    revenue_operations_enabled: revenueOperationsEnabled,
    unified_billing_enabled: unifiedBillingEnabled,
    payment_providers_enabled: paymentProvidersEnabled,
    enterprise_invoicing_enabled: enterpriseInvoicingEnabled,
    payment_execution_blocked: true,
    payout_execution_blocked: true,
    refund_execution_blocked: true,
    bank_transfer_blocked: true,
    invoice_send_blocked: true,
    subscription_cancel_blocked: true,
    destructive_correction_blocked: true,
    irreversible_posting_blocked: true,
    finance_role_filter_active: true,
    sensitive_account_data_masked: true,
    no_raw_card_or_bank_details: true,
    provider_verified_only: true,
    overdue_invoice_count: operationalSignals.overdue_invoice_count,
    subscription_renewal_count: operationalSignals.subscription_renewal_count,
    forecast_warning_count: operationalSignals.forecast_warning_count,
    revenue_deviation_count: operationalSignals.revenue_deviation_count,
    command_brief_signals: operationalSignals.command_brief_signals,
    command_brief_events_linked:
      operationalSignals.command_brief_signals.length > 0 &&
      (businessPackActive || anyEngineEnabled),
    providers,
    capabilities,
    permission_denied: false,
    app_entitlement_blocked: appEntitlementBlocked,
  });
}
