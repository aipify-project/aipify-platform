-- Phase 546 — Self-Improvement, Adoption & Organizational Evolution Engine
-- Most software tracks activity. Aipify helps organizations improve.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_evolution_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  maturity_engine_enabled boolean not null default true,
  adoption_engine_enabled boolean not null default true,
  optimization_engine_enabled boolean not null default true,
  training_integration_enabled boolean not null default true,
  learning_loop_enabled boolean not null default true,
  monthly_health_review_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_evolution_operations_settings enable row level security;
revoke all on public.organization_evolution_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Maturity snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.organization_evolution_maturity_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  maturity_level int not null default 2 check (maturity_level between 1 and 5),
  maturity_label text not null default 'Operational',
  maturity_score numeric(5,2) not null default 65,
  dimension_scores jsonb not null default '{}'::jsonb,
  score_explanation text not null default '',
  improvement_guidance jsonb not null default '[]'::jsonb,
  recorded_at timestamptz not null default now()
);

create index if not exists organization_evolution_maturity_snapshots_org_idx
  on public.organization_evolution_maturity_snapshots (organization_id, recorded_at desc);

alter table public.organization_evolution_maturity_snapshots enable row level security;
revoke all on public.organization_evolution_maturity_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Feature & pack adoption
-- ---------------------------------------------------------------------------
create table if not exists public.organization_evolution_adoption_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  item_type text not null check (item_type in ('feature', 'business_pack', 'integration', 'process')),
  item_key text not null,
  title text not null,
  status text not null default 'installed' check (
    status in ('installed', 'activated', 'used', 'unused', 'abandoned', 'optimized')
  ),
  usage_pct numeric(5,2),
  domain_scope text not null default 'organization_wide',
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, item_type, item_key)
);

create index if not exists organization_evolution_adoption_items_org_idx
  on public.organization_evolution_adoption_items (organization_id, item_type, status);

alter table public.organization_evolution_adoption_items enable row level security;
revoke all on public.organization_evolution_adoption_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Recommendations & success tracking
-- ---------------------------------------------------------------------------
create table if not exists public.organization_evolution_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_type text not null default 'adoption' check (
    recommendation_type in ('adoption', 'training', 'optimization', 'maturity', 'health_review')
  ),
  title text not null,
  summary text not null default '',
  department text,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'rejected', 'completed', 'measured')
  ),
  estimated_value text,
  measured_result text,
  value_generated text,
  training_assigned boolean not null default false,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists organization_evolution_recommendations_org_idx
  on public.organization_evolution_recommendations (organization_id, status, created_at desc);

alter table public.organization_evolution_recommendations enable row level security;
revoke all on public.organization_evolution_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Health reviews
-- ---------------------------------------------------------------------------
create table if not exists public.organization_evolution_health_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_period text not null default 'monthly',
  strengths jsonb not null default '[]'::jsonb,
  weaknesses jsonb not null default '[]'::jsonb,
  opportunities jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  adoption_issues jsonb not null default '[]'::jsonb,
  training_needs jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now()
);

alter table public.organization_evolution_health_reviews enable row level security;
revoke all on public.organization_evolution_health_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Department evolution
-- ---------------------------------------------------------------------------
create table if not exists public.organization_evolution_department_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_name text not null,
  automation_score numeric(5,2) not null default 0,
  knowledge_score numeric(5,2) not null default 0,
  training_score numeric(5,2) not null default 0,
  maturity_score numeric(5,2) not null default 0,
  adoption_score numeric(5,2) not null default 0,
  suggestions jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, department_name)
);

alter table public.organization_evolution_department_scores enable row level security;
revoke all on public.organization_evolution_department_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_evolution_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_evolution_operations_audit_org_idx
  on public.organization_evolution_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_evolution_operations_audit_logs enable row level security;
revoke all on public.organization_evolution_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._evo546_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._evo546_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_evolution_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._evo546_log(
  p_org_id uuid, p_action text, p_summary text,
  p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_evolution_operations_audit_logs (
    organization_id, actor_user_id, action, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._evo546_maturity_label(p_level int)
returns text language sql immutable as $$
  select case p_level
    when 1 then 'Getting Started'
    when 2 then 'Operational'
    when 3 then 'Managed'
    when 4 then 'Optimized'
    when 5 then 'Aipify Advanced'
    else 'Operational'
  end;
$$;

create or replace function public._evo546_recommendation_json(r public.organization_evolution_recommendations)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'recommendation_type', r.recommendation_type, 'title', r.title,
    'summary', r.summary, 'department', r.department, 'status', r.status,
    'estimated_value', r.estimated_value, 'measured_result', r.measured_result,
    'value_generated', r.value_generated, 'training_assigned', r.training_assigned,
    'created_at', r.created_at, 'resolved_at', r.resolved_at
  );
$$;

create or replace function public._evo546_seed_evolution(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int; v_domain uuid;
begin
  select count(*) into v_count from public.organization_evolution_adoption_items where organization_id = p_org_id;
  if v_count > 5 then return v_count; end if;

  select id into v_domain from public.organization_domains
  where organization_id = p_org_id order by is_primary desc nulls last limit 1;

  insert into public.organization_evolution_maturity_snapshots (
    organization_id, maturity_level, maturity_label, maturity_score, dimension_scores, score_explanation, improvement_guidance
  ) values (
    p_org_id, 3, 'Managed', 72.5,
    '{"business_packs":78,"automation":68,"knowledge":55,"companion":82,"search":88,"approvals":70,"processes":65,"integrations":74,"reporting":60,"governance":77}'::jsonb,
    'Organization is operational with strong search and companion usage. Knowledge Center and reporting need attention.',
    '["Increase Knowledge Center adoption in Operations","Enable Inventory Forecasting","Reduce approval delays"]'::jsonb
  ) on conflict do nothing;

  insert into public.organization_evolution_adoption_items (
    organization_id, item_type, item_key, title, status, usage_pct, business_pack_key, domain_scope
  ) values
    (p_org_id, 'business_pack', 'warehouse_pack', 'Warehouse Pack', 'used', 45, 'warehouse_pack', 'organization_wide'),
    (p_org_id, 'business_pack', 'inventory_pack', 'Inventory Pack', 'unused', 12, 'inventory_pack', 'organization_wide'),
    (p_org_id, 'feature', 'automation_workflows', 'Automation Workflows', 'optimized', 85, null, 'organization_wide'),
    (p_org_id, 'feature', 'knowledge_center', 'Knowledge Center', 'unused', 28, null, 'organization_wide'),
    (p_org_id, 'feature', 'universal_search', 'Universal Search', 'used', 92, null, 'organization_wide'),
    (p_org_id, 'integration', 'microsoft_365', 'Microsoft 365', 'activated', 70, null, 'organization_wide'),
    (p_org_id, 'process', 'approval_workflow', 'Approval Workflow', 'used', 58, null, 'organization_wide')
  on conflict do nothing;

  insert into public.organization_evolution_adoption_items (
    organization_id, item_type, item_key, title, status, usage_pct, domain_scope, domain_id
  ) values
    (p_org_id, 'feature', 'domain_adoption_firma', 'firma.no adoption', 'optimized', 85, 'firma.no', v_domain),
    (p_org_id, 'feature', 'domain_adoption_butikk', 'butikk.no adoption', 'used', 52, 'butikk.no', null)
  on conflict do nothing;

  insert into public.organization_evolution_recommendations (
    organization_id, recommendation_type, title, summary, department, status, estimated_value
  ) values
    (p_org_id, 'optimization', 'Automate onboarding workflow', 'You could save 4 hours per week by automating this workflow.', 'Operations', 'pending', '4 hours/week'),
    (p_org_id, 'adoption', 'Knowledge adoption low in Operations', 'Knowledge Center usage is 28% — training suggested for Operations team.', 'Operations', 'pending', null),
    (p_org_id, 'adoption', 'Enable Inventory Forecasting', 'Inventory Pack installed but only 12% used — enable forecasting module.', 'Warehouse', 'accepted', null),
    (p_org_id, 'training', 'Support certification training', 'Support team would benefit from certification training.', 'Support', 'pending', null),
    (p_org_id, 'optimization', 'Automate onboarding', 'Automate employee onboarding — previously accepted.', 'HR', 'measured', '12 hours/month saved')
  on conflict do nothing;

  update public.organization_evolution_recommendations
  set measured_result = '12 hours saved monthly', value_generated = '144 hours/year', resolved_at = now()
  where organization_id = p_org_id and title = 'Automate onboarding' and status = 'measured';

  insert into public.organization_evolution_health_reviews (
    organization_id, strengths, weaknesses, opportunities, risks, adoption_issues, training_needs
  ) values (
    p_org_id,
    '["Strong automation adoption","Search adoption excellent","Companion usage high"]'::jsonb,
    '["Low Knowledge Center usage","Approval delays increasing"]'::jsonb,
    '["Inventory Forecasting enablement","Support certification program"]'::jsonb,
    '["Warehouse pack underutilized"]'::jsonb,
    '["Inventory Pack only 12% used","Knowledge Center 28% in Operations"]'::jsonb,
    '["Operations Knowledge Center training","Support certification"]'::jsonb
  ) on conflict do nothing;

  insert into public.organization_evolution_department_scores (
    organization_id, department_name, automation_score, knowledge_score, training_score, maturity_score, adoption_score, suggestions
  ) values
    (p_org_id, 'Sales', 75, 62, 58, 68, 72, '["Enable CRM automation templates"]'::jsonb),
    (p_org_id, 'Operations', 82, 45, 52, 65, 58, '["Knowledge Center training","Reduce approval bottlenecks"]'::jsonb),
    (p_org_id, 'Support', 70, 68, 48, 62, 65, '["Certification training program"]'::jsonb),
    (p_org_id, 'Warehouse', 65, 55, 60, 58, 45, '["Activate Inventory Forecasting"]'::jsonb)
  on conflict do nothing;

  select count(*) into v_count from public.organization_evolution_adoption_items where organization_id = p_org_id;
  return v_count;
end; $$;

create or replace function public.search_evolution_recommendations(p_query text, p_limit int default 30)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('evolution_operations.view');
  v_org_id := public._evo546_org();
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(public._evo546_recommendation_json(r) order by r.created_at desc)
      from (
        select * from public.organization_evolution_recommendations
        where organization_id = v_org_id
          and (p_query is null or trim(p_query) = ''
            or title ilike '%' || p_query || '%'
            or summary ilike '%' || p_query || '%'
            or department ilike '%' || p_query || '%')
        order by created_at desc limit greatest(p_limit, 1)
      ) r
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Evolution Center
-- ---------------------------------------------------------------------------
create or replace function public.get_evolution_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_maturity record; v_adoption_score numeric;
begin
  perform public._irp_require_permission('evolution_operations.view');
  v_org_id := public._evo546_org();
  perform public._evo546_ensure_settings(v_org_id);
  perform public._evo546_seed_evolution(v_org_id);

  select * into v_maturity from public.organization_evolution_maturity_snapshots
  where organization_id = v_org_id order by recorded_at desc limit 1;

  select round(avg(usage_pct), 1) into v_adoption_score
  from public.organization_evolution_adoption_items where organization_id = v_org_id and usage_pct is not null;

  perform public._evo546_log(v_org_id, 'center_view', 'Evolution Center viewed', 'overview',
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Most software tracks activity. Aipify helps organizations improve, mature, and evolve.',
    'philosophy', 'Companion becomes an advisor for organizational growth.',
    'overview', jsonb_build_object(
      'maturity_score', coalesce(v_maturity.maturity_score, 65),
      'maturity_level', coalesce(v_maturity.maturity_level, 2),
      'maturity_label', coalesce(v_maturity.maturity_label, 'Operational'),
      'adoption_score', coalesce(v_adoption_score, 0),
      'pending_recommendations', (select count(*) from public.organization_evolution_recommendations where organization_id = v_org_id and status = 'pending'),
      'unused_features', (select count(*) from public.organization_evolution_adoption_items where organization_id = v_org_id and status in ('unused', 'abandoned')),
      'training_gaps', (select count(*) from public.organization_evolution_recommendations where organization_id = v_org_id and recommendation_type = 'training' and status = 'pending')
    ),
    'maturity_engine', jsonb_build_object(
      'levels', jsonb_build_array(
        jsonb_build_object('level', 1, 'label', 'Getting Started'),
        jsonb_build_object('level', 2, 'label', 'Operational'),
        jsonb_build_object('level', 3, 'label', 'Managed'),
        jsonb_build_object('level', 4, 'label', 'Optimized'),
        jsonb_build_object('level', 5, 'label', 'Aipify Advanced')
      ),
      'current', jsonb_build_object(
        'level', coalesce(v_maturity.maturity_level, 2),
        'label', coalesce(v_maturity.maturity_label, 'Operational'),
        'score', coalesce(v_maturity.maturity_score, 65),
        'explanation', coalesce(v_maturity.score_explanation, ''),
        'dimension_scores', coalesce(v_maturity.dimension_scores, '{}'::jsonb),
        'improvement_guidance', coalesce(v_maturity.improvement_guidance, '[]'::jsonb)
      ),
      'tracks', jsonb_build_array(
        'business_packs', 'automation', 'knowledge_usage', 'companion_usage', 'search_usage',
        'approvals', 'processes', 'integrations', 'reporting', 'governance'
      )
    ),
    'adoption', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'item_type', a.item_type, 'item_key', a.item_key, 'title', a.title,
        'status', a.status, 'usage_pct', a.usage_pct, 'business_pack_key', a.business_pack_key,
        'domain_scope', a.domain_scope
      ) order by a.usage_pct nulls last)
      from public.organization_evolution_adoption_items a where a.organization_id = v_org_id
    ), '[]'::jsonb),
    'feature_adoption_engine', jsonb_build_object(
      'tracks', jsonb_build_array('installed', 'used', 'unused', 'abandoned', 'most_valuable', 'optimized'),
      'workflow', jsonb_build_array('installed', 'not_used', 'companion_recommendation', 'training_suggested', 'adoption_increased')
    ),
    'business_pack_adoption', coalesce((
      select jsonb_agg(jsonb_build_object(
        'title', a.title, 'status', a.status, 'usage_pct', a.usage_pct, 'pack_key', a.business_pack_key
      ))
      from public.organization_evolution_adoption_items a
      where a.organization_id = v_org_id and a.item_type = 'business_pack'
    ), '[]'::jsonb),
    'health_review', coalesce((
      select jsonb_build_object(
        'strengths', r.strengths, 'weaknesses', r.weaknesses, 'opportunities', r.opportunities,
        'risks', r.risks, 'adoption_issues', r.adoption_issues, 'training_needs', r.training_needs,
        'generated_at', r.generated_at
      )
      from public.organization_evolution_health_reviews r
      where r.organization_id = v_org_id order by r.generated_at desc limit 1
    ), '{}'::jsonb),
    'training_integration', jsonb_build_object(
      'engines', jsonb_build_array('people_engine', 'learning_engine', 'certification_engine', 'knowledge_center'),
      'workflow', jsonb_build_array('low_usage_detected', 'training_assigned', 'learning_completed', 'usage_improved')
    ),
    'process_optimization', jsonb_build_object(
      'domains', jsonb_build_array('projects', 'approvals', 'workflows', 'customers', 'finance', 'inventory', 'support', 'people'),
      'examples', jsonb_build_array(
        'Approval process too slow',
        'Duplicate workflow detected',
        'Unused automation found',
        'Knowledge gap identified'
      )
    ),
    'recommendations', coalesce((
      select jsonb_agg(public._evo546_recommendation_json(r) order by r.created_at desc)
      from public.organization_evolution_recommendations r where r.organization_id = v_org_id limit 25
    ), '[]'::jsonb),
    'companion_insights', jsonb_build_object(
      'prompts', jsonb_build_array(
        'You could save 4 hours per week by automating this workflow.',
        'Knowledge adoption is low in Operations.',
        'Consider enabling Inventory Forecasting.',
        'Support team would benefit from certification training.'
      )
    ),
    'success_tracking', jsonb_build_object(
      'given', (select count(*) from public.organization_evolution_recommendations where organization_id = v_org_id),
      'accepted', (select count(*) from public.organization_evolution_recommendations where organization_id = v_org_id and status in ('accepted', 'measured', 'completed')),
      'rejected', (select count(*) from public.organization_evolution_recommendations where organization_id = v_org_id and status = 'rejected'),
      'measured', (select count(*) from public.organization_evolution_recommendations where organization_id = v_org_id and status = 'measured')
    ),
    'learning_loop', jsonb_build_object(
      'workflow', jsonb_build_array('suggestion', 'accepted', 'result', 'measure_outcome', 'improve_future_recommendations')
    ),
    'department_evolution', coalesce((
      select jsonb_agg(jsonb_build_object(
        'department_name', d.department_name, 'automation_score', d.automation_score,
        'knowledge_score', d.knowledge_score, 'training_score', d.training_score,
        'maturity_score', d.maturity_score, 'adoption_score', d.adoption_score,
        'suggestions', d.suggestions
      ) order by d.department_name)
      from public.organization_evolution_department_scores d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'domain_awareness', coalesce((
      select jsonb_agg(jsonb_build_object(
        'domain_scope', a.domain_scope, 'usage_pct', a.usage_pct, 'title', a.title, 'status', a.status
      ))
      from public.organization_evolution_adoption_items a
      where a.organization_id = v_org_id and a.item_key like 'domain_adoption_%'
    ), '[]'::jsonb),
    'business_pack_integration', jsonb_build_object(
      'examples', jsonb_build_array(
        jsonb_build_object('pack', 'finance_pack', 'optimization', 'Financial Process Optimization'),
        jsonb_build_object('pack', 'warehouse_pack', 'optimization', 'Inventory Optimization'),
        jsonb_build_object('pack', 'support_pack', 'optimization', 'Support Efficiency'),
        jsonb_build_object('pack', 'partner_pack', 'optimization', 'Sales Growth Opportunities')
      )
    ),
    'executive_dashboard', jsonb_build_object(
      'adoption_score', coalesce(v_adoption_score, 0),
      'maturity_score', coalesce(v_maturity.maturity_score, 65),
      'top_improvements', coalesce(v_maturity.improvement_guidance, '[]'::jsonb),
      'training_gaps', (select count(*) from public.organization_evolution_recommendations where organization_id = v_org_id and recommendation_type = 'training' and status = 'pending'),
      'growth_opportunities', coalesce((select r.opportunities from public.organization_evolution_health_reviews r where r.organization_id = v_org_id order by generated_at desc limit 1), '[]'::jsonb),
      'companion_recommendations', jsonb_build_array(
        'Focus on Knowledge Center adoption in Operations this month.',
        'Enable Inventory Forecasting to improve warehouse maturity score.',
        'Automate onboarding — previous success saved 12 hours monthly.'
      )
    ),
    'reports', jsonb_build_object(
      'maturity_trend', coalesce(v_maturity.maturity_score, 65),
      'adoption_trend', coalesce(v_adoption_score, 0),
      'recommendations_pending', (select count(*) from public.organization_evolution_recommendations where organization_id = v_org_id and status = 'pending'),
      'success_measured', (select count(*) from public.organization_evolution_recommendations where organization_id = v_org_id and status = 'measured')
    ),
    'mobile_access', jsonb_build_object('mobile_ready', true),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action', a.action, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_evolution_operations_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'adoption', 'maturity', 'recommendations', 'training', 'optimization', 'companion_insights', 'reports', 'executive'
    ),
    'routes', jsonb_build_object(
      'evolution', '/app/evolution',
      'adoption', '/app/evolution/adoption',
      'maturity', '/app/evolution/maturity',
      'learning', '/app/learning',
      'continuous_improvement_legacy', '/app/continuous-improvement-engine',
      'organizational_evolution_legacy', '/app/evolution/legacy'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_evolution_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_rec_id uuid;
begin
  v_org_id := public._evo546_org();
  perform public._evo546_ensure_settings(v_org_id);

  if p_action_type in ('accept_recommendation', 'reject_recommendation', 'assign_training', 'record_success', 'refresh_maturity') then
    perform public._irp_require_permission('evolution_operations.manage');
  else
    perform public._irp_require_permission('evolution_operations.view');
  end if;

  if p_action_type = 'accept_recommendation' then
    v_rec_id := (p_payload->>'recommendation_id')::uuid;
    update public.organization_evolution_recommendations
    set status = 'accepted', resolved_at = now()
    where id = v_rec_id and organization_id = v_org_id;
    perform public._evo546_log(v_org_id, 'recommendation_accepted', 'Recommendation accepted', 'recommendations', p_payload);
    return jsonb_build_object('ok', true, 'recommendation_id', v_rec_id);

  elsif p_action_type = 'reject_recommendation' then
    v_rec_id := (p_payload->>'recommendation_id')::uuid;
    update public.organization_evolution_recommendations
    set status = 'rejected', resolved_at = now()
    where id = v_rec_id and organization_id = v_org_id;
    perform public._evo546_log(v_org_id, 'recommendation_rejected', 'Recommendation rejected', 'recommendations', p_payload);
    return jsonb_build_object('ok', true, 'recommendation_id', v_rec_id);

  elsif p_action_type = 'assign_training' then
    v_rec_id := (p_payload->>'recommendation_id')::uuid;
    update public.organization_evolution_recommendations
    set training_assigned = true, status = 'accepted'
    where id = v_rec_id and organization_id = v_org_id;
    perform public._evo546_log(v_org_id, 'training_assigned', 'Training assigned', 'training', p_payload);
    return jsonb_build_object('ok', true, 'recommendation_id', v_rec_id);

  elsif p_action_type = 'record_success' then
    v_rec_id := (p_payload->>'recommendation_id')::uuid;
    update public.organization_evolution_recommendations
    set status = 'measured', measured_result = coalesce(p_payload->>'measured_result', ''),
        value_generated = coalesce(p_payload->>'value_generated', ''), resolved_at = now()
    where id = v_rec_id and organization_id = v_org_id;
    perform public._evo546_log(v_org_id, 'success_recorded', 'Success recorded', 'success_tracking', p_payload);
    return jsonb_build_object('ok', true, 'recommendation_id', v_rec_id);

  elsif p_action_type = 'refresh_maturity' then
    insert into public.organization_evolution_maturity_snapshots (
      organization_id, maturity_level, maturity_label, maturity_score, dimension_scores, score_explanation
    ) values (
      v_org_id,
      coalesce((p_payload->>'maturity_level')::int, 3),
      public._evo546_maturity_label(coalesce((p_payload->>'maturity_level')::int, 3)),
      coalesce((p_payload->>'maturity_score')::numeric, 72.5),
      coalesce(p_payload->'dimension_scores', '{}'::jsonb),
      coalesce(p_payload->>'score_explanation', 'Maturity refreshed.')
    ) returning id into v_rec_id;
    perform public._evo546_log(v_org_id, 'maturity_updated', 'Maturity score updated', 'maturity', p_payload);
    return jsonb_build_object('ok', true, 'snapshot_id', v_rec_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_evolution_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb; v_search jsonb;
begin
  perform public._irp_require_permission('evolution_operations.view');
  v_center := public.get_evolution_operations_center('companion');
  if p_query is not null and trim(p_query) <> '' then
    v_search := public.search_evolution_recommendations(p_query, 10);
  end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion becomes a continuous improvement advisor for organizational growth.',
    'query', p_query, 'center', v_center, 'search', v_search,
    'companion_prompts', v_center->'companion_insights'->'prompts',
    'routes', v_center->'routes'
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_evolution_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._irp_require_permission('evolution_operations.view');
  v_center := public.get_evolution_operations_center('mobile');
  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('evolution_operations.manage', public._evo546_org()),
    'overview', v_center->'overview',
    'executive_dashboard', v_center->'executive_dashboard',
    'recommendations', v_center->'recommendations',
    'routes', v_center->'routes',
    'mobile_ready', true
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('evolution', '/app/evolution'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'evolution_operations', 'Self-Improvement & Organizational Evolution', 'evolution-operations', 'companion',
    'Continuously help organizations improve adoption, maturity, and operational effectiveness.',
    'business', null, 'main', '/app/evolution', 'licensed', 2
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('evolution_operations', 'evolution_operations.view', 'view', 'Evolution — view maturity, adoption, and recommendations'),
  ('evolution_operations', 'evolution_operations.manage', 'manage', 'Evolution — accept recommendations, assign training, record success')
on conflict do nothing;

grant execute on function public._evo546_maturity_label(int) to authenticated;
grant execute on function public._evo546_recommendation_json(public.organization_evolution_recommendations) to authenticated;
grant execute on function public._evo546_seed_evolution(uuid) to authenticated;
grant execute on function public.search_evolution_recommendations(text, int) to authenticated;
grant execute on function public.get_evolution_operations_center(text) to authenticated;
grant execute on function public.perform_evolution_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_evolution_context(text) to authenticated;
grant execute on function public.get_my_evolution_summary() to authenticated;
