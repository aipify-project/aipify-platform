import { ORGANIZATION_ACCESS_RPC_ERROR_CODES } from "./types";

const ERROR_LABEL_KEYS: Record<string, string> = {
  [ORGANIZATION_ACCESS_RPC_ERROR_CODES.approverShouldGrantDirectly]:
    "customerApp.authorizationTarget.errors.approverShouldGrantDirectly",
  provider_key_required: "customerApp.authorizationTarget.errors.providerRequired",
  scope_keys_required: "customerApp.authorizationTarget.errors.scopeRequired",
};

export function mapOrganizationAccessRpcError(errorCode: string | undefined | null): string | null {
  if (!errorCode) return null;
  return ERROR_LABEL_KEYS[errorCode] ?? null;
}
