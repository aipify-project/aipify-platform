"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseDomainLicenseCenter,
  type DomainLicenseCenter,
  type DomainLicenseLabels,
} from "@/lib/domain-license";
import {
  resolveDomainPlatformLabel,
  resolveDomainStatusLabel,
} from "@/lib/domain-license/labels";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { WebsiteKompisDomainSettingsCard } from "@/components/app/domain-license/WebsiteKompisDomainSettingsCard";

type Tab = "overview" | "active" | "pending" | "licenses" | "packs";

export function DomainLicenseCenterPanel({ labels }: { labels: DomainLicenseLabels }) {
  const [center, setCenter] = useState<DomainLicenseCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [platform, setPlatform] = useState("custom_website");
  const [expandedDomainId, setExpandedDomainId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const retryDelaysMs = [0, 350, 900];
    for (let attempt = 0; attempt < retryDelaysMs.length; attempt += 1) {
      const delay = retryDelaysMs[attempt] ?? 0;
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      const res = await fetch("/api/app/domains");
      if (res.ok) {
        const parsed = parseDomainLicenseCenter(await res.json());
        if (parsed?.found) {
          setCenter(parsed);
          setLoading(false);
          return;
        }
      }
    }
    setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function addDomain() {
    if (!newDomain.trim()) return;
    setBusy(true);
    await fetch("/api/app/domains/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: "create_domain",
        payload: { domain: newDomain.trim(), connected_platform: platform },
      }),
    });
    setNewDomain("");
    setBusy(false);
    await load();
  }

  async function purchaseLicense() {
    setBusy(true);
    await fetch("/api/app/domains/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "purchase_domain_license", payload: { quantity: 1 } }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return (
      <AipifyModuleAccessDenied message={labels.accessDenied} />
    );
  }

  const summary = center.license_summary;
  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "active", label: labels.activeDomains },
    { key: "pending", label: labels.pendingDomains },
    { key: "licenses", label: labels.domainLicenses },
    { key: "packs", label: labels.installedPacks },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        <Link href={center.store_route ?? "/app/store"} className="mt-3 inline-block text-sm text-indigo-700 hover:underline">
          {labels.storeLink}
        </Link>
      </div>

      {summary ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm uppercase tracking-wide text-gray-500">{labels.purchased}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.purchased}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm uppercase tracking-wide text-gray-500">{labels.used}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{summary.used}</p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <p className="text-sm uppercase tracking-wide text-indigo-700">{labels.available}</p>
            <p className="mt-1 text-2xl font-semibold text-indigo-950">{summary.available}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" || tab === "active" ? (
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(center.active_domains ?? []).map((d) => {
            const isExpanded = expandedDomainId === d.id;
            return (
              <article
                key={d.id}
                className={`flex w-full flex-col self-start rounded-xl border bg-white shadow-sm transition-colors ${
                  isExpanded ? "border-indigo-200 ring-1 ring-indigo-100" : "border-gray-200"
                }`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedDomainId(isExpanded ? null : d.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setExpandedDomainId(isExpanded ? null : d.id);
                    }
                  }}
                  className="cursor-pointer rounded-xl p-4 text-left hover:bg-gray-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <header className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-gray-900">{d.display_name ?? d.domain}</p>
                        <p className="truncate text-sm text-gray-600">{d.domain}</p>
                      </div>
                      {d.is_primary ? (
                        <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                          {labels.primary}
                        </span>
                      ) : null}
                    </div>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-gray-600">
                      <div className="min-w-0">
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{labels.platform}</dt>
                        <dd className="truncate">{resolveDomainPlatformLabel(labels, d.connected_platform)}</dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{labels.status}</dt>
                        <dd>{resolveDomainStatusLabel(labels, d.domain_status)}</dd>
                      </div>
                    </dl>
                    {(d.installed_packs ?? []).length > 0 ? (
                      <p className="line-clamp-2 text-xs text-gray-700">
                        {labels.packs}: {(d.installed_packs ?? []).map((p) => p.pack_key.replace(/_/g, " ")).join(", ")}
                      </p>
                    ) : null}
                  </header>

                  {!isExpanded ? (
                    <WebsiteKompisDomainSettingsCard
                      domainId={d.id}
                      domain={d.domain}
                      labels={labels.websiteKompis}
                      expanded={false}
                    />
                  ) : null}

                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-700">
                    {isExpanded ? labels.collapseDomainDetails : labels.expandDomainDetails}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </span>
                </div>

                {isExpanded ? (
                  <div
                    className="border-t border-gray-100 px-4 pb-4"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                  >
                    <WebsiteKompisDomainSettingsCard
                      domainId={d.id}
                      domain={d.domain}
                      labels={labels.websiteKompis}
                      expanded
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}

      {tab === "pending" ? (
        <div className="space-y-3">
          {(center.pending_domains ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">{labels.pendingDomainsNone}</p>
          ) : (
            (center.pending_domains ?? []).map((d) => (
              <div key={d.id} className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                <p className="font-medium text-gray-900">{d.domain}</p>
                <p className="text-sm text-gray-600">
                  {resolveDomainPlatformLabel(labels, d.connected_platform)}
                  {d.verification_status
                    ? ` · ${resolveDomainStatusLabel(labels, d.verification_status)}`
                    : null}
                </p>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "licenses" ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
          <p className="text-sm text-gray-600">
            {labels.licensesUsage
              .replace("{{included}}", String(summary?.included ?? 1))
              .replace("{{additional}}", String(summary?.purchased_additional ?? 0))}
          </p>
          <button type="button" disabled={busy} onClick={() => void purchaseLicense()} className="text-sm font-medium text-indigo-700 hover:underline disabled:opacity-60">
            {labels.purchaseLicense}
          </button>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-900">{labels.addDomain}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <input value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder={labels.domainPlaceholder} className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                {(center.supported_platforms ?? []).map((p) => (
                  <option key={p} value={p}>{resolveDomainPlatformLabel(labels, p)}</option>
                ))}
              </select>
              <button type="button" disabled={busy} onClick={() => void addDomain()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {labels.save}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "packs" ? (
        <ul className="space-y-2 text-sm">
          {(center.installed_packs ?? []).map((row, i) => (
            <li key={`${row.domain_id}-${row.pack_key}-${i}`} className="rounded-lg border border-gray-100 px-3 py-2">
              <span className="font-medium">{row.pack_key.replace(/_/g, " ")}</span>
              <span className="text-gray-500"> · {row.domain}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
