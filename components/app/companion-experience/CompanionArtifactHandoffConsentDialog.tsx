"use client";

import { useEffect, useState } from "react";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";
import {
  executeArtifactHandoff,
  fetchArtifactHandoffPreview,
  startCanvaOAuthConnect,
} from "@/lib/app/companion/artifact-handoff";
import { formatAttachmentByteSize } from "@/lib/app/companion/attachments";

type CompanionArtifactHandoffConsentDialogProps = {
  open: boolean;
  onClose: () => void;
  labels: CompanionExperienceLabels;
  providerKey: string;
  attachmentId: string;
  conversationId: string;
  filename: string;
  onCompleted?: (result: { ok: boolean; open_url?: string | null; status: string }) => void;
};

export function CompanionArtifactHandoffConsentDialog({
  open,
  onClose,
  labels,
  providerKey,
  attachmentId,
  conversationId,
  filename,
  onCompleted,
}: CompanionArtifactHandoffConsentDialogProps) {
  const handoff = labels.attachments.canvaHandoff;
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    mime_type: string;
    byte_size: number;
    handoff_action: string;
    adapter_readiness: string;
  } | null>(null);
  const [connectionConnected, setConnectionConnected] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    void fetchArtifactHandoffPreview({
      providerKey,
      attachmentId,
      conversationId,
    })
      .then((response) => {
        if (!response.ok || !response.preview) {
          setError(handoff.errors.previewFailed);
          return;
        }
        setPreview(response.preview);
        setConnectionConnected(response.connection_connected === true);
      })
      .catch(() => setError(handoff.errors.previewFailed))
      .finally(() => setLoading(false));
  }, [open, providerKey, attachmentId, conversationId, handoff.errors.previewFailed]);

  if (!open) return null;

  async function handleConnectCanva() {
    setError(null);
    const started = await startCanvaOAuthConnect();
    if (started.ok && started.authorize_url) {
      window.location.href = started.authorize_url;
      return;
    }
    setError(handoff.errors.connectFailed);
  }

  async function handleApprove() {
    setExecuting(true);
    setError(null);
    try {
      const result = await executeArtifactHandoff({
        providerKey,
        attachmentId,
        conversationId,
        consentGranted: true,
      });
      if (!result.ok) {
        if (result.status === "connection_missing") {
          setError(handoff.errors.notConnected);
        } else if (result.status === "unsupported_artifact") {
          setError(handoff.errors.unsupportedType);
        } else {
          setError(handoff.errors.handoffFailed);
        }
        onCompleted?.({ ok: false, status: result.status, open_url: null });
        return;
      }
      onCompleted?.({ ok: true, status: result.status, open_url: result.open_url });
      onClose();
    } catch {
      setError(handoff.errors.handoffFailed);
    } finally {
      setExecuting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="companion-handoff-title"
        className="w-full max-w-lg rounded-2xl border border-aipify-border bg-white p-5 shadow-xl"
      >
        <h2 id="companion-handoff-title" className="text-lg font-semibold text-aipify-text">
          {handoff.title}
        </h2>
        <p className="mt-2 text-sm text-aipify-text-secondary">{handoff.subtitle}</p>

        <dl className="mt-4 space-y-3 rounded-xl border border-aipify-border bg-aipify-surface-muted/50 p-4 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
              {handoff.fileLabel}
            </dt>
            <dd className="font-medium text-aipify-text">{filename}</dd>
          </div>
          {preview ? (
            <>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                  {handoff.typeLabel}
                </dt>
                <dd className="text-aipify-text">
                  {preview.mime_type} · {formatAttachmentByteSize(preview.byte_size)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                  {handoff.recipientLabel}
                </dt>
                <dd className="text-aipify-text">{handoff.recipient}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                  {handoff.accessLabel}
                </dt>
                <dd className="text-aipify-text">{handoff.accessScope}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">
                  {handoff.actionLabel}
                </dt>
                <dd className="text-aipify-text">
                  {preview.handoff_action === "artifact.handoff.design_import"
                    ? handoff.expectedImport
                    : preview.handoff_action === "artifact.handoff.asset_upload"
                      ? handoff.expectedUpload
                      : handoff.expectedUnsupported}
                </dd>
              </div>
            </>
          ) : null}
        </dl>

        {!connectionConnected ? (
          <p className="mt-3 text-sm text-amber-800">{handoff.connectRequired}</p>
        ) : null}

        {loading ? <p className="mt-3 text-sm text-aipify-text-muted">{handoff.loadingPreview}</p> : null}
        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-aipify-border px-4 py-2 text-sm font-medium text-aipify-text"
          >
            {handoff.cancel}
          </button>
          {!connectionConnected ? (
            <button
              type="button"
              onClick={() => void handleConnectCanva()}
              className="rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white"
            >
              {handoff.connectCanva}
            </button>
          ) : (
            <button
              type="button"
              disabled={
                executing ||
                loading ||
                preview?.handoff_action === "unsupported"
              }
              onClick={() => void handleApprove()}
              className="rounded-lg bg-aipify-companion px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {handoff.approveSend}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
