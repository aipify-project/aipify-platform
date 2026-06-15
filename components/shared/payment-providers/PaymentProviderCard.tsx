"use client";

import {
  ProviderCard,
  ProviderCardActions,
  ProviderCardAssets,
  ProviderCardBody,
  ProviderCardConfiguration,
  ProviderCardConfigurationGroup,
  ProviderCardDetail,
  ProviderCardHeader,
  ProviderCardIntegration,
  ProviderCardOperationalDetails,
} from "@/components/payments/provider-card";
import { ProviderLogo } from "@/components/payments/provider-logo";
import { ProviderStatusBadge } from "@/components/payments/provider-status-badge";
import {
  PROVIDER_DOCUMENTATION_URLS,
  PROVIDER_SUPPORTED_COUNTRIES,
  PROVIDER_SUPPORTED_CURRENCIES,
  resolveProviderEnvironment,
  type PaymentProviderKey,
} from "@/lib/payment-providers";
import type { PaymentProviderCard as ProviderCardData, PaymentProviderLabels } from "@/lib/payment-providers";

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

function resolveDisplayStatus(card: ProviderCardData): string {
  if (card.webhook_status === "failed_verification") return "failed";
  if (!card.enabled && card.status === "disabled") return "disconnected";
  return card.status;
}

function resolveApiStatus(card: ProviderCardData): "connected" | "disconnected" | "pending" {
  if (card.status === "operational") return "connected";
  if (card.status === "disabled" || !card.enabled) return "disconnected";
  return "pending";
}

function resolveSettlementStatus(card: ProviderCardData): "completed" | "pending" | "failed" {
  if (card.webhook_status === "failed_verification") return "failed";
  if (card.status === "operational" && card.setup_completed) return "completed";
  return "pending";
}

function resolveStatusLabel(statusKey: string, labels: PaymentProviderLabels): string {
  return (
    labels.statuses[statusKey] ??
    labels.statuses[statusKey.replace(/_/g, "")] ??
    statusKey.replace(/_/g, " ")
  );
}

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
  const displayStatus = resolveDisplayStatus(card);
  const apiStatus = resolveApiStatus(card);
  const settlementStatus = resolveSettlementStatus(card);
  const environment = resolveProviderEnvironment(card.mode);
  const setupComplete =
    card.setup_completed ||
    card.setup_progress.configured_fields >= card.setup_progress.required_fields;
  const tagline = labels.providerProfiles[provider]?.tagline ?? "";
  const positioning = labels.providerProfiles[provider]?.positioning ?? "";
  const providerName = labels.providers[provider] ?? card.name;
  const currencies = PROVIDER_SUPPORTED_CURRENCIES[provider];
  const countries =
    card.regions.length > 0 ? card.regions : PROVIDER_SUPPORTED_COUNTRIES[provider];

  return (
    <ProviderCard>
      <ProviderCardAssets>
        <ProviderLogo
          provider={provider}
          alt={labels.providerProfiles[provider]?.logoAlt ?? providerName}
        />
      </ProviderCardAssets>

      <ProviderCardBody>
        <ProviderCardHeader
          title={providerName}
          tagline={tagline || undefined}
          description={positioning || undefined}
        />

        <ProviderCardConfiguration>
          <ProviderCardConfigurationGroup label={labels.fields.status}>
            <ProviderStatusBadge
              statusKey={displayStatus}
              label={resolveStatusLabel(displayStatus, labels)}
            />
          </ProviderCardConfigurationGroup>

          <ProviderCardConfigurationGroup label={labels.fields.capabilities}>
            <ul className="flex flex-wrap gap-1.5">
              {card.capabilities.map((cap) => (
                <li
                  key={cap}
                  className="rounded-md bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700 ring-1 ring-neutral-100"
                >
                  {labels.capabilities[cap] ?? cap}
                </li>
              ))}
            </ul>
          </ProviderCardConfigurationGroup>
        </ProviderCardConfiguration>

        <ProviderCardOperationalDetails>
          <ProviderCardDetail
            label={labels.fields.environment}
            value={labels.environments[environment] ?? environment}
          />
          <ProviderCardDetail
            label={labels.fields.apiStatus}
            value={labels.apiStatuses[apiStatus] ?? apiStatus}
          />
          <ProviderCardDetail
            label={labels.fields.webhookStatus}
            value={labels.webhookStatuses[card.webhook_status] ?? card.webhook_status}
          />
          <ProviderCardDetail
            label={labels.fields.settlementStatus}
            value={labels.settlementStatuses[settlementStatus] ?? settlementStatus}
          />
          <ProviderCardDetail
            label={labels.fields.setupStatus}
            value={
              <>
                {setupComplete ? labels.setupStatus.complete : labels.setupStatus.inProgress}
                {" "}
                <span className="font-normal text-neutral-500">
                  ({card.setup_progress.configured_fields}/{card.setup_progress.required_fields})
                </span>
              </>
            }
          />
          <ProviderCardDetail
            label={labels.fields.lastHealthCheck}
            value={
              card.last_health_check_at
                ? new Date(card.last_health_check_at).toLocaleString()
                : "—"
            }
          />
          <ProviderCardDetail
            label={labels.fields.currencies}
            value={currencies.join(", ")}
            className="sm:col-span-2"
          />
          <ProviderCardDetail
            label={labels.fields.countries}
            value={countries.join(" · ")}
            className="sm:col-span-2"
          />
        </ProviderCardOperationalDetails>

        <ProviderCardIntegration>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {labels.fields.webhookUrl}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 truncate text-xs text-neutral-800">{card.webhook_url}</code>
            <button
              type="button"
              onClick={onCopyWebhook}
              className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              {copied ? labels.copied : labels.copyUrl}
            </button>
          </div>
        </ProviderCardIntegration>

        <ProviderCardActions>
          {canEdit ? (
            <button
              type="button"
              onClick={onConfigure}
              className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              {labels.configure}
            </button>
          ) : null}
          {canEdit ? (
            <button
              type="button"
              disabled={testing}
              onClick={onTest}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 disabled:opacity-60"
            >
              {testing ? labels.testing : labels.testConnection}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onViewLogs}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
          >
            {labels.viewLogs}
          </button>
          <a
            href={PROVIDER_DOCUMENTATION_URLS[provider as PaymentProviderKey]}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
          >
            {labels.documentation}
          </a>
        </ProviderCardActions>
      </ProviderCardBody>
    </ProviderCard>
  );
}
