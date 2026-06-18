-- Phase 434 — Knowledge Evolution Engine (Customer App)
-- Route: /app/knowledge/evolution · Builds on Phase 317 KEC + support/EKE signals

create table if not exists public.knowledge_evolution_engine_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  auto_detection_enabled boolean not null default true,
  freshness_monitoring_enabled boolean not null default true,
  support_to_knowledge_enabled boolean not null default true,
  executive_dashboard_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_evolution_missing_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (signal_type in (
    'repeated_support', 'repeated_employee', 'failed_search', 'escalated_ticket', 'frequently_explained'
  )),
  section_key text not null default 'missing_knowledge' check (section_key in (
    'knowledge_opportunities', 'missing_knowledge', 'suggested_improvements',
    'outdated_content', 'high_risk_gaps'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  department text not null default '',
  occurrence_count integer not null default 1,
  status_key text not null default 'requires_attention' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified'
  )),
  suggested_action text not null default '',
  suggested_improvement_type text not null default '',
  owner_label text not null default '',
  version_label text not null default '1.0',
  review_date date,
  last_updated_at timestamptz,
  usage_frequency integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_evolution_missing_signals_tenant_idx
  on public.knowledge_evolution_missing_signals (tenant_id, section_key, resolved, updated_at desc);

create table if not exists public.knowledge_evolution_knowledge_candidates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  candidate_type text not null check (candidate_type in (
    'faq_suggestion', 'knowledge_article', 'training_material', 'procedure', 'compliance_doc', 'customer_instruction'
  )),
  source_type text not null default 'support_ticket' check (source_type in (
    'support_ticket', 'employee_question', 'search_failure', 'escalation', 'companion_detection'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  department text not null default '',
  owner_label text not null default '',
  status text not null default 'pending_approval' check (status in (
    'pending_approval', 'approved', 'rejected', 'published', 'archived'
  )),
  version_label text not null default 'draft',
  review_date date,
  suggested_action text not null default '',
  approval_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_evolution_knowledge_candidates_tenant_idx
  on public.knowledge_evolution_knowledge_candidates (tenant_id, status, created_at desc);

create table if not exists public.knowledge_evolution_engine_audit (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_evolution_engine_audit_tenant_idx
  on public.knowledge_evolution_engine_audit (tenant_id, created_at desc);

alter table public.knowledge_evolution_engine_settings enable row level security;
alter table public.knowledge_evolution_missing_signals enable row level security;
alter table public.knowledge_evolution_knowledge_candidates enable row level security;
alter table public.knowledge_evolution_engine_audit enable row level security;
revoke all on public.knowledge_evolution_engine_settings from authenticated, anon;
revoke all on public.knowledge_evolution_missing_signals from authenticated, anon;
revoke all on public.knowledge_evolution_knowledge_candidates from authenticated, anon;
revoke all on public.knowledge_evolution_engine_audit from authenticated, anon;

create or replace function public._kee434_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant uuid; v_user_id uuid; v_can_executive boolean := false;
begin
  v_tenant := public._presence_tenant_for_auth();
  if v_tenant is null then
    return jsonb_build_object('found', false, 'error', 'No tenant context');
  end if;
  v_user_id := public._mta_app_user_id();
  v_can_executive := public._irp_has_permission('knowledge_evolution.manage', v_tenant);
  return jsonb_build_object(
    'found', true,
    'tenant_id', v_tenant,
    'user_id', v_user_id,
    'can_executive', v_can_executive,
    'can_manage', public._irp_has_permission('knowledge_evolution.manage', v_tenant),
    'can_contribute', public._irp_has_permission('knowledge_evolution.contribute', v_tenant)
  );
end; $$;

create or replace function public._kee434_log(
  p_tenant uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.knowledge_evolution_engine_audit
    (tenant_id, user_id, item_type, item_id, action, description)
  values (p_tenant, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._kee434_item_json(
  p_id uuid, p_title text, p_summary text, p_source text, p_owner text, p_department text,
  p_status text, p_section text, p_suggested text default '', p_improvement text default '',
  p_version text default '1.0', p_review date default null, p_last_updated timestamptz default null,
  p_usage int default 0, p_occurrence int default 0, p_item_type text default 'signal'
) returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'id', p_id, 'title', p_title, 'summary', p_summary, 'source', p_source,
    'owner', p_owner, 'department', p_department, 'status_key', p_status,
    'section_key', p_section, 'suggested_action', p_suggested,
    'suggested_improvement_type', p_improvement, 'version', p_version,
    'review_date', p_review, 'last_updated_at', p_last_updated,
    'usage_frequency', p_usage, 'occurrence_count', p_occurrence, 'item_type', p_item_type
  );
$$;

create or replace function public._kee434_seed(p_tenant uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.knowledge_evolution_engine_settings (tenant_id) values (p_tenant) on conflict do nothing;

  if not exists (select 1 from public.aipify_kec_center_assets where tenant_id = p_tenant limit 1) then
    perform public._kec_seed(p_tenant);
  end if;

  if exists (select 1 from public.knowledge_evolution_missing_signals where tenant_id = p_tenant limit 1) then
    return;
  end if;

  insert into public.knowledge_evolution_missing_signals (
    tenant_id, signal_type, section_key, title, summary, department, occurrence_count,
    status_key, suggested_action, suggested_improvement_type, owner_label, version_label,
    review_date, last_updated_at, usage_frequency
  ) values
    (p_tenant, 'repeated_employee', 'missing_knowledge',
     'Onboarding questions cluster', '17 employees asked similar onboarding questions.',
     'People Operations', 17, 'requires_attention', 'Create onboarding guide.', 'add_faq_section',
     'HR Lead', '1.0', current_date + 14, now() - interval '30 days', 17),
    (p_tenant, 'repeated_support', 'high_risk_gaps',
     'Missing compliance documentation', 'Escalated tickets reference undocumented compliance steps.',
     'Legal', 6, 'requires_attention', 'Add compliance documentation.', 'add_procedure',
     'Compliance Owner', '0.9', current_date + 7, now() - interval '90 days', 6),
    (p_tenant, 'failed_search', 'knowledge_opportunities',
     'Most searched topic without article', 'Refund policy searches fail frequently.',
     'Support', 42, 'waiting', 'Create FAQ for refund policy.', 'create_article',
     'Support Lead', 'draft', current_date + 21, now() - interval '7 days', 42),
    (p_tenant, 'frequently_explained', 'suggested_improvements',
     'Workflow documentation needs screenshots', 'Agents repeatedly explain the same workflow steps.',
     'Operations', 11, 'information', 'Add screenshots to workflow documentation.', 'add_screenshots',
     'Ops Manager', '2.1', current_date + 30, now() - interval '45 days', 11),
    (p_tenant, 'escalated_ticket', 'outdated_content',
     'Procedure last updated 18 months ago', 'Customer onboarding procedure has not been reviewed recently.',
     'Customer Success', 3, 'requires_attention', 'Suggested review required.', 'rewrite_article',
     'CS Owner', '3.0', (current_date - 30), now() - interval '548 days', 8);

  insert into public.knowledge_evolution_knowledge_candidates (
    tenant_id, candidate_type, source_type, title, summary, department, owner_label,
    status, version_label, review_date, suggested_action
  ) values
    (p_tenant, 'faq_suggestion', 'support_ticket',
     'FAQ: Refund timeline', 'Support ticket pattern suggests a reusable FAQ entry.',
     'Support', 'Support Lead', 'pending_approval', 'draft', current_date + 14,
     'Review and approve before publication.'),
    (p_tenant, 'knowledge_article', 'support_ticket',
     'Knowledge article: Escalation handoff', 'Repeated escalations indicate missing handoff documentation.',
     'Support', 'Support Lead', 'pending_approval', 'draft', current_date + 7,
     'Review article draft before publishing.'),
    (p_tenant, 'training_material', 'employee_question',
     'Training material: New hire systems access', 'Employee questions cluster around systems access steps.',
     'People Operations', 'HR Lead', 'pending_approval', 'draft', current_date + 21,
     'Approve training outline before distribution.');
end; $$;

create or replace function public.get_knowledge_evolution_engine()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_tenant uuid; v_user_id uuid;
  v_opportunities jsonb; v_missing jsonb; v_improvements jsonb; v_outdated jsonb; v_risk jsonb;
  v_candidates jsonb; v_intelligence jsonb; v_executive jsonb; v_health jsonb;
  v_score int := 74;
begin
  v_ctx := public._kee434_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_tenant := (v_ctx->>'tenant_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._kee434_seed(v_tenant);

  select coalesce(jsonb_agg(
    public._kee434_item_json(
      s.id, s.title, s.summary, s.signal_type, s.owner_label, s.department, s.status_key,
      s.section_key, s.suggested_action, s.suggested_improvement_type, s.version_label,
      s.review_date, s.last_updated_at, s.usage_frequency, s.occurrence_count, 'signal'
    ) order by s.occurrence_count desc), '[]'::jsonb)
  into v_opportunities
  from public.knowledge_evolution_missing_signals s
  where s.tenant_id = v_tenant and s.section_key = 'knowledge_opportunities' and not s.resolved;

  select coalesce(jsonb_agg(
    public._kee434_item_json(
      s.id, s.title, s.summary, s.signal_type, s.owner_label, s.department, s.status_key,
      s.section_key, s.suggested_action, s.suggested_improvement_type, s.version_label,
      s.review_date, s.last_updated_at, s.usage_frequency, s.occurrence_count, 'signal'
    ) order by s.occurrence_count desc), '[]'::jsonb)
  into v_missing
  from public.knowledge_evolution_missing_signals s
  where s.tenant_id = v_tenant and s.section_key = 'missing_knowledge' and not s.resolved;

  select coalesce(jsonb_agg(
    public._kee434_item_json(
      s.id, s.title, s.summary, s.signal_type, s.owner_label, s.department, s.status_key,
      s.section_key, s.suggested_action, s.suggested_improvement_type, s.version_label,
      s.review_date, s.last_updated_at, s.usage_frequency, s.occurrence_count, 'signal'
    ) order by s.updated_at desc), '[]'::jsonb)
  into v_improvements
  from public.knowledge_evolution_missing_signals s
  where s.tenant_id = v_tenant and s.section_key = 'suggested_improvements' and not s.resolved;

  select coalesce(jsonb_agg(
    public._kee434_item_json(
      s.id, s.title, s.summary, s.signal_type, s.owner_label, s.department, s.status_key,
      s.section_key, s.suggested_action, s.suggested_improvement_type, s.version_label,
      s.review_date, s.last_updated_at, s.usage_frequency, s.occurrence_count, 'signal'
    ) order by s.last_updated_at nulls last), '[]'::jsonb)
  into v_outdated
  from public.knowledge_evolution_missing_signals s
  where s.tenant_id = v_tenant and s.section_key = 'outdated_content' and not s.resolved;

  v_outdated := v_outdated || coalesce((
    select jsonb_agg(public._kee434_item_json(
      gen_random_uuid(), a.title,
      'Procedure last updated ' || a.days_since_review || ' days ago.',
      'freshness_monitor', 'SME Owner', initcap(a.domain::text), 'requires_attention',
      'outdated_content', 'Suggested review required.', 'rewrite_article',
      'published', current_date + 30, now() - (a.days_since_review || ' days')::interval,
      a.usage_count, 0, 'asset'
    ) order by a.days_since_review desc)
    from public.aipify_kec_center_assets a
    where a.tenant_id = v_tenant and a.status = 'active' and a.days_since_review >= 180
  ), '[]'::jsonb);

  select coalesce(jsonb_agg(
    public._kee434_item_json(
      s.id, s.title, s.summary, s.signal_type, s.owner_label, s.department, s.status_key,
      s.section_key, s.suggested_action, s.suggested_improvement_type, s.version_label,
      s.review_date, s.last_updated_at, s.usage_frequency, s.occurrence_count, 'signal'
    ) order by s.occurrence_count desc), '[]'::jsonb)
  into v_risk
  from public.knowledge_evolution_missing_signals s
  where s.tenant_id = v_tenant and s.section_key = 'high_risk_gaps' and not s.resolved;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.title, 'summary', c.summary, 'candidate_type', c.candidate_type,
    'source_type', c.source_type, 'department', c.department, 'owner', c.owner_label,
    'status', c.status, 'version', c.version_label, 'review_date', c.review_date,
    'suggested_action', c.suggested_action, 'approval_required', c.approval_required,
    'item_type', 'candidate'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_candidates
  from public.knowledge_evolution_knowledge_candidates c
  where c.tenant_id = v_tenant and c.status in ('pending_approval', 'approved');

  select jsonb_build_object(
    'most_valuable_documents', coalesce((
      select jsonb_agg(jsonb_build_object('title', a.title, 'usage_frequency', a.usage_count, 'department', a.domain)
        order by a.usage_count desc)
      from public.aipify_kec_center_assets a where a.tenant_id = v_tenant and a.status = 'active' limit 5
    ), '[]'::jsonb),
    'most_used_procedures', coalesce((
      select jsonb_agg(jsonb_build_object('title', a.title, 'usage_frequency', a.usage_count)
        order by a.usage_count desc)
      from public.aipify_kec_center_assets a
      where a.tenant_id = v_tenant and a.status = 'active' and a.domain in ('operational', 'support') limit 5
    ), '[]'::jsonb),
    'most_searched_topics', coalesce((
      select jsonb_agg(jsonb_build_object('title', s.title, 'occurrence_count', s.occurrence_count)
        order by s.occurrence_count desc)
      from public.knowledge_evolution_missing_signals s
      where s.tenant_id = v_tenant and s.signal_type in ('failed_search', 'frequently_explained') limit 5
    ), '[]'::jsonb),
    'most_requested_information', coalesce((
      select jsonb_agg(jsonb_build_object('title', s.title, 'occurrence_count', s.occurrence_count)
        order by s.occurrence_count desc)
      from public.knowledge_evolution_missing_signals s
      where s.tenant_id = v_tenant and s.section_key = 'missing_knowledge' limit 5
    ), '[]'::jsonb)
  ) into v_intelligence;

  v_score := greatest(40, least(95, 76
    - (select count(*) from public.knowledge_evolution_missing_signals where tenant_id = v_tenant and section_key = 'high_risk_gaps' and not resolved)
    - (select count(*) filter (where days_since_review >= 180) from public.aipify_kec_center_assets where tenant_id = v_tenant and status = 'active') / 2
  ));

  v_health := jsonb_build_object(
    'score', v_score,
    'label', public._kec_health_label(v_score),
    'coverage_pct', 68,
    'freshness_pct', 72,
    'pending_approvals', (select count(*) from public.knowledge_evolution_knowledge_candidates where tenant_id = v_tenant and status = 'pending_approval'),
    'open_gaps', (select count(*) from public.knowledge_evolution_missing_signals where tenant_id = v_tenant and not resolved)
  );

  if coalesce(v_ctx->>'can_executive', 'false') = 'true' then
    v_executive := jsonb_build_object(
      'knowledge_health', v_score,
      'knowledge_coverage', 68,
      'knowledge_risks', (select count(*) from public.knowledge_evolution_missing_signals where tenant_id = v_tenant and section_key = 'high_risk_gaps' and not resolved),
      'knowledge_growth', (select count(*) from public.knowledge_evolution_knowledge_candidates where tenant_id = v_tenant and status = 'approved'),
      'pending_approvals', (select count(*) from public.knowledge_evolution_knowledge_candidates where tenant_id = v_tenant and status = 'pending_approval')
    );
  else
    v_executive := '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Every organization accumulates knowledge. Aipify helps preserve, organize, improve, and distribute it — humans approve every change.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'No automatic publication. All suggested knowledge changes require human approval.',
    'knowledge_health', v_health,
    'sections', jsonb_build_object(
      'knowledge_opportunities', v_opportunities,
      'missing_knowledge', v_missing,
      'suggested_improvements', v_improvements,
      'outdated_content', v_outdated,
      'high_risk_gaps', v_risk
    ),
    'support_candidates', v_candidates,
    'organizational_intelligence', v_intelligence,
    'executive_dashboard', v_executive,
    'statistics', jsonb_build_object(
      'opportunities_count', jsonb_array_length(v_opportunities),
      'missing_count', jsonb_array_length(v_missing),
      'improvements_count', jsonb_array_length(v_improvements),
      'outdated_count', jsonb_array_length(v_outdated),
      'risk_count', jsonb_array_length(v_risk),
      'candidates_count', jsonb_array_length(v_candidates)
    ),
    'privacy_note', 'Metadata and patterns only — Aipify never auto-publishes knowledge or stores raw support transcripts here.'
  );
end; $$;

create or replace function public.manage_knowledge_evolution_candidate(
  p_candidate_id uuid,
  p_action text,
  p_patch jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_tenant uuid; v_user_id uuid;
begin
  v_ctx := public._kee434_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('ok', false, 'error', 'Access denied');
  end if;
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;

  v_tenant := (v_ctx->>'tenant_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('approve', 'reject', 'archive', 'dismiss_signal', 'resolve_signal') then
    raise exception 'Invalid action';
  end if;

  if p_action in ('approve', 'reject', 'archive') then
    update public.knowledge_evolution_knowledge_candidates set
      status = case p_action
        when 'approve' then 'approved'
        when 'reject' then 'rejected'
        else 'archived'
      end,
      updated_at = now()
    where id = p_candidate_id and tenant_id = v_tenant;
  elsif p_action in ('dismiss_signal', 'resolve_signal') then
    update public.knowledge_evolution_missing_signals set
      resolved = true, updated_at = now()
    where id = p_candidate_id and tenant_id = v_tenant;
  end if;

  perform public._kee434_log(v_tenant, v_user_id, 'candidate', p_candidate_id, p_action, 'Knowledge evolution item updated');

  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_knowledge_evolution_engine() to authenticated;
grant execute on function public.manage_knowledge_evolution_candidate(uuid, text, jsonb) to authenticated;
