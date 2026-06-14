"use client";

import {
  PROVIDER_CARD_CLASS,
  PROVIDER_DOCUMENTATION_URLS,
  PROVIDER_LOGO_CONTAINER_CLASS,
  STATUS_VISUAL,
  type PaymentProviderKey,
} from "@/lib/payment-providers";
import type { PaymentProviderCard as ProviderCardData, PaymentProviderLabels } from "@/lib/payment-providers";
import { PaymentProviderLogo } from "./PaymentProviderLogo";

type PaymentProviderCardProps = {
  card: ProviderCardData;
  labels: PaymentProviderLabels;
  canEdit: boolean;
  testing: boolean;
  onConfigure: () => void;
  onTest: () => void;
  onViewLogs: () => void;
  onCopyWebhook: () => void;
  copied: boolean;
};

export function PaymentProviderCard({
  card,
  labels,
  canEdit,
  testing,
  onConfigure,
  onTest,
  onViewLogs,
  onCopyWebhook,
  copied,
}: PaymentProviderCardProps) {
  const provider = card.provider_key;
  const statusVisual = STATUS_VISUAL[card.status] ?? STATUS_VISUAL.pending_setup;
  const setupComplete =
    card.setup_completed ||
    card.setup_progress.configured_fields >= card.setup_progress.required_fields;
  const tagline = labels.providerProfiles[provider]?.tagline ?? "";
  const positioning = labels.providerProfiles[provider]?.positioning ?? "";
  const providerName = labels.providers[provider] ?? card.name;

  return (
    <article className={PROVIDER_CARD_CLASS}>
      <div className={PROVIDER_LOGO_CONTAINER_CLASS}>
        <PaymentProviderLogo
          provider={provider}
          alt={labels.providerProfiles[provider]?.logoAlt ?? providerName}
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{providerName}</h2>
            {tagline && (
              <p className="mt-1 text-sm font-medium text-neutral-500">{tagline}</p>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
            {labels.modes[card.mode] ?? card.mode}
          </span>
        </div>

        {positioning && (
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{positioning}</p>
        )}

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {labels.fields.status}
          </p>
          <div
            className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusVisual.badge}`}
            role="status"
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${statusVisual.dot}`}
              aria-hidden="true"
            />
            <span>{labels.statuses[card.status] ?? card.status}</span>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {labels.fields.capabilities}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {card.capabilities.map((cap) => (
              <li
                key={cap}
                className="rounded-md bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700 ring-1 ring-neutral-100"
              >
                {labels.capabilities[cap] ?? cap}
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-neutral-500">{labels.fields.setupStatus}</dt>
            <dd className="mt-1 text-neutral-900">
              {setupComplete ? labels.setupStatus.complete : labels.setupStatus.inProgress}
              {" "}
              <span className="text-neutral-500">
                ({card.setup_progress.configured_fields}/{card.setup_progress.required_fields})
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-neutral-500">{labels.fields.lastHealthCheck}</dt>
            <dd className="mt-1 text-neutral-900">
              {card.last_health_check_at
                ? new Date(card.last_health_check_at).toLocaleString()
                : "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3">
          <p className="text-xs font-medium text-neutral-500">{labels.fields.webhookUrl}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <code className="flex-1 truncate text-xs text-neutral-800">{card.webhook_url}</code>
            <button
              type="button"
              onClick={onCopyWebhook}
              className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              {copied ? labels.copied : labels.copyUrl}
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-600">
            {labels.fields.webhookStatus}:{" "}
            {labels.webhookStatuses[card.webhook_status] ?? card.webhook_status}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {canEdit && (
            <button
              type="button"
              onClick={onConfigure}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              {labels.configure}
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              disabled={testing}
              onClick={onTest}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 disabled:opacity-60"
            >
              {testing ? labels.testing : labels.testConnection}
            </button>
          )}
          <button
            type="button"
            onClick={onViewLogs}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
          >
            {labels.viewLogs}
          </button>
          <a
            href={PROVIDER_DOCUMENTATION_URLS[provider as PaymentProviderKey]}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
          >
            {labels.documentation}
          </a>
        </div>
      </div>
    </article>
  );
}
