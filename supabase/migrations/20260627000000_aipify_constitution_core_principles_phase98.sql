-- Phase 98 — Aipify Constitution & Core Principles
-- Principle: Technology guided by principles.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution'
  )
);

-- ---------------------------------------------------------------------------
-- 1. constitution_settings
-- ---------------------------------------------------------------------------
create table if not exists public.constitution_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  constitution_enabled boolean not null default true,
  acknowledgement_required boolean not null default true,
  partner_alignment_tracking boolean not null default true,
  review_cycle_months int not null default 12,
  current_version text not null default '1.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.constitution_settings enable row level security;
revoke all on public.constitution_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. constitution_versions + core_principles
-- ---------------------------------------------------------------------------
create table if not exists public.constitution_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  version_label text not null,
  title text not null,
  preamble text not null,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  effective_at timestamptz not null default now(),
  unique (tenant_id, version_label)
);

alter table public.constitution_versions enable row level security;
revoke all on public.constitution_versions from authenticated, anon;

create table if not exists public.constitution_core_principles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  version_id uuid references public.constitution_versions (id) on delete cascade,
  principle_key text not null,
  principle_number int not null,
  title text not null,
  description text not null,
  category text not null default 'core' check (
    category in ('core', 'responsible_ai', 'customer_commitment', 'partner_expectation')
  ),
  sort_order int not null default 0,
  unique (tenant_id, principle_key)
);

alter table public.constitution_core_principles enable row level security;
revoke all on public.constitution_core_principles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. reviews, feedback, commitments, partner alignment
-- ---------------------------------------------------------------------------
create table if not exists public.constitution_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_type text not null check (
    review_type in ('annual', 'leadership', 'stakeholder', 'amendment', 'compliance')
  ),
  title text not null,
  summary text,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'deferred')
  ),
  alignment_score numeric(5, 2),
  scheduled_at timestamptz,
  completed_at timestamptz
);

alter table public.constitution_reviews enable row level security;
revoke all on public.constitution_reviews from authenticated, anon;

create table if not exists public.constitution_stakeholder_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_id uuid references public.constitution_reviews (id) on delete set null,
  feedback_summary text not null,
  stakeholder_type text not null default 'customer' check (
    stakeholder_type in ('customer', 'employee', 'partner', 'executive', 'community')
  ),
  created_at timestamptz not null default now()
);

alter table public.constitution_stakeholder_feedback enable row level security;
revoke all on public.constitution_stakeholder_feedback from authenticated, anon;

create table if not exists public.constitution_commitment_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  commitment_key text not null,
  title text not null,
  description text not null,
  commitment_type text not null check (
    commitment_type in ('customer', 'responsible_ai', 'employee_partner', 'governance')
  ),
  status text not null default 'active' check (status in ('active', 'reviewed', 'updated')),
  unique (tenant_id, commitment_key)
);

alter table public.constitution_commitment_records enable row level security;
revoke all on public.constitution_commitment_records from authenticated, anon;

create table if not exists public.constitution_partner_alignment_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partner_name text not null,
  alignment_status text not null default 'aligned' check (
    alignment_status in ('aligned', 'review_due', 'needs_attention', 'pending')
  ),
  alignment_score numeric(5, 2) not null default 0 check (alignment_score between 0 and 100),
  notes text,
  reviewed_at timestamptz
);

alter table public.constitution_partner_alignment_reviews enable row level security;
revoke all on public.constitution_partner_alignment_reviews from authenticated, anon;

create table if not exists public.constitution_governance_decisions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  decision_key text not null,
  title text not null,
  summary text not null,
  principles_applied text[] not null default '{}',
  decision_area text not null check (
    decision_area in ('product', 'strategy', 'partnership', 'innovation', 'commercial', 'community')
  ),
  created_at timestamptz not null default now(),
  unique (tenant_id, decision_key)
);

alter table public.constitution_governance_decisions enable row level security;
revoke all on public.constitution_governance_decisions from authenticated, anon;

create table if not exists public.constitution_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  principle_id uuid references public.constitution_core_principles (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  acknowledged_at timestamptz not null default now(),
  unique (tenant_id, principle_id, user_id)
);

alter table public.constitution_acknowledgements enable row level security;
revoke all on public.constitution_acknowledgements from authenticated, anon;

create table if not exists public.constitution_principle_updates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  principle_id uuid references public.constitution_core_principles (id) on delete set null,
  update_summary text not null,
  update_type text not null default 'clarification' check (
    update_type in ('clarification', 'expansion', 'historical_note')
  ),
  created_at timestamptz not null default now()
);

alter table public.constitution_principle_updates enable row level security;
revoke all on public.constitution_principle_updates from authenticated, anon;

create table if not exists public.constitution_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.constitution_briefings enable row level security;
revoke all on public.constitution_briefings from authenticated, anon;

create table if not exists public.constitution_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.constitution_audit_log enable row level security;
revoke all on public.constitution_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers (_aco_)
-- ---------------------------------------------------------------------------
create or replace function public._aco_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._aco_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._aco_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.constitution_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'aipify_constitution_' || p_event_type, 'aipify_constitution', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._aco_ensure_settings(p_tenant_id uuid)
returns public.constitution_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.constitution_settings;
begin
  insert into public.constitution_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.constitution_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._aco_seed_version(p_tenant_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_version_id uuid;
begin
  insert into public.constitution_versions (tenant_id, version_label, title, preamble, status)
  select p_tenant_id, '1.0', 'Aipify Constitution', 'Technology guided by principles. Aipify remains accountable to the people, organizations and communities it serves.', 'active'
  where not exists (select 1 from public.constitution_versions v where v.tenant_id = p_tenant_id and v.version_label = '1.0')
  returning id into v_version_id;

  if v_version_id is null then
    select id into v_version_id from public.constitution_versions where tenant_id = p_tenant_id and version_label = '1.0';
  end if;

  return v_version_id;
end; $$;

create or replace function public._aco_seed_principles(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_version_id uuid;
begin
  v_version_id := public._aco_seed_version(p_tenant_id);

  insert into public.constitution_core_principles (tenant_id, version_id, principle_key, principle_number, title, description, category, sort_order)
  select p_tenant_id, v_version_id, v.key, v.num, v.title, v.desc, 'core', v.num
  from (values
    ('humans_responsible', 1, 'Humans Remain Responsible', 'Aipify exists to assist people. It shall support human judgment rather than replace it. Organizations remain accountable for their decisions.'),
    ('trust_earned', 2, 'Trust Must Be Earned', 'Trust is built through transparency, consistency and reliability. Aipify shall strive to justify the confidence placed in it every day.'),
    ('clarity_over_complexity', 3, 'Clarity Over Complexity', 'Aipify shall seek simplicity. Complexity shall only be introduced when necessary. Experiences should remain understandable and accessible.'),
    ('privacy_respect', 4, 'Privacy Deserves Respect', 'Organizations retain ownership of their information. Aipify shall support responsible handling of data throughout the platform lifecycle.'),
    ('security_fundamental', 5, 'Security Is Fundamental', 'Security is not optional. Protecting systems, information and operations shall remain a foundational responsibility.'),
    ('transparency_trust', 6, 'Transparency Enables Trust', 'Users should understand what Aipify is doing, why recommendations are made, and how important decisions occur.'),
    ('innovation_responsibility', 7, 'Innovation Requires Responsibility', 'New capabilities shall be evaluated thoughtfully. Progress should occur with awareness of potential impacts and consequences.'),
    ('people_matter', 8, 'People Matter Most', 'Technology should empower people. Aipify shall seek to reduce friction, increase confidence and improve outcomes.'),
    ('local_context', 9, 'Local Context Matters', 'Global platforms should respect local realities. Language, culture and regional considerations deserve thoughtful attention.'),
    ('learning_never_ends', 10, 'Learning Never Ends', 'Organizations evolve. People evolve. Technology evolves. Aipify shall support continuous learning and adaptation.'),
    ('partnership_strength', 11, 'Partnership Creates Strength', 'Meaningful progress occurs through collaboration. Customers, partners and communities contribute to ecosystem growth.'),
    ('long_term_thinking', 12, 'Long-Term Thinking Matters', 'Short-term gains should not undermine long-term sustainability. Aipify shall seek enduring value creation.')
  ) as v(key, num, title, desc)
  where not exists (select 1 from public.constitution_core_principles p where p.tenant_id = p_tenant_id and p.principle_key = v.key);

  insert into public.constitution_core_principles (tenant_id, version_id, principle_key, principle_number, title, description, category, sort_order)
  select p_tenant_id, v_version_id, v.key, v.num, v.title, v.desc, v.cat, v.num
  from (values
    ('ai_fairness', 13, 'Promote Fairness', 'Aipify shall strive to promote fairness in AI-assisted experiences.', 'responsible_ai'),
    ('ai_accountability', 14, 'Encourage Accountability', 'Aipify shall support accountability and enable human oversight.', 'responsible_ai'),
    ('ai_transparency', 15, 'Support Transparency', 'Explainability shall be prioritized where appropriate.', 'responsible_ai'),
    ('customer_improvement', 16, 'Continuous Improvement', 'Aipify commits to continuous improvement and honest communication.', 'customer_commitment'),
    ('partner_integrity', 17, 'Demonstrate Integrity', 'Partners shall demonstrate integrity and respect confidentiality.', 'partner_expectation')
  ) as v(key, num, title, desc, cat)
  where not exists (select 1 from public.constitution_core_principles p where p.tenant_id = p_tenant_id and p.principle_key = v.key);
end; $$;

create or replace function public._aco_seed_commitments(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.constitution_commitment_records (tenant_id, commitment_key, title, description, commitment_type)
  select p_tenant_id, v.key, v.title, v.desc, v.type
  from (values
    ('continuous_improvement', 'Continuous Improvement', 'Aipify commits to ongoing platform improvement.', 'customer'),
    ('honest_communication', 'Honest Communication', 'Clear, professional and respectful communication.', 'customer'),
    ('responsible_innovation', 'Thoughtful Innovation', 'Innovation evaluated with awareness of impacts.', 'customer'),
    ('ai_oversight', 'Enable Oversight', 'Human approval principles remain in place.', 'responsible_ai'),
    ('reduce_harm', 'Reduce Avoidable Harm', 'Strive to reduce avoidable harm and foster trust.', 'responsible_ai'),
    ('partner_success', 'Prioritize Customer Success', 'Partners prioritize customer success and responsible practices.', 'employee_partner')
  ) as v(key, title, desc, type)
  where not exists (select 1 from public.constitution_commitment_records c where c.tenant_id = p_tenant_id and c.commitment_key = v.key);
end; $$;

create or replace function public._aco_seed_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.constitution_reviews (tenant_id, review_type, title, summary, status, alignment_score, scheduled_at, completed_at)
  select p_tenant_id, v.type, v.title, v.summary, v.status, v.score, v.sched, v.completed
  from (values
    ('annual', 'Annual Constitution Review', 'Leadership review of constitutional alignment across the platform.', 'scheduled', null::numeric, now() + interval '90 days', null::timestamptz),
    ('leadership', 'Q1 Leadership Alignment', 'Executive review of principle adherence in product decisions.', 'completed', 94.0, now() - interval '60 days', now() - interval '30 days'),
    ('stakeholder', 'Customer Advisory Feedback', 'Stakeholder feedback on transparency and trust principles.', 'completed', 91.0, now() - interval '45 days', now() - interval '15 days')
  ) as v(type, title, summary, status, score, sched, completed)
  where not exists (select 1 from public.constitution_reviews r where r.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._aco_seed_partner_alignment(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.constitution_partner_alignment_reviews (tenant_id, partner_name, alignment_status, alignment_score, notes, reviewed_at)
  select p_tenant_id, v.name, v.status, v.score, v.notes, now() - interval '14 days'
  from (values
    ('Nordic Implementation Partners', 'aligned', 96.0, 'Strong alignment with human oversight and privacy principles.'),
    ('Global Advisory Network', 'review_due', 88.0, 'Annual alignment review scheduled.'),
    ('Certified Reseller — DACH', 'aligned', 92.0, 'Partner certification includes constitutional alignment.')
  ) as v(name, status, score, notes)
  where not exists (select 1 from public.constitution_partner_alignment_reviews p where p.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._aco_seed_governance_decisions(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.constitution_governance_decisions (tenant_id, decision_key, title, summary, principles_applied, decision_area)
  select p_tenant_id, v.key, v.title, v.summary, v.principles, v.area
  from (values
    ('product_transparency', 'Explainability in Recommendations', 'All high-impact recommendations include decision explanations.', array['transparency_trust', 'humans_responsible'], 'product'),
    ('partner_onboarding', 'Partner Constitutional Alignment', 'New partners must acknowledge core principles during certification.', array['partnership_strength', 'trust_earned'], 'partnership'),
    ('innovation_governance', 'Sandbox-First Innovation', 'New capabilities tested in controlled environments before rollout.', array['innovation_responsibility', 'security_fundamental'], 'innovation')
  ) as v(key, title, summary, principles, area)
  where not exists (select 1 from public.constitution_governance_decisions d where d.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._aco_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_principles int;
  v_acknowledged int;
  v_alignment numeric;
  v_constitution_score numeric;
begin
  select count(*) into v_principles from public.constitution_core_principles where tenant_id = p_tenant_id;
  select count(distinct principle_id) into v_acknowledged from public.constitution_acknowledgements where tenant_id = p_tenant_id;

  select coalesce(avg(alignment_score), 92.0) into v_alignment
  from public.constitution_reviews where tenant_id = p_tenant_id and status = 'completed';

  v_constitution_score := least(100, round(
    v_alignment * 0.5 +
    coalesce(100.0 * v_acknowledged / nullif(v_principles, 0), 0) * 0.3 +
    10, 1
  ));

  return jsonb_build_object(
    'constitution_score', v_constitution_score,
    'principles_count', v_principles,
    'principles_acknowledged', v_acknowledged,
    'alignment_score', round(v_alignment, 1),
    'partner_alignment_avg', (
      select coalesce(round(avg(alignment_score), 1), 0)
      from public.constitution_partner_alignment_reviews where tenant_id = p_tenant_id
    )
  );
end; $$;

create or replace function public._aco_trust_explanation(p_tenant_id uuid, p_score numeric)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.generate_decision_explanation(
    'aco-score-' || p_tenant_id::text,
    'aipify_constitution',
    'aipify_constitution',
    'Constitutional alignment: ' || p_score || '/100',
    'Principles matter most when circumstances become difficult. Values provide direction.',
    jsonb_build_array(
      jsonb_build_object('source', 'core_principles'),
      jsonb_build_object('source', 'governance_decisions'),
      jsonb_build_object('source', 'partner_alignment')
    ),
    jsonb_build_array('human_oversight', 'transparency', 'audit_logged'),
    'high', '[]'::jsonb, '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.acknowledge_constitution_principle(p_principle_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._aco_require_tenant();
  v_user_id := public._aco_auth_user_id();
  insert into public.constitution_acknowledgements (tenant_id, principle_id, user_id)
  values (v_tenant_id, p_principle_id, v_user_id)
  on conflict (tenant_id, principle_id, user_id) do nothing;
  perform public._aco_log_audit(v_tenant_id, 'principle_acknowledged', 'Constitution principle acknowledged', 'acknowledgement',
    jsonb_build_object('principle_id', p_principle_id));
  return jsonb_build_object('status', 'acknowledged');
end; $$;

create or replace function public.complete_constitution_review(p_review_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._aco_require_tenant();
  update public.constitution_reviews
  set status = 'completed', completed_at = now(), alignment_score = coalesce(alignment_score, 90.0)
  where id = p_review_id and tenant_id = v_tenant_id;
  perform public._aco_log_audit(v_tenant_id, 'review_completed', 'Constitution review completed', 'constitutional_governance',
    jsonb_build_object('review_id', p_review_id));
  return jsonb_build_object('status', 'completed');
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_aipify_constitution_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_metrics jsonb;
  v_id uuid;
  v_summary text;
begin
  v_tenant_id := public._aco_require_tenant();
  perform public._aco_ensure_settings(v_tenant_id);
  perform public._aco_seed_principles(v_tenant_id);
  v_metrics := public._aco_refresh_metrics(v_tenant_id);

  v_summary := 'Constitution briefing: alignment ' || (v_metrics->>'constitution_score') || '/100, '
    || (v_metrics->>'principles_count') || ' principles, '
    || (v_metrics->>'principles_acknowledged') || ' acknowledged.';

  insert into public.constitution_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics)
  returning id into v_id;

  perform public._aco_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_reporting', v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_aipify_constitution_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_settings public.constitution_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._aco_ensure_settings(v_tenant_id);
  perform public._aco_seed_principles(v_tenant_id);
  v_metrics := public._aco_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'constitution_score', v_metrics->'constitution_score',
    'principles_count', v_metrics->'principles_count',
    'current_version', v_settings.current_version,
    'philosophy', 'Technology guided by principles.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_aipify_constitution_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.constitution_settings;
  v_version public.constitution_versions;
  v_metrics jsonb;
  v_user_id uuid;
begin
  v_tenant_id := public._aco_require_tenant();
  v_user_id := public._aco_auth_user_id();
  v_settings := public._aco_ensure_settings(v_tenant_id);
  perform public._aco_seed_principles(v_tenant_id);
  perform public._aco_seed_commitments(v_tenant_id);
  perform public._aco_seed_reviews(v_tenant_id);
  perform public._aco_seed_partner_alignment(v_tenant_id);
  perform public._aco_seed_governance_decisions(v_tenant_id);
  v_metrics := public._aco_refresh_metrics(v_tenant_id);
  perform public._aco_trust_explanation(v_tenant_id, (v_metrics->>'constitution_score')::numeric);

  select * into v_version from public.constitution_versions
  where tenant_id = v_tenant_id and version_label = v_settings.current_version limit 1;

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Technology guided by principles.',
    'safety_note', 'The Constitution complements applicable laws and regulations — it does not replace legal requirements.',
    'constitution_enabled', v_settings.constitution_enabled,
    'acknowledgement_required', v_settings.acknowledgement_required,
    'partner_alignment_tracking', v_settings.partner_alignment_tracking,
    'current_version', v_settings.current_version,
    'review_cycle_months', v_settings.review_cycle_months,
    'constitution_score', v_metrics->'constitution_score',
    'principles_count', v_metrics->'principles_count',
    'principles_acknowledged', v_metrics->'principles_acknowledged',
    'alignment_score', v_metrics->'alignment_score',
    'partner_alignment_avg', v_metrics->'partner_alignment_avg',
    'preamble', coalesce(v_version.preamble, 'Aipify remains accountable to the people, organizations and communities it serves.'),
    'decision_framework', jsonb_build_array(
      'Customer impact', 'Employee impact', 'Security implications',
      'Privacy implications', 'Ethical considerations', 'Strategic alignment', 'Long-term consequences'
    ),
    'core_principles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'principle_key', p.principle_key, 'principle_number', p.principle_number,
        'title', p.title, 'description', p.description, 'category', p.category,
        'acknowledged', exists(
          select 1 from public.constitution_acknowledgements a
          where a.principle_id = p.id and a.tenant_id = v_tenant_id
            and (a.user_id = v_user_id or a.user_id is null)
        )
      ) order by p.sort_order)
      from public.constitution_core_principles p
      where p.tenant_id = v_tenant_id and p.category = 'core'
    ), '[]'::jsonb),
    'responsible_ai_commitments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'principle_key', p.principle_key, 'title', p.title, 'description', p.description
      ) order by p.sort_order)
      from public.constitution_core_principles p
      where p.tenant_id = v_tenant_id and p.category = 'responsible_ai'
    ), '[]'::jsonb),
    'commitment_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.title, 'description', c.description,
        'commitment_type', c.commitment_type, 'status', c.status
      ))
      from public.constitution_commitment_records c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'constitutional_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_type', r.review_type, 'title', r.title,
        'summary', r.summary, 'status', r.status,
        'alignment_score', r.alignment_score, 'scheduled_at', r.scheduled_at
      ) order by r.scheduled_at asc nulls last)
      from public.constitution_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'partner_alignment', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'partner_name', p.partner_name, 'alignment_status', p.alignment_status,
        'alignment_score', p.alignment_score, 'notes', p.notes
      ))
      from public.constitution_partner_alignment_reviews p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'governance_decisions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'title', d.title, 'summary', d.summary,
        'principles_applied', d.principles_applied, 'decision_area', d.decision_area
      ))
      from public.constitution_governance_decisions d where d.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'review_process', jsonb_build_array(
      'Leadership consideration', 'Stakeholder feedback',
      'Documentation updates', 'Historical preservation'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.constitution_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'governance', 'Constitutional guidance for governance decisions',
      'knowledge_center', 'Principle documentation and FAQ',
      'partners', 'Partner alignment reviews',
      'academy', 'Principle education paths',
      'innovation_lab', 'Responsible innovation evaluation'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-constitution', 'Aipify Constitution', 'The principles that shape how Aipify operates and evolves.', 'authenticated', 42
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-constitution' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_aipify_constitution_card() to authenticated;
grant execute on function public.get_aipify_constitution_dashboard() to authenticated;
grant execute on function public.generate_aipify_constitution_briefing() to authenticated;
grant execute on function public.acknowledge_constitution_principle(uuid) to authenticated;
grant execute on function public.complete_constitution_review(uuid) to authenticated;
