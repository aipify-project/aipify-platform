-- Phase 597 — Aipify Knowledge Fabric, Organizational Wisdom & Truth Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/knowledge-fabric/*
-- Helpers: _kftw597_*

create table if not exists public.organization_kftw597_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  knowledge_fabric_enabled boolean not null default true,
  truth_engine_enabled boolean not null default true,
  conflict_detection_enabled boolean not null default true,
  trust_scoring_enabled boolean not null default true,
  review_engine_enabled boolean not null default true,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_kftw597_settings enable row level security;
revoke all on public.organization_kftw597_settings from authenticated, anon;

create table if not exists public.organization_kftw597_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_key text not null,
  source_title text not null,
  source_type text not null check (
    source_type in (
      'knowledge_center', 'documents', 'policies', 'contracts', 'meetings',
      'projects', 'decisions', 'lessons', 'business_pack', 'external_integration'
    )
  ),
  source_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, source_key)
);

alter table public.organization_kftw597_sources enable row level security;
revoke all on public.organization_kftw597_sources from authenticated, anon;

create table if not exists public.organization_kftw597_knowledge (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  knowledge_key text not null,
  knowledge_title text not null,
  knowledge_type text not null check (
    knowledge_type in ('policy', 'procedure', 'playbook', 'decision', 'lesson', 'best_practice', 'document')
  ),
  knowledge_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, knowledge_key)
);

alter table public.organization_kftw597_knowledge enable row level security;
revoke all on public.organization_kftw597_knowledge from authenticated, anon;

create table if not exists public.organization_kftw597_conflicts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conflict_key text not null,
  conflict_title text not null,
  conflict_type text not null check (
    conflict_type in (
      'contradiction', 'outdated_procedure', 'duplicate_document',
      'conflicting_instruction', 'missing_ownership'
    )
  ),
  conflict_status text not null default 'open',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, conflict_key)
);

alter table public.organization_kftw597_conflicts enable row level security;
revoke all on public.organization_kftw597_conflicts from authenticated, anon;

create table if not exists public.organization_kftw597_trust_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  trust_key text not null,
  trust_title text not null,
  trust_level text not null check (
    trust_level in ('trusted', 'verified', 'review_needed', 'potentially_outdated')
  ),
  trust_score integer not null default 75 check (trust_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, trust_key)
);

alter table public.organization_kftw597_trust_scores enable row level security;
revoke all on public.organization_kftw597_trust_scores from authenticated, anon;

create table if not exists public.organization_kftw597_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  review_title text not null,
  review_cycle text not null check (
    review_cycle in ('monthly', 'quarterly', 'annual', 'critical')
  ),
  review_status text not null default 'scheduled',
  due_at date,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, review_key)
);

alter table public.organization_kftw597_reviews enable row level security;
revoke all on public.organization_kftw597_reviews from authenticated, anon;

create table if not exists public.organization_kftw597_wisdom (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  wisdom_key text not null,
  wisdom_title text not null,
  wisdom_type text not null check (
    wisdom_type in ('decision', 'lesson', 'success_story', 'playbook', 'best_practice', 'policy')
  ),
  wisdom_status text not null default 'preserved',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, wisdom_key)
);

alter table public.organization_kftw597_wisdom enable row level security;
revoke all on public.organization_kftw597_wisdom from authenticated, anon;

create table if not exists public.organization_kftw597_reliability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_type text not null check (
    metric_type in ('source_reliability', 'review_frequency', 'user_trust', 'approval_coverage', 'conflict_rate')
  ),
  metric_score integer not null default 75 check (metric_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, metric_key)
);

alter table public.organization_kftw597_reliability enable row level security;
revoke all on public.organization_kftw597_reliability from authenticated, anon;

create table if not exists public.organization_kftw597_lineage (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  lineage_key text not null,
  lineage_title text not null,
  lineage_stage text not null check (
    lineage_stage in ('source', 'revision', 'approval', 'ownership', 'dependency')
  ),
  lineage_status text not null default 'tracked',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, lineage_key)
);

alter table public.organization_kftw597_lineage enable row level security;
revoke all on public.organization_kftw597_lineage from authenticated, anon;

create table if not exists public.organization_kftw597_decay (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decay_key text not null,
  decay_title text not null,
  decay_type text not null check (
    decay_type in ('outdated_article', 'unreviewed_policy', 'unused_document', 'orphaned_knowledge')
  ),
  decay_status text not null default 'identified',
  months_since_review integer,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, decay_key)
);

alter table public.organization_kftw597_decay enable row level security;
revoke all on public.organization_kftw597_decay from authenticated, anon;

create table if not exists public.organization_kftw597_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  policies_count integer not null default 0,
  knowledge_count integer not null default 0,
  procedures_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_kftw597_business_packs enable row level security;
revoke all on public.organization_kftw597_business_packs from authenticated, anon;

create table if not exists public.organization_kftw597_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'knowledge_fabric',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_kftw597_audit_logs enable row level security;
revoke all on public.organization_kftw597_audit_logs from authenticated, anon;

create or replace function public._kftw597_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._kftw597_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'knowledge_fabric'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_kftw597_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'knowledge_fabric'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._kftw597_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_kftw597_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._kftw597_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._kftw597_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_kftw597_sources where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_kftw597_sources (
    organization_id, source_key, source_title, source_type, summary
  ) values
    (p_org_id, 'src_kc', 'Knowledge Center', 'knowledge_center', 'Every source becomes visible.'),
    (p_org_id, 'src_docs', 'Documents', 'documents', 'Document source registry.'),
    (p_org_id, 'src_policies', 'Policies', 'policies', 'Policy source tracked.'),
    (p_org_id, 'src_contracts', 'Contracts', 'contracts', 'Contract knowledge source.'),
    (p_org_id, 'src_meetings', 'Meetings', 'meetings', 'Meeting notes metadata.'),
    (p_org_id, 'src_projects', 'Projects', 'projects', 'Project knowledge source.'),
    (p_org_id, 'src_decisions', 'Decisions', 'decisions', 'Decision records linked.'),
    (p_org_id, 'src_lessons', 'Lessons Learned', 'lessons', 'Lessons learned source.'),
    (p_org_id, 'src_packs', 'Business Packs', 'business_pack', 'Business Pack contributions.'),
    (p_org_id, 'src_ext', 'External Integrations', 'external_integration', 'External integration source.');

  insert into public.organization_kftw597_knowledge (
    organization_id, knowledge_key, knowledge_title, knowledge_type, summary
  ) values
    (p_org_id, 'know_policy_a', 'Refund Policy v3', 'policy', 'Authoritative policy candidate.'),
    (p_org_id, 'know_policy_b', 'Refund Policy v2 (legacy)', 'policy', 'Potentially outdated policy.'),
    (p_org_id, 'know_support_v5', 'Support Process Version 5', 'procedure', 'Latest approved support process.'),
    (p_org_id, 'know_playbook', 'Enterprise Onboarding Playbook', 'playbook', 'Organizational wisdom preserved.'),
    (p_org_id, 'know_decision', 'Q1 Automation Decision', 'decision', 'Decision record in wisdom library.');

  insert into public.organization_kftw597_conflicts (
    organization_id, conflict_key, conflict_title, conflict_type, summary
  ) values
    (p_org_id, 'conf_support', 'Support Process v2 vs v5', 'contradiction', 'Support Process Version 2 conflicts with Version 5 — Companion flags conflict.'),
    (p_org_id, 'conf_policy', 'Policy A vs Document B', 'contradiction', 'Policy A says one thing — Document B says another.'),
    (p_org_id, 'conf_dup', 'Duplicate onboarding docs', 'duplicate_document', 'Duplicate documentation detected.'),
    (p_org_id, 'conf_owner', 'Missing ownership — SLA guide', 'missing_ownership', 'Missing ownership on critical knowledge.');

  insert into public.organization_kftw597_trust_scores (
    organization_id, trust_key, trust_title, trust_level, trust_score, summary
  ) values
    (p_org_id, 'trust_support', 'Support Process v5', 'verified', 92, 'Verified — high ownership and review activity.'),
    (p_org_id, 'trust_policy', 'Refund Policy v3', 'trusted', 88, 'Trusted knowledge with recent validation.'),
    (p_org_id, 'trust_legacy', 'Refund Policy v2', 'potentially_outdated', 42, 'Potentially outdated — review required.'),
    (p_org_id, 'trust_sla', 'SLA Guide', 'review_needed', 58, 'Review needed — age and usage signals.');

  insert into public.organization_kftw597_reviews (
    organization_id, review_key, review_title, review_cycle, due_at, summary
  ) values
    (p_org_id, 'rev_monthly', 'Monthly policy review', 'monthly', current_date + interval '14 days', 'Companion schedules reviews automatically.'),
    (p_org_id, 'rev_quarterly', 'Quarterly playbook review', 'quarterly', current_date + interval '45 days', 'Quarterly review scheduled.'),
    (p_org_id, 'rev_annual', 'Annual compliance review', 'annual', current_date + interval '120 days', 'Annual review cycle.'),
    (p_org_id, 'rev_critical', 'Critical SLA guide review', 'critical', current_date + interval '7 days', 'Critical review — trust risk.');

  insert into public.organization_kftw597_wisdom (
    organization_id, wisdom_key, wisdom_title, wisdom_type, summary
  ) values
    (p_org_id, 'wis_decision', 'Defer automation rollout', 'decision', 'Preserve organizational wisdom — decisions.'),
    (p_org_id, 'wis_lesson', 'Pilot before enterprise rollout', 'lesson', 'Lessons learned preserved.'),
    (p_org_id, 'wis_success', 'Unonight onboarding success', 'success_story', 'Success story in wisdom library.'),
    (p_org_id, 'wis_playbook', 'Support escalation playbook', 'playbook', 'Best practice playbook.'),
    (p_org_id, 'wis_policy', 'Data retention policy', 'policy', 'Policy in organizational wisdom library.');

  insert into public.organization_kftw597_reliability (
    organization_id, metric_key, metric_title, metric_type, metric_score, summary
  ) values
    (p_org_id, 'rel_source', 'Source Reliability', 'source_reliability', 84, 'Organizations understand information quality.'),
    (p_org_id, 'rel_review', 'Review Frequency', 'review_frequency', 76, 'Review frequency measured.'),
    (p_org_id, 'rel_user', 'User Trust', 'user_trust', 81, 'User trust in knowledge base.'),
    (p_org_id, 'rel_approval', 'Approval Coverage', 'approval_coverage', 79, 'Approval coverage tracked.'),
    (p_org_id, 'rel_conflict', 'Conflict Rate', 'conflict_rate', 68, 'Conflict rate — lower is better.');

  insert into public.organization_kftw597_lineage (
    organization_id, lineage_key, lineage_title, lineage_stage, summary
  ) values
    (p_org_id, 'lin_source', 'Source — Knowledge Center import', 'source', 'Understand where knowledge originates.'),
    (p_org_id, 'lin_revision', 'Revision — Support v5 approved', 'revision', 'Revision lineage tracked.'),
    (p_org_id, 'lin_approval', 'Approval — Legal sign-off', 'approval', 'Approval lineage recorded.'),
    (p_org_id, 'lin_owner', 'Ownership — Customer Success', 'ownership', 'Ownership assigned and visible.'),
    (p_org_id, 'lin_dep', 'Dependency — Support Pack playbook', 'dependency', 'Knowledge dependencies mapped.');

  insert into public.organization_kftw597_decay (
    organization_id, decay_key, decay_title, decay_type, months_since_review, summary
  ) values
    (p_org_id, 'dec_outdated', 'Outdated article — billing FAQ', 'outdated_article', 18, 'Outdated article identified.'),
    (p_org_id, 'dec_unreviewed', 'Unreviewed policy — travel expenses', 'unreviewed_policy', 24, 'No review in 24 months — review required.'),
    (p_org_id, 'dec_unused', 'Unused document — legacy install guide', 'unused_document', 30, 'Unused document flagged.'),
    (p_org_id, 'dec_orphan', 'Orphaned knowledge — vendor matrix', 'orphaned_knowledge', 36, 'Orphaned knowledge — no owner.');

  insert into public.organization_kftw597_business_packs (
    organization_id, pack_key, pack_title, policies_count, knowledge_count, procedures_count, summary
  ) values
    (p_org_id, 'support', 'Support Pack', 4, 12, 8, 'Support Pack → support knowledge.'),
    (p_org_id, 'finance', 'Finance Pack', 6, 9, 5, 'Finance Pack → financial knowledge.'),
    (p_org_id, 'hosts', 'Hosts Pack', 3, 7, 6, 'Hosts Pack → property knowledge.');

  perform public._kftw597_log(p_org_id, 'knowledge_added', 'Knowledge Fabric center baseline seeded.');
end; $$;

create or replace function public.get_organization_knowledge_fabric_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_avg_trust integer;
  v_open_conflicts integer;
begin
  v_org_id := public._kftw597_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._kftw597_seed(v_org_id);

  v_avg_trust := coalesce((
    select round(avg(trust_score)) from public.organization_kftw597_trust_scores where organization_id = v_org_id
  ), 75);
  v_open_conflicts := (select count(*) from public.organization_kftw597_conflicts where organization_id = v_org_id and conflict_status = 'open');

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Information alone is not enough — organizations need trusted knowledge.',
      'privacy_note', 'Metadata-first truth layer — organizations determine authoritative sources.',
      'executive_dashboard', jsonb_build_object(
        'knowledge_health', v_avg_trust,
        'avg_trust_score', v_avg_trust,
        'open_conflicts', v_open_conflicts,
        'pending_reviews', (select count(*) from public.organization_kftw597_reviews where organization_id = v_org_id and review_status = 'scheduled'),
        'decay_signals', (select count(*) from public.organization_kftw597_decay where organization_id = v_org_id),
        'critical_risks', (select count(*) from public.organization_kftw597_trust_scores where organization_id = v_org_id and trust_level in ('review_needed', 'potentially_outdated'))
      ),
      'stats', jsonb_build_object(
        'sources', (select count(*) from public.organization_kftw597_sources where organization_id = v_org_id),
        'knowledge', (select count(*) from public.organization_kftw597_knowledge where organization_id = v_org_id),
        'conflicts', v_open_conflicts,
        'trust_scores', (select count(*) from public.organization_kftw597_trust_scores where organization_id = v_org_id),
        'reviews', (select count(*) from public.organization_kftw597_reviews where organization_id = v_org_id),
        'wisdom_items', (select count(*) from public.organization_kftw597_wisdom where organization_id = v_org_id)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'conflict_title', c.conflict_title, 'recommendation', c.summary
        ) order by c.conflict_type)
        from public.organization_kftw597_conflicts c
        where c.organization_id = v_org_id and c.conflict_status = 'open'
        limit 4
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Trusted knowledge creates wisdom — Companion helps discover, maintain, and protect what is true.',
    'privacy_note', 'Truth engine surfaces conflicts — humans decide authoritative sources.',
    'executive_dashboard', jsonb_build_object(
      'knowledge_health', v_avg_trust,
      'avg_trust_score', v_avg_trust,
      'open_conflicts', v_open_conflicts,
      'pending_reviews', (select count(*) from public.organization_kftw597_reviews where organization_id = v_org_id and review_status = 'scheduled'),
      'decay_signals', (select count(*) from public.organization_kftw597_decay where organization_id = v_org_id),
      'critical_risks', (select count(*) from public.organization_kftw597_trust_scores where organization_id = v_org_id and trust_level in ('review_needed', 'potentially_outdated'))
    ),
    'sources', coalesce((select jsonb_agg(jsonb_build_object(
      'source_key', s.source_key, 'source_title', s.source_title,
      'source_type', s.source_type, 'source_status', s.source_status, 'summary', s.summary
    ) order by s.source_type) from public.organization_kftw597_sources s where s.organization_id = v_org_id), '[]'::jsonb),
    'knowledge', coalesce((select jsonb_agg(jsonb_build_object(
      'knowledge_key', k.knowledge_key, 'knowledge_title', k.knowledge_title,
      'knowledge_type', k.knowledge_type, 'knowledge_status', k.knowledge_status, 'summary', k.summary
    ) order by k.knowledge_type) from public.organization_kftw597_knowledge k where k.organization_id = v_org_id), '[]'::jsonb),
    'conflicts', coalesce((select jsonb_agg(jsonb_build_object(
      'conflict_key', c.conflict_key, 'conflict_title', c.conflict_title,
      'conflict_type', c.conflict_type, 'conflict_status', c.conflict_status, 'summary', c.summary
    ) order by c.conflict_status) from public.organization_kftw597_conflicts c where c.organization_id = v_org_id), '[]'::jsonb),
    'trust_scores', coalesce((select jsonb_agg(jsonb_build_object(
      'trust_key', t.trust_key, 'trust_title', t.trust_title,
      'trust_level', t.trust_level, 'trust_score', t.trust_score, 'summary', t.summary
    ) order by t.trust_score desc) from public.organization_kftw597_trust_scores t where t.organization_id = v_org_id), '[]'::jsonb),
    'reviews', coalesce((select jsonb_agg(jsonb_build_object(
      'review_key', r.review_key, 'review_title', r.review_title,
      'review_cycle', r.review_cycle, 'review_status', r.review_status,
      'due_at', r.due_at, 'summary', r.summary
    ) order by r.due_at nulls last) from public.organization_kftw597_reviews r where r.organization_id = v_org_id), '[]'::jsonb),
    'wisdom_library', coalesce((select jsonb_agg(jsonb_build_object(
      'wisdom_key', w.wisdom_key, 'wisdom_title', w.wisdom_title,
      'wisdom_type', w.wisdom_type, 'wisdom_status', w.wisdom_status, 'summary', w.summary
    ) order by w.wisdom_type) from public.organization_kftw597_wisdom w where w.organization_id = v_org_id), '[]'::jsonb),
    'reliability_metrics', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', m.metric_key, 'metric_title', m.metric_title,
      'metric_type', m.metric_type, 'metric_score', m.metric_score, 'summary', m.summary
    ) order by m.metric_score desc) from public.organization_kftw597_reliability m where m.organization_id = v_org_id), '[]'::jsonb),
    'lineage', coalesce((select jsonb_agg(jsonb_build_object(
      'lineage_key', l.lineage_key, 'lineage_title', l.lineage_title,
      'lineage_stage', l.lineage_stage, 'lineage_status', l.lineage_status, 'summary', l.summary
    ) order by l.lineage_stage) from public.organization_kftw597_lineage l where l.organization_id = v_org_id), '[]'::jsonb),
    'decay_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'decay_key', d.decay_key, 'decay_title', d.decay_title,
      'decay_type', d.decay_type, 'decay_status', d.decay_status,
      'months_since_review', d.months_since_review, 'summary', d.summary
    ) order by d.months_since_review desc nulls last) from public.organization_kftw597_decay d where d.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title,
      'policies_count', p.policies_count, 'knowledge_count', p.knowledge_count,
      'procedures_count', p.procedures_count, 'summary', p.summary
    ) order by p.pack_title) from public.organization_kftw597_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'latest_process', 'What is the latest approved process?',
      'authoritative', 'Which policy is authoritative?',
      'conflicts', 'What knowledge conflicts exist?',
      'review_needed', 'Which documents need review?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_kftw597_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'review_knowledge', true, 'review_trust_scores', true, 'review_conflicts', true,
      'review_ownership', true, 'generate_reports', true
    )
  );
end;
$$;

create or replace function public.get_aipify_companion_truth_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_knowledge_fabric_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Truth Report',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'latest_process',
        'observation', format('%s knowledge item(s) tracked across %s source(s).', v_stats->>'knowledge', v_stats->>'sources'),
        'recommendation', 'Confirm latest approved process is marked authoritative.',
        'href', '/app/knowledge-fabric/knowledge'
      ),
      jsonb_build_object(
        'key', 'conflicts',
        'observation', format('%s open conflict(s) detected.', v_exec->>'open_conflicts'),
        'recommendation', 'Resolve knowledge conflicts before they spread.',
        'href', '/app/knowledge-fabric/conflicts'
      ),
      jsonb_build_object(
        'key', 'review_needed',
        'observation', format('%s decay signal(s) and %s pending review(s).', v_exec->>'decay_signals', v_exec->>'pending_reviews'),
        'recommendation', 'Schedule reviews for documents needing attention.',
        'href', '/app/knowledge-fabric/reviews'
      ),
      jsonb_build_object(
        'key', 'authoritative',
        'observation', format('Average trust score %s — %s critical risk(s).', v_exec->>'avg_trust_score', v_exec->>'critical_risks'),
        'recommendation', 'Designate authoritative sources for conflicting policies.',
        'href', '/app/knowledge-fabric/trust'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_knowledge_fabric_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_knowledge_fabric_center('overview');
end;
$$;

grant execute on function public.get_organization_knowledge_fabric_center(text) to authenticated;
grant execute on function public.get_aipify_companion_truth_advisor_bundle() to authenticated;
grant execute on function public.get_organization_knowledge_fabric_center_mobile_summary() to authenticated;
