import type { ReactNode } from "react";
import { PROVIDER_CARD_CLASS } from "@/lib/payment-providers";

type ProviderCardSectionProps = {
  children: ReactNode;
  className?: string;
};

/** Root shell — equal height cards across the payment infrastructure grid. */
export function ProviderCard({ children, className }: ProviderCardSectionProps) {
  return (
    <article className={className ? `${PROVIDER_CARD_CLASS} ${className}` : PROVIDER_CARD_CLASS}>
      {children}
    </article>
  );
}

/** Official logo region — fixed 60px height for alignment across all providers. */
export function ProviderCardAssets({ children }: ProviderCardSectionProps) {
  return <div className="mb-6 shrink-0">{children}</div>;
}

export function ProviderCardHeader({
  title,
  tagline,
  description,
}: {
  title: string;
  tagline?: string;
  description?: string;
}) {
  return (
    <header className="space-y-2">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{title}</h2>
      {tagline ? (
        <p className="text-sm font-medium text-neutral-500">{tagline}</p>
      ) : null}
      {description ? (
        <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
      ) : null}
    </header>
  );
}

/** Status, capabilities, and operational telemetry. */
export function ProviderCardConfiguration({ children }: ProviderCardSectionProps) {
  return (
    <section className="mt-6 space-y-5 border-t border-neutral-100 pt-6">{children}</section>
  );
}

export function ProviderCardConfigurationGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** Operational details grid — environment, API, webhooks, settlement. */
export function ProviderCardOperationalDetails({ children }: ProviderCardSectionProps) {
  return (
    <dl className="grid gap-4 border-t border-neutral-100 pt-6 text-sm sm:grid-cols-2">
      {children}
    </dl>
  );
}

export function ProviderCardDetail({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-1.5 font-medium text-neutral-900">{value}</dd>
    </div>
  );
}

/** Webhook URL and integration endpoints. */
export function ProviderCardIntegration({ children }: ProviderCardSectionProps) {
  return (
    <div className="mt-5 rounded-xl border border-neutral-100 bg-neutral-50/80 px-4 py-3.5">
      {children}
    </div>
  );
}

/** Action row — pinned to card bottom for equal button placement. */
export function ProviderCardActions({ children }: ProviderCardSectionProps) {
  return (
    <div className="mt-auto flex flex-wrap gap-2.5 border-t border-neutral-100 pt-6">
      {children}
    </div>
  );
}

export function ProviderCardBody({ children }: ProviderCardSectionProps) {
  return <div className="flex flex-1 flex-col">{children}</div>;
}
