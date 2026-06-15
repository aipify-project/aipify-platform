import { normalizeHostsPlanKey } from "./licensing";
import type {
  AddAipifyHostsPropertyLicenseResult,
  AipifyHostsCard,
  AipifyHostsDashboard,
  CreateAipifyHostsPropertyResult,
  HostsLicensing,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseLicensing(data: unknown): HostsLicensing | undefined {
  if (!data || typeof data !== "object") return undefined;
  const d = data as Record<string, unknown>;
  const planType = normalizeHostsPlanKey(typeof d.plan_type === "string" ? d.plan_type : undefined);
  const allowed = Boolean(d.allowed ?? d.can_add_property);
  return {
    allowed,
    can_add_property: Boolean(d.can_add_property ?? allowed),
    plan_type: planType,
    base_property_limit: Number(d.base_property_limit ?? d.property_limit ?? 0),
    additional_property_licenses: Number(d.additional_property_licenses ?? 0),
    property_limit: Number(d.property_limit ?? 0),
    active_property_count: Number(d.active_property_count ?? 0),
    remaining_capacity: Number(d.remaining_capacity ?? 0),
    upgrade_required: Boolean(d.upgrade_required),
    at_capacity: Boolean(d.at_capacity),
    capacity_label: typeof d.capacity_label === "string" ? d.capacity_label : "",
    principle: typeof d.principle === "string" ? d.principle : undefined,
  };
}

export function parseAipifyHostsDashboard(data: unknown): AipifyHostsDashboard | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;
  const packageKey = normalizeHostsPlanKey(typeof d.package_key === "string" ? d.package_key : undefined);
  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: packageKey,
    plan_type: normalizeHostsPlanKey(typeof d.plan_type === "string" ? d.plan_type : packageKey),
    property_count: Number(d.property_count ?? 0),
    property_limit: d.property_limit !== undefined ? Number(d.property_limit) : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    licensing: parseLicensing(d.licensing),
    licensing_principle: typeof d.licensing_principle === "string" ? d.licensing_principle : undefined,
    platforms: asArray(d.platforms),
    modules: asArray(d.modules),
    packages: asArray(d.packages),
    executive_widgets: asArray(d.executive_widgets),
    success_metrics: asArray(d.success_metrics),
    governance: (typeof d.governance === "object" && d.governance ? d.governance : {
      principle: "",
      approval_required: true,
      audit_required: true,
    }) as AipifyHostsDashboard["governance"],
    property_health_score: Number(d.property_health_score ?? 0),
    properties: asArray(d.properties),
  };
}

export function parseAipifyHostsCard(data: unknown): AipifyHostsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled !== undefined ? Boolean(d.enabled) : undefined,
    package_key: typeof d.package_key === "string" ? normalizeHostsPlanKey(d.package_key) : undefined,
    plan_type: typeof d.plan_type === "string" ? normalizeHostsPlanKey(d.plan_type) : undefined,
    property_count: d.property_count !== undefined ? Number(d.property_count) : undefined,
    property_limit: d.property_limit !== undefined ? Number(d.property_limit) : undefined,
    licensing: parseLicensing(d.licensing),
    human_oversight_required: d.human_oversight_required !== undefined ? Boolean(d.human_oversight_required) : undefined,
    positioning: typeof d.positioning === "string" ? d.positioning : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}

export function parseCreateAipifyHostsPropertyResult(data: unknown): CreateAipifyHostsPropertyResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    error_code: typeof d.error_code === "string" ? d.error_code : undefined,
    upgrade_required: d.upgrade_required !== undefined ? Boolean(d.upgrade_required) : undefined,
    licensing: parseLicensing(d.licensing),
    property: typeof d.property === "object" && d.property ? (d.property as CreateAipifyHostsPropertyResult["property"]) : undefined,
  };
}

export function parseAddAipifyHostsPropertyLicenseResult(data: unknown): AddAipifyHostsPropertyLicenseResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    additional_property_licenses:
      d.additional_property_licenses !== undefined ? Number(d.additional_property_licenses) : undefined,
    licensing: parseLicensing(d.licensing),
    error: typeof d.error === "string" ? d.error : undefined,
  };
}
