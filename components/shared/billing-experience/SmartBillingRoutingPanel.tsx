"use client";

import type { BillingExperienceLabels, BillingPathSelection } from "@/lib/billing-experience";
import { ENTERPRISE_ONBOARDING_ACTIONS } from "@/lib/billing-experience/constants";
import {
  SELF_SERVICE_PAYMENT_PROVIDERS,
  type PaymentProviderLabels,
} from "@/lib/payment-providers";
import { PaymentProviderLogo } from "@/components/shared/payment-providers/PaymentProviderLogo";

type SmartBillingRoutingPanelProps = {
  labels: BillingExperienceLabels;
  providerLabels?: PaymentProviderLabels;
  value: BillingPathSelection;
  onChange: (path: BillingPathSelection) => void;
  enterpriseActionHref?: string;
};

export function SmartBillingRoutingPanel({
  labels,
  providerLabels,
  value,
  onChange,
  enterpriseActionHref = "/app/settings/billing/invoice-details",
}: SmartBillingRoutingPanelProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-gray-900">{labels.smartRouting.title}</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange("instant")}
          className={`rounded-xl border px-4 py-4 text-left text-sm transition ${
            value === "instant"
              ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <span className="font-semibold text-gray-900">{labels.smartRouting.instant.label}</span>
          <p className="mt-1 text-xs text-gray-500">{labels.smartRouting.instant.description}</p>
        </button>
        <button
          type="button"
          onClick={() => onChange("enterprise")}
          className={`rounded-xl border px-4 py-4 text-left text-sm transition ${
            value === "enterprise"
              ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <span className="font-semibold text-gray-900">{labels.smartRouting.enterprise.label}</span>
          <p className="mt-1 text-xs text-gray-500">{labels.smartRouting.enterprise.description}</p>
        </button>
      </div>

      {value === "instant" && providerLabels && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">
            {labels.instantActivation.activateWith}
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            {SELF_SERVICE_PAYMENT_PROVIDERS.map((provider) => (
              <div
                key={provider}
                className="flex items-center rounded-xl border border-white bg-white px-4 py-3 shadow-sm"
              >
                <PaymentProviderLogo
                  provider={provider}
                  alt={providerLabels.providers[provider] ?? provider}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-emerald-900/80">{labels.instantActivation.message}</p>
        </div>
      )}

      {value === "enterprise" && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
            {labels.enterpriseProcurement.title}
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {ENTERPRISE_ONBOARDING_ACTIONS.map((action) => (
              <li key={action}>
                <a
                  href={enterpriseActionHref}
                  className="block rounded-lg border border-white bg-white px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-indigo-100 hover:text-indigo-800"
                >
                  {labels.enterpriseProcurement.actions[action]}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-600">{labels.enterpriseProcurement.message}</p>
        </div>
      )}

      <p className="text-xs text-gray-500">{labels.commercialPrinciple.footer}</p>
    </div>
  );
}
