"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { isForgotPasswordPublicErrorCode } from "@/lib/auth/forgot-password";

type ForgotPasswordFormProps = {
  labels: {
    email: string;
    sendInstructions: string;
    backToLogin: string;
    success: string;
    emailRequired: string;
    deliveryFailed: string;
    rateLimited: string;
    requestFailed: string;
    generic: string;
  };
  /** When false, omit in-form back link (page already shows the login-slot link above the title). */
  showBackLink?: boolean;
};

export default function ForgotPasswordForm({
  labels,
  showBackLink = true,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function resolveErrorLabel(code: unknown): string {
    if (!isForgotPasswordPublicErrorCode(code)) {
      return labels.generic;
    }
    switch (code) {
      case "email_required":
        return labels.emailRequired;
      case "rate_limited":
        return labels.rateLimited;
      case "delivery_failed":
        return labels.deliveryFailed;
      case "request_failed":
        return labels.requestFailed;
      default:
        return labels.generic;
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError(labels.emailRequired);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok) {
        setError(resolveErrorLabel(payload.error));
        return;
      }

      setSuccess(labels.success);
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

      {success && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          {success}
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
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {labels.sendInstructions}
      </button>

      {showBackLink ? (
        <p className="text-center text-sm text-gray-600">
          <Link
            href="/login"
            className="font-semibold text-violet-600 hover:text-violet-700"
          >
            {labels.backToLogin}
          </Link>
        </p>
      ) : null}
    </form>
  );
}
