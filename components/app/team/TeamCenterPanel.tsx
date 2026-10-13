"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import type { CustomerTeamInvitation, CustomerTeamMember } from "@/lib/app/customer-app";
import { filterProductionPresentableIdentities } from "@/lib/app-production-experience";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type ProfileBadge = {
  badge_key?: string;
  name?: string;
  description?: string;
};

type TeamCenterPanelProps = {
  locale: string;
  embedded?: boolean;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    members: string;
    invitations: string;
    noInvitations: string;
    achievementBadges: string;
    noAchievementBadges: string;
    viewCertifications: string;
    columns: {
      name: string;
      email: string;
      role: string;
      status: string;
    };
    roleLabels: Record<string, string>;
    statusLabels?: Record<string, string>;
    inviteSoon: string;
  };
};

function localizeStatus(
  status: string,
  labels: TeamCenterPanelProps["labels"]["statusLabels"],
): string {
  const normalized = status.trim().toLowerCase();
  return labels?.[normalized] ?? labels?.[status] ?? status;
}

export function TeamCenterPanel({ locale, labels, embedded = false }: TeamCenterPanelProps) {
  const [members, setMembers] = useState<CustomerTeamMember[]>([]);
  const [invitations, setInvitations] = useState<CustomerTeamInvitation[]>([]);
  const [profileBadges, setProfileBadges] = useState<ProfileBadge[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const [teamRes, badgesRes] = await Promise.all([
      supabase.rpc("get_customer_team_center"),
      fetch("/api/certifications/badges"),
    ]);

    const { data, error } = teamRes;
    if (!error && data?.has_customer) {
      const rawMembers = (data.members as CustomerTeamMember[]) ?? [];
      const rawInvites = (data.invitations as CustomerTeamInvitation[]) ?? [];
      setMembers(filterProductionPresentableIdentities(rawMembers));
      setInvitations(filterProductionPresentableIdentities(rawInvites));
    }

    if (badgesRes.ok) {
      const badges = (await badgesRes.json()) as ProfileBadge[];
      setProfileBadges(Array.isArray(badges) ? badges : []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className={embedded ? "w-full space-y-6" : "mx-auto max-w-5xl space-y-6 p-6"}>
      {!embedded ? (
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text,#111827)]">{labels.title}</h1>
          <p className="mt-2 text-[var(--app-text-muted,#4b5563)]">{labels.subtitle}</p>
        </div>
      ) : null}

      <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-[var(--app-text,#111827)] sm:text-lg">{labels.achievementBadges}</h2>
          <Link href="/app/certification-achievement-engine" className="text-sm font-medium text-amber-900 underline">
            {labels.viewCertifications}
          </Link>
        </div>
        {profileBadges.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--app-text-muted,#4b5563)]">{labels.noAchievementBadges}</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {profileBadges.map((badge) => (
              <span
                key={badge.badge_key ?? badge.name}
                className="rounded-full border border-amber-200 bg-[var(--app-card,#fff)] px-3 py-1 text-xs font-medium text-amber-900"
                title={badge.description}
              >
                {badge.name ?? badge.badge_key}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--app-border,#e5e7eb)] bg-[var(--app-card,#fff)] p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-[var(--app-text,#111827)] sm:text-lg">{labels.members}</h2>
        {members.length === 0 ? (
          <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
        ) : (
          <table className="mt-4 min-w-full text-sm">
            <thead className="text-left text-[var(--app-text-muted,#6b7280)]">
              <tr>
                <th className="pb-2 text-[0.8125rem] font-semibold uppercase tracking-wide">{labels.columns.name}</th>
                <th className="pb-2 text-[0.8125rem] font-semibold uppercase tracking-wide">{labels.columns.email}</th>
                <th className="pb-2 text-[0.8125rem] font-semibold uppercase tracking-wide">{labels.columns.role}</th>
                <th className="pb-2 text-[0.8125rem] font-semibold uppercase tracking-wide">{labels.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-[var(--app-border,#f3f4f6)]">
                  <td className="py-2.5 font-medium text-[var(--app-text,#111827)]">{member.name}</td>
                  <td className="py-2.5 text-[var(--app-text-muted,#4b5563)]">{member.email}</td>
                  <td className="py-2">{labels.roleLabels[member.role] ?? member.role}</td>
                  <td className="py-2">
                    {localizeStatus(member.status, labels.statusLabels)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {invitations.length > 0 ? (
        <section className="rounded-2xl border border-[var(--app-border,#e5e7eb)] bg-[var(--app-card,#fff)] p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-[var(--app-text,#111827)] sm:text-lg">{labels.invitations}</h2>
          <ul className="mt-3 space-y-2">
            {invitations.map((invite) => (
              <li key={invite.id} className="text-sm text-[var(--app-text,#374151)]">
                {invite.email} — {labels.roleLabels[invite.role] ?? invite.role} (
                {localizeStatus(invite.status, labels.statusLabels)})
                <span className="ml-2 text-[var(--app-text-muted,#9ca3af)]">{formatDate(invite.created_at, locale)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
