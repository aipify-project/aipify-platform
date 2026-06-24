"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseOrganizationAccessRequest,
  type OrganizationAccessApprovalCenter,
} from "@/lib/organization-access-approval/center";
import type { OrganizationAccessRequestRecord } from "@/lib/core/organization-access-approval/types";
import {
  resolveProviderAccessManifest,
  resolveScopesForCapability,
} from "@/lib/core/organization-access-approval/provider-scope-registry";
import { mapOrganizationAccessRpcError } from "@/lib/core/authorization-target";
import {
  buildOrganizationAccessContextPayload,
  buildOrganizationAccessIdempotencyKey,
  isOrganizationAccessApproveBinding,
  isOrganizationAccessCreateBinding,
  parseOrganizationAccessIntentBinding,
} from "@/lib/core/organization-access-approval/access-intent-binding";

export type OrganizationAccessApprovalPanelLabels = {
  title: string;
  subtitle: string;
  back: string;
  loading: string;
  empty: string;
  employeeNote: string;
  createTitle: string;
  createDescription: string;
  submitRequest: string;
  cancelRequest: string;
  requestSubmitted: string;
  requestFailed: string;
  pendingTitle: string;
  approve: string;
  deny: string;
  approved: string;
  denied: string;
  errors: {
    approverShouldGrantDirectly: string;
    providerRequired: string;
    scopeRequired: string;
  };
  approverDirectTitle: string;
  approverDirectDescription: string;
  approverApproveAccess: string;
  approverNoPendingRequest: string;
  review: {
    provider: string;
    dataType: string;
    whyNeeded: string;
    scope: string;
    accessMode: string;
    duration: string;
    risk: string;
    requester: string;
    afterApproval: string;
    afterApprovalDetail: string;
  };
  accessMode: {
    oneTime: string;
    ongoing: string;
  };
  durationOpenEnded: string;
  durationHours: string;
  riskLevels: Record<string, string>;
  providers: Record<string, string>;
  scopes: Record<string, string>;
  statusLabels: Record<string, string>;
};

type OrganizationAccessApprovalPanelProps = {
  labels: OrganizationAccessApprovalPanelLabels;
};

function resolvePanelErrorMessage(
  rawError: string | undefined,
  labels: OrganizationAccessApprovalPanelLabels,
): string {
  const mappedKey = mapOrganizationAccessRpcError(rawError);
  if (mappedKey === "customerApp.authorizationTarget.errors.approverShouldGrantDirectly") {
    return labels.errors.approverShouldGrantDirectly;
  }
  if (mappedKey === "customerApp.authorizationTarget.errors.providerRequired") {
    return labels.errors.providerRequired;
  }
  if (mappedKey === "customerApp.authorizationTarget.errors.scopeRequired") {
    return labels.errors.scopeRequired;
  }
  return labels.requestFailed;
}

function parseCenterPayload(value: unknown): OrganizationAccessApprovalCenter {
  const record = (value ?? {}) as Record<string, unknown>;
  const requests = Array.isArray(record.requests)
    ? record.requests.map(parseOrganizationAccessRequest)
    : [];
  return {
    requests,
    can_review: record.can_review === true,
  };
}

export function OrganizationAccessApprovalPanel({ labels }: OrganizationAccessApprovalPanelProps) {
  const searchParams = useSearchParams();
  const intentBinding = useMemo(
    () => parseOrganizationAccessIntentBinding(searchParams),
    [searchParams],
  );

  const [center, setCenter] = useState<OrganizationAccessApprovalCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/organization-access/requests?status=pending");
    if (res.ok) {
      setCenter(parseCenterPayload(await res.json()));
    } else {
      setCenter({ requests: [], can_review: false });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createOffer = useMemo(() => {
    if (!intentBinding || !isOrganizationAccessCreateBinding(intentBinding)) return null;
    if (center?.can_review) return null;
    const manifest = resolveProviderAccessManifest(intentBinding.provider_key);
    const scopeKeys = resolveScopesForCapability({
      provider_key: intentBinding.provider_key,
      capability_key: intentBinding.capability_key,
    });
    if (!manifest || scopeKeys.length === 0) return null;
    const defaultScope = manifest.required_scopes[0];
    return {
      provider_key: intentBinding.provider_key,
      capability_key: intentBinding.capability_key,
      scope_keys: scopeKeys,
      access_mode: defaultScope.default_access_mode,
      duration_hours: defaultScope.default_duration_hours,
      risk_level: defaultScope.risk_level,
      binding: intentBinding,
    };
  }, [center?.can_review, intentBinding]);

  const approveBinding = useMemo(() => {
    if (!intentBinding || !isOrganizationAccessApproveBinding(intentBinding)) return null;
    if (!center?.can_review) return null;
    const manifest = resolveProviderAccessManifest(intentBinding.provider_key);
    const scopeKeys = resolveScopesForCapability({
      provider_key: intentBinding.provider_key,
      capability_key: intentBinding.capability_key,
    });
    if (!manifest || scopeKeys.length === 0) return null;
    const defaultScope = manifest.required_scopes[0];
    return {
      provider_key: intentBinding.provider_key,
      capability_key: intentBinding.capability_key,
      scope_keys: scopeKeys,
      access_mode: defaultScope.default_access_mode,
      duration_hours: defaultScope.default_duration_hours,
      risk_level: defaultScope.risk_level,
      binding: intentBinding,
    };
  }, [center?.can_review, intentBinding]);

  const matchingPendingRequest = useMemo(() => {
    if (!approveBinding || !center) return null;
    if (approveBinding.binding.request_id) {
      return (
        center.requests.find(
          (request) =>
            request.id === approveBinding.binding.request_id && request.status === "pending",
        ) ?? null
      );
    }
    return (
      center.requests.find(
        (request) =>
          request.provider_key === approveBinding.provider_key &&
          request.status === "pending" &&
          (approveBinding.capability_key == null ||
            request.capability_key === approveBinding.capability_key),
      ) ?? null
    );
  }, [approveBinding, center]);

  const staleApproverCreateIntent =
    Boolean(center?.can_review) &&
    intentBinding != null &&
    isOrganizationAccessCreateBinding(intentBinding);

  async function submitCreateRequest() {
    if (!createOffer) return;
    setSubmitting(true);
    setActionError(null);
    const res = await fetch("/api/app/organization-access/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider_key: createOffer.provider_key,
        capability_key: createOffer.capability_key,
        scope_keys: createOffer.scope_keys,
        access_mode: createOffer.access_mode,
        duration_hours: createOffer.duration_hours,
        risk_level: createOffer.risk_level,
        context_payload: buildOrganizationAccessContextPayload(createOffer.binding),
        idempotency_key: buildOrganizationAccessIdempotencyKey(createOffer.binding),
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      setActionError(resolvePanelErrorMessage(payload.error, labels));
      return;
    }
    setActionMessage(labels.requestSubmitted);
    window.history.replaceState({}, "", "/app/settings/organization-access");
    await load();
  }

  async function approveRequest(requestId: string) {
    setActionError(null);
    const res = await fetch(`/api/app/organization-access/requests/${requestId}/approve`, {
      method: "POST",
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      setActionError(resolvePanelErrorMessage(payload.error, labels));
      return;
    }
    setActionMessage(labels.approved);
    window.history.replaceState({}, "", "/app/settings/organization-access");
    await load();
  }

  async function submitDirectGrant() {
    if (!approveBinding) return;
    setSubmitting(true);
    setActionError(null);
    const res = await fetch("/api/app/organization-access/grant-direct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider_key: approveBinding.provider_key,
        capability_key: approveBinding.capability_key,
        scope_keys: approveBinding.scope_keys,
        access_mode: approveBinding.access_mode,
        duration_hours: approveBinding.duration_hours,
        risk_level: approveBinding.risk_level,
        context_payload: buildOrganizationAccessContextPayload(approveBinding.binding),
        idempotency_key: buildOrganizationAccessIdempotencyKey(approveBinding.binding),
      }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      setActionError(resolvePanelErrorMessage(payload.error, labels));
      return;
    }
    setActionMessage(labels.approved);
    window.history.replaceState({}, "", "/app/settings/organization-access");
    await load();
  }

  async function denyRequest(requestId: string) {
    setActionError(null);
    const res = await fetch(`/api/app/organization-access/requests/${requestId}/deny`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      setActionError(resolvePanelErrorMessage(payload.error, labels));
      return;
    }
    setActionMessage(labels.denied);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link href="/app/settings" className="text-sm text-violet-700 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 text-slate-600">{labels.subtitle}</p>
      </div>

      {!center?.can_review ? (
        <p className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-950">
          {labels.employeeNote}
        </p>
      ) : null}

      {staleApproverCreateIntent ? (
        <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {labels.errors.approverShouldGrantDirectly}
        </p>
      ) : null}

      {approveBinding ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.approverDirectTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.approverDirectDescription}</p>
          <RequestReviewCard
            request={buildDraftRequest(approveBinding, labels, matchingPendingRequest?.id ?? "approve-draft")}
            labels={labels}
          />
          {matchingPendingRequest ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void approveRequest(matchingPendingRequest.id)}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
              >
                {labels.approverApproveAccess}
              </button>
              <Link
                href="/app/settings/organization-access"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {labels.cancelRequest}
              </Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => void submitDirectGrant()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {labels.approverApproveAccess}
              </button>
              <Link
                href="/app/settings/organization-access"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {labels.cancelRequest}
              </Link>
            </div>
          )}
        </section>
      ) : null}

      {createOffer ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.createTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{labels.createDescription}</p>
          <RequestReviewCard request={buildDraftRequest(createOffer, labels)} labels={labels} />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => void submitCreateRequest()}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {labels.submitRequest}
            </button>
            <Link
              href="/app/settings/organization-access"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {labels.cancelRequest}
            </Link>
          </div>
        </section>
      ) : null}

      {actionMessage ? <p className="text-sm text-emerald-700">{actionMessage}</p> : null}
      {actionError ? <p className="text-sm text-red-700">{actionError}</p> : null}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">{labels.pendingTitle}</h2>
        {center?.requests.length ? (
          center.requests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <RequestReviewCard request={request} labels={labels} />
              {center.can_review && request.status === "pending" ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void approveRequest(request.id)}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                  >
                    {labels.approve}
                  </button>
                  <button
                    type="button"
                    onClick={() => void denyRequest(request.id)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {labels.deny}
                  </button>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            {labels.empty}
          </p>
        )}
      </section>
    </div>
  );
}

function buildDraftRequest(
  offer: {
    provider_key: string;
    scope_keys: string[];
    access_mode: "one_time" | "ongoing";
    duration_hours: number | null;
    risk_level: number;
  },
  labels: OrganizationAccessApprovalPanelLabels,
  draftId = "draft",
): OrganizationAccessRequestRecord {
  return {
    id: draftId,
    organization_id: "",
    requester_user_id: "",
    requester_display_name: labels.review.requester.replace("{name}", "—"),
    provider_key: offer.provider_key,
    capability_key: null,
    scope_keys: offer.scope_keys,
    access_mode: offer.access_mode,
    duration_hours: offer.duration_hours,
    risk_level: offer.risk_level,
    status: "pending",
    reason_summary: "",
    context_payload: {},
    idempotency_key: null,
    approved_by_user_id: null,
    denied_by_user_id: null,
    expires_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function RequestReviewCard({
  request,
  labels,
}: {
  request: OrganizationAccessRequestRecord;
  labels: OrganizationAccessApprovalPanelLabels;
}) {
  const manifest = resolveProviderAccessManifest(request.provider_key);
  const providerLabel =
    labels.providers[request.provider_key] ??
    (manifest ? labels.providers[manifest.provider_key] : request.provider_key);

  const scopeSummary = request.scope_keys
    .map((scopeKey) => labels.scopes[scopeKey] ?? scopeKey)
    .join(", ");

  const accessModeLabel =
    request.access_mode === "one_time" ? labels.accessMode.oneTime : labels.accessMode.ongoing;

  const durationLabel =
    request.duration_hours != null
      ? labels.durationHours.replace("{hours}", String(request.duration_hours))
      : labels.durationOpenEnded;

  return (
    <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
      <ReviewItem label={labels.review.provider} value={providerLabel} />
      <ReviewItem
        label={labels.review.dataType}
        value={manifest ? labels.providers[`${request.provider_key}.dataType`] ?? "—" : "—"}
      />
      <ReviewItem
        label={labels.review.whyNeeded}
        value={manifest ? labels.providers[`${request.provider_key}.whyNeeded`] ?? "—" : "—"}
        className="sm:col-span-2"
      />
      <ReviewItem label={labels.review.scope} value={scopeSummary} />
      <ReviewItem label={labels.review.accessMode} value={accessModeLabel} />
      <ReviewItem label={labels.review.duration} value={durationLabel} />
      <ReviewItem
        label={labels.review.risk}
        value={labels.riskLevels[String(request.risk_level)] ?? labels.riskLevels["1"]}
      />
      <ReviewItem
        label={labels.review.requester}
        value={request.requester_display_name ?? "—"}
      />
      <ReviewItem
        label={labels.review.afterApproval}
        value={labels.review.afterApprovalDetail}
        className="sm:col-span-2"
      />
    </dl>
  );
}

function ReviewItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-900">{value}</dd>
    </div>
  );
}
