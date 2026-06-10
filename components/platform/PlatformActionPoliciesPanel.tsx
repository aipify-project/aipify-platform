"use client";

import { useEffect, useState } from "react";
import {
  getActionRiskStyle,
  parseApprovalPolicies,
  type ApprovalPolicy,
} from "@/lib/platform/action-engine";
import { createClient } from "@/lib/supabase/client";

type PlatformActionPoliciesPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    customerPolicies: string;
    loading: string;
    empty: string;
    tenant: string;
    riskLevel: string;
    rule: string;
    autoApprove: string;
    approverRole: string;
    manualOnly: string;
    yes: string;
    no: string;
    platformDefault: string;
    riskLabels: Record<string, string>;
  };
};

export default function PlatformActionPoliciesPanel({
  labels,
}: PlatformActionPoliciesPanelProps) {
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<ApprovalPolicy[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_approval_policies");
      if (!cancelled) {
        setPolicies(error || !data ? [] : parseApprovalPolicies(data));
        setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  const platformPolicies = policies.filter((p) => !p.tenant_id);
  const tenantPolicies = policies.filter((p) => p.tenant_id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>
      {policies.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.empty}</p>
      ) : (
        <>
          <PolicySection
            title={labels.platformDefault}
            policies={platformPolicies}
            labels={labels}
          />
          {tenantPolicies.length > 0 && (
            <PolicySection
              title={labels.customerPolicies}
              policies={tenantPolicies}
              labels={labels}
            />
          )}
        </>
      )}
    </div>
  );
}

function PolicySection({
  title,
  policies,
  labels,
}: {
  title: string;
  policies: ApprovalPolicy[];
  labels: PlatformActionPoliciesPanelProps["labels"];
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-3">
        {policies.map((policy) => (
          <article
            key={policy.id}
            className="rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-gray-900">{policy.tenant_name}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${getActionRiskStyle(policy.risk_level)}`}
              >
                {labels.riskLabels[policy.risk_level]}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-700">{policy.policy_rule}</p>
            <dl className="mt-2 grid gap-1 text-xs text-gray-600 sm:grid-cols-3">
              <div>
                <dt>{labels.autoApprove}</dt>
                <dd className="font-semibold">{policy.auto_approve ? labels.yes : labels.no}</dd>
              </div>
              <div>
                <dt>{labels.approverRole}</dt>
                <dd className="font-semibold">{policy.approver_role ?? "—"}</dd>
              </div>
              <div>
                <dt>{labels.manualOnly}</dt>
                <dd className="font-semibold">{policy.manual_only ? labels.yes : labels.no}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
