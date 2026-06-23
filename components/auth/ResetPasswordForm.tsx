"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import type { AuthRecoveryErrorCode } from "@/lib/auth/auth-recovery-log";
import { createClient } from "@/lib/supabase/client";

type ResetPasswordFormProps = {
  labels: {
    password: string;
    confirmPassword: string;
    submit: string;
    success: string;
    backToLogin: string;
    requestNewLink: string;
    verifying: string;
    invalidLink: string;
    linkExpired: string;
    linkInvalid: string;
    callbackFailed: string;
    passwordMismatch: string;
    passwordTooShort: string;
    requiredFields: string;
    generic: string;
  };
  initialSessionReady?: boolean;
  recoveryError?: AuthRecoveryErrorCode | null;
};

function hasImplicitRecoveryTokens(): boolean {
  if (typeof window === "undefined") return false;

  const hash = window.location.hash.substring(1);
  if (!hash) return false;

  const hashParams = new URLSearchParams(hash);
  return (
    hashParams.get("type") === "recovery" ||
    hashParams.has("access_token") ||
    hashParams.has("refresh_token")
  );
}

function resolveRecoveryErrorMessage(
  code: AuthRecoveryErrorCode | null | undefined,
  labels: ResetPasswordFormProps["labels"],
): string | null {
  if (!code) return null;
  switch (code) {
    case "otp_expired":
      return labels.linkExpired;
    case "invalid_code":
    case "missing_code":
      return labels.linkInvalid;
    case "exchange_failed":
      return labels.callbackFailed;
    default:
      return labels.invalidLink;
  }
}

export default function ResetPasswordForm({
  labels,
  initialSessionReady = false,
  recoveryError = null,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(
    resolveRecoveryErrorMessage(recoveryError, labels),
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(!recoveryError && !initialSessionReady);
  const [canReset, setCanReset] = useState(initialSessionReady && !recoveryError);

  useEffect(() => {
    if (recoveryError) {
      setVerifying(false);
      setCanReset(false);
      return;
    }

    if (initialSessionReady) {
      setCanReset(true);
      setVerifying(false);
      return;
    }

    const supabase = createClient();
    let resolved = false;

    function markReady() {
      if (!resolved) {
        resolved = true;
        setCanReset(true);
        setVerifying(false);
        setError(null);
      }
    }

    function markInvalid(message?: string) {
      if (!resolved) {
        resolved = true;
        setCanReset(false);
        setVerifying(false);
        if (message) setError(message);
      }
    }

    async function verifyFromUrl() {
      const searchParams = new URLSearchParams(window.location.search);
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (tokenHash && type === "recovery") {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (verifyError) {
          markInvalid(resolveRecoveryErrorMessage("invalid_code", labels) ?? labels.invalidLink);
          return;
        }
        markReady();
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && (initialSessionReady || hasImplicitRecoveryTokens()))) {
        markReady();
        return;
      }
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        markReady();
      }
    });

    void verifyFromUrl();

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        markReady();
      }
    });

    const timeout = window.setTimeout(() => {
      if (resolved) return;
      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          markReady();
        } else if (hasImplicitRecoveryTokens()) {
          markInvalid(labels.invalidLink);
        } else {
          markInvalid(labels.invalidLink);
        }
      });
    }, 4000);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [initialSessionReady, labels, recoveryError]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password || !confirmPassword) {
      setError(labels.requiredFields);
      return;
    }

    if (password.length < 8) {
      setError(labels.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(labels.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      setSuccess(labels.success);

      window.setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError(labels.generic);
    } finally {
      setLoading(false);
    }
  }

  if (verifying) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
        <p className="text-sm font-medium text-gray-500">{labels.verifying}</p>
      </div>
    );
  }

  if (!canReset) {
    return (
      <div className="space-y-5 text-center">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error ?? labels.invalidLink}
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-violet-700"
          >
            {labels.requestNewLink}
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-violet-600 hover:text-violet-700"
          >
            {labels.backToLogin}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          {success}
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {labels.password}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          required
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          {labels.confirmPassword}
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !!success}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {labels.submit}
      </button>

      <p className="text-center text-sm text-gray-600">
        <Link
          href="/login"
          className="font-semibold text-violet-600 hover:text-violet-700"
        >
          {labels.backToLogin}
        </Link>
      </p>
    </form>
  );
}
