"use client";

import type { BillingExperienceLabels } from "@/lib/billing-experience";
import { InstantActivationCheckoutCard } from "./InstantActivationCheckoutCard";
import {
  SELF_SERVICE_PAYMENT_PROVIDERS,
  type PaymentProviderLabels,
  type SelfServicePaymentProviderKey,
} from "@/lib/payment-providers";
import { PaymentProviderCard } from "@/components/shared/payment-providers/PaymentProviderCard";
import type { PaymentProviderCard as ProviderCardData } from "@/lib/payment-providers";

type InstantActivationSectionProps = {
  billingLabels: BillingExperienceLabels;
  providerLabels: PaymentProviderLabels;
  mode: "checkout" | "admin";
  providers: ProviderCardData[];
  canEdit?: boolean;
  testing?: SelfServicePaymentProviderKey | null;
  checkingOut?: SelfServicePaymentProviderKey | null;
  onConfigure?: (card: ProviderCardData) => void;
  onTest?: (provider: SelfServicePaymentProviderKey) => void;
  onViewLogs?: (provider: SelfServicePaymentProviderKey) => void;
  onCopyWebhook?: (url: string) => void;
  copiedUrl?: string | null;
  onCheckout?: (provider: SelfServicePaymentProviderKey) => void;
};

export function InstantActivationSection({
  billingLabels,
  providerLabels,
  mode,
  providers,
  canEdit = false,
  testing = null,
  checkingOut = null,
  onConfigure,
  onTest,
  onViewLogs,
  onCopyWebhook,
  copiedUrl = null,
  onCheckout,
}: InstantActivationSectionProps) {
  const selfService =
    providers.filter((p) =>
      (SELF_SERVICE_PAYMENT_PROVIDERS as readonly string[]).includes(p.provider_key)
    ) ?? [];

  return (
    <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
        {billingLabels.instantActivation.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
        {billingLabels.instantActivation.description}
      </p>
      <p className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-relaxed text-neutral-800">
        {billingLabels.instantActivation.message}
      </p>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {billingLabels.instantActivation.activateWith}
      </p>
      <div className="mt-4 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mode === "checkout"
          ? selfService.map((card) => {
              const key = card.provider_key as SelfServicePaymentProviderKey;
              return (
                <InstantActivationCheckoutCard
                  key={card.provider_key}
                  provider={key}
                  providerName={providerLabels.providers[key] ?? card.name}
                  checkoutLabel={billingLabels.instantActivation.checkout}
                  checkingOut={checkingOut === key}
                  onCheckout={() => onCheckout?.(key)}
                />
              );
            })
          : selfService.map((card) => (
              <PaymentProviderCard
                key={card.provider_key}
                card={card}
                labels={providerLabels}
                canEdit={canEdit}
                testing={testing === card.provider_key}
                onConfigure={() => onConfigure?.(card)}
                onTest={() => onTest?.(card.provider_key as SelfServicePaymentProviderKey)}
                onViewLogs={() => onViewLogs?.(card.provider_key as SelfServicePaymentProviderKey)}
                onCopyWebhook={() => onCopyWebhook?.(card.webhook_url)}
                copied={copiedUrl === card.webhook_url}
              />
            ))}
      </div>
    </section>
  );
}
