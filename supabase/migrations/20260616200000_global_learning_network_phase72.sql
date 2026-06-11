-- Phase 72 — Global Learning Network & Core Evolution Engine

-- ---------------------------------------------------------------------------
-- 1. Tenant participation settings
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_global_learning_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  participation_mode text not null default 'anonymous_insights' check (
    participation_mode in ('none', 'anonymous_insights', 'extended')
  ),
  enabled_categories text[] not null default '{knowledge,support,desktop,action_center,quality,marketplace,industry_blueprints,evolution_lab}',
  extended_consent_at timestamptz,
  extended_consent_by_user_id uuid references public.users (id) on delete set null,
  review_before_submit boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tenant_global_learning_settings enable row level security;
revoke all on public.tenant_global_learning_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Tenant contribution transparency (local view only)
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_global_learning_contributions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null,
  learning_type text not null,
  signal_count int not null default 0,
  last_signal_at timestamptz,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, category, learning_type)
);

create index if not exists tenant_global_learning_contributions_tenant_idx
  on public.tenant_global_learning_contributions (tenant_id, updated_at desc);

alter table public.tenant_global_learning_contributions enable row level security;
revoke all on public.tenant_global_learning_contributions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. global_learning_events (anonymized — no tenant_id)
-- ---------------------------------------------------------------------------
create table if not exists public.global_learning_events (
  id uuid primary key default gen_random_uuid(),
  learning_type text not null,
  category text not null,
  source_module text not null,
  anonymized_payload jsonb not null default '{}'::jsonb,
  confidence_score numeric(5,3) not null default 0.5,
  tenant_participation_mode text not null default 'anonymous_insights',
  created_at timestamptz not null default now()
);

create index if not exists global_learning_events_category_idx
  on public.global_learning_events (category, learning_type, created_at desc);

alter table public.global_learning_events enable row level security;
revoke all on public.global_learning_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. global_learning_patterns
-- ---------------------------------------------------------------------------
create table if not exists public.global_learning_patterns (
  id uuid primary key default gen_random_uuid(),
  pattern_type text not null,
  category text not null,
  frequency int not null default 0,
  trend_direction text not null default 'stable' check (
    trend_direction in ('rising', 'falling', 'stable')
  ),
  confidence numeric(5,3) not null default 0.5,
  status text not null default 'active' check (
    status in ('active', 'review', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pattern_type, category)
);

alter table public.global_learning_patterns enable row level security;
revoke all on public.global_learning_patterns from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. core_evolution_proposals
-- ---------------------------------------------------------------------------
create table if not exists public.core_evolution_proposals (
  id uuid primary key default gen_random_uuid(),
  proposal_type text not null,
  title text not null,
  summary text,
  rationale text,
  expected_value text,
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high')),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'snoozed', 'implemented', 'archived')
  ),
  pattern_id uuid references public.global_learning_patterns (id) on delete set null,
  explainability jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists core_evolution_proposals_status_idx
  on public.core_evolution_proposals (status, created_at desc);

alter table public.core_evolution_proposals enable row level security;
revoke all on public.core_evolution_proposals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. global_learning_feedback (tenant feedback on proposals)
-- ---------------------------------------------------------------------------
create table if not exists public.global_learning_feedback (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.core_evolution_proposals (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  approved_by uuid references public.users (id) on delete set null,
  decision text not null check (
    decision in ('approve', 'reject', 'snooze', 'request_info')
  ),
  rejected_reason text,
  implemented_at timestamptz,
  outcome_score numeric(5,3),
  created_at timestamptz not null default now(),
  unique (proposal_id, tenant_id)
);

alter table public.global_learning_feedback enable row level security;
revoke all on public.global_learning_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. global_learning_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.global_learning_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists global_learning_audit_log_tenant_idx
  on public.global_learning_audit_log (tenant_id, created_at desc);

alter table public.global_learning_audit_log enable row level security;
revoke all on public.global_learning_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers (_glrn_)
-- ---------------------------------------------------------------------------
create or replace function public._glrn_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._glrn_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._glrn_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce((select role from public.users where auth_user_id = auth.uid() limit 1), 'staff')
     not in ('owner', 'admin', 'master_admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._glrn_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_metadata jsonb default '{}'::jsonb, p_user_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.global_learning_audit_log (
    tenant_id, event_type, summary, metadata, actor_user_id
  ) values (
    p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb),
    coalesce(p_user_id, public._glrn_auth_user_id())
  ) returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'global_learning_' || p_event_type, 'global_learning', 'logged', p_user_id, p_metadata
  );
  return v_id;
end; $$;

create or replace function public._glrn_ensure_settings(p_tenant_id uuid)
returns public.tenant_global_learning_settings language plpgsql security definer set search_path = public as $$
declare v_row public.tenant_global_learning_settings;
begin
  insert into public.tenant_global_learning_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.tenant_global_learning_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._glrn_sanitize_payload(p_payload jsonb)
returns jsonb language plpgsql immutable as $$
declare
  v_result jsonb := coalesce(p_payload, '{}'::jsonb);
  v_blocked text[] := array[
    'email', 'phone', 'name', 'customer_name', 'employee_name', 'address',
    'api_key', 'secret', 'password', 'token', 'content', 'message', 'body',
    'conversation', 'document', 'file', 'raw_log', 'payment', 'credit_card'
  ];
  k text;
begin
  foreach k in array v_blocked loop
    v_result := v_result - k;
  end loop;
  return v_result;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Submit anonymized learning signal
-- ---------------------------------------------------------------------------
create or replace function public.submit_global_learning_signal(
  p_learning_type text,
  p_category text,
  p_source_module text,
  p_payload jsonb default '{}'::jsonb,
  p_confidence numeric default 0.5
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.tenant_global_learning_settings;
  v_sanitized jsonb;
  v_policy jsonb;
  v_event_id uuid;
begin
  v_tenant_id := public._glrn_require_tenant();
  v_settings := public._glrn_ensure_settings(v_tenant_id);

  if v_settings.participation_mode = 'none' then
    return jsonb_build_object('status', 'skipped', 'reason', 'participation_disabled');
  end if;

  if not (p_category = any(v_settings.enabled_categories)) then
    return jsonb_build_object('status', 'skipped', 'reason', 'category_disabled');
  end if;

  v_sanitized := public._glrn_sanitize_payload(p_payload);

  v_policy := public.evaluate_policy(jsonb_build_object(
    'action_key', 'global_learning_submit',
    'resource_type', 'global_learning',
    'resource_id', p_category || ':' || p_learning_type,
    'actor_type', 'user',
    'data_classification', 'internal',
    'context', jsonb_build_object('participation_mode', v_settings.participation_mode)
  ));

  if coalesce((v_policy->>'blocked')::boolean, false) or not coalesce((v_policy->>'allow')::boolean, true) then
    return jsonb_build_object('status', 'blocked', 'reason', 'policy_blocked', 'policy', v_policy);
  end if;

  insert into public.global_learning_events (
    learning_type, category, source_module, anonymized_payload,
    confidence_score, tenant_participation_mode
  ) values (
    p_learning_type, p_category, p_source_module, v_sanitized,
    coalesce(p_confidence, 0.5), v_settings.participation_mode
  ) returning id into v_event_id;

  insert into public.tenant_global_learning_contributions (
    tenant_id, category, learning_type, signal_count, last_signal_at, summary
  ) values (
    v_tenant_id, p_category, p_learning_type, 1, now(),
    jsonb_build_object('last_type', p_learning_type, 'anonymized', true)
  )
  on conflict (tenant_id, category, learning_type) do update set
    signal_count = tenant_global_learning_contributions.signal_count + 1,
    last_signal_at = now(),
    updated_at = now();

  perform public._glrn_log_audit(v_tenant_id, 'event_created',
    'Anonymized learning signal submitted', jsonb_build_object(
      'event_id', v_event_id, 'category', p_category, 'learning_type', p_learning_type
    ));

  return jsonb_build_object('status', 'accepted', 'event_id', v_event_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Aggregate patterns & generate proposals
-- ---------------------------------------------------------------------------
create or replace function public.aggregate_global_learning_patterns()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_count int := 0;
begin
  insert into public.global_learning_patterns (pattern_type, category, frequency, confidence, metadata)
  select
    e.learning_type,
    e.category,
    count(*)::int,
    least(0.95, 0.4 + (count(*)::numeric / 100)),
    jsonb_build_object('source_modules', jsonb_agg(distinct e.source_module))
  from public.global_learning_events e
  where e.created_at > now() - interval '90 days'
  group by e.learning_type, e.category
  on conflict (pattern_type, category) do update set
    frequency = excluded.frequency,
    confidence = excluded.confidence,
    metadata = excluded.metadata,
    trend_direction = case
      when excluded.frequency > global_learning_patterns.frequency then 'rising'
      when excluded.frequency < global_learning_patterns.frequency then 'falling'
      else 'stable'
    end,
    updated_at = now();

  get diagnostics v_count = row_count;
  return jsonb_build_object('patterns_updated', v_count);
end; $$;

create or replace function public.generate_core_evolution_proposals()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_pat public.global_learning_patterns;
  v_created int := 0;
begin
  perform public.aggregate_global_learning_patterns();

  for v_pat in
    select * from public.global_learning_patterns
    where status = 'active' and frequency >= 3
    order by frequency desc
    limit 20
  loop
    if not exists(
      select 1 from public.core_evolution_proposals
      where pattern_id = v_pat.id and status in ('pending', 'approved', 'snoozed')
    ) then
      insert into public.core_evolution_proposals (
        proposal_type, title, summary, rationale, expected_value, risk_level,
        pattern_id, explainability
      ) values (
        v_pat.category || '_improvement',
        'Improve ' || replace(v_pat.category, '_', ' ') || ' based on global pattern',
        'Pattern detected across anonymous deployments: ' || v_pat.pattern_type,
        v_pat.frequency || ' anonymized signals in category ' || v_pat.category,
        'Improved defaults and templates for all customers',
        case when v_pat.confidence >= 0.8 then 'low' when v_pat.confidence >= 0.6 then 'medium' else 'high' end,
        v_pat.id,
        jsonb_build_object(
          'pattern_detected', v_pat.pattern_type,
          'why_it_matters', 'Repeated anonymous outcome pattern',
          'confidence', v_pat.confidence,
          'expected_outcome', 'Better Core defaults',
          'potential_risks', 'Requires review before implementation',
          'recommended_action', 'Review and approve for Core template update'
        )
      );
      v_created := v_created + 1;
    end if;
  end loop;

  return jsonb_build_object('proposals_created', v_created);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Seed initial patterns and proposals
-- ---------------------------------------------------------------------------
create or replace function public._glrn_seed_core_data()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.global_learning_patterns (pattern_type, category, frequency, trend_direction, confidence, metadata)
  values
    ('faq_reduces_support_load', 'knowledge', 42, 'rising', 0.82,
     '{"signal":"FAQ articles about shipping reduce support load"}'::jsonb),
    ('booking_faq_modified', 'industry_blueprints', 38, 'rising', 0.78,
     '{"blueprint":"restaurant","signal":"Booking FAQ modified in deployments"}'::jsonb),
    ('alert_dismissal_high', 'desktop', 81, 'stable', 0.85,
     '{"alert_type":"reminder","signal":"Alert ignored by majority of organizations"}'::jsonb),
    ('shipping_knowledge_gap', 'support', 55, 'rising', 0.76,
     '{"signal":"Repeated Knowledge Gaps in shipping category"}'::jsonb),
    ('pack_high_adoption', 'marketplace', 29, 'rising', 0.71,
     '{"pack_type":"support_starter","signal":"High adoption with low uninstall rate"}'::jsonb)
  on conflict (pattern_type, category) do update set
    frequency = excluded.frequency, confidence = excluded.confidence, updated_at = now();

  insert into public.core_evolution_proposals (
    proposal_type, title, summary, rationale, expected_value, risk_level, pattern_id, explainability, status
  )
  select
    'blueprint_update', 'Update Restaurant Blueprint',
    'Booking FAQ frequently modified after deployment.',
    'Booking FAQ modified in 78% of restaurant deployments (anonymized aggregate).',
    'Reduced setup friction for hospitality customers.',
    'low', p.id,
    jsonb_build_object(
      'pattern_detected', 'booking_faq_modified',
      'why_it_matters', 'Restaurants repeatedly customize the same FAQ section',
      'confidence', 0.78,
      'expected_outcome', 'Pre-seeded booking FAQ in Restaurant Blueprint',
      'potential_risks', 'Template may not fit all booking systems',
      'recommended_action', 'Approve blueprint manifest update'
    ),
    'pending'
  from public.global_learning_patterns p
  where p.pattern_type = 'booking_faq_modified'
  and not exists (select 1 from public.core_evolution_proposals where title = 'Update Restaurant Blueprint');

  insert into public.core_evolution_proposals (
    proposal_type, title, summary, rationale, expected_value, risk_level, pattern_id, explainability, status
  )
  select
    'desktop_default', 'Reduce Desktop Alert Frequency',
    'Certain alert types are dismissed by most users.',
    'Alert type dismissed in 81% of anonymized feedback signals.',
    'Lower notification fatigue across deployments.',
    'medium', p.id,
    jsonb_build_object(
      'pattern_detected', 'alert_dismissal_high',
      'why_it_matters', 'High dismissal rate indicates alert noise',
      'confidence', 0.85,
      'expected_outcome', 'Balanced desktop mode as safer default',
      'potential_risks', 'Critical alerts must remain visible',
      'recommended_action', 'Adjust default desktop notification thresholds'
    ),
    'pending'
  from public.global_learning_patterns p
  where p.pattern_type = 'alert_dismissal_high'
  and not exists (select 1 from public.core_evolution_proposals where title = 'Reduce Desktop Alert Frequency');

  insert into public.core_evolution_proposals (
    proposal_type, title, summary, rationale, expected_value, risk_level, pattern_id, explainability, status
  )
  select
    'knowledge_template', 'Expand Shipping FAQ Template',
    'Shipping category generates repeated Knowledge Gaps.',
    'Repeated anonymized Knowledge Gap pattern in shipping category.',
    'Improved Support accuracy and fewer escalations.',
    'low', p.id,
    jsonb_build_object(
      'pattern_detected', 'shipping_knowledge_gap',
      'why_it_matters', 'Common documentation gap across industries',
      'confidence', 0.76,
      'expected_outcome', 'Richer shipping FAQ starter template',
      'potential_risks', 'Regional shipping rules vary',
      'recommended_action', 'Approve Knowledge Center template expansion'
    ),
    'pending'
  from public.global_learning_patterns p
  where p.pattern_type = 'shipping_knowledge_gap'
  and not exists (select 1 from public.core_evolution_proposals where title = 'Expand Shipping FAQ Template');
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Read / settings APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_global_learning_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.tenant_global_learning_settings; v_contrib int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._glrn_ensure_settings(v_tenant_id);
  select coalesce(sum(signal_count), 0) into v_contrib
  from public.tenant_global_learning_contributions where tenant_id = v_tenant_id;
  return jsonb_build_object(
    'has_customer', true,
    'participation_mode', v_settings.participation_mode,
    'contribution_count', v_contrib,
    'philosophy', 'Aipify learns from patterns — never from customer secrets.',
    'privacy_note', 'Only anonymized, structured signals contribute to Global Learning.'
  );
end; $$;

create or replace function public.get_global_learning_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.tenant_global_learning_settings;
  v_contributions jsonb;
  v_intelligence jsonb;
begin
  v_tenant_id := public._glrn_require_tenant();
  perform public._glrn_seed_core_data();
  v_settings := public._glrn_ensure_settings(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'category', c.category, 'learning_type', c.learning_type,
    'signal_count', c.signal_count, 'last_signal_at', c.last_signal_at
  ) order by c.last_signal_at desc nulls last), '[]'::jsonb) into v_contributions
  from public.tenant_global_learning_contributions c
  where c.tenant_id = v_tenant_id;

  v_intelligence := jsonb_build_object(
    'local', 'Customer-specific learning within tenant boundaries (Learning Engine, Memory).',
    'organizational', 'Cross-team insights within your organization (Insights, Friction Intelligence).',
    'global', 'Anonymous pattern-based improvements to Aipify Core (opt-in participation).'
  );

  return jsonb_build_object(
    'has_customer', true,
    'settings', row_to_json(v_settings)::jsonb,
    'contributions', v_contributions,
    'intelligence_levels', v_intelligence,
    'total_contributions', coalesce((
      select sum(signal_count) from public.tenant_global_learning_contributions where tenant_id = v_tenant_id
    ), 0),
    'pending_proposals', (select count(*) from public.core_evolution_proposals where status = 'pending')
  );
end; $$;

create or replace function public.get_global_learning_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.tenant_global_learning_settings;
begin
  v_tenant_id := public._glrn_require_tenant();
  v_settings := public._glrn_ensure_settings(v_tenant_id);
  return row_to_json(v_settings)::jsonb;
end; $$;

create or replace function public.update_global_learning_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_mode text;
begin
  v_tenant_id := public._glrn_require_tenant();
  v_user_id := public._glrn_auth_user_id();
  perform public._glrn_require_admin();
  perform public._glrn_ensure_settings(v_tenant_id);

  v_mode := coalesce(p_patch->>'participation_mode', 'anonymous_insights');

  update public.tenant_global_learning_settings set
    participation_mode = v_mode,
    enabled_categories = coalesce(
      (select array_agg(x) from jsonb_array_elements_text(p_patch->'enabled_categories') x),
      enabled_categories
    ),
    review_before_submit = coalesce((p_patch->>'review_before_submit')::boolean, review_before_submit),
    extended_consent_at = case
      when v_mode = 'extended' and extended_consent_at is null then now()
      when v_mode <> 'extended' then null
      else extended_consent_at
    end,
    extended_consent_by_user_id = case
      when v_mode = 'extended' then v_user_id
      else null
    end,
    updated_at = now()
  where tenant_id = v_tenant_id;

  perform public._glrn_log_audit(v_tenant_id, 'settings_updated', 'Global learning settings updated', p_patch, v_user_id);
  return public.get_global_learning_settings();
end; $$;

create or replace function public.export_global_learning_contribution_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._glrn_require_tenant();
  perform public._glrn_require_admin();
  return jsonb_build_object(
    'exported_at', now(),
    'participation_mode', (select participation_mode from public.tenant_global_learning_settings where tenant_id = v_tenant_id),
    'contributions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'category', category, 'learning_type', learning_type,
        'signal_count', signal_count, 'last_signal_at', last_signal_at
      ))
      from public.tenant_global_learning_contributions where tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'note', 'Summary contains counts and categories only — no raw customer content.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Evolution board
-- ---------------------------------------------------------------------------
create or replace function public.get_evolution_board()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_proposals jsonb;
  v_patterns jsonb;
begin
  v_tenant_id := public._glrn_require_tenant();
  perform public._glrn_seed_core_data();

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'proposal_type', p.proposal_type, 'title', p.title,
    'summary', p.summary, 'rationale', p.rationale, 'expected_value', p.expected_value,
    'risk_level', p.risk_level, 'status', p.status, 'explainability', p.explainability,
    'tenant_feedback', (
      select row_to_json(f)::jsonb from public.global_learning_feedback f
      where f.proposal_id = p.id and f.tenant_id = v_tenant_id
    )
  ) order by p.created_at desc), '[]'::jsonb) into v_proposals
  from public.core_evolution_proposals p
  where p.status in ('pending', 'approved', 'snoozed');

  select coalesce(jsonb_agg(row_to_json(gp)::jsonb order by gp.frequency desc), '[]'::jsonb) into v_patterns
  from public.global_learning_patterns gp
  where gp.status = 'active'
  limit 10;

  return jsonb_build_object(
    'has_customer', true,
    'proposals', v_proposals,
    'trend_summaries', v_patterns,
    'philosophy', 'Core Evolution transforms anonymous patterns into governed Core improvements.'
  );
end; $$;

create or replace function public.update_core_evolution_proposal(
  p_proposal_id uuid, p_decision text, p_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._glrn_require_tenant();
  v_user_id := public._glrn_auth_user_id();
  perform public._glrn_require_admin();

  if p_decision not in ('approve', 'reject', 'snooze', 'request_info') then
    raise exception 'Invalid decision';
  end if;

  insert into public.global_learning_feedback (
    proposal_id, tenant_id, approved_by, decision, rejected_reason
  ) values (
    p_proposal_id, v_tenant_id, v_user_id, p_decision, p_reason
  )
  on conflict (proposal_id, tenant_id) do update set
    approved_by = v_user_id,
    decision = p_decision,
    rejected_reason = p_reason,
    created_at = now();

  perform public._glrn_log_audit(v_tenant_id, 'proposal_feedback',
    'Evolution proposal feedback: ' || p_decision,
    jsonb_build_object('proposal_id', p_proposal_id, 'decision', p_decision), v_user_id);

  return jsonb_build_object('updated', true, 'decision', p_decision);
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Collect signals from local learning (worker hook)
-- ---------------------------------------------------------------------------
create or replace function public.collect_global_learning_signals()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.tenant_global_learning_settings;
  v_count int := 0;
  v_row record;
begin
  v_tenant_id := public._glrn_require_tenant();
  v_settings := public._glrn_ensure_settings(v_tenant_id);
  if v_settings.participation_mode = 'none' then
    return jsonb_build_object('collected', 0, 'reason', 'participation_disabled');
  end if;

  for v_row in
    select event_type, source_module, count(*) as cnt
    from public.learning_events
    where tenant_id = v_tenant_id and created_at > now() - interval '7 days'
    group by event_type, source_module
    limit 20
  loop
    perform public.submit_global_learning_signal(
      v_row.event_type,
      case
        when v_row.source_module ilike '%support%' then 'support'
        when v_row.source_module ilike '%quality%' then 'quality'
        when v_row.source_module ilike '%desktop%' then 'desktop'
        when v_row.source_module ilike '%marketplace%' then 'marketplace'
        else 'knowledge'
      end,
      v_row.source_module,
      jsonb_build_object('outcome_type', v_row.event_type, 'frequency', v_row.cnt),
      least(0.9, 0.5 + v_row.cnt::numeric / 50)
    );
    v_count := v_count + 1;
  end loop;

  return jsonb_build_object('collected', v_count);
end; $$;

-- ---------------------------------------------------------------------------
-- 15. KC category + seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-learning', 'Global Learning & Core Evolution', 'Privacy-safe global learning and Core evolution guides.', 'authenticated', 16
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'global-learning' and tenant_id is null);

select public._glrn_seed_core_data();

-- ---------------------------------------------------------------------------
-- 16. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.submit_global_learning_signal(text, text, text, jsonb, numeric) to authenticated;
grant execute on function public.get_global_learning_card() to authenticated;
grant execute on function public.get_global_learning_dashboard() to authenticated;
grant execute on function public.get_global_learning_settings() to authenticated;
grant execute on function public.update_global_learning_settings(jsonb) to authenticated;
grant execute on function public.export_global_learning_contribution_summary() to authenticated;
grant execute on function public.get_evolution_board() to authenticated;
grant execute on function public.update_core_evolution_proposal(uuid, text, text) to authenticated;
grant execute on function public.collect_global_learning_signals() to authenticated;
grant execute on function public.aggregate_global_learning_patterns() to authenticated;
grant execute on function public.generate_core_evolution_proposals() to authenticated;
