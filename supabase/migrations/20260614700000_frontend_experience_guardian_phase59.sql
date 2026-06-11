-- Phase 59 — Image, Performance & Frontend Experience Guardian (extends Phase 58 QG)

-- ---------------------------------------------------------------------------
-- 1. Extend aipify_quality_settings
-- ---------------------------------------------------------------------------
alter table public.aipify_quality_settings
  add column if not exists image_scanning_enabled boolean not null default true;

alter table public.aipify_quality_settings
  add column if not exists performance_scanning_enabled boolean not null default true;

alter table public.aipify_quality_settings
  add column if not exists mobile_scanning_enabled boolean not null default true;

alter table public.aipify_quality_settings
  add column if not exists seo_scanning_enabled boolean not null default true;

alter table public.aipify_quality_settings
  add column if not exists localization_scanning_enabled boolean not null default true;

alter table public.aipify_quality_settings
  add column if not exists scan_frequency text not null default 'daily';

alter table public.aipify_quality_settings
  add column if not exists max_pages_per_scan int not null default 100;

alter table public.aipify_quality_settings
  add column if not exists max_image_size_warning_kb int not null default 500;

alter table public.aipify_quality_settings
  add column if not exists max_image_size_high_kb int not null default 1500;

alter table public.aipify_quality_settings
  add column if not exists max_page_weight_warning_mb numeric not null default 3;

alter table public.aipify_quality_settings
  add column if not exists max_page_weight_high_mb numeric not null default 6;

alter table public.aipify_quality_settings
  add column if not exists notify_on_high boolean not null default true;

alter table public.aipify_quality_settings
  add column if not exists notify_on_critical boolean not null default true;

alter table public.aipify_quality_settings
  add column if not exists auto_create_developer_reports boolean not null default true;

alter table public.aipify_quality_settings
  add column if not exists target_urls jsonb not null default '[]'::jsonb;

-- ---------------------------------------------------------------------------
-- 2. Extend scan types
-- ---------------------------------------------------------------------------
alter table public.aipify_quality_scan_runs drop constraint if exists aipify_quality_scan_runs_scan_type_check;

alter table public.aipify_quality_scan_runs
  add constraint aipify_quality_scan_runs_scan_type_check check (
    scan_type in (
      'full', 'links', 'workflows', 'integrations', 'translations', 'mobile', 'journeys', 'summary',
      'full_site', 'images', 'performance', 'seo', 'localization', 'frontend_journey'
    )
  );

alter table public.aipify_quality_scan_runs
  add column if not exists target_url text;

alter table public.aipify_quality_scan_runs
  add column if not exists metrics jsonb not null default '{}'::jsonb;

alter table public.aipify_quality_scan_runs
  add column if not exists error_message text;

-- ---------------------------------------------------------------------------
-- 3. Extend incidents
-- ---------------------------------------------------------------------------
alter table public.aipify_quality_incidents
  add column if not exists incident_type text;

alter table public.aipify_quality_incidents
  add column if not exists page_url text;

alter table public.aipify_quality_incidents
  add column if not exists affected_asset_url text;

alter table public.aipify_quality_checks drop constraint if exists aipify_quality_checks_scanner_type_check;

alter table public.aipify_quality_checks
  add constraint aipify_quality_checks_scanner_type_check check (
    scanner_type in (
      'link_monitor', 'journey_monitor', 'integration_monitor', 'performance_monitor',
      'translation_monitor', 'mobile_monitor', 'workflow_validator',
      'image_guardian', 'performance_guardian', 'frontend_experience', 'seo_monitor'
    )
  );

alter table public.aipify_quality_checks drop constraint if exists aipify_quality_checks_category_check;

alter table public.aipify_quality_checks
  add constraint aipify_quality_checks_category_check check (
    category in (
      'links', 'journeys', 'integrations', 'performance', 'translation', 'mobile',
      'workflow', 'governance', 'images', 'frontend', 'seo', 'localization'
    )
  );

-- ---------------------------------------------------------------------------
-- 4. aipify_quality_assets
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_quality_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scan_run_id uuid references public.aipify_quality_scan_runs (id) on delete set null,
  asset_type text not null check (
    asset_type in ('image', 'script', 'stylesheet', 'font', 'video', 'document')
  ),
  url text not null,
  page_url text,
  file_format text,
  content_type text,
  size_bytes int,
  rendered_width int,
  rendered_height int,
  natural_width int,
  natural_height int,
  status_code int,
  load_time_ms int,
  has_alt_text boolean,
  alt_text text,
  is_lazy_loaded boolean,
  has_width_height boolean,
  recommendation text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aipify_quality_assets_tenant_idx
  on public.aipify_quality_assets (tenant_id, asset_type, size_bytes desc nulls last);

create index if not exists aipify_quality_assets_page_idx
  on public.aipify_quality_assets (tenant_id, page_url);

alter table public.aipify_quality_assets enable row level security;
revoke all on public.aipify_quality_assets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_quality_page_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_quality_page_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scan_run_id uuid references public.aipify_quality_scan_runs (id) on delete set null,
  page_url text not null,
  viewport text not null check (
    viewport in ('mobile_small', 'mobile_standard', 'tablet', 'desktop')
  ),
  status_code int,
  load_time_ms int,
  total_page_weight_bytes int,
  request_count int,
  image_weight_bytes int,
  script_weight_bytes int,
  css_weight_bytes int,
  layout_issue_count int not null default 0,
  screenshot_ref text,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists aipify_quality_page_snapshots_tenant_idx
  on public.aipify_quality_page_snapshots (tenant_id, page_url, created_at desc);

alter table public.aipify_quality_page_snapshots enable row level security;
revoke all on public.aipify_quality_page_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Extend recommendations
-- ---------------------------------------------------------------------------
alter table public.aipify_quality_recommendations
  add column if not exists recommendation_type text;

alter table public.aipify_quality_recommendations
  add column if not exists title text;

alter table public.aipify_quality_recommendations
  add column if not exists risk_level text not null default 'low';

alter table public.aipify_quality_recommendations
  add column if not exists estimated_impact text;

alter table public.aipify_quality_recommendations
  add column if not exists suggested_steps text;

-- ---------------------------------------------------------------------------
-- 7. Extend reports
-- ---------------------------------------------------------------------------
alter table public.aipify_quality_reports
  add column if not exists report_type text not null default 'developer_report';

alter table public.aipify_quality_reports
  add column if not exists summary text;

alter table public.aipify_quality_reports
  add column if not exists severity_overview jsonb not null default '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- 8. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._qg_health_score(p_tenant_id uuid)
returns int
language plpgsql stable security definer set search_path = public
as $$
declare
  v_open int;
  v_critical int;
  v_high int;
begin
  select count(*) filter (where status in ('open', 'investigating')),
         count(*) filter (where status in ('open', 'investigating') and severity = 'critical'),
         count(*) filter (where status in ('open', 'investigating') and severity = 'high')
  into v_open, v_critical, v_high
  from public.aipify_quality_incidents where tenant_id = p_tenant_id;

  return greatest(0, least(100, 100 - (v_critical * 25) - (v_high * 10) - (v_open * 2)));
end;
$$;

create or replace function public._qg_record_assets(
  p_tenant_id uuid, p_scan_run_id uuid, p_assets jsonb
)
returns int
language plpgsql security definer set search_path = public
as $$
declare v_item jsonb; v_count int := 0;
begin
  for v_item in select * from jsonb_array_elements(coalesce(p_assets, '[]'::jsonb))
  loop
    insert into public.aipify_quality_assets (
      tenant_id, scan_run_id, asset_type, url, page_url, file_format, content_type,
      size_bytes, rendered_width, rendered_height, natural_width, natural_height,
      status_code, load_time_ms, has_alt_text, alt_text, is_lazy_loaded, has_width_height,
      recommendation, metadata
    ) values (
      p_tenant_id, p_scan_run_id,
      coalesce(v_item->>'asset_type', 'image'),
      v_item->>'url', v_item->>'page_url', v_item->>'file_format', v_item->>'content_type',
      (v_item->>'size_bytes')::int, (v_item->>'rendered_width')::int, (v_item->>'rendered_height')::int,
      (v_item->>'natural_width')::int, (v_item->>'natural_height')::int,
      (v_item->>'status_code')::int, (v_item->>'load_time_ms')::int,
      (v_item->>'has_alt_text')::boolean, v_item->>'alt_text',
      (v_item->>'is_lazy_loaded')::boolean, (v_item->>'has_width_height')::boolean,
      v_item->>'recommendation', coalesce(v_item->'metadata', '{}'::jsonb)
    );
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

create or replace function public._qg_record_snapshots(
  p_tenant_id uuid, p_scan_run_id uuid, p_snapshots jsonb
)
returns int
language plpgsql security definer set search_path = public
as $$
declare v_item jsonb; v_count int := 0;
begin
  for v_item in select * from jsonb_array_elements(coalesce(p_snapshots, '[]'::jsonb))
  loop
    insert into public.aipify_quality_page_snapshots (
      tenant_id, scan_run_id, page_url, viewport, status_code, load_time_ms,
      total_page_weight_bytes, request_count, image_weight_bytes, script_weight_bytes,
      css_weight_bytes, layout_issue_count, screenshot_ref, metrics
    ) values (
      p_tenant_id, p_scan_run_id,
      v_item->>'page_url', coalesce(v_item->>'viewport', 'desktop'),
      (v_item->>'status_code')::int, (v_item->>'load_time_ms')::int,
      (v_item->>'total_page_weight_bytes')::int, (v_item->>'request_count')::int,
      (v_item->>'image_weight_bytes')::int, (v_item->>'script_weight_bytes')::int,
      (v_item->>'css_weight_bytes')::int,
      coalesce((v_item->>'layout_issue_count')::int, 0),
      v_item->>'screenshot_ref', coalesce(v_item->'metrics', '{}'::jsonb)
    );
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- Patch incident creation to store frontend fields
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
    scanner_type, category, incident_type, page_url, affected_asset_url
  ) values (
    p_tenant_id, v_check_id, p_scan_run_id, v_key,
    p_payload->>'title', coalesce(p_payload->>'severity', 'medium'), 'open',
    coalesce(p_payload->>'expected_behavior', 'System should behave as documented.'),
    coalesce(p_payload->>'observed_behavior', 'Deviation detected.'),
    coalesce(p_payload->>'impact', ''),
    coalesce(p_payload->'evidence', '{}'::jsonb),
    coalesce(p_payload->>'suggested_fix', ''),
    public._qg_severity_to_priority(coalesce(p_payload->>'severity', 'medium')),
    p_payload->>'scanner_type', p_payload->>'category',
    p_payload->>'incident_type', p_payload->>'page_url', p_payload->>'affected_asset_url'
  )
  on conflict (tenant_id, incident_key) do update set
    observed_behavior = excluded.observed_behavior,
    evidence = aipify_quality_incidents.evidence || excluded.evidence,
    severity = excluded.severity, priority = excluded.priority,
    suggested_fix = excluded.suggested_fix, page_url = excluded.page_url,
    affected_asset_url = excluded.affected_asset_url, updated_at = now(),
    status = case when aipify_quality_incidents.status = 'resolved' then 'open' else aipify_quality_incidents.status end
  returning * into v_inc;

  v_incident_id := v_inc.id;

  if v_settings.auto_create_developer_reports then
    insert into public.aipify_quality_reports (
      tenant_id, incident_id, title, report_body, status, report_type, summary
    ) values (
      p_tenant_id, v_incident_id, 'Developer report: ' || v_inc.title,
      public._qg_format_report(v_inc), 'draft', 'developer_report', v_inc.title
    ) returning id into v_report_id;
  end if;

  insert into public.aipify_quality_recommendations (
    tenant_id, incident_id, recommendation_text, priority, requires_approval, status,
    recommendation_type, title, risk_level, suggested_steps
  ) values (
    p_tenant_id, v_incident_id,
    coalesce(p_payload->>'suggested_fix', 'Review incident and apply an approved fix.'),
    v_inc.priority, true, 'active',
    coalesce(p_payload->>'recommendation_type', 'general'),
    v_inc.title,
    case v_inc.severity when 'critical' then 'high' when 'high' then 'high' else 'low' end,
    p_payload->>'suggested_fix'
  ) returning id into v_rec_id;

  perform public._qg_incident_event(v_incident_id, 'incident_created', 'Incident opened',
    jsonb_build_object('severity', v_inc.severity, 'report_id', v_report_id));

  if v_settings.open_knowledge_gaps and coalesce(p_payload->>'missing_documentation', '') <> '' then
    v_gap_id := public._kc_upsert_gap(
      p_tenant_id, p_payload->>'missing_documentation',
      coalesce(p_payload->>'language', 'en'), 'quality_guardian', 0.4,
      (select u.id from public.users u where u.auth_user_id = auth.uid() limit 1)
    );
    update public.aipify_quality_incidents set knowledge_gap_id = v_gap_id where id = v_incident_id;
  end if;

  perform public._tacc_log_audit(
    p_tenant_id, 'aipify', 'quality_incident_created', 'quality', 'success', null,
    jsonb_build_object('incident_id', v_incident_id, 'incident_type', v_inc.incident_type)
  );
  return v_incident_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Extended run_quality_scan
-- ---------------------------------------------------------------------------
create or replace function public.run_quality_scan(
  p_scan_type text default 'full',
  p_results jsonb default '[]'::jsonb,
  p_assets jsonb default '[]'::jsonb,
  p_snapshots jsonb default '[]'::jsonb
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
  v_assets int;
  v_snaps int;
begin
  v_tenant_id := public._qg_require_access();
  v_settings := public._qg_ensure_settings(v_tenant_id);
  if v_settings.auto_fix_enabled then
    raise exception 'Automatic production fixes are disabled in observation mode';
  end if;

  insert into public.aipify_quality_scan_runs (
    tenant_id, scan_type, status, started_at, created_by_user_id
  ) values (
    v_tenant_id, coalesce(p_scan_type, 'full'), 'running', now(),
    (select u.id from public.users u where u.auth_user_id = auth.uid() limit 1)
  ) returning * into v_run;

  v_assets := public._qg_record_assets(v_tenant_id, v_run.id, p_assets);
  v_snaps := public._qg_record_snapshots(v_tenant_id, v_run.id, p_snapshots);

  for v_item in select * from jsonb_array_elements(coalesce(p_results, '[]'::jsonb))
  loop
    if coalesce((v_item->>'passed')::boolean, false) then
      v_passed := v_passed + 1;
    else
      v_failed := v_failed + 1;
      v_incident_id := public._qg_create_incident(v_tenant_id, v_run.id,
        v_item || jsonb_build_object('scanner_type', coalesce(v_item->>'scanner_type', p_scan_type)));
      v_incidents := v_incidents + 1;
    end if;
  end loop;

  update public.aipify_quality_scan_runs set
    status = 'completed',
    summary = format('%s passed, %s failed, %s incidents, %s assets, %s snapshots.',
      v_passed, v_failed, v_incidents, v_assets, v_snaps),
    findings = jsonb_build_object('results', p_results, 'assets_recorded', v_assets, 'snapshots_recorded', v_snaps),
    metrics = jsonb_build_object('health_score', public._qg_health_score(v_tenant_id)),
    checks_passed = v_passed, checks_failed = v_failed, incidents_created = v_incidents,
    completed_at = now()
  where id = v_run.id returning * into v_run;

  perform public._tacc_log_audit(v_tenant_id, 'aipify', 'quality_scan_completed', 'quality', 'success', null,
    jsonb_build_object('scan_id', v_run.id, 'scan_type', p_scan_type, 'assets', v_assets));

  return jsonb_build_object(
    'scan', jsonb_build_object(
      'id', v_run.id, 'scan_type', v_run.scan_type, 'status', v_run.status,
      'summary', v_run.summary, 'metrics', v_run.metrics,
      'checks_passed', v_run.checks_passed, 'checks_failed', v_run.checks_failed,
      'incidents_created', v_run.incidents_created, 'completed_at', v_run.completed_at
    ),
    'dashboard', public.get_quality_dashboard()
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Dashboard extension
-- ---------------------------------------------------------------------------
create or replace function public.get_quality_dashboard()
returns jsonb
language plpgsql stable security definer set search_path = public
as $$
declare v_tenant_id uuid; v_plan text; v_settings public.aipify_quality_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_plan := public._qg_tenant_plan(v_tenant_id);
  if not public._qg_package_allows(v_tenant_id) then
    return jsonb_build_object('has_customer', true, 'has_access', false, 'upgrade_required', true, 'plan', v_plan);
  end if;
  v_settings := public._qg_ensure_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true, 'has_access', true, 'upgrade_required', false, 'plan', v_plan,
    'observation_mode', v_settings.observation_mode,
    'auto_fix_enabled', v_settings.auto_fix_enabled,
    'health_score', public._qg_health_score(v_tenant_id),
    'widgets', jsonb_build_object(
      'open_incidents', (select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating')),
      'critical_incidents', (select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating') and severity = 'critical'),
      'image_issues', (select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating')
          and (category = 'images' or incident_type like '%image%')),
      'performance_issues', (select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating')
          and (category in ('performance', 'frontend') or incident_type in ('slow_page', 'heavy_javascript'))),
      'mobile_issues', (select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating')
          and (category = 'mobile' or incident_type = 'mobile_layout_issue')),
      'broken_links', (select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating') and category = 'links'),
      'missing_translations', (select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating')
          and (category = 'translation' or incident_type = 'missing_translation')),
      'failed_workflows', (select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating') and category = 'workflow'),
      'integration_issues', (select count(*)::int from public.aipify_quality_incidents
        where tenant_id = v_tenant_id and status in ('open', 'investigating') and category = 'integrations'),
      'knowledge_gaps', (select count(*)::int from public.aipify_knowledge_gaps
        where tenant_id = v_tenant_id and status = 'open'),
      'recommended_actions', (select count(*)::int from public.aipify_quality_recommendations
        where tenant_id = v_tenant_id and status = 'active'),
      'oversized_images', (select count(*)::int from public.aipify_quality_assets
        where tenant_id = v_tenant_id and asset_type = 'image'
          and size_bytes > v_settings.max_image_size_warning_kb * 1024)
    ),
    'last_scan', (select jsonb_build_object('id', s.id, 'scan_type', s.scan_type, 'summary', s.summary, 'completed_at', s.completed_at)
      from public.aipify_quality_scan_runs s where s.tenant_id = v_tenant_id order by s.created_at desc limit 1),
    'recent_incidents', coalesce((select jsonb_agg(jsonb_build_object(
      'id', i.id, 'title', i.title, 'severity', i.severity, 'status', i.status,
      'category', i.category, 'incident_type', i.incident_type, 'page_url', i.page_url,
      'observed_behavior', i.observed_behavior, 'created_at', i.created_at
    ) order by i.created_at desc) from (
      select * from public.aipify_quality_incidents where tenant_id = v_tenant_id order by created_at desc limit 10
    ) i), '[]'::jsonb),
    'recent_scans', coalesce((select jsonb_agg(jsonb_build_object(
      'id', s.id, 'scan_type', s.scan_type, 'status', s.status, 'summary', s.summary,
      'completed_at', s.completed_at
    ) order by s.created_at desc) from (
      select * from public.aipify_quality_scan_runs where tenant_id = v_tenant_id order by created_at desc limit 5
    ) s), '[]'::jsonb),
    'recommended_actions', coalesce((select jsonb_agg(jsonb_build_object(
      'id', r.id, 'title', r.title, 'recommendation_text', r.recommendation_text,
      'priority', r.priority, 'recommendation_type', r.recommendation_type
    ) order by r.created_at desc) from (
      select * from public.aipify_quality_recommendations where tenant_id = v_tenant_id and status = 'active' limit 8
    ) r), '[]'::jsonb),
    'privacy_note', 'Quality Guardian observes frontend health calmly — reports and recommendations only, no automatic production changes.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. Image & performance queries
-- ---------------------------------------------------------------------------
create or replace function public.get_quality_images(p_limit int default 100)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._qg_require_access();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', a.id, 'url', a.url, 'page_url', a.page_url, 'file_format', a.file_format,
    'size_bytes', a.size_bytes, 'has_alt_text', a.has_alt_text, 'is_lazy_loaded', a.is_lazy_loaded,
    'has_width_height', a.has_width_height, 'recommendation', a.recommendation, 'status_code', a.status_code,
    'rendered_width', a.rendered_width, 'rendered_height', a.rendered_height, 'created_at', a.created_at
  ) order by a.size_bytes desc nulls last) from (
    select * from public.aipify_quality_assets where tenant_id = v_tenant_id and asset_type = 'image'
    order by size_bytes desc nulls last limit greatest(1, least(p_limit, 500))
  ) a), '[]'::jsonb);
end; $$;

create or replace function public.get_quality_images_largest(p_limit int default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin return public.get_quality_images(p_limit); end; $$;

create or replace function public.get_quality_image_issues()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._qg_require_access();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', i.id, 'title', i.title, 'severity', i.severity, 'incident_type', i.incident_type,
    'page_url', i.page_url, 'affected_asset_url', i.affected_asset_url,
    'observed_behavior', i.observed_behavior, 'suggested_fix', i.suggested_fix, 'status', i.status
  ) order by case i.severity when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end)
  from public.aipify_quality_incidents i
  where i.tenant_id = v_tenant_id and i.status in ('open', 'investigating')
    and (i.category = 'images' or i.incident_type like '%image%')), '[]'::jsonb);
end; $$;

create or replace function public.get_quality_performance_pages(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._qg_require_access();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', s.id, 'page_url', s.page_url, 'viewport', s.viewport,
    'load_time_ms', s.load_time_ms, 'total_page_weight_bytes', s.total_page_weight_bytes,
    'request_count', s.request_count, 'image_weight_bytes', s.image_weight_bytes,
    'script_weight_bytes', s.script_weight_bytes, 'layout_issue_count', s.layout_issue_count,
    'created_at', s.created_at
  ) order by s.total_page_weight_bytes desc nulls last) from (
    select distinct on (page_url, viewport) * from public.aipify_quality_page_snapshots
    where tenant_id = v_tenant_id order by page_url, viewport, created_at desc
    limit greatest(1, least(p_limit, 200))
  ) s), '[]'::jsonb);
end; $$;

create or replace function public.get_quality_mobile_incidents()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._qg_require_access();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', i.id, 'title', i.title, 'severity', i.severity, 'page_url', i.page_url,
    'observed_behavior', i.observed_behavior, 'suggested_fix', i.suggested_fix, 'evidence', i.evidence
  ) order by i.created_at desc) from public.aipify_quality_incidents i
  where i.tenant_id = v_tenant_id and i.status in ('open', 'investigating')
    and (i.category = 'mobile' or i.incident_type = 'mobile_layout_issue')), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Generate guardian reports
-- ---------------------------------------------------------------------------
create or replace function public.generate_quality_guardian_report(p_report_type text default 'admin_summary')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_body text;
  v_title text;
  v_summary text;
  v_id uuid;
  v_img int; v_perf int; v_mobile int; v_crit int;
begin
  v_tenant_id := public._qg_require_access();

  select count(*) filter (where category = 'images' or incident_type like '%image%'),
         count(*) filter (where category in ('performance', 'frontend')),
         count(*) filter (where category = 'mobile'),
         count(*) filter (where severity = 'critical')
  into v_img, v_perf, v_mobile, v_crit
  from public.aipify_quality_incidents
  where tenant_id = v_tenant_id and status in ('open', 'investigating');

  v_title := case p_report_type
    when 'admin_summary' then 'Aipify Guardian Report'
    when 'image_optimization_report' then 'Image Optimization Report'
    when 'performance_report' then 'Performance Report'
    else 'Quality Guardian Report'
  end;

  v_body := format(
    E'Aipify Guardian observed your frontend experience.\n\nOpen image issues: %s\nPerformance issues: %s\nMobile issues: %s\nCritical incidents: %s\n\nRecommended next step: Review image optimization and mobile layout first.\n\nNo automatic production changes were made.',
    v_img, v_perf, v_mobile, v_crit
  );
  v_summary := format('%s items need attention. %s critical.', v_img + v_perf + v_mobile, v_crit);

  insert into public.aipify_quality_reports (
    tenant_id, title, summary, report_body, status, report_type, severity_overview
  ) values (
    v_tenant_id, v_title, v_summary, v_body, 'published', p_report_type,
    jsonb_build_object('image', v_img, 'performance', v_perf, 'mobile', v_mobile, 'critical', v_crit)
  ) returning id into v_id;

  perform public._tacc_log_audit(v_tenant_id, 'aipify', 'guardian_report_generated', 'quality', 'success', null,
    jsonb_build_object('report_id', v_id, 'report_type', p_report_type));

  return jsonb_build_object('report_id', v_id, 'title', v_title, 'summary', v_summary, 'body', v_body);
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Settings update extension
-- ---------------------------------------------------------------------------
create or replace function public.get_quality_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.aipify_quality_settings;
begin
  v_tenant_id := public._qg_require_access();
  v_row := public._qg_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'observation_mode', v_row.observation_mode, 'auto_fix_enabled', v_row.auto_fix_enabled,
    'notify_developers', v_row.notify_developers, 'create_admin_tasks', v_row.create_admin_tasks,
    'open_knowledge_gaps', v_row.open_knowledge_gaps, 'scan_interval_hours', v_row.scan_interval_hours,
    'enabled_scanners', v_row.enabled_scanners,
    'image_scanning_enabled', v_row.image_scanning_enabled,
    'performance_scanning_enabled', v_row.performance_scanning_enabled,
    'mobile_scanning_enabled', v_row.mobile_scanning_enabled,
    'seo_scanning_enabled', v_row.seo_scanning_enabled,
    'localization_scanning_enabled', v_row.localization_scanning_enabled,
    'scan_frequency', v_row.scan_frequency, 'max_pages_per_scan', v_row.max_pages_per_scan,
    'max_image_size_warning_kb', v_row.max_image_size_warning_kb,
    'max_image_size_high_kb', v_row.max_image_size_high_kb,
    'max_page_weight_warning_mb', v_row.max_page_weight_warning_mb,
    'max_page_weight_high_mb', v_row.max_page_weight_high_mb,
    'notify_on_high', v_row.notify_on_high, 'notify_on_critical', v_row.notify_on_critical,
    'auto_create_developer_reports', v_row.auto_create_developer_reports,
    'target_urls', v_row.target_urls
  );
end; $$;

create or replace function public.update_quality_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
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
    image_scanning_enabled = coalesce((p_patch->>'image_scanning_enabled')::boolean, image_scanning_enabled),
    performance_scanning_enabled = coalesce((p_patch->>'performance_scanning_enabled')::boolean, performance_scanning_enabled),
    mobile_scanning_enabled = coalesce((p_patch->>'mobile_scanning_enabled')::boolean, mobile_scanning_enabled),
    seo_scanning_enabled = coalesce((p_patch->>'seo_scanning_enabled')::boolean, seo_scanning_enabled),
    localization_scanning_enabled = coalesce((p_patch->>'localization_scanning_enabled')::boolean, localization_scanning_enabled),
    scan_frequency = coalesce(p_patch->>'scan_frequency', scan_frequency),
    max_pages_per_scan = coalesce((p_patch->>'max_pages_per_scan')::int, max_pages_per_scan),
    max_image_size_warning_kb = coalesce((p_patch->>'max_image_size_warning_kb')::int, max_image_size_warning_kb),
    max_image_size_high_kb = coalesce((p_patch->>'max_image_size_high_kb')::int, max_image_size_high_kb),
    max_page_weight_warning_mb = coalesce((p_patch->>'max_page_weight_warning_mb')::numeric, max_page_weight_warning_mb),
    max_page_weight_high_mb = coalesce((p_patch->>'max_page_weight_high_mb')::numeric, max_page_weight_high_mb),
    notify_on_high = coalesce((p_patch->>'notify_on_high')::boolean, notify_on_high),
    notify_on_critical = coalesce((p_patch->>'notify_on_critical')::boolean, notify_on_critical),
    auto_create_developer_reports = coalesce((p_patch->>'auto_create_developer_reports')::boolean, auto_create_developer_reports),
    target_urls = coalesce(p_patch->'target_urls', target_urls),
    auto_fix_enabled = false,
    updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'quality_settings_updated', 'quality', 'success', null, p_patch);
  return public.get_quality_settings();
end; $$;

-- KC categories
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality-images', 'Image Optimization', 'Quality Guardian image checks', 'authenticated', 91
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'quality-images' and tenant_id is null);
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality-performance', 'Performance Monitoring', 'Page weight and load performance', 'authenticated', 92
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'quality-performance' and tenant_id is null);
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality-mobile', 'Mobile Experience', 'Mobile layout and usability checks', 'authenticated', 93
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'quality-mobile' and tenant_id is null);
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'quality-frontend', 'Frontend Checks', 'Frontend experience and developer reports', 'authenticated', 94
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'quality-frontend' and tenant_id is null);

-- Grants
grant execute on function public.get_quality_images(int) to authenticated;
grant execute on function public.get_quality_images_largest(int) to authenticated;
grant execute on function public.get_quality_image_issues() to authenticated;
grant execute on function public.get_quality_performance_pages(int) to authenticated;
grant execute on function public.get_quality_mobile_incidents() to authenticated;
grant execute on function public.generate_quality_guardian_report(text) to authenticated;
