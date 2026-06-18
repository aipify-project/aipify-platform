"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import { parseEvolutionGovernanceBoard, type EvolutionGovernanceBoard, type EvolutionProposal } from "@/lib/aipify/evolution-governance";

type EvolutionGovernanceBoardPanelProps = {
  labels: Record<string, string>;
};

function riskClass(risk?: string) {
  switch (risk) {
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function statusClass(status?: string) {
  switch (status) {
    case "approved":
    case "validated":
      return "text-emerald-700";
    case "rejected":
      return "text-red-700";
    case "under_review":
      return "text-amber-700";
    default:
      return "text-gray-700";
  }
}

function ProposalCard({
  proposal,
  labels,
  acting,
  onAction,
}: {
  proposal: EvolutionProposal;
  labels: Record<string, string>;
  acting: string | null;
  onAction: (id: string, action: string) => void;
}) {
  const busy = acting === proposal.id;
  const canReview = ["proposed", "under_review"].includes(proposal.status);
  const canApprove = ["proposed", "under_review"].includes(proposal.status);
  const canSchedule = proposal.status === "approved";
  const canImplement = ["approved", "scheduled"].includes(proposal.status);
  const canValidate = proposal.status === "implemented";
  const canRollback = ["implemented", "validated", "scheduled"].includes(proposal.status);

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${riskClass(proposal.risk_level)}`}>
              {proposal.risk_level}
            </span>
            <span className="text-xs text-gray-500 capitalize">{proposal.category?.replace(/_/g, " ")}</span>
            <span className="text-xs text-gray-400">· {proposal.source?.replace(/_/g, " ")}</span>
          </div>
          <h3 className="mt-1 font-semibold text-gray-900">{proposal.title}</h3>
        </div>
        <span className={`text-sm font-medium capitalize ${statusClass(proposal.status)}`}>
          {proposal.status?.replace(/_/g, " ")}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-600">{proposal.description}</p>

      {proposal.expected_benefits ? (
        <p className="mt-2 text-xs text-gray-500">
          <span className="font-medium text-gray-700">{labels.expectedBenefits}: </span>
          {proposal.expected_benefits}
        </p>
      ) : null}

      {proposal.potential_risks ? (
        <p className="mt-1 text-xs text-gray-500">
          <span className="font-medium text-gray-700">{labels.potentialRisks}: </span>
          {proposal.potential_risks}
        </p>
      ) : null}

      {proposal.implementation_recommendation ? (
        <p className="mt-2 text-xs text-violet-700">
          <span className="font-medium">{labels.implementationRecommendation}: </span>
          {proposal.implementation_recommendation}
        </p>
      ) : null}

      {proposal.rollback_guidance ? (
        <p className="mt-1 text-xs text-gray-500">
          <span className="font-medium text-gray-700">{labels.rollbackGuidance}: </span>
          {proposal.rollback_guidance}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {canReview ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(proposal.id, "review")}
            className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {labels.reviewApprove}
          </button>
        ) : null}
        {canApprove ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(proposal.id, "approve")}
            className="rounded-md border border-violet-300 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-50 disabled:opacity-50"
          >
            {labels.approve}
          </button>
        ) : null}
        {canReview ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(proposal.id, "reject")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {labels.reject}
          </button>
        ) : null}
        {canSchedule ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(proposal.id, "schedule")}
            className="rounded-md border border-teal-300 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50 disabled:opacity-50"
          >
            {labels.schedule}
          </button>
        ) : null}
        {canImplement ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(proposal.id, "implement")}
            className="rounded-md border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50"
          >
            {labels.implement}
          </button>
        ) : null}
        {canValidate ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(proposal.id, "validate")}
            className="rounded-md border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
          >
            {labels.validate}
          </button>
        ) : null}
        {canRollback ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(proposal.id, "rollback")}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {labels.rollback}
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function EvolutionGovernanceBoardPanel({ labels }: EvolutionGovernanceBoardPanelProps) {
  const [board, setBoard] = useState<EvolutionGovernanceBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/evolution-governance/board");
    if (res.ok) setBoard(parseEvolutionGovernanceBoard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/evolution-governance/briefings/generate", { method: "POST" });
    await load();
  };

  const onAction = async (id: string, action: string) => {
    setActing(id);
    const routes: Record<string, { url: string; body?: object }> = {
      review: { url: `/api/aipify/evolution-governance/proposals/${id}/review`, body: { decision: "approve_review" } },
      approve: { url: `/api/aipify/evolution-governance/proposals/${id}/approve` },
      reject: { url: `/api/aipify/evolution-governance/proposals/${id}/reject` },
      schedule: { url: `/api/aipify/evolution-governance/proposals/${id}/schedule` },
      implement: { url: `/api/aipify/evolution-governance/proposals/${id}/implement` },
      validate: { url: `/api/aipify/evolution-governance/proposals/${id}/validate` },
      rollback: { url: `/api/aipify/evolution-governance/proposals/${id}/rollback` },
    };
    const route = routes[action];
    if (route) {
      await fetch(route.url, {
        method: "POST",
        headers: route.body ? { "Content-Type": "application/json" } : undefined,
        body: route.body ? JSON.stringify(route.body) : undefined,
      });
    }
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!board?.has_customer) return null;

  const openProposals = board.proposals.filter((p) => !["rejected", "archived", "validated"].includes(p.status));

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.governanceTitle}</h2>
        <p className="mt-1 text-sm text-violet-800">{board.philosophy}</p>
        <p className="mt-2 text-xs text-violet-700">{board.safety_note}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void generateBriefing()}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            {labels.generateBriefing}
          </button>
        </div>
      </section>

      {board.approval_matrix ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.approvalMatrix}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(board.approval_matrix).map(([risk, config]) => {
              const c = config as Record<string, unknown>;
              return (
                <div key={risk} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className={`text-xs font-semibold uppercase ${riskClass(risk).split(" ")[1]}`}>{risk}</p>
                  <p className="mt-1 text-sm capitalize text-gray-700">{String(c.approver ?? "")}</p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.openProposals}</h2>
        {openProposals.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noProposals}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {openProposals.map((p) => (
              <ProposalCard key={p.id} proposal={p} labels={labels} acting={acting} onAction={onAction} />
            ))}
          </div>
        )}
      </section>

      {board.history.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.changeHistory}</h2>
          <ul className="mt-3 space-y-2">
            {board.history.map((h) => (
              <li key={h.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium capitalize text-gray-900">{h.outcome?.replace(/_/g, " ")}</span>
                {h.proposal_title ? <span className="text-gray-600"> — {h.proposal_title}</span> : null}
                {h.notes ? <p className="mt-1 text-xs text-gray-500">{h.notes}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {board.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.briefings}</h2>
          <ul className="mt-3 space-y-2">
            {board.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {board.integrations ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.integrations}</h2>
          <ul className="mt-2 space-y-1">
            {Object.entries(board.integrations).map(([key, desc]) => (
              <li key={key} className="text-xs text-gray-600">
                <span className="font-medium capitalize text-gray-800">{key.replace(/_/g, " ")}: </span>
                {desc}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
