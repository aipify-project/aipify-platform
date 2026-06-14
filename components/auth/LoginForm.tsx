"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { getPostLoginPath } from "@/lib/auth/get-post-login-path";
import { twoFactorRedirectPath, type TwoFactorStatus } from "@/lib/auth/two-factor";
import { createClient } from "@/lib/supabase/client";

type LoginFormProps = {
  labels: {
    email: string;
    password: string;
    signIn: string;
    forgotPassword: string;
    createAccount: string;
    noAccount: string;
    invalidCredentials: string;
    requiredFields: string;
    generic: string;
    trustSecurity: string;
    trustTwoFactor: string;
  };
};

export default function LoginForm({ labels }: LoginFormProps) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(labels.requiredFields);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        const message =
          signInError.message.toLowerCase().includes("invalid") ||
          signInError.message.toLowerCase().includes("credentials")
            ? labels.invalidCredentials
            : signInError.message;
        setError(message);
        return;
      }

      if (!data.session) {
        setError(labels.generic);
        return;
      }

      const destination = await getPostLoginPath(
        supabase,
        searchParams.get("next")
      );

      const statusRes = await fetch("/api/auth/2fa/status");
      if (statusRes.ok) {
        const status = (await statusRes.json()) as TwoFactorStatus;
        const gatePath = twoFactorRedirectPath(status, destination);
        if (gatePath) {
          window.location.assign(gatePath);
          return;
        }
      }

      window.location.assign(destination);
    } catch {
      setError(labels.generic);
    } finally {
      setLoading(false);
    }
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

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {labels.email}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {labels.password}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          required
        />
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          {labels.forgotPassword}
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? `${labels.signIn}...` : labels.signIn}
      </button>

      <div className="space-y-1 text-center text-xs text-gray-500">
        <p>{labels.trustSecurity}</p>
        <p>{labels.trustTwoFactor}</p>
      </div>

      <p className="text-center text-sm text-gray-600">
        {labels.noAccount}{" "}
        <Link
          href="/register"
          className="font-semibold text-violet-600 hover:text-violet-700"
        >
          {labels.createAccount}
        </Link>
      </p>
    </form>
  );
}
