"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { createKompisOperatorIdempotencyKey } from "@/lib/kompis-operator/ids";
import type { KompisOperatorLabels } from "@/lib/kompis-operator/labels";
import { SEVERITY_BADGE_CLASS, riskClassTone, runStatusTone } from "@/lib/kompis-operator/severity";
import type { WebsiteCmsLabels } from "@/lib/website-cms/labels";
import {
  websiteCmsOperationStatusLabelKey,
  websiteCmsOperationStatusTone,
  websiteCmsReleaseChainLabelKey,
  websiteCmsReleaseChainTone,
  websiteCmsStatusLabelKey,
  websiteCmsVersionStatusLabelKey,
  websiteCmsVersionStatusTone,
  websiteCmsWebsiteStatusTone,
} from "@/lib/website-cms/labels";
import type { CustomerWebsiteRuntimeLabels } from "@/lib/customer-website-runtime/labels";
import { CustomerWebsiteRuntimeReadinessCard } from "@/components/app/website/CustomerWebsiteRuntimeReadinessCard";
import type { WebsiteReleaseChainReadiness } from "@/lib/website-staging-verification/types";
import {
  formatKompisWebsiteDateTime,
  KOMPIS_PLAN_TITLE_KEYS,
  resolveContentLocaleLabel,
  resolveKompisResultSummary,
  resolveKompisToolLabel,
  resolveKompisWebsiteStatusLabel,
  resolveKompisWebsiteStatusTone,
  shortenTechnicalId,
  WEBSITE_SEO_FINDING_LOCALE_KEYS,
  type WebsiteSeoFindingCode,
} from "@/lib/kompis-operator/website-presentation";

type Workspace = {
  available: boolean;
  suspended: boolean;
  revoked: boolean;
  organization: Record<string, unknown>;
  agreement: Record<string, unknown> | null;
  parentLicense: Record<string, unknown> | null;
  websiteKompis: Record<string, unknown>;
  ai?: {
    providerConfigured?: boolean;
    providerStatus?: string;
    liveAiActive?: boolean;
    deterministicFallbackActive?: boolean;
    readiness?: string;
    circuitOpen?: boolean;
  };
  readiness?: {
    status?: string;
    liveAiActive?: boolean;
    providerConfigured?: boolean;
  };
};

type WebsiteCmsContextView = {
  available: boolean;
  organizationId: string | null;
  domain: string | null;
  acknowledgementOk: boolean;
  website: {
    id: string;
    status: string;
    defaultLocale: string;
    activeLocales: string[];
    currentVersionId: string | null;
  } | null;
  currentVersion: {
    id: string;
    versionNumber: number;
    status: string;
    previewVerifiedAt: string | null;
  } | null;
  capabilities: {
    authoritativePageModel: boolean;
    draftCapability: boolean;
    previewCapability: boolean;
    publishCapability: boolean;
    rollbackCapability: boolean;
  };
};

type WebsiteCmsVersionRow = {
  id: string;
  version_number: number;
  status: string;
  change_summary?: string | null;
  preview_verified_at?: string | null;
  created_at?: string | null;
};

type WebsiteCmsOperationRow = {
  id: string;
  operation_kind: string;
  status: string;
  resulting_version_id?: string | null;
  error_code?: string | null;
  created_at?: string | null;
};

type Conversation = { id: string; title: string; updated_at?: string };
type RunView = {
  id: string;
  status: string;
  approval_status?: string;
  core_approval_required?: boolean;
  core_approval_request_id?: string | null;
  risk_class?: number;
  user_summary?: string;
  result_summary?: string;
  plan?: { title?: string; steps?: Array<{ sequence: number; toolKey: string; purpose: string }> };
};

function Badge({
  tone,
  label,
}: {
  tone: keyof typeof SEVERITY_BADGE_CLASS;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${SEVERITY_BADGE_CLASS[tone]}`}
      role="status"
    >
      {label}
    </span>
  );
}

export function KompisOperatorWorkspacePanel({
  labels,
  websiteCmsLabels,
  websiteRuntimeLabels,
  locale,
}: {
  labels: KompisOperatorLabels;
  websiteCmsLabels: WebsiteCmsLabels;
  websiteRuntimeLabels: CustomerWebsiteRuntimeLabels;
  locale: string;
}) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [requestText, setRequestText] = useState("");
  const [activeRun, setActiveRun] = useState<RunView | null>(null);
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<"tasks" | "website">("tasks");
  const [website, setWebsite] = useState<{
    context?: Record<string, unknown>;
    pages?: Array<Record<string, unknown>>;
    drafts?: Array<Record<string, unknown>>;
    seo?: { findingCount?: number; findings?: Array<Record<string, unknown>> };
    locales?: { localeGaps?: number; pagesPerLocale?: Record<string, number> };
    tools?: { unavailable?: Array<{ key: string; reason: string }> };
    runtime?: {
      available?: boolean;
      websiteProvisioned?: boolean;
      runtimeEnabled?: boolean;
      homepageEnabled?: boolean;
      mountedPaths?: string[];
      activeVersionNumber?: number | null;
      manifestChecksum?: string | null;
      dbPublished?: boolean;
      acknowledgementStatus?: string | null;
      httpStatus?: string | null;
      lastOperationStatus?: string | null;
      fullyVerified?: boolean;
      lastFullyVerifiedAt?: string | null;
      businessStatus?: string;
    };
    publish?: { code?: string; blockers?: string[]; mechanismAvailable?: boolean };
    actions?: {
      buildCandidateAllowed?: boolean;
      publishAllowed?: boolean;
      rollbackAllowed?: boolean;
      blockReasons?: string[];
    };
    consistency?: { ok?: boolean; issues?: string[] };
  } | null>(null);

  const [cms, setCms] = useState<WebsiteCmsContextView | null>(null);
  const [cmsVersions, setCmsVersions] = useState<WebsiteCmsVersionRow[]>([]);
  const [cmsHistory, setCmsHistory] = useState<WebsiteCmsOperationRow[]>([]);
  const [selectedDraftIds, setSelectedDraftIds] = useState<string[]>([]);
  const [candidateReason, setCandidateReason] = useState("");
  const [candidate, setCandidate] = useState<{
    candidateId: string;
    versionNumber: number;
    contentChecksum: string;
    manifestChecksum: string;
  } | null>(null);
  const [previewInfo, setPreviewInfo] = useState<{
    previewId: string;
    expiresAt: string;
    verified: boolean;
  } | null>(null);
  const [publishReason, setPublishReason] = useState("");
  const [publishConfirmed, setPublishConfirmed] = useState(false);
  const [rollbackTargetId, setRollbackTargetId] = useState<string | null>(null);
  const [rollbackReason, setRollbackReason] = useState("");
  const [rollbackConfirmed, setRollbackConfirmed] = useState(false);
  const [rollbackPreviewId, setRollbackPreviewId] = useState<string | null>(null);
  const [cmsMessage, setCmsMessage] = useState<string | null>(null);
  const [cmsPending, startCmsTransition] = useTransition();
  const [releaseChainReadiness, setReleaseChainReadiness] =
    useState<WebsiteReleaseChainReadiness | null>(null);

  const statusLabel = (status: string | null | undefined) =>
    resolveKompisWebsiteStatusLabel(status, labels.statuses, labels.statuses.unknown);
  const contentLocaleLabel = (code: string | null | undefined) =>
    resolveContentLocaleLabel(code, labels.contentLocales, labels.contentLocales.unknown);
  const formatDate = (value: string | null | undefined) =>
    formatKompisWebsiteDateTime(
      value,
      locale,
      labels.workspace.emptyDate,
      labels.workspace.invalidDate,
    );
  const publishCapabilityLabel = () => {
    const code = website?.publish?.code;
    if (code === "ready_for_publish") return labels.statuses.readyForPublish;
    if (code === "publish_requires_approval") return labels.statuses.publishRequiresApproval;
    if (code === "publish_temporarily_blocked") return labels.statuses.publishTemporarilyBlocked;
    if (code === "publish_not_configured") return labels.statuses.publishNotConfigured;
    if (cms?.capabilities.publishCapability || website?.publish?.mechanismAvailable) {
      return labels.statuses.publishRequiresApproval;
    }
    return labels.statuses.publishNotConfigured;
  };
  const runtimeBusinessLabel = () => {
    const code = website?.runtime?.businessStatus;
    if (code === "fully_verified" || website?.runtime?.fullyVerified) {
      return labels.statuses.fullyVerified;
    }
    if (code === "awaiting_acknowledgement") return labels.statuses.awaitingAcknowledgement;
    if (code === "http_verification_missing") return labels.statuses.httpVerificationMissing;
    if (code === "verification_failed") return labels.statuses.verificationFailed;
    if (code === "not_configured") return labels.statuses.notConfigured;
    if (website?.context?.acknowledgementOk === true) return labels.statuses.attention;
    return labels.statuses.notConfigured;
  };
  const seoFindingLabel = (code: string | null | undefined) => {
    if (!code) return labels.statuses.unknown;
    const key = WEBSITE_SEO_FINDING_LOCALE_KEYS[code as WebsiteSeoFindingCode];
    return (key && labels.seoFindings[key]) || labels.statuses.unknown;
  };
  const actionBlockMessage = () => {
    const reasons = website?.actions?.blockReasons ?? [];
    if (reasons.includes("no_approved_drafts")) return labels.workspace.selectApprovedDraft;
    if (reasons.includes("runtime_requires_attention")) return labels.workspace.runtimeMustBeChecked;
    if (reasons.includes("conflicting_operation")) return labels.workspace.conflictingPublish;
    if (reasons.includes("authoritative_state_inconsistent")) return labels.workspace.stateInconsistent;
    if (reasons.includes("approval_contract_unavailable")) return labels.workspace.approvalMissing;
    return labels.workspace.actionBlockedTitle;
  };
  const currentVersionId = cms?.currentVersion?.id ?? cms?.website?.currentVersionId ?? null;
  const draftRows = (website?.drafts ?? website?.pages ?? []) as Array<Record<string, unknown>>;
  const runtimeInitial =
    website?.runtime != null
      ? {
          available: website.runtime.available !== false,
          websiteProvisioned: Boolean(website.runtime.websiteProvisioned),
          contractVersion: null as string | null,
          runtimeEnabled: Boolean(website.runtime.runtimeEnabled),
          homepageEnabled: Boolean(website.runtime.homepageEnabled),
          mountedPaths: Array.isArray(website.runtime.mountedPaths)
            ? website.runtime.mountedPaths
            : [],
          fallbackMode: "customer_runtime",
          configVersion: 0,
          activeVersionNumber: website.runtime.activeVersionNumber ?? null,
          manifestChecksum: website.runtime.manifestChecksum ?? null,
          dbPublished: Boolean(website.runtime.dbPublished),
          acknowledgementStatus: website.runtime.acknowledgementStatus ?? null,
          httpStatus: website.runtime.httpStatus ?? null,
          lastOperationStatus: website.runtime.lastOperationStatus ?? null,
          fullyVerified: Boolean(website.runtime.fullyVerified),
          lastFullyVerifiedAt: website.runtime.lastFullyVerifiedAt ?? null,
        }
      : null;

  async function refreshCmsContext() {
    const res = await fetch("/api/app/website", { cache: "no-store" });
    if (!res.ok) return;
    const body = (await res.json()) as {
      context?: WebsiteCmsContextView;
      releaseChainReadiness?: WebsiteReleaseChainReadiness;
    };
    setCms(body.context ?? null);
    if (body.releaseChainReadiness?.status) {
      setReleaseChainReadiness(body.releaseChainReadiness);
    }
  }

  async function refreshCmsVersions() {
    const res = await fetch("/api/app/website/versions", { cache: "no-store" });
    if (!res.ok) return;
    const body = (await res.json()) as { versions?: WebsiteCmsVersionRow[] };
    setCmsVersions(Array.isArray(body.versions) ? body.versions : []);
  }

  async function refreshCmsHistory() {
    const res = await fetch("/api/app/website/publish/status", { cache: "no-store" });
    if (!res.ok) return;
    const body = (await res.json()) as { operations?: WebsiteCmsOperationRow[] };
    setCmsHistory(Array.isArray(body.operations) ? body.operations : []);
  }

  function toggleDraftSelection(draftId: string) {
    setSelectedDraftIds((prev) =>
      prev.includes(draftId) ? prev.filter((id) => id !== draftId) : [...prev, draftId],
    );
  }

  function buildCandidate() {
    if (selectedDraftIds.length === 0) {
      setCmsMessage(websiteCmsLabels.selectDrafts);
      return;
    }
    startCmsTransition(async () => {
      setCmsMessage(null);
      const activeLocales = cms?.website?.activeLocales?.length ? cms.website.activeLocales : [locale];
      const res = await fetch("/api/app/website/candidates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          draftIds: selectedDraftIds,
          locales: activeLocales,
          internalReason: candidateReason.trim() || websiteCmsLabels.buildCandidateHelp,
          idempotencyKey: createKompisOperatorIdempotencyKey(),
        }),
      });
      const body = (await res.json()) as {
        candidate?: {
          candidateId: string;
          versionNumber: number;
          contentChecksum: string;
          manifestChecksum: string;
        };
        code?: string;
      };
      if (!res.ok || !body.candidate) {
        setCmsMessage(body.code ?? websiteCmsLabels.publishFailed);
        return;
      }
      setCandidate(body.candidate);
      setPreviewInfo(null);
      setCmsMessage(websiteCmsLabels.candidateBuilt);
      await refreshCmsVersions();
    });
  }

  function createCandidatePreview() {
    if (!candidate) return;
    startCmsTransition(async () => {
      const res = await fetch("/api/app/website/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ versionId: candidate.candidateId, locale: cms?.website?.defaultLocale ?? locale }),
      });
      const body = (await res.json()) as {
        preview?: { previewId: string; expiresAt: string };
        code?: string;
      };
      if (!res.ok || !body.preview) {
        setCmsMessage(body.code ?? websiteCmsLabels.publishFailed);
        return;
      }
      setPreviewInfo({ previewId: body.preview.previewId, expiresAt: body.preview.expiresAt, verified: false });
      setCmsMessage(websiteCmsLabels.previewCreated);
    });
  }

  function verifyCandidatePreview() {
    if (!candidate) return;
    startCmsTransition(async () => {
      const res = await fetch("/api/app/website/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ versionId: candidate.candidateId, action: "verify" }),
      });
      const body = (await res.json()) as { code?: string };
      if (!res.ok) {
        setCmsMessage(body.code ?? websiteCmsLabels.previewRequired);
        return;
      }
      setPreviewInfo((prev) => (prev ? { ...prev, verified: true } : { previewId: "", expiresAt: "", verified: true }));
      setCmsMessage(websiteCmsLabels.previewVerified);
    });
  }

  function publishCandidate() {
    if (!candidate || !publishConfirmed || publishReason.trim().length < 3) return;
    startCmsTransition(async () => {
      const res = await fetch("/api/app/website/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.candidateId,
          expectedCurrentVersionId: cms?.website?.currentVersionId ?? null,
          internalReason: publishReason.trim(),
          confirmation: true,
          idempotencyKey: createKompisOperatorIdempotencyKey(),
        }),
      });
      const body = (await res.json()) as {
        publish?: { status: string; runtimeVerification?: { verified: boolean } };
        code?: string;
      };
      if (!res.ok || !body.publish) {
        setCmsMessage(body.code ?? websiteCmsLabels.publishFailed);
        return;
      }
      setCmsMessage(
        body.publish.status === "active"
          ? websiteCmsLabels.publishSuccess
          : websiteCmsLabels.publishAttention,
      );
      setPublishConfirmed(false);
      setPublishReason("");
      setCandidate(null);
      setSelectedDraftIds([]);
      await Promise.all([refreshCmsContext(), refreshCmsVersions()]);
    });
  }

  function previewRollbackTarget() {
    if (!rollbackTargetId) return;
    startCmsTransition(async () => {
      const res = await fetch("/api/app/website/rollback/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ targetVersionId: rollbackTargetId, locale: cms?.website?.defaultLocale ?? locale }),
      });
      const body = (await res.json()) as { preview?: { previewId: string }; code?: string };
      if (!res.ok || !body.preview) {
        setCmsMessage(body.code ?? websiteCmsLabels.publishFailed);
        return;
      }
      setRollbackPreviewId(body.preview.previewId);
      setCmsMessage(websiteCmsLabels.previewCreated);
    });
  }

  function rollbackToVersion() {
    if (!rollbackTargetId || !rollbackConfirmed || rollbackReason.trim().length < 3) return;
    startCmsTransition(async () => {
      const res = await fetch("/api/app/website/rollback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          targetVersionId: rollbackTargetId,
          expectedCurrentVersionId: cms?.website?.currentVersionId ?? null,
          internalReason: rollbackReason.trim(),
          confirmation: true,
          idempotencyKey: createKompisOperatorIdempotencyKey(),
        }),
      });
      const body = (await res.json()) as {
        rollback?: { status: string };
        code?: string;
      };
      if (!res.ok || !body.rollback) {
        setCmsMessage(body.code ?? websiteCmsLabels.rollbackAttention);
        return;
      }
      setCmsMessage(
        body.rollback.status === "active" ? websiteCmsLabels.rollbackSuccess : websiteCmsLabels.rollbackAttention,
      );
      setRollbackConfirmed(false);
      setRollbackReason("");
      setRollbackTargetId(null);
      setRollbackPreviewId(null);
      await Promise.all([refreshCmsContext(), refreshCmsVersions()]);
    });
  }

  async function refreshWorkspace() {
    const res = await fetch("/api/app/kompis/workspace", { cache: "no-store" });
    if (!res.ok) {
      setLoadError(true);
      return;
    }
    setLoadError(false);
    setWorkspace((await res.json()) as Workspace);
  }

  async function refreshConversations() {
    const res = await fetch("/api/app/kompis/conversations", { cache: "no-store" });
    if (!res.ok) return;
    const body = (await res.json()) as { conversations?: Conversation[] };
    setConversations(Array.isArray(body.conversations) ? body.conversations : []);
  }

  useEffect(() => {
    void refreshWorkspace();
    void refreshConversations();
  }, []);

  useEffect(() => {
    if (view !== "website") return;
    void fetch("/api/app/kompis/website", { cache: "no-store" }).then(async (res) => {
      if (!res.ok) return;
      setWebsite((await res.json()) as typeof website);
    });
    void refreshCmsContext();
    void refreshCmsVersions();
    void refreshCmsHistory();
  }, [view]);

  async function ensureConversation(): Promise<string | null> {
    if (conversationId) return conversationId;
    const res = await fetch("/api/app/kompis/conversations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: labels.title, locale }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { id?: string };
    if (!body.id) return null;
    setConversationId(body.id);
    await refreshConversations();
    return body.id;
  }

  function submitTask(text: string) {
    startTransition(async () => {
      setMessage(null);
      setActiveRun(null);
      const cid = await ensureConversation();
      if (!cid) {
        setMessage(labels.errorTitle);
        return;
      }
      const res = await fetch(`/api/app/kompis/conversations/${cid}/runs`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          requestText: text,
          idempotencyKey: createKompisOperatorIdempotencyKey(),
        }),
      });
      const body = (await res.json()) as RunView & {
        blocked?: boolean;
        plan?: RunView["plan"];
        code?: string;
        id?: string;
        status?: string;
        approval_status?: string;
        core_approval_required?: boolean;
        core_approval_request_id?: string | null;
        risk_class?: number;
      };
      if (res.status === 422 && body.blocked) {
        setActiveRun({
          id: "blocked",
          status: body.code === "critical_blocked" ? "blocked" : "blocked",
          risk_class: body.risk_class ?? 3,
          user_summary: body.plan?.title,
          plan: body.plan,
          result_summary:
            body.code === "critical_blocked" ? labels.criticalBlocked : labels.blocked,
        });
        return;
      }
      if (res.status === 429) {
        setMessage(labels.rateLimited);
        return;
      }
      if (!res.ok) {
        setMessage(
          body.code === "tool_not_allowed"
            ? labels.toolNotAllowed
            : body.code === "core_approval_create_failed"
              ? labels.approvalCreationFailedTitle
              : labels.errorTitle,
        );
        return;
      }
      setActiveRun({
        id: String(body.id),
        status: String(body.status ?? "planned"),
        approval_status: body.approval_status,
        core_approval_required: body.core_approval_required === true,
        core_approval_request_id: body.core_approval_request_id ?? null,
        risk_class: body.risk_class,
        user_summary: body.plan?.title,
        plan: body.plan ?? body.plan,
      });
      setConfirmed(false);
      setReason("");
    });
  }

  function approveAndExecute() {
    if (!activeRun?.id || activeRun.id === "blocked") return;
    startTransition(async () => {
      if (activeRun.core_approval_required && activeRun.approval_status !== "approved") {
        setMessage(labels.awaitingCoreApproval);
        return;
      }
      if (activeRun.approval_status === "pending" && !activeRun.core_approval_required) {
        const approve = await fetch(`/api/app/kompis/runs/${activeRun.id}/approve`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ confirmation: confirmed, reason }),
        });
        const approveBody = (await approve.json().catch(() => ({}))) as {
          approval_status?: string;
          core_approval_required?: boolean;
          core_approval_request_id?: string | null;
          code?: string;
        };
        if (!approve.ok) {
          setMessage(
            approveBody.code === "core_approval_decision_required" ||
              approveBody.code === "core_approval_required"
              ? labels.awaitingCoreApproval
              : labels.errorTitle,
          );
          return;
        }
        setActiveRun((prev) =>
          prev
            ? {
                ...prev,
                approval_status: approveBody.approval_status ?? "approved",
                status: "planned",
              }
            : prev,
        );
      }
      const exec = await fetch(`/api/app/kompis/runs/${activeRun.id}/execute`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      const body = (await exec.json()) as {
        status?: string;
        resultSummary?: string;
        safeErrorCode?: string | null;
      };
      if (!exec.ok) {
        setMessage(
          body.safeErrorCode === "core_approval_required"
            ? labels.awaitingCoreApproval
            : labels.errorTitle,
        );
        return;
      }
      setActiveRun((prev) =>
        prev
          ? {
              ...prev,
              status: String(body.status ?? "completed"),
              result_summary:
                body.status === "verifying"
                  ? labels.verifyingWebsite
                  : (body.resultSummary ?? labels.completed),
              approval_status: "approved",
            }
          : prev,
      );
    });
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 dark:border-rose-800 dark:bg-rose-950/30">
        <h1 className="text-xl font-semibold text-rose-900 dark:text-rose-100">{labels.errorTitle}</h1>
        <button
          type="button"
          className="mt-4 rounded-xl bg-rose-700 px-4 py-2 text-sm text-white"
          onClick={() => void refreshWorkspace()}
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (workspace.suspended || workspace.revoked) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 dark:border-amber-800 dark:bg-amber-950/30">
        <h1 className="text-xl font-semibold text-amber-950 dark:text-amber-100">
          {labels.suspendedTitle}
        </h1>
      </div>
    );
  }

  if (!workspace.available) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-950">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          {labels.unavailableTitle}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{labels.unavailableBody}</p>
      </div>
    );
  }

  const risk = (activeRun?.risk_class ?? 0) as 0 | 1 | 2 | 3;

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 lg:flex-row lg:items-start">
      <section className="min-w-0 flex-1 space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{labels.title}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
          <div className="mt-4 flex gap-2" role="tablist" aria-label={labels.websiteTab}>
            <button
              type="button"
              role="tab"
              aria-selected={view === "tasks"}
              className={`rounded-xl px-3 py-1.5 text-sm ${view === "tasks" ? "bg-violet-700 text-white" : "border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"}`}
              onClick={() => setView("tasks")}
            >
              {labels.tasksTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "website"}
              className={`rounded-xl px-3 py-1.5 text-sm ${view === "website" ? "bg-violet-700 text-white" : "border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"}`}
              onClick={() => setView("website")}
            >
              {labels.websiteTab}
            </button>
          </div>
          {view === "tasks" ? (
            <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">{labels.whatCanIHelpWith}</p>
          ) : null}
          {workspace.ai?.liveAiActive ? (
            <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300" role="status">
              {labels.liveAiActive}
            </p>
          ) : workspace.ai?.providerConfigured ? (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300" role="status">
              {labels.liveAiTemporarilyLimited}
            </p>
          ) : (
            <p className="mt-2 text-xs text-indigo-700 dark:text-indigo-300" role="status">
              {labels.liveAiNotEnabled}. {labels.continuesWithSafeFallback}
            </p>
          )}
          {workspace.ai?.providerStatus === "unavailable" ? (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300" role="status">
              {labels.providerUnavailable}. {labels.usingSafeFallback}
            </p>
          ) : null}
        </header>

        {view === "website" ? (
          <div className="space-y-4">
            {!website ? (
              <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700">
                <AipifyLoader centered />
              </div>
            ) : (
              <>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{labels.websiteOverview}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      tone={websiteCmsWebsiteStatusTone(cms?.website?.status ?? "provisioned")}
                      label={`${websiteCmsLabels.websiteStatus}: ${
                        cms?.website
                          ? websiteCmsLabels[websiteCmsStatusLabelKey(cms.website.status)]
                          : labels.statuses.notConfigured
                      }`}
                    />
                    {cms?.capabilities.authoritativePageModel ? (
                      <Badge tone="success" label={websiteCmsLabels.authoritativePageModelActive} />
                    ) : null}
                    {releaseChainReadiness ? (
                      <Badge
                        tone={websiteCmsReleaseChainTone(releaseChainReadiness.status)}
                        label={
                          websiteCmsLabels[
                            websiteCmsReleaseChainLabelKey(releaseChainReadiness.status)
                          ]
                        }
                      />
                    ) : null}
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-500">{labels.primaryDomain}</dt>
                      <dd>{String(website.context?.primaryDomain ?? "—")}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{labels.installation}</dt>
                      <dd>{labels.workspace.installationConnected}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{labels.runtimeStatus}</dt>
                      <dd>
                        <Badge
                          tone={resolveKompisWebsiteStatusTone(
                            website.runtime?.businessStatus ??
                              (website.runtime?.fullyVerified ? "fully_verified" : "attention"),
                          )}
                          label={runtimeBusinessLabel()}
                        />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{labels.draftCount}</dt>
                      <dd>{String(draftRows.length || website.context?.draftCount || 0)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{websiteCmsLabels.currentVersion}</dt>
                      <dd>
                        {cms?.currentVersion || website.runtime?.activeVersionNumber != null
                          ? `v${cms?.currentVersion?.versionNumber ?? website.runtime?.activeVersionNumber} · ${statusLabel(
                              cms?.currentVersion?.status ?? "published",
                            )}`
                          : labels.statuses.notConfigured}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{labels.lastPublish}</dt>
                      <dd>
                        {formatDate(
                          typeof website.context?.lastPublishAt === "string"
                            ? website.context.lastPublishAt
                            : null,
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{labels.websitePublishes}</dt>
                      <dd>
                        <Badge
                          tone={resolveKompisWebsiteStatusTone(website?.publish?.code ?? "publish_not_configured")}
                          label={publishCapabilityLabel()}
                        />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">{websiteRuntimeLabels.homepageDisabled}</dt>
                      <dd>
                        {website.runtime?.homepageEnabled
                          ? labels.workspace.homepageEnabled
                          : labels.workspace.homepageDisabled}
                      </dd>
                    </div>
                  </dl>
                  {website.context?.installationId ? (
                    <details className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                      <summary className="cursor-pointer font-medium">{labels.workspace.technicalDetails}</summary>
                      <p className="mt-2">
                        {labels.installation}: {shortenTechnicalId(String(website.context.installationId))}
                      </p>
                    </details>
                  ) : null}
                  <p className="mt-4 text-sm text-slate-700 dark:text-slate-200" role="status">
                    {website?.publish?.mechanismAvailable
                      ? websiteCmsLabels.neverDeletesHistory
                      : publishCapabilityLabel()}
                  </p>
                  {website?.consistency?.ok === false ? (
                    <p className="mt-2 text-sm text-amber-800 dark:text-amber-200" role="alert">
                      {labels.workspace.stateInconsistent}
                    </p>
                  ) : null}
                </section>

                <CustomerWebsiteRuntimeReadinessCard
                  labels={websiteRuntimeLabels}
                  locale={locale}
                  initialStatus={runtimeInitial}
                />

                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{labels.websitePages}</h2>
                  <p className="mt-1 text-xs text-slate-500">{websiteCmsLabels.buildCandidateHelp}</p>
                  {draftRows.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">{labels.emptyHistory}</p>
                  ) : (
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <th className="py-2 pr-4 font-medium" aria-hidden="true" />
                            <th className="py-2 pr-4 font-medium">{labels.websitePages}</th>
                            <th className="py-2 pr-4 font-medium">{labels.websiteLocales}</th>
                            <th className="py-2 pr-4 font-medium">{labels.workspace.revisionLabel}</th>
                            <th className="py-2 font-medium">{labels.statusLabel}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {draftRows.map((page) => {
                            const pageLocale =
                              typeof page.locale === "string" ? page.locale : null;
                            const localeMismatch =
                              pageLocale != null &&
                              pageLocale !== locale &&
                              pageLocale !== locale.slice(0, 2);
                            return (
                              <tr key={String(page.id)} className="border-b border-slate-100 dark:border-slate-900">
                                <td className="py-2 pr-4">
                                  <input
                                    type="checkbox"
                                    aria-label={websiteCmsLabels.selectDrafts}
                                    checked={selectedDraftIds.includes(String(page.id))}
                                    onChange={() => toggleDraftSelection(String(page.id))}
                                  />
                                </td>
                                <td className="py-2 pr-4">{String(page.title ?? "—")}</td>
                                <td className="py-2 pr-4">
                                  {contentLocaleLabel(pageLocale)}
                                  {localeMismatch ? (
                                    <span className="mt-1 block text-xs text-amber-700 dark:text-amber-300">
                                      {labels.workspace.localeMismatchHint}
                                    </span>
                                  ) : null}
                                </td>
                                <td className="py-2 pr-4">
                                  {page.revisionNumber != null
                                    ? `${labels.workspace.revisionLabel} ${String(page.revisionNumber)}`
                                    : page.version != null
                                      ? `${labels.workspace.revisionLabel} ${String(page.version)}`
                                      : "—"}
                                </td>
                                <td className="py-2">
                                  <Badge
                                    tone={resolveKompisWebsiteStatusTone(String(page.status ?? "draft"))}
                                    label={statusLabel(String(page.status ?? "draft"))}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{labels.websiteSeo}</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {String(website.seo?.findingCount ?? 0)} · {labels.websiteLocales}:{" "}
                    {String(website.locales?.localeGaps ?? 0)}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    {(website.seo?.findings ?? []).slice(0, 8).map((finding) => (
                      <li
                        key={String(finding.dedupeKey ?? `${finding.code}-${finding.pageId ?? "global"}`)}
                        className="rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800"
                      >
                        <p>{seoFindingLabel(typeof finding.code === "string" ? finding.code : null)}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {finding.code === "crawl_unavailable" ||
                          finding.code === "runtime_acknowledgement_missing"
                            ? labels.seoFindings.nextActionConfirmDelivery
                            : labels.seoFindings.nextActionReviewDraft}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{websiteCmsLabels.candidatesTab}</h2>
                  <label className="mt-3 block text-sm text-slate-800 dark:text-slate-200">
                    {websiteCmsLabels.buildCandidateHelp}
                    <textarea
                      value={candidateReason}
                      onChange={(event) => setCandidateReason(event.target.value)}
                      rows={2}
                      placeholder={websiteCmsLabels.publishInternalReasonPlaceholder}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={
                      cmsPending ||
                      selectedDraftIds.length === 0 ||
                      website?.actions?.buildCandidateAllowed === false
                    }
                    className="mt-3 rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    onClick={buildCandidate}
                  >
                    {websiteCmsLabels.buildCandidate}
                  </button>
                  {website?.actions?.buildCandidateAllowed === false ? (
                    <p className="mt-2 text-sm text-amber-800 dark:text-amber-200" role="status">
                      {actionBlockMessage()}
                    </p>
                  ) : selectedDraftIds.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500" role="status">
                      {labels.workspace.selectApprovedDraft}
                    </p>
                  ) : null}

                  {candidate ? (
                    <div className="mt-4 space-y-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        {websiteCmsLabels.candidateVersion}: v{candidate.versionNumber}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={cmsPending}
                          className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
                          onClick={createCandidatePreview}
                        >
                          {websiteCmsLabels.createPreview}
                        </button>
                        <button
                          type="button"
                          disabled={cmsPending || !previewInfo}
                          className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600"
                          onClick={verifyCandidatePreview}
                        >
                          {websiteCmsLabels.markPreviewVerified}
                        </button>
                      </div>
                      {previewInfo ? (
                        <p className="text-xs text-slate-500">
                          {previewInfo.verified
                            ? websiteCmsLabels.previewVerified
                            : `${websiteCmsLabels.previewExpires}: ${formatDate(previewInfo.expiresAt)}`}
                          {" · "}
                          {websiteCmsLabels.previewNoindex}
                          {" · "}
                          <a
                            href={`/app/website/preview/${previewInfo.previewId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-violet-700 underline dark:text-violet-300"
                          >
                            {websiteCmsLabels.openPreview}
                          </a>
                        </p>
                      ) : null}

                      <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                        <label className="block text-sm text-slate-800 dark:text-slate-200">
                          {labels.internalReason}
                          <textarea
                            value={publishReason}
                            onChange={(event) => setPublishReason(event.target.value)}
                            rows={2}
                            placeholder={websiteCmsLabels.publishInternalReasonPlaceholder}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                          />
                        </label>
                        <label className="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={publishConfirmed}
                            onChange={(event) => setPublishConfirmed(event.target.checked)}
                            className="mt-0.5"
                          />
                          <span>{websiteCmsLabels.publishConfirmCheckbox}</span>
                        </label>
                        <button
                          type="button"
                          disabled={
                            cmsPending ||
                            !publishConfirmed ||
                            publishReason.trim().length < 3 ||
                            !cms?.capabilities.publishCapability
                          }
                          className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                          onClick={publishCandidate}
                        >
                          {websiteCmsLabels.publishCandidate}
                        </button>
                        {!cms?.capabilities.publishCapability ? (
                          <p className="text-xs text-amber-800 dark:text-amber-200">{websiteCmsLabels.previewRequired}</p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{websiteCmsLabels.historyTab}</h2>
                  {cmsVersions.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">{websiteCmsLabels.noVersionsYet}</p>
                  ) : (
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800">
                            <th className="py-2 pr-4 font-medium">{websiteCmsLabels.versionNumber}</th>
                            <th className="py-2 pr-4 font-medium">{labels.statusLabel}</th>
                            <th className="py-2 pr-4 font-medium">{websiteCmsLabels.rollbackToVersion}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cmsVersions.map((version) => {
                            const isCurrent =
                              version.id === currentVersionId ||
                              (version.status === "published" &&
                                cms?.currentVersion?.versionNumber === version.version_number);
                            const canRollback =
                              !isCurrent &&
                              (version.status === "published" || version.status === "superseded") &&
                              website?.actions?.rollbackAllowed !== false;
                            return (
                              <tr key={version.id} className="border-b border-slate-100 dark:border-slate-900">
                                <td className="py-2 pr-4">
                                  v{version.version_number}
                                  {isCurrent ? (
                                    <span className="mt-1 block text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                      {labels.workspace.currentVersionMarker}
                                    </span>
                                  ) : null}
                                </td>
                                <td className="py-2 pr-4">
                                  <Badge
                                    tone={websiteCmsVersionStatusTone(version.status)}
                                    label={
                                      websiteCmsLabels[websiteCmsVersionStatusLabelKey(version.status)]
                                    }
                                  />
                                </td>
                                <td className="py-2 pr-4">
                                  {canRollback ? (
                                    <button
                                      type="button"
                                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
                                      onClick={() => setRollbackTargetId(version.id)}
                                    >
                                      {labels.workspace.rollbackToThisVersion}
                                    </button>
                                  ) : isCurrent ? (
                                    <span className="text-xs text-slate-500">
                                      {labels.workspace.rollbackNotForCurrent}
                                    </span>
                                  ) : null}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <h3 className="mt-5 text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {websiteCmsLabels.publishesTab}
                  </h3>
                  {cmsHistory.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">{websiteCmsLabels.noPublishHistory}</p>
                  ) : (
                    <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      {cmsHistory.slice(0, 10).map((operation) => (
                        <li
                          key={operation.id}
                          className="space-y-1 rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span>
                              {operation.operation_kind === "rollback"
                                ? websiteCmsLabels.operationRollback
                                : websiteCmsLabels.operationPublish}
                            </span>
                            <Badge
                              tone={websiteCmsOperationStatusTone(operation.status)}
                              label={
                                websiteCmsLabels[websiteCmsOperationStatusLabelKey(operation.status)]
                              }
                            />
                          </div>
                          <p className="text-xs text-slate-500">{formatDate(operation.created_at)}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {rollbackTargetId ? (
                  <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
                    <h2 className="text-lg font-semibold text-amber-950 dark:text-amber-100">
                      {websiteCmsLabels.rollbackTab}
                    </h2>
                    <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">
                      {websiteCmsLabels.neverDeletesHistory}
                    </p>
                    <label className="mt-3 block text-sm text-slate-800 dark:text-slate-200">
                      {labels.internalReason}
                      <textarea
                        value={rollbackReason}
                        onChange={(event) => setRollbackReason(event.target.value)}
                        rows={2}
                        placeholder={websiteCmsLabels.publishInternalReasonPlaceholder}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                      />
                    </label>
                    <label className="mt-2 flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={rollbackConfirmed}
                        onChange={(event) => setRollbackConfirmed(event.target.checked)}
                        className="mt-0.5"
                      />
                      <span>{websiteCmsLabels.rollbackConfirmCheckbox}</span>
                    </label>
                    {rollbackPreviewId ? (
                      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                        <a
                          href={`/app/website/preview/${rollbackPreviewId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-violet-700 underline dark:text-violet-300"
                        >
                          {websiteCmsLabels.openPreview}
                        </a>
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={cmsPending}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
                        onClick={previewRollbackTarget}
                      >
                        {websiteCmsLabels.createPreview}
                      </button>
                      <button
                        type="button"
                        disabled={
                          cmsPending ||
                          !rollbackConfirmed ||
                          rollbackReason.trim().length < 3 ||
                          !cms?.capabilities.rollbackCapability
                        }
                        className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        onClick={rollbackToVersion}
                      >
                        {websiteCmsLabels.rollbackToVersion}
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
                        onClick={() => {
                          setRollbackTargetId(null);
                          setRollbackPreviewId(null);
                        }}
                      >
                        {labels.rejectPlan}
                      </button>
                    </div>
                  </section>
                ) : null}

                {cmsMessage ? (
                  <p className="text-sm text-slate-700 dark:text-slate-200" role="status">
                    {cmsMessage}
                  </p>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {view === "tasks" ? (
        <>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
          <label className="block text-sm font-medium text-slate-800 dark:text-slate-200" htmlFor="kompis-task">
            {labels.describeTask}
          </label>
          <textarea
            id="kompis-task"
            value={requestText}
            onChange={(event) => setRequestText(event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none ring-violet-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              labels.suggestionKompis,
              labels.suggestionWebsite,
              labels.suggestionSeo,
              labels.suggestionLicense,
              labels.suggestionKnowledge,
              labels.suggestionMembers,
              labels.suggestionActivity,
              labels.suggestionDraftSupport,
              labels.suggestionDraftProfile,
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                onClick={() => setRequestText(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={pending || requestText.trim().length < 2}
            className="mt-4 rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            onClick={() => submitTask(requestText)}
          >
            {labels.sendTask}
          </button>
        </div>

        {!activeRun && !pending ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{labels.readyTitle}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{labels.readyBody}</p>
          </div>
        ) : null}

        {pending ? (
          <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700">
            <AipifyLoader centered />
          </div>
        ) : null}

        {activeRun ? (
          <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                tone={runStatusTone(activeRun.status)}
                label={`${labels.statusLabel}: ${statusLabel(activeRun.status)}`}
              />
              <Badge
                tone={riskClassTone(risk, activeRun.status === "completed" ? "success" : "pending")}
                label={`${labels.riskClass}: ${risk === 0 ? labels.risk0 : risk === 1 ? labels.risk1 : risk === 2 ? labels.risk2 : labels.risk3}`}
              />
              {activeRun.approval_status ? (
                <Badge
                  tone={resolveKompisWebsiteStatusTone(
                    activeRun.approval_status === "pending" ? "awaiting_approval" : activeRun.approval_status,
                  )}
                  label={statusLabel(
                    activeRun.approval_status === "pending" ? "awaiting_approval" : activeRun.approval_status,
                  )}
                />
              ) : null}
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {(() => {
                const summary = activeRun.user_summary ?? labels.plan;
                const planKey = KOMPIS_PLAN_TITLE_KEYS[summary];
                return (planKey && labels.plans[planKey]) || summary;
              })()}
            </h2>
            {activeRun.plan?.steps?.length ? (
              <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {activeRun.plan.steps.map((step) => (
                  <li key={step.sequence} className="rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800">
                    {step.sequence}.{" "}
                    {resolveKompisToolLabel(step.toolKey, labels.tools, step.purpose || step.toolKey)}
                  </li>
                ))}
              </ol>
            ) : null}
            {activeRun.result_summary === "knowledge_search_failed" ||
            activeRun.result_summary === "Knowledge search failed." ? (
              <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/30">
                <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">
                  {labels.workspace.knowledgeSearchErrorTitle}
                </h3>
                <p className="text-sm text-rose-800 dark:text-rose-200">
                  {labels.workspace.knowledgeSearchErrorBody}
                </p>
                <dl className="grid gap-1 text-xs text-rose-800 dark:text-rose-200 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium">{labels.workspace.errorCategory}</dt>
                    <dd>knowledge_access</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{labels.workspace.errorSource}</dt>
                    <dd>search_organization_knowledge</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{labels.workspace.retrySafe}</dt>
                    <dd>{labels.workspace.temporaryError}</dd>
                  </div>
                </dl>
                <p className="text-sm text-rose-900 dark:text-rose-100">
                  {labels.workspace.recommendedNextAction}: {labels.retry}
                </p>
                <details className="text-xs text-rose-700 dark:text-rose-300">
                  <summary>{labels.workspace.technicalReference}</summary>
                  <p className="mt-1">knowledge_search_failed</p>
                </details>
                <button
                  type="button"
                  className="rounded-xl border border-rose-300 px-3 py-1.5 text-sm dark:border-rose-700"
                  onClick={() => submitTask(labels.suggestionKnowledge)}
                >
                  {labels.retry}
                </button>
              </div>
            ) : activeRun.result_summary ? (
              <p className="text-sm text-slate-700 dark:text-slate-200">
                {resolveKompisResultSummary(
                  activeRun.result_summary,
                  labels.results,
                  activeRun.result_summary,
                )}
              </p>
            ) : null}

            {activeRun.status === "blocked" && risk === 3 ? (
              <p className="text-sm text-rose-700 dark:text-rose-300" role="alert">
                {labels.criticalBlocked}
              </p>
            ) : null}

            {activeRun.approval_status === "pending" &&
            activeRun.core_approval_required &&
            !activeRun.core_approval_request_id ? (
              <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/30">
                <h3 className="text-sm font-semibold text-rose-950 dark:text-rose-100">
                  {labels.approvalCreationFailedTitle}
                </h3>
                <p className="text-sm text-rose-900 dark:text-rose-100">
                  {labels.approvalCreationFailedBody}
                </p>
                <details className="text-xs text-rose-700 dark:text-rose-300">
                  <summary>{labels.workspace.technicalReference}</summary>
                  <p className="mt-1">core_approval_create_failed · run {shortenTechnicalId(activeRun.id)}</p>
                </details>
                <button
                  type="button"
                  className="rounded-xl border border-rose-300 px-3 py-1.5 text-sm dark:border-rose-700"
                  onClick={() => submitTask(requestText || labels.suggestionKompis)}
                >
                  {labels.retry}
                </button>
              </div>
            ) : null}

            {activeRun.approval_status === "pending" &&
            activeRun.core_approval_required &&
            activeRun.core_approval_request_id ? (
              <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                  {labels.approvalRequiredTitle}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-200">{labels.approvalRequiredBody}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">{labels.coreApprovalRequired}</p>
                <dl className="grid gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium">{labels.statusLabel}</dt>
                    <dd>{statusLabel("awaiting_approval")}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{labels.workspace.coreApprovalId}</dt>
                    <dd>{shortenTechnicalId(activeRun.core_approval_request_id)}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/app/approvals?request=${encodeURIComponent(activeRun.core_approval_request_id)}`}
                    className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white"
                  >
                    {labels.reviewAndApprove}
                  </Link>
                  <button
                    type="button"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
                    onClick={() => {
                      startTransition(async () => {
                        await fetch(`/api/app/kompis/runs/${activeRun.id}/reject`, {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ reason }),
                        });
                        setActiveRun((prev) =>
                          prev ? { ...prev, status: "rejected", approval_status: "rejected" } : prev,
                        );
                      });
                    }}
                  >
                    {labels.rejectPlan}
                  </button>
                </div>
              </div>
            ) : null}

            {activeRun.approval_status === "pending" && !activeRun.core_approval_required ? (
              <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                <p className="text-sm font-medium text-amber-950 dark:text-amber-100">
                  {labels.awaitingApproval}
                </p>
                {risk >= 2 ? (
                  <label className="block text-sm text-slate-800 dark:text-slate-200">
                    {labels.internalReason}
                    <textarea
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      rows={3}
                      placeholder={labels.reasonPlaceholder}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                    />
                  </label>
                ) : null}
                <label className="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                    className="mt-0.5"
                  />
                  <span>{labels.confirmCheckbox}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={pending || !confirmed || (risk >= 2 && reason.trim().length < 3)}
                    className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    onClick={approveAndExecute}
                  >
                    {labels.approveAndExecute}
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
                    onClick={() => {
                      startTransition(async () => {
                        await fetch(`/api/app/kompis/runs/${activeRun.id}/reject`, {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ reason }),
                        });
                        setActiveRun((prev) =>
                          prev ? { ...prev, status: "rejected", approval_status: "rejected" } : prev,
                        );
                      });
                    }}
                  >
                    {labels.rejectPlan}
                  </button>
                </div>
              </div>
            ) : null}

            {activeRun.core_approval_required &&
            activeRun.approval_status === "approved" &&
            activeRun.status === "planned" ? (
              <button
                type="button"
                className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white"
                onClick={approveAndExecute}
              >
                {labels.approveAndExecute}
              </button>
            ) : null}

            {activeRun.approval_status === "not_required" &&
            activeRun.status === "planned" &&
            activeRun.id !== "blocked" ? (
              <button
                type="button"
                className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-medium text-white"
                onClick={approveAndExecute}
              >
                {labels.approveAndExecute}
              </button>
            ) : null}

            {activeRun.status === "completed" ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100">
                <p>{labels.authoritativelyVerified}</p>
                <p className="mt-1">
                  {labels.whatChanged}:{" "}
                  {resolveKompisResultSummary(
                    activeRun.result_summary,
                    labels.results,
                    activeRun.result_summary ?? labels.nothingChanged,
                  )}
                </p>
                <p className="mt-1">{labels.auditReference}: {activeRun.id}</p>
              </div>
            ) : null}
          </article>
        ) : null}

        {message ? (
          <p className="text-sm text-rose-700 dark:text-rose-300" role="alert">
            {message}
          </p>
        ) : null}
        </>
        ) : null}
      </section>

      <aside className="w-full shrink-0 space-y-4 lg:w-80">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{labels.activeOrganization}</h2>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            {String(workspace.organization.name ?? "—")}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">{labels.appLicense}</dt>
              <dd>{statusLabel(String(workspace.parentLicense?.status ?? "unknown"))}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">{labels.websiteKompis}</dt>
              <dd>
                {workspace.websiteKompis.acknowledgement_ok === true
                  ? labels.statuses.completed
                  : labels.statuses.attention}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">{labels.domainInstallation}</dt>
              <dd className="truncate text-right">{String(workspace.websiteKompis.domain ?? "—")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">{labels.draftCount}</dt>
              <dd>{String(draftRows.length || website?.context?.draftCount || "—")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">{labels.websitePublishes}</dt>
              <dd className="text-right">{publishCapabilityLabel()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{labels.history}</h2>
          {conversations.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">{labels.emptyHistory}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                    onClick={() => setConversationId(conversation.id)}
                  >
                    {conversation.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
