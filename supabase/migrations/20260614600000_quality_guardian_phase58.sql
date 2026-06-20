-- Phase 58 — Quality Guardian & Software Health Monitor (QG)

-- ---------------------------------------------------------------------------
-- 1. aipify_quality_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_quality_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  observation_mode boolean not null default true,
  auto_fix_enabled boolean not null default false,
  notify_developers boolean not null default true,
  create_admin_tasks boolean not null default true,
  open_knowledge_gaps boolean not null default true,
  scan_interval_hours int not null default 24,
  enabled_scanners jsonb not null default '["link_monitor","journey_monitor","integration_monitor","workflow_validator","translation_monitor","mobile_monitor"]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_quality_settings enable row level security;
revoke all on public.aipify_quality_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_quality_checks (expected behaviour definitions)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_quality_checks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  check_key text not null,
  scanner_type text not null check (
    scanner_type in (
      'link_monitor', 'journey_monitor', 'integration_monitor', 'performance_monitor',
      'translation_monitor', 'mobile_monitor', 'workflow_validator'
    )
  ),
  category text not null default 'workflow' check (
    category in ('links', 'journeys', 'integrations', 'performance', 'translation', 'mobile', 'workflow', 'governance')
  ),
  title text not null,
  description text not null default '',
  expected_behavior text not null,
  target_url text,
  workflow_key text,
  integration_key text,
  locale_codes text[] not null default '{}',
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, check_key)
);

create index if not exists aipify_quality_checks_tenant_idx
  on public.aipify_quality_checks (tenant_id, scanner_type, active);

alter table public.aipify_quality_checks enable row level security;
revoke all on public.aipify_quality_checks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_quality_scan_runs
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_quality_scan_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scan_type text not null check (
    scan_type in ('full', 'links', 'workflows', 'integrations', 'translations', 'mobile', 'journeys', 'summary')
  ),
  status text not null default 'queued' check (
    status in ('queued', 'running', 'completed', 'failed', 'cancelled')
  ),
  summary text,
  findings jsonb not null default '{}'::jsonb,
  checks_passed int not null default 0,
  checks_failed int not null default 0,
  incidents_created int not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists aipify_quality_scan_runs_tenant_idx
  on public.aipify_quality_scan_runs (tenant_id, created_at desc);

alter table public.aipify_quality_scan_runs enable row level security;
revoke all on public.aipify_quality_scan_runs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_quality_incidents
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_quality_incidents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  check_id uuid references public.aipify_quality_checks (id) on delete set null,
  scan_run_id uuid references public.aipify_quality_scan_runs (id) on delete set null,
  incident_key text not null,
  title text not null,
  severity text not null default 'medium' check (
    severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  status text not null default 'open' check (
    status in ('open', 'investigating', 'resolved', 'false_positive')
  ),
  expected_behavior text not null,
  observed_behavior text not null,
  impact text not null default '',
  evidence jsonb not null default '{}'::jsonb,
  suggested_fix text not null default '',
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  scanner_type text,
  category text,
  admin_task_id uuid,
  knowledge_gap_id uuid references public.aipify_knowledge_gaps (id) on delete set null,
  false_positive_reason text,
  resolved_by_user_id uuid references public.users (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, incident_key)
);

create index if not exists aipify_quality_incidents_tenant_idx
  on public.aipify_quality_incidents (tenant_id, status, severity, created_at desc);

alter table public.aipify_quality_incidents enable row level security;
revoke all on public.aipify_quality_incidents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_quality_reports
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_quality_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_id uuid references public.aipify_quality_incidents (id) on delete cascade,
  title text not null,
  report_body text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_quality_reports_tenant_idx
  on public.aipify_quality_reports (tenant_id, created_at desc);

alter table public.aipify_quality_reports enable row level security;
revoke all on public.aipify_quality_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_quality_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_quality_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  incident_id uuid references public.aipify_quality_incidents (id) on delete set null,
  recommendation_text text not null,
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  requires_approval boolean not null default true,
  status text not null default 'active' check (
    status in ('active', 'accepted', 'dismissed', 'implemented')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aipify_quality_recommendations_tenant_idx
  on public.aipify_quality_recommendations (tenant_id, status, created_at desc);

alter table public.aipify_quality_recommendations enable row level security;
revoke all on public.aipify_quality_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. aipify_quality_incident_events
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_quality_incident_events (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.aipify_quality_incidents (id) on delete cascade,
  event_type text not null,
  title text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null default 'system',
  created_at timestamptz not null default now()
);

create index if not exists aipify_quality_incident_events_incident_idx
  on public.aipify_quality_incident_events (incident_id, created_at desc);

alter table public.aipify_quality_incident_events enable row level security;
revoke all on public.aipify_quality_incident_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._qg_tenant_plan(p_tenant_id uuid)
returns text
language sql stable security definer set search_path = public
as $$
  select coalesce(s.plan_key, s.plan_type, 'starter')
  from public.subscriptions s where s.customer_id = p_tenant_id limit 1;
$$;

create or replace function public._qg_package_allows(p_tenant_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public._qg_tenant_plan(p_tenant_id) in ('business', 'enterprise');
$$;

create or replace function public._qg_require_access(p_tenant_id uuid default null)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._presence_tenant_for_auth());
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  if not public._qg_package_allows(v_tenant_id) then
    raise exception 'Quality Guardian requires Business or Enterprise';
  end if;
  return v_tenant_id;
end;
$$;

create or replace function public._qg_ensure_settings(p_tenant_id uuid)
returns public.aipify_quality_settings
language plpgsql security definer set search_path = public
as $$
declare v_row public.aipify_quality_settings;
begin
  insert into public.aipify_quality_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_quality_settings where tenant_id = p_tenant_id;
  return v_row;
end;
$$;

create or replace function public._qg_incident_event(
  p_incident_id uuid, p_event_type text, p_title text, p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.aipify_quality_incident_events (incident_id, event_type, title, metadata)
  values (p_incident_id, p_event_type, p_title, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

create or replace function public._qg_format_report(p_inc public.aipify_quality_incidents)
returns text
language sql immutable
as $$
  select format(
    E'Expected behaviour:\n%s\n\nObserved behaviour:\n%s\n\nImpact:\n%s\n\nEvidence:\n%s\n\nSuggested fix:\n%s\n\nPriority:\n%s',
    p_inc.expected_behavior,
    p_inc.observed_behavior,
    coalesce(nullif(p_inc.impact, ''), 'Users and operations may be affected.'),
    coalesce(p_inc.evidence::text, '{}'),
    coalesce(nullif(p_inc.suggested_fix, ''), 'Investigate root cause and apply a reviewed fix.'),
    initcap(p_inc.priority)
  );
$$;

create or replace function public._qg_severity_to_priority(p_severity text)
returns text
language sql immutable
as $$
  select case p_severity
    when 'critical' then 'critical'
    when 'high' then 'high'
    when 'medium' then 'medium'
    when 'low' then 'low'
    else 'low'
  end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Seed / upsert quality checks
-- ---------------------------------------------------------------------------
create or replace function public.seed_quality_checks(p_tenant_id uuid, p_checks jsonb)
returns int
language plpgsql security definer set search_path = public
as $$
declare v_item jsonb; v_count int := 0;
begin
  perform public._qg_require_access(p_tenant_id);

  for v_item in select * from jsonb_array_elements(coalesce(p_checks, '[]'::jsonb))
  loop
    insert into public.aipify_quality_checks (
      tenant_id, check_key, scanner_type, category, title, description,
      expected_behavior, target_url, workflow_key, integration_key, locale_codes, active, metadata
    ) values (
      p_tenant_id,
      v_item->>'check_key',
      coalesce(v_item->>'scanner_type', 'journey_monitor'),
      coalesce(v_item->>'category', 'journeys'),
      v_item->>'title',
      coalesce(v_item->>'description', ''),
      v_item->>'expected_behavior',
      v_item->>'target_url',
      v_item->>'workflow_key',
      v_item->>'integration_key',
      coalesce(array(select jsonb_array_elements_text(v_item->'locale_codes')), '{}'),
      coalesce((v_item->>'active')::boolean, true),
      coalesce(v_item->'metadata', '{}'::jsonb)
    )
    on conflict (tenant_id, check_key) do update set
      scanner_type = excluded.scanner_type,
      category = excluded.category,
      title = excluded.title,
      description = excluded.description,
      expected_behavior = excluded.expected_behavior,
      target_url = excluded.target_url,
      workflow_key = excluded.workflow_key,
      integration_key = excluded.integration_key,
      locale_codes = excluded.locale_codes,
      active = excluded.active,
      metadata = aipify_quality_checks.metadata || excluded.metadata,
      updated_at = now();
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Create incident + report + recommendation
-- ---------------------------------------------------------------------------
create or replace function public._qg_create_incident(
  p_tenant_id uuid,
  p_scan_run_id uuid,
  p_payload jsonb
)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_settings public.aipify_quality_settings;
  v_inc public.aipify_quality_incidents;
  v_report_id uuid;
  v_rec_id uuid;
  v_gap_id uuid;
  v_check_id uuid;
  v_incident_id uuid;
  v_key text := coalesce(p_payload->>'incident_key', gen_random_uuid()::text);
begin
  v_settings := public._qg_ensure_settings(p_tenant_id);
  v_check_id := (p_payload->>'check_id')::uuid;

  insert into public.aipify_quality_incidents (
    tenant_id, check_id, scan_run_id, incident_key, title, severity, status,
    expected_behavior, observed_behavior, impact, evidence, suggested_fix, priority,
    scanner_type, category
  ) values (
    p_tenant_id,
    v_check_id,
    p_scan_run_id,
    v_key,
    p_payload->>'title',
    coalesce(p_payload->>'severity', 'medium'),
    'open',
    coalesce(p_payload->>'expected_behavior', 'System should behave as documented.'),
    coalesce(p_payload->>'observed_behavior', 'Deviation detected.'),
    coalesce(p_payload->>'impact', ''),
    coalesce(p_payload->'evidence', '{}'::jsonb),
    coalesce(p_payload->>'suggested_fix', ''),
    public._qg_severity_to_priority(coalesce(p_payload->>'severity', 'medium')),
    p_payload->>'scanner_type',
    p_payload->>'category'
  )
  on conflict (tenant_id, incident_key) do update set
    observed_behavior = excluded.observed_behavior,
    evidence = aipify_quality_incidents.evidence || excluded.evidence,
    severity = excluded.severity,
    priority = excluded.priority,
    suggested_fix = excluded.suggested_fix,
    updated_at = now(),
    status = case
      when aipify_quality_incidents.status = 'resolved' then 'open'
      else aipify_quality_incidents.status
    end
  returning * into v_inc;

  v_incident_id := v_inc.id;

  insert into public.aipify_quality_reports (
    tenant_id, incident_id, title, report_body, status
  ) values (
    p_tenant_id,
    v_incident_id,
    'Developer report: ' || v_inc.title,
    public._qg_format_report(v_inc),
    'draft'
  ) returning id into v_report_id;

  insert into public.aipify_quality_recommendations (
    tenant_id, incident_id, recommendation_text, priority, requires_approval, status
  ) values (
    p_tenant_id,
    v_incident_id,
    coalesce(p_payload->>'suggested_fix', 'Review incident and apply an approved fix.'),
    v_inc.priority,
    true,
    'active'
  ) returning id into v_rec_id;

  perform public._qg_incident_event(v_incident_id, 'incident_created', 'Incident opened',
    jsonb_build_object('severity', v_inc.severity, 'report_id', v_report_id));

  if v_settings.open_knowledge_gaps and coalesce(p_payload->>'missing_documentation', '') <> '' then
    v_gap_id := public._kc_upsert_gap(
      p_tenant_id,
      p_payload->>'missing_documentation',
      coalesce(p_payload->>'language', 'en'),
      'quality_guardian',
      0.4,
      (select u.id from public.users u where u.auth_user_id = auth.uid() limit 1)
    );
    update public.aipify_quality_incidents set knowledge_gap_id = v_gap_id where id = v_incident_id;
  end if;

  perform public._tacc_log_audit(
    p_tenant_id, 'aipify', 'quality_incident_created', 'quality', 'success', null,
    jsonb_build_object('incident_id', v_incident_id, 'severity', v_inc.severity, 'title', v_inc.title)
  );

  return v_incident_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Run quality scan (observation mode — reports only)
-- ---------------------------------------------------------------------------
create or replace function public.run_quality_scan(
  p_scan_type text default 'full',
  p_results jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_quality_settings;
  v_run public.aipify_quality_scan_runs;
  v_item jsonb;
  v_passed int := 0;
  v_failed int := 0;
  v_incidents int := 0;
  v_incident_id uuid;
begin
  v_tenant_id := public._qg_require_access();
  v_settings := public._qg_ensure_settings(v_tenant_id);

  if v_settings.auto_fix_enabled then
    raise exception 'Automatic production fixes are disabled in pilot observation mode';
  end if;

  insert into public.aipify_quality_scan_runs (
    tenant_id, scan_type, status, started_at, created_by_user_id
  ) values (
    v_tenant_id, coalesce(p_scan_type, 'full'), 'running', now(),
    (select u.id from public.users u where u.auth_user_id = auth.uid() limit 1)
  ) returning * into v_run;

  for v_item in select * from jsonb_array_elements(coalesce(p_results, '[]'::jsonb))
  loop
    if coalesce((v_item->>'passed')::boolean, false) then
      v_passed := v_passed + 1;
    else
      v_failed := v_failed + 1;
      v_incident_id := public._qg_create_incident(
        v_tenant_id,
        v_run.id,
        v_item || jsonb_build_object('scanner_type', coalesce(v_item->>'scanner_type', p_scan_type))
      );
      v_incidents := v_incidents + 1;
      perform public._qg_incident_event(v_incident_id, 'deviation_detected',
        'Deviation recorded during scan', jsonb_build_object('scan_type', p_scan_type));
    end if;
  end loop;

  update public.aipify_quality_scan_runs set
    status = 'completed',
    summary = format('%s checks passed, %s failed, %s incidents created.', v_passed, v_failed, v_incidents),
    findings = jsonb_build_object('results', p_results, 'observation_mode', v_settings.observation_mode),
    checks_passed = v_passed,
    checks_failed = v_failed,
    incidents_created = v_incidents,
    completed_at = now()
  where id = v_run.id
  returning * into v_run;

  perform public._tacc_log_audit(
    v_tenant_id, 'aipify', 'quality_scan_completed', 'quality', 'success', null,
    jsonb_build_object('scan_id', v_run.id, 'failed', v_failed, 'incidents', v_incidents)
  );

  return jsonb_build_object(
    'scan', jsonb_build_object(
      'id', v_run.id, 'scan_type', v_run.scan_type, 'status', v_run.status,
      'summary', v_run.summary, 'checks_passed', v_run.checks_passed,
      'checks_failed', v_run.checks_failed, 'incidents_created', v_run.incidents_created,
      'completed_at', v_run.completed_at
    ),
    'dashboard', public.get_quality_dashboard()
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. Dashboard & lists
-- ---------------------------------------------------------------------------
create or replace function public.get_quality_dashboard()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_plan text;
  v_settings public.aipify_quality_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_plan := public._qg_tenant_plan(v_tenant_id);
  if not public._qg_package_allows(v_tenant_id) then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'upgrade_required', true,
      'plan', v_plan,
      'privacy_note', 'Quality Guardian observes software health without making production changes automatically.'
    );
  end if;

  v_settings := public._qg_ensure_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'has_access', true,
    'upgrade_required', false,
    'plan', v_plan,
    'observation_mode', v_settings.observation_mode,
    'auto_fix_enabled', v_settings.auto_fix_enabled,
    'widgets', jsonb_build_object(
      'open_incidents', (
        select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating')
      ),
      'critical_incidents', (
        select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating') and severity = 'critical'
      ),
      'broken_links', (
        select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating') and category = 'links'
      ),
      'failed_workflows', (
        select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating') and category = 'workflow'
      ),
      'integration_issues', (
        select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating') and category = 'integrations'
      ),
      'knowledge_gaps', (
        select count(*)::int from public.aipify_knowledge_gaps
        where tenant_id = v_tenant_id and status = 'open'
      ),
      'recommended_actions', (
        select count(*)::int from public.aipify_quality_recommendations
        where tenant_id = v_tenant_id and status = 'active'
      )
    ),
    'recent_incidents', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', i.id, 'title', i.title, 'severity', i.severity, 'status', i.status,
        'category', i.category, 'observed_behavior', i.observed_behavior, 'created_at', i.created_at
      ) order by i.created_at desc)
      from (
        select * from public.aipify_quality_incidents
        where tenant_id = v_tenant_id order by created_at desc limit 10
      ) i),
      '[]'::jsonb
    ),
    'recent_scans', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', s.id, 'scan_type', s.scan_type, 'status', s.status, 'summary', s.summary,
        'checks_passed', s.checks_passed, 'checks_failed', s.checks_failed,
        'incidents_created', s.incidents_created, 'completed_at', s.completed_at
      ) order by s.created_at desc)
      from (
        select * from public.aipify_quality_scan_runs
        where tenant_id = v_tenant_id order by created_at desc limit 5
      ) s),
      '[]'::jsonb
    ),
    'recommended_actions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id, 'recommendation_text', r.recommendation_text,
        'priority', r.priority, 'requires_approval', r.requires_approval, 'incident_id', r.incident_id
      ) order by r.created_at desc)
      from (
        select * from public.aipify_quality_recommendations
        where tenant_id = v_tenant_id and status = 'active' order by created_at desc limit 8
      ) r),
      '[]'::jsonb
    ),
    'privacy_note', 'Quality Guardian compares observed behaviour to documented expectations. Production changes always require approval.'
  );
end;
$$;

create or replace function public.get_quality_incidents(
  p_status text default null,
  p_limit int default 50
)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._qg_require_access();
  return coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', i.id, 'incident_key', i.incident_key, 'title', i.title,
      'severity', i.severity, 'status', i.status, 'category', i.category,
      'scanner_type', i.scanner_type, 'expected_behavior', i.expected_behavior,
      'observed_behavior', i.observed_behavior, 'impact', i.impact,
      'evidence', i.evidence, 'suggested_fix', i.suggested_fix,
      'priority', i.priority, 'knowledge_gap_id', i.knowledge_gap_id,
      'created_at', i.created_at, 'resolved_at', i.resolved_at
    ) order by
      case i.severity when 'critical' then 1 when 'high' then 2 when 'medium' then 3 when 'low' then 4 else 5 end,
      i.created_at desc)
    from (
      select * from public.aipify_quality_incidents
      where tenant_id = v_tenant_id
        and (p_status is null or status = p_status)
      order by created_at desc
      limit greatest(1, least(p_limit, 200))
    ) i),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.get_quality_reports(p_limit int default 50)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._qg_require_access();
  return coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', r.id, 'incident_id', r.incident_id, 'title', r.title,
      'report_body', r.report_body, 'status', r.status, 'created_at', r.created_at
    ) order by r.created_at desc)
    from (
      select * from public.aipify_quality_reports
      where tenant_id = v_tenant_id
      order by created_at desc
      limit greatest(1, least(p_limit, 200))
    ) r),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.get_quality_scans(p_limit int default 30)
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._qg_require_access();
  return coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', s.id, 'scan_type', s.scan_type, 'status', s.status, 'summary', s.summary,
      'findings', s.findings, 'checks_passed', s.checks_passed, 'checks_failed', s.checks_failed,
      'incidents_created', s.incidents_created, 'started_at', s.started_at,
      'completed_at', s.completed_at, 'created_at', s.created_at
    ) order by s.created_at desc)
    from (
      select * from public.aipify_quality_scan_runs
      where tenant_id = v_tenant_id
      order by created_at desc
      limit greatest(1, least(p_limit, 100))
    ) s),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.get_quality_settings()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid; v_row public.aipify_quality_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  if not public._qg_package_allows(v_tenant_id) then
    return jsonb_build_object(
      'has_customer', true,
      'has_access', false,
      'access_state', 'plan_required',
      'upgrade_required', true,
      'message', 'Quality Guardian is available on Business and Enterprise plans, or with an active Quality Guardian Business Pack.'
    );
  end if;
  select * into v_row from public.aipify_quality_settings where tenant_id = v_tenant_id;
  if not found then
    v_row.tenant_id := v_tenant_id;
    v_row.observation_mode := true;
    v_row.auto_fix_enabled := false;
    v_row.notify_developers := true;
    v_row.create_admin_tasks := true;
    v_row.open_knowledge_gaps := true;
    v_row.scan_interval_hours := 24;
    v_row.enabled_scanners := '["link_monitor","journey_monitor","integration_monitor","workflow_validator","translation_monitor","mobile_monitor"]'::jsonb;
  end if;
  return jsonb_build_object(
    'observation_mode', v_row.observation_mode,
    'auto_fix_enabled', v_row.auto_fix_enabled,
    'notify_developers', v_row.notify_developers,
    'create_admin_tasks', v_row.create_admin_tasks,
    'open_knowledge_gaps', v_row.open_knowledge_gaps,
    'scan_interval_hours', v_row.scan_interval_hours,
    'enabled_scanners', v_row.enabled_scanners
  );
end;
$$;

create or replace function public.update_quality_settings(p_patch jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._qg_require_access();
  perform public._qg_ensure_settings(v_tenant_id);

  update public.aipify_quality_settings set
    observation_mode = coalesce((p_patch->>'observation_mode')::boolean, observation_mode),
    notify_developers = coalesce((p_patch->>'notify_developers')::boolean, notify_developers),
    create_admin_tasks = coalesce((p_patch->>'create_admin_tasks')::boolean, create_admin_tasks),
    open_knowledge_gaps = coalesce((p_patch->>'open_knowledge_gaps')::boolean, open_knowledge_gaps),
    scan_interval_hours = coalesce((p_patch->>'scan_interval_hours')::int, scan_interval_hours),
    enabled_scanners = coalesce(p_patch->'enabled_scanners', enabled_scanners),
    auto_fix_enabled = case
      when (p_patch->>'auto_fix_enabled')::boolean = true then false
      else auto_fix_enabled
    end,
    updated_at = now()
  where tenant_id = v_tenant_id;

  perform public._tacc_log_audit(v_tenant_id, 'user', 'quality_settings_updated', 'quality', 'success', null, p_patch);
  return public.get_quality_settings();
end;
$$;

create or replace function public.resolve_quality_incident(
  p_incident_id uuid,
  p_resolution jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_inc public.aipify_quality_incidents;
  v_status text := coalesce(p_resolution->>'status', 'resolved');
begin
  v_tenant_id := public._qg_require_access();

  if v_status not in ('resolved', 'false_positive', 'investigating') then
    raise exception 'Invalid status';
  end if;

  update public.aipify_quality_incidents set
    status = v_status,
    false_positive_reason = p_resolution->>'false_positive_reason',
    resolved_by_user_id = (select u.id from public.users u where u.auth_user_id = auth.uid() limit 1),
    resolved_at = case when v_status in ('resolved', 'false_positive') then now() else resolved_at end,
    updated_at = now()
  where id = p_incident_id and tenant_id = v_tenant_id
  returning * into v_inc;

  if not found then raise exception 'Incident not found'; end if;

  perform public._qg_incident_event(v_inc.id, 'status_changed', 'Incident ' || v_status,
    p_resolution);

  perform public._tacc_log_audit(
    v_tenant_id, 'user', 'quality_incident_resolved', 'quality', 'success', null,
    jsonb_build_object('incident_id', v_inc.id, 'status', v_status)
  );

  return jsonb_build_object('id', v_inc.id, 'status', v_inc.status, 'resolved_at', v_inc.resolved_at);
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. Seed global Quality Guardian KC category marker (via articles import)
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality_guardian', 'Quality Guardian', 'Software health monitoring and incident reporting', 'authenticated', 90
where not exists (
  select 1 from public.aipify_knowledge_categories where slug = 'quality_guardian' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 14. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.seed_quality_checks(uuid, jsonb) to authenticated;
grant execute on function public.run_quality_scan(text, jsonb) to authenticated;
grant execute on function public.get_quality_dashboard() to authenticated;
grant execute on function public.get_quality_incidents(text, int) to authenticated;
grant execute on function public.get_quality_reports(int) to authenticated;
grant execute on function public.get_quality_scans(int) to authenticated;
grant execute on function public.get_quality_settings() to authenticated;
grant execute on function public.update_quality_settings(jsonb) to authenticated;
grant execute on function public.resolve_quality_incident(uuid, jsonb) to authenticated;
