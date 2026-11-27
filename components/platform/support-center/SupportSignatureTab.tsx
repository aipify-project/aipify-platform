"use client";

import { useMemo, useState } from "react";
import {
  createDefaultSupportSignature,
  isTechnicalVerificationDisplayName,
  renderSupportSignatureHtml,
  renderSupportSignatureText,
  type SupportSignatureDraft,
} from "@/lib/platform-portal/support-center";
import type { SupportCenterLabels } from "./support-center-labels";
import {
  FlashMessage,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  type SupportFlash,
} from "./support-center-ui";

export type StoredSignatureState = {
  signature: SupportSignatureDraft;
  customized: boolean;
  loaded: boolean;
  loadFailed: boolean;
};

type Props = {
  labels: SupportCenterLabels;
  stored: StoredSignatureState;
  onStored: (next: { signature: SupportSignatureDraft; customized: boolean }) => void;
};

const FIELD_KEYS = [
  "displayName",
  "agentName",
  "agentTitle",
  "companyName",
  "websiteUrl",
  "supportEmail",
  "phone",
  "addressLine",
] as const;

function sameSignature(a: SupportSignatureDraft, b: SupportSignatureDraft): boolean {
  return (
    FIELD_KEYS.every((key) => a[key] === b[key]) &&
    a.includeLogo === b.includeLogo &&
    a.active === b.active
  );
}

export default function SupportSignatureTab({ labels, stored, onStored }: Props) {
  const sl = labels.signature;
  // `edits` holds the working copy; null means the form mirrors the saved signature.
  const [edits, setEdits] = useState<SupportSignatureDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<SupportFlash | null>(null);
  const [confirm, setConfirm] = useState<"save" | "reset" | null>(null);

  const form = edits ?? stored.signature;
  const dirty = edits !== null && !sameSignature(edits, stored.signature);
  const html = useMemo(() => renderSupportSignatureHtml(form), [form]);
  const text = useMemo(() => renderSupportSignatureText(form), [form]);

  const fieldLabels: Record<(typeof FIELD_KEYS)[number], string> = {
    displayName: sl.displayName,
    agentName: sl.agentName,
    agentTitle: sl.agentTitle,
    companyName: sl.companyName,
    websiteUrl: sl.website,
    supportEmail: sl.supportEmail,
    phone: sl.phone,
    addressLine: sl.address,
  };

  function update(patch: Partial<SupportSignatureDraft>) {
    setEdits({ ...form, ...patch });
    setFlash(null);
  }

  function errorText(code: string | undefined): string {
    if (code === "invalid_support_email") return sl.errorInvalidEmail;
    if (code === "invalid_website") return sl.errorInvalidWebsite;
    if (code === "name_required") return sl.errorNameRequired;
    return sl.saveFailed;
  }

  async function post(payload: Record<string, unknown>) {
    setBusy(true);
    setFlash(null);
    try {
      const res = await fetch("/api/platform-portal/support-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        signature?: SupportSignatureDraft;
        customized?: boolean;
      };
      if (!res.ok || !json.signature) {
        // Keep the form exactly as the user left it.
        setFlash({ tone: "error", text: errorText(json.error) });
        return false;
      }
      onStored({ signature: json.signature, customized: Boolean(json.customized) });
      setEdits(null);
      return true;
    } catch {
      setFlash({ tone: "error", text: sl.saveFailed });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (await post({ action: "save", signature: form })) {
      setConfirm(null);
      setFlash({ tone: "success", text: sl.saved });
    }
  }

  /** Form-only restore — never overwrites the saved signature. */
  function restoreDefaultsInForm() {
    setEdits(createDefaultSupportSignature());
    setFlash({ tone: "info", text: sl.resetDone });
  }

  async function resetAndSave() {
    if (await post({ action: "reset" })) {
      setConfirm(null);
      setFlash({ tone: "success", text: sl.resetSaved });
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-[color:var(--aipify-text)]">{sl.title}</h2>
        <p className="text-sm text-[color:var(--aipify-text-secondary)]">{sl.subtitle}</p>
        <p className="text-xs text-[color:var(--aipify-text-secondary)]">{sl.persistBlocked}</p>
        <p className="text-xs font-medium text-[color:var(--aipify-text)]">
          {stored.loadFailed
            ? sl.loadFailed
            : stored.customized
              ? sl.customSaved
              : sl.usingDefaults}
        </p>
        {isTechnicalVerificationDisplayName(form.displayName) ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {sl.technicalDisplayNotice}
          </p>
        ) : null}
        <p className="text-sm text-[color:var(--aipify-text)]">
          {form.supportEmail.trim()
            ? `${sl.supportEmailStatus}: ${form.supportEmail.trim()}`
            : sl.supportEmailMissing}
        </p>
        {FIELD_KEYS.map((key) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium text-[color:var(--aipify-text)]">
              {fieldLabels[key]}
            </span>
            <input
              className={inputClass}
              value={form[key]}
              onChange={(e) => update({ [key]: e.target.value })}
            />
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm text-[color:var(--aipify-text)]">
          <input
            type="checkbox"
            checked={form.includeLogo}
            onChange={(e) => update({ includeLogo: e.target.checked })}
          />
          {sl.includeLogo}
        </label>
        {dirty ? (
          <p className="text-xs font-medium text-amber-800">{sl.unsaved}</p>
        ) : null}
        <FlashMessage flash={flash} />
        {confirm ? (
          <div
            role="dialog"
            aria-modal="true"
            className="rounded-lg border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] p-3"
          >
            <p className="text-sm text-[color:var(--aipify-text)]">
              {confirm === "save" ? sl.saveConfirm : sl.resetAndSaveConfirm}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className={primaryButtonClass}
                disabled={busy}
                onClick={() => void (confirm === "save" ? save() : resetAndSave())}
              >
                {sl.confirmAction}
              </button>
              <button
                type="button"
                className={secondaryButtonClass}
                disabled={busy}
                onClick={() => setConfirm(null)}
              >
                {sl.cancelConfirm}
              </button>
            </div>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={primaryButtonClass}
            disabled={busy || !dirty}
            onClick={() => setConfirm("save")}
          >
            {sl.save}
          </button>
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={busy}
            onClick={restoreDefaultsInForm}
          >
            {sl.resetDefaults}
          </button>
          <button
            type="button"
            className={secondaryButtonClass}
            disabled={busy || !stored.customized}
            onClick={() => setConfirm("reset")}
          >
            {sl.resetAndSave}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-[color:var(--aipify-border)] bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">{sl.previewLight}</h3>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-100">{sl.previewDark}</h3>
          <div
            className="support-signature-dark-preview"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        <div className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-muted)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[color:var(--aipify-text)]">
            {sl.previewText}
          </h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--aipify-text)]">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
