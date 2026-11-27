"use client";

import { AlertTriangle, CheckCircle2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  PARTNERS_AVATAR_ALLOWED_MIME,
  PARTNERS_AVATAR_API_PATH,
  PARTNERS_AVATAR_MAX_BYTES,
  isPartnersAvatarMime,
} from "@/lib/partners-portal/avatar";
import { compressPartnersAvatar } from "@/lib/partners-portal/avatar-compress";
import type { PartnersPortalAvatarLabels } from "@/lib/partners-portal/shell-labels";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

type Props = {
  labels: PartnersPortalAvatarLabels;
  /** Same-origin pointer from auth metadata (server-resolved), or null when no photo is set. */
  initialAvatarUrl: string | null;
  /** Sit inside the profile identity row instead of a separate tall card. */
  embedded?: boolean;
};

type Notice = { tone: "success" | "error"; text: string } | null;

export function PartnersProfileAvatarPanel({ labels, initialAvatarUrl, embedded = false }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [busy, setBusy] = useState<"optimize" | "upload" | "remove" | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  function errorTextFor(status: number, code?: string): string {
    if (status === 401 || status === 403) return labels.errorSession;
    if (code === "too_large" || status === 413) return labels.errorSize;
    if (code === "unsupported_type") return labels.errorType;
    if (code === "storage_unavailable" || code === "profile_unavailable") return labels.errorUnavailable;
    return labels.errorGeneric;
  }

  async function readError(res: Response): Promise<string> {
    let code: string | undefined;
    try {
      const body = (await res.json()) as { error?: unknown };
      if (typeof body.error === "string") code = body.error;
    } catch {
      // No JSON body — fall back to the status code.
    }
    return errorTextFor(res.status, code);
  }

  async function onFileChosen(file: File | undefined) {
    if (!file) return;
    setNotice(null);
    if (!isPartnersAvatarMime(file.type)) {
      setNotice({ tone: "error", text: labels.errorType });
      return;
    }

    // Phone photos are usually several MB: resize + re-encode in the browser (also strips EXIF)
    // instead of rejecting. The server still enforces type, magic bytes and the size cap.
    setBusy("optimize");
    const prepared = await compressPartnersAvatar(file);
    if (!prepared.ok) {
      setNotice({ tone: "error", text: prepared.reason === "too_large" ? labels.errorSize : labels.errorImage });
      setBusy(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (prepared.file.size > PARTNERS_AVATAR_MAX_BYTES) {
      setNotice({ tone: "error", text: labels.errorSize });
      setBusy(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setBusy("upload");
    try {
      const form = new FormData();
      form.set("file", prepared.file);
      const res = await fetch(PARTNERS_AVATAR_API_PATH, { method: "POST", body: form });
      if (!res.ok) {
        setNotice({ tone: "error", text: await readError(res) });
        return;
      }
      const body = (await res.json()) as { avatarUrl?: string | null };
      setAvatarUrl(typeof body.avatarUrl === "string" ? body.avatarUrl : null);
      setNotice({ tone: "success", text: labels.saved });
      router.refresh();
    } catch {
      setNotice({ tone: "error", text: labels.errorGeneric });
    } finally {
      setBusy(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onRemove() {
    setNotice(null);
    setBusy("remove");
    try {
      const res = await fetch(PARTNERS_AVATAR_API_PATH, { method: "DELETE" });
      if (!res.ok) {
        setNotice({ tone: "error", text: await readError(res) });
        return;
      }
      setAvatarUrl(null);
      setNotice({ tone: "success", text: labels.removed });
      router.refresh();
    } catch {
      setNotice({ tone: "error", text: labels.errorGeneric });
    } finally {
      setBusy(null);
    }
  }

  const buttonBase =
    "inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus disabled:opacity-60";

  const frame = embedded
    ? "flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center"
    : "flex flex-col gap-6 sm:flex-row sm:items-center";
  const photoClass = embedded
    ? "flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface-muted text-aipify-text-muted"
    : "flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-aipify-border bg-aipify-surface-muted text-aipify-text-muted";

  const body = (
      <div className={frame}>
        <div className={photoClass} aria-busy={busy !== null}>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- private same-origin pointer, not optimizable
            <img src={avatarUrl} alt={labels.avatarAlt} className="h-full w-full object-cover" />
          ) : (
            <UserRound className={embedded ? "h-7 w-7" : "h-10 w-10"} aria-hidden />
          )}
        </div>

          <div className="min-w-0 space-y-3">
          {embedded ? (
            <p className="text-xs text-aipify-text-muted">
              {avatarUrl ? labels.current : labels.empty} · {labels.hint}
            </p>
          ) : (
            <div>
              <h2 id="partners-avatar-title" className="text-lg font-semibold text-aipify-text">
                {labels.title}
              </h2>
              <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
              <p className="mt-1 text-xs text-aipify-text-muted">
                {avatarUrl ? labels.current : labels.empty} · {labels.hint}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <input
              ref={inputRef}
              type="file"
              accept={PARTNERS_AVATAR_ALLOWED_MIME.join(",")}
              className="sr-only"
              tabIndex={-1}
              aria-label={avatarUrl ? labels.replace : labels.upload}
              onChange={(event) => void onFileChosen(event.target.files?.[0])}
            />
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => inputRef.current?.click()}
              className={`${buttonBase} bg-aipify-companion text-white hover:opacity-95`}
            >
              {busy === "optimize"
                ? labels.optimizing
                : busy === "upload"
                  ? labels.uploading
                  : avatarUrl
                    ? labels.replace
                    : labels.upload}
            </button>
            {avatarUrl ? (
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void onRemove()}
                className={`${buttonBase} border border-aipify-border bg-aipify-surface text-aipify-text hover:border-aipify-companion/35`}
              >
                {busy === "remove" ? labels.removing : labels.remove}
              </button>
            ) : null}
          </div>

          {notice ? (
            <p
              role={notice.tone === "error" ? "alert" : "status"}
              className={`inline-flex items-start gap-2 rounded-lg px-3 py-2 text-sm ring-1 ${
                notice.tone === "error"
                  ? "bg-amber-50 text-amber-900 ring-amber-200"
                  : "bg-emerald-50 text-emerald-900 ring-emerald-200"
              }`}
            >
              {notice.tone === "error" ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              )}
              <span>{notice.text}</span>
            </p>
          ) : null}

          <p className="text-xs text-aipify-text-muted">{labels.privacyNote}</p>
        </div>
      </div>
  );

  if (embedded) {
    return (
      <div aria-label={labels.title}>{body}</div>
    );
  }

  return (
    <section className={`${AipifyShellClasses.surfaceCard} p-6 sm:p-8`} aria-labelledby="partners-avatar-title">
      {body}
    </section>
  );
}
