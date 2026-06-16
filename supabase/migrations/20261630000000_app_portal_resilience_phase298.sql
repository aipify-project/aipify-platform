-- Phase 298 (APP) — Organizational Resilience Engine

create table if not exists public.app_portal_resilience_state (
  company_id uuid primary key references public.companies (id) on delete cascade,
  review_started_at timestamptz,
  last_resilience_score integer,
  last_snapshot_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users (id) on delete set null
);

create table if not exists public.app_portal_resilience_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_resilience_audit_idx
  on public.app_portal_resilience_audit_logs (company_id, created_at desc);

alter table public.app_portal_resilience_state enable row level security;
alter table public.app_portal_resilience_audit_logs enable row level security;
revoke all on public.app_portal_resilience_state from authenticated, anon;
revoke all on public.app_portal_resilience_audit_logs from authenticated, anon;

create or replace function public._aore298_access_context()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_user public.users;
  v_role text;
begin
  v_access := public._apsf260_require_app_access();
  select u.* into v_user from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_role := v_access->>'organization_role';
  return v_access || jsonb_build_object(
    'user_id', v_user.id,
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'can_admin', v_role in ('organization_owner', 'organization_admin'),
    'is_member', v_role in ('organization_owner', 'organization_admin', 'organization_manager', 'organization_member')
  );
end;
$$;

create or replace function public._aore298_resilience_metrics(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_team_count integer := 0;
  v_continuity_active integer := 0;
  v_continuity_draft integer := 0;
  v_continuity_overdue integer := 0;
  v_continuity_with_backup integer := 0;
  v_exercises integer := 0;
  v_risks_open integer := 0;
  v_risks_mitigating integer := 0;
  v_risks_high integer := 0;
  v_playbooks_active integer := 0;
  v_playbooks_stale integer := 0;
  v_capacity_overloaded integer := 0;
  v_capacity_healthy integer := 0;
  v_compliance_gaps integer := 0;
  v_integrations_connected integer := 0;
  v_2fa_count integer := 0;
  v_learning_items integer := 0;
  v_external_vendors integer := 0;
begin
  select count(*)::int into v_team_count from public.users u where u.company_id = p_company_id;

  if to_regclass('public.app_portal_continuity_plans') is not null then
    select count(*) filter (where cp.status = 'active')::int,
           count(*) filter (where cp.status = 'draft')::int,
           count(*) filter (where cp.next_review_date is not null and cp.next_review_date < current_date)::int,
           count(*) filter (where cp.backup_owner_id is not null)::int
    into v_continuity_active, v_continuity_draft, v_continuity_overdue, v_continuity_with_backup
    from public.app_portal_continuity_plans cp where cp.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_continuity_exercises') is not null then
    select count(*)::int into v_exercises
    from public.app_portal_continuity_exercises ce
    join public.app_portal_continuity_plans cp on cp.id = ce.plan_id
    where cp.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_risks') is not null then
    select count(*) filter (where r.status in ('identified', 'under_review'))::int,
           count(*) filter (where r.status = 'mitigation_in_progress')::int,
           count(*) filter (where r.impact in ('major', 'critical') and r.status not in ('resolved', 'archived'))::int
    into v_risks_open, v_risks_mitigating, v_risks_high
    from public.app_portal_risks r where r.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_playbooks') is not null then
    select count(*) filter (where p.status = 'active')::int,
           count(*) filter (where p.status = 'active' and (p.last_reviewed_date is null or p.last_reviewed_date < current_date - interval '1 year'))::int
    into v_playbooks_active, v_playbooks_stale
    from public.app_portal_playbooks p where p.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_capacity_records') is not null then
    select count(*) filter (where cr.status in ('overloaded', 'requires_review'))::int,
           count(*) filter (where cr.status = 'healthy')::int
    into v_capacity_overloaded, v_capacity_healthy
    from public.app_portal_capacity_records cr where cr.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_compliance_records') is not null then
    select count(*) filter (where c.status in ('non_compliant', 'at_risk', 'requires_review'))::int
    into v_compliance_gaps
    from public.app_portal_compliance_records c where c.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_integration_connections') is not null then
    select count(*) filter (where ic.status = 'connected')::int into v_integrations_connected
    from public.app_portal_integration_connections ic where ic.company_id = p_company_id;
  end if;

  if to_regclass('public.user_two_factor_settings') is not null then
    select count(*)::int into v_2fa_count
    from public.user_two_factor_settings t
    join public.users u on u.id = t.user_id
    where u.company_id = p_company_id and t.enabled = true;
  end if;

  if to_regclass('public.app_portal_learning_improvements') is not null then
    select count(*)::int into v_learning_items
    from public.app_portal_learning_improvements li where li.company_id = p_company_id;
  end if;

  if to_regclass('public.app_portal_external_relationships') is not null then
    select count(*)::int into v_external_vendors
    from public.app_portal_external_relationships er
    where er.company_id = p_company_id and er.relationship_type in ('supplier', 'strategic_partner', 'technology_vendor', 'outsourcing_provider', 'service_provider');
  end if;

  return jsonb_build_object(
    'team_count', v_team_count,
    'continuity_active', v_continuity_active,
    'continuity_draft', v_continuity_draft,
    'continuity_overdue', v_continuity_overdue,
    'continuity_with_backup', v_continuity_with_backup,
    'exercises', v_exercises,
    'risks_open', v_risks_open,
    'risks_mitigating', v_risks_mitigating,
    'risks_high', v_risks_high,
    'playbooks_active', v_playbooks_active,
    'playbooks_stale', v_playbooks_stale,
    'capacity_overloaded', v_capacity_overloaded,
    'capacity_healthy', v_capacity_healthy,
    'compliance_gaps', v_compliance_gaps,
    'integrations_connected', v_integrations_connected,
    'two_fa_count', v_2fa_count,
    'learning_items', v_learning_items,
    'external_vendors', v_external_vendors
  );
end;
$$;

create or replace function public._aore298_area_status(p_score integer)
returns text
language plpgsql
immutable
as $$
begin
  if p_score >= 85 then return 'highly_resilient'; end if;
  if p_score >= 70 then return 'resilient'; end if;
  if p_score >= 50 then return 'stable'; end if;
  if p_score >= 30 then return 'vulnerable'; end if;
  return 'requires_attention';
end;
$$;

create or replace function public._aore298_compute_scores(p_metrics jsonb, p_review_started boolean)
returns jsonb
language plpgsql
immutable
as $$
declare
  v_team integer := greatest(1, (p_metrics->>'team_count')::int);
  v_continuity integer := 0;
  v_adaptability integer := 0;
  v_stability integer := 0;
  v_dependency_risk integer := 0;
  v_recovery integer := 0;
  v_overall integer := 0;
begin
  if not p_review_started then
    return jsonb_build_object(
      'resilience_score', 0, 'adaptability_score', 0, 'continuity_preparedness_score', 0,
      'operational_stability_score', 0, 'dependency_risk_score', 0, 'recovery_readiness', 0
    );
  end if;

  v_continuity := least(100, (p_metrics->>'continuity_active')::int * 15
    + (p_metrics->>'continuity_with_backup')::int * 10
    + (p_metrics->>'exercises')::int * 8
    - (p_metrics->>'continuity_overdue')::int * 12);

  v_adaptability := least(100, (p_metrics->>'learning_items')::int * 8
    + (p_metrics->>'playbooks_active')::int * 10
    + (p_metrics->>'risks_mitigating')::int * 8
    + (p_metrics->>'capacity_healthy')::int * 6);

  v_stability := least(100, 40
    + (p_metrics->>'capacity_healthy')::int * 8
    - (p_metrics->>'capacity_overloaded')::int * 15
    - (p_metrics->>'compliance_gaps')::int * 10);

  v_dependency_risk := least(100, greatest(0,
    (p_metrics->>'risks_high')::int * 15
    + (p_metrics->>'continuity_overdue')::int * 10
    + case when (p_metrics->>'continuity_with_backup')::int < (p_metrics->>'continuity_active')::int then 20 else 0 end
    + case when (p_metrics->>'external_vendors')::int > 0 and (p_metrics->>'continuity_active')::int = 0 then 15 else 0 end
    + (p_metrics->>'playbooks_stale')::int * 8
  ));

  v_recovery := least(100, (p_metrics->>'exercises')::int * 12
    + (p_metrics->>'continuity_active')::int * 10
    + (p_metrics->>'playbooks_active')::int * 8
    + round(((p_metrics->>'two_fa_count')::numeric / v_team) * 30)::int);

  v_overall := round((greatest(0, v_continuity) + v_adaptability + v_stability + v_recovery + (100 - v_dependency_risk)) / 5.0)::int;

  return jsonb_build_object(
    'resilience_score', least(100, greatest(0, v_overall)),
    'adaptability_score', greatest(0, v_adaptability),
    'continuity_preparedness_score', greatest(0, v_continuity),
    'operational_stability_score', greatest(0, v_stability),
    'dependency_risk_score', v_dependency_risk,
    'recovery_readiness', greatest(0, v_recovery)
  );
end;
$$;

create or replace function public._aore298_build_areas(p_company_id uuid, p_metrics jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_items jsonb := '[]'::jsonb;
  v_score integer;
begin
  v_score := least(100, (p_metrics->>'continuity_active')::int * 20 + (p_metrics->>'exercises')::int * 10);
  v_items := v_items || jsonb_build_object(
    'id', 'area-operational', 'title', 'Operational Resilience', 'category', 'operational_resilience',
    'resilience_status', public._aore298_area_status(v_score), 'current_assessment', v_score,
    'identified_vulnerabilities', case when (p_metrics->>'continuity_overdue')::int > 0 then jsonb_build_array('Aging continuity plans') else '[]'::jsonb end,
    'existing_safeguards', jsonb_build_array('Continuity planning', 'Operational playbooks'),
    'recovery_considerations', 'Maintain active continuity plans with regular review cycles.',
    'responsible_owner', 'Operations leadership', 'owner_id', null,
    'last_reviewed_date', null, 'related_continuity_plans', '[]'::jsonb, 'related_risks', '[]'::jsonb,
    'related_playbooks', '[]'::jsonb, 'notes', 'Derived from continuity and operational preparedness signals.',
    'trend_direction', case when v_score >= 60 then 'improving' when v_score >= 35 then 'stable' else 'declining' end
  );

  v_score := least(100, (p_metrics->>'integrations_connected')::int * 15 + (p_metrics->>'playbooks_active')::int * 10);
  v_items := v_items || jsonb_build_object(
    'id', 'area-technology', 'title', 'Technology Resilience', 'category', 'technology_resilience',
    'resilience_status', public._aore298_area_status(v_score), 'current_assessment', v_score,
    'identified_vulnerabilities', case when (p_metrics->>'integrations_connected')::int = 0 then jsonb_build_array('Limited integration redundancy') else '[]'::jsonb end,
    'existing_safeguards', jsonb_build_array('Integration monitoring', 'Technology recovery playbooks'),
    'recovery_considerations', 'Validate technology recovery procedures and integration health.',
    'responsible_owner', 'Technology leadership', 'owner_id', null,
    'last_reviewed_date', null, 'related_continuity_plans', '[]'::jsonb, 'related_risks', '[]'::jsonb,
    'related_playbooks', '[]'::jsonb, 'notes', 'Technology resilience derived from integrations and playbooks.',
    'trend_direction', 'stable'
  );

  v_score := least(100, (p_metrics->>'capacity_healthy')::int * 20 - (p_metrics->>'capacity_overloaded')::int * 15 + 30);
  v_items := v_items || jsonb_build_object(
    'id', 'area-workforce', 'title', 'Workforce Resilience', 'category', 'workforce_resilience',
    'resilience_status', public._aore298_area_status(greatest(0, v_score)), 'current_assessment', greatest(0, v_score),
    'identified_vulnerabilities', case when (p_metrics->>'capacity_overloaded')::int > 0 then jsonb_build_array('Over-reliance on key individuals') else '[]'::jsonb end,
    'existing_safeguards', jsonb_build_array('Capacity monitoring', 'Workload balance reviews'),
    'recovery_considerations', 'Strengthen backup ownership and distribute critical knowledge.',
    'responsible_owner', 'People leadership', 'owner_id', null,
    'last_reviewed_date', null, 'related_continuity_plans', '[]'::jsonb, 'related_risks', '[]'::jsonb,
    'related_playbooks', '[]'::jsonb, 'notes', 'Workforce resilience from capacity and backup coverage.',
    'trend_direction', case when (p_metrics->>'capacity_overloaded')::int > 0 then 'declining' else 'stable' end
  );

  v_score := least(100, 50 + (p_metrics->>'external_vendors')::int * 5 - case when (p_metrics->>'external_vendors')::int > 3 then 15 else 0 end);
  v_items := v_items || jsonb_build_object(
    'id', 'area-vendor', 'title', 'Vendor Resilience', 'category', 'vendor_resilience',
    'resilience_status', public._aore298_area_status(v_score), 'current_assessment', v_score,
    'identified_vulnerabilities', case when (p_metrics->>'external_vendors')::int > 3 then jsonb_build_array('Vendor concentration risk') else '[]'::jsonb end,
    'existing_safeguards', jsonb_build_array('External relationship tracking'),
    'recovery_considerations', 'Diversify critical vendor dependencies where feasible.',
    'responsible_owner', 'Procurement leadership', 'owner_id', null,
    'last_reviewed_date', null, 'related_continuity_plans', '[]'::jsonb, 'related_risks', '[]'::jsonb,
    'related_playbooks', '[]'::jsonb, 'notes', 'Vendor resilience from external relationship coverage.',
    'trend_direction', 'stable'
  );

  v_score := least(100, round(((p_metrics->>'two_fa_count')::numeric / greatest(1, (p_metrics->>'team_count')::int)) * 60)::int + 20);
  v_items := v_items || jsonb_build_object(
    'id', 'area-security', 'title', 'Security Resilience', 'category', 'security_resilience',
    'resilience_status', public._aore298_area_status(v_score), 'current_assessment', v_score,
    'identified_vulnerabilities', case when (p_metrics->>'two_fa_count')::int < (p_metrics->>'team_count')::int then jsonb_build_array('Incomplete security adoption') else '[]'::jsonb end,
    'existing_safeguards', jsonb_build_array('Two-factor authentication', 'Security playbooks'),
    'recovery_considerations', 'Expand security protections and incident preparedness.',
    'responsible_owner', 'Security leadership', 'owner_id', null,
    'last_reviewed_date', null, 'related_continuity_plans', '[]'::jsonb, 'related_risks', '[]'::jsonb,
    'related_playbooks', '[]'::jsonb, 'notes', 'Security resilience from authentication and compliance posture.',
    'trend_direction', case when v_score >= 60 then 'improving' else 'stable' end
  );

  if to_regclass('public.app_portal_continuity_plans') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'cp-' || cp.id,
        'title', cp.title,
        'category', 'operational_resilience',
        'resilience_status', case
          when cp.status = 'active' and cp.backup_owner_id is not null then 'resilient'
          when cp.status = 'active' then 'stable'
          when cp.next_review_date is not null and cp.next_review_date < current_date then 'vulnerable'
          else 'requires_attention'
        end,
        'current_assessment', case cp.status when 'active' then 75 when 'testing' then 80 else 40 end,
        'identified_vulnerabilities', case when cp.backup_owner_id is null then jsonb_build_array('Missing backup ownership') else '[]'::jsonb end,
        'existing_safeguards', jsonb_build_array(cp.alternative_procedures),
        'recovery_considerations', cp.recovery_objectives,
        'responsible_owner', coalesce((select u.full_name from public.users u where u.id = cp.owner_id), 'Unassigned'),
        'owner_id', cp.owner_id,
        'last_reviewed_date', cp.last_reviewed_date,
        'related_continuity_plans', jsonb_build_array(cp.id::text),
        'related_risks', cp.related_risk_ids,
        'related_playbooks', cp.related_playbook_ids,
        'notes', left(cp.notes, 200),
        'trend_direction', case when cp.status = 'active' then 'stable' else 'declining' end
      ))
      from public.app_portal_continuity_plans cp
      where cp.company_id = p_company_id and cp.status <> 'archived'
      limit 10
    ), '[]'::jsonb);
  end if;

  return coalesce(v_items, '[]'::jsonb);
end;
$$;

create or replace function public._aore298_build_vulnerabilities(p_metrics jsonb, p_areas jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_items jsonb := '[]'::jsonb;
begin
  if (p_metrics->>'capacity_overloaded')::int > 0 then
    v_items := v_items || jsonb_build_object('id', 'key-individuals', 'key', 'overRelianceKeyIndividuals', 'severity', 'important');
  end if;
  if (p_metrics->>'continuity_with_backup')::int < (p_metrics->>'continuity_active')::int then
    v_items := v_items || jsonb_build_object('id', 'no-backups', 'key', 'assetsWithoutBackups', 'severity', 'important');
  end if;
  if (p_metrics->>'risks_high')::int > 0 then
    v_items := v_items || jsonb_build_object('id', 'single-failure', 'key', 'singlePointsOfFailure', 'severity', 'immediate_attention');
  end if;
  if (p_metrics->>'continuity_overdue')::int > 0 then
    v_items := v_items || jsonb_build_object('id', 'aging-plans', 'key', 'agingContinuityPlans', 'severity', 'recommended');
  end if;
  if (p_metrics->>'playbooks_stale')::int > 0 then
    v_items := v_items || jsonb_build_object('id', 'review-frequency', 'key', 'insufficientReviewFrequency', 'severity', 'recommended');
  end if;
  if (p_metrics->>'external_vendors')::int > 3 then
    v_items := v_items || jsonb_build_object('id', 'vendor-concentration', 'key', 'vendorConcentrationRisk', 'severity', 'important');
  end if;
  return v_items;
end;
$$;

create or replace function public._aore298_build_recommendations(p_metrics jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
begin
  if (p_metrics->>'risks_high')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'spof', 'key', 'reviewSinglePointsOfFailure', 'priority', 'immediate_attention');
  end if;
  if (p_metrics->>'continuity_with_backup')::int < (p_metrics->>'continuity_active')::int then
    v_recs := v_recs || jsonb_build_object('id', 'backup', 'key', 'strengthenBackupOwnership', 'priority', 'important');
  end if;
  if (p_metrics->>'continuity_overdue')::int > 0 or (p_metrics->>'continuity_draft')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'continuity', 'key', 'updateContinuityPlans', 'priority', 'important');
  end if;
  if (p_metrics->>'external_vendors')::int > 2 then
    v_recs := v_recs || jsonb_build_object('id', 'diversify', 'key', 'diversifyCriticalDependencies', 'priority', 'recommended');
  end if;
  v_recs := v_recs || jsonb_build_object('id', 'reviews', 'key', 'scheduleResilienceReviews', 'priority', 'recommended');
  if (p_metrics->>'exercises')::int = 0 and (p_metrics->>'continuity_active')::int > 0 then
    v_recs := v_recs || jsonb_build_object('id', 'exercises', 'key', 'conductPreparednessExercises', 'priority', 'opportunity');
  end if;
  return v_recs;
end;
$$;

create or replace function public.begin_app_portal_resilience_review()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_scores jsonb;
begin
  v_ctx := public._aore298_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_scores := public._aore298_compute_scores(public._aore298_resilience_metrics(v_company_id), true);

  insert into public.app_portal_resilience_state (
    company_id, review_started_at, last_resilience_score, last_snapshot_at, updated_by
  ) values (
    v_company_id, now(), (v_scores->>'resilience_score')::int, now(), v_user_id
  )
  on conflict (company_id) do update set
    review_started_at = coalesce(public.app_portal_resilience_state.review_started_at, now()),
    last_resilience_score = (v_scores->>'resilience_score')::int,
    last_snapshot_at = now(),
    updated_by = v_user_id,
    updated_at = now();

  insert into public.app_portal_resilience_audit_logs (company_id, event_type, description, performed_by)
  values (v_company_id, 'review_started', 'Resilience review initiated', v_user_id);

  return public.list_app_portal_resilience(null, null, null, null, null, null, null);
end;
$$;

create or replace function public.list_app_portal_resilience(
  p_category text default null,
  p_status text default null,
  p_owner text default null,
  p_trend text default null,
  p_priority text default null,
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_started timestamptz;
  v_metrics jsonb;
  v_scores jsonb;
  v_areas jsonb;
  v_filtered jsonb;
  v_recs jsonb;
  v_vulns jsonb;
  v_positive jsonb := '[]'::jsonb;
  v_personal jsonb := '[]'::jsonb;
  v_org_status text;
begin
  v_ctx := public._aore298_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select rs.review_started_at into v_started
  from public.app_portal_resilience_state rs where rs.company_id = v_company_id;

  v_metrics := public._aore298_resilience_metrics(v_company_id);
  v_scores := public._aore298_compute_scores(v_metrics, v_started is not null);
  v_areas := public._aore298_build_areas(v_company_id, v_metrics);
  v_recs := public._aore298_build_recommendations(v_metrics);
  v_vulns := public._aore298_build_vulnerabilities(v_metrics, v_areas);

  v_filtered := v_areas;
  if p_category is not null or p_status is not null or p_owner is not null or p_trend is not null
     or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(a), '[]'::jsonb) into v_filtered from (
      select a from jsonb_array_elements(v_areas) a
      where (p_category is null or a->>'category' = p_category)
        and (p_status is null or a->>'resilience_status' = p_status)
        and (p_owner is null or a->>'responsible_owner' ilike '%' || p_owner || '%')
        and (p_trend is null or a->>'trend_direction' = p_trend)
        and (p_search is null or trim(p_search) = ''
          or a->>'title' ilike '%' || trim(p_search) || '%'
          or a->>'notes' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  if p_priority is not null then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r where r->>'priority' = p_priority
    ) sub;
  end if;

  select coalesce(jsonb_agg(a->>'title'), '[]'::jsonb) into v_positive
  from jsonb_array_elements(v_areas) a
  where a->>'resilience_status' in ('highly_resilient', 'resilient') limit 5;

  v_org_status := public._aore298_area_status((v_scores->>'resilience_score')::int);

  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    select coalesce(jsonb_agg(a), '[]'::jsonb) into v_personal
    from jsonb_array_elements(v_areas) a
    where (a->>'owner_id')::uuid = v_user_id;
    v_filtered := case when jsonb_array_length(v_personal) > 0 then v_personal else v_filtered end;
  end if;

  if v_started is not null then
    update public.app_portal_resilience_state set
      last_resilience_score = (v_scores->>'resilience_score')::int,
      last_snapshot_at = now()
    where company_id = v_company_id;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'review_started', v_started is not null,
    'organizational_resilience_score', (v_scores->>'resilience_score')::int,
    'adaptability_score', (v_scores->>'adaptability_score')::int,
    'continuity_preparedness_score', (v_scores->>'continuity_preparedness_score')::int,
    'operational_stability_score', (v_scores->>'operational_stability_score')::int,
    'dependency_risk_score', (v_scores->>'dependency_risk_score')::int,
    'recovery_readiness', (v_scores->>'recovery_readiness')::int,
    'organizational_resilience_status', v_org_status,
    'positive_resilience_indicators', v_positive,
    'resilience_areas', v_filtered,
    'recommendations', v_recs,
    'vulnerabilities', v_vulns,
    'personal_areas', v_personal,
    'resilience_signals', jsonb_build_object(
      'continuity_planning', (v_metrics->>'continuity_active')::int,
      'risk_mitigation_progress', (v_metrics->>'risks_mitigating')::int,
      'backup_ownership_coverage', (v_metrics->>'continuity_with_backup')::int,
      'operational_dependencies', (v_metrics->>'integrations_connected')::int,
      'learning_implementation', (v_metrics->>'learning_items')::int,
      'capacity_balance', (v_metrics->>'capacity_healthy')::int,
      'policy_compliance', 100 - least(100, (v_metrics->>'compliance_gaps')::int * 20),
      'incident_preparedness', (v_metrics->>'exercises')::int,
      'vendor_diversification', (v_metrics->>'external_vendors')::int,
      'leadership_readiness', round(((v_metrics->>'two_fa_count')::numeric / greatest(1, (v_metrics->>'team_count')::int)) * 100)::int
    ),
    'principle', 'Resilience indicators remain informational. Aipify provides insights — organizations remain responsible for preparedness and recovery.'
  );
end;
$$;

create or replace function public.list_app_portal_resilience_timeline(
  p_period_from date default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_items jsonb := '[]'::jsonb;
begin
  v_ctx := public._aore298_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_resilience_audit_logs l
  where l.company_id = v_company_id
    and (p_period_from is null or l.created_at::date >= p_period_from);

  if to_regclass('public.app_portal_continuity_exercises') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'ex-' || ce.id, 'event_type', 'preparedness_exercise', 'description', ce.title, 'created_at', ce.exercise_date
      ) order by ce.exercise_date desc)
      from public.app_portal_continuity_exercises ce
      join public.app_portal_continuity_plans cp on cp.id = ce.plan_id
      where cp.company_id = v_company_id
        and (p_period_from is null or ce.exercise_date >= p_period_from)
      limit 10
    ), '[]'::jsonb);
  end if;

  if to_regclass('public.app_portal_risks') is not null then
    v_items := v_items || coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', 'risk-' || r.id, 'event_type', 'vulnerability_resolved', 'description', r.title, 'created_at', r.updated_at
      ) order by r.updated_at desc)
      from public.app_portal_risks r
      where r.company_id = v_company_id and r.status = 'resolved'
        and (p_period_from is null or r.updated_at::date >= p_period_from)
      limit 10
    ), '[]'::jsonb);
  end if;

  return jsonb_build_object('found', true, 'timeline', v_items);
end;
$$;

create or replace function public.list_app_portal_resilience_recommendations(
  p_priority text default null,
  p_category text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_recs jsonb;
begin
  v_ctx := public._aore298_access_context();
  v_recs := public._aore298_build_recommendations(public._aore298_resilience_metrics((v_ctx->>'company_id')::uuid));

  if p_priority is not null or (p_search is not null and trim(p_search) <> '') then
    select coalesce(jsonb_agg(r), '[]'::jsonb) into v_recs from (
      select r from jsonb_array_elements(v_recs) r
      where (p_priority is null or r->>'priority' = p_priority)
        and (p_search is null or trim(p_search) = '' or r->>'key' ilike '%' || trim(p_search) || '%')
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'recommendations', v_recs);
end;
$$;

create or replace function public.get_app_portal_resilience_vulnerabilities(
  p_category text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_metrics jsonb;
  v_areas jsonb;
  v_vulns jsonb;
begin
  v_ctx := public._aore298_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_metrics := public._aore298_resilience_metrics(v_company_id);
  v_areas := public._aore298_build_areas(v_company_id, v_metrics);
  v_vulns := public._aore298_build_vulnerabilities(v_metrics, v_areas);

  if p_search is not null and trim(p_search) <> '' then
    select coalesce(jsonb_agg(v), '[]'::jsonb) into v_vulns from (
      select v from jsonb_array_elements(v_vulns) v
      where v->>'key' ilike '%' || trim(p_search) || '%'
    ) sub;
  end if;

  return jsonb_build_object('found', true, 'vulnerabilities', v_vulns, 'metrics', v_metrics);
end;
$$;

grant execute on function public.list_app_portal_resilience(text, text, text, text, text, date, text) to authenticated;
grant execute on function public.list_app_portal_resilience_timeline(date, text) to authenticated;
grant execute on function public.list_app_portal_resilience_recommendations(text, text, text) to authenticated;
grant execute on function public.get_app_portal_resilience_vulnerabilities(text, text) to authenticated;
grant execute on function public.begin_app_portal_resilience_review() to authenticated;
