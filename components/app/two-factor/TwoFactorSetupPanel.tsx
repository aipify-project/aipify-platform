"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";

type TwoFactorSetupPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    requiredNotice: string;
    statusEnabled: string;
    statusDisabled: string;
    enableTitle: string;
    enableStepScan: string;
    enableStepConfirm: string;
    manualKey: string;
    confirmCode: string;
    enable: string;
    disable: string;
    regenerate: string;
    recoveryTitle: string;
    recoveryNotice: string;
    recoveryRemaining: string;
    saveCodes: string;
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
  recovery_codes_remaining: number;
};

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
  const [actionCode, setActionCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
    void QRCode.toDataURL(otpauthUrl, { margin: 1, width: 200 }).then(setQrDataUrl);
  }, [otpauthUrl]);

  function mapError(key?: string) {
    if (!key) return labels.errors.generic;
    return labels.errors[key] ?? labels.errors.generic;
  }

  async function beginEnrollment() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/2fa/enroll/begin", { method: "POST" });
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
        body: JSON.stringify({ code: confirmCode }),
      });
      const data = (await res.json()) as { recoveryCodes?: string[]; error?: string };
      if (!res.ok) {
        setError(mapError(data.error));
        return;
      }
      setRecoveryCodes(data.recoveryCodes ?? []);
      setEnrolling(false);
      setSecret(null);
      setOtpauthUrl(null);
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
        body: JSON.stringify({ code: actionCode }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(mapError(data.error));
        return;
      }
      setActionCode("");
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
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
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
        <section className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.recoveryTitle}</h2>
          <p className="mt-2 text-sm text-violet-800">{labels.recoveryNotice}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {recoveryCodes.map((code) => (
              <li
                key={code}
                className="rounded-lg bg-white px-3 py-2 font-mono text-sm text-gray-900"
              >
                {code}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-medium text-violet-900">{labels.saveCodes}</p>
          <button
            type="button"
            onClick={() => setRecoveryCodes(null)}
            className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            {labels.done}
          </button>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-900">
          {status?.enabled ? labels.statusEnabled : labels.statusDisabled}
        </p>
        {status?.enabled ? (
          <p className="mt-1 text-sm text-gray-600">
            {labels.recoveryRemaining.replace(
              "{count}",
              String(status.recovery_codes_remaining ?? 0)
            )}
          </p>
        ) : null}

        {!status?.enabled && !enrolling ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void beginEnrollment()}
            className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-violet-700 disabled:opacity-60"
          >
            {labels.enable}
          </button>
        ) : null}

        {enrolling ? (
          <form onSubmit={(e) => void confirmEnrollment(e)} className="mt-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">{labels.enableTitle}</h2>
            <p className="text-sm text-gray-600">{labels.enableStepScan}</p>
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="" className="mx-auto rounded-lg border border-gray-100" />
            ) : null}
            {secret ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {labels.manualKey}
                </p>
                <p className="mt-1 break-all font-mono text-sm text-gray-900">{secret}</p>
              </div>
            ) : null}
            <div>
              <label htmlFor="confirm-code" className="block text-sm font-medium text-gray-700">
                {labels.confirmCode}
              </label>
              <input
                id="confirm-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                className="mt-2 w-full max-w-xs rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">{labels.enableStepConfirm}</p>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {busy ? labels.saving : labels.enable}
            </button>
          </form>
        ) : null}

        {status?.enabled ? (
          <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
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
                className="mt-2 w-full max-w-xs rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {!status.required ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void disableTwoFactor()}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  {labels.disable}
                </button>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={() => void regenerateCodes()}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {labels.regenerate}
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <Link href="/app/settings" className="text-sm font-medium text-violet-600 hover:text-violet-700">
        {labels.backToSettings}
      </Link>
    </div>
  );
}
