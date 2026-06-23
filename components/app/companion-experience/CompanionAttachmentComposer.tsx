"use client";

import { useCallback, useRef, useState } from "react";
import {
  COMPANION_ATTACHMENT_MAX_COUNT,
  type CompanionArtifactProvenanceSource,
} from "@/lib/companion-runtime/artifact-context";
import {
  createLocalAttachmentId,
  formatAttachmentByteSize,
  uploadCompanionAttachment,
  deleteCompanionAttachment,
  setCompanionActiveArtifact,
  type CompanionPendingAttachment,
} from "@/lib/app/companion/attachments";
import type { CompanionExperienceLabels, CompanionChatAttachmentSummary } from "@/lib/app/companion/types";
import { fetchExternalApplicationDiscovery } from "@/lib/app/companion/external-applications";
import { CompanionArtifactHandoffConsentDialog } from "@/components/app/companion-experience/CompanionArtifactHandoffConsentDialog";

type CompanionAttachmentComposerProps = {
  query: string;
  setQuery: (value: string) => void;
  loading: boolean;
  labels: CompanionExperienceLabels;
  conversationId: string;
  onSubmit: (input: {
    question: string;
    attachmentIds: string[];
    activeArtifactId: string | null;
    attachmentSummaries: CompanionChatAttachmentSummary[];
  }) => void;
};

function mapProvenance(source: "picker" | "drop" | "paste"): CompanionArtifactProvenanceSource {
  if (source === "drop") return "drag_drop";
  if (source === "paste") return "clipboard_paste";
  return "file_picker";
}

export function CompanionAttachmentComposer({
  query,
  setQuery,
  loading,
  labels,
  conversationId,
  onSubmit,
}: CompanionAttachmentComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<CompanionPendingAttachment[]>([]);
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [handoffTarget, setHandoffTarget] = useState<{
    attachmentId: string;
    filename: string;
    providerKey: string;
  } | null>(null);
  const [applicationPicker, setApplicationPicker] = useState<{
    attachmentId: string;
    filename: string;
    candidates: string[];
    selectedKey: string;
  } | null>(null);
  const [handoffSuccessUrl, setHandoffSuccessUrl] = useState<string | null>(null);

  const att = labels.attachments;
  const apps = labels.externalApplications;

  const beginApplicationHandoff = useCallback(
    async (row: CompanionPendingAttachment) => {
      if (!row.attachmentId) return;
      setComposerError(null);
      const discovery = await fetchExternalApplicationDiscovery({
        category: row.category,
        mimeType: row.mimeType,
        operation: "handoff",
      });

      const candidates = discovery.selection?.candidates ?? [];
      if (!discovery.ok || candidates.length === 0) {
        setComposerError(apps.noApplicationsAvailable);
        return;
      }

      const selected = discovery.selection?.selected;
      if (discovery.selection?.requires_user_selection || !selected) {
        setApplicationPicker({
          attachmentId: row.attachmentId,
          filename: row.filename,
          candidates: candidates.map((entry) => entry.application_key),
          selectedKey: candidates[0]?.application_key ?? "",
        });
        return;
      }

      setHandoffTarget({
        attachmentId: row.attachmentId,
        filename: row.filename,
        providerKey: selected.application_key,
      });
    },
    [apps.noApplicationsAvailable],
  );

  const queueUpload = useCallback(
    async (files: FileList | File[], source: "picker" | "drop" | "paste") => {
      const list = Array.from(files);
      if (list.length === 0) return;

      if (attachments.length + list.length > COMPANION_ATTACHMENT_MAX_COUNT) {
        setComposerError(att.errors.tooManyFiles);
        return;
      }

      setComposerError(null);
      const provenance = mapProvenance(source);

      for (const file of list) {
        const localId = createLocalAttachmentId();
        const pending: CompanionPendingAttachment = {
          localId,
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          byteSize: file.size,
          category: "other",
          status: "uploading",
          provenance,
          previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        };

        setAttachments((prev) => [...prev, pending]);

        try {
          const uploaded = await uploadCompanionAttachment({
            file,
            conversationId,
            provenance,
          });
          setAttachments((prev) =>
            prev.map((row) =>
              row.localId === localId
                ? {
                    ...row,
                    attachmentId: uploaded.attachment_id,
                    filename: uploaded.original_filename,
                    mimeType: uploaded.mime_type,
                    byteSize: uploaded.byte_size,
                    category: uploaded.category,
                    status: "ready",
                    previewUrl: uploaded.preview_url ?? row.previewUrl,
                  }
                : row,
            ),
          );
          setActiveArtifactId(uploaded.attachment_id);
          await setCompanionActiveArtifact(conversationId, uploaded.attachment_id);
        } catch {
          setAttachments((prev) =>
            prev.map((row) =>
              row.localId === localId
                ? { ...row, status: "error", errorMessage: att.errors.uploadFailed }
                : row,
            ),
          );
        }
      }
    },
    [attachments.length, att.errors.tooManyFiles, att.errors.uploadFailed, conversationId],
  );

  const removeAttachment = useCallback(
    async (localId: string) => {
      const target = attachments.find((row) => row.localId === localId);
      if (!target) return;

      if (target.attachmentId) {
        try {
          await deleteCompanionAttachment(target.attachmentId);
        } catch {
          setComposerError(att.errors.removeFailed);
          return;
        }
      }

      if (target.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(target.previewUrl);
      }

      setAttachments((prev) => prev.filter((row) => row.localId !== localId));
      if (activeArtifactId === target.attachmentId) {
        setActiveArtifactId(null);
      }
    },
    [activeArtifactId, attachments, att.errors.removeFailed],
  );

  const readyAttachmentIds = attachments
    .filter((row) => row.status === "ready" && row.attachmentId)
    .map((row) => row.attachmentId!);

  const canSubmit =
    !loading &&
    (query.trim().length > 0 || readyAttachmentIds.length > 0) &&
    attachments.every((row) => row.status !== "uploading");

  return (
    <div className="flex flex-col gap-2">
      {attachments.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-xl border border-aipify-border bg-aipify-surface-muted/60 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-aipify-text-secondary">{att.stagedTitle}</p>
            {attachments.length > 1 ? (
              <label className="flex items-center gap-2 text-xs text-aipify-text-secondary">
                <span>{att.activeArtifactLabel}</span>
                <select
                  value={activeArtifactId ?? ""}
                  onChange={(event) => {
                    const next = event.target.value || null;
                    setActiveArtifactId(next);
                    if (next) void setCompanionActiveArtifact(conversationId, next);
                  }}
                  className="rounded-md border border-aipify-border bg-white px-2 py-1 text-xs text-aipify-text"
                  aria-label={att.activeArtifactLabel}
                >
                  {attachments
                    .filter((row) => row.status === "ready" && row.attachmentId)
                    .map((row) => (
                      <option key={row.localId} value={row.attachmentId}>
                        {row.filename}
                      </option>
                    ))}
                </select>
              </label>
            ) : null}
          </div>
          <ul className="flex flex-col gap-2">
            {attachments.map((row) => (
              <li
                key={row.localId}
                className="flex items-start gap-3 rounded-lg border border-aipify-border bg-white p-2"
              >
                {row.previewUrl && row.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.previewUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-violet-50 text-xs font-medium text-violet-700">
                    {row.category.toUpperCase().slice(0, 3)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-aipify-text">{row.filename}</p>
                  <p className="text-xs text-aipify-text-muted">
                    {formatAttachmentByteSize(row.byteSize)}
                    {row.status === "uploading" ? ` · ${att.statusUploading}` : null}
                    {row.status === "error" ? ` · ${row.errorMessage ?? att.errors.uploadFailed}` : null}
                    {row.attachmentId === activeArtifactId ? ` · ${att.activeBadge}` : null}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {row.status === "ready" && row.attachmentId ? (
                    <button
                      type="button"
                      onClick={() => void beginApplicationHandoff(row)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-aipify-companion hover:bg-violet-50"
                    >
                      {apps.useInApplication}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void removeAttachment(row.localId)}
                    className="rounded-md px-2 py-1 text-xs text-aipify-text-muted hover:bg-aipify-surface-muted"
                    aria-label={att.removeAttachment.replace("{filename}", row.filename)}
                  >
                    {att.remove}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {composerError ? (
        <p role="alert" className="text-xs text-red-700">
          {composerError}
        </p>
      ) : null}

      {handoffSuccessUrl ? (
        <p className="text-xs text-aipify-text-secondary">
          <a
            href={handoffSuccessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-aipify-companion underline"
          >
            {att.canvaHandoff.successOpen}
          </a>
        </p>
      ) : null}

      {applicationPicker ? (
        <div className="rounded-xl border border-aipify-border bg-white p-3 text-sm">
          <p className="font-medium text-aipify-text">{apps.chooseApplication}</p>
          <p className="mt-1 text-xs text-aipify-text-muted">{applicationPicker.filename}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value={applicationPicker.selectedKey}
              onChange={(event) =>
                setApplicationPicker((current) =>
                  current ? { ...current, selectedKey: event.target.value } : current,
                )
              }
              className="rounded-md border border-aipify-border bg-white px-2 py-1 text-xs"
              aria-label={apps.chooseApplication}
            >
              {applicationPicker.candidates.map((key) => (
                <option key={key} value={key}>
                  {apps.providers[key as keyof typeof apps.providers] ?? key}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="rounded-md bg-aipify-companion px-3 py-1 text-xs font-medium text-white"
              onClick={() => {
                setHandoffTarget({
                  attachmentId: applicationPicker.attachmentId,
                  filename: applicationPicker.filename,
                  providerKey: applicationPicker.selectedKey,
                });
                setApplicationPicker(null);
              }}
            >
              {att.canvaHandoff.approveSend}
            </button>
            <button
              type="button"
              className="rounded-md border border-aipify-border px-3 py-1 text-xs"
              onClick={() => setApplicationPicker(null)}
            >
              {att.canvaHandoff.cancel}
            </button>
          </div>
        </div>
      ) : null}

      {handoffTarget ? (
        <CompanionArtifactHandoffConsentDialog
          open
          onClose={() => setHandoffTarget(null)}
          labels={labels}
          providerKey={handoffTarget.providerKey}
          attachmentId={handoffTarget.attachmentId}
          conversationId={conversationId}
          filename={handoffTarget.filename}
          onCompleted={(result) => {
            if (result.ok && result.open_url) {
              setHandoffSuccessUrl(result.open_url);
            }
          }}
        />
      ) : null}

      <form
        className="flex flex-col gap-1.5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) return;
          onSubmit({
            question: query.trim(),
            attachmentIds: readyAttachmentIds,
            activeArtifactId,
            attachmentSummaries: attachments
              .filter((row) => row.status === "ready" && row.attachmentId)
              .map(
                (row): CompanionChatAttachmentSummary => ({
                  attachment_id: row.attachmentId!,
                  filename: row.filename,
                  mime_type: row.mimeType,
                  category: row.category,
                  byte_size: row.byteSize,
                  preview_url: row.previewUrl,
                }),
              ),
          });
          setAttachments([]);
          setActiveArtifactId(null);
          setComposerError(null);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          if (event.dataTransfer.files?.length) {
            void queueUpload(event.dataTransfer.files, "drop");
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          accept="image/*,.pdf,.txt,.md,.doc,.docx,.odt,.rtf"
          onChange={(event) => {
            if (event.target.files?.length) {
              void queueUpload(event.target.files, "picker");
              event.target.value = "";
            }
          }}
        />
        <div className="grid w-full grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || attachments.length >= COMPANION_ATTACHMENT_MAX_COUNT}
            className="col-start-1 row-start-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-aipify-border bg-white text-aipify-companion hover:bg-violet-50 disabled:opacity-60"
            aria-label={att.addAttachment}
            title={att.addAttachment}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.961-1.01a2.25 2.25 0 1 1-3.183-3.183l3.183 3.183Z" />
            </svg>
          </button>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onPaste={(event) => {
              const items = event.clipboardData?.items;
              if (!items) return;
              const files: File[] = [];
              for (const item of items) {
                if (item.kind === "file") {
                  const file = item.getAsFile();
                  if (file) files.push(file);
                }
              }
              if (files.length > 0) {
                event.preventDefault();
                void queueUpload(files, "paste");
              }
            }}
            placeholder={labels.inputPlaceholder}
            className="col-start-2 row-start-1 min-h-12 min-w-0 rounded-xl border border-aipify-border bg-white px-4 py-3 text-base text-aipify-text placeholder:text-aipify-text-muted focus:border-aipify-companion focus:outline-none focus:ring-2 focus:ring-violet-200"
            aria-label={labels.inputPlaceholder}
            aria-describedby="companion-attachment-drop-hint"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="col-start-3 row-start-1 inline-flex h-12 shrink-0 items-center justify-center self-center rounded-xl bg-aipify-companion px-5 text-base font-medium text-white hover:bg-violet-700 disabled:opacity-60"
          >
            {labels.askAipifyButton}
          </button>
          <div className="col-start-2 row-start-2 min-w-0">
            <p
              id="companion-attachment-drop-hint"
              className="hidden text-[11px] leading-snug text-aipify-text-muted sm:block"
            >
              {att.dropHint}
            </p>
            <button
              type="button"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-aipify-text-muted hover:bg-aipify-surface-muted hover:text-aipify-text-secondary sm:hidden"
              title={att.dropHint}
              aria-label={att.dropHint}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
