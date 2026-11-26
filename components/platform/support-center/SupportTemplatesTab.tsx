"use client";

import { useMemo, useState } from "react";
import type { EditableSupportTemplate } from "@/lib/platform-portal/support-center";
import type { SupportCenterLabels } from "./support-center-labels";
import {
  FlashMessage,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  type SupportFlash,
} from "./support-center-ui";

type Mode = "preview" | "edit" | "new";

type Form = { name: string; category: string; subject: string; body: string };

const EMPTY_FORM: Form = { name: "", category: "intake", subject: "", body: "" };

type Props = {
  labels: SupportCenterLabels;
  templates: EditableSupportTemplate[];
  onReload: () => Promise<void>;
  onInsert: (template: EditableSupportTemplate) => void;
};

export default function SupportTemplatesTab({
  labels,
  templates,
  onReload,
  onInsert,
}: Props) {
  const tl = labels.templates;
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("preview");
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<SupportFlash | null>(null);

  const categoryLabel = (code: string) => tl.categoryLabels[code] ?? "—";
  const localeLabel = (code: string) => tl.localeLabels[code] ?? "—";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((t) =>
      [
        t.name,
        tl.categoryLabels[t.category] ?? "",
        tl.localeLabels[t.locale] ?? "",
        t.subject,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query, templates, tl.categoryLabels, tl.localeLabels]);

  const selected = templates.find((t) => t.id === selectedId) ?? null;

  function select(id: string) {
    setSelectedId(id);
    setMode("preview");
    setFlash(null);
  }

  function startEdit(template: EditableSupportTemplate) {
    setForm({
      name: template.name,
      category: template.category,
      subject: template.subject,
      body: template.body,
    });
    setMode("edit");
    setFlash(null);
  }

  function startNew() {
    setForm(EMPTY_FORM);
    setSelectedId(null);
    setMode("new");
    setFlash(null);
  }

  async function post(payload: Record<string, unknown>) {
    setBusy(true);
    setFlash(null);
    try {
      const res = await fetch("/api/platform-portal/support-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        template?: { id?: string };
      };
      if (!res.ok) {
        setFlash({
          tone: "error",
          text:
            json.error === "name_subject_body_required"
              ? tl.errorValidation
              : tl.errorGeneric,
        });
        return null;
      }
      await onReload();
      return json;
    } catch {
      setFlash({ tone: "error", text: tl.errorGeneric });
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (mode === "new") {
      const json = await post({ action: "create", locale: "no", ...form });
      if (json) {
        if (json.template?.id) setSelectedId(json.template.id);
        setMode("preview");
        setFlash({ tone: "success", text: tl.saved });
      }
      return;
    }
    if (mode === "edit" && selected) {
      const json = await post({ action: "update", id: selected.id, ...form });
      if (json) {
        setMode("preview");
        setFlash({ tone: "success", text: tl.saved });
      }
    }
  }

  async function archive(template: EditableSupportTemplate) {
    if (!window.confirm(tl.archiveConfirm)) return;
    const json = await post({ action: "archive", id: template.id });
    if (json) {
      setSelectedId(null);
      setMode("preview");
      setFlash({ tone: "success", text: tl.archived });
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-[color:var(--aipify-text)]">{tl.title}</h2>
          <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{tl.subtitle}</p>
          <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
            {tl.persistBlocked}
          </p>
          <p className="mt-1 text-xs text-[color:var(--aipify-text-secondary)]">{tl.localeNote}</p>
        </div>
        <button type="button" className={primaryButtonClass} onClick={startNew}>
          {tl.newTemplate}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="sr-only">{labels.search}</span>
            <input
              type="search"
              className={inputClass}
              placeholder={tl.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          {filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[color:var(--aipify-border)] p-4 text-sm text-[color:var(--aipify-text-secondary)]">
              {tl.noMatches}
            </p>
          ) : (
            <ul
              aria-label={tl.listAria}
              className="max-h-[32rem] space-y-2 overflow-y-auto pr-1"
            >
              {filtered.map((tpl) => {
                const active = tpl.id === selectedId && mode !== "new";
                return (
                  <li key={tpl.id}>
                    <button
                      type="button"
                      onClick={() => select(tpl.id)}
                      aria-current={active ? "true" : undefined}
                      className={`block w-full rounded-xl border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)] ${
                        active
                          ? "border-[color:var(--aipify-companion-purple)] bg-violet-50"
                          : "border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] hover:bg-[color:var(--aipify-surface-muted)]"
                      }`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-[color:var(--aipify-text)]">
                          {tpl.name}
                        </span>
                        {tpl.starter ? (
                          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                            {tl.starterBadge}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                        {categoryLabel(tpl.category)} · {localeLabel(tpl.locale)}
                      </span>
                      <span className="mt-1 block truncate text-xs text-[color:var(--aipify-text-secondary)]">
                        {tpl.subject}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4 sm:p-5">
          {mode === "preview" && !selected ? (
            <p className="text-sm text-[color:var(--aipify-text-secondary)]">{tl.selectHint}</p>
          ) : null}

          {mode === "preview" && selected ? (
            <div className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-[color:var(--aipify-text)]">
                    {selected.name}
                  </h3>
                  {selected.starter ? (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                      {tl.starterBadge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-[color:var(--aipify-text-secondary)]">
                  {categoryLabel(selected.category)} · {localeLabel(selected.locale)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
                  {tl.subject}
                </p>
                <p className="mt-1 text-sm text-[color:var(--aipify-text)]">{selected.subject}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
                  {tl.previewHeading}
                </p>
                <div className="mt-1 max-h-[22rem] overflow-y-auto whitespace-pre-wrap rounded-lg bg-[color:var(--aipify-surface-muted)] p-4 text-sm leading-relaxed text-[color:var(--aipify-text)]">
                  {selected.body}
                </div>
              </div>
              <p className="text-xs text-[color:var(--aipify-text-secondary)]">
                {tl.variables}: {selected.variables.map((v) => `{{${v}}}`).join(", ")}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={primaryButtonClass}
                  disabled={busy}
                  onClick={() => onInsert(selected)}
                >
                  {tl.insertDraft}
                </button>
                <button
                  type="button"
                  className={secondaryButtonClass}
                  disabled={busy}
                  onClick={() => startEdit(selected)}
                >
                  {tl.edit}
                </button>
                <button
                  type="button"
                  className={secondaryButtonClass}
                  disabled={busy}
                  onClick={() => void archive(selected)}
                >
                  {tl.archive}
                </button>
              </div>
            </div>
          ) : null}

          {mode === "edit" || mode === "new" ? (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void save();
              }}
            >
              <h3 className="text-base font-semibold text-[color:var(--aipify-text)]">
                {mode === "new" ? tl.newHeading : tl.editHeading}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                    {tl.name}
                  </span>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                    {tl.category}
                  </span>
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {Object.entries(tl.categoryLabels).map(([code, label]) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                  {tl.subject}
                </span>
                <input
                  className={inputClass}
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                  {tl.body}
                </span>
                <textarea
                  className={`${inputClass} min-h-[14rem] resize-y leading-relaxed`}
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                />
              </label>
              <p className="text-xs text-[color:var(--aipify-text-secondary)]">
                {tl.variables}: {["customer_name", "ticket_number", "product_name", "agent_name"]
                  .map((v) => `{{${v}}}`)
                  .join(", ")}
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="submit" className={primaryButtonClass} disabled={busy}>
                  {tl.save}
                </button>
                <button
                  type="button"
                  className={secondaryButtonClass}
                  disabled={busy}
                  onClick={() => setMode("preview")}
                >
                  {tl.cancel}
                </button>
              </div>
            </form>
          ) : null}

          <div className="mt-3">
            <FlashMessage flash={flash} />
          </div>
        </div>
      </div>
    </section>
  );
}
