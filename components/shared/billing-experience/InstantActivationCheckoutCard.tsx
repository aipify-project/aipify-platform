"use client";

import {
  ProviderCard,
  ProviderCardActions,
  ProviderCardAssets,
  ProviderCardBody,
} from "@/components/payments/provider-card";
import { ProviderLogo } from "@/components/payments/provider-logo";
import type { SelfServicePaymentProviderKey } from "@/lib/payment-providers";

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
    <ProviderCard className="cursor-pointer border-neutral-200/90 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <button
        type="button"
        disabled={checkingOut}
        onClick={onCheckout}
        className="flex h-full w-full flex-col text-left disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ProviderCardAssets>
          <ProviderLogo provider={provider} alt={providerName} />
        </ProviderCardAssets>
        <ProviderCardBody>
          <p className="text-lg font-semibold tracking-tight text-neutral-900">{providerName}</p>
          <p className="mt-2 text-sm text-neutral-600">{checkoutLabel}</p>
          <ProviderCardActions>
            <span className="inline-flex rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white">
              {checkingOut ? "…" : checkoutLabel} →
            </span>
          </ProviderCardActions>
        </ProviderCardBody>
      </button>
    </ProviderCard>
  );
}
