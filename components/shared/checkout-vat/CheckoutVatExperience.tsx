"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { CheckoutVatBreakdown, CheckoutVatFormState, CheckoutVatLabels } from "@/lib/checkout-vat-operations";

type Props = {
  labels: CheckoutVatLabels;
  backHref: string;
  initialProductType?: string;
  initialSubtotal?: number;
  initialCurrency?: string;
  onConfirmed?: (sessionKey: string) => void;
};

const DEFAULT_STATE: CheckoutVatFormState = {
  customerType: "private",
  companyName: "",
  organizationNumber: "",
  country: "NO",
  billingAddress: "",
  billingEmail: "",
  reference: "",
  purchaseOrderNumber: "",
  productType: "subscription",
  paymentProvider: "stripe",
  subtotal: 0,
  currency: "NOK",
};

export function CheckoutVatExperience({
  labels,
  backHref,
  initialProductType = "subscription",
  initialSubtotal = 0,
  initialCurrency = "NOK",
  onConfirmed,
}: Props) {
  const [form, setForm] = useState<CheckoutVatFormState>({
    ...DEFAULT_STATE,
    productType: initialProductType,
    subtotal: initialSubtotal,
    currency: initialCurrency,
  });
  const [breakdown, setBreakdown] = useState<CheckoutVatBreakdown | null>(null);
  const [validationStatus, setValidationStatus] = useState("waiting");
  const [validationMessage, setValidationMessage] = useState("");
  const [registryCompanyName, setRegistryCompanyName] = useState("");
  const [validationSource, setValidationSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(null);

  const isBusiness = form.customerType === "business";

  const canContinue = useMemo(() => {
    if (!form.billingAddress.trim() || !form.billingEmail.trim()) return false;
    if (isBusiness && !form.organizationNumber.trim()) return false;
    if (isBusiness && !form.companyName.trim() && !registryCompanyName.trim()) return false;
    return (breakdown?.total ?? 0) >= 0;
  }, [form, isBusiness, registryCompanyName, breakdown]);

  const recalculate = useCallback(async (nextValidationStatus = validationStatus, nextSource = validationSource) => {
    const res = await fetch("/api/checkout-vat/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_type: form.customerType,
        country: form.country,
        subtotal: form.subtotal,
        currency: form.currency,
        validation_status: nextValidationStatus,
        validation_source: nextSource,
      }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setBreakdown({
      subtotal: Number(data.subtotal ?? form.subtotal),
      vatRate: Number(data.vat_rate ?? 0),
      vatAmount: Number(data.vat_amount ?? 0),
      total: Number(data.total_amount ?? form.subtotal),
      reverseCharge: Boolean(data.reverse_charge),
      reverseChargeNote: String(data.reverse_charge_note ?? ""),
      validationStatus: nextValidationStatus,
    });
  }, [form, validationStatus, validationSource]);

  const validateBusiness = useCallback(async () => {
    if (!isBusiness || !form.organizationNumber.trim()) {
      setValidationStatus("not_required");
      setValidationMessage("");
      await recalculate("not_required", "");
      return;
    }

    setValidationStatus("validating");
    setValidationMessage(labels.validating);
    setBusy(true);

    const res = await fetch("/api/checkout-vat/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: form.country,
        business_number: form.organizationNumber,
        customer_type: form.customerType,
        session_key: sessionKey ?? "",
      }),
    });

    setBusy(false);
    if (!res.ok) {
      setValidationStatus("service_unavailable");
      setValidationMessage(labels.validationUnavailable);
      await recalculate("service_unavailable", "");
      return;
    }

    const data = await res.json();
    const status = String(data.validation_status ?? "invalid");
    const source = String(data.validation_source ?? "");
    setValidationStatus(status);
    setValidationSource(source);
    if (data.registry_company_name) {
      setRegistryCompanyName(String(data.registry_company_name));
      setForm((prev) => ({
        ...prev,
        companyName: prev.companyName || String(data.registry_company_name),
      }));
    }

    if (status === "valid") {
      setValidationMessage(labels.validationValid);
    } else if (status === "service_unavailable") {
      setValidationMessage(labels.validationUnavailable);
    } else {
      setValidationMessage(
        source === "vies" ? labels.invalidEuVatNumber : labels.invalidBusinessNumber
      );
    }

    await recalculate(status, source);
  }, [form, isBusiness, labels, recalculate, sessionKey]);

  useEffect(() => {
    void recalculate(isBusiness ? validationStatus : "not_required", validationSource);
  }, [form.customerType, form.country, form.subtotal, form.currency]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isBusiness) {
      setValidationStatus("not_required");
      setValidationMessage("");
      setRegistryCompanyName("");
      setValidationSource("");
      return;
    }
    const timer = setTimeout(() => { void validateBusiness(); }, 600);
    return () => clearTimeout(timer);
  }, [form.organizationNumber, form.country, isBusiness, validateBusiness]);

  const saveAndContinue = async () => {
    setBusy(true);
    const res = await fetch("/api/checkout-vat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_key: sessionKey,
        ...form,
        validation_status: validationStatus,
        validation_source: validationSource,
        registry_company_name: registryCompanyName,
      }),
    });
    setBusy(false);
    if (!res.ok) return;
    const data = await res.json();
    const key = String(data.session_key);
    setSessionKey(key);

    const payRes = await fetch("/api/billing/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkout_vat_session: key,
        plan_key: "starter",
        product_type: form.productType,
        payment_provider: form.paymentProvider,
      }),
    });
    if (!payRes.ok) return;
    const payData = (await payRes.json()) as { checkout_url?: string; demo_mode?: boolean };
    onConfirmed?.(key);
    if (payData.checkout_url) {
      window.location.href = payData.checkout_url;
      return;
    }
    window.location.href = "/app/settings/billing/packages?checkout=success";
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-900">{labels.title}</h1>
        <p className="mt-2 text-zinc-600">{labels.subtitle}</p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {labels.legalReviewBanner}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-zinc-900">{labels.customerType}</legend>
        <div className="flex gap-3">
          {(["private", "business"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, customerType: type }))}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${form.customerType === type ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700"}`}
            >
              {type === "private" ? labels.privatePerson : labels.business}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4">
        {isBusiness ? (
          <>
            <label className="block text-sm">
              <span className="font-medium text-zinc-900">{labels.companyName}</span>
              <input
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                value={form.companyName}
                onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-zinc-900">{labels.organizationNumber}</span>
              <input
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                value={form.organizationNumber}
                onChange={(e) => setForm((p) => ({ ...p, organizationNumber: e.target.value }))}
                required
              />
              {validationMessage ? (
                <span className={`mt-1 block text-xs ${validationStatus === "valid" ? "text-emerald-700" : "text-amber-800"}`}>
                  {validationMessage}
                </span>
              ) : null}
            </label>
          </>
        ) : null}

        <label className="block text-sm">
          <span className="font-medium text-zinc-900">{labels.country}</span>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 uppercase"
            value={form.country}
            onChange={(e) => setForm((p) => ({ ...p, country: e.target.value.toUpperCase() }))}
            maxLength={2}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-zinc-900">{labels.billingAddress}</span>
          <textarea
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            rows={2}
            value={form.billingAddress}
            onChange={(e) => setForm((p) => ({ ...p, billingAddress: e.target.value }))}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-zinc-900">{labels.billingEmail}</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
            value={form.billingEmail}
            onChange={(e) => setForm((p) => ({ ...p, billingEmail: e.target.value }))}
            required
          />
        </label>
        {isBusiness ? (
          <>
            <label className="block text-sm">
              <span className="font-medium text-zinc-900">{labels.reference}</span>
              <input className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" value={form.reference} onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-zinc-900">{labels.purchaseOrder}</span>
              <input className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" value={form.purchaseOrderNumber} onChange={(e) => setForm((p) => ({ ...p, purchaseOrderNumber: e.target.value }))} />
            </label>
          </>
        ) : null}
      </div>

      {breakdown ? (
        <dl className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
          <div className="flex justify-between"><dt className="text-zinc-500">{labels.subtotal}</dt><dd>{breakdown.subtotal.toFixed(2)} {form.currency}</dd></div>
          <div className="flex justify-between"><dt className="text-zinc-500">{labels.vat} ({breakdown.vatRate}%)</dt><dd>{breakdown.vatAmount.toFixed(2)} {form.currency}</dd></div>
          <div className="flex justify-between border-t border-zinc-100 pt-2 font-semibold"><dt>{labels.total}</dt><dd>{breakdown.total.toFixed(2)} {form.currency}</dd></div>
          {breakdown.reverseCharge && breakdown.reverseChargeNote ? (
            <p className="pt-2 text-xs text-indigo-700">{breakdown.reverseChargeNote}</p>
          ) : null}
        </dl>
      ) : (
        <div className="flex justify-center py-6"><AipifyLoader centered /></div>
      )}

      <button
        type="button"
        disabled={busy || !canContinue}
        onClick={() => void saveAndContinue()}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {labels.continueToPayment}
      </button>
    </div>
  );
}
