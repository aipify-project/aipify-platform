/**
 * Read-only documentation of the existing purchase / activation chain.
 * V1 does not orchestrate mutations — APP review only navigates to existing surfaces.
 */

export type PurchaseChainStepStatus =
  | "operational"
  | "partial"
  | "missing"
  | "duplicate"
  | "unsafe";

export type PurchaseChainStep = {
  id: string;
  layer: "UI" | "API" | "service" | "RPC" | "state" | "nav";
  description: string;
  path: string;
  status: PurchaseChainStepStatus;
};

/**
 * Canonical intended flow (Platform → Core → APP):
 * APP review → Platform subscription change → commercial approval →
 * Core entitlement / activation gate → license receipt → menu refresh
 */
export const PURCHASE_ACTIVATION_CHAIN: readonly PurchaseChainStep[] = [
  {
    id: "package_review_ui",
    layer: "UI",
    description: "Customer reviews package / pack details",
    path: "/app/settings/billing/packages · /app/marketplace/packs/[packKey] · /app/software",
    status: "partial",
  },
  {
    id: "package_upgrade_api",
    layer: "API",
    description: "Package upgrade / provider checkout paths",
    path: "PackageAccessCenterPanel → payment provider upgrade flow",
    status: "partial",
  },
  {
    id: "business_pack_license_action",
    layer: "RPC",
    description: "Business pack license action",
    path: "perform_business_pack_license_action",
    status: "operational",
  },
  {
    id: "commercial_approval",
    layer: "state",
    description: "Explicit owner/admin commercial approval before activation",
    path: "Trust & Action / pack license confirmation (fragmented)",
    status: "partial",
  },
  {
    id: "activation_gate",
    layer: "RPC",
    description: "Atomic pack activation gate",
    path: "run_business_pack_activation_gate · get_organization_business_pack_activation_gates",
    status: "operational",
  },
  {
    id: "module_activation",
    layer: "RPC",
    description: "Activate business pack modules / tenant_modules",
    path: "activate_business_pack_modules",
    status: "operational",
  },
  {
    id: "license_receipt",
    layer: "RPC",
    description: "License center reflects subscription / pack capacity",
    path: "get_customer_license_center",
    status: "operational",
  },
  {
    id: "menu_refresh",
    layer: "nav",
    description: "Canonical nav filtered by readiness + feature + permission + pack gates",
    path: "loadAppMenuCapabilityBundle · presentAppNavFromCapabilities",
    status: "partial",
  },
  {
    id: "invoice_platform",
    layer: "state",
    description: "Platform owns invoices — APP must not create; billing_history is not invoice list",
    path: "Platform billing (not APP)",
    status: "missing",
  },
] as const;

export function summarizePurchaseActivationChain(): {
  operational: number;
  partial: number;
  missing: number;
  duplicate: number;
  unsafe: number;
} {
  const counts = { operational: 0, partial: 0, missing: 0, duplicate: 0, unsafe: 0 };
  for (const step of PURCHASE_ACTIVATION_CHAIN) {
    counts[step.status] += 1;
  }
  return counts;
}
