import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseRuntimeStatusRpc } from "@/lib/customer-website-runtime/parse";
import { resolveWebsiteCmsContext } from "@/lib/website-cms/context";
import {
  dedupeWebsiteSeoFindings,
  presentWebsiteDraftRows,
  resolvePublishCapabilityPresentation,
  resolveRuntimeBusinessStatus,
  type PublishCapabilityPresentation,
  type RuntimeBusinessStatus,
  type WebsiteDraftPresentationRow,
  type WebsiteSeoFinding,
  buildSeoFindingDedupeKey,
} from "./website-presentation";
import { resolveKompisWebsiteContext, type KompisWebsiteContext } from "./website-context";
import {
  buildWebsiteContentQualityAudit,
  buildWebsiteLocaleCoverage,
  buildWebsiteSeoAudit,
  listWebsiteDraftPages,
} from "./website-ops";
import { KOMPIS_OPERATOR_TOOL_REGISTRY } from "./tools-registry";

export type AuthoritativeWebsiteRuntimeSlice = {
  available: boolean;
  websiteProvisioned: boolean;
  runtimeEnabled: boolean;
  homepageEnabled: boolean;
  mountedPaths: string[];
  activeVersionNumber: number | null;
  manifestChecksum: string | null;
  dbPublished: boolean;
  acknowledgementStatus: string | null;
  httpStatus: string | null;
  lastOperationStatus: string | null;
  fullyVerified: boolean;
  lastFullyVerifiedAt: string | null;
  businessStatus: RuntimeBusinessStatus;
};

export type AuthoritativeWebsiteWorkspaceView = {
  context: KompisWebsiteContext;
  runtime: AuthoritativeWebsiteRuntimeSlice;
  drafts: WebsiteDraftPresentationRow[];
  seoFindings: WebsiteSeoFinding[];
  qualityFindingCount: number;
  localeCoverage: ReturnType<typeof buildWebsiteLocaleCoverage>;
  publish: {
    code: PublishCapabilityPresentation;
    blockers: string[];
    /** True when CMS + delivery allow a publish attempt (still may require CORE.APPROVAL). */
    mechanismAvailable: boolean;
  };
  actions: {
    buildCandidateAllowed: boolean;
    publishAllowed: boolean;
    rollbackAllowed: boolean;
    blockReasons: string[];
  };
  consistency: {
    ok: boolean;
    issues: string[];
  };
  tools: {
    available: Array<{ key: string; version: string; riskClass: number; kind: string }>;
    unavailable: Array<{ key: string; version: string; reason: string }>;
  };
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

async function loadRuntimeSlice(
  supabase: SupabaseClient,
): Promise<AuthoritativeWebsiteRuntimeSlice> {
  const { data, error } = await supabase.rpc("get_customer_website_runtime_status");
  if (error || !data) {
    return {
      available: false,
      websiteProvisioned: false,
      runtimeEnabled: false,
      homepageEnabled: false,
      mountedPaths: [],
      activeVersionNumber: null,
      manifestChecksum: null,
      dbPublished: false,
      acknowledgementStatus: null,
      httpStatus: null,
      lastOperationStatus: null,
      fullyVerified: false,
      lastFullyVerifiedAt: null,
      businessStatus: "not_configured",
    };
  }
  const parsed = parseRuntimeStatusRpc(data);
  const row = asRecord(data);
  // Harden mounted paths when RPC encodes arrays oddly.
  let mountedPaths = parsed.mountedPaths;
  if (mountedPaths.length === 0 && row.mounted_paths != null) {
    const raw = row.mounted_paths;
    if (Array.isArray(raw)) {
      mountedPaths = raw.filter((item): item is string => typeof item === "string");
    } else if (typeof raw === "string") {
      try {
        const parsedJson = JSON.parse(raw) as unknown;
        if (Array.isArray(parsedJson)) {
          mountedPaths = parsedJson.filter((item): item is string => typeof item === "string");
        } else if (raw.startsWith("/")) {
          mountedPaths = [raw];
        }
      } catch {
        if (raw.startsWith("/")) mountedPaths = [raw];
      }
    }
  }
  const businessStatus = resolveRuntimeBusinessStatus({
    websiteProvisioned: parsed.websiteProvisioned,
    mountedPaths,
    activeVersionNumber: parsed.activeVersionNumber,
    acknowledgementStatus: parsed.acknowledgementStatus,
    httpStatus: parsed.httpStatus,
    fullyVerified: parsed.fullyVerified,
  });
  return {
    available: parsed.available,
    websiteProvisioned: parsed.websiteProvisioned,
    runtimeEnabled: parsed.runtimeEnabled,
    homepageEnabled: parsed.homepageEnabled,
    mountedPaths,
    activeVersionNumber: parsed.activeVersionNumber,
    manifestChecksum: parsed.manifestChecksum,
    dbPublished: parsed.dbPublished,
    acknowledgementStatus: parsed.acknowledgementStatus,
    httpStatus: parsed.httpStatus,
    lastOperationStatus: parsed.lastOperationStatus,
    fullyVerified: parsed.fullyVerified,
    lastFullyVerifiedAt: parsed.lastFullyVerifiedAt,
    businessStatus,
  };
}

/**
 * Single authoritative server-side view for Kompis website workspace.
 * All website tab surfaces must consume this — no parallel client truths.
 */
export async function buildAuthoritativeWebsiteWorkspaceView(
  supabase: SupabaseClient,
): Promise<AuthoritativeWebsiteWorkspaceView> {
  const [context, runtime, cms, listed] = await Promise.all([
    resolveKompisWebsiteContext(supabase),
    loadRuntimeSlice(supabase),
    resolveWebsiteCmsContext(supabase),
    listWebsiteDraftPages(supabase, 50),
  ]);

  const drafts = presentWebsiteDraftRows(listed.pages);
  const seoRaw = buildWebsiteSeoAudit({ context, pages: listed.pages });
  const seoFindings = dedupeWebsiteSeoFindings(
    seoRaw.findings.map((finding) => {
      const page = listed.pages.find((p) => p.id === finding.pageId);
      const locale = typeof page?.locale === "string" ? page.locale : null;
      const revision = page?.version ?? null;
      return {
        code: finding.code,
        severity: finding.severity,
        pageId: finding.pageId,
        locale,
        revision: typeof revision === "number" || typeof revision === "string" ? revision : null,
        dedupeKey: buildSeoFindingDedupeKey({
          code: finding.code,
          pageId: finding.pageId,
          locale,
          revision: typeof revision === "number" || typeof revision === "string" ? revision : null,
        }),
      };
    }),
  );
  const quality = buildWebsiteContentQualityAudit(listed.pages);
  const localeCoverage = buildWebsiteLocaleCoverage(listed.pages);

  const websiteTools = KOMPIS_OPERATOR_TOOL_REGISTRY.filter((tool) => tool.category === "website");
  const publishToolAllowed = websiteTools.some(
    (tool) => tool.key === "website_publish_approved_draft" && tool.available,
  );

  const conflictingOperation =
    runtime.lastOperationStatus === "pending_verification" ||
    runtime.lastOperationStatus === "pending_runtime" ||
    runtime.lastOperationStatus === "executing";

  const publish = resolvePublishCapabilityPresentation({
    organizationReady: Boolean(context.organizationId),
    appAccessValid: context.appLicenseActive,
    websiteKompisEntitled: context.websiteKompisCapability,
    canonicalDeliveryValid: context.deliveryActive && context.acknowledgementOk,
    websiteExists: Boolean(cms.website) || runtime.websiteProvisioned,
    domainInstallationValid: Boolean(context.primaryDomain) && Boolean(context.installationId),
    hasMountedPath: runtime.mountedPaths.length > 0,
    publishToolAllowed,
    cmsPublishContractAvailable: Boolean(cms.website) && cms.capabilities.publishCapability,
    conflictingOperation,
    expectedCurrentVersionAvailable:
      Boolean(cms.currentVersion) || runtime.activeVersionNumber != null,
    approvalContractAvailable: true,
    coreApprovalRequired: true,
  });

  const consistencyIssues: string[] = [];
  if (cms.website && !runtime.websiteProvisioned && runtime.available) {
    consistencyIssues.push("cms_website_without_runtime_row");
  }
  if (
    runtime.activeVersionNumber != null &&
    cms.currentVersion &&
    cms.currentVersion.versionNumber !== runtime.activeVersionNumber
  ) {
    consistencyIssues.push("current_version_mismatch");
  }
  if (context.publishCapability && publish.code === "publish_not_configured") {
    consistencyIssues.push("parallel_publish_capability_mismatch");
  }

  const stateInconsistent = consistencyIssues.length > 0 || !runtime.available;
  const blockReasons: string[] = [];
  if (stateInconsistent) blockReasons.push("authoritative_state_inconsistent");
  if (drafts.length === 0) blockReasons.push("no_approved_drafts");
  if (publish.code === "publish_not_configured" || publish.code === "publish_temporarily_blocked") {
    blockReasons.push(...publish.blockers);
  }
  if (runtime.businessStatus === "not_configured" || runtime.businessStatus === "verification_failed") {
    blockReasons.push("runtime_requires_attention");
  }

  const mechanismAvailable =
    publish.code === "ready_for_publish" || publish.code === "publish_requires_approval";

  return {
    context: {
      ...context,
      // Prefer runtime-authoritative version / publish timestamps when present.
      currentVersion:
        runtime.activeVersionNumber != null
          ? `v${runtime.activeVersionNumber}`
          : context.currentVersion,
      lastPublishAt: context.lastPublishAt,
      publishCapability: mechanismAvailable,
      publishUnavailableReason:
        publish.code === "ready_for_publish" || publish.code === "publish_requires_approval"
          ? null
          : publish.blockers[0] ?? "publish_not_ready",
    },
    runtime,
    drafts,
    seoFindings,
    qualityFindingCount: quality.findingCount,
    localeCoverage,
    publish: {
      code: publish.code,
      blockers: publish.blockers,
      mechanismAvailable,
    },
    actions: {
      buildCandidateAllowed: !stateInconsistent && drafts.length > 0 && Boolean(cms.website),
      publishAllowed: mechanismAvailable && !stateInconsistent && !conflictingOperation,
      rollbackAllowed:
        context.rollbackCapability &&
        runtime.activeVersionNumber != null &&
        !stateInconsistent &&
        !conflictingOperation,
      blockReasons,
    },
    consistency: {
      ok: !stateInconsistent,
      issues: consistencyIssues,
    },
    tools: {
      available: websiteTools
        .filter((tool) => tool.available)
        .map((tool) => ({
          key: tool.key,
          version: tool.version,
          riskClass: tool.riskClass,
          kind: tool.kind,
        })),
      unavailable: websiteTools
        .filter((tool) => !tool.available)
        .map((tool) => ({
          key: tool.key,
          version: tool.version,
          reason: tool.unavailableReason ?? "unavailable",
        })),
    },
  };
}
