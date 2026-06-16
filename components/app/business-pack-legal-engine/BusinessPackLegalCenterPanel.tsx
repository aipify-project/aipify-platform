"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { packLandingRoute } from "@/lib/aipify/business-pack-identity-engine";
import {
  parseBusinessPackLegalCenter,
  type BusinessPackLegalCenter,
  type LegalDocument,
} from "@/lib/aipify/business-pack-legal-engine";

type Props = { packKey: string; labels: Record<string, string> };

function DocumentCard({
  doc,
  labels,
  expanded,
  onToggle,
}: {
  doc: LegalDocument;
  labels: Record<string, string>;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
      >
        <div>
          <h3 className="font-semibold text-gray-900">{doc.title}</h3>
          <p className="mt-1 text-xs text-gray-500">
            {labels.version} {doc.version} · {labels.effectiveDate} {doc.effective_date}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {doc.requires_acceptance && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                doc.accepted
                  ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                  : "bg-amber-50 text-amber-900 ring-amber-200"
              }`}
            >
              {doc.accepted ? labels.accepted : labels.acceptanceRequired}
            </span>
          )}
          <span className="text-sm text-indigo-700">{expanded ? labels.hideDocument : labels.viewDocument}</span>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{doc.body ?? doc.body_template}</p>
        </div>
      )}
    </article>
  );
}

export function BusinessPackLegalCenterPanel({ packKey, labels }: Props) {
  const [center, setCenter] = useState<BusinessPackLegalCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/aipify/business-pack-legal-engine/center?packKey=${encodeURIComponent(packKey)}`);
      if (res.ok) setCenter(parseBusinessPackLegalCenter(await res.json()));
    } catch {
      setCenter(null);
    }
    setLoading(false);
  }, [packKey]);

  useEffect(() => { void load(); }, [load]);

  const acceptRequired = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/aipify/business-pack-legal-engine/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "accept_required_documents", pack_key: packKey }),
    });
    const body = (await res.json()) as { message?: string; error?: string };
    if (!res.ok) {
      setMessage(body.error ?? labels.actionFailed);
    } else {
      setMessage(body.message ?? labels.acceptSuccess);
      await load();
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader label={labels.loading} />
      </div>
    );
  }

  if (!center?.found || !center.definition) {
    return (
      <PlatformEmptyState
        title={labels.notFoundTitle}
        message={labels.notFoundMessage}
        primaryAction={{ label: labels.backToMarketplace, href: "/app/marketplace/activation" }}
      />
    );
  }

  const { definition, overview, documents, acceptance_required, company } = center;
  const pendingAcceptance = (acceptance_required ?? []).filter((item) => !item.accepted);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <p className="text-sm font-medium text-indigo-700">{labels.legalCenter}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">{definition.pack_name}</h1>
          {center.principle && <p className="mt-2 text-sm text-gray-600">{center.principle}</p>}
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={packLandingRoute(packKey)} className="font-medium text-indigo-700 hover:text-indigo-900">
            {labels.viewPack}
          </Link>
          <Link href="/app/marketplace/activation" className="font-medium text-gray-600 hover:text-gray-900">
            {labels.backToMarketplace}
          </Link>
        </div>
      </header>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</div>
      )}

      {overview?.activation_blocked && pendingAcceptance.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
          <p className="font-medium text-amber-950">{labels.activationBlockedTitle}</p>
          <p className="mt-1 text-sm text-amber-900">{labels.activationBlockedMessage}</p>
          <ul className="mt-2 space-y-1 text-sm text-amber-900">
            {pendingAcceptance.map((item) => (
              <li key={item.document_key}>· {item.title} ({labels.version} {item.version})</li>
            ))}
          </ul>
          <button
            type="button"
            disabled={busy}
            onClick={() => void acceptRequired()}
            className="mt-3 rounded-lg bg-amber-900 px-4 py-2 text-sm font-medium text-white hover:bg-amber-950 disabled:opacity-60"
          >
            {labels.acceptRequired}
          </button>
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.overview}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.governingLaw}</dt>
            <dd className="mt-1 text-sm text-gray-900">{overview?.governing_law ?? definition.governing_law}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.jurisdiction}</dt>
            <dd className="mt-1 text-sm text-gray-900">{overview?.jurisdiction ?? definition.jurisdiction}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.publicationStatus}</dt>
            <dd className="mt-1 text-sm capitalize text-gray-900">{overview?.publication_status?.replace(/_/g, " ") ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{labels.allRequiredAccepted}</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {overview?.all_required_accepted ? labels.yes : labels.no}
            </dd>
          </div>
        </dl>
      </section>

      {definition.pack_terms && Object.keys(definition.pack_terms).length > 0 && (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-6">
          <h2 className="text-sm font-semibold text-indigo-900">{labels.packTerms}</h2>
          <dl className="mt-4 space-y-3">
            {Object.entries(definition.pack_terms).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  {labels[`term_${key}`] ?? key.replace(/_/g, " ")}
                </dt>
                <dd className="mt-1 text-sm text-indigo-950">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {company && (
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-sm font-semibold text-gray-900">{labels.legalEntity}</h2>
          <p className="mt-2 text-sm text-gray-700">
            {company.legal_company_name} · Org. {company.organization_number}
          </p>
          <p className="text-sm text-gray-600">
            {company.headquarters_address}, {company.country} · {company.contact_email} · {company.website}
          </p>
          <p className="mt-2 text-xs text-gray-500">{labels.companyConfigNote}</p>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{labels.availableDocuments}</h2>
        {(documents ?? []).map((doc) => (
          <DocumentCard
            key={`${doc.document_key}-${doc.version}`}
            doc={doc}
            labels={labels}
            expanded={expandedKey === doc.document_key}
            onToggle={() => setExpandedKey(expandedKey === doc.document_key ? null : doc.document_key)}
          />
        ))}
      </section>

      {center.governance_note && (
        <p className="text-center text-xs text-gray-500">{center.governance_note}</p>
      )}
    </div>
  );
}
