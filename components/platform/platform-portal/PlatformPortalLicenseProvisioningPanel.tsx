"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  PlatformPortalCustomerDetailCommercial,
  PlatformPortalCustomerDetailLicense,
  PlatformPortalLicenseProduct,
  PlatformPortalLicenseProvisioningLabels,
} from "@/lib/platform-portal";
import {
  mapLicenseProductDescription,
  mapLicenseProductName,
} from "@/lib/platform-portal/business-language";
import {
  createLicenseIdempotencyKey,
  licenseStatusVariant,
  parsePlatformPortalLicenseProductsPayload,
  provisioningStatusVariant,
  type PlatformPortalLicenseProvisioningErrorCode,
} from "@/lib/platform-portal/license-provisioning";

type Props = {
  open: boolean;
  customerId: string;
  commercial: PlatformPortalCustomerDetailCommercial;
  existingLicenses: PlatformPortalCustomerDetailLicense[];
  labels: PlatformPortalLicenseProvisioningLabels;
  onClose: () => void;
  onSuccess: () => void;
};

type ProductsState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "empty" }
  | { kind: "ready"; products: PlatformPortalLicenseProduct[] };

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; code: PlatformPortalLicenseProvisioningErrorCode };

function errorMessage(
  labels: PlatformPortalLicenseProvisioningLabels,
  code: PlatformPortalLicenseProvisioningErrorCode,
): string {
  switch (code) {
    case "active_license_conflict":
      return labels.alreadyExists;
    case "commercial_plan_required":
      return labels.commercialPlanMissing;
    case "product_not_assignable":
      return labels.productNotAssignable;
    case "product_not_found":
    case "invalid_product":
      return labels.productUnavailable;
    case "invalid_internal_reason":
      return labels.reasonRequired;
    case "unauthorized":
      return labels.unauthorized;
    case "forbidden":
      return labels.forbidden;
    default:
      return labels.createError;
  }
}

function hasActiveCommercialPlan(commercial: PlatformPortalCustomerDetailCommercial): boolean {
  if (commercial.lifetime) return true;
  const status = (commercial.subscriptionStatus ?? "").toLowerCase();
  return status === "active" || status === "trialing";
}

function hasConflictingLicense(licenses: PlatformPortalCustomerDetailLicense[]): boolean {
  return licenses.some((license) => {
    const code = (license.productCode ?? "").toLowerCase();
    const status = (license.status ?? "").toLowerCase();
    return code === "app_subscription" && (status === "active" || status === "pending");
  });
}

function statusLabel(
  status: string | null | undefined,
  map: Record<string, string>,
  fallback: string,
): string {
  if (!status) return fallback;
  return map[status.toLowerCase()] ?? map[status] ?? fallback;
}

function productMaps(labels: PlatformPortalLicenseProvisioningLabels) {
  return Object.fromEntries(
    Object.entries(labels.productNames).map(([code, name]) => [
      code,
      { name, description: labels.productDescriptions[code] },
    ]),
  );
}

const BADGE: Record<string, string> = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200",
  danger:
    "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200",
  info: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-200",
  muted:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200",
};

export function PlatformPortalLicenseProvisioningPanel({
  open,
  customerId,
  commercial,
  existingLicenses,
  labels,
  onClose,
  onSuccess,
}: Props) {
  const [productsState, setProductsState] = useState<ProductsState>({ kind: "loading" });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [idempotencyKey] = useState(() => createLicenseIdempotencyKey());

  const commercialOk = hasActiveCommercialPlan(commercial);
  const conflict = hasConflictingLicense(existingLicenses);
  const readOnlyConflict = conflict;
  const blocked = !commercialOk || conflict;
  const products = productMaps(labels);

  useEffect(() => {
    if (!open || readOnlyConflict) return;
    let cancelled = false;

    async function loadProducts() {
      setProductsState({ kind: "loading" });
      try {
        const response = await fetch("/api/platform-portal/license-products", {
          cache: "no-store",
        });
        if (response.status === 401) {
          setSubmit({ kind: "error", code: "unauthorized" });
          return;
        }
        if (response.status === 403) {
          setSubmit({ kind: "error", code: "forbidden" });
          return;
        }
        if (!response.ok) {
          if (!cancelled) setProductsState({ kind: "error" });
          return;
        }
        const payload = parsePlatformPortalLicenseProductsPayload(await response.json());
        if (cancelled) return;
        if (payload.products.length === 0) {
          setProductsState({ kind: "empty" });
          return;
        }
        setProductsState({ kind: "ready", products: payload.products });
        setSelectedProductId(payload.products[0]?.id ?? null);
      } catch {
        if (!cancelled) setProductsState({ kind: "error" });
      }
    }

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, [open, readOnlyConflict]);

  const selectedProduct = useMemo(() => {
    if (productsState.kind !== "ready" || !selectedProductId) return null;
    return productsState.products.find((product) => product.id === selectedProductId) ?? null;
  }, [productsState, selectedProductId]);

  const canSubmit =
    !blocked &&
    productsState.kind === "ready" &&
    selectedProduct != null &&
    reason.trim().length >= 3 &&
    confirmed &&
    submit.kind !== "submitting";

  async function handleSubmit() {
    if (!canSubmit || !selectedProduct) return;
    setSubmit({ kind: "submitting" });
    try {
      const response = await fetch(`/api/platform-portal/customers/${customerId}/licenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          productId: selectedProduct.id,
          internalReason: reason.trim(),
          idempotencyKey,
        }),
      });

      if (response.status === 401) {
        setSubmit({ kind: "error", code: "unauthorized" });
        return;
      }
      if (response.status === 403) {
        setSubmit({ kind: "error", code: "forbidden" });
        return;
      }

      const body = (await response.json().catch(() => null)) as {
        code?: PlatformPortalLicenseProvisioningErrorCode;
      } | null;

      if (!response.ok) {
        setSubmit({
          kind: "error",
          code: body?.code ?? "unknown",
        });
        return;
      }

      setSubmit({ kind: "success" });
      onSuccess();
    } catch {
      setSubmit({ kind: "error", code: "unknown" });
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-6 dark:bg-black/60">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="license-provisioning-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl dark:border-slate-700 dark:bg-slate-950"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2
              id="license-provisioning-title"
              className="text-lg font-semibold text-slate-900 dark:text-slate-50"
            >
              {labels.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {readOnlyConflict ? labels.alreadyExists : labels.summaryCreates}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {readOnlyConflict ? labels.close : labels.cancel}
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {labels.currentLicenses}
            </h3>
            {existingLicenses.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{labels.emptyLicenses}</p>
            ) : (
              <ul className="space-y-2">
                {existingLicenses.map((license) => (
                  <li
                    key={license.id}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-700"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {mapLicenseProductName(
                          license.productCode,
                          license.productName,
                          products,
                          labels.licenseProduct,
                        )}
                      </span>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${BADGE[licenseStatusVariant(license.status)]}`}
                      >
                        {statusLabel(license.status, labels.licenseStatuses, labels.pending)}
                      </span>
                      {license.provisioningStatus ? (
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${BADGE[provisioningStatusVariant(license.provisioningStatus)]}`}
                        >
                          {statusLabel(
                            license.provisioningStatus,
                            labels.provisioningStatuses,
                            labels.waitingProvisioning,
                          )}
                        </span>
                      ) : null}
                    </div>
                    {license.maskedLicenseCode ? (
                      <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {labels.maskedLicenseCode}: {license.maskedLicenseCode}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {readOnlyConflict ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-950 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100">
              {labels.alreadyExists}
            </div>
          ) : !commercialOk ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
              {labels.commercialPlanMissing}
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-100">
                {labels.commercialPlanActive}
              </div>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {labels.availableProducts}
                </h3>
                {productsState.kind === "loading" ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">{labels.loadingProducts}</p>
                ) : null}
                {productsState.kind === "error" ? (
                  <p className="text-sm text-rose-700 dark:text-rose-300">{labels.loadProductsError}</p>
                ) : null}
                {productsState.kind === "empty" ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">{labels.emptyProducts}</p>
                ) : null}
                {productsState.kind === "ready"
                  ? productsState.products.map((product) => {
                      const selected = selectedProductId === product.id;
                      const displayName = mapLicenseProductName(
                        product.code,
                        product.name,
                        products,
                        labels.licenseProduct,
                      );
                      const displayDescription = mapLicenseProductDescription(
                        product.code,
                        product.description,
                        products,
                      );
                      return (
                        <button
                          key={product.id}
                          type="button"
                          disabled={blocked}
                          onClick={() => setSelectedProductId(product.id)}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                            selected
                              ? "border-violet-400 bg-violet-50/80 ring-2 ring-violet-300 dark:border-violet-500 dark:bg-violet-950/40 dark:ring-violet-700"
                              : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                          } ${blocked ? "cursor-not-allowed opacity-60" : ""}`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-medium text-slate-900 dark:text-slate-50">
                              {displayName}
                            </p>
                          </div>
                          {displayDescription ? (
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                              {displayDescription}
                            </p>
                          ) : null}
                          <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            {product.requiresCommercialPlan ? (
                              <li>{labels.requiresCommercialPlan}</li>
                            ) : null}
                            {product.requiresEntitlement ? (
                              <li>{labels.requiresEntitlement}</li>
                            ) : null}
                            <li>{labels.domainLater}</li>
                            <li>{labels.installationLater}</li>
                          </ul>
                        </button>
                      );
                    })
                  : null}
              </section>

              <section className="space-y-2">
                <label
                  htmlFor="license-internal-reason"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-100"
                >
                  {labels.internalReason}
                </label>
                <textarea
                  id="license-internal-reason"
                  value={reason}
                  disabled={blocked || submit.kind === "submitting"}
                  onChange={(event) => setReason(event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-violet-400 focus:ring-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                {reason.trim().length > 0 && reason.trim().length < 3 ? (
                  <p className="text-xs text-amber-700 dark:text-amber-300">{labels.reasonRequired}</p>
                ) : null}
              </section>

              <section className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {labels.summary}
                </h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <li>{labels.summaryCreates}</li>
                  <li>{labels.summaryNoDomain}</li>
                  <li>{labels.summaryNoWebsiteKompis}</li>
                </ul>
                <label className="mt-2 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    disabled={blocked || submit.kind === "submitting"}
                    onChange={(event) => setConfirmed(event.target.checked)}
                    className="mt-0.5"
                  />
                  <span>{labels.confirmRequired}</span>
                </label>
              </section>
            </>
          )}

          {submit.kind === "error" ? (
            <p className="text-sm text-rose-700 dark:text-rose-300">
              {errorMessage(labels, submit.code)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          {readOnlyConflict ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
            >
              {labels.close}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {labels.cancel}
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => void handleSubmit()}
                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-400"
              >
                {submit.kind === "submitting" ? labels.creating : labels.create}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
