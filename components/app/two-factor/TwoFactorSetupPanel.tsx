"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { formatManualSetupKey } from "@/lib/auth/two-factor/format";

type TwoFactorSetupPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    cardDescription: string;
    whyExplanation: string;
    authenticatorNote: string;
    requiredNotice: string;
    statusEnabled: string;
    statusDisabled: string;
    enableTitle: string;
    qrScanLabel: string;
    supportedApps: string;
    enableStepScan: string;
    enableStepConfirm: string;
    manualKey: string;
    copyKey: string;
    copiedKey: string;
    confirmPassword: string;
    confirmPasswordHint: string;
    confirmCode: string;
    codeFromAppTitle: string;
    codeFromAppBody: string;
    codeFromAppStep1: string;
    codeFromAppStep2: string;
    codeFromAppStep3: string;
    applePasswordsTip: string;
    openInAuthenticator: string;
    googleAuthenticatorHint: string;
    resetEnrollment: string;
    invalidCodeHelp: string;
    enable: string;
    disable: string;
    disablePasswordHint: string;
    regenerate: string;
    viewRecoveryCodes: string;
    viewRecoveryCodesHint: string;
    enabledSuccessTitle: string;
    enabledSuccessBody: string;
    enabledDate: string;
    verificationMethod: string;
    verificationMethodValue: string;
    recoveryCodesStatus: string;
    recoveryCodesGenerated: string;
    recoveryCodesNone: string;
    recoveryTitle: string;
    recoveryNotice: string;
    recoveryRemaining: string;
    saveCodes: string;
    copyCodes: string;
    downloadCodes: string;
    printCodes: string;
    copiedCodes: string;
    loading: string;
    saving: string;
    done: string;
    backToSettings: string;
    errors: Record<string, string>;
  };
};

type Status = {
  enabled: boolean;
  required: boolean;
  confirmed_at: string | null;
  recovery_codes_remaining: number;
};

function formatEnabledDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function TwoFactorSetupPanel({ labels }: TwoFactorSetupPanelProps) {
  const searchParams = useSearchParams();
  const required = searchParams.get("required") === "1";

  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [confirmCode, setConfirmCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [actionCode, setActionCode] = useState("");
  const [actionPassword, setActionPassword] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [showRecoveryHint, setShowRecoveryHint] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [codesCopied, setCodesCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const codeSectionRef = useRef<HTMLDivElement>(null);

  const formattedSecret = secret ? formatManualSetupKey(secret) : null;

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/auth/2fa/status");
    if (res.ok) {
      setStatus((await res.json()) as Status);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    if (!otpauthUrl) return;
    void QRCode.toDataURL(otpauthUrl, { margin: 2, width: 240 }).then(setQrDataUrl);
  }, [otpauthUrl]);

  useEffect(() => {
    if (!keyCopied) return;
    const timer = window.setTimeout(() => setKeyCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [keyCopied]);

  useEffect(() => {
    if (!codesCopied) return;
    const timer = window.setTimeout(() => setCodesCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [codesCopied]);

  function mapError(key?: string) {
    if (!key) return labels.errors.generic;
    return labels.errors[key] ?? labels.errors.generic;
  }

  async function copyManualKey() {
    if (!formattedSecret) return;
    await navigator.clipboard.writeText(formattedSecret.replace(/-/g, ""));
    setKeyCopied(true);
  }

  async function copyRecoveryCodes() {
    if (!recoveryCodes?.length) return;
    await navigator.clipboard.writeText(recoveryCodes.join("\n"));
    setCodesCopied(true);
  }

  function downloadRecoveryCodes() {
    if (!recoveryCodes?.length) return;
    const blob = new Blob([recoveryCodes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aipify-recovery-codes.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function printRecoveryCodes() {
    if (!recoveryCodes?.length) return;
    const html = `<html><head><title>${labels.recoveryTitle}</title></head><body><h1>${labels.recoveryTitle}</h1><p>${labels.recoveryNotice}</p><pre>${recoveryCodes.join("\n")}</pre></body></html>`;
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.print();
  }

  async function beginEnrollment(regenerate = false) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/2fa/enroll/begin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerate }),
      });
      const data = (await res.json()) as {
        secret?: string;
        otpauthUrl?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(mapError(data.error));
        return;
      }
      setSecret(data.secret ?? null);
      setOtpauthUrl(data.otpauthUrl ?? null);
      setEnrolling(true);
      window.requestAnimationFrame(() => {
        codeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch {
      setError(labels.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  async function confirmEnrollment(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/2fa/enroll/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: confirmCode, password: confirmPassword }),
      });
      const data = (await res.json()) as { recoveryCodes?: string[]; error?: string };
      if (!res.ok) {
        setError(
          data.error === "invalidCode"
            ? `${mapError(data.error)} ${labels.invalidCodeHelp}`
            : mapError(data.error)
        );
        return;
      }
      setRecoveryCodes(data.recoveryCodes ?? []);
      setEnrolling(false);
      setSecret(null);
      setOtpauthUrl(null);
      setConfirmCode("");
      setConfirmPassword("");
      await loadStatus();
    } catch {
      setError(labels.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  async function disableTwoFactor() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: actionCode, password: actionPassword }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(mapError(data.error));
        return;
      }
      setActionCode("");
      setActionPassword("");
      await loadStatus();
    } catch {
      setError(labels.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  async function regenerateCodes() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/2fa/recovery/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: actionCode }),
      });
      const data = (await res.json()) as { recoveryCodes?: string[]; error?: string };
      if (!res.ok) {
        setError(mapError(data.error));
        return;
      }
      setRecoveryCodes(data.recoveryCodes ?? []);
      setActionCode("");
      setShowRecoveryHint(false);
      await loadStatus();
    } catch {
      setError(labels.errors.generic);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        {(required || status?.required) && !status?.enabled ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {labels.requiredNotice}
          </p>
        ) : null}
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      {recoveryCodes ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/60 p-8">
          <h2 className="text-base font-semibold text-violet-950">{labels.recoveryTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-violet-900">{labels.recoveryNotice}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {recoveryCodes.map((code) => (
              <li
                key={code}
                className="rounded-lg border border-violet-100 bg-white px-3 py-2.5 font-mono text-sm text-gray-900"
              >
                {code}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyRecoveryCodes()}
              className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100"
            >
              {codesCopied ? labels.copiedCodes : labels.copyCodes}
            </button>
            <button
              type="button"
              onClick={downloadRecoveryCodes}
              className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100"
            >
              {labels.downloadCodes}
            </button>
            <button
              type="button"
              onClick={printRecoveryCodes}
              className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100"
            >
              {labels.printCodes}
            </button>
          </div>
          <p className="mt-4 text-sm font-medium text-violet-950">{labels.saveCodes}</p>
          <button
            type="button"
            onClick={() => setRecoveryCodes(null)}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            {labels.done}
          </button>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {status?.enabled && !enrolling ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-600" aria-hidden="true">✓</span>
                <div>
                  <h2 className="text-base font-semibold text-emerald-950">
                    {labels.enabledSuccessTitle}
                  </h2>
                  <p className="mt-1 text-sm text-emerald-900">{labels.enabledSuccessBody}</p>
                </div>
              </div>
            </div>

            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {labels.enabledDate}
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {formatEnabledDate(status.confirmed_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {labels.verificationMethod}
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {labels.verificationMethodValue}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {labels.recoveryCodesStatus}
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {(status.recovery_codes_remaining ?? 0) > 0
                    ? labels.recoveryCodesGenerated
                    : labels.recoveryCodesNone}
                </dd>
              </div>
            </dl>

            {showRecoveryHint ? (
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                {labels.viewRecoveryCodesHint}
              </p>
            ) : null}

            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div>
                <label htmlFor="action-code" className="block text-sm font-medium text-gray-700">
                  {labels.confirmCode}
                </label>
                <input
                  id="action-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={actionCode}
                  onChange={(e) => setActionCode(e.target.value)}
                  className="mt-2 w-full max-w-sm rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              {!status.required ? (
                <div>
                  <label htmlFor="action-password" className="block text-sm font-medium text-gray-700">
                    {labels.confirmPassword}
                  </label>
                  <input
                    id="action-password"
                    type="password"
                    autoComplete="current-password"
                    value={actionPassword}
                    onChange={(e) => setActionPassword(e.target.value)}
                    className="mt-2 w-full max-w-sm rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">{labels.disablePasswordHint}</p>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowRecoveryHint((v) => !v)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {labels.viewRecoveryCodes}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void regenerateCodes()}
                  className="rounded-lg border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {labels.regenerate}
                </button>
                {!status.required ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void disableTwoFactor()}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    {labels.disable}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {!status?.enabled && !enrolling ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                {labels.subtitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{labels.cardDescription}</p>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => void beginEnrollment()}
              className="rounded-lg border border-gray-900 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            >
              {labels.enable}
            </button>
            <p className="text-xs leading-relaxed text-gray-500">{labels.authenticatorNote}</p>
          </div>
        ) : null}

        {enrolling ? (
          <form onSubmit={(e) => void confirmEnrollment(e)} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                {labels.enableTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{labels.whyExplanation}</p>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-6 py-8">
              <p className="text-sm font-medium text-gray-700">{labels.qrScanLabel}</p>
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt={labels.qrScanLabel}
                  className="rounded-xl border border-white bg-white p-3 shadow-sm"
                />
              ) : null}
              <p className="text-center text-xs text-gray-500">{labels.supportedApps}</p>
              <p className="text-center text-xs leading-relaxed text-gray-500">
                {labels.googleAuthenticatorHint}
              </p>
              {otpauthUrl ? (
                <a
                  href={otpauthUrl}
                  className="text-sm font-medium text-violet-700 underline-offset-2 hover:underline"
                >
                  {labels.openInAuthenticator}
                </a>
              ) : null}
            </div>

            <div
              ref={codeSectionRef}
              className="rounded-xl border border-violet-200 bg-violet-50/60 px-5 py-4"
            >
              <h3 className="text-sm font-semibold text-violet-950">{labels.codeFromAppTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-violet-900">{labels.codeFromAppBody}</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-violet-900">
                <li>{labels.codeFromAppStep1}</li>
                <li>{labels.codeFromAppStep2}</li>
                <li>{labels.codeFromAppStep3}</li>
              </ol>
              <p className="mt-3 text-xs leading-relaxed text-violet-800/90">{labels.applePasswordsTip}</p>
            </div>

            <div className="rounded-xl border-2 border-violet-200 bg-white px-5 py-5">
              <label htmlFor="confirm-code" className="block text-sm font-semibold text-gray-900">
                {labels.confirmCode}
              </label>
              <input
                id="confirm-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-3 w-full max-w-xs rounded-xl border border-violet-200 px-4 py-4 text-center font-mono text-2xl tracking-[0.35em] text-gray-900"
              />
              <p className="mt-2 text-xs text-gray-600">{labels.enableStepConfirm}</p>
            </div>

            {formattedSecret ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {labels.manualKey}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="font-mono text-base tracking-wide text-gray-900">{formattedSecret}</p>
                  <button
                    type="button"
                    onClick={() => void copyManualKey()}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {keyCopied ? labels.copiedKey : labels.copyKey}
                  </button>
                </div>
              </div>
            ) : null}

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                {labels.confirmPassword}
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="current-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 w-full max-w-sm rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">{labels.confirmPasswordHint}</p>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="rounded-lg border border-gray-900 bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {busy ? labels.saving : labels.enable}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void beginEnrollment(true)}
              className="ml-3 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {labels.resetEnrollment}
            </button>
          </form>
        ) : null}
      </section>

      <Link href="/app/settings" className="text-sm font-medium text-violet-600 hover:text-violet-700">
        {labels.backToSettings}
      </Link>
    </div>
  );
}
