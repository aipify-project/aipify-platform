import type { Translator } from "@/lib/i18n/translate";
import type { OrganizationProviderAccessManifest } from "./types";
import { resolveProviderAccessManifest } from "./provider-scope-registry";

const BASE = "customerApp.organizationAccessApproval";

export function buildOrganizationAccessEmployeeMessage(t: Translator): string {
  return t(`${BASE}.employee.noAuthorityMessage`);
}

/** State C — user role lacks permission to view the requested data type. */
export function buildOrganizationAccessUserRoleDeniedMessage(t: Translator): string {
  return t(`${BASE}.employee.userRoleDeniedMessage`);
}

export function buildOrganizationAccessRequestActions(t: Translator): Array<{
  id: string;
  label: string;
  kind: "primary" | "secondary";
}> {
  return [
    { id: "submit_access_request", label: t(`${BASE}.employee.actions.submit`), kind: "primary" },
    { id: "cancel_access_request", label: t(`${BASE}.employee.actions.cancel`), kind: "secondary" },
  ];
}

export function buildOrganizationAccessApproverLabels(
  t: Translator,
  manifest: OrganizationProviderAccessManifest,
  input: {
    scope_keys: readonly string[];
    access_mode: string;
    duration_hours: number | null;
    risk_level: number;
    requester_name: string;
  },
) {
  const scopeLabels = input.scope_keys
    .map((scopeKey) => {
      const scope = manifest.required_scopes.find((entry) => entry.scope_key === scopeKey);
      return scope ? t(scope.label_key) : null;
    })
    .filter(Boolean);

  return {
    providerLabel: t(manifest.provider_label_key),
    dataTypeLabel: t(manifest.data_type_label_key),
    whyNeeded: t(manifest.why_needed_label_key),
    scopeSummary: scopeLabels.join(", "),
    accessModeLabel:
      input.access_mode === "one_time"
        ? t(`${BASE}.review.accessMode.oneTime`)
        : t(`${BASE}.review.accessMode.ongoing`),
    durationLabel:
      input.duration_hours != null
        ? t(`${BASE}.review.durationHours`).replace("{hours}", String(input.duration_hours))
        : t(`${BASE}.review.durationOpenEnded`),
    riskLabel: t(`${BASE}.review.riskLevels.${input.risk_level}`),
    requesterLabel: t(`${BASE}.review.requester`).replace("{name}", input.requester_name),
    afterApproval: t(`${BASE}.review.afterApproval`),
  };
}

export function resolveProviderFriendlyLabel(t: Translator, providerKey: string): string {
  const manifest = resolveProviderAccessManifest(providerKey);
  if (!manifest) return t(`${BASE}.providers.generic.label`);
  return t(manifest.provider_label_key);
}
