"use client";

import { useRef, useState, useTransition } from "react";
import { LockKeyhole, UserRound } from "lucide-react";
import type { AccountProfileLabels } from "@/lib/app/account-profile/labels";
import type { AccountProfileView } from "@/lib/app/account-profile/types";

type Props = {
  view: AccountProfileView;
  labels: AccountProfileLabels;
};

function fieldFallback(value: string | null, labels: AccountProfileLabels): string {
  if (value) return value;
  return labels.notRegistered;
}

export function AccountPersonalEditor({ view, labels }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState(view.fullName.value ?? "");
  const [phone, setPhone] = useState(view.phone.value ?? "");
  const [avatarUrl, setAvatarUrl] = useState(view.avatarUrl);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const busy = pending || status === "saving";

  async function saveProfile() {
    setStatus("saving");
    setError(null);
    const res = await fetch("/api/app/account-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: fullName.trim(), phone: phone.trim() }),
    });
    if (!res.ok) {
      setStatus("error");
      setError(labels.saveError);
      return;
    }
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  async function uploadAvatar(file: File) {
    setStatus("saving");
    setError(null);
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/app/account-profile/avatar", { method: "POST", body: form });
    if (!res.ok) {
      setStatus("error");
      setError(labels.avatarUploadError);
      return;
    }
    const body = (await res.json()) as { avatarUrl?: string };
    setAvatarUrl(body.avatarUrl ?? null);
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  async function removeAvatar() {
    setStatus("saving");
    setError(null);
    const res = await fetch("/api/app/account-profile/avatar", { method: "DELETE" });
    if (!res.ok) {
      setStatus("error");
      setError(labels.avatarRemoveError);
      return;
    }
    setAvatarUrl(null);
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--app-text)]">
        <UserRound aria-hidden className="h-4 w-4 text-[var(--app-primary)]" />
        {labels.personalTitle}
      </h2>

      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4 sm:flex-row sm:items-center">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- same-origin avatar pointer or legacy https
          <img
            src={avatarUrl}
            alt=""
            width={72}
            height={72}
            className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-[var(--app-primary-soft)] text-xl font-semibold text-[var(--app-primary)]"
            aria-hidden
          >
            {view.initials}
          </div>
        )}
        <div className="flex min-w-0 flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) startTransition(() => void uploadAvatar(file));
              event.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="inline-flex min-h-10 items-center rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-3 text-sm font-medium text-[var(--app-text)] hover:border-[var(--app-primary)] disabled:opacity-60"
          >
            {labels.avatarUpload}
          </button>
          {avatarUrl ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => startTransition(() => void removeAvatar())}
              className="inline-flex min-h-10 items-center rounded-xl border border-[var(--app-border)] px-3 text-sm font-medium text-[var(--app-text-muted)] hover:border-rose-300 hover:text-rose-700 disabled:opacity-60"
            >
              {labels.avatarRemove}
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3">
          <span className="text-xs font-medium text-[var(--app-text-muted)]">{labels.fullName}</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={120}
            className="mt-1 w-full border-0 bg-transparent p-0 text-sm font-medium text-[var(--app-text)] outline-none focus:ring-0"
          />
        </label>
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-[var(--app-text-muted)]">{labels.email}</p>
            <span className="inline-flex items-center text-[var(--app-text-muted)]" title={labels.emailLockedReason}>
              <LockKeyhole aria-hidden className="h-3.5 w-3.5" />
              <span className="sr-only">{labels.emailLockedReason}</span>
            </span>
          </div>
          <p className="mt-1 break-words text-sm font-medium text-[var(--app-text)]">
            {fieldFallback(view.email.value, labels)}
          </p>
        </div>
        <label className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3">
          <span className="text-xs font-medium text-[var(--app-text-muted)]">{labels.phone}</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={40}
            className="mt-1 w-full border-0 bg-transparent p-0 text-sm font-medium text-[var(--app-text)] outline-none focus:ring-0"
          />
        </label>
        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-[var(--app-text-muted)]">{labels.address}</p>
            <span className="inline-flex items-center text-[var(--app-text-muted)]" title={labels.readOnlyReason}>
              <LockKeyhole aria-hidden className="h-3.5 w-3.5" />
              <span className="sr-only">{labels.readOnlyReason}</span>
            </span>
          </div>
          <p className="mt-1 break-words text-sm font-medium text-[var(--app-text)]">
            {view.address.source === "unavailable" ? labels.unavailable : fieldFallback(view.address.value, labels)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy || fullName.trim().length < 1}
          onClick={() => startTransition(() => void saveProfile())}
          className="inline-flex min-h-11 items-center rounded-xl bg-[var(--app-primary)] px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {labels.save}
        </button>
        {status === "saved" ? (
          <p className="text-sm text-emerald-700">{labels.saveSuccess}</p>
        ) : null}
        {status === "error" && error ? <p className="text-sm text-rose-700">{error}</p> : null}
      </div>
    </section>
  );
}
