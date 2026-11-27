"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { displayBankHint, validateBankProfile } from "@/lib/certified-sales-partner/bank-profile";
import { bankDraftIsDirty, bankSaveStatusMessage, type BankDraft } from "@/lib/certified-sales-partner/csp-profile-form";
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

type SavedBank = Pick<BankDraft, "accountHolder" | "country" | "currency">;

const EMPTY_SAVED: SavedBank = { accountHolder: "", country: "", currency: "" };

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
    maskedHint: displayBankHint(masked),
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

const INPUT =
  "mt-1.5 w-full rounded-xl border border-[#E8E4F2] bg-white px-3 py-2.5 text-sm text-[#1E293B] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20";

/**
 * Partner payout bank details — masked display + save via Core encryption route.
 * Never shows a full IBAN after save. Fail-closed when encryption key / RPC missing.
 */
export function CertifiedSalesPartnerBankPanel({
  labels,
  onDirtyChange,
}: {
  labels: CspBankPanelLabels;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [profile, setProfile] = useState<ProfileView | null>(null);
  const [saved, setSaved] = useState<SavedBank>(EMPTY_SAVED);
  const [accountHolder, setAccountHolder] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [iban, setIban] = useState("");
  const [swiftBic, setSwiftBic] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [fieldError, setFieldError] = useState<{ field: string; text: string } | null>(null);

  const draft: BankDraft = { accountHolder, country, currency, iban, swiftBic };
  const dirty = bankDraftIsDirty(saved, draft);

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    function onLeave(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = labels.unsaved;
    }
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty, labels.unsaved]);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      setPhase("loading");
      setNotice(null);
    }
    setFieldError(null);
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
      const nextSaved: SavedBank = {
        accountHolder: view.accountHolder ?? "",
        country: view.country ?? "",
        currency: view.currency ?? "",
      };
      setProfile(view);
      setSaved(nextSaved);
      setAccountHolder(nextSaved.accountHolder);
      setCountry(nextSaved.country);
      setCurrency(nextSaved.currency);
      setIban("");
      setSwiftBic("");
      setPhase("ready");
    } catch {
      setProfile(null);
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetDraft() {
    setAccountHolder(saved.accountHolder);
    setCountry(saved.country);
    setCurrency(saved.currency);
    setIban("");
    setSwiftBic("");
    setFieldError(null);
    setNotice(null);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (busy || !dirty) return;
    const validated = validateBankProfile({
      country,
      accountHolder,
      currency,
      iban,
      swiftBic: swiftBic || null,
    });
    if (!validated.ok) {
      const text = labels.fieldErrors[validated.error] ?? labels.error;
      setNotice({ tone: "error", text });
      setFieldError({ field: validated.field ?? "", text });
      return;
    }
    setBusy(true);
    setNotice(null);
    setFieldError(null);
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
        setNotice({ tone: "error", text: bankSaveStatusMessage("unavailable", labels) });
        setPhase("unavailable");
        return;
      }
      if (!res.ok) {
        const code = body && typeof body.error === "string" ? body.error : "";
        setNotice({ tone: "error", text: labels.fieldErrors[code] ?? bankSaveStatusMessage("error", labels) });
        return;
      }
      setIban("");
      setSwiftBic("");
      setNotice({ tone: "ok", text: bankSaveStatusMessage("saved", labels) });
      await load({ silent: true });
    } catch {
      setNotice({ tone: "error", text: bankSaveStatusMessage("error", labels) });
    } finally {
      setBusy(false);
    }
  }

  function fieldMessage(field: string): string | null {
    return fieldError?.field === field ? fieldError.text : null;
  }

  return (
    <section className="space-y-5 rounded-2xl border border-[#E8E4F2] bg-white p-5 shadow-sm sm:p-7">
      <div>
        <h2 className="text-base font-semibold text-[#1E293B]">{labels.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#64748B]">{labels.intro}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#64748B]">{labels.manualPayoutNote}</p>
      </div>

      {phase === "loading" ? <AipifyLoader centered size="sm" /> : null}

      {phase === "unavailable" || phase === "error" ? (
        <div className="space-y-3" role="status">
          <p className="text-sm text-[#64748B]">{phase === "unavailable" ? labels.unavailable : labels.error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-4 text-sm font-semibold text-[#1E293B]"
          >
            {labels.retry}
          </button>
        </div>
      ) : null}

      {phase === "ready" ? (
        <>
          <div className="rounded-xl border border-[#E8E4F2] bg-[#F7F6F3] px-4 py-3 text-sm">
            {profile?.hasProfile ? (
              <div className="flex flex-wrap items-center gap-3">
                <AipifyStatusBadge kind="verified" label={labels.maskedLabel} />
                <span className="font-mono">{profile.maskedHint ?? "****"}</span>
                {profile.accountHolder ? <span>{profile.accountHolder}</span> : null}
                {profile.country ? <span>{profile.country}</span> : null}
                {profile.currency ? <span>{profile.currency}</span> : null}
              </div>
            ) : (
              <p className="text-[#64748B]">{labels.noneSaved}</p>
            )}
          </div>

          <form className="grid gap-5 md:grid-cols-2" onSubmit={onSave}>
            <label className="block text-sm md:col-span-2">
              <span className="font-semibold text-[#1E293B]">{labels.accountHolder}</span>
              <input
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                autoComplete="name"
                aria-invalid={fieldMessage("accountHolder") ? true : undefined}
                className={INPUT}
              />
              {fieldMessage("accountHolder") ? (
                <span className="mt-1.5 block text-xs text-[#B42318]">{fieldMessage("accountHolder")}</span>
              ) : null}
            </label>
            <label className="block text-sm">
              <span className="font-semibold text-[#1E293B]">{labels.country}</span>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase())}
                maxLength={2}
                autoComplete="country"
                aria-invalid={fieldMessage("country") ? true : undefined}
                className={INPUT}
              />
              {fieldMessage("country") ? (
                <span className="mt-1.5 block text-xs text-[#B42318]">{fieldMessage("country")}</span>
              ) : null}
            </label>
            <label className="block text-sm">
              <span className="font-semibold text-[#1E293B]">{labels.currency}</span>
              <input
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                maxLength={3}
                aria-invalid={fieldMessage("currency") ? true : undefined}
                className={INPUT}
              />
              {fieldMessage("currency") ? (
                <span className="mt-1.5 block text-xs text-[#B42318]">{fieldMessage("currency")}</span>
              ) : null}
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="font-semibold text-[#1E293B]">{labels.iban}</span>
              <input
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                autoComplete="off"
                aria-invalid={fieldMessage("iban") ? true : undefined}
                className={`${INPUT} font-mono`}
              />
              {fieldMessage("iban") ? (
                <span className="mt-1.5 block text-xs text-[#B42318]">{fieldMessage("iban")}</span>
              ) : null}
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="font-semibold text-[#1E293B]">{labels.swiftBic}</span>
              <input
                value={swiftBic}
                onChange={(e) => setSwiftBic(e.target.value)}
                autoComplete="off"
                aria-invalid={fieldMessage("swiftBic") ? true : undefined}
                className={`${INPUT} font-mono`}
              />
              {fieldMessage("swiftBic") ? (
                <span className="mt-1.5 block text-xs text-[#B42318]">{fieldMessage("swiftBic")}</span>
              ) : null}
            </label>
            {dirty ? <p className="text-sm text-[#945A15] md:col-span-2">{labels.unsaved}</p> : null}
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={busy || !dirty}
                className="inline-flex min-h-11 items-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? labels.saving : labels.save}
              </button>
              <button
                type="button"
                disabled={busy || !dirty}
                onClick={resetDraft}
                className="inline-flex min-h-11 items-center rounded-xl border border-[#E8E4F2] px-4 text-sm font-semibold text-[#1E293B] disabled:opacity-50"
              >
                {labels.cancel}
              </button>
              {notice ? (
                <p role={notice.tone === "error" ? "alert" : "status"} className="text-sm text-[#64748B]">
                  {notice.text}
                </p>
              ) : null}
            </div>
          </form>
        </>
      ) : null}
    </section>
  );
}
