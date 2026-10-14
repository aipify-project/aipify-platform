"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminProvisionPrerequisiteLabel,
  createAdminProvisionIdempotencyKey,
  type PlatformAdminProvisionLabels,
  type PlatformAdminProvisionPlan,
  type PlatformAdminProvisionReadiness,
} from "@/lib/platform-portal/admin-provisioning";

type Props = {
  customerId: string;
  labels: PlatformAdminProvisionLabels;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "unauthorized" }
  | { kind: "forbidden" }
  | { kind: "success"; data: PlatformAdminProvisionReadiness };

type PrepareState =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "error"; message?: string }
  | { kind: "ready"; plan: PlatformAdminProvisionPlan };

export function PlatformPortalAdminProvisioningPanel({
  customerId,
  labels,
}: Props) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [prepare, setPrepare] = useState<PrepareState>({ kind: "idle" });
  const [adminEmail, setAdminEmail] = useState("");
  const [role, setRole] = useState<"owner" | "administrator">("owner");
  const [reason, setReason] = useState("");
  const [idempotencyKey] = useState(() => createAdminProvisionIdempotencyKey());

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    try {
      const response = await fetch(
        `/api/platform-portal/customers/${customerId}/admin-provisioning`,
        { cache: "no-store" },
      );
      if (response.status === 401) {
        setState({ kind: "unauthorized" });
        return;
      }
      if (response.status === 403) {
        setState({ kind: "forbidden" });
        return;
      }
      if (!response.ok) {
        setState({ kind: "error" });
        return;
      }
      const body = (await response.json()) as PlatformAdminProvisionReadiness;
      if (!body?.customerId) {
        setState({ kind: "error" });
        return;
      }
      setState({ kind: "success", data: body });
    } catch {
      setState({ kind: "error" });
    }
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runPrepare() {
    setPrepare({ kind: "running" });
    try {
      const response = await fetch(
        `/api/platform-portal/customers/${customerId}/admin-provisioning`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({
            mode: "prepare",
            adminEmail,
            role,
            internalReason: reason,
            confirmation: true,
            idempotencyKey,
          }),
        },
      );
      if (!response.ok) {
        setPrepare({ kind: "error" });
        return;
      }
      const plan = (await response.json()) as PlatformAdminProvisionPlan;
      if (!plan?.dryRun || plan.mode !== "prepare") {
        setPrepare({ kind: "error" });
        return;
      }
      setPrepare({ kind: "ready", plan });
    } catch {
      setPrepare({ kind: "error" });
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {labels.sectionTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {labels.sourceNote}
          </p>
        </div>
        {state.kind === "success" ? (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
              state.data.readyForAdminPrepare
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200"
                : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200"
            }`}
          >
            {state.data.readyForAdminPrepare ? labels.ready : labels.notReady}
          </span>
        ) : null}
      </div>

      {state.kind === "loading" ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          {labels.loading}
        </p>
      ) : null}
      {state.kind === "unauthorized" ? (
        <p className="mt-4 text-sm text-rose-700 dark:text-rose-300">
          {labels.unauthorized}
        </p>
      ) : null}
      {state.kind === "forbidden" ? (
        <p className="mt-4 text-sm text-rose-700 dark:text-rose-300">
          {labels.forbidden}
        </p>
      ) : null}
      {state.kind === "error" ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-rose-700 dark:text-rose-300">{labels.error}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {labels.retry}
          </button>
        </div>
      ) : null}

      {state.kind === "success" ? (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {labels.readinessTitle}
            </h3>
            <dl className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {labels.companyName}
                </dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {state.data.companyName ?? labels.notConfigured}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {labels.slug}
                </dt>
                <dd className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">
                  {state.data.slug ?? labels.notConfigured}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {labels.memberCount}
                </dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {state.data.memberCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  {labels.contactEmail}
                </dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {state.data.contactEmail ?? labels.notConfigured}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {labels.prerequisites}
            </h3>
            <ul className="mt-2 space-y-1.5">
              {state.data.prerequisites.map((item) => (
                <li
                  key={item.code}
                  className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                >
                  <span
                    aria-hidden
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      item.satisfied ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  <span>
                    {adminProvisionPrerequisiteLabel(
                      item.code,
                      labels.prerequisiteLabels,
                      item.satisfied,
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            {labels.noBedriftFromMembership}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {labels.existingEmailAcceptNote}
          </p>
          <p className="text-sm text-amber-900/90 dark:text-amber-100/90">
            {labels.deliveryNotConnected}
          </p>

          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {labels.planTitle}
            </h3>
            <label className="block text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                {labels.adminEmail}
              </span>
              <input
                type="email"
                value={adminEmail}
                onChange={(event) => setAdminEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                autoComplete="off"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                {labels.role}
              </span>
              <select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as "owner" | "administrator")
                }
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
              >
                <option value="owner">{labels.roleOwner}</option>
                <option value="administrator">{labels.roleAdministrator}</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                {labels.internalReason}
              </span>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
              />
            </label>
            <button
              type="button"
              disabled={
                prepare.kind === "running" ||
                !state.data.readyForAdminPrepare ||
                adminEmail.trim().length < 5 ||
                reason.trim().length < 3
              }
              onClick={() => void runPrepare()}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
            >
              {prepare.kind === "running"
                ? labels.prepareRunning
                : labels.prepareAction}
            </button>
            {prepare.kind === "error" ? (
              <p className="text-sm text-rose-700 dark:text-rose-300">
                {labels.error}
              </p>
            ) : null}
            {prepare.kind === "ready" ? (
              <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100">
                <p className="font-medium">{labels.planReady}</p>
                <p>
                  {labels.adminEmail}: {prepare.plan.adminEmail}
                </p>
                <p>
                  {labels.role}:{" "}
                  {prepare.plan.role === "owner"
                    ? labels.roleOwner
                    : labels.roleAdministrator}
                </p>
                <p>{labels.sideEffectsNone}</p>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-800/70 dark:bg-amber-950/30">
            <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-100">
              {labels.executeLockedTitle}
            </h3>
            <p className="mt-1 text-sm text-amber-900/90 dark:text-amber-100/90">
              {labels.executeLockedBody}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950/90 dark:text-amber-100/90">
              <li>{labels.checklistNamedCustomer}</li>
              <li>{labels.checklistInviteContract}</li>
              <li>{labels.checklistExplicitAccept}</li>
              <li>{labels.checklistNoBedriftGrant}</li>
              <li>{labels.checklistAuditIdempotency}</li>
            </ul>
            <button
              type="button"
              disabled
              className="mt-3 cursor-not-allowed rounded-lg bg-slate-300 px-4 py-2 text-sm font-medium text-slate-600 opacity-80 dark:bg-slate-700 dark:text-slate-300"
              aria-disabled="true"
              title={labels.executeUnavailable}
            >
              {labels.executeUnavailable}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
