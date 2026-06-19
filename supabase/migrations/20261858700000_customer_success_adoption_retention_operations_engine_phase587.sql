-- Phase 587 — Customer Success, Adoption & Retention Operations Engine
-- Feature owner: CUSTOMER APP + PLATFORM ADMIN
-- Routes: /app/customer-success/* · /platform/customer-success/*
-- Helpers: _csar587_*

create table if not exists public.organization_csar_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  health_engine_enabled boolean not null default true,
  adoption_engine_enabled boolean not null default true,
  renewal_intelligence_enabled boolean not null default true,
  expansion_engine_enabled boolean not null default true,
  advocacy_engine_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_csar_settings enable row level security;
revoke all on public.organization_csar_settings from authenticated, anon;

create table if not exists public.organization_csar_onboarding_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  milestone_key text not null,
  milestone_title text not null,
  milestone_status text not null default 'pending' check (
    milestone_status in ('pending', 'in_progress', 'completed', 'skipped')
  ),
  completed_at timestamptz,
  sort_order integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, milestone_key)
);

alter table public.organization_csar_onboarding_milestones enable row level security;
revoke all on public.organization_csar_onboarding_milestones from authenticated, anon;

create table if not exists public.organization_csar_health_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  health_key text not null default 'current',
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'attention_required', 'at_risk')
  ),
  health_score integer not null default 75 check (health_score between 0 and 100),
  login_activity_score integer not null default 75,
  companion_usage_score integer not null default 75,
  business_pack_usage_score integer not null default 75,
  user_adoption_score integer not null default 75,
  workflow_activity_score integer not null default 75,
  knowledge_activity_score integer not null default 75,
  support_activity_score integer not null default 75,
  renewal_risk_score integer not null default 20,
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

alter table public.organization_csar_health_scores enable row level security;
revoke all on public.organization_csar_health_scores from authenticated, anon;

create table if not exists public.organization_csar_adoption_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  adoption_pct integer not null default 0 check (adoption_pct between 0 and 100),
  metric_category text not null default 'feature' check (
    metric_category in ('feature', 'business_pack', 'department', 'executive', 'companion')
  ),
  trend_label text not null default 'stable',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, metric_key)
);

alter table public.organization_csar_adoption_metrics enable row level security;
revoke all on public.organization_csar_adoption_metrics from authenticated, anon;

create table if not exists public.organization_csar_value_realization (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  value_key text not null,
  value_title text not null,
  metric_value integer not null default 0,
  value_unit text not null default 'count',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, value_key)
);

alter table public.organization_csar_value_realization enable row level security;
revoke all on public.organization_csar_value_realization from authenticated, anon;

create table if not exists public.organization_csar_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_key text not null,
  risk_title text not null,
  risk_type text not null check (
    risk_type in (
      'low_usage', 'no_login', 'failed_onboarding', 'missing_configuration',
      'declining_adoption', 'pending_renewal', 'support_spike'
    )
  ),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  risk_status text not null default 'open' check (risk_status in ('open', 'acknowledged', 'resolved')),
  companion_recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, risk_key)
);

alter table public.organization_csar_risks enable row level security;
revoke all on public.organization_csar_risks from authenticated, anon;

create table if not exists public.organization_csar_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'unused_capacity', 'additional_users', 'additional_domains',
      'business_pack', 'enterprise_upgrade'
    )
  ),
  opportunity_status text not null default 'open' check (opportunity_status in ('open', 'in_progress', 'won', 'dismissed')),
  recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, opportunity_key)
);

alter table public.organization_csar_opportunities enable row level security;
revoke all on public.organization_csar_opportunities from authenticated, anon;

create table if not exists public.organization_csar_renewals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  renewal_key text not null default 'primary',
  renewal_date date,
  days_until_renewal integer,
  health_score integer not null default 75,
  usage_trend text not null default 'stable',
  adoption_trend text not null default 'stable',
  renewal_status text not null default 'upcoming' check (
    renewal_status in ('upcoming', 'review_triggered', 'plan_generated', 'at_risk', 'renewed')
  ),
  risk_factors jsonb not null default '[]'::jsonb,
  expansion_notes text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, renewal_key)
);

alter table public.organization_csar_renewals enable row level security;
revoke all on public.organization_csar_renewals from authenticated, anon;

create table if not exists public.organization_csar_playbooks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  playbook_key text not null,
  playbook_title text not null,
  playbook_type text not null check (
    playbook_type in (
      'new_customer', 'executive_adoption', 'support_adoption',
      'knowledge_center', 'companion_adoption', 'business_pack'
    )
  ),
  playbook_status text not null default 'available' check (
    playbook_status in ('available', 'assigned', 'in_progress', 'completed')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, playbook_key)
);

alter table public.organization_csar_playbooks enable row level security;
revoke all on public.organization_csar_playbooks from authenticated, anon;

create table if not exists public.organization_csar_journey_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_key text not null,
  stage_title text not null,
  stage_status text not null default 'pending' check (
    stage_status in ('pending', 'in_progress', 'completed')
  ),
  sort_order integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, stage_key)
);

alter table public.organization_csar_journey_stages enable row level security;
revoke all on public.organization_csar_journey_stages from authenticated, anon;

create table if not exists public.organization_csar_business_pack_adoption (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  adoption_pct integer not null default 0 check (adoption_pct between 0 and 100),
  usage_summary text not null default '',
  expansion_opportunity text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_csar_business_pack_adoption enable row level security;
revoke all on public.organization_csar_business_pack_adoption from authenticated, anon;

create table if not exists public.organization_csar_advocacy (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  advocacy_key text not null,
  advocacy_title text not null,
  advocacy_type text not null check (
    advocacy_type in ('reference', 'case_study', 'testimonial', 'growth_partner', 'champion', 'success_story')
  ),
  advocacy_status text not null default 'potential' check (
    advocacy_status in ('potential', 'requested', 'in_progress', 'published', 'declined')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, advocacy_key)
);

alter table public.organization_csar_advocacy enable row level security;
revoke all on public.organization_csar_advocacy from authenticated, anon;

create table if not exists public.organization_csar_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'customer_success',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_csar_audit_logs enable row level security;
revoke all on public.organization_csar_audit_logs from authenticated, anon;

create or replace function public._csar587_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._csar587_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'customer_success'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_csar_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'customer_success'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._csar587_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_csar_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._csar587_health_status(p_score integer)
returns text language sql immutable as $$
  select case
    when coalesce(p_score, 0) >= 75 then 'healthy'
    when coalesce(p_score, 0) >= 50 then 'attention_required'
    else 'at_risk'
  end;
$$;

create or replace function public._csar587_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._csar587_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_csar_health_scores where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_csar_onboarding_milestones (
    organization_id, milestone_key, milestone_title, milestone_status, sort_order, summary
  ) values
    (p_org_id, 'org_created', 'Organization Created', 'completed', 1, 'Workspace established.'),
    (p_org_id, 'users_invited', 'Users Invited', 'in_progress', 2, 'Invite team members to activate adoption.'),
    (p_org_id, 'companion_activated', 'Companion Activated', 'in_progress', 3, 'Companion ready to assist daily work.'),
    (p_org_id, 'business_pack_installed', 'Business Pack Installed', 'pending', 4, 'Install a Business Pack for measurable value.'),
    (p_org_id, 'knowledge_imported', 'Knowledge Imported', 'pending', 5, 'Import approved knowledge sources.'),
    (p_org_id, 'workflow_created', 'Workflow Created', 'pending', 6, 'Create first operational workflow.'),
    (p_org_id, 'first_approval', 'First Approval Completed', 'pending', 7, 'Complete first Trust Action approval.'),
    (p_org_id, 'first_success', 'First Success Achieved', 'pending', 8, 'Achieve first measurable success outcome.');

  insert into public.organization_csar_health_scores (
    organization_id, health_key, health_status, health_score,
    login_activity_score, companion_usage_score, business_pack_usage_score,
    user_adoption_score, workflow_activity_score, knowledge_activity_score,
    support_activity_score, renewal_risk_score, summary
  ) values (
    p_org_id, 'current', 'attention_required', 72,
    78, 83, 65, 70, 68, 92, 71, 35,
    'Healthy adoption in Knowledge Center; Support Operations and workflow activity need attention.'
  );

  insert into public.organization_csar_adoption_metrics (
    organization_id, metric_key, metric_title, adoption_pct, metric_category, trend_label, summary
  ) values
    (p_org_id, 'knowledge_center', 'Knowledge Center', 92, 'feature', 'up', 'Strong knowledge adoption across teams.'),
    (p_org_id, 'support_operations', 'Support Operations', 71, 'feature', 'stable', 'Support pack adoption progressing.'),
    (p_org_id, 'companion', 'Companion', 83, 'companion', 'up', 'Companion used for daily guidance.'),
    (p_org_id, 'executive', 'Executive Adoption', 68, 'executive', 'stable', 'Executive briefing engagement moderate.');

  insert into public.organization_csar_value_realization (
    organization_id, value_key, value_title, metric_value, value_unit, summary
  ) values
    (p_org_id, 'approvals_completed', 'Approvals Completed', 47, 'count', 'Trust actions completed with audit trail.'),
    (p_org_id, 'knowledge_searches', 'Knowledge Searches', 312, 'count', 'Self-service knowledge usage.'),
    (p_org_id, 'workflows_executed', 'Workflows Executed', 89, 'count', 'Operational workflows run successfully.'),
    (p_org_id, 'support_cases_assisted', 'Support Cases Assisted', 156, 'count', 'Support cases with Companion assistance.'),
    (p_org_id, 'tasks_completed', 'Tasks Completed', 234, 'count', 'Tasks completed through Aipify.'),
    (p_org_id, 'time_saved_hours', 'Estimated Time Saved', 42, 'hours', 'Illustrative time saved from automation.');

  insert into public.organization_csar_risks (
    organization_id, risk_key, risk_title, risk_type, severity, companion_recommendation, summary
  ) values
    (p_org_id, 'declining_workflow', 'Declining Workflow Activity', 'declining_adoption', 'medium',
     'Review workflow adoption playbook and assign an owner.', 'Workflow executions down 12% this month.'),
    (p_org_id, 'pending_renewal', 'Renewal Review Approaching', 'pending_renewal', 'high',
     'Generate customer success plan 90 days before renewal.', 'Renewal in 87 days — review recommended.');

  insert into public.organization_csar_opportunities (
    organization_id, opportunity_key, opportunity_title, opportunity_type, recommendation, summary
  ) values
    (p_org_id, 'knowledge_pack', 'Recommend Knowledge Pack', 'business_pack',
     'Customer uses Support Pack — Knowledge Pack would reduce ticket volume.', 'Cross-pack expansion opportunity.'),
    (p_org_id, 'license_upgrade', 'License Capacity Upgrade', 'additional_users',
     'Customer uses 95% of user licenses — recommend upgrade before adding employee 26.', 'Capacity expansion needed.');

  insert into public.organization_csar_renewals (
    organization_id, renewal_key, renewal_date, days_until_renewal, health_score,
    usage_trend, adoption_trend, renewal_status, risk_factors, expansion_notes, summary
  ) values (
    p_org_id, 'primary', current_date + 87, 87, 72, 'stable', 'up', 'review_triggered',
    '["moderate_support_volume","workflow_adoption_gap"]'::jsonb,
    'Knowledge Pack and additional user licenses are expansion candidates.',
    '90-day renewal review triggered — customer success plan recommended.'
  );

  insert into public.organization_csar_playbooks (
    organization_id, playbook_key, playbook_title, playbook_type, playbook_status, summary
  ) values
    (p_org_id, 'new_customer', 'New Customer Playbook', 'new_customer', 'in_progress', 'Onboarding through first success.'),
    (p_org_id, 'executive_adoption', 'Executive Adoption Playbook', 'executive_adoption', 'available', 'Executive briefing and decision support.'),
    (p_org_id, 'support_adoption', 'Support Adoption Playbook', 'support_adoption', 'assigned', 'Support operations adoption path.'),
    (p_org_id, 'knowledge_center', 'Knowledge Center Playbook', 'knowledge_center', 'available', 'Knowledge import and search adoption.'),
    (p_org_id, 'companion_adoption', 'Companion Adoption Playbook', 'companion_adoption', 'in_progress', 'Daily Companion usage patterns.');

  insert into public.organization_csar_journey_stages (
    organization_id, stage_key, stage_title, stage_status, sort_order, summary
  ) values
    (p_org_id, 'signup', 'Signup', 'completed', 1, 'Organization joined Aipify.'),
    (p_org_id, 'onboarding', 'Onboarding', 'in_progress', 2, 'Setup and configuration in progress.'),
    (p_org_id, 'activation', 'Activation', 'in_progress', 3, 'Companion and packs activating.'),
    (p_org_id, 'adoption', 'Adoption', 'in_progress', 4, 'Feature and pack adoption growing.'),
    (p_org_id, 'expansion', 'Expansion', 'pending', 5, 'Expansion opportunities identified.'),
    (p_org_id, 'renewal', 'Renewal', 'pending', 6, 'Renewal review scheduled.'),
    (p_org_id, 'advocacy', 'Advocacy', 'pending', 7, 'Success story and reference potential.');

  insert into public.organization_csar_business_pack_adoption (
    organization_id, pack_key, pack_title, adoption_pct, usage_summary, expansion_opportunity, summary
  ) values
    (p_org_id, 'support', 'Support Pack', 71, 'Ticket triage and knowledge-assisted responses.',
     'Add Knowledge Pack to reduce repeat tickets.', 'Support Pack → Support Adoption.'),
    (p_org_id, 'knowledge', 'Knowledge Pack', 92, 'Search and approved knowledge usage.',
     'Expand to department-specific knowledge paths.', 'Knowledge Pack → Knowledge Adoption.');

  insert into public.organization_csar_advocacy (
    organization_id, advocacy_key, advocacy_title, advocacy_type, advocacy_status, summary
  ) values
    (p_org_id, 'reference_potential', 'Customer Reference Potential', 'reference', 'potential',
     'Strong adoption metrics — candidate for reference program.'),
    (p_org_id, 'success_story', 'Operational Success Story', 'success_story', 'requested',
     'Document time saved and workflow improvements for case study.');

  perform public._csar587_log(p_org_id, 'health_score_updated', 'Customer success operations baseline seeded.');
end; $$;

create or replace function public.get_organization_customer_success_operations_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_health public.organization_csar_health_scores;
begin
  v_org_id := public._csar587_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._csar587_seed(v_org_id);
  select * into v_health from public.organization_csar_health_scores
  where organization_id = v_org_id and health_key = 'current' limit 1;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'A successful customer achieves value — not just a purchase.',
      'privacy_note', 'Customer success metadata only — no raw operational content.',
      'health_score', coalesce(v_health.health_score, 70),
      'health_status', coalesce(v_health.health_status, 'healthy'),
      'health_status_label', case coalesce(v_health.health_status, 'healthy')
        when 'healthy' then 'Healthy'
        when 'attention_required' then 'Attention Required'
        else 'At Risk'
      end,
      'stats', jsonb_build_object(
        'open_risks', (select count(*) from public.organization_csar_risks where organization_id = v_org_id and risk_status = 'open'),
        'open_opportunities', (select count(*) from public.organization_csar_opportunities where organization_id = v_org_id and opportunity_status = 'open'),
        'onboarding_completed', (select count(*) from public.organization_csar_onboarding_milestones where organization_id = v_org_id and milestone_status = 'completed'),
        'onboarding_total', (select count(*) from public.organization_csar_onboarding_milestones where organization_id = v_org_id),
        'days_until_renewal', (select days_until_renewal from public.organization_csar_renewals where organization_id = v_org_id limit 1)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'risk_title', r.risk_title, 'recommendation', r.companion_recommendation
        )) from public.organization_csar_risks r
        where r.organization_id = v_org_id and r.risk_status = 'open' limit 5
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'A successful customer achieves value — not just a purchase.',
    'privacy_note', 'Customer success metadata only.',
    'health_score', coalesce(v_health.health_score, 70),
    'health_status', coalesce(v_health.health_status, 'healthy'),
    'onboarding', coalesce((select jsonb_agg(jsonb_build_object(
      'milestone_key', m.milestone_key, 'milestone_title', m.milestone_title,
      'milestone_status', m.milestone_status, 'completed_at', m.completed_at, 'summary', m.summary
    ) order by m.sort_order) from public.organization_csar_onboarding_milestones m where m.organization_id = v_org_id), '[]'::jsonb),
    'health', coalesce((select jsonb_build_object(
      'health_score', h.health_score, 'health_status', h.health_status,
      'login_activity_score', h.login_activity_score, 'companion_usage_score', h.companion_usage_score,
      'business_pack_usage_score', h.business_pack_usage_score, 'user_adoption_score', h.user_adoption_score,
      'workflow_activity_score', h.workflow_activity_score, 'knowledge_activity_score', h.knowledge_activity_score,
      'support_activity_score', h.support_activity_score, 'renewal_risk_score', h.renewal_risk_score,
      'summary', h.summary
    ) from public.organization_csar_health_scores h where h.organization_id = v_org_id and h.health_key = 'current'), '{}'::jsonb),
    'adoption', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', a.metric_key, 'metric_title', a.metric_title, 'adoption_pct', a.adoption_pct,
      'metric_category', a.metric_category, 'trend_label', a.trend_label, 'summary', a.summary
    ) order by a.adoption_pct desc) from public.organization_csar_adoption_metrics a where a.organization_id = v_org_id), '[]'::jsonb),
    'value_realization', coalesce((select jsonb_agg(jsonb_build_object(
      'value_key', v.value_key, 'value_title', v.value_title, 'metric_value', v.metric_value,
      'value_unit', v.value_unit, 'summary', v.summary
    ) order by v.metric_value desc) from public.organization_csar_value_realization v where v.organization_id = v_org_id), '[]'::jsonb),
    'risks', coalesce((select jsonb_agg(jsonb_build_object(
      'risk_key', r.risk_key, 'risk_title', r.risk_title, 'risk_type', r.risk_type,
      'severity', r.severity, 'risk_status', r.risk_status,
      'companion_recommendation', r.companion_recommendation, 'summary', r.summary
    ) order by r.severity desc) from public.organization_csar_risks r where r.organization_id = v_org_id), '[]'::jsonb),
    'opportunities', coalesce((select jsonb_agg(jsonb_build_object(
      'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
      'opportunity_type', o.opportunity_type, 'opportunity_status', o.opportunity_status,
      'recommendation', o.recommendation, 'summary', o.summary
    ) order by o.opportunity_title) from public.organization_csar_opportunities o where o.organization_id = v_org_id), '[]'::jsonb),
    'renewals', coalesce((select jsonb_agg(jsonb_build_object(
      'renewal_key', r.renewal_key, 'renewal_date', r.renewal_date, 'days_until_renewal', r.days_until_renewal,
      'health_score', r.health_score, 'usage_trend', r.usage_trend, 'adoption_trend', r.adoption_trend,
      'renewal_status', r.renewal_status, 'risk_factors', r.risk_factors, 'expansion_notes', r.expansion_notes,
      'summary', r.summary
    )) from public.organization_csar_renewals r where r.organization_id = v_org_id), '[]'::jsonb),
    'playbooks', coalesce((select jsonb_agg(jsonb_build_object(
      'playbook_key', p.playbook_key, 'playbook_title', p.playbook_title,
      'playbook_type', p.playbook_type, 'playbook_status', p.playbook_status, 'summary', p.summary
    ) order by p.playbook_title) from public.organization_csar_playbooks p where p.organization_id = v_org_id), '[]'::jsonb),
    'journey', coalesce((select jsonb_agg(jsonb_build_object(
      'stage_key', j.stage_key, 'stage_title', j.stage_title, 'stage_status', j.stage_status,
      'sort_order', j.sort_order, 'summary', j.summary
    ) order by j.sort_order) from public.organization_csar_journey_stages j where j.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', b.pack_key, 'pack_title', b.pack_title, 'adoption_pct', b.adoption_pct,
      'usage_summary', b.usage_summary, 'expansion_opportunity', b.expansion_opportunity, 'summary', b.summary
    ) order by b.adoption_pct desc) from public.organization_csar_business_pack_adoption b where b.organization_id = v_org_id), '[]'::jsonb),
    'advocacy', coalesce((select jsonb_agg(jsonb_build_object(
      'advocacy_key', a.advocacy_key, 'advocacy_title', a.advocacy_title,
      'advocacy_type', a.advocacy_type, 'advocacy_status', a.advocacy_status, 'summary', a.summary
    ) order by a.advocacy_title) from public.organization_csar_advocacy a where a.organization_id = v_org_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_csar_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'reports', jsonb_build_object(
      'health_report', coalesce(v_health.health_score, 0),
      'adoption_avg', coalesce((select round(avg(adoption_pct)) from public.organization_csar_adoption_metrics where organization_id = v_org_id), 0),
      'value_metrics', (select count(*) from public.organization_csar_value_realization where organization_id = v_org_id),
      'renewal_days', (select days_until_renewal from public.organization_csar_renewals where organization_id = v_org_id limit 1)
    )
  );
end;
$$;

create or replace function public.get_platform_customer_success_operations_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_hub jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  v_hub := public.get_platform_customer_success_hub_center(
    case v_section
      when 'customers' then 'health'
      when 'health_scores' then 'health'
      when 'adoption' then 'adoption'
      when 'risks' then 'risks'
      when 'opportunities' then 'expansion'
      when 'renewals' then 'plans'
      when 'reports' then 'reports'
      when 'onboarding' then 'onboarding'
      when 'playbooks' then 'playbooks'
      else 'overview'
    end
  );

  return v_hub || jsonb_build_object(
    'found', true,
    'section', v_section,
    'principle', 'Activation, adoption, expansion, and retention — measurable customer value.',
    'privacy_note', 'Platform aggregates only — no customer operational content.',
    'engine', 'customer_success_adoption_retention_phase587'
  );
end;
$$;

create or replace function public.get_aipify_customer_success_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_customer_success_operations_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Customer Success Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'at_risk',
        'observation', format('Health score %s — %s open risk(s) identified.',
          v_center->>'health_score', v_stats->>'open_risks'),
        'recommendation', 'Review risks and assign success playbooks.',
        'href', '/app/customer-success/risks'
      ),
      jsonb_build_object(
        'key', 'expansion',
        'observation', format('%s expansion opportunity(ies) available.', v_stats->>'open_opportunities'),
        'recommendation', 'Review unused capacity and Business Pack recommendations.',
        'href', '/app/customer-success/opportunities'
      ),
      jsonb_build_object(
        'key', 'renewal',
        'observation', format('Renewal in %s days.', coalesce(v_stats->>'days_until_renewal', '—')),
        'recommendation', 'Generate customer success plan before renewal review.',
        'href', '/app/customer-success/renewals'
      ),
      jsonb_build_object(
        'key', 'onboarding',
        'observation', format('%s of %s onboarding milestones completed.',
          v_stats->>'onboarding_completed', v_stats->>'onboarding_total'),
        'recommendation', 'Complete remaining onboarding steps for faster time-to-value.',
        'href', '/app/customer-success/onboarding'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_platform_customer_success_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;
  return public.get_platform_customer_success_operations_center('overview');
end;
$$;

grant execute on function public.get_organization_customer_success_operations_center(text) to authenticated;
grant execute on function public.get_platform_customer_success_operations_center(text) to authenticated;
grant execute on function public.get_aipify_customer_success_advisor_bundle() to authenticated;
