import { Suspense } from "react";
import { OrganizationAccessApprovalPanel } from "@/components/app/settings/OrganizationAccessApprovalPanel";
import { ORGANIZATION_PROVIDER_ACCESS_MANIFESTS } from "@/lib/core/organization-access-approval/provider-scope-registry";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { AipifyLoader } from "@/components/ui/aipify-loader";

export default async function OrganizationAccessSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const base = "customerApp.organizationAccessApproval";

  const providers: Record<string, string> = {
    generic: t(`${base}.providers.generic.label`),
  };
  for (const manifest of ORGANIZATION_PROVIDER_ACCESS_MANIFESTS) {
    providers[manifest.provider_key] = t(manifest.provider_label_key);
    providers[`${manifest.provider_key}.dataType`] = t(manifest.data_type_label_key);
    providers[`${manifest.provider_key}.whyNeeded`] = t(manifest.why_needed_label_key);
  }

  const scopes: Record<string, string> = {};
  for (const manifest of ORGANIZATION_PROVIDER_ACCESS_MANIFESTS) {
    for (const scope of manifest.required_scopes) {
      scopes[scope.scope_key] = t(scope.label_key);
    }
  }

  const labels = {
    title: t(`${base}.title`),
    subtitle: t(`${base}.subtitle`),
    back: t(`${base}.back`),
    loading: t(`${base}.loading`),
    empty: t(`${base}.empty`),
    employeeNote: t(`${base}.employee.panelNote`),
    createTitle: t(`${base}.create.title`),
    createDescription: t(`${base}.create.description`),
    submitRequest: t(`${base}.employee.actions.submit`),
    cancelRequest: t(`${base}.employee.actions.cancel`),
    requestSubmitted: t(`${base}.create.submitted`),
    requestFailed: t(`${base}.create.failed`),
    errors: {
      approverShouldGrantDirectly: t("customerApp.authorizationTarget.errors.approverShouldGrantDirectly"),
      providerRequired: t("customerApp.authorizationTarget.errors.providerRequired"),
      scopeRequired: t("customerApp.authorizationTarget.errors.scopeRequired"),
    },
    approverDirectTitle: t("customerApp.authorizationTarget.approver.panelTitle"),
    approverDirectDescription: t("customerApp.authorizationTarget.approver.panelDescription"),
    approverApproveAccess: t("customerApp.authorizationTarget.approver.actions.approveAccess"),
    approverNoPendingRequest: t("customerApp.authorizationTarget.approver.noPendingRequest"),
    pendingTitle: t(`${base}.review.pendingTitle`),
    approve: t(`${base}.review.actions.approve`),
    deny: t(`${base}.review.actions.deny`),
    approved: t(`${base}.review.approved`),
    denied: t(`${base}.review.denied`),
    review: {
      provider: t(`${base}.review.fields.provider`),
      dataType: t(`${base}.review.fields.dataType`),
      whyNeeded: t(`${base}.review.fields.whyNeeded`),
      scope: t(`${base}.review.fields.scope`),
      accessMode: t(`${base}.review.fields.accessMode`),
      duration: t(`${base}.review.fields.duration`),
      risk: t(`${base}.review.fields.risk`),
      requester: t(`${base}.review.fields.requester`),
      afterApproval: t(`${base}.review.afterApproval`),
      afterApprovalDetail: t(`${base}.review.afterApprovalDetail`),
    },
    accessMode: {
      oneTime: t(`${base}.review.accessMode.oneTime`),
      ongoing: t(`${base}.review.accessMode.ongoing`),
    },
    durationOpenEnded: t(`${base}.review.durationOpenEnded`),
    durationHours: t(`${base}.review.durationHours`),
    riskLevels: {
      "0": t(`${base}.review.riskLevels.0`),
      "1": t(`${base}.review.riskLevels.1`),
      "2": t(`${base}.review.riskLevels.2`),
      "3": t(`${base}.review.riskLevels.3`),
    },
    providers,
    scopes,
    statusLabels: {
      pending: t(`${base}.status.pending`),
      approved: t(`${base}.status.approved`),
      denied: t(`${base}.status.denied`),
      cancelled: t(`${base}.status.cancelled`),
    },
  };

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[320px] items-center justify-center">
          <AipifyLoader centered />
        </div>
      }
    >
      <OrganizationAccessApprovalPanel labels={labels} />
    </Suspense>
  );
}
