"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  COMMUNICATION_STYLE_KEYS,
  PERSONALIZATION_CATEGORY_KEYS,
  parsePersonalizationDashboard,
  parsePersonalizationInsights,
  type CompanionPersonalizationEngineLabels,
  type PersonalizationDashboard,
  type PersonalizationInsight,
  type PersonalizationPreference,
} from "@/lib/aipify/companion-personalization-engine";

type Props = { labels: CompanionPersonalizationEngineLabels };

export function CompanionPersonalizationEngineDashboardPanel({ labels }: Props) {
  const [data, setData] = useState<PersonalizationDashboard | null>(null);
  const [insights, setInsights] = useState<PersonalizationInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [acting, setActing] = useState(false);
  const [briefingStyle, setBriefingStyle] = useState("standard");
  const [notificationStyle, setNotificationStyle] = useState("balanced");
  const [personality, setPersonality] = useState("balanced");
  const [adaptation, setAdaptation] = useState("moderate");
  const [learningPref, setLearningPref] = useState("guided");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (status) p.set("status", status);
    if (search.trim()) p.set("search", search.trim());

    const [dashRes, insRes] = await Promise.all([
      fetch(`/api/aipify/personalization?${p}`),
      fetch("/api/aipify/personalization/insights"),
    ]);

    if (dashRes.ok) {
      const parsed = parsePersonalizationDashboard(await dashRes.json());
      setData(parsed);
      if (parsed.profile) {
        setBriefingStyle(parsed.profile.briefing_style ?? "standard");
        setNotificationStyle(parsed.profile.notification_style ?? "balanced");
        setPersonality(parsed.profile.companion_personality ?? "balanced");
        setAdaptation(parsed.profile.adaptation_level ?? "moderate");
        setLearningPref(parsed.profile.learning_preference ?? "guided");
      }
    } else {
      const b = (await dashRes.json()) as { error?: string };
      setError(b.error ?? labels.accessDenied);
      setData(null);
    }
    if (insRes.ok) setInsights(parsePersonalizationInsights(await insRes.json()).insights);
    setLoading(false);
  }, [category, status, search, labels.accessDenied]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch
    void load();
  }, [load]);

  async function saveProfile() {
    setActing(true);
    await fetch("/api/aipify/personalization", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        briefing_style: briefingStyle,
        notification_style: notificationStyle,
        companion_personality: personality,
        adaptation_level: adaptation,
        learning_preference: learningPref,
      }),
    });
    setActing(false);
    void load();
  }

  async function prefAction(id: string, pref_status: string) {
    setActing(true);
    await fetch("/api/aipify/personalization", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pref_id: id, pref_status }),
    });
    setActing(false);
    void load();
  }

  async function resetAll() {
    setActing(true);
    await fetch("/api/aipify/personalization/reset", { method: "POST" });
    setActing(false);
    void load();
  }

  if (loading && !data && !error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (error && !data?.found) {
    return <p className="text-sm text-slate-600">{labels.accessDenied}</p>;
  }

  const profile = data?.profile;
  const empty = !data?.has_preferences;

  return (
    <div className="space-y-8">
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">{labels.principle}</p>
      {data?.privacy_note ? <p className="text-sm text-slate-600">{labels.privacyNote}</p> : null}

      {empty ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.emptyBody}</p>
          <button type="button" onClick={() => void saveProfile()} disabled={acting}
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">
            {labels.emptyCta}
          </button>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <ScoreCard label={labels.dashboard.personalizationScore} value={data?.personalization_score ?? 0} />
          <ScoreCard label={labels.dashboard.activePreferences} value={data?.active_preferences_count ?? 0} />
          <ScoreCard label={labels.dashboard.briefingStyle} value={0} text={labels.briefingStyles[briefingStyle] ?? briefingStyle} />
          <ScoreCard label={labels.dashboard.notificationStyle} value={0} text={labels.notificationStyles[notificationStyle] ?? notificationStyle} />
          <ScoreCard label={labels.dashboard.adaptationLevel} value={0} text={labels.adaptationLevels[adaptation] ?? adaptation} />
          <ScoreCard label={labels.dashboard.communicationProfile} value={0} text={(profile?.communication_styles ?? []).join(", ") || "—"} />
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.profile.communicationStyles}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label={labels.profile.briefingStyle}>
            <select value={briefingStyle} onChange={(e) => setBriefingStyle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {Object.entries(labels.briefingStyles).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label={labels.profile.notificationStyle}>
            <select value={notificationStyle} onChange={(e) => setNotificationStyle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {Object.entries(labels.notificationStyles).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label={labels.profile.companionPersonality}>
            <select value={personality} onChange={(e) => setPersonality(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {Object.entries(labels.personalities).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label={labels.profile.adaptationLevel}>
            <select value={adaptation} onChange={(e) => setAdaptation(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {Object.entries(labels.adaptationLevels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label={labels.profile.learningPreference}>
            <select value={learningPref} onChange={(e) => setLearningPref(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              {Object.entries(labels.learningPreferences).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={acting} onClick={() => void saveProfile()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {labels.dashboard.save}
          </button>
          <button type="button" disabled={acting} onClick={() => void resetAll()}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50">
            {labels.dashboard.reset}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {COMMUNICATION_STYLE_KEYS.map((s) => (
            <span key={s} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
              {labels.communicationStyles[s] ?? s}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.category}</option>
          {PERSONALIZATION_CATEGORY_KEYS.map((k) => (
            <option key={k} value={k}>{labels.categories[k] ?? k}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">{labels.filters.all}</option>
          {(["suggested", "approved", "rejected", "active"] as const).map((s) => (
            <option key={s} value={s}>{labels.statuses[s]}</option>
          ))}
        </select>
      </section>

      {(data?.preferences?.length ?? 0) > 0 ? (
        <section id="review" className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.reviewCenter}</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {data!.preferences!.map((pref) => (
              <PrefRow key={pref.id} pref={pref} labels={labels} acting={acting}
                onApprove={() => void prefAction(pref.id, "approved")}
                onReject={() => void prefAction(pref.id, "rejected")} />
            ))}
          </ul>
        </section>
      ) : null}

      {insights.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.insights}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {insights.map((i) => (
              <li key={i.id} className="rounded-lg border border-slate-100 p-3">
                <p className="font-medium text-slate-900">{i.title}</p>
                <p className="mt-1 text-slate-600">{i.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data?.timeline?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.timeline}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {data!.timeline!.map((e) => (
              <li key={e.id}>{e.description} · {new Date(e.created_at).toLocaleDateString()}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {(data?.usage_examples?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.dashboard.usageExamples}</h2>
          <ul className="mt-2 space-y-2 text-sm italic text-slate-700">
            {data!.usage_examples!.map((ex, i) => <li key={i}>{ex}</li>)}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{labels.faq.title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div><dt className="font-medium">{labels.faq.whatIs}</dt><dd className="mt-1 text-slate-600">{labels.faq.whatIsAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.control}</dt><dd className="mt-1 text-slate-600">{labels.faq.controlAnswer}</dd></div>
          <div><dt className="font-medium">{labels.faq.security}</dt><dd className="mt-1 text-slate-600">{labels.faq.securityAnswer}</dd></div>
        </dl>
      </section>
    </div>
  );
}

function ScoreCard({ label, value, text }: { label: string; value: number; text?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-indigo-700">{text ?? value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function PrefRow({
  pref, labels, acting, onApprove, onReject,
}: {
  pref: PersonalizationPreference;
  labels: CompanionPersonalizationEngineLabels;
  acting: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <li className="rounded-lg border border-amber-100 bg-white p-4">
      <p className="font-medium text-slate-900">{pref.title}</p>
      <p className="mt-1 text-slate-600">{pref.value}</p>
      <dl className="mt-2 grid gap-1 text-xs text-slate-500">
        <div><dt className="inline">{labels.review.source}: </dt><dd className="inline">{pref.source_key}</dd></div>
        <div><dt className="inline">{labels.review.confidence}: </dt>
          <dd className="inline">{labels.confidenceLevels[pref.confidence as keyof typeof labels.confidenceLevels] ?? pref.confidence}</dd></div>
        <div><dt className="inline">{labels.review.status}: </dt>
          <dd className="inline">{labels.statuses[pref.status as keyof typeof labels.statuses] ?? pref.status}</dd></div>
      </dl>
      {pref.status === "suggested" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={acting} onClick={onApprove}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.review.approve}
          </button>
          <button type="button" disabled={acting} onClick={onReject}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-50">
            {labels.review.reject}
          </button>
        </div>
      ) : null}
    </li>
  );
}
