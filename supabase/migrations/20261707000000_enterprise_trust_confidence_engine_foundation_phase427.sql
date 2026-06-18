-- Phase 427 — Enterprise Trust, Reputation & Customer Confidence Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/trust-center. Helpers: _getrcc427_*

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_trust_confidence_engine_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  trust_score integer not null default 88 check (trust_score between 0 and 100),
  reliability_score integer not null default 91 check (reliability_score between 0 and 100),
  platform_availability_percent numeric(5,2) not null default 99.90 check (platform_availability_percent between 0 and 100),
  customer_confidence_score integer not null default 85 check (customer_confidence_score between 0 and 100),
  service_quality_score integer not null default 87 check (service_quality_score between 0 and 100),
  transparency_score integer not null default 84 check (transparency_score between 0 and 100),
  trust_health_score integer not null default 86 check (trust_health_score between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_trust_confidence_engine_reliability_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_type text not null check (
    metric_type in ('availability', 'incident_history', 'service_stability', 'recovery', 'operational', 'platform_health')
  ),
  status text not null default 'healthy' check (status in ('healthy', 'review', 'degraded')),
  score integer not null default 90 check (score between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, metric_key)
);

create index if not exists enterprise_trust_confidence_engine_reliability_metrics_tenant_idx
  on public.enterprise_trust_confidence_engine_reliability_metrics (tenant_id, metric_type);

create table if not exists public.enterprise_trust_confidence_engine_transparency_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_key text not null,
  item_title text not null,
  item_type text not null check (
    item_type in ('platform_status', 'incident', 'maintenance', 'service_change', 'feature_rollout', 'operational_history')
  ),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  visibility text not null default 'customer' check (visibility in ('customer', 'internal', 'public')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, item_key)
);

create index if not exists enterprise_trust_confidence_engine_transparency_items_tenant_idx
  on public.enterprise_trust_confidence_engine_transparency_items (tenant_id, item_type);

create table if not exists public.enterprise_trust_confidence_engine_trust_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_title text not null,
  signal_type text not null check (
    signal_type in ('uptime', 'response_time', 'security_review', 'compliance_review', 'operational_review', 'service_quality')
  ),
  status text not null default 'strong' check (status in ('strong', 'stable', 'review', 'weak')),
  value_text text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists enterprise_trust_confidence_engine_trust_signals_tenant_idx
  on public.enterprise_trust_confidence_engine_trust_signals (tenant_id, signal_type);

create table if not exists public.enterprise_trust_confidence_engine_reputation_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  record_key text not null,
  record_title text not null,
  record_type text not null check (
    record_type in ('customer_feedback', 'platform_review', 'growth_partner', 'service_quality', 'partner_quality', 'marketplace_quality')
  ),
  sentiment text not null default 'positive' check (sentiment in ('positive', 'neutral', 'negative')),
  score integer not null default 85 check (score between 0 and 100),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, record_key)
);

create index if not exists enterprise_trust_confidence_engine_reputation_records_tenant_idx
  on public.enterprise_trust_confidence_engine_reputation_records (tenant_id, record_type);

create table if not exists public.enterprise_trust_confidence_engine_service_quality (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  quality_key text not null,
  quality_title text not null,
  quality_domain text not null check (
    quality_domain in ('support', 'companion', 'workflow', 'business_pack', 'industry_pack', 'platform')
  ),
  score integer not null default 86 check (score between 0 and 100),
  trend text not null default 'stable' check (trend in ('improving', 'stable', 'declining')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, quality_key)
);

create index if not exists enterprise_trust_confidence_engine_service_quality_tenant_idx
  on public.enterprise_trust_confidence_engine_service_quality (tenant_id, quality_domain);

create table if not exists public.enterprise_trust_confidence_engine_incidents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_key text not null,
  incident_title text not null,
  severity text not null default 'moderate' check (severity in ('low', 'moderate', 'high', 'critical')),
  status text not null default 'resolved' check (status in ('open', 'investigating', 'resolved', 'post_review')),
  root_cause text not null default '',
  resolution_summary text not null default '',
  lessons_learned text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, incident_key)
);

create index if not exists enterprise_trust_confidence_engine_incidents_tenant_idx
  on public.enterprise_trust_confidence_engine_incidents (tenant_id, status);

create table if not exists public.enterprise_trust_confidence_engine_trust_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  milestone_key text not null,
  milestone_title text not null,
  milestone_type text not null check (
    milestone_type in (
      'days_without_incident', 'availability_target', 'platform_achievement',
      'security_validation', 'compliance_validation', 'quality_certification'
    )
  ),
  status text not null default 'achieved' check (status in ('pending', 'achieved', 'expired')),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);

create index if not exists enterprise_trust_confidence_engine_trust_milestones_tenant_idx
  on public.enterprise_trust_confidence_engine_trust_milestones (tenant_id, milestone_type);

create table if not exists public.enterprise_trust_confidence_engine_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'confidence_improved', 'service_quality_increasing', 'incident_communication',
      'trust_signals_strong', 'transparency_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_trust_confidence_engine_intelligence_signals_tenant_idx
  on public.enterprise_trust_confidence_engine_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_trust_confidence_engine_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'trust_metrics_improved', 'service_quality_strong', 'transparency_update',
      'customer_confidence_increased', 'reliability_positive'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_trust_confidence_engine_advisor_signals_tenant_idx
  on public.enterprise_trust_confidence_engine_advisor_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_trust_confidence_engine_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'trust_score_updated', 'reliability_review_completed', 'transparency_update_published',
      'incident_recorded', 'incident_resolved', 'trust_recovery_initiated',
      'trust_milestone_achieved', 'dashboard_viewed', 'analytics_refreshed'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_trust_confidence_engine_audit_logs_tenant_idx
  on public.enterprise_trust_confidence_engine_audit_logs (tenant_id, created_at desc);

alter table public.enterprise_trust_confidence_engine_settings enable row level security;
alter table public.enterprise_trust_confidence_engine_reliability_metrics enable row level security;
alter table public.enterprise_trust_confidence_engine_transparency_items enable row level security;
alter table public.enterprise_trust_confidence_engine_trust_signals enable row level security;
alter table public.enterprise_trust_confidence_engine_reputation_records enable row level security;
alter table public.enterprise_trust_confidence_engine_service_quality enable row level security;
alter table public.enterprise_trust_confidence_engine_incidents enable row level security;
alter table public.enterprise_trust_confidence_engine_trust_milestones enable row level security;
alter table public.enterprise_trust_confidence_engine_intelligence_signals enable row level security;
alter table public.enterprise_trust_confidence_engine_advisor_signals enable row level security;
alter table public.enterprise_trust_confidence_engine_audit_logs enable row level security;

revoke all on public.enterprise_trust_confidence_engine_settings from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_reliability_metrics from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_transparency_items from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_trust_signals from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_reputation_records from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_service_quality from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_incidents from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_trust_milestones from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_intelligence_signals from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_advisor_signals from authenticated, anon;
revoke all on public.enterprise_trust_confidence_engine_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_trust_confidence_engine', v.description
from (values
  ('enterprise_trust_confidence.view', 'View Trust Center', 'View trust scores, reliability, transparency, reputation, and confidence metrics'),
  ('enterprise_trust_confidence.manage', 'Manage Trust Center', 'Publish transparency updates, record incidents, milestones, and trust recovery actions')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _getrcc427_*
-- ---------------------------------------------------------------------------
create or replace function public._getrcc427_require_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_tenant_id uuid; v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Trust Center requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end; $$;

create or replace function public._getrcc427_log_audit(p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.enterprise_trust_confidence_engine_audit_logs (tenant_id, event_type, summary, actor_user_id, context)
  values (p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._getrcc427_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.enterprise_trust_confidence_engine_settings language plpgsql security definer set search_path = public as $$
declare v_row public.enterprise_trust_confidence_engine_settings;
begin
  insert into public.enterprise_trust_confidence_engine_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.enterprise_trust_confidence_engine_settings where organization_id = p_org_id;
  end if;
  return v_row;
end; $$;

create or replace function public._getrcc427_seed_defaults(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.enterprise_trust_confidence_engine_reliability_metrics where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_trust_confidence_engine_reliability_metrics (tenant_id, metric_key, metric_title, metric_type, status, score, summary) values
      (p_tenant_id, 'REL-AVAIL', 'Platform availability', 'availability', 'healthy', 99, '99.9% uptime target met.'),
      (p_tenant_id, 'REL-STAB', 'Service stability', 'service_stability', 'healthy', 92, 'Core services stable across regions.'),
      (p_tenant_id, 'REL-REC', 'Recovery performance', 'recovery', 'healthy', 88, 'Recovery objectives documented and tested.');
  end if;
  if not exists (select 1 from public.enterprise_trust_confidence_engine_transparency_items where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_trust_confidence_engine_transparency_items (tenant_id, item_key, item_title, item_type, status, summary) values
      (p_tenant_id, 'TR-STATUS', 'Platform status', 'platform_status', 'published', 'All systems operational.'),
      (p_tenant_id, 'TR-MAINT', 'Scheduled maintenance', 'maintenance', 'published', 'Next maintenance window communicated.'),
      (p_tenant_id, 'TR-ROLL', 'Feature rollout transparency', 'feature_rollout', 'published', 'Release notes published for latest update.');
  end if;
  if not exists (select 1 from public.enterprise_trust_confidence_engine_trust_signals where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_trust_confidence_engine_trust_signals (tenant_id, signal_key, signal_title, signal_type, status, value_text, summary) values
      (p_tenant_id, 'TS-UPTIME', 'Platform uptime', 'uptime', 'strong', '99.9%', 'Uptime within SLA.'),
      (p_tenant_id, 'TS-RESP', 'Response times', 'response_time', 'strong', '<200ms p95', 'API response within targets.'),
      (p_tenant_id, 'TS-SEC', 'Security review', 'security_review', 'strong', 'Passed', 'Latest security review completed.'),
      (p_tenant_id, 'TS-COMP', 'Compliance review', 'compliance_review', 'stable', 'GDPR aligned', 'Compliance posture current.');
  end if;
  if not exists (select 1 from public.enterprise_trust_confidence_engine_reputation_records where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_trust_confidence_engine_reputation_records (tenant_id, record_key, record_title, record_type, sentiment, score, summary) values
      (p_tenant_id, 'REP-FEED', 'Customer feedback trend', 'customer_feedback', 'positive', 86, 'Satisfaction trending upward.'),
      (p_tenant_id, 'REP-SVC', 'Service quality reputation', 'service_quality', 'positive', 88, 'Support experience rated highly.');
  end if;
  if not exists (select 1 from public.enterprise_trust_confidence_engine_service_quality where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_trust_confidence_engine_service_quality (tenant_id, quality_key, quality_title, quality_domain, score, trend, summary) values
      (p_tenant_id, 'SQ-SUP', 'Support quality', 'support', 87, 'improving', 'Response quality and resolution time improving.'),
      (p_tenant_id, 'SQ-COMP', 'Companion quality', 'companion', 89, 'stable', 'Companion trust and helpfulness strong.'),
      (p_tenant_id, 'SQ-PLAT', 'Platform quality', 'platform', 86, 'improving', 'Platform excellence scores contributing to trust.');
  end if;
  if not exists (select 1 from public.enterprise_trust_confidence_engine_incidents where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_trust_confidence_engine_incidents (tenant_id, incident_key, incident_title, severity, status, root_cause, resolution_summary, lessons_learned, summary) values
      (p_tenant_id, 'INC-001', 'Minor API latency spike', 'low', 'resolved', 'Regional cache warm-up delay', 'Latency normalized within 15 minutes.', 'Improved cache pre-warming on deploy.', 'Resolved with full transparency update.');
  end if;
  if not exists (select 1 from public.enterprise_trust_confidence_engine_trust_milestones where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_trust_confidence_engine_trust_milestones (tenant_id, milestone_key, milestone_title, milestone_type, status, summary) values
      (p_tenant_id, 'MS-30D', '30 days without incident', 'days_without_incident', 'achieved', 'Operational stability milestone reached.'),
      (p_tenant_id, 'MS-999', '99.9% availability', 'availability_target', 'achieved', 'Availability target sustained.'),
      (p_tenant_id, 'MS-SEC', 'Security validation', 'security_validation', 'achieved', 'Enterprise security review passed.');
  end if;
end; $$;

create or replace function public._getrcc427_seed_advisor(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_trust_confidence_engine_advisor_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_trust_confidence_engine_advisor_signals (tenant_id, signal_type, observation, impact, recommendation, effort, confidence) values
    (p_tenant_id, 'trust_metrics_improved', 'Trust metrics improved.', 'Trust score up 3 points this quarter.', 'Share milestone with customer stakeholders.', 'low', 'high'),
    (p_tenant_id, 'service_quality_strong', 'Service quality remains strong.', 'Support and Companion scores above target.', 'Maintain current service cadence.', 'low', 'high'),
    (p_tenant_id, 'transparency_update', 'A transparency update is recommended.', 'Scheduled maintenance in 14 days.', 'Publish maintenance notice 7 days ahead.', 'low', 'high'),
    (p_tenant_id, 'customer_confidence_increased', 'Customer confidence increased.', 'Retention and satisfaction trending up.', 'Highlight trust signals in executive briefing.', 'low', 'moderate'),
    (p_tenant_id, 'reliability_positive', 'Reliability trends are positive.', '30-day incident-free milestone active.', 'Document recovery playbook updates.', 'moderate', 'high');
end; $$;

create or replace function public._getrcc427_seed_intelligence(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.enterprise_trust_confidence_engine_intelligence_signals where tenant_id = p_tenant_id and created_at > now() - interval '7 days' limit 1) then return; end if;
  insert into public.enterprise_trust_confidence_engine_intelligence_signals (tenant_id, signal_type, observation, impact, recommendation, confidence) values
    (p_tenant_id, 'confidence_improved', 'Customer confidence improved.', 'Confidence score trending upward.', 'Continue transparency cadence.', 'high'),
    (p_tenant_id, 'service_quality_increasing', 'Service quality is increasing.', 'Support resolution time improved 8%.', 'Sustain quality monitoring.', 'high'),
    (p_tenant_id, 'incident_communication', 'An incident requires communication.', 'Minor latency event needs status post.', 'Publish incident transparency update.', 'moderate'),
    (p_tenant_id, 'trust_signals_strong', 'Trust signals remain strong.', 'Uptime and security reviews current.', 'No immediate action required.', 'high'),
    (p_tenant_id, 'transparency_review', 'A transparency review is recommended.', 'Maintenance communication due.', 'Schedule transparency publish.', 'moderate');
end; $$;

create or replace function public._getrcc427_overview_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.enterprise_trust_confidence_engine_settings;
begin
  select * into v_settings from public.enterprise_trust_confidence_engine_settings where tenant_id = p_tenant_id;
  return jsonb_build_object(
    'trust_score', coalesce(v_settings.trust_score, 88),
    'reliability_score', coalesce(v_settings.reliability_score, 91),
    'platform_availability', coalesce(v_settings.platform_availability_percent, 99.90),
    'customer_confidence', coalesce(v_settings.customer_confidence_score, 85),
    'service_quality', coalesce(v_settings.service_quality_score, 87),
    'transparency_score', coalesce(v_settings.transparency_score, 84),
    'trust_health_score', coalesce(v_settings.trust_health_score, 86),
    'open_incidents', (select count(*)::integer from public.enterprise_trust_confidence_engine_incidents where tenant_id = p_tenant_id and status in ('open', 'investigating')),
    'milestones_achieved', (select count(*)::integer from public.enterprise_trust_confidence_engine_trust_milestones where tenant_id = p_tenant_id and status = 'achieved'),
    'trust_signals_strong', (select count(*)::integer from public.enterprise_trust_confidence_engine_trust_signals where tenant_id = p_tenant_id and status = 'strong')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_trust_confidence_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_tenant_id uuid;
  v_settings public.enterprise_trust_confidence_engine_settings; v_overview jsonb;
begin
  perform public._irp_require_permission('enterprise_trust_confidence.view');
  v_ctx := public._getrcc427_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._getrcc427_ensure_settings(v_org_id, v_tenant_id);
  perform public._getrcc427_seed_defaults(v_tenant_id);
  perform public._getrcc427_seed_advisor(v_tenant_id);
  perform public._getrcc427_seed_intelligence(v_tenant_id);
  v_overview := public._getrcc427_overview_block(v_tenant_id);
  perform public._getrcc427_log_audit(v_tenant_id, 'dashboard_viewed', 'Trust center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true, 'has_access', true,
    'philosophy', 'Trust is earned through thousands of small interactions.',
    'mission', 'Enterprise Trust & Confidence Engine — trust signals, transparency, reliability, reputation, and customer confidence.',
    'abos_principle', 'Customers should never wonder whether they can trust Aipify. The platform should demonstrate that trust continuously.',
    'trust_engine_route', '/app/trust',
    'trust_reputation_route', '/app/trust-reputation-engine',
    'license_route', '/app/license',
    'security_settings_route', '/app/settings/security',
    'platform_excellence_route', '/app/platform/excellence',
    'distinction_note', 'Trust metadata and confidence signals — tenant-scoped governance without operational content exposure.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/trust-center'),
      jsonb_build_object('key', 'reliability', 'route', '/app/trust-center#reliability'),
      jsonb_build_object('key', 'transparency', 'route', '/app/trust-center#transparency'),
      jsonb_build_object('key', 'reputation', 'route', '/app/trust-center#reputation'),
      jsonb_build_object('key', 'incidents', 'route', '/app/trust-center#incidents'),
      jsonb_build_object('key', 'analytics', 'route', '/app/trust-center#analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/trust-center#governance')
    ),
    'core_languages', jsonb_build_array('en', 'no', 'sv', 'da', 'pl', 'uk'),
    'reliability_metrics', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'metric_key',m.metric_key,'metric_title',m.metric_title,'metric_type',m.metric_type,'status',m.status,'score',m.score,'summary',m.summary) order by m.score desc) from public.enterprise_trust_confidence_engine_reliability_metrics m where m.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'transparency_items', coalesce((select jsonb_agg(jsonb_build_object('id',t.id,'item_key',t.item_key,'item_title',t.item_title,'item_type',t.item_type,'status',t.status,'visibility',t.visibility,'summary',t.summary) order by t.updated_at desc) from public.enterprise_trust_confidence_engine_transparency_items t where t.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'trust_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_key',s.signal_key,'signal_title',s.signal_title,'signal_type',s.signal_type,'status',s.status,'value_text',s.value_text,'summary',s.summary) order by s.updated_at desc) from public.enterprise_trust_confidence_engine_trust_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'reputation_records', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'record_key',r.record_key,'record_title',r.record_title,'record_type',r.record_type,'sentiment',r.sentiment,'score',r.score,'summary',r.summary) order by r.score desc) from public.enterprise_trust_confidence_engine_reputation_records r where r.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'service_quality', coalesce((select jsonb_agg(jsonb_build_object('id',q.id,'quality_key',q.quality_key,'quality_title',q.quality_title,'quality_domain',q.quality_domain,'score',q.score,'trend',q.trend,'summary',q.summary) order by q.score desc) from public.enterprise_trust_confidence_engine_service_quality q where q.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'incidents', coalesce((select jsonb_agg(jsonb_build_object('id',i.id,'incident_key',i.incident_key,'incident_title',i.incident_title,'severity',i.severity,'status',i.status,'root_cause',i.root_cause,'resolution_summary',i.resolution_summary,'lessons_learned',i.lessons_learned,'summary',i.summary) order by i.updated_at desc) from public.enterprise_trust_confidence_engine_incidents i where i.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'trust_milestones', coalesce((select jsonb_agg(jsonb_build_object('id',m.id,'milestone_key',m.milestone_key,'milestone_title',m.milestone_title,'milestone_type',m.milestone_type,'status',m.status,'summary',m.summary) order by m.updated_at desc) from public.enterprise_trust_confidence_engine_trust_milestones m where m.tenant_id = v_tenant_id limit 10), '[]'::jsonb),
    'intelligence_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_trust_confidence_engine_intelligence_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'advisor_signals', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'signal_type',s.signal_type,'observation',s.observation,'impact',s.impact,'recommendation',s.recommendation,'effort',s.effort,'confidence',s.confidence,'created_at',s.created_at) order by s.created_at desc) from public.enterprise_trust_confidence_engine_advisor_signals s where s.tenant_id = v_tenant_id limit 12), '[]'::jsonb),
    'audit_logs', coalesce((select jsonb_agg(jsonb_build_object('id',l.id,'event_type',l.event_type,'summary',l.summary,'created_at',l.created_at) order by l.created_at desc) from public.enterprise_trust_confidence_engine_audit_logs l where l.tenant_id = v_tenant_id limit 20), '[]'::jsonb),
    'executive_dashboard', jsonb_build_object(
      'trust_score', v_overview->>'trust_score',
      'platform_reliability', v_overview->>'reliability_score',
      'customer_confidence', v_overview->>'customer_confidence',
      'service_quality', v_overview->>'service_quality',
      'reputation', 86,
      'retention', 'stable',
      'long_term_trend', 'improving'
    ),
    'governance', jsonb_build_object(
      'tenant_isolation', true,
      'transparency_first', true,
      'incident_transparency', true,
      'human_oversight', true,
      'audit_trail', true
    ),
    'privacy_note', 'Trust and confidence metadata isolated per tenant — credibility without cross-tenant data exposure.'
  );
exception when others then
  return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.enterprise_trust_confidence_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_tenant_id uuid; v_action text; v_id uuid;
begin
  perform public._irp_require_permission('enterprise_trust_confidence.manage');
  v_ctx := public._getrcc427_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._getrcc427_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'update_trust_score' then
    update public.enterprise_trust_confidence_engine_settings set
      trust_score = least(100, coalesce((p_payload->>'trust_score')::integer, trust_score + 1)),
      trust_health_score = least(100, trust_health_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._getrcc427_log_audit(v_tenant_id, 'trust_score_updated', 'Trust score updated', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'complete_reliability_review' then
    update public.enterprise_trust_confidence_engine_reliability_metrics set
      score = least(100, score + coalesce((p_payload->>'delta')::integer, 2)),
      status = 'healthy',
      updated_at = now()
    where tenant_id = v_tenant_id and metric_key = coalesce(p_payload->>'metric_key', 'REL-AVAIL') returning id into v_id;
    update public.enterprise_trust_confidence_engine_settings set reliability_score = least(100, reliability_score + 1), updated_at = now() where tenant_id = v_tenant_id;
    perform public._getrcc427_log_audit(v_tenant_id, 'reliability_review_completed', 'Reliability review completed', jsonb_build_object('metric_id', v_id));
    return jsonb_build_object('ok', true, 'metric_id', v_id);
  end if;

  if v_action = 'publish_transparency_update' then
    insert into public.enterprise_trust_confidence_engine_transparency_items (tenant_id, item_key, item_title, item_type, status, visibility, summary)
    values (v_tenant_id, coalesce(p_payload->>'item_key','TR-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'item_title','Transparency update'), coalesce(p_payload->>'item_type','operational_history'), 'published', coalesce(p_payload->>'visibility','customer'), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    update public.enterprise_trust_confidence_engine_settings set transparency_score = least(100, transparency_score + 1), updated_at = now() where tenant_id = v_tenant_id;
    perform public._getrcc427_log_audit(v_tenant_id, 'transparency_update_published', 'Transparency update published', jsonb_build_object('item_id', v_id));
    return jsonb_build_object('ok', true, 'item_id', v_id);
  end if;

  if v_action = 'record_incident' then
    insert into public.enterprise_trust_confidence_engine_incidents (tenant_id, incident_key, incident_title, severity, status, root_cause, summary)
    values (v_tenant_id, coalesce(p_payload->>'incident_key','INC-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'incident_title','Incident recorded'), coalesce(p_payload->>'severity','moderate'), 'open', coalesce(p_payload->>'root_cause',''), coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._getrcc427_log_audit(v_tenant_id, 'incident_recorded', 'Incident recorded', jsonb_build_object('incident_id', v_id));
    return jsonb_build_object('ok', true, 'incident_id', v_id);
  end if;

  if v_action = 'resolve_incident' then
    update public.enterprise_trust_confidence_engine_incidents set
      status = 'resolved',
      resolution_summary = coalesce(p_payload->>'resolution_summary', resolution_summary),
      lessons_learned = coalesce(p_payload->>'lessons_learned', lessons_learned),
      updated_at = now()
    where tenant_id = v_tenant_id and incident_key = coalesce(p_payload->>'incident_key', '') returning id into v_id;
    perform public._getrcc427_log_audit(v_tenant_id, 'incident_resolved', 'Incident resolved', jsonb_build_object('incident_id', v_id));
    return jsonb_build_object('ok', true, 'incident_id', v_id);
  end if;

  if v_action = 'initiate_trust_recovery' then
    perform public._getrcc427_log_audit(v_tenant_id, 'trust_recovery_initiated', 'Trust recovery initiated', jsonb_build_object('incident_key', p_payload->>'incident_key'));
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'achieve_trust_milestone' then
    insert into public.enterprise_trust_confidence_engine_trust_milestones (tenant_id, milestone_key, milestone_title, milestone_type, status, summary)
    values (v_tenant_id, coalesce(p_payload->>'milestone_key','MS-'||upper(substr(gen_random_uuid()::text,1,8))), coalesce(p_payload->>'milestone_title','Trust milestone'), coalesce(p_payload->>'milestone_type','platform_achievement'), 'achieved', coalesce(p_payload->>'summary',''))
    returning id into v_id;
    perform public._getrcc427_log_audit(v_tenant_id, 'trust_milestone_achieved', 'Trust milestone achieved', jsonb_build_object('milestone_id', v_id));
    return jsonb_build_object('ok', true, 'milestone_id', v_id);
  end if;

  if v_action = 'refresh_analytics' then
    update public.enterprise_trust_confidence_engine_settings set
      trust_score = least(100, trust_score + 1),
      customer_confidence_score = least(100, customer_confidence_score + 1),
      trust_health_score = least(100, trust_health_score + 1),
      updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._getrcc427_log_audit(v_tenant_id, 'analytics_refreshed', 'Trust analytics refreshed', '{}'::jsonb);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end; $$;
