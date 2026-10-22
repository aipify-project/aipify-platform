import type { RpcClient } from "@/lib/core/rpc-client";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { organizationMembershipCanManageDomains } from "./membership-role";
import type { DomainLicenseCenter, DomainRecord } from "./types";

/**
 * Page loads must not call get_domain_license_center or get_companion_domain_context.
 * Those functions create or update a primary domain while reading.
 * This reader only selects rows for the organization already chosen for the signed-in user.
 * Domain creation stays on perform_domain_license_action.
 */
const SUPPORTED_PLATFORMS = [
  "wordpress",
  "shopify",
  "woocommerce",
  "custom_website",
  "enterprise_integration",
  "future_platform",
];

export class DomainCenterAccessError extends Error {
  constructor() {
    super("Owner or admin role required");
    this.name = "DomainCenterAccessError";
  }
}

type Row = Record<string, unknown>;

type EqBuilder = PromiseLike<{ data: unknown; error: { message: string } | null }> & {
  eq: (column: string, value: unknown) => EqBuilder;
  maybeSingle: () => PromiseLike<{ data: unknown; error: { message: string } | null }>;
};

export type OrganizationDomainReadClient = {
  from: (table: string) => {
    select: (columns: string) => EqBuilder;
  };
};

function asRows(data: unknown): Row[] {
  return Array.isArray(data) ? (data as Row[]) : [];
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function selectOrgRows(
  admin: OrganizationDomainReadClient,
  table: string,
  columns: string,
  organizationId: string,
): Promise<Row[]> {
  const { data, error } = await admin.from(table).select(columns).eq("organization_id", organizationId);
  if (error) throw new Error(error.message);
  return asRows(data);
}

function toDomainRecord(row: Row, packs: Row[], assignmentCounts: Map<string, number>): DomainRecord | null {
  const id = text(row.id);
  const domain = text(row.domain);
  if (!id || !domain) return null;
  const installed = packs
    .filter((pack) => text(pack.domain_id) === id)
    .map((pack) => ({
      pack_key: text(pack.pack_key) ?? "",
      license_status: text(pack.license_status) ?? "",
      installed_at: text(pack.installed_at) ?? undefined,
    }))
    .filter((pack) => pack.pack_key);
  return {
    id,
    domain,
    display_name: text(row.display_name) ?? domain,
    domain_status: text(row.domain_status) ?? "unknown",
    connected_platform: text(row.connected_platform) ?? undefined,
    license_status: text(row.license_status) ?? undefined,
    is_primary: row.is_primary === true,
    verification_status: text(row.verification_status) ?? undefined,
    installed_packs: installed,
    assigned_users: assignmentCounts.get(id) ?? 0,
    created_at: text(row.created_at) ?? undefined,
  };
}

export async function readOrganizationDomainCenter(
  supabase: RpcClient,
  options?: { admin?: OrganizationDomainReadClient },
): Promise<DomainLicenseCenter> {
  const { data, error } = await supabase.rpc("get_app_organization_context");
  if (error) throw new Error(error.message);

  const context = parseAppOrganizationContext(data);
  if (!context.authenticated || context.state === "unauthenticated" || !context.organization_id) {
    return { found: false };
  }
  if (!organizationMembershipCanManageDomains(context)) {
    throw new DomainCenterAccessError();
  }

  const admin = options?.admin ?? (createServiceRoleClient() as unknown as OrganizationDomainReadClient);
  const organizationId = context.organization_id;
  const domainRows = await selectOrgRows(
    admin,
    "organization_domains",
    "id, domain, display_name, domain_status, connected_platform, license_status, is_primary, verification_status, created_at",
    organizationId,
  );

  let packRows: Row[] = [];
  try {
    packRows = await selectOrgRows(
      admin,
      "domain_business_pack_installations",
      "domain_id, pack_key, license_status, installed_at",
      organizationId,
    );
    packRows = packRows.filter((row) => text(row.license_status) === "active");
  } catch {
    packRows = [];
  }

  const assignmentCounts = new Map<string, number>();
  try {
    const assignments = await selectOrgRows(admin, "domain_user_assignments", "domain_id", organizationId);
    for (const row of assignments) {
      const domainId = text(row.domain_id);
      if (!domainId) continue;
      assignmentCounts.set(domainId, (assignmentCounts.get(domainId) ?? 0) + 1);
    }
  } catch {
    assignmentCounts.clear();
  }

  const active = domainRows
    .filter((row) => text(row.domain_status) === "active")
    .map((row) => toDomainRecord(row, packRows, assignmentCounts))
    .filter((row): row is DomainRecord => row != null)
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.domain.localeCompare(b.domain));
  const pending = domainRows
    .filter((row) => text(row.domain_status) === "pending")
    .map((row) => toDomainRecord(row, packRows, assignmentCounts))
    .filter((row): row is DomainRecord => row != null)
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));

  const primary = active.find((row) => row.is_primary) ?? pending.find((row) => row.is_primary);

  let licenseSummary: DomainLicenseCenter["license_summary"];
  try {
    const poolResult = await admin
      .from("organization_domain_license_pool")
      .select("included_licenses, purchased_licenses")
      .eq("organization_id", organizationId)
      .maybeSingle();
    if (!poolResult.error && poolResult.data && typeof poolResult.data === "object") {
      const pool = poolResult.data as Row;
      const included = typeof pool.included_licenses === "number" ? pool.included_licenses : 0;
      const purchasedAdditional = typeof pool.purchased_licenses === "number" ? pool.purchased_licenses : 0;
      const used = active.length + pending.length;
      const purchased = included + purchasedAdditional;
      licenseSummary = {
        purchased,
        used,
        available: Math.max(0, purchased - used),
        included,
        purchased_additional: purchasedAdditional,
      };
    }
  } catch {
    licenseSummary = undefined;
  }

  return {
    found: true,
    principle:
      "APP owns domains. Domains own Business Pack installations. Employees receive access through APP permissions.",
    structure: "PLATFORM → APP → DOMAIN LICENSES → BUSINESS PACKS → EMPLOYEES",
    primary_domain_id: primary?.id,
    license_summary: licenseSummary,
    active_domains: active,
    pending_domains: pending,
    installed_packs: packRows.flatMap((pack) => {
      const domainId = text(pack.domain_id);
      const packKey = text(pack.pack_key);
      if (!domainId || !packKey) return [];
      const domain = [...active, ...pending].find((row) => row.id === domainId)?.domain ?? "";
      return [
        {
          domain_id: domainId,
          domain,
          pack_key: packKey,
          license_status: text(pack.license_status) ?? "",
          installed_at: text(pack.installed_at) ?? undefined,
        },
      ];
    }),
    supported_platforms: SUPPORTED_PLATFORMS,
    store_route: "/app/store",
    domain_license_product_route: "/app/store/additional_domain_license",
  };
}

export function companionDomainContextFromCenter(center: DomainLicenseCenter) {
  if (!center.found) return { found: false };
  const domains = [...(center.active_domains ?? []), ...(center.pending_domains ?? [])].map((row) => ({
    domain_id: row.id,
    domain: row.domain,
    display_name: row.display_name,
    domain_status: row.domain_status,
    connected_platform: row.connected_platform,
    is_primary: row.is_primary === true,
    license_status: row.license_status,
  }));
  return {
    found: true,
    principle: "Companion understands domain context for pack installation.",
    domains,
    store_route: center.store_route ?? "/app/store",
    example_flow: ["marketplace", "select_pack", "select_domain", "install"],
  };
}
