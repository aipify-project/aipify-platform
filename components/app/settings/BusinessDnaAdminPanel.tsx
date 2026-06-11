"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PROFILE_STATUSES,
  RISK_LEVELS,
  SUPPORT_CATEGORIES,
  TONE_OF_VOICE,
  parseBusinessDnaCenter,
  type BusinessDnaCenterBundle,
  type BusinessDnaProfile,
  type BdeSettings,
} from "@/lib/business-dna-engine";

type BusinessDnaAdminPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    privacy: string;
    seedInstall: string;
    approveProfile: string;
    sections: {
      overview: string;
      profile: string;
      knowledge: string;
      templates: string;
      workflows: string;
      escalation: string;
      automation: string;
      emailTest: string;
      audit: string;
      settings: string;
    };
    health: {
      score: string;
      readiness: string;
      gaps: string;
    };
    settings: {
      humanReview: string;
      automation: string;
      learnReplies: string;
      importHistory: string;
    };
    emailTest: {
      subject: string;
      body: string;
      analyze: string;
      draft: string;
      result: string;
    };
    empty: string;
    youControl: string;
    profileStatuses: Record<string, string>;
    riskLevels: Record<string, string>;
    toneOptions: Record<string, string>;
  };
};

const HEALTH_STYLES: Record<string, string> = {
  not_ready: "bg-rose-100 text-rose-800",
  draft_only: "bg-amber-100 text-amber-800",
  partial_automation: "bg-sky-100 text-sky-800",
  high_automation: "bg-emerald-100 text-emerald-800",
};

export function BusinessDnaAdminPanel({ labels }: BusinessDnaAdminPanelProps) {
  const [center, setCenter] = useState<BusinessDnaCenterBundle | null>(null);
  const [profile, setProfile] = useState<BusinessDnaProfile | null>(null);
  const [settings, setSettings] = useState<BdeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Where is my order?");
  const [emailBody, setEmailBody] = useState("");
  const [emailResult, setEmailResult] = useState<Record<string, unknown> | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/business-dna/profile");
    if (res.ok) {
      const data = parseBusinessDnaCenter(await res.json());
      setCenter(data);
      if (data.profile) setProfile(data.profile);
      if (data.settings) setSettings(data.settings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveProfile() {
    if (!profile || !settings) return;
    await fetch("/api/business-dna/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, settings }),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    await refresh();
  }

  async function seedFromInstall() {
    await fetch("/api/business-dna/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "seed_from_install" }),
    });
    await refresh();
  }

  async function approveProfile() {
    if (!profile) return;
    setProfile({ ...profile, profile_status: "approved" });
    await fetch("/api/business-dna/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_status: "approved" }),
    });
    await refresh();
  }

  async function testEmailDraft() {
    const analyzeRes = await fetch("/api/support/email/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: emailSubject, body: emailBody }),
    });
    const analysis = await analyzeRes.json();

    const draftRes = await fetch("/api/support/email/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: emailSubject, body: emailBody, customer_name: "Customer" }),
    });
    const draft = await draftRes.json();
    setEmailResult({ analysis, draft });
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  const health = center?.health;
  const healthLevel = health?.level ?? "not_ready";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-1 text-sm font-medium text-indigo-800">{labels.youControl}</p>
        {(center?.privacy_note || labels.privacy) && (
          <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {center?.privacy_note ?? labels.privacy}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void seedFromInstall()}
            className="text-sm text-indigo-600 hover:underline"
          >
            {labels.seedInstall}
          </button>
          {profile?.profile_status !== "approved" && profile?.profile_status !== "active" && (
            <button
              type="button"
              onClick={() => void approveProfile()}
              className="text-sm text-emerald-700 hover:underline"
            >
              {labels.approveProfile}
            </button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.overview}</h2>
        {health && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">{health.health_score}</span>
            <span className="text-sm text-gray-500">{labels.health.score}</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${HEALTH_STYLES[healthLevel] ?? HEALTH_STYLES.not_ready}`}
            >
              {health.readiness_label}
            </span>
          </div>
        )}
        {Array.isArray(health?.gaps) && health.gaps.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-amber-800">
            {health.gaps.map((gap, i) => (
              <li key={i}>· {gap}</li>
            ))}
          </ul>
        )}
      </section>

      {profile && settings && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.profile}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-gray-600">Company</span>
              <input
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Industry</span>
              <input
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="col-span-full block text-sm">
              <span className="text-gray-600">Description</span>
              <textarea
                value={profile.business_description}
                onChange={(e) => setProfile({ ...profile, business_description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Tone</span>
              <select
                value={profile.tone_of_voice}
                onChange={(e) => setProfile({ ...profile, tone_of_voice: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {TONE_OF_VOICE.map((t) => (
                  <option key={t} value={t}>
                    {labels.toneOptions[t] ?? t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Risk</span>
              <select
                value={profile.risk_level}
                onChange={(e) => setProfile({ ...profile, risk_level: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {RISK_LEVELS.map((r) => (
                  <option key={r} value={r}>
                    {labels.riskLevels[r] ?? r}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-gray-600">Status</span>
              <select
                value={profile.profile_status}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    profile_status: e.target.value as BusinessDnaProfile["profile_status"],
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {PROFILE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {labels.profileStatuses[s] ?? s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <h3 className="mt-6 font-medium text-gray-900">{labels.sections.settings}</h3>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.human_review_mode}
                onChange={(e) => setSettings({ ...settings, human_review_mode: e.target.checked })}
              />
              {labels.settings.humanReview}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.automation_enabled}
                onChange={(e) => setSettings({ ...settings, automation_enabled: e.target.checked })}
              />
              {labels.settings.automation}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.learn_from_approved_replies}
                onChange={(e) =>
                  setSettings({ ...settings, learn_from_approved_replies: e.target.checked })
                }
              />
              {labels.settings.learnReplies}
            </label>
          </div>

          <button
            type="button"
            onClick={() => void saveProfile()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {saved ? labels.saved : labels.save}
          </button>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.templates}</h2>
        {(center?.templates?.length ?? 0) === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {center?.templates?.map((t) => (
              <li key={String(t.id)} className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium">{String(t.template_name)}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {String(t.category)} · {t.approved ? "approved" : "draft"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.knowledge}</h2>
        {(center?.knowledge?.length ?? 0) === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {center?.knowledge?.slice(0, 8).map((k) => (
              <li key={String(k.id)} className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium">{String(k.question)}</span>
                <span className="ml-2 text-xs text-gray-500">{String(k.category)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-gray-400">
          Categories: {SUPPORT_CATEGORIES.slice(0, 6).join(", ")}…
        </p>
      </section>

      <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
        <h2 className="font-semibold text-rose-900">{labels.sections.escalation}</h2>
        <ul className="mt-3 space-y-2 text-sm text-rose-900">
          {center?.escalation_rules?.map((r) => (
            <li key={String(r.id)}>
              <span className="font-medium">{String(r.rule_name)}</span> — {String(r.condition)}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
        <h2 className="font-semibold text-sky-900">{labels.sections.automation}</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {center?.automation_readiness?.categories?.map((c, i) => (
            <li key={i}>
              {String(c.category)} — templates: {String(c.template_count)}, knowledge:{" "}
              {String(c.knowledge_count)}
              {c.automatable ? " ✓" : " (needs template)"}
            </li>
          )) ?? <li className="text-gray-500">{labels.empty}</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
        <h2 className="font-semibold text-indigo-900">{labels.sections.emailTest}</h2>
        <label className="mt-3 block text-sm">
          {labels.emailTest.subject}
          <input
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm">
          {labels.emailTest.body}
          <textarea
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <button
          type="button"
          onClick={() => void testEmailDraft()}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {labels.emailTest.draft}
        </button>
        {emailResult && (
          <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-white p-3 text-xs text-gray-700">
            {labels.emailTest.result}: {JSON.stringify(emailResult.draft, null, 2)}
          </pre>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-3 space-y-1 text-sm text-gray-600">
          {center?.audit_log?.map((a) => (
            <li key={String(a.id)}>
              {String(a.event_type)} — {String(a.description)}
            </li>
          )) ?? <li>{labels.empty}</li>}
        </ul>
      </section>
    </div>
  );
}
