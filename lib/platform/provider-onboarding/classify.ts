import {
  parseCoreProviderOnboardingContract,
  type CoreProviderOnboardingParseFailure,
  type CoreProviderOnboardingMode,
  type CoreProviderReadinessLevel,
  type CoreProviderSupportLevel,
} from "@/lib/app-portal/integrations/onboarding";

export type ProviderAdminKind =
  | "production"
  | "reference"
  | "placeholder"
  | "malformed"
  | "deprecated";

/** Localized UI statuses — never raw enums. */
export type ProviderAdminStatus =
  | "active"
  | "production_ready"
  | "preview"
  | "development"
  | "not_available_yet"
  | "blocked"
  | "contract_required"
  | "contract_invalid"
  | "deprecated"
  | "reference_only";

export type PlatformProviderListRow = {
  provider_key: string;
  display_name: string;
  is_available: boolean;
  category?: string | null;
  has_onboarding_contract?: boolean;
  has_presentation_contract?: boolean;
  onboarding_mode?: string | null;
  readiness_level?: string | null;
  support_level?: string | null;
  implementation_owner?: string | null;
  distribution_channel?: string | null;
  install_target?: string | null;
};

export type ClassifiedProvider = {
  row: PlatformProviderListRow;
  kind: ProviderAdminKind;
  status: ProviderAdminStatus;
  parseCode?: CoreProviderOnboardingParseFailure | "missing_contract";
  parseDetail?: string;
  onboardingMode?: CoreProviderOnboardingMode | null;
  readiness?: CoreProviderReadinessLevel | null;
  support?: CoreProviderSupportLevel | null;
  isReference: boolean;
  isContractPresent: boolean;
  isContractValid: boolean | null;
};

export function classifyProviderListRow(
  row: PlatformProviderListRow,
  onboardingContract?: unknown
): ClassifiedProvider {
  const isReference =
    (row.category ?? "").toLowerCase() === "reference" ||
    /reference/i.test(row.display_name);

  const isContractPresent = Boolean(
    row.has_onboarding_contract ||
      (onboardingContract &&
        typeof onboardingContract === "object" &&
        Object.keys(onboardingContract as object).length > 0)
  );

  if (!isContractPresent) {
    return {
      row,
      kind: isReference ? "reference" : "placeholder",
      status: isReference ? "reference_only" : "contract_required",
      parseCode: "missing_contract",
      onboardingMode: null,
      readiness: null,
      support: null,
      isReference,
      isContractPresent: false,
      isContractValid: null,
    };
  }

  const parsed = onboardingContract
    ? parseCoreProviderOnboardingContract(onboardingContract, {
        expectedProviderKey: row.provider_key,
      })
    : null;

  if (parsed && !parsed.ok) {
    return {
      row,
      kind: "malformed",
      status: "contract_invalid",
      parseCode: parsed.code,
      parseDetail: parsed.detail,
      onboardingMode: (row.onboarding_mode as CoreProviderOnboardingMode) ?? null,
      readiness: (row.readiness_level as CoreProviderReadinessLevel) ?? null,
      support: (row.support_level as CoreProviderSupportLevel) ?? null,
      isReference,
      isContractPresent: true,
      isContractValid: false,
    };
  }

  const readiness =
    (parsed?.ok ? parsed.contract.readinessLevel : row.readiness_level) as
      | CoreProviderReadinessLevel
      | null
      | undefined;
  const support = (parsed?.ok
    ? parsed.contract.supportLevel
    : row.support_level) as CoreProviderSupportLevel | null | undefined;
  const mode = (parsed?.ok
    ? parsed.contract.onboardingMode
    : row.onboarding_mode) as CoreProviderOnboardingMode | null | undefined;

  if (isReference) {
    return {
      row,
      kind: "reference",
      status: "reference_only",
      onboardingMode: mode ?? null,
      readiness: readiness ?? "reference_only",
      support: support ?? null,
      isReference: true,
      isContractPresent: true,
      isContractValid: true,
    };
  }

  if (readiness === "deprecated") {
    return {
      row,
      kind: "deprecated",
      status: "deprecated",
      onboardingMode: mode ?? null,
      readiness,
      support: support ?? null,
      isReference: false,
      isContractPresent: true,
      isContractValid: true,
    };
  }

  if (readiness === "blocked" || readiness === "unsupported") {
    return {
      row,
      kind: "production",
      status: "blocked",
      onboardingMode: mode ?? null,
      readiness: readiness ?? null,
      support: support ?? null,
      isReference: false,
      isContractPresent: true,
      isContractValid: true,
    };
  }

  if (!row.is_available) {
    return {
      row,
      kind: "placeholder",
      status: "not_available_yet",
      onboardingMode: mode ?? null,
      readiness: readiness ?? null,
      support: support ?? null,
      isReference: false,
      isContractPresent: true,
      isContractValid: true,
    };
  }

  if (readiness === "preview") {
    return {
      row,
      kind: "production",
      status: "preview",
      onboardingMode: mode ?? null,
      readiness,
      support: support ?? null,
      isReference: false,
      isContractPresent: true,
      isContractValid: true,
    };
  }

  if (readiness === "development") {
    return {
      row,
      kind: "production",
      status: "development",
      onboardingMode: mode ?? null,
      readiness,
      support: support ?? null,
      isReference: false,
      isContractPresent: true,
      isContractValid: true,
    };
  }

  if (readiness === "production_ready" || readiness === "reference_only") {
    return {
      row,
      kind: "production",
      status: readiness === "reference_only" ? "reference_only" : "production_ready",
      onboardingMode: mode ?? null,
      readiness,
      support: support ?? null,
      isReference: false,
      isContractPresent: true,
      isContractValid: true,
    };
  }

  return {
    row,
    kind: "production",
    status: row.is_available ? "active" : "not_available_yet",
    onboardingMode: mode ?? null,
    readiness: readiness ?? null,
    support: support ?? null,
    isReference: false,
    isContractPresent: true,
    isContractValid: true,
  };
}

export function classifyProviderList(
  rows: PlatformProviderListRow[]
): ClassifiedProvider[] {
  return rows.map((row) => classifyProviderListRow(row));
}

export function actionableContractIssues(
  classified: ClassifiedProvider[]
): ClassifiedProvider[] {
  return classified.filter(
    (item) =>
      item.status === "contract_invalid" || item.status === "contract_required"
  );
}
