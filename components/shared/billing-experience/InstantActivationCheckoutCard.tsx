"use client";

import {
  PROVIDER_LOGO_CONTAINER_CLASS,
  type SelfServicePaymentProviderKey,
} from "@/lib/payment-providers";
import { PaymentProviderLogo } from "@/components/shared/payment-providers/PaymentProviderLogo";

type InstantActivationCheckoutCardProps = {
  provider: SelfServicePaymentProviderKey;
  providerName: string;
  checkoutLabel: string;
  checkingOut: boolean;
  onCheckout: () => void;
};

export function InstantActivationCheckoutCard({
  provider,
  providerName,
  checkoutLabel,
  checkingOut,
  onCheckout,
}: InstantActivationCheckoutCardProps) {
  return (
    <button
      type="button"
      disabled={checkingOut}
      onClick={onCheckout}
      className="group flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className={`${PROVIDER_LOGO_CONTAINER_CLASS} border-none pb-0`}>
        <PaymentProviderLogo provider={provider} alt={providerName} />
      </div>
      <p className="mt-5 text-sm font-medium text-neutral-900">{providerName}</p>
      <p className="mt-2 text-xs text-neutral-500">{checkoutLabel}</p>
      <span className="mt-4 inline-flex text-xs font-semibold text-indigo-700 group-hover:text-indigo-800">
        {checkingOut ? "…" : checkoutLabel} →
      </span>
    </button>
  );
}
