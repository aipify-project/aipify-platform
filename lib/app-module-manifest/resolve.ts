import type { AppMenuCapabilityBundle } from "@/lib/core/app-menu-capability";
import { getVisibleCapabilityIds } from "@/lib/core/app-menu-capability";
import { APP_SOFTWARE_MODULE_MANIFESTS } from "./registry";
import type {
  ModuleEntitlementState,
  ModuleManifest,
  ResolvedModuleAccess,
} from "./types";

export type ResolveModuleAccessInput = {
  bundle: AppMenuCapabilityBundle;
  /** Server-verified partner identity (CSP approved/active/certified). */
  salesPartnerAuthorized?: boolean;
  /** Optional setup signals — never invent; omit when unknown. */
  webNeedsSetup?: boolean;
};

function readinessBlocksAccess(manifest: ModuleManifest): boolean {
  return manifest.readiness === "hidden" || manifest.readiness === "inactive";
}

function stateForTenantModule(
  entitled: boolean,
  needsSetup: boolean | undefined
): ModuleEntitlementState {
  if (!entitled) return "not_entitled";
  if (needsSetup === true) return "setup_required";
  return "active";
}

/**
 * Resolve which software modules the organization may see in Mine Produkter / dashboard.
 * Capability ids remain the sole menu allowlist for route children.
 */
export function resolveSoftwareModuleAccess(
  input: ResolveModuleAccessInput
): ResolvedModuleAccess[] {
  const allowed = getVisibleCapabilityIds(input.bundle);

  return APP_SOFTWARE_MODULE_MANIFESTS.map((manifest) => {
    if (readinessBlocksAccess(manifest)) {
      return {
        moduleKey: manifest.moduleKey,
        entitled: false,
        state: "not_ready" as const,
        openHref: null,
      };
    }

    if (manifest.accessPolicy === "partner_identity") {
      const entitled = input.salesPartnerAuthorized === true;
      return {
        moduleKey: manifest.moduleKey,
        entitled,
        state: entitled
          ? ("active" as const)
          : input.salesPartnerAuthorized === false
            ? ("not_entitled" as const)
            : ("unknown" as const),
        openHref: entitled ? manifest.canonicalRoute : null,
      };
    }

    if (manifest.accessPolicy === "tenant_module") {
      const primaryNavIds = manifest.menuChildren
        .filter((c) => c.primaryNav !== false)
        .map((c) => c.navId);
      const entitled = primaryNavIds.some((id) => allowed.has(id));
      return {
        moduleKey: manifest.moduleKey,
        entitled,
        state: stateForTenantModule(
          entitled,
          manifest.moduleKey === "website_kompis" ? input.webNeedsSetup : undefined
        ),
        openHref: entitled ? manifest.canonicalRoute : null,
      };
    }

    return {
      moduleKey: manifest.moduleKey,
      entitled: false,
      state: "not_entitled",
      openHref: null,
    };
  });
}

export function entitledSoftwareModules(
  input: ResolveModuleAccessInput
): ModuleManifest[] {
  const resolved = resolveSoftwareModuleAccess(input);
  const entitledKeys = new Set(
    resolved.filter((r) => r.entitled).map((r) => r.moduleKey)
  );
  return APP_SOFTWARE_MODULE_MANIFESTS.filter((m) => entitledKeys.has(m.moduleKey));
}
