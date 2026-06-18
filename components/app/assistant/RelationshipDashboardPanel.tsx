"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseRelationshipCenter,
  type RelationshipCenterBundle,
  type RelationshipPerson,
  type RelationshipSettings,
} from "@/lib/relationship-intelligence";
import { formatDate } from "@/lib/i18n/format-date";

type RelationshipDashboardPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    export: string;
    pause: string;
    remove: string;
    addPerson: string;
    personName: string;
    personType: string;
    viewLife: string;
    viewMemories: string;
    sections: {
      people: string;
      milestones: string;
      socialReminders: string;
      followUps: string;
      suggestedActions: string;
      giftOpportunities: string;
      sharedCommitments: string;
      proactive: string;
      settings: string;
      ethics: string;
      sharedMemory: string;
    };
    settings: {
      enabled: string;
      askBeforeRemembering: string;
      giftSuggestions: string;
      followUps: string;
    };
    personTypes: Record<string, string>;
  };
};

export function RelationshipDashboardPanel({
  locale,
  labels,
}: RelationshipDashboardPanelProps) {
  const [center, setCenter] = useState<RelationshipCenterBundle | null>(null);
  const [settings, setSettings] = useState<RelationshipSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [newName, setNewName] = useState("");

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assistant/relationships");
    if (res.ok) {
      const data = parseRelationshipCenter(await res.json());
      setCenter(data);
      if (data.settings) setSettings(data.settings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveSettings() {
    if (!settings) return;
    await fetch("/api/assistant/relationships", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function addPerson() {
    if (!newName.trim()) return;
    await fetch("/api/assistant/relationships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upsert_person", name: newName.trim() }),
    });
    setNewName("");
    await refresh();
  }

  async function updatePersonStatus(personId: string, status: string) {
    await fetch("/api/assistant/relationships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_status", person_id: personId, status }),
    });
    await refresh();
  }

  async function exportData() {
    const res = await fetch("/api/assistant/relationships/export");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aipify-relationships.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/assistant" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.privacy_note && (
          <p className="mt-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-900">
            {center.privacy_note}
          </p>
        )}
      </div>

      {center?.social_reminders && center.social_reminders.length > 0 && (
        <ReminderSection title={labels.sections.socialReminders} items={center.social_reminders} />
      )}

      {center?.upcoming_milestones && center.upcoming_milestones.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.milestones}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {center.upcoming_milestones.map((m) => (
              <li key={m.id}>
                <span className="font-medium">{m.name}</span> — {m.message}
                {m.date && (
                  <span className="ml-2 text-gray-500">{formatDate(m.date, locale)}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center?.pending_follow_ups && center.pending_follow_ups.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.followUps}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {center.pending_follow_ups.map((f) => (
              <li key={f.id}>{f.message}</li>
            ))}
          </ul>
        </section>
      )}

      {center?.gift_opportunities && center.gift_opportunities.length > 0 && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="text-base font-semibold text-gray-900">
            {labels.sections.giftOpportunities}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {center.gift_opportunities.map((g) => (
              <li key={g.person_id}>{g.message}</li>
            ))}
          </ul>
        </section>
      )}

      {center?.suggested_actions && center.suggested_actions.length > 0 && (
        <ReminderSection title={labels.sections.suggestedActions} items={center.suggested_actions} />
      )}

      {center?.proactive_assistance && center.proactive_assistance.length > 0 && (
        <ReminderSection title={labels.sections.proactive} items={center.proactive_assistance} />
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.people}</h2>
        <div className="mt-3 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={labels.personName}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void addPerson()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {labels.addPerson}
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {(center?.people ?? []).map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              locale={locale}
              labels={labels}
              onPause={(id) => void updatePersonStatus(id, "paused")}
              onRemove={(id) => void updatePersonStatus(id, "archived")}
            />
          ))}
        </div>
      </section>

      {center?.shared_commitments && center.shared_commitments.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            {labels.sections.sharedCommitments}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {center.shared_commitments.map((c) => (
              <li key={c.id}>
                {c.title}
                {c.memory_date && (
                  <span className="ml-2 text-gray-500">
                    {formatDate(c.memory_date, locale)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {center?.ethical_boundaries && (
        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.ethics}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {center.ethical_boundaries.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      )}

      {center?.shared_memory_architecture && (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.sharedMemory}</h2>
          <p className="mt-2 text-sm text-gray-600">{center.shared_memory_architecture.message}</p>
          <p className="mt-1 text-xs text-gray-400">
            {center.shared_memory_architecture.future_types?.join(" · ")}
          </p>
        </section>
      )}

      {settings && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.settings}</h2>
          <div className="mt-4 space-y-2">
            <SettingToggle
              label={labels.settings.enabled}
              checked={settings.rsi_enabled}
              onChange={(v) => setSettings((s) => (s ? { ...s, rsi_enabled: v } : s))}
            />
            <SettingToggle
              label={labels.settings.askBeforeRemembering}
              checked={settings.ask_before_remembering}
              onChange={(v) =>
                setSettings((s) => (s ? { ...s, ask_before_remembering: v } : s))
              }
            />
            <SettingToggle
              label={labels.settings.giftSuggestions}
              checked={settings.gift_suggestions_enabled}
              onChange={(v) =>
                setSettings((s) => (s ? { ...s, gift_suggestions_enabled: v } : s))
              }
            />
            <SettingToggle
              label={labels.settings.followUps}
              checked={settings.follow_up_enabled}
              onChange={(v) => setSettings((s) => (s ? { ...s, follow_up_enabled: v } : s))}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void saveSettings()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              {saved ? labels.saved : labels.save}
            </button>
            <button
              type="button"
              onClick={() => void exportData()}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {labels.export}
            </button>
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-4">
        <Link href="/app/assistant/life" className="text-sm text-indigo-600 hover:underline">
          {labels.viewLife}
        </Link>
        <Link href="/app/assistant/memory" className="text-sm text-indigo-600 hover:underline">
          {labels.viewMemories}
        </Link>
      </div>
    </div>
  );
}

function ReminderSection({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; message: string }>;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        {items.map((item) => (
          <li key={item.id}>{item.message}</li>
        ))}
      </ul>
    </section>
  );
}

function PersonCard({
  person,
  locale,
  labels,
  onPause,
  onRemove,
}: {
  person: RelationshipPerson;
  locale: string;
  labels: RelationshipDashboardPanelProps["labels"];
  onPause: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium text-gray-900">{person.name}</h3>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {labels.personTypes[person.person_type] ?? person.person_type}
        </span>
        {person.relationship && (
          <span className="text-xs text-gray-500">{person.relationship}</span>
        )}
      </div>
      {person.notes && <p className="mt-2 text-sm text-gray-600">{person.notes}</p>}
      {person.birthday && (
        <p className="mt-1 text-xs text-gray-500">
          Birthday: {formatDate(person.birthday, locale)}
        </p>
      )}
      {person.favorite_activities.length > 0 && (
        <p className="mt-1 text-xs text-indigo-700">
          Enjoys: {person.favorite_activities.join(", ")}
        </p>
      )}
      {person.timeline.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase text-gray-400">Timeline</p>
          <ul className="mt-1 space-y-1 text-xs text-gray-600">
            {person.timeline.slice(0, 4).map((e) => (
              <li key={e.id}>
                {e.title}
                {e.event_date && ` — ${formatDate(e.event_date, locale)}`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {person.status === "active" && (
        <div className="mt-3 flex gap-3 text-xs">
          <button type="button" onClick={() => onPause(person.id)} className="text-amber-700 hover:underline">
            {labels.pause}
          </button>
          <button type="button" onClick={() => onRemove(person.id)} className="text-rose-600 hover:underline">
            {labels.remove}
          </button>
        </div>
      )}
    </div>
  );
}

function SettingToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
