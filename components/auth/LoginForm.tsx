"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AipifyWebAppInstallAction } from "@/components/pwa/AipifyWebAppInstallAction";
import {
  normalizeSignInEmail,
  type PasswordSignInFailureCode,
} from "@/lib/auth/password-sign-in";
import { twoFactorRedirectPath, type TwoFactorStatus } from "@/lib/auth/two-factor";
import { isFetchNetworkError } from "@/lib/pwa/manifest-audit";
import type { PwaInstallLabels } from "@/lib/pwa/types";

type SignInAttemptResult =
  | { ok: true; destination: string }
  | { ok: false; error: PasswordSignInFailureCode; message?: string; networkError: boolean };

function mapSignInFailure(
  code: PasswordSignInFailureCode | undefined,
  labels: LoginFormProps["labels"],
): { message: string; networkError: boolean } {
  switch (code) {
    case "required_fields":
      return { message: labels.requiredFields, networkError: false };
    case "invalid_credentials":
      return { message: labels.invalidCredentials, networkError: false };
    case "email_not_confirmed":
      return { message: labels.emailNotConfirmed, networkError: false };
    case "session_expired":
      return { message: labels.sessionExpired, networkError: false };
    case "rate_limited":
      return { message: labels.rateLimited, networkError: true };
    case "network":
      return { message: labels.networkTitle, networkError: true };
    default:
      return { message: labels.generic, networkError: false };
  }
}

async function signInViaServerRoute(
  email: string,
  password: string,
  nextPath: string | null,
): Promise<SignInAttemptResult> {
  const signInResponse = await fetch("/api/auth/sign-in", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: normalizeSignInEmail(email),
      password,
      next: nextPath,
    }),
  });

  const signInPayload = (await signInResponse.json().catch(() => null)) as
    | {
        ok?: boolean;
        destination?: string;
        error?: PasswordSignInFailureCode;
        message?: string;
      }
    | null;

  if (signInResponse.ok && signInPayload?.ok && signInPayload.destination) {
    return { ok: true, destination: signInPayload.destination };
  }

  return {
    ok: false,
    error: signInPayload?.error ?? "auth_failed",
    message: signInPayload?.message,
    networkError:
      isFetchNetworkError(signInPayload?.message ?? "") ||
      signInPayload?.error === "network" ||
      !signInResponse.ok && signInResponse.status >= 500,
  };
}

async function signInWithFallback(
  email: string,
  password: string,
  nextPath: string | null,
): Promise<SignInAttemptResult> {
  return signInViaServerRoute(email, password, nextPath);
}

type LoginFormProps = {
  labels: {
    email: string;
    password: string;
    signIn: string;
    forgotPassword: string;
    createAccount: string;
    noAccount: string;
    invalidCredentials: string;
    emailNotConfirmed: string;
    sessionExpired: string;
    rateLimited: string;
    requiredFields: string;
    generic: string;
    networkTitle: string;
    networkBody: string;
    networkTryAgain: string;
    networkStatus: string;
    networkSupport: string;
    trustSecurity: string;
    trustTwoFactor: string;
  };
  pwaLabels: PwaInstallLabels;
  hideRegisterLink?: boolean;
  postLoginNext?: string;
  showInstallLinks?: boolean;
};

export default function LoginForm({
  labels,
  pwaLabels,
  hideRegisterLink = false,
  postLoginNext,
  showInstallLinks = true,
}: LoginFormProps) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNetworkError(false);

    if (!email || !password) {
      setError(labels.requiredFields);
      return;
    }

    setLoading(true);

    try {
      const nextPath = postLoginNext ?? searchParams.get("next");
      const result = await signInWithFallback(email, password, nextPath);

      if (!result.ok) {
        const mapped = mapSignInFailure(result.error, labels);
        setNetworkError(result.networkError || mapped.networkError);
        setError(mapped.message);
        return;
      }

      const statusRes = await fetch("/api/auth/2fa/status", { credentials: "same-origin" });
      if (statusRes.ok) {
        const status = (await statusRes.json()) as TwoFactorStatus;
        const gatePath = twoFactorRedirectPath(status, result.destination);
        if (gatePath) {
          window.location.assign(gatePath);
          return;
        }
      }

      window.location.assign(result.destination);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : labels.generic;
      setNetworkError(isFetchNetworkError(message));
      setError(isFetchNetworkError(message) ? labels.networkTitle : labels.generic);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p className="font-medium">{error}</p>
            {networkError ? (
              <div className="mt-2 space-y-2 text-red-800">
                <p>{labels.networkBody}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="font-semibold text-violet-700 underline-offset-2 hover:underline"
                  >
                    {labels.networkTryAgain}
                  </button>
                  <a
                    href="https://status.aipify.ai"
                    className="font-semibold text-violet-700 underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {labels.networkStatus}
                  </a>
                  <Link
                    href="/contact"
                    className="font-semibold text-violet-700 underline-offset-2 hover:underline"
                  >
                    {labels.networkSupport}
                  </Link>
                </div>
              </div>
            ) : null}
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

        {!hideRegisterLink ? (
          <p className="text-center text-sm text-gray-600">
            {labels.noAccount}{" "}
            <Link
              href="/register"
              className="font-semibold text-violet-600 hover:text-violet-700"
            >
              {labels.createAccount}
            </Link>
          </p>
        ) : null}
      </form>

      {showInstallLinks ? (
        <div className="border-t border-gray-100 pt-4 text-center">
          <AipifyWebAppInstallAction labels={pwaLabels} variant="compact" showGuideLink={false} />
          <Link
            href="/install"
            className="mt-2 inline-flex min-h-[44px] items-center text-xs font-medium text-gray-500 hover:text-violet-600"
          >
            {pwaLabels.learnMore}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
