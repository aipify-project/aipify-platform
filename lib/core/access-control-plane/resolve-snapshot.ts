import type { AppProductContextId } from "@/lib/app-portal/product-context/constants";
import {
  ACCESS_CAPABILITY_CATALOG,
  KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY,
  isReservedHiddenCapability,
} from "./capability-catalog";
import { createAccessCorrelationId } from "./correlation";
import {
  evaluateActivationGate,
  isLicenseServiceUsable,
  isSubscriptionUsable,
} from "./activation-gate";
import {
  KOMPIS_BEDRIFT_DENIED_SENTINEL,
  KOMPIS_BEDRIFT_MODULE_KEY,
} from "./tenant-module-lookup";
import type {
  AccessControlPlaneSnapshot,
  AccessLicenseServiceStatus,
  AccessModuleView,
  AccessProductContextView,
  AccessReasonCode,
  AccessSubscriptionStatus,
} from "./types";

export type ResolveAccessControlPlaneInput = {
  organizationId: string | null;
  customerId: string | null;
  userId: string | null;
  role: string | null;
  membershipValid: boolean;
  subscriptionStatus: AccessSubscriptionStatus;
  licenseServiceStatus: AccessLicenseServiceStatus;
  /**
   * tenant_modules truth for the authenticated tenant only:
   * - `website_kompis` / `kompis_bedrift` → that module is explicitly enabled
   * - `__website_kompis_denied__` / `__kompis_bedrift_denied__` → explicit inactive/missing false
   * - neither → unknown (fail closed). Membership never implies Bedrift.
   */
  activeModuleKeys: ReadonlySet<string>;
  /**
   * Optional override from a trusted loader. `true` enables only when the denied
   * sentinel is absent. `false`, null, and omission do not enable Bedrift.
   */
  bedriftModuleEnabled?: boolean | null;
  correlationId?: string;
  generatedAt?: string;
};

function mapWebProduct(
  input: ResolveAccessControlPlaneInput,
  licenseOk: boolean,
  subscriptionOk: boolean
): AccessProductContextView {
  if (!input.membershipValid) {
    return {
      productId: "kompisWeb",
      status: "unavailable",
      authorized: false,
      reasonCode: "membership_missing",
      moduleKey: "website_kompis",
    };
  }
  if (input.activeModuleKeys.has("__website_kompis_denied__")) {
    return {
      productId: "kompisWeb",
      status: "unavailable",
      authorized: false,
      reasonCode: "product_not_entitled",
      moduleKey: "website_kompis",
    };
  }
  if (!input.activeModuleKeys.has("website_kompis")) {
    return {
      productId: "kompisWeb",
      status: "conflict",
      authorized: false,
      reasonCode: "module_status_unknown",
      moduleKey: "website_kompis",
    };
  }
  // Explicit pause blocks; unknown license still allows Web when module is explicitly enabled.
  if (input.licenseServiceStatus === "paused") {
    return {
      productId: "kompisWeb",
      status: "suspended",
      authorized: false,
      reasonCode: "license_paused",
      moduleKey: "website_kompis",
    };
  }
  if (
    input.subscriptionStatus === "cancelled" ||
    input.subscriptionStatus === "expired"
  ) {
    return {
      productId: "kompisWeb",
      status: input.subscriptionStatus === "expired" ? "expired" : "cancelled",
      authorized: false,
      reasonCode: "subscription_invalid",
      moduleKey: "website_kompis",
    };
  }

  const gate = evaluateActivationGate({
    paymentOrContractValid: subscriptionOk || input.subscriptionStatus === "unknown",
    subscriptionValid: subscriptionOk || input.subscriptionStatus === "unknown",
    licenseValid: licenseOk || input.licenseServiceStatus === "unknown",
    moduleAssignmentValid: true,
    tenantProductValid: true,
    runtimeCapabilityReady: true,
  });

  return {
    productId: "kompisWeb",
    status: gate.open ? "active" : "pending",
    authorized: gate.open,
    reasonCode:
      gate.open && input.licenseServiceStatus === "unknown" ? "license_unknown" : gate.reasonCode,
    moduleKey: "website_kompis",
  };
}

/** Explicit Core row only. Missing, inactive, ambiguous, or lookup-unknown stays closed. */
export function isKompisBedriftExplicitlyEnabled(
  input: Pick<ResolveAccessControlPlaneInput, "activeModuleKeys" | "bedriftModuleEnabled">
): boolean {
  if (input.activeModuleKeys.has(KOMPIS_BEDRIFT_DENIED_SENTINEL)) return false;
  if (input.bedriftModuleEnabled === false) return false;
  if (input.bedriftModuleEnabled === true) return true;
  return input.activeModuleKeys.has(KOMPIS_BEDRIFT_MODULE_KEY);
}

function mapBedriftProduct(
  input: ResolveAccessControlPlaneInput,
  licenseOk: boolean,
  subscriptionOk: boolean
): AccessProductContextView {
  if (!input.membershipValid) {
    return {
      productId: "kompisBedrift",
      status: "unavailable",
      authorized: false,
      reasonCode: "membership_missing",
      moduleKey: "kompis_bedrift",
    };
  }
  if (!isKompisBedriftExplicitlyEnabled(input)) {
    return {
      productId: "kompisBedrift",
      status: "unavailable",
      authorized: false,
      reasonCode:
        input.bedriftModuleEnabled === false ||
        input.activeModuleKeys.has(KOMPIS_BEDRIFT_DENIED_SENTINEL)
          ? "product_not_entitled"
          : "module_status_unknown",
      moduleKey: "kompis_bedrift",
    };
  }
  if (input.licenseServiceStatus === "paused") {
    return {
      productId: "kompisBedrift",
      status: "suspended",
      authorized: false,
      reasonCode: "license_paused",
      moduleKey: "kompis_bedrift",
    };
  }
  if (
    input.subscriptionStatus === "cancelled" ||
    input.subscriptionStatus === "expired"
  ) {
    return {
      productId: "kompisBedrift",
      status: input.subscriptionStatus === "expired" ? "expired" : "cancelled",
      authorized: false,
      reasonCode: "subscription_invalid",
      moduleKey: "kompis_bedrift",
    };
  }

  const gate = evaluateActivationGate({
    paymentOrContractValid: subscriptionOk || input.subscriptionStatus === "unknown",
    subscriptionValid: subscriptionOk || input.subscriptionStatus === "unknown",
    licenseValid: licenseOk || input.licenseServiceStatus === "unknown",
    moduleAssignmentValid: true,
    tenantProductValid: true,
    runtimeCapabilityReady: true,
  });

  return {
    productId: "kompisBedrift",
    status: gate.open ? "active" : "pending",
    authorized: gate.open,
    reasonCode:
      gate.open && input.licenseServiceStatus === "unknown" ? "license_unknown" : gate.reasonCode,
    moduleKey: "kompis_bedrift",
  };
}

function resolveModules(
  input: ResolveAccessControlPlaneInput,
  products: AccessProductContextView[]
): AccessModuleView[] {
  const webOk = products.find((p) => p.productId === "kompisWeb")?.authorized === true;
  const bedriftOk = products.find((p) => p.productId === "kompisBedrift")?.authorized === true;

  return ACCESS_CAPABILITY_CATALOG.map((entry) => {
    if (entry.capabilityKey === KOMPIS_DESIGN_STUDIO_CAPABILITY_KEY) {
      return {
        capabilityKey: entry.capabilityKey,
        kind: entry.kind,
        lifecycle: "hidden_reserved",
        visible: false,
        usable: false,
        reasonCode: "reserved_capability_hidden" as AccessReasonCode,
        products: [...entry.products],
      };
    }

    if (entry.capabilityKey === "website_kompis") {
      const assigned = input.activeModuleKeys.has("website_kompis");
      const denied = input.activeModuleKeys.has("__website_kompis_denied__");
      const gate = evaluateActivationGate({
        paymentOrContractValid: isSubscriptionUsable(input.subscriptionStatus),
        subscriptionValid: isSubscriptionUsable(input.subscriptionStatus),
        licenseValid: isLicenseServiceUsable(input.licenseServiceStatus),
        moduleAssignmentValid: assigned && !denied,
        tenantProductValid: webOk || assigned,
        runtimeCapabilityReady: assigned && !denied,
      });
      return {
        capabilityKey: entry.capabilityKey,
        kind: entry.kind,
        lifecycle: gate.open ? "active" : denied ? "inactive" : assigned ? "pending_provisioning" : "inactive",
        visible: gate.open,
        usable: gate.open,
        reasonCode: gate.open ? "ok" : denied ? "module_inactive" : "module_status_unknown",
        products: [...entry.products],
      };
    }

    if (entry.capabilityKey === "kompis_bedrift") {
      const assigned = isKompisBedriftExplicitlyEnabled(input) && input.membershipValid;
      const gate = evaluateActivationGate({
        paymentOrContractValid: isSubscriptionUsable(input.subscriptionStatus),
        subscriptionValid: isSubscriptionUsable(input.subscriptionStatus),
        licenseValid: isLicenseServiceUsable(input.licenseServiceStatus),
        moduleAssignmentValid: assigned,
        tenantProductValid: bedriftOk,
        runtimeCapabilityReady: assigned,
      });
      return {
        capabilityKey: entry.capabilityKey,
        kind: entry.kind,
        lifecycle: gate.open ? "active" : "inactive",
        visible: gate.open,
        usable: gate.open,
        reasonCode: gate.open ? "ok" : "module_inactive",
        products: [...entry.products],
      };
    }

    return {
      capabilityKey: entry.capabilityKey,
      kind: entry.kind,
      lifecycle: entry.defaultLifecycle,
      visible: false,
      usable: false,
      reasonCode: isReservedHiddenCapability(entry.capabilityKey)
        ? "reserved_capability_hidden"
        : "module_inactive",
      products: [...entry.products],
    };
  });
}

/** Pure snapshot builder — authoritative APP/Platform read contract. */
export function resolveAccessControlPlaneSnapshot(
  input: ResolveAccessControlPlaneInput
): AccessControlPlaneSnapshot {
  const licenseOk = isLicenseServiceUsable(input.licenseServiceStatus);
  const subscriptionOk = isSubscriptionUsable(input.subscriptionStatus);

  const products: AccessProductContextView[] = [
    mapWebProduct(input, licenseOk, subscriptionOk),
    mapBedriftProduct(input, licenseOk, subscriptionOk),
  ];

  const authorizedProductIds = products
    .filter((p) => p.authorized)
    .map((p) => p.productId) as AppProductContextId[];

  return {
    correlationId: input.correlationId ?? createAccessCorrelationId(),
    organizationId: input.organizationId,
    customerId: input.customerId,
    userId: input.userId,
    role: input.role,
    membershipValid: input.membershipValid,
    subscriptionStatus: input.subscriptionStatus,
    licenseServiceStatus: input.licenseServiceStatus,
    products,
    modules: resolveModules(input, products),
    authorizedProductIds,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
  };
}
