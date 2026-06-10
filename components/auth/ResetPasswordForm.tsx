"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
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
    passwordMismatch: string;
    passwordTooShort: string;
    requiredFields: string;
    generic: string;
  };
};

function isRecoveryLink() {
  if (typeof window === "undefined") return false;

  const hash = window.location.hash.substring(1);
  const hashParams = new URLSearchParams(hash);
  const searchParams = new URLSearchParams(window.location.search);

  return (
    hashParams.get("type") === "recovery" ||
    searchParams.get("type") === "recovery" ||
    hash.includes("access_token")
  );
}

export default function ResetPasswordForm({ labels }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [canReset, setCanReset] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let resolved = false;

    function markReady() {
      if (!resolved) {
        resolved = true;
        setCanReset(true);
        setVerifying(false);
      }
    }

    function markInvalid() {
      if (!resolved) {
        resolved = true;
        setVerifying(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && isRecoveryLink())) {
        markReady();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && isRecoveryLink()) {
        markReady();
      }
    });

    const timeout = window.setTimeout(() => {
      if (!resolved && !isRecoveryLink()) {
        markInvalid();
      } else if (!resolved) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            markReady();
          } else {
            markInvalid();
          }
        });
      }
    }, 2500);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

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
          {labels.invalidLink}
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
