/**
 * Core-owned Customer APP menu capability contract.
 * No customer labels or icons — presentation belongs to APP.
 */

export type AppCapabilityState =
  | "active"
  | "included"
  | "pending"
  | "available"
  | "revoked"
  | "disabled"
  | "foundation";

export type AppMenuCapability = {
  capabilityId: string;
  state: AppCapabilityState;
  visibleInNavigation: boolean;
  usable: boolean;
  /** Internal diagnostics only — never render in customer UI. */
  reasonCode?: string;
};

export type AppMenuCapabilityBundle = {
  organizationId: string;
  userId: string;
  role: string;
  version: string;
  capabilities: AppMenuCapability[];
  generatedAt: string;
};

export type AppMenuCapabilityLoadContext = {
  organizationId: string | null;
  userId: string | null;
  role: string | null;
  featureEnabled: Map<string, boolean>;
  permissionGranted: Map<string, boolean>;
  activePackKeys: Set<string>;
  pendingPackKeys: Set<string>;
  revokedPackKeys: Set<string>;
  activeModuleKeys: Set<string>;
};
