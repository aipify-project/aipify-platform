"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatBusinessPackSettingsPlanLabel, parseBusinessPackSettingsCenter, type BusinessPackSettingsAccessState, type BusinessPackSettingsCenter, type BusinessPackSettingsLabels } from "@/lib/app-portal/business-pack-settings";

type Props = {
  labels: BusinessPackSettingsLabels;
};

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 11V7a4 4 0 10-8 0v4M5 11h14v10H5V11z"
      />
    </svg>
  );
}

function StatusBadge({
  statusKey,
  labels,
}: {
  statusKey: string;
  labels: BusinessPackSettingsLabels;
}) {
  const label =
    labels.packStatus[statusKey as keyof typeof labels.packStatus] ?? statusKey;
  const icon =
    statusKey === "active"
      ? "✅"
      : statusKey === "activationInProgress"
        ? "⏳"
        : statusKey === "requiresAttention"
          ? "⚠️"
          : statusKey === "activationFailed"
            ? "❌"
            : statusKey === "suspended"
              ? "🔒"
              : statusKey === "updateAvailable"
                ? "ℹ️"
                : "•";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800">
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

function ValueCards({ labels }: { labels: BusinessPackSettingsLabels }) {
  const cards = [
    labels.valueCards.packConfiguration,
    labels.valueCards.activationStatus,
    labels.valueCards.dependencies,
    labels.valueCards.accessManagement,
    labels.valueCards.healthValidation,
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900">{card.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
        </article>
      ))}
    </div>
  );
}

function PageHeader({ labels }: { labels: BusinessPackSettingsLabels }) {
  return (
    <header className="space-y-4">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>{labels.breadcrumbBusinessPacks}</li>
          <li aria-hidden="true">→</li>
          <li className="font-medium text-slate-800">{labels.breadcrumbSettings}</li>
        </ol>
      </nav>
      <Link
        href="/app/business-packs/available"
        className="inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-800"
      >
        ← {labels.backToBusinessPacks}
      </Link>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
          {labels.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.description}</p>
      </div>
    </header>
  );
}

function StatePanel({
  state,
  center,
  labels,
  onRetry,
  busy,
}: {
  state: BusinessPackSettingsAccessState;
  center: BusinessPackSettingsCenter | null;
  labels: BusinessPackSettingsLabels;
  onRetry?: () => void;
  busy?: boolean;
}) {
  const upgradeHref =
    center?.upgrade_href ??
    "/app/billing/upgrade?capability=business_pack_settings&return=%2Fapp%2Fbusiness-packs%2Fsettings";

  const stateCopy = (() => {
    switch (state) {
      case "plan_required":
        return labels.states.planRequired;
      case "pending_activation":
        return labels.states.pendingActivation;
      case "activation_failed":
        return labels.states.activationFailed;
      case "suspended":
        return labels.states.suspended;
      case "no_installed_packs":
        return labels.states.noInstalledPacks;
      case "permission_missing":
        return labels.states.permissionMissing;
      case "organization_context_missing":
        return labels.states.organizationContextMissing;
      case "subscription_inactive":
        return labels.states.subscriptionInactive;
      case "license_inactive":
        return labels.states.licenseInactive;
      case "entitlement_missing":
        return labels.states.entitlementMissing;
      case "load_error":
        return labels.loadError;
      default:
        return labels.states.planRequired;
    }
  })();

  const showUpgrade = ["plan_required", "entitlement_missing", "subscription_inactive", "license_inactive"].includes(state);
  const showExplore = state !== "load_error";
  const showContact =
    state === "plan_required" || state === "activation_failed" || state === "suspended";
  const showSupport = state === "activation_failed";
  const showRetry = state === "load_error";
  const isPlanLocked = state === "plan_required" || state === "entitlement_missing";

  const panelIcon = isPlanLocked ? null : state === "pending_activation" ? "⏳" : state === "activation_failed" ? "⚠️" : state === "suspended" ? "🔒" : state === "no_installed_packs" ? "ℹ️" : state === "load_error" ? "⚠️" : "🔒";

  const formattedCurrentPlan = center?.current_plan
    ? formatBusinessPackSettingsPlanLabel(center.current_plan, labels)
    : null;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          {isPlanLocked ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <LockIcon className="h-5 w-5" />
            </div>
          ) : panelIcon ? (
            <span className="text-2xl" aria-hidden="true">
              {panelIcon}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-slate-900">{stateCopy.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{stateCopy.body}</p>
            {isPlanLocked && formattedCurrentPlan ? (
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.currentPlan}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">{formattedCurrentPlan}</dd>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                    {labels.requiredPlan}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-amber-950">
                    {labels.requiredPlanValue}
                  </dd>
                </div>
              </dl>
            ) : null}
            {isPlanLocked ? (
              <p className="mt-4 text-sm text-slate-600">{labels.capabilitySummary}</p>
            ) : null}
            {!isPlanLocked && center?.current_plan ? (
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.currentPlan}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">
                    {formatBusinessPackSettingsPlanLabel(center.current_plan, labels)}
                  </dd>
                </div>
              </dl>
            ) : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {showUpgrade ? (
                <Link
                  href={upgradeHref}
                  className="inline-flex justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {labels.viewUpgradeOptions}
                </Link>
              ) : null}
              {showExplore ? (
                <Link
                  href="/app/business-packs/available"
                  className="inline-flex justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  {labels.exploreAvailable}
                </Link>
              ) : null}
              {showContact ? (
                <Link
                  href="/app/support/contact"
                  className="inline-flex justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {labels.contactSales}
                </Link>
              ) : null}
              {showSupport ? (
                <Link
                  href="/app/support/contact"
                  className="inline-flex justify-center rounded-lg border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
                >
                  {labels.contactSupport}
                </Link>
              ) : null}
              {showRetry ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={onRetry}
                  className="inline-flex justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {labels.retry}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      {isPlanLocked ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{labels.whatYouUnlock}</h2>
          <ValueCards labels={labels} />
        </section>
      ) : null}
    </div>
  );
}

function ActivePackList({
  center,
  labels,
}: {
  center: BusinessPackSettingsCenter;
  labels: BusinessPackSettingsLabels;
}) {
  const packs = center.packs ?? [];

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">{labels.title}</h2>
      <div className="grid gap-4">
        {packs.map((pack) => (
          <article
            key={pack.pack_key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-50 text-lg font-bold text-indigo-800">
                  {pack.pack_logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pack.pack_logo_url}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    pack.pack_name.charAt(0)
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{pack.pack_name}</h3>
                    <StatusBadge statusKey={pack.display_status_key} labels={labels} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{pack.short_description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {labels.version} {pack.version}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {pack.configure_href ? (
                  <Link
                    href={pack.configure_href}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-100"
                  >
                    {labels.configure}
                  </Link>
                ) : null}
                {pack.workspace_route ? (
                  <Link
                    href={pack.workspace_route}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    {labels.openWorkspace}
                  </Link>
                ) : null}
              </div>
            </div>
            <dl className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
              {pack.dependencies.length > 0 ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.dependencies}
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">{pack.dependencies.join(", ")}</dd>
                </div>
              ) : null}
              {pack.integrations.length > 0 ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.integrations}
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">{pack.integrations.join(", ")}</dd>
                </div>
              ) : null}
              {pack.access_summary ? (
                <div className="sm:col-span-2 lg:col-span-1">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {labels.accessSummary}
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">{pack.access_summary}</dd>
                </div>
              ) : null}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BusinessPackSettingsPanel({ labels }: Props) {
  const [center, setCenter] = useState<BusinessPackSettingsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    setLoading(true);
    const res = await fetch("/api/app/business-packs/settings");
    if (res.ok) {
      setCenter(parseBusinessPackSettingsCenter(await res.json()));
    } else {
      setCenter({ found: false, access_state: "load_error" });
    }
    setLoading(false);
    setBusy(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  const accessState = center?.access_state ?? "load_error";
  const isActive = accessState === "active";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">
      <PageHeader labels={labels} />
      {isActive && center ? (
        <ActivePackList center={center} labels={labels} />
      ) : (
        <StatePanel
          state={accessState}
          center={center}
          labels={labels}
          onRetry={() => void load()}
          busy={busy}
        />
      )}
    </div>
  );
}
