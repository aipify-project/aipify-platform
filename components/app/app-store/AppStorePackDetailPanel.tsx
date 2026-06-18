"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseAppStorePackDetail, type AppStoreLabels, type AppStorePackDetail } from "@/lib/app-store";

export function AppStorePackDetailPanel({
  packKey,
  labels,
}: {
  packKey: string;
  labels: AppStoreLabels;
}) {
  const searchParams = useSearchParams();
  const installMode = searchParams.get("install") === "1";
  const upgradeMode = searchParams.get("upgrade") === "1";

  const [detail, setDetail] = useState<AppStorePackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<"detail" | "seats" | "review" | "done">("detail");
  const [seatTier, setSeatTier] = useState("5");
  const [reviewCost, setReviewCost] = useState<{ monthly_cost?: number | null; pricing_label?: string } | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/app/store/${encodeURIComponent(packKey)}`);
    if (res.ok) setDetail(parseAppStorePackDetail(await res.json()));
    else setDetail(null);
    setLoading(false);
  }, [packKey]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (installMode || upgradeMode) setStep("seats");
  }, [installMode, upgradeMode]);

  async function reviewInstall() {
    setBusy(true);
    const res = await fetch("/api/app/store/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: "review_install",
        pack_key: packKey,
        payload: { seat_tier: seatTier },
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      setReviewCost({
        monthly_cost: data.monthly_cost == null ? null : Number(data.monthly_cost),
        pricing_label: typeof data.pricing_label === "string" ? data.pricing_label : undefined,
      });
      setStep("review");
    }
    setBusy(false);
  }

  async function completeInstall() {
    setBusy(true);
    const actionType = upgradeMode ? "upgrade_pack" : "complete_install";
    const res = await fetch("/api/app/store/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: actionType,
        pack_key: packKey,
        payload: { seat_tier: seatTier, payment_confirmed: true },
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      setResultMessage(typeof data.message === "string" ? data.message : labels.installComplete);
      setStep("done");
      await load();
    }
    setBusy(false);
  }

  async function removePack() {
    if (!removeConfirm) {
      setRemoveConfirm(true);
      return;
    }
    setBusy(true);
    const res = await fetch("/api/app/store/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: "remove_pack",
        pack_key: packKey,
        payload: { confirmed: true },
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>;
      setResultMessage(typeof data.message === "string" ? data.message : labels.removeWarning);
    }
    setBusy(false);
    await load();
  }

  if (loading && !detail) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!detail?.found) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Link href="/app/store" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <p className="mt-4 text-gray-600">{labels.notFound}</p>
      </div>
    );
  }

  const tiers = detail.pricing?.seat_tiers ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <Link href="/app/store" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {detail.listing?.pack_name ?? packKey}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {detail.overview?.category as string} · {labels.version} {detail.overview?.version as string}
        </p>
      </div>

      {step === "done" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="font-medium text-emerald-900">{labels.installComplete}</p>
          <p className="mt-2 text-sm text-emerald-800">{resultMessage ?? labels.installCompleteHint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.listing?.workspace_route ? (
              <Link href={detail.listing.workspace_route} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
                {labels.openWorkspace}
              </Link>
            ) : null}
            <Link href="/app/settings/module-access" className="rounded-lg border border-indigo-200 px-4 py-2 text-sm text-indigo-800">
              {labels.manageAccess}
            </Link>
          </div>
        </div>
      ) : null}

      {step === "seats" ? (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-6">
          <h2 className="font-semibold text-indigo-950">{labels.selectSeats}</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {tiers.map((tier) => (
              <button
                key={tier.tier_key}
                type="button"
                onClick={() => setSeatTier(tier.tier_key)}
                className={`rounded-lg border px-4 py-3 text-left text-sm ${
                  seatTier === tier.tier_key
                    ? "border-indigo-600 bg-white ring-2 ring-indigo-200"
                    : "border-gray-200 bg-white hover:border-indigo-200"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={busy || seatTier === "enterprise"}
            onClick={() => void reviewInstall()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {seatTier === "enterprise" ? labels.enterpriseContact : labels.reviewCost}
          </button>
        </section>
      ) : null}

      {step === "review" ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">{labels.reviewCost}</h2>
          <p className="mt-2 text-lg font-semibold text-indigo-900">
            {reviewCost?.pricing_label ?? `${reviewCost?.monthly_cost ?? "—"} / month`}
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void completeInstall()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {labels.confirmPayment}
          </button>
        </section>
      ) : null}

      {step === "detail" ? (
        <>
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold text-gray-900">{labels.overview}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {String(detail.overview?.long_description ?? detail.listing?.short_description ?? "")}
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold text-gray-900">{labels.includedModules}</h2>
            <ul className="mt-3 space-y-2">
              {(detail.modules_included ?? []).map((m) => (
                <li key={m.module_key} className="text-sm text-gray-700">
                  <span className="font-medium">{m.module_name}</span>
                  {m.description ? <span className="text-gray-500"> — {m.description}</span> : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold text-gray-900">{labels.licenseRequirements}</h2>
            <p className="mt-2 text-sm text-gray-600">{detail.license_requirements}</p>
          </section>

          {detail.who_is_it_for ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="font-semibold text-gray-900">{labels.whoIsItFor}</h2>
              <p className="mt-2 text-sm text-gray-600">{detail.who_is_it_for}</p>
            </section>
          ) : null}

          {(detail.permissions_added?.length ?? 0) > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="font-semibold text-gray-900">{labels.permissionsAdded}</h2>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {detail.permissions_added?.map((p) => (
                  <li key={p.permission_key}>{p.permission_name}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {(detail.faq?.length ?? 0) > 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="font-semibold text-gray-900">{labels.faq}</h2>
              <dl className="mt-3 space-y-4">
                {detail.faq?.map((item) => (
                  <div key={item.question}>
                    <dt className="font-medium text-gray-900">{item.question}</dt>
                    <dd className="mt-1 text-sm text-gray-600">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {!detail.listing?.installed ? (
              <button
                type="button"
                onClick={() => setStep("seats")}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {labels.install}
              </button>
            ) : null}
            {detail.listing?.installed ? (
              <>
                <button
                  type="button"
                  onClick={() => { setStep("seats"); }}
                  className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900"
                >
                  {labels.upgrade}
                </button>
                <Link href="/app/settings/module-access" className="rounded-lg border border-indigo-200 px-4 py-2 text-sm text-indigo-800">
                  {labels.manageAccess}
                </Link>
                {!removeConfirm ? (
                  <button
                    type="button"
                    onClick={() => setRemoveConfirm(true)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-800"
                  >
                    {labels.remove}
                  </button>
                ) : (
                  <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-900">{labels.removeWarning}</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" disabled={busy} onClick={() => void removePack()} className="rounded-lg bg-red-700 px-3 py-1.5 text-sm text-white">
                        {labels.confirmRemove}
                      </button>
                      <button type="button" onClick={() => setRemoveConfirm(false)} className="rounded-lg border px-3 py-1.5 text-sm">
                        {labels.cancel}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
            <Link href="/app/support" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700">
              {labels.contactSales}
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
