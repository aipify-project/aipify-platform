import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { listSalesProviderManifests } from "@/lib/integration-intelligence/sales/registry";
import type { SalesProviderImplementationStatus } from "@/lib/integration-intelligence/sales/types";
import { isSalesBusinessPackActive } from "@/lib/integration-intelligence/sales/types";
import {
  buildSalesCapabilityRuntimeRef,
  createEmptyCompanionSalesContext,
  type CompanionSalesContext,
  type SalesCommandBriefSignal,
  type SalesProviderRuntimeStatus,
} from "./companion-sales-context";

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
  manifestStatus: SalesProviderImplementationStatus;
  engineEnabled: boolean;
  connectedProviders: string[];
  appEntitlementBlocked: boolean;
  businessPackActive: boolean;
}): SalesProviderRuntimeStatus {
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
    sales_revenue_pipeline_enabled: input.engineEnabled,
    customer_relationship_enabled: input.engineEnabled,
    lead_management_enabled: input.engineEnabled,
    revenue_intelligence_enabled: input.engineEnabled,
    growth_partner_attribution_enabled: false,
    verified,
    adapter_available: false,
    entitlement_active: !input.appEntitlementBlocked,
    business_pack_active: input.businessPackActive,
  };
}

function isEngineEnabledForManifest(
  manifestKey: string,
  flags: {
    salesPipeline: boolean;
    customerRelationship: boolean;
    leadManagement: boolean;
    revenueIntelligence: boolean;
  },
): boolean {
  switch (manifestKey) {
    case "sales_revenue_pipeline":
      return flags.salesPipeline;
    case "customer_relationship":
      return flags.customerRelationship;
    case "lead_management":
      return flags.leadManagement;
    case "revenue_intelligence":
      return flags.revenueIntelligence;
    case "growth_partner_attribution":
      return false;
    case "sales_pack_adapter":
      return false;
    default:
      return false;
  }
}

function readCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function arrayLength(value: unknown): number | null {
  return Array.isArray(value) ? value.length : null;
}

function extractSalesOperationalSignals(input: {
  salesPipelineContext: unknown;
  crmContext: unknown;
  leadCenter: unknown;
  revenueAdvisorContext: unknown;
  revenueCenter: unknown;
}): {
  open_leads_count: number | null;
  follow_ups_due_count: number | null;
  at_risk_customers_count: number | null;
  at_risk_deals_count: number | null;
  churn_risk_count: number | null;
  command_brief_signals: SalesCommandBriefSignal[];
} {
  const pipeline =
    input.salesPipelineContext && typeof input.salesPipelineContext === "object"
      ? (input.salesPipelineContext as Record<string, unknown>)
      : {};
  const crm =
    input.crmContext && typeof input.crmContext === "object"
      ? (input.crmContext as Record<string, unknown>)
      : {};
  const crmSummary =
    crm.summary && typeof crm.summary === "object"
      ? (crm.summary as Record<string, unknown>)
      : {};
  const leadCenter =
    input.leadCenter && typeof input.leadCenter === "object"
      ? (input.leadCenter as Record<string, unknown>)
      : {};
  const revenueAdvisor =
    input.revenueAdvisorContext && typeof input.revenueAdvisorContext === "object"
      ? (input.revenueAdvisorContext as Record<string, unknown>)
      : {};
  const revenueCenter =
    input.revenueCenter && typeof input.revenueCenter === "object"
      ? (input.revenueCenter as Record<string, unknown>)
      : {};
  const revenueOverview =
    revenueCenter.overview && typeof revenueCenter.overview === "object"
      ? (revenueCenter.overview as Record<string, unknown>)
      : {};

  const openLeads =
    readCount(crm.open_leads) ??
    readCount(leadCenter.open_leads) ??
    readCount(leadCenter.total_leads);
  const followUpsDue = readCount(crm.follow_ups_due);
  const atRiskCustomers =
    readCount(crm.requires_attention) ??
    readCount(crmSummary.at_risk);
  const atRiskDeals = arrayLength(pipeline.at_risk_opportunities);
  const noActivityDeals = arrayLength(pipeline.no_activity_opportunities);
  const revenueRisks =
    readCount(revenueOverview.revenue_risks) ??
    arrayLength(revenueAdvisor.risks);

  const signals: SalesCommandBriefSignal[] = [];
  if (openLeads !== null && openLeads > 0) {
    signals.push({ signal_key: "new_lead", count: openLeads });
  }
  if (followUpsDue !== null && followUpsDue > 0) {
    signals.push({ signal_key: "lead_without_follow_up", count: followUpsDue });
    signals.push({ signal_key: "recommended_follow_up", count: followUpsDue });
  }
  if (atRiskDeals !== null && atRiskDeals > 0) {
    signals.push({ signal_key: "deal_status_change", count: atRiskDeals });
  }
  if (noActivityDeals !== null && noActivityDeals > 0) {
    signals.push({ signal_key: "sales_target_deviation", count: noActivityDeals });
  }
  if (atRiskCustomers !== null && atRiskCustomers > 0) {
    signals.push({ signal_key: "customer_health_warning", count: atRiskCustomers });
  }
  if (revenueRisks !== null && revenueRisks > 0) {
    signals.push({ signal_key: "churn_risk", count: revenueRisks });
    signals.push({ signal_key: "conversion_deviation", count: revenueRisks });
  }

  return {
    open_leads_count: openLeads,
    follow_ups_due_count: followUpsDue,
    at_risk_customers_count: atRiskCustomers,
    at_risk_deals_count: atRiskDeals,
    churn_risk_count: revenueRisks,
    command_brief_signals: signals,
  };
}

export async function loadCompanionSalesContext(
  supabase: SupabaseClient,
  input: {
    effectivePermissions: string[];
    subscriptionStatus: string | null;
    connectedProviders: string[];
    activeBusinessPacks: string[];
  },
): Promise<CompanionSalesContext> {
  const businessPackActive = isSalesBusinessPackActive(input.activeBusinessPacks);

  const [
    salesPipelineCenterResult,
    salesPipelineContextResult,
    salesPipelineSummaryResult,
    crmCenterResult,
    leadCenterResult,
    crmContextResult,
    crmSummaryResult,
    revenueCenterResult,
    revenueAdvisorResult,
  ] = await Promise.all([
    supabase.rpc("get_sales_revenue_pipeline_center", { p_section: null }),
    supabase.rpc("get_companion_sales_revenue_pipeline_context"),
    supabase.rpc("get_my_sales_revenue_pipeline_summary"),
    supabase.rpc("get_customer_relationship_center", { p_section: null }),
    supabase.rpc("get_lead_management_center"),
    supabase.rpc("get_companion_customer_relationship_context", { p_query: null }),
    supabase.rpc("get_my_customer_relationship_summary"),
    supabase.rpc("get_organization_revenue_operations_center", { p_section: "overview" }),
    supabase.rpc("get_companion_revenue_advisor_context", { p_query: null }),
  ]);

  const permissionDenied = [salesPipelineCenterResult, crmCenterResult].some(
    (result) => result.error && isPermissionDeniedMessage(result.error.message),
  );

  const appEntitlementBlocked = isAppEntitlementBlocked(input.subscriptionStatus);

  if (permissionDenied) {
    return createEmptyCompanionSalesContext({
      permission_denied: true,
      app_entitlement_blocked: appEntitlementBlocked,
      privacy_filtered: true,
    });
  }

  const salesPipelineEnabled = rpcEnabled(salesPipelineCenterResult.data);
  const customerRelationshipEnabled = rpcEnabled(crmCenterResult.data);
  const leadManagementEnabled = rpcEnabled(leadCenterResult.data);
  const revenueIntelligenceEnabled = rpcEnabled(revenueCenterResult.data);

  const operationalSignals = extractSalesOperationalSignals({
    salesPipelineContext: salesPipelineContextResult.data,
    crmContext: crmContextResult.data,
    leadCenter: leadCenterResult.data,
    revenueAdvisorContext: revenueAdvisorResult.data,
    revenueCenter: revenueCenterResult.data,
  });

  const engineFlags = {
    salesPipeline: salesPipelineEnabled,
    customerRelationship: customerRelationshipEnabled,
    leadManagement: leadManagementEnabled,
    revenueIntelligence: revenueIntelligenceEnabled,
  };

  const anyEngineEnabled = Object.values(engineFlags).some(Boolean);

  const providers: SalesProviderRuntimeStatus[] = [];
  const capabilities = [];

  for (const manifest of listSalesProviderManifests()) {
    const engineEnabledForProvider = isEngineEnabledForManifest(manifest.provider_key, engineFlags);
    const providerStatus = resolveProviderRuntimeStatus({
      providerKey: manifest.provider_key,
      manifestStatus: manifest.implementation_status,
      engineEnabled: engineEnabledForProvider,
      connectedProviders: input.connectedProviders,
      appEntitlementBlocked,
      businessPackActive: businessPackActive || anyEngineEnabled,
    });

    providerStatus.sales_revenue_pipeline_enabled =
      engineFlags.salesPipeline && manifest.source_engine === "sales_revenue_pipeline";
    providerStatus.customer_relationship_enabled =
      engineFlags.customerRelationship && manifest.source_engine === "customer_relationship";
    providerStatus.lead_management_enabled =
      engineFlags.leadManagement && manifest.source_engine === "lead_management";
    providerStatus.revenue_intelligence_enabled =
      engineFlags.revenueIntelligence && manifest.source_engine === "revenue_intelligence";
    providerStatus.growth_partner_attribution_enabled = false;

    providers.push(providerStatus);

    for (const capability of manifest.capabilities) {
      const hasPermission =
        !capability.required_permission ||
        input.effectivePermissions.includes(capability.required_permission);

      const runtimeRef = buildSalesCapabilityRuntimeRef({
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

  return createEmptyCompanionSalesContext({
    sales_revenue_pipeline_enabled: salesPipelineEnabled,
    customer_relationship_enabled: customerRelationshipEnabled,
    lead_management_enabled: leadManagementEnabled,
    revenue_intelligence_enabled: revenueIntelligenceEnabled,
    auto_send_blocked: true,
    customer_deletion_blocked: true,
    contract_approval_blocked: true,
    price_change_blocked: true,
    payment_execution_blocked: true,
    irreversible_pipeline_blocked: true,
    sales_role_filter_active: true,
    partner_attribution_metadata_only: true,
    sensitive_contact_data_filtered: true,
    least_privilege_enforced: true,
    open_leads_count: operationalSignals.open_leads_count,
    follow_ups_due_count: operationalSignals.follow_ups_due_count,
    at_risk_customers_count: operationalSignals.at_risk_customers_count,
    at_risk_deals_count: operationalSignals.at_risk_deals_count,
    churn_risk_count: operationalSignals.churn_risk_count,
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
