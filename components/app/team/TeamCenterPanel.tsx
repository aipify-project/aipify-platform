"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import type { CustomerTeamInvitation, CustomerTeamMember } from "@/lib/app/customer-app";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type ProfileBadge = {
  badge_key?: string;
  name?: string;
  description?: string;
};

type TeamCenterPanelProps = {
  locale: string;
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
    inviteSoon: string;
  };
};

export function TeamCenterPanel({ locale, labels }: TeamCenterPanelProps) {
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
      setMembers((data.members as CustomerTeamMember[]) ?? []);
      setInvitations((data.invitations as CustomerTeamInvitation[]) ?? []);
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

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-gray-900">{labels.achievementBadges}</h2>
          <a href="/app/certification-achievement-engine" className="text-sm text-amber-900 underline">
            {labels.viewCertifications}
          </a>
        </div>
        {profileBadges.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">{labels.noAchievementBadges}</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {profileBadges.map((badge) => (
              <span
                key={badge.badge_key ?? badge.name}
                className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-medium text-amber-900"
                title={badge.description}
              >
                {badge.name ?? badge.badge_key}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.members}</h2>
        {members.length === 0 ? (
          <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
        ) : (
          <table className="mt-4 min-w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="pb-2">{labels.columns.name}</th>
                <th className="pb-2">{labels.columns.email}</th>
                <th className="pb-2">{labels.columns.role}</th>
                <th className="pb-2">{labels.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-t border-gray-100">
                  <td className="py-2 font-medium text-gray-900">{member.name}</td>
                  <td className="py-2 text-gray-600">{member.email}</td>
                  <td className="py-2">{labels.roleLabels[member.role] ?? member.role}</td>
                  <td className="py-2">{member.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.invitations}</h2>
        {invitations.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noInvitations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {invitations.map((invite) => (
              <li key={invite.id} className="text-sm text-gray-700">
                {invite.email} — {labels.roleLabels[invite.role] ?? invite.role} ({invite.status})
                <span className="ml-2 text-gray-400">{formatDate(invite.created_at, locale)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
          {labels.inviteSoon}
        </p>
      </section>
    </div>
  );
}
