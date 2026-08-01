import type { CoreAppIntegrationProviderContract } from "./types";
import { interpolateProviderContractLabel } from "./interpolate";

export type ProviderConnectionFailureCode =
  | "invalid_token"
  | "revoked_token"
  | "credential_unavailable"
  | "rotation_required"
  | "unreachable"
  | "server_error"
  | "org_mismatch"
  | "scope_mismatch"
  | "unsupported_response"
  | "timeout"
  | "bad_certificate"
  | "unsupported_api_version"
  | "malformed_response"
  | "placeholder_not_configured"
  | "invalid_base_url"
  | "invalid_base_url_https"
  | "invalid_base_url_email"
  | "host_not_allowlisted"
  | "contract_incomplete";

export type ProviderConnectionErrorPanelModel = {
  errorCode: ProviderConnectionFailureCode;
  titleKey: string;
  bodyKey: string;
};

const FAILURE_PREFIX = "customerApp.portalStructure.integrations.connectionFailures";

const LEGACY_CODE_MAP: Record<string, ProviderConnectionFailureCode> = {
  invalid_token: "invalid_token",
  revoked_token: "revoked_token",
  credential_unavailable: "credential_unavailable",
  rotation_required: "rotation_required",
  secret_decryption_failed: "rotation_required",
  endpoint_unreachable: "unreachable",
  unexpected_http_status: "server_error",
  organization_mismatch: "org_mismatch",
  missing_required_scope: "scope_mismatch",
  unsupported_response: "unsupported_response",
  verification_record_failed: "unsupported_response",
  expired_or_revoked: "revoked_token",
  wrong_org: "org_mismatch",
  missing_scope: "scope_mismatch",
  unreachable: "unreachable",
  timeout: "timeout",
  bad_certificate: "bad_certificate",
  unsupported_api_version: "unsupported_api_version",
  malformed_response: "malformed_response",
  server_error: "server_error",
  placeholder_required: "invalid_token",
  placeholder_not_configured: "placeholder_not_configured",
  response_not_json: "malformed_response",
  provider_mismatch: "malformed_response",
  read_only_flag_missing: "malformed_response",
  malformed_organization: "org_mismatch",
  malformed_scopes: "scope_mismatch",
  unsupported_contract_version: "unsupported_api_version",
  connection_not_established: "malformed_response",
  invalid_or_expired: "invalid_token",
  revoked: "revoked_token",
  scope_mismatch: "scope_mismatch",
  org_mismatch: "org_mismatch",
  invalid_base_url: "invalid_base_url",
  invalid_base_url_https: "invalid_base_url_https",
  invalid_base_url_email: "invalid_base_url_email",
  host_not_allowlisted: "host_not_allowlisted",
  contract_incomplete: "contract_incomplete",
};

export function normalizeProviderConnectionFailureCode(
  code: string | null | undefined
): ProviderConnectionFailureCode {
  const normalized = (code ?? "unsupported_response").trim().toLowerCase();
  return LEGACY_CODE_MAP[normalized] ?? "unsupported_response";
}

export function buildProviderConnectionErrorPanelModel(
  errorCode: string | null | undefined
): ProviderConnectionErrorPanelModel {
  const normalized = normalizeProviderConnectionFailureCode(errorCode);
  return {
    errorCode: normalized,
    titleKey: `${FAILURE_PREFIX}.panels.${normalized}.title`,
    bodyKey: `${FAILURE_PREFIX}.panels.${normalized}.body`,
  };
}

export async function parseProviderTestErrorFromResponse(
  response: Response
): Promise<ProviderConnectionErrorPanelModel> {
  let payload: Record<string, unknown> = {};
  try {
    payload = (await response.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const errorCode = String(
    payload.error_code ?? payload.code ?? payload.error ?? "unsupported_response"
  );

  return buildProviderConnectionErrorPanelModel(errorCode);
}

export type ProviderConnectionErrorPanelLabels = {
  title: string;
  body: string;
  retry: string;
  updateKey: string;
  openAdmin: string;
  backToIntegrations: string;
  openAdminHref: string;
  backToIntegrationsHref: string;
};

export function buildProviderConnectionErrorPanelLabels(input: {
  model: ProviderConnectionErrorPanelModel;
  contract: CoreAppIntegrationProviderContract;
  t: (key: string) => string;
  backToIntegrationsHref?: string;
}): ProviderConnectionErrorPanelLabels {
  const { model, contract, t } = input;
  const actions = `${FAILURE_PREFIX}.actions`;
  const openAdminTemplate = t(`${actions}.openAdmin`);

  return {
    title: interpolateProviderContractLabel(t(model.titleKey), contract),
    body: interpolateProviderContractLabel(t(model.bodyKey), contract),
    retry: t(`${actions}.retry`),
    updateKey: t(`${actions}.updateKey`),
    openAdmin: interpolateProviderContractLabel(
      openAdminTemplate.includes("{") ? openAdminTemplate : "Open {adminName}",
      contract
    ),
    backToIntegrations: t(`${actions}.backToIntegrations`),
    openAdminHref: contract.adminIntegrationUrl,
    backToIntegrationsHref: input.backToIntegrationsHref ?? "/app/platform/integrations",
  };
}

export function listProviderConnectionFailureTranslationKeys(): string[] {
  const codes = Object.keys(
    Object.fromEntries(
      Object.values(LEGACY_CODE_MAP).map((code) => [code, true])
    )
  ) as ProviderConnectionFailureCode[];

  const unique = Array.from(new Set(codes));
  const keys = [
    `${FAILURE_PREFIX}.actions.retry`,
    `${FAILURE_PREFIX}.actions.updateKey`,
    `${FAILURE_PREFIX}.actions.openAdmin`,
    `${FAILURE_PREFIX}.actions.backToIntegrations`,
    `${FAILURE_PREFIX}.contractIncompleteTitle`,
    `${FAILURE_PREFIX}.contractIncompleteBody`,
  ];
  for (const code of unique) {
    keys.push(`${FAILURE_PREFIX}.panels.${code}.title`);
    keys.push(`${FAILURE_PREFIX}.panels.${code}.body`);
  }
  return keys;
}
