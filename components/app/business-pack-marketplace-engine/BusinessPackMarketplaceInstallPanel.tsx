"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { packLandingRoute } from "@/lib/aipify/business-pack-identity-engine";
import {
  parseBusinessPackMarketplaceInstall,
  type BusinessPackMarketplaceInstall,
} from "@/lib/aipify/business-pack-marketplace-engine";

type Props = { packKey: string; labels: Record<string, string> };

const STEP_ORDER = [
  "choose_license",
  "accept_terms",
  "choose_languages",
  "review_permissions",
  "activate",
  "guided_setup",
  "ready",
];

export function BusinessPackMarketplaceInstallPanel({ packKey, labels }: Props) {
  const [install, setInstall] = useState<BusinessPackMarketplaceInstall | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/business-pack-marketplace-engine/install?packKey=${encodeURIComponent(packKey)}`);
    if (res.ok) setInstall(parseBusinessPackMarketplaceInstall(await res.json()));
    setLoading(false);
  }, [packKey]);

  useEffect(() => { void load(); }, [load]);

  const activate = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/aipify/business-pack-marketplace-engine/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "activate_pack", pack_key: packKey }),
    });
    const body = (await res.json()) as { message?: string; error?: string };
    if (!res.ok) setMessage(body.error ?? labels.actionFailed);
    else setMessage(body.message ?? labels.activateSuccess);
    await load();
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (!install?.found || !install.listing) {
    return (
      <PlatformEmptyState
        title={labels.notFoundTitle}
        message={labels.notFoundMessage}
        primaryAction={{ label: labels.backToMarketplace, href: "/app/marketplace/business-packs" }}
      />
    );
  }

  const { listing, workflow_step, step_routes, installation_flow } = install;
  const currentIdx = STEP_ORDER.indexOf(workflow_step ?? "choose_license");

  return (
    <div className="space-y-8">
      <header className="border-b border-gray-200 pb-6">
        <p className="text-sm font-medium text-indigo-700">{labels.installWorkflow}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{listing.pack_name}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.installSubtitle}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href={packLandingRoute(packKey)} className="font-medium text-indigo-700 hover:text-indigo-900">
            {labels.viewPack}
          </Link>
          <Link href="/app/marketplace/business-packs" className="font-medium text-gray-600 hover:text-gray-900">
            {labels.backToMarketplace}
          </Link>
        </div>
      </header>

      {install.activation_blocked_pending_legal && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">{labels.legalRequiredTitle}</p>
          <p className="mt-1">{labels.legalRequiredMessage}</p>
          <Link href={step_routes?.accept_terms ?? listing.install_route} className="mt-2 inline-block font-medium text-amber-900 underline">
            {labels.acceptTerms}
          </Link>
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.installationFlow}</h2>
        <ol className="mt-4 space-y-3">
          {STEP_ORDER.map((step, idx) => {
            const route = step_routes?.[step];
            const isCurrent = step === workflow_step;
            const isDone = idx < currentIdx || workflow_step === "ready";
            return (
              <li
                key={step}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
                  isCurrent ? "border-indigo-300 bg-indigo-50/50" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      isDone ? "bg-emerald-100 text-emerald-800" : isCurrent ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isDone ? "✓" : idx + 1}
                  </span>
                  <span className="text-sm font-medium capitalize text-gray-900">{step.replace(/_/g, " ")}</span>
                </div>
                {route && !isDone && (
                  <Link href={route} className="text-sm font-medium text-indigo-700 hover:text-indigo-900">
                    {labels.openStep}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {(installation_flow ?? []).length > 0 && (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5">
          <h2 className="text-sm font-semibold text-indigo-900">{labels.commercialPrinciples}</h2>
          <ul className="mt-2 space-y-1 text-sm text-indigo-950">
            {(install.commercial_principles ?? []).map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy || install.activation_blocked_pending_legal}
          onClick={() => void activate()}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {labels.activatePack}
        </button>
        {listing.workspace_route && workflow_step === "ready" && (
          <Link
            href={listing.workspace_route}
            className="rounded-lg border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
          >
            {labels.openWorkspace}
          </Link>
        )}
      </div>
    </div>
  );
}
