"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { CspBankPanelLabels } from "@/lib/partners-portal/csp-section-labels";

export type { CspBankPanelLabels };

type Phase = "loading" | "ready" | "unavailable" | "error";

type ProfileView = {
  hasProfile: boolean;
  maskedHint: string | null;
  accountHolder: string | null;
  country: string | null;
  currency: string | null;
  status: string | null;
};

function parseProfile(payload: unknown): ProfileView {
  const root = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const profile =
    root.profile && typeof root.profile === "object"
      ? (root.profile as Record<string, unknown>)
      : root;
  const masked =
    (typeof profile.masked_hint === "string" && profile.masked_hint) ||
    (typeof profile.iban === "string" && profile.iban) ||
    (typeof profile.masked_iban === "string" && profile.masked_iban) ||
    null;
  return {
    hasProfile: profile.has_profile === true || Boolean(masked),
    maskedHint: masked,
    accountHolder:
      typeof profile.account_holder === "string"
        ? profile.account_holder
        : typeof profile.accountHolder === "string"
          ? profile.accountHolder
          : null,
    country: typeof profile.country === "string" ? profile.country : null,
    currency: typeof profile.currency === "string" ? profile.currency : null,
    status: typeof profile.status === "string" ? profile.status : null,
  };
}

/**
 * Partner payout bank details — masked display + save via Core encryption route.
 * Never shows a full IBAN after save. Fail-closed when encryption key / RPC missing.
 */
export function CertifiedSalesPartnerBankPanel({ labels }: { labels: CspBankPanelLabels }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [profile, setProfile] = useState<ProfileView | null>(null);
  const [accountHolder, setAccountHolder] = useState("");
  const [country, setCountry] = useState("NO");
  const [currency, setCurrency] = useState("NOK");
  const [iban, setIban] = useState("");
  const [swiftBic, setSwiftBic] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setPhase("loading");
    setNotice(null);
    try {
      const res = await fetch("/api/certified-sales-partner/bank-profile", { cache: "no-store" });
      const body = await res.json().catch(() => null);
      if (res.status === 503 || (body && body.backend_ready === false)) {
        setProfile(null);
        setPhase("unavailable");
        return;
      }
      if (!res.ok) {
        setProfile(null);
        setPhase("error");
        return;
      }
      const view = parseProfile(body);
      setProfile(view);
      if (view.accountHolder) setAccountHolder(view.accountHolder);
      if (view.country) setCountry(view.country);
      if (view.currency) setCurrency(view.currency);
      setPhase("ready");
    } catch {
      setProfile(null);
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/certified-sales-partner/bank-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_holder: accountHolder,
          country,
          currency,
          iban,
          swift_bic: swiftBic || null,
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.status === 503 || (body && body.backend_ready === false)) {
        setNotice(labels.unavailable);
        setPhase("unavailable");
        return;
      }
      if (!res.ok) {
        setNotice(labels.error);
        return;
      }
      setIban("");
      setNotice(labels.saved);
      await load();
    } catch {
      setNotice(labels.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{labels.title}</h2>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.manualPayoutNote}</p>
      </div>

      {phase === "loading" ? <AipifyLoader centered size="sm" /> : null}

      {phase === "unavailable" || phase === "error" ? (
        <div className="space-y-3" role="status">
          <p className="text-sm text-[color:var(--aipify-text-secondary)]">
            {phase === "unavailable" ? labels.unavailable : labels.error}
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-xl border border-[color:var(--aipify-border)] px-3 py-1.5 text-sm font-semibold"
          >
            {labels.retry}
          </button>
        </div>
      ) : null}

      {phase === "ready" ? (
        <>
          <div className="rounded-xl border border-[color:var(--aipify-border)] bg-white px-4 py-3 text-sm">
            {profile?.hasProfile ? (
              <div className="flex flex-wrap items-center gap-3">
                <AipifyStatusBadge kind="verified" label={labels.maskedLabel} />
                <span className="font-mono">{profile.maskedHint ?? "****"}</span>
                {profile.accountHolder ? <span>{profile.accountHolder}</span> : null}
                {profile.country ? <span>{profile.country}</span> : null}
                {profile.currency ? <span>{profile.currency}</span> : null}
              </div>
            ) : (
              <p className="text-[color:var(--aipify-text-secondary)]">{labels.noneSaved}</p>
            )}
          </div>

          <form className="grid max-w-2xl gap-3 sm:grid-cols-2" onSubmit={onSave}>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">{labels.accountHolder}</span>
              <input
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">{labels.country}</span>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase())}
                maxLength={2}
                required
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">{labels.currency}</span>
              <input
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                maxLength={3}
                required
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">{labels.iban}</span>
              <input
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 font-mono"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium">{labels.swiftBic}</span>
              <input
                value={swiftBic}
                onChange={(e) => setSwiftBic(e.target.value)}
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border)] px-3 py-2 font-mono"
              />
            </label>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={busy || !accountHolder.trim() || !iban.trim()}
                className="rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? labels.saving : labels.save}
              </button>
              {notice ? <p className="text-sm text-[color:var(--aipify-text-secondary)]">{notice}</p> : null}
            </div>
          </form>
        </>
      ) : null}
    </section>
  );
}

