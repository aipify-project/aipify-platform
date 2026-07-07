import {
  parseAppOrganizationContext,
  type AppOrganizationContext,
  type AppOrganizationContextState,
} from "@/lib/tenant/resolve-app-organization-context";

export type OrganizationContextSidebarLabels = {
  contextLoading: string;
  contextUnavailable: string;
  organizationMissing: string;
  notAssigned: string;
  statusActive: string;
  statusGrace: string;
  statusPaused: string;
};

export type ProfileOrganizationFallback = {
  companyName: string;
  isPlatform: boolean;
};

export type OrganizationContextFetchResult =
  | { ok: true; context: AppOrganizationContext }
  | { ok: false; reason: "http" | "network" };

export type SidebarOrganizationDisplayPhase =
  | "loading"
  | "ready"
  | "transient_error"
  | "organization_missing";

export type SidebarOrganizationDisplay = {
  phase: SidebarOrganizationDisplayPhase;
  workspaceName: string;
  licensedTo: string;
  planName: string;
  statusLabel: string;
};

const RETRY_DELAYS_MS = [0, 350, 900] as const;

const ADMIN_ORG_ROLES = new Set(["owner", "admin", "administrator", "organization_owner"]);

export function isRealOrganizationMissingState(
  state: AppOrganizationContextState | null | undefined,
): boolean {
  return (
    state === "organization_missing" ||
    state === "membership_missing" ||
    state === "user_not_provisioned"
  );
}

export function isTransientOrganizationContext(context: AppOrganizationContext): boolean {
  if (context.state === "database_execution_error") {
    return true;
  }
  if (context.state === "access_denied" && context.has_organization_membership) {
    return true;
  }
  if (
    context.state !== "ready" &&
    !isRealOrganizationMissingState(context.state) &&
    (context.has_customer || context.has_organization_membership)
  ) {
    return true;
  }
  return false;
}

export function hasStableCustomerOrganizationContext(context: AppOrganizationContext): boolean {
  if (isRealOrganizationMissingState(context.state)) {
    return false;
  }
  if (context.state === "ready") {
    return context.has_customer === true || context.has_organization_membership === true;
  }
  return isTransientOrganizationContext(context);
}

/** Company name for sidebar workspace display — includes platform companies. */
export function resolveProfileWorkspaceDisplayFallback(
  profile: ProfileOrganizationFallback | null | undefined,
): string | null {
  const name = profile?.companyName?.trim();
  return name || null;
}

export function hasProfileWorkspaceFallback(
  profile: ProfileOrganizationFallback | null | undefined,
): boolean {
  return resolveProfileWorkspaceDisplayFallback(profile) !== null;
}

/** Customer-org licensed_to pairing only — never used to imply tenant license for platform companies. */
export function resolveProfileOrganizationFallback(
  profile: ProfileOrganizationFallback | null | undefined,
): { workspaceName: string; licensedTo: string } | null {
  if (!profile?.companyName?.trim() || profile.isPlatform) {
    return null;
  }
  const name = profile.companyName.trim();
  return { workspaceName: name, licensedTo: name };
}

export function resolveProfileOnlySidebarDisplay(
  profile: ProfileOrganizationFallback | null | undefined,
  labels: OrganizationContextSidebarLabels,
): SidebarOrganizationDisplay | null {
  const workspaceName = resolveProfileWorkspaceDisplayFallback(profile);
  if (!workspaceName) {
    return null;
  }

  const isPlatform = profile?.isPlatform === true;
  return {
    phase: "ready",
    workspaceName,
    licensedTo: isPlatform ? labels.notAssigned : workspaceName,
    planName: labels.notAssigned,
    statusLabel: isPlatform ? labels.contextUnavailable : labels.statusActive,
  };
}

export function resolveOrganizationWorkspaceName(
  context: AppOrganizationContext,
  profileFallback: ProfileOrganizationFallback | null | undefined,
): string | null {
  const fromContext = context.workspace_name?.trim() || context.licensed_to?.trim() || null;
  if (fromContext) {
    return fromContext;
  }
  return resolveProfileOrganizationFallback(profileFallback)?.workspaceName ?? null;
}

export function resolveOrganizationLicensedTo(
  context: AppOrganizationContext,
  profileFallback: ProfileOrganizationFallback | null | undefined,
): string | null {
  const fromContext = context.licensed_to?.trim() || context.workspace_name?.trim() || null;
  if (fromContext) {
    return fromContext;
  }
  return resolveProfileOrganizationFallback(profileFallback)?.licensedTo ?? null;
}

export function resolveOrganizationStatusLabel(
  context: AppOrganizationContext,
  labels: Pick<
    OrganizationContextSidebarLabels,
    "organizationMissing" | "statusActive" | "statusGrace" | "statusPaused"
  >,
): string {
  if (isRealOrganizationMissingState(context.state)) {
    return labels.organizationMissing;
  }

  const licenseStatus = context.license_status?.trim();
  if (licenseStatus === "grace_period") {
    return labels.statusGrace;
  }
  if (licenseStatus === "paused") {
    return labels.statusPaused;
  }
  if (licenseStatus === "active") {
    return labels.statusActive;
  }
  if (context.state === "subscription_inactive") {
    return labels.statusPaused;
  }
  if (context.has_customer || context.has_organization_membership) {
    return labels.statusActive;
  }
  return labels.organizationMissing;
}

export function resolveSidebarOrganizationDisplay(input: {
  phase: SidebarOrganizationDisplayPhase;
  context: AppOrganizationContext | null;
  profileFallback: ProfileOrganizationFallback | null | undefined;
  labels: OrganizationContextSidebarLabels;
}): SidebarOrganizationDisplay {
  const { phase, context, profileFallback, labels } = input;

  if (phase === "loading") {
    return {
      phase,
      workspaceName: labels.contextLoading,
      licensedTo: labels.contextLoading,
      planName: labels.contextLoading,
      statusLabel: labels.contextLoading,
    };
  }

  if (phase === "transient_error") {
    const profileOnly = resolveProfileOnlySidebarDisplay(profileFallback, labels);
    if (profileOnly) {
      return {
        ...profileOnly,
        phase: "transient_error",
        statusLabel: labels.contextUnavailable,
      };
    }
    return {
      phase,
      workspaceName: labels.contextUnavailable,
      licensedTo: labels.contextUnavailable,
      planName: labels.contextUnavailable,
      statusLabel: labels.contextUnavailable,
    };
  }

  if (phase === "organization_missing") {
    return {
      phase: "organization_missing",
      workspaceName: labels.organizationMissing,
      licensedTo: labels.organizationMissing,
      planName: labels.notAssigned,
      statusLabel: labels.organizationMissing,
    };
  }

  if (!context) {
    const profileOnly = resolveProfileOnlySidebarDisplay(profileFallback, labels);
    if (profileOnly) {
      return profileOnly;
    }
    return {
      phase: "organization_missing",
      workspaceName: labels.organizationMissing,
      licensedTo: labels.organizationMissing,
      planName: labels.notAssigned,
      statusLabel: labels.organizationMissing,
    };
  }

  const workspaceName = resolveOrganizationWorkspaceName(context, profileFallback);
  const licensedTo = resolveOrganizationLicensedTo(context, profileFallback);
  const planName = context.plan_name?.trim() || labels.notAssigned;

  return {
    phase: "ready",
    workspaceName: workspaceName ?? labels.organizationMissing,
    licensedTo: licensedTo ?? labels.organizationMissing,
    planName,
    statusLabel: resolveOrganizationStatusLabel(context, labels),
  };
}

export function resolveSidebarPhaseAfterFetch(input: {
  fetchResult: OrganizationContextFetchResult;
  context: AppOrganizationContext | null;
  profileFallback: ProfileOrganizationFallback | null | undefined;
}): SidebarOrganizationDisplayPhase {
  const { fetchResult, context, profileFallback } = input;

  if (!fetchResult.ok || !context) {
    return hasProfileWorkspaceFallback(profileFallback) ? "ready" : "transient_error";
  }

  if (isRealOrganizationMissingState(context.state)) {
    return "organization_missing";
  }

  if (hasStableCustomerOrganizationContext(context)) {
    return "ready";
  }

  return hasProfileWorkspaceFallback(profileFallback) ? "ready" : "transient_error";
}

export type DomainLicenseCenterLoadFailureKind = "admin_required" | "load_failed";

const DOMAIN_ADMIN_DENIED_PATTERNS = [
  /owner or admin role required/i,
  /admin.?tilgang/i,
  /administrator.?rolle/i,
  /administrator.?tilgang/i,
  /eier- eller administrator/i,
];

function readApiErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return null;
  }
  const error = (body as Record<string, unknown>).error;
  return typeof error === "string" && error.trim() ? error.trim() : null;
}

export function classifyDomainLicenseCenterFetchFailure(
  status: number,
  body: unknown,
): DomainLicenseCenterLoadFailureKind {
  const message = readApiErrorMessage(body) ?? "";
  const probe = `${message} ${status}`;
  if (DOMAIN_ADMIN_DENIED_PATTERNS.some((pattern) => pattern.test(probe))) {
    return "admin_required";
  }
  if ((status === 401 || status === 403) && message.length > 0) {
    return "admin_required";
  }
  return "load_failed";
}

export function shouldRetryOrganizationContextFetch(input: {
  fetchResult: OrganizationContextFetchResult;
  context: AppOrganizationContext | null;
  attemptIndex: number;
  maxAttempts: number;
}): boolean {
  if (input.attemptIndex >= input.maxAttempts - 1) {
    return false;
  }
  if (!input.fetchResult.ok || !input.context) {
    return true;
  }
  return isTransientOrganizationContext(input.context);
}

export async function fetchOrganizationContextWithRetry(input: {
  fetchImpl?: typeof fetch;
  maxAttempts?: number;
} = {}): Promise<{
  fetchResult: OrganizationContextFetchResult;
  context: AppOrganizationContext | null;
}> {
  const fetchImpl = input.fetchImpl ?? fetch;
  const maxAttempts = input.maxAttempts ?? RETRY_DELAYS_MS.length;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const delay = RETRY_DELAYS_MS[attempt] ?? RETRY_DELAYS_MS.at(-1)!;
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const response = await fetchImpl("/api/app/organization-context", { cache: "no-store" });
      if (!response.ok) {
        if (
          shouldRetryOrganizationContextFetch({
            fetchResult: { ok: false, reason: "http" },
            context: null,
            attemptIndex: attempt,
            maxAttempts,
          })
        ) {
          continue;
        }
        return { fetchResult: { ok: false, reason: "http" }, context: null };
      }

      const context = parseAppOrganizationContext(await response.json());
      const fetchResult: OrganizationContextFetchResult = { ok: true, context };
      if (
        shouldRetryOrganizationContextFetch({
          fetchResult,
          context,
          attemptIndex: attempt,
          maxAttempts,
        })
      ) {
        continue;
      }
      return { fetchResult, context };
    } catch {
      if (attempt >= maxAttempts - 1) {
        return { fetchResult: { ok: false, reason: "network" }, context: null };
      }
    }
  }

  return { fetchResult: { ok: false, reason: "network" }, context: null };
}

export function isAdminOrganizationRole(role: string | null | undefined): boolean {
  if (!role) {
    return false;
  }
  return ADMIN_ORG_ROLES.has(role.toLowerCase());
}

export function shouldCacheOrganizationSidebarContext(context: AppOrganizationContext): boolean {
  return (
    context.state === "ready" &&
    Boolean(context.workspace_name?.trim() || context.licensed_to?.trim()) &&
    (context.has_customer === true || context.has_organization_membership === true)
  );
}
