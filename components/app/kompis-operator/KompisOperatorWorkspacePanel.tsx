"use client";

import { useEffect, useState, useTransition } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  createKompisOperatorIdempotencyKey,
  type KompisOperatorLabels,
} from "@/lib/kompis-operator";
import { SEVERITY_BADGE_CLASS, riskClassTone, runStatusTone } from "@/lib/kompis-operator/severity";

type Workspace = {
  available: boolean;
  suspended: boolean;
  revoked: boolean;
  organization: Record<string, unknown>;
  agreement: Record<string, unknown> | null;
  parentLicense: Record<string, unknown> | null;
  websiteKompis: Record<string, unknown>;
};

type Conversation = { id: string; title: string; updated_at?: string };
type RunView = {
  id: string;
  status: string;
  approval_status?: string;
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
  locale,
}: {
  labels: KompisOperatorLabels;
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
      if (!res.ok) {
        setMessage(labels.errorTitle);
        return;
      }
      setActiveRun({
        id: String(body.id),
        status: String(body.status ?? "planned"),
        approval_status: body.approval_status,
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
      if (activeRun.approval_status === "pending") {
        const approve = await fetch(`/api/app/kompis/runs/${activeRun.id}/approve`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ confirmation: confirmed, reason }),
        });
        if (!approve.ok) {
          setMessage(labels.errorTitle);
          return;
        }
      }
      const exec = await fetch(`/api/app/kompis/runs/${activeRun.id}/execute`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      const body = (await exec.json()) as {
        status?: string;
        resultSummary?: string;
      };
      if (!exec.ok) {
        setMessage(labels.errorTitle);
        return;
      }
      setActiveRun((prev) =>
        prev
          ? {
              ...prev,
              status: String(body.status ?? "completed"),
              result_summary: body.resultSummary ?? labels.completed,
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
        </header>

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
              labels.suggestionLicense,
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
              <Badge tone={runStatusTone(activeRun.status)} label={`${labels.statusLabel}: ${activeRun.status}`} />
              <Badge
                tone={riskClassTone(risk, activeRun.status === "completed" ? "success" : "pending")}
                label={`${labels.riskClass}: ${risk === 0 ? labels.risk0 : risk === 1 ? labels.risk1 : risk === 2 ? labels.risk2 : labels.risk3}`}
              />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {activeRun.user_summary ?? labels.plan}
            </h2>
            {activeRun.plan?.steps?.length ? (
              <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {activeRun.plan.steps.map((step) => (
                  <li key={step.sequence} className="rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800">
                    {step.sequence}. {step.purpose || step.toolKey}
                  </li>
                ))}
              </ol>
            ) : null}
            {activeRun.result_summary ? (
              <p className="text-sm text-slate-700 dark:text-slate-200">{activeRun.result_summary}</p>
            ) : null}

            {activeRun.status === "blocked" && risk === 3 ? (
              <p className="text-sm text-rose-700 dark:text-rose-300" role="alert">
                {labels.criticalBlocked}
              </p>
            ) : null}

            {activeRun.approval_status === "pending" ? (
              <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                <p className="text-sm font-medium text-amber-950 dark:text-amber-100">{labels.awaitingApproval}</p>
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
                        setActiveRun((prev) => (prev ? { ...prev, status: "rejected", approval_status: "rejected" } : prev));
                      });
                    }}
                  >
                    {labels.rejectPlan}
                  </button>
                </div>
              </div>
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
                <p className="mt-1">{labels.whatChanged}: {activeRun.result_summary}</p>
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
              <dd>{String(workspace.parentLicense?.status ?? "—")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">{labels.websiteKompis}</dt>
              <dd>
                {workspace.websiteKompis.acknowledgement_ok === true ? labels.completed : labels.attention}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">{labels.domainInstallation}</dt>
              <dd className="truncate text-right">{String(workspace.websiteKompis.domain ?? "—")}</dd>
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
