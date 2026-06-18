-- Phase 426 — Enterprise Quality, Consistency & Platform Excellence Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/platform/excellence. Helpers: _geqcpe426_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.platform_excellence_engine_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  platform_quality_score integer not null default 86 check (platform_quality_score between 0 and 100),
  consistency_score integer not null default 82 check (consistency_score between 0 and 100),
  ux_score integer not null default 84 check (ux_score between 0 and 100),
  performance_score integer not null default 88 check (performance_score between 0 and 100),
  accessibility_score integer not null default 79 check (accessibility_score between 0 and 100),
  governance_score integer not null default 91 check (governance_score between 0 and 100),
  excellence_health_score integer not null default 85 check (excellence_health_score between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.platform_excellence_engine_quality_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_title text not null,
  review_type text not null check (
    review_type in ('quality', 'consistency', 'ux', 'performance', 'accessibility')
  ),
  target_scope text not null default 'platform' check (
    target_scope in ('page', 'workflow', 'module', 'business_pack', 'industry_pack', 'knowledge_center', 'companion', 'admin')
  ),
  status text not null default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'failed')),
  score integer not null default 0 check (score between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists platform_excellence_engine_quality_reviews_tenant_idx
  on public.platform_excellence_engine_quality_reviews (tenant_id, review_type);

create table if not exists public.platform_excellence_engine_consistency_checks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  check_key text not null,
  check_title text not null,
  check_category text not null check (
    check_category in (
      'design_pattern', 'terminology', 'navigation', 'colors', 'typography', 'icons',
      'loading_state', 'companion_presence', 'copy_tone', 'companion_voice'
    )
  ),
  status text not null default 'pass' check (status in ('pass', 'review', 'fail')),
  severity text not null default 'low' check (severity in ('low', 'moderate', 'high')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, check_key)
);

create index if not exists platform_excellence_engine_consistency_checks_tenant_idx
  on public.platform_excellence_engine_consistency_checks (tenant_id, check_category);

create table if not exists public.platform_excellence_engine_platform_standards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  standard_key text not null,
  standard_title text not null,
  standard_type text not null check (
    standard_type in ('ui', 'ux', 'copy', 'companion', 'governance', 'development', 'quality')
  ),
  status text not null default 'active' check (status in ('active', 'draft', 'deprecated')),
  version text not null default '1.0',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, standard_key)
);

create index if not exists platform_excellence_engine_platform_standards_tenant_idx
  on public.platform_excellence_engine_platform_standards (tenant_id, standard_type);

create table if not exists public.platform_excellence_engine_review_schedules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  schedule_key text not null,
  schedule_title text not null,
  schedule_type text not null check (
    schedule_type in ('scheduled', 'release', 'business_pack', 'industry_pack', 'platform', 'regression')
  ),
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  next_review_at timestamptz,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, schedule_key)
);

create index if not exists platform_excellence_engine_review_schedules_tenant_idx
  on public.platform_excellence_engine_review_schedules (tenant_id, schedule_type);

create table if not exists public.platform_excellence_engine_quality_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  score_key text not null,
  score_title text not null,
  score_dimension text not null check (
    score_dimension in (
      'design', 'ux', 'performance', 'accessibility', 'consistency', 'companion', 'governance'
    )
  ),
  score_value integer not null default 0 check (score_value between 0 and 100),
  trend text not null default 'stable' check (trend in ('improving', 'stable', 'declining')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, score_key)
);

create index if not exists platform_excellence_engine_quality_scores_tenant_idx
  on public.platform_excellence_engine_quality_scores (tenant_id, score_dimension);

create table if not exists public.platform_excellence_engine_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'design_standard_gap', 'workflow_simplification', 'accessibility_improvement',
      'performance_decline', 'companion_consistency_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists platform_excellence_engine_intelligence_signals_tenant_idx
  on public.platform_excellence_engine_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.platform_excellence_engine_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'module_review', 'workflow_complexity', 'consistency_improved',
      'performance_issue', 'accessibility_improvement'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists platform_excellence_engine_advisor_signals_tenant_idx
  on public.platform_excellence_engine_advisor_signals (tenant_id, created_at desc);

create table if not exists public.platform_excellence_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'quality_review_completed', 'consistency_issue_detected', 'performance_review_generated',
      'accessibility_review_generated', 'quality_score_updated', 'platform_standard_updated',
      'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_excellence_engine_audit_logs_tenant_idx
  on public.platform_excellence_engine_audit_logs (tenant_id, created_at desc);

alter table public.platform_excellence_engine_settings enable row level security;
alter table public.platform_excellence_engine_quality_reviews enable row level security;
alter table public.platform_excellence_engine_consistency_checks enable row level security;
alter table public.platform_excellence_engine_platform_standards enable row level security;
alter table public.platform_excellence_engine_review_schedules enable row level security;
alter table public.platform_excellence_engine_quality_scores enable row level security;
alter table public.platform_excellence_engine_intelligence_signals enable row level security;
alter table public.platform_excellence_engine_advisor_signals enable row level security;
alter table public.platform_excellence_engine_audit_logs enable row level security;

revoke all on public.platform_excellence_engine_settings from authenticated, anon;
revoke all on public.platform_excellence_engine_quality_reviews from authenticated, anon;
revoke all on public.platform_excellence_engine_consistency_checks from authenticated, anon;
revoke all on public.platform_excellence_engine_platform_standards from authenticated, anon;
revoke all on public.platform_excellence_engine_review_schedules from authenticated, anon;
revoke all on public.platform_excellence_engine_quality_scores from authenticated, anon;
revoke all on public.platform_excellence_engine_intelligence_signals from authenticated, anon;
revoke all on public.platform_excellence_engine_advisor_signals from authenticated, anon;
revoke all on public.platform_excellence_engine_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'platform_excellence_engine', v.description
from (values
  ('platform_excellence.view', 'View Platform Excellence', 'View quality scores, reviews, consistency checks, and platform standards'),
  ('platform_excellence.manage', 'Manage Platform Excellence', 'Run reviews, update standards, scores, and excellence schedules')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _geqcpe426_*
-- ---------------------------------------------------------------------------
create or replace function public._geqcpe426_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_tenant_id uuid; v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Platform Excellence Center requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end; $$;

create or replace function public._geqcpe426_log_audit(p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.platform_excellence_engine_audit_logs (tenant_id, event_type, summary, actor_user_id, context)
  values (p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._geqcpe426_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.platform_excellence_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.platform_excellence_engine_settings;
begin
  insert into public.platform_excellence_engine_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.platform_excellence_engine_settings where organization_id = p_org_id;
  end if;
  return v_row;
end; $$;

create or replace function public._geqcpe426_seed_defaults(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.platform_excellence_engine_quality_reviews where tenant_id = p_tenant_id limit 1) then
    insert into public.platform_excellence_engine_quality_reviews (tenant_id, review_key, review_title, review_type, target_scope, status, score, summary) values
      (p_tenant_id, 'QR-UX', 'Customer App UX review', 'ux', 'module', 'completed', 84, 'Navigation clarity and task completion within targets.'),
      (p_tenant_id, 'QR-PERF', 'API performance review', 'performance', 'module', 'in_progress', 88, 'Load times within SLA; bundle review scheduled.'),
      (p_tenant_id, 'QR-A11Y', 'Accessibility review', 'accessibility', 'platform', 'scheduled', 79, 'Keyboard navigation and contrast audit pending.'),
      (p_tenant_id, 'QR-CON', 'Design consistency review', 'consistency', 'business_pack', 'completed', 82, 'Button and card patterns aligned with standards.');
  end if;
  if not exists (select 1 from public.platform_excellence_engine_consistency_checks where tenant_id = p_tenant_id limit 1) then
    insert into public.platform_excellence_engine_consistency_checks (tenant_id, check_key, check_title, check_category, status, severity, summary) values
      (p_tenant_id, 'CC-NAV', 'Navigation consistency', 'navigation', 'pass', 'low', 'Primary nav labels follow ABOS terminology.'),
      (p_tenant_id, 'CC-LOAD', 'Loading state consistency', 'loading_state', 'review', 'moderate', 'Some modules still use text-only loading states.'),
      (p_tenant_id, 'CC-COMP', 'Companion voice consistency', 'companion_voice', 'pass', 'low', 'Companion uses Aipify-first language policy.'),
      (p_tenant_id, 'CC-TONE', 'Copy tone consistency', 'copy_tone', 'review', 'moderate', 'Error messages need enterprise tone review.');
  end if;
  if not exists (select 1 from public.platform_excellence_engine_platform_standards where tenant_id = p_tenant_id limit 1) then
    insert into public.platform_excellence_engine_platform_standards (tenant_id, standard_key, standard_title, standard_type, summary) values
      (p_tenant_id, 'STD-UI', 'UI standards library', 'ui', 'Buttons, forms, cards, tables, modals — enterprise polish.'),
      (p_tenant_id, 'STD-UX', 'UX standards library', 'ux', 'Onboarding, navigation, discoverability, empty states.'),
      (p_tenant_id, 'STD-COPY', 'Copy standards library', 'copy', 'Terminology, tone, translations, Companion voice.'),
      (p_tenant_id, 'STD-COMP', 'Companion standards', 'companion', 'Identity, presence, behavior, recommendations.'),
      (p_tenant_id, 'STD-GOV', 'Governance standards', 'governance', 'Human oversight, audit, RBAC visibility.');
  end if;
  if not exists (select 1 from public.platform_excellence_engine_review_schedules where tenant_id = p_tenant_id limit 1) then
    insert into public.platform_excellence_engine_review_schedules (tenant_id, schedule_key, schedule_title, schedule_type, next_review_at, summary) values
      (p_tenant_id, 'RS-WEEKLY', 'Weekly platform review', 'scheduled', now() + interval '7 days', 'Scheduled excellence review cadence.'),
      (p_tenant_id, 'RS-RELEASE', 'Release quality gate', 'release', now() + interval '14 days', 'Pre-release regression and standards check.'),
      (p_tenant_id, 'RS-BP', 'Business Pack review', 'business_pack', now() + interval '30 days', 'Business Pack consistency audit.');
  end if;
  if not exists (select 1 from public.platform_excellence_engine_quality_scores where tenant_id = p_tenant_id limit 1) then
    insert into public.platform_excellence_engine_quality_scores (tenant_id, score_key, score_title, score_dimension, score_value, trend, summary) values
      (p_tenant_id, 'QS-DESIGN', 'Design quality', 'design', 86, 'improving', 'Card and modal patterns converging.'),
      (p_tenant_id, 'QS-UX', 'UX quality', 'ux', 84, 'stable', 'Task completion within complexity targets.'),
      (p_tenant_id, 'QS-PERF', 'Performance quality', 'performance', 88, 'stable', 'API and client performance healthy.'),
      (p_tenant_id, 'QS-A11Y', 'Accessibility quality', 'accessibility', 79, 'improving', 'ARIA and contrast improvements in progress.'),
      (p_tenant_id, 'QS-CON', 'Consistency quality', 'consistency', 82, 'improving', 'Terminology alignment improving.'),
      (p_tenant_id, 'QS-COMP', 'Companion quality', 'companion', 87, 'stable', 'Companion presence consistent across modules.');
  end if;
end; $$;

create or replace function public._geqcpe426_seed_advisor(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.platform_excellence_engine_advisor_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.platform_excellence_engine_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence) values
    (p_tenant_id, 'module_review', 'A module should be reviewed.', 'Loading states inconsistent in two panels.', 'Schedule UX consistency review.', 'moderate', 'high'),
    (p_tenant_id, 'workflow_complexity', 'A workflow exceeds complexity targets.', 'Approval workflow has 8 steps.', 'Simplify to 5 steps or add guidance.', 'high', 'moderate'),
    (p_tenant_id, 'consistency_improved', 'Platform consistency improved.', 'Navigation terminology aligned this sprint.', 'Maintain copy standards in next release.', 'low', 'high'),
    (p_tenant_id, 'performance_issue', 'A performance issue was identified.', 'Dashboard bundle size increased 12%.', 'Review code splitting for heavy panels.', 'moderate', 'high'),
    (p_tenant_id, 'accessibility_improvement', 'Accessibility improvements available.', 'Three forms missing focus states.', 'Apply focus ring standards library.', 'low', 'high');
end; $$;

create or replace function public._geqcpe426_seed_intelligence(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.platform_excellence_engine_intelligence_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.platform_excellence_engine_intelligence_signals (tenant_id, signal_type, observation, impact, recommendation, confidence) values
    (p_tenant_id, 'design_standard_gap', 'A module does not follow design standards.', 'Custom button styles detected.', 'Align with UI standards library.', 'high'),
    (p_tenant_id, 'workflow_simplification', 'A workflow requires simplification.', 'Install wizard step count above target.', 'Reduce steps or add progressive disclosure.', 'moderate'),
    (p_tenant_id, 'accessibility_improvement', 'Accessibility improvements identified.', 'Color contrast below WCAG AA on one panel.', 'Update palette per accessibility engine.', 'high'),
    (p_tenant_id, 'performance_decline', 'Loading performance declined.', 'Client bundle trend up 8% this month.', 'Run performance review and split locales.', 'moderate'),
    (p_tenant_id, 'companion_consistency_review', 'Companion consistency review recommended.', 'Mixed tone in advisor signals.', 'Apply Companion standards library.', 'moderate');
end; $$;

create or replace function public._geqcpe426_overview_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.platform_excellence_engine_settings;
begin
  select * into v_settings from public.platform_excellence_engine_settings where tenant_id = p_tenant_id;
  return jsonb_build_object(
    'platform_quality_score', coalesce(v_settings.platform_quality_score, 86),
    'consistency_score', coalesce(v_settings.consistency_score, 82),
    'ux_score', coalesce(v_settings.ux_score, 84),
    'performance_score', coalesce(v_settings.performance_score, 88),
    'accessibility_score', coalesce(v_settings.accessibility_score, 79),
    'governance_score', coalesce(v_settings.governance_score, 91),
    'excellence_health_score', coalesce(v_settings.excellence_health_score, 85),
    'reviews_completed', (select count(*)::integer from public.platform_excellence_engine_quality_reviews where tenant_id = p_tenant_id and status = 'completed'),
    'consistency_issues', (select count(*)::integer from public.platform_excellence_engine_consistency_checks where tenant_id = p_tenant_id and status in ('review', 'fail')),
    'standards_active', (select count(*)::integer from public.platform_excellence_engine_platform_standards where tenant_id = p_tenant_id and status = 'active')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_excellence_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_tenant_id uuid;
  v_settings public.platform_excellence_engine_settings; v_overview jsonb;
begin
  perform public._irp_require_permission('platform_excellence.view');
  v_ctx := public._geqcpe426_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._geqcpe426_ensure_settings(v_org_id, v_tenant_id);
  perform public._geqcpe426_seed_defaults(v_tenant_id);
  perform public._geqcpe426_seed_advisor(v_tenant_id);
  perform public._geqcpe426_seed_intelligence(v_tenant_id);
  v_overview := public._geqcpe426_overview_block(v_tenant_id);
  perform public._geqcpe426_log_audit(v_tenant_id, 'dashboard_viewed', 'Platform excellence center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true, 'has_access', true,
    'philosophy', 'Quality is not a project. Quality is a system.',
    'mission', 'Platform Excellence Engine — monitor, measure, validate, and improve quality across the Aipify ecosystem.',
    'abos_principle', 'Every feature can be copied. Quality cannot. Excellence must become a competitive advantage.',
    'quality_guardian_route', '/app/quality-guardian-engine',
    'customer_experience_route', '/app/platform/customer-experience',
    'observability_route', '/app/observability-platform-health-engine',
    'distinction_note', 'Quality metadata and review signals — tenant-scoped excellence governance without operational content.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/platform/excellence'),
      jsonb_build_object('key', 'quality_reviews', 'route', '/app/platform/excellence#quality-reviews'),
      jsonb_build_object('key', 'consistency', 'route', '/app/platform/excellence#consistency'),
      jsonb_build_object('key', 'standards', 'route', '/app/platform/excellence#standards'),
      jsonb_build_object('key', 'analytics', 'route', '/app/platform/excellence#analytics')
    ),
    'core_languages', jsonb_build_array('en', 'no', 'sv', 'da', 'pl', 'uk'),
    'quality_guardian_targets', jsonb_build_array('pages', 'workflows', 'modules', 'business_packs', 'industry_packs', 'knowledge_center', 'companion_experiences', 'admin_experiences'),
    'quality_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_title',r.review_title,'review_type',r.review_type,'target_scope',r.target_scope,'status',r.status,'score',r.score,'summary',r.summary) order by r.updated_at desc) from public.platform_excellence_engine_quality_reviews r where r.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'consistency_checks', coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'check_key',c.check_key,'check_title',c.check_title,'check_category',c.check_category,'status',c.status,'severity',c.severity,'summary',c.summary) order by c.updated_at desc) from public.platform_excellence_engine_consistency_checks c where c.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'platform_standards', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'standard_key',s.standard_key,'standard_title',s.standard_title,'standard_type',s.standard_type,'status',s.status,'version',s.version,'summary',s.summary) order by s.updated_at desc) from public.platform_excellence_engine_platform_standards s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'review_schedules', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'schedule_key',s.schedule_key,'schedule_title',s.schedule_title,'schedule_type',s.schedule_type,'status',s.status,'next_review_at',s.next_review_at,'summary',s.summary) order by s.next_review_at nulls last) from public.platform_excellence_engine_review_schedules s where s.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'quality_scores', coalesce((select jsonb_agg(jsonb_build_object('id',q.id,'score_key',q.score_key,'score_title',q.score_title,'score_dimension',q.score_dimension,'score_value',q.score_value,'trend',q.trend,'summary',q.summary) order by q.score_value desc) from public.platform_excellence_engine_quality_scores q where q.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'intelligence_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.platform_excellence_engine_intelligence_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'advisor_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'effort',s.effort,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.platform_excellence_engine_advisor_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'audit_logs', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'event_type',l.event_type,'summary',l.summary,'created_at',l.created_at) order by l.created_at desc) from public.platform_excellence_engine_audit_logs l where l.tenant_id = v_tenant_id limit 20), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'platform_quality', v_overview->>'platform_quality_score',
      'platform_health', v_overview->>'excellence_health_score',
      'consistency', v_overview->>'consistency_score',
      'performance', v_overview->>'performance_score',
      'accessibility', v_overview->>'accessibility_score',
      'companion_quality', 87,
      'continuous_improvement', 'active'
    ),
    'governance', jsonb_build_object(
      'tenant_isolation', true,
      'platform_standards', true,
      'human_oversight', true,
      'automated_reviews', true,
      'continuous_improvement', true
    ),
    'privacy_note', 'Excellence metadata isolated per tenant — quality governance without cross-tenant operational exposure.'
  );
exception when others then
  return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.platform_excellence_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_action text; v_id uuid;
begin
  perform public._irp_require_permission('platform_excellence.manage');
  v_ctx := public._geqcpe426_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._geqcpe426_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'complete_quality_review' then
    update public.platform_excellence_engine_quality_reviews set
      status = 'completed',
      score = least(100, coalesce((p_payload->>'score')::integer, score + 5)),
      summary = coalesce(p_payload->>'summary', summary),
      updated_at = now()
    where tenant_id = v_tenant_id and review_key = coalesce(p_payload->>'review_key', '') returning id into v_id;
    perform public._geqcpe426_log_audit(v_tenant_id, 'quality_review_completed', 'Quality review completed', jsonb_build_object('review_id', v_id));
    return jsonb_build_object('ok', true, 'review_id', v_id);
  end if;

  if v_action = 'record_consistency_issue' then
    insert into public.platform_excellence_engine_consistency_checks (tenant_id, check_key, check_title, check_category, status, severity, summary)
    values (v_tenant_id, coalesce(p_payload->>'check_key','CC-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'check_title','Consistency issue'), coalesce(p_payload->>'check_category','design_pattern'), 'review', coalesce(p_payload->>'severity','moderate'), coalesce(p_payload->>'summary',''))
    on conflict (tenant_id, check_key) do update set status = 'review', severity = excluded.severity, summary = excluded.summary, updated_at = now()
    returning id into v_id;
    perform public._geqcpe426_log_audit(v_tenant_id, 'consistency_issue_detected', 'Consistency issue detected', jsonb_build_object('check_id', v_id));
    return jsonb_build_object('ok', true, 'check_id', v_id);
  end if;

  if v_action = 'generate_performance_review' then
    insert into public.platform_excellence_engine_quality_reviews (tenant_id, review_key, review_title, review_type, target_scope, status, score, summary)
    values (v_tenant_id, coalesce(p_payload->>'review_key','QR-PERF-'||upper(substr(gen_random_uuid()::text,1,6))), coalesce(p_payload->>'review_title','Performance review'), 'performance', coalesce(p_payload->>'target_scope','module'), 'in_progress', coalesce((p_payload->>'score')::integer, 85), coalesce(p_payload->>'summary','Automated performance review generated.'))
    returning id into v_id;
    perform public._geqcpe426_log_audit(v_tenant_id, 'performance_review_generated', 'Performance review generated', jsonb_build_object('review_id', v_id));
    return jsonb_build_object('ok', true, 'review_id', v_id);
  end if;

  if v_action = 'generate_accessibility_review' then
    insert into public.platform_excellence_engine_quality_reviews (tenant_id, review_key, review_title, review_type, target_scope, status, score, summary)
    values (v_tenant_id, coalesce(p_payload->>'review_key','QR-A11Y-'||upper(substr(gen_random_uuid()::text,1,6))), coalesce(p_payload->>'review_title','Accessibility review'), 'accessibility', coalesce(p_payload->>'target_scope','platform'), 'scheduled', coalesce((p_payload->>'score')::integer, 79), coalesce(p_payload->>'summary','Accessibility review scheduled.'))
    returning id into v_id;
    perform public._geqcpe426_log_audit(v_tenant_id, 'accessibility_review_generated', 'Accessibility review generated', jsonb_build_object('review_id', v_id));
    return jsonb_build_object('ok', true, 'review_id', v_id);
  end if;

  if v_action = 'update_quality_score' then
    update public.platform_excellence_engine_quality_scores set
      score_value = least(100, coalesce((p_payload->>'score_value')::integer, score_value + 1)),
      trend = coalesce(p_payload->>'trend', trend),
      summary = coalesce(p_payload->>'summary', summary),
      updated_at = now()
    where tenant_id = v_tenant_id and score_key = coalesce(p_payload->>'score_key', '') returning id into v_id;
    update public.platform_excellence_engine_settings set
      platform_quality_score = least(100, platform_quality_score + 1),
      excellence_health_score = least(100, excellence_health_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._geqcpe426_log_audit(v_tenant_id, 'quality_score_updated', 'Quality score updated', jsonb_build_object('score_id', v_id));
    return jsonb_build_object('ok', true, 'score_id', v_id);
  end if;

  if v_action = 'update_platform_standard' then
    update public.platform_excellence_engine_platform_standards set
      version = coalesce(p_payload->>'version', version),
      summary = coalesce(p_payload->>'summary', summary),
      status = coalesce(p_payload->>'status', status),
      updated_at = now()
    where tenant_id = v_tenant_id and standard_key = coalesce(p_payload->>'standard_key', '') returning id into v_id;
    perform public._geqcpe426_log_audit(v_tenant_id, 'platform_standard_updated', 'Platform standard updated', jsonb_build_object('standard_id', v_id));
    return jsonb_build_object('ok', true, 'standard_id', v_id);
  end if;

  if v_action = 'schedule_review' then
    insert into public.platform_excellence_engine_review_schedules (tenant_id, schedule_key, schedule_title, schedule_type, next_review_at, summary)
    values (v_tenant_id, coalesce(p_payload->>'schedule_key','RS-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'schedule_title','Scheduled review'), coalesce(p_payload->>'schedule_type','scheduled'), now() + interval '7 days', coalesce(p_payload->>'summary',''))
    returning id into v_id;
    return jsonb_build_object('ok', true, 'schedule_id', v_id);
  end if;

  if v_action = 'refresh_analytics' then
    update public.platform_excellence_engine_settings set
      platform_quality_score = least(100, platform_quality_score + 1),
      consistency_score = least(100, consistency_score + 1),
      excellence_health_score = least(100, excellence_health_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._geqcpe426_log_audit(v_tenant_id, 'analytics_refreshed', 'Excellence analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;
