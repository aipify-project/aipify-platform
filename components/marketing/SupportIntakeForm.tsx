"use client";

import { FormEvent, useState } from "react";
import {
  AipifyHumanVerification,
  PublicFormHoneypot,
} from "@/components/ui/aipify-human-verification";
import { usePublicFormGuard } from "@/lib/public-forms/use-public-form-guard";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

export type SupportIntakeFormLabels = {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submit: string;
  submitting: string;
  successCorePending: string;
  errorGeneric: string;
  mailtoFallback: string;
  mailtoLabel: string;
  verificationRequired: string;
};

type Props = {
  labels: SupportIntakeFormLabels;
  verificationLabels: HumanVerificationLabels;
};

export default function SupportIntakeForm({ labels, verificationLabels }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [lastSubject, setLastSubject] = useState("");
  const {
    requireVerification,
    guardFields,
    onVerified,
    onVerificationReset,
    verificationRequired,
  } = usePublicFormGuard();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!requireVerification()) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = String(data.get("subject") ?? "").trim();
    setLastSubject(subject);
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/support-intake/web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          guardFields(String(data.get("email") ?? "").trim(), {
            contactName: data.get("name"),
            contactEmail: data.get("email"),
            subject: data.get("subject"),
            message: data.get("message"),
            _honeypot: data.get("_honeypot"),
          }),
        ),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
      };

      // Core not applied → honest pending state; mailto fallback remains available.
      if (res.status === 503 || json.code === "core_not_applied" || json.code === "channel_not_activated") {
        setStatus("done");
        onVerificationReset();
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setError(json.error ?? labels.errorGeneric);
        return;
      }
      setStatus("done");
      form.reset();
      onVerificationReset();
    } catch {
      setStatus("error");
      setError(labels.errorGeneric);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="text-2xl font-semibold text-slate-900">{labels.title}</h1>
      <p className="mt-2 text-sm text-slate-600">{labels.subtitle}</p>

      {status === "done" ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p>{labels.successCorePending}</p>
          <p className="mt-3">
            <a
              className="font-medium text-indigo-700 underline"
              href={`mailto:support@aipify.ai?subject=${encodeURIComponent(lastSubject || "Support")}`}
            >
              {labels.mailtoLabel}
            </a>
          </p>
          <p className="mt-1 text-xs opacity-80">{labels.mailtoFallback}</p>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <PublicFormHoneypot />
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-800">{labels.name}</span>
            <input
              required
              name="name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-800">{labels.email}</span>
            <input
              required
              type="email"
              name="email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-800">{labels.subject}</span>
            <input
              required
              minLength={3}
              name="subject"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-800">{labels.message}</span>
            <textarea
              required
              minLength={10}
              name="message"
              rows={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <AipifyHumanVerification
            labels={verificationLabels}
            onVerified={onVerified}
            onReset={onVerificationReset}
          />
          {verificationRequired ? (
            <p className="text-sm text-amber-800">{labels.verificationRequired}</p>
          ) : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex min-h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-60"
          >
            {status === "submitting" ? labels.submitting : labels.submit}
          </button>
        </form>
      )}
    </div>
  );
}
