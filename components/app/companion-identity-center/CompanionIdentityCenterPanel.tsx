"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseCompanionIdentityCenter, type CompanionIdentityCenter } from "@/lib/companion-identity-center-engine/parse";
import type { Cipa595Section } from "@/lib/companion-identity-center-engine/config";
import { cipa595SectionToRpc } from "@/lib/companion-identity-center-engine/config";
import type { buildCompanionIdentityCenterLabels } from "@/lib/companion-identity-center-engine/labels";

type Labels = ReturnType<typeof buildCompanionIdentityCenterLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  badge,
  extra,
}: {
  title: string;
  summary?: string;
  badge?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

function ValuesList({ values }: { values: unknown }) {
  const list = Array.isArray(values) ? values.map(String) : [];
  if (list.length === 0) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {list.map((value) => (
        <li key={value} className="rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-900 ring-1 ring-violet-100">
          {value}
        </li>
      ))}
    </ul>
  );
}

export function CompanionIdentityCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Cipa595Section;
}) {
  const [center, setCenter] = useState<CompanionIdentityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = cipa595SectionToRpc(activeSection);
    const res = await fetch(`/api/companion-identity-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseCompanionIdentityCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const stats = center.stats ?? {};
  const identity = center.core_identity ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections[activeSection]}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {activeSection === "overview" && (
        <>
          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">{labels.coreIdentity}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-zinc-500">{labels.identity.name}</p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">{String(identity.companion_name ?? "Aipify")}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-zinc-500">{labels.identity.role}</p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">{String(identity.companion_role ?? "")}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase text-zinc-500">{labels.identity.mission}</p>
                <p className="mt-1 text-sm text-zinc-700">{String(identity.companion_mission ?? "")}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase text-zinc-500">{labels.identity.values}</p>
                <ValuesList values={identity.core_values} />
              </div>
            </div>
          </section>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.personalityTraits} value={stats.personality_traits ?? 0} />
            <StatCard label={labels.stats.communicationProfiles} value={stats.communication_profiles ?? 0} />
            <StatCard label={labels.stats.preferences} value={stats.preferences ?? 0} />
            <StatCard label={labels.stats.themes} value={stats.themes ?? 0} />
            <StatCard label={labels.stats.behaviorRules} value={stats.behavior_rules ?? 0} />
            <StatCard label={labels.stats.orgProfiles} value={stats.org_profiles ?? 0} />
          </section>
          {(center.companion_recommendations?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              {(center.companion_recommendations ?? []).map((rec, i) => (
                <ItemCard
                  key={i}
                  title={String(rec.rule_title ?? "Insight")}
                  summary={String(rec.recommendation ?? "")}
                />
              ))}
            </section>
          )}
        </>
      )}

      {activeSection === "identity" && (
        <section className="space-y-4">
          <ItemCard
            title={String(identity.companion_name ?? "Aipify")}
            summary={String(identity.summary ?? "")}
            badge={String(identity.companion_role ?? "")}
            extra={
              <div className="mt-3 space-y-2 text-sm text-zinc-700">
                <p>
                  <span className="font-medium">{labels.identity.mission}: </span>
                  {String(identity.companion_mission ?? "")}
                </p>
                <ValuesList values={identity.core_values} />
              </div>
            }
          />
          {(center.org_personality_profiles ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.orgPersonalityProfiles}</h3>
              {(center.org_personality_profiles ?? []).map((p) => (
                <ItemCard
                  key={String(p.profile_key)}
                  title={String(p.profile_title)}
                  summary={String(p.summary ?? "")}
                  badge={`${String(p.profile_style ?? "")} · ${String(p.profile_status ?? "")}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "personality" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.personality_traits ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.personality_traits ?? []).map((t) => (
              <ItemCard
                key={String(t.trait_key)}
                title={String(t.trait_title)}
                summary={String(t.summary ?? "")}
                badge={String(t.trait_status ?? "")}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "communication" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.adaptiveCommunication}</h3>
            {(center.adaptive_communication ?? []).map((p) => (
              <ItemCard
                key={String(p.profile_key)}
                title={String(p.profile_title)}
                summary={String(p.summary ?? "")}
                badge={String(p.profile_value ?? "")}
              />
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.styleProfiles}</h3>
            {(center.style_profiles ?? []).map((p) => (
              <ItemCard
                key={String(p.profile_key)}
                title={String(p.profile_title)}
                summary={String(p.summary ?? "")}
                badge={String(p.profile_value ?? "")}
              />
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.humorAdaptation}</h3>
            {(center.humor_settings ?? []).map((p) => (
              <ItemCard
                key={String(p.profile_key)}
                title={String(p.profile_title)}
                summary={String(p.summary ?? "")}
                badge={String(p.profile_value ?? "")}
              />
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.introductionEngine}</h3>
            {(center.introductions ?? []).map((p) => (
              <ItemCard
                key={String(p.profile_key)}
                title={String(p.profile_title)}
                summary={String(p.summary ?? "")}
                extra={<p className="mt-2 text-sm italic text-violet-900">&ldquo;{String(p.profile_value ?? "")}&rdquo;</p>}
              />
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.executiveCompanionMode}</h3>
            {(center.executive_modes ?? []).map((p) => (
              <ItemCard
                key={String(p.profile_key)}
                title={String(p.profile_title)}
                summary={String(p.summary ?? "")}
                badge={String(p.profile_value ?? "")}
              />
            ))}
          </div>
        </section>
      )}

      {activeSection === "preferences" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.preferences ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.preferences ?? []).map((p) => (
              <ItemCard
                key={String(p.preference_key)}
                title={String(p.preference_title)}
                summary={String(p.summary ?? p.preference_value ?? "")}
                badge={String(p.preference_category ?? "")}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "themes" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.themes ?? []).map((t) => (
            <ItemCard
              key={String(t.theme_key)}
              title={String(t.theme_title)}
              summary={String(t.summary ?? "")}
              badge={String(t.theme_status ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "behavior" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.wellbeingPrinciple}</h3>
            {(center.wellbeing_signals ?? []).map((r) => (
              <ItemCard key={String(r.rule_key)} title={String(r.rule_title)} summary={String(r.summary ?? "")} />
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.toneGovernance}</h3>
            {(center.tone_governance ?? []).map((r) => (
              <ItemCard key={String(r.rule_key)} title={String(r.rule_title)} summary={String(r.summary ?? "")} />
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.relationshipDevelopment}</h3>
            {(center.relationship_development ?? []).map((r) => (
              <ItemCard key={String(r.rule_key)} title={String(r.rule_title)} summary={String(r.summary ?? "")} />
            ))}
          </div>
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.identityAdvisor}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          {(center.business_packs ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.businessPackIntegration}</h3>
              {(center.business_packs ?? []).map((pack) => (
                <ItemCard
                  key={String(pack.pack_key)}
                  title={String(pack.pack_title)}
                  summary={String(pack.summary ?? "")}
                  badge={String(pack.recommended_tone ?? "")}
                  extra={
                    pack.terminology ? (
                      <p className="mt-1 text-xs text-zinc-500">{String(pack.terminology)}</p>
                    ) : null
                  }
                />
              ))}
            </div>
          )}
          {(center.audit_recent ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">Audit</h3>
              {(center.audit_recent ?? []).map((entry, i) => (
                <ItemCard
                  key={i}
                  title={String(entry.event_type ?? "")}
                  summary={String(entry.summary ?? "")}
                  extra={entry.created_at ? <p className="mt-1 text-xs text-zinc-500">{String(entry.created_at)}</p> : null}
                />
              ))}
            </div>
          )}
          {center.mobile_access && (
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.mobileAccess}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.mobile_access).map(([cap, enabled]) => (
                  <li key={cap} className="rounded-full bg-white px-3 py-1 ring-1 ring-violet-100">
                    {cap.replace(/_/g, " ")}: {enabled === true ? "✓" : "—"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
