"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/marketing/analytics";

type EarlyAccessLabels = {
  title: string;
  subtitle: string;
  name: string;
  company: string;
  email: string;
  companySize: string;
  industry: string;
  interest: string;
  message: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  privacy: string;
  companySizes: Record<string, string>;
  interests: Record<string, string>;
};

type EarlyAccessFormProps = {
  labels: EarlyAccessLabels;
};

export default function EarlyAccessForm({ labels }: EarlyAccessFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/marketing/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          company_size: data.get("company_size"),
          industry: data.get("industry"),
          interest_area: data.get("interest_area"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) throw new Error("submit failed");

      trackEvent("early_access_submit", { interest: String(data.get("interest_area") ?? "") });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-8 text-center">
        <p className="text-lg font-semibold text-white">{labels.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ea-name" className="block text-sm font-medium text-slate-300">
            {labels.name}
          </label>
          <input
            id="ea-name"
            name="name"
            required
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>
        <div>
          <label htmlFor="ea-company" className="block text-sm font-medium text-slate-300">
            {labels.company}
          </label>
          <input
            id="ea-company"
            name="company"
            required
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ea-email" className="block text-sm font-medium text-slate-300">
          {labels.email}
        </label>
        <input
          id="ea-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ea-size" className="block text-sm font-medium text-slate-300">
            {labels.companySize}
          </label>
          <select
            id="ea-size"
            name="company_size"
            required
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          >
            {Object.entries(labels.companySizes).map(([value, label]) => (
              <option key={value} value={value} className="bg-[#111827]">
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ea-industry" className="block text-sm font-medium text-slate-300">
            {labels.industry}
          </label>
          <input
            id="ea-industry"
            name="industry"
            required
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ea-interest" className="block text-sm font-medium text-slate-300">
          {labels.interest}
        </label>
        <select
          id="ea-interest"
          name="interest_area"
          required
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        >
          {Object.entries(labels.interests).map(([value, label]) => (
            <option key={value} value={value} className="bg-[#111827]">
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="ea-message" className="block text-sm font-medium text-slate-300">
          {labels.message}
        </label>
        <textarea
          id="ea-message"
          name="message"
          rows={4}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400" role="alert">
          {labels.error}
        </p>
      )}

      <p className="text-xs text-slate-500">{labels.privacy}</p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
