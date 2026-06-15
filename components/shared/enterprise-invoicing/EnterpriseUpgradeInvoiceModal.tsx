"use client";

import { useEffect, useState } from "react";
import {
  parseEnterpriseUpgradeCheckout,
  parseEnterpriseUpgradeResult,
  type EnterpriseInvoicingLabels,
  type EnterpriseUpgradeCheckout,
} from "@/lib/enterprise-invoicing";

type EnterpriseUpgradeInvoiceModalProps = {
  labels: EnterpriseInvoicingLabels;
  targetPackage: string;
  open: boolean;
  onClose: () => void;
  onComplete: (message: string) => void;
};

export function EnterpriseUpgradeInvoiceModal({
  labels,
  targetPackage,
  open,
  onClose,
  onComplete,
}: EnterpriseUpgradeInvoiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState<EnterpriseUpgradeCheckout | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !targetPackage) return;
    setLoading(true);
    void fetch(`/api/enterprise-invoicing/upgrade/checkout?target_package=${targetPackage}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCheckout(data ? parseEnterpriseUpgradeCheckout(data) : null))
      .finally(() => setLoading(false));
  }, [open, targetPackage]);

  if (!open) return null;

  async function handleSubmit(approved: boolean) {
    setSubmitting(true);
    const res = await fetch("/api/enterprise-invoicing/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target_package: targetPackage,
        approved,
        billing_method: "invoice",
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      const result = parseEnterpriseUpgradeResult(await res.json());
      if (result) {
        onComplete(result.message);
        onClose();
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">{labels.upgrade.title}</h2>
        {loading || !checkout ? (
          <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
        ) : (
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p>
              <span className="font-medium">{labels.upgrade.currentPlan}:</span> {checkout.current_plan}
            </p>
            <p>
              <span className="font-medium">{labels.upgrade.newPlan}:</span> {checkout.new_plan}
            </p>
            <p>
              <span className="font-medium">{labels.upgrade.priceDifference}:</span>{" "}
              {checkout.price_difference_monthly} {checkout.currency}
            </p>
            <p>
              <span className="font-medium">{labels.upgrade.billingMethod}:</span>{" "}
              {checkout.billing_method_label}
            </p>
            <p>
              <span className="font-medium">{labels.upgrade.paymentTerms}:</span>{" "}
              {labels.paymentTerms[checkout.payment_terms as keyof typeof labels.paymentTerms] ??
                checkout.payment_terms_label}
            </p>
            <p>
              <span className="font-medium">{labels.upgrade.accessPolicy}:</span>{" "}
              {checkout.access_unlock_label}
            </p>
            {!checkout.profile_configured && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-900">
                {labels.upgrade.profileRequired}
              </p>
            )}
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-600">
              {labels.upgrade.requiresApproval}
            </p>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            onClick={onClose}
          >
            {labels.back}
          </button>
          <button
            type="button"
            disabled={submitting || loading || !checkout?.profile_configured}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            onClick={() => void handleSubmit(true)}
          >
            {submitting ? labels.saving : labels.upgrade.approveAndContinue}
          </button>
          <button
            type="button"
            disabled={submitting || loading || !checkout?.profile_configured}
            className="rounded-lg border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50"
            onClick={() => void handleSubmit(false)}
          >
            {labels.upgrade.createInvoiceDraft}
          </button>
        </div>
      </div>
    </div>
  );
}
