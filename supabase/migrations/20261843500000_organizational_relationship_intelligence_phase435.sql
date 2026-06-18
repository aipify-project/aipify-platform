-- Phase 435 — Organizational Relationship Intelligence (Customer App)
-- Route: /app/intelligence/relationships · Builds on Phase A.78 org relationship tables

create table if not exists public.organizational_relationship_center_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  dependency_mapping_enabled boolean not null default true,
  risk_detection_enabled boolean not null default true,
  executive_dashboard_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.organizational_relationship_entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'customer_relationships', 'employee_relationships', 'vendor_relationships',
    'partner_relationships', 'project_relationships', 'dependency_map'
  )),
  entity_type text not null check (entity_type in (
    'customer', 'employee', 'vendor', 'partner', 'project', 'dependency'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  owner_label text not null default '',
  department text not null default '',
  status_key text not null default 'waiting' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified'
  )),
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  last_contact_at timestamptz,
  open_tasks integer not null default 0,
  open_support_cases integer not null default 0,
  revenue_label text not null default '',
  contract_expires_at date,
  blocked_by text not null default '',
  dependencies jsonb not null default '[]'::jsonb,
  suggested_action text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_relationship_entities_org_idx
  on public.organizational_relationship_entities (organization_id, section_key, status_key, updated_at desc);

create table if not exists public.organizational_relationship_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_type text not null check (risk_type in (
    'single_point_of_failure', 'critical_personnel', 'critical_vendor',
    'knowledge_concentration', 'communication_bottleneck', 'resource_constraint'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'requires_attention',
  owner_label text not null default '',
  suggested_action text not null default '',
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_relationship_risks_org_idx
  on public.organizational_relationship_risks (organization_id, resolved, updated_at desc);

create table if not exists public.organizational_relationship_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_id uuid references public.organizational_relationship_entities (id) on delete set null,
  event_type text not null check (event_type in (
    'meeting', 'email', 'task', 'project', 'approval', 'support_case'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists organizational_relationship_timeline_org_idx
  on public.organizational_relationship_timeline (organization_id, occurred_at desc);

create table if not exists public.organizational_relationship_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_type text not null check (recommendation_type in (
    'contact_customer', 'renew_contract', 'schedule_review', 'add_backup_owner', 'reduce_dependency_risk'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  suggested_action text not null default '',
  status_key text not null default 'waiting',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_relationship_recommendations_org_idx
  on public.organizational_relationship_recommendations (organization_id, status, created_at desc);

create table if not exists public.organizational_relationship_center_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organizational_relationship_center_audit_org_idx
  on public.organizational_relationship_center_audit (organization_id, created_at desc);

alter table public.organizational_relationship_center_settings enable row level security;
alter table public.organizational_relationship_entities enable row level security;
alter table public.organizational_relationship_risks enable row level security;
alter table public.organizational_relationship_timeline enable row level security;
alter table public.organizational_relationship_recommendations enable row level security;
alter table public.organizational_relationship_center_audit enable row level security;
revoke all on public.organizational_relationship_center_settings from authenticated, anon;
revoke all on public.organizational_relationship_entities from authenticated, anon;
revoke all on public.organizational_relationship_risks from authenticated, anon;
revoke all on public.organizational_relationship_timeline from authenticated, anon;
revoke all on public.organizational_relationship_recommendations from authenticated, anon;
revoke all on public.organizational_relationship_center_audit from authenticated, anon;

create or replace function public._ori435_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('relationship_intelligence.manage', v_org_id),
    'can_manage', public._irp_has_permission('relationship_intelligence.manage', v_org_id),
    'can_view', public._irp_has_permission('relationship_intelligence.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._ori435_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_relationship_center_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._ori435_entity_json(r public.organizational_relationship_entities)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'entity_type', r.entity_type,
    'section_key', r.section_key, 'owner', r.owner_label, 'department', r.department,
    'status_key', r.status_key, 'risk_level', r.risk_level,
    'last_contact_at', r.last_contact_at, 'open_tasks', r.open_tasks,
    'open_support_cases', r.open_support_cases, 'revenue_label', r.revenue_label,
    'contract_expires_at', r.contract_expires_at, 'blocked_by', r.blocked_by,
    'dependencies', r.dependencies, 'suggested_action', r.suggested_action,
    'item_type', 'entity'
  );
$$;

create or replace function public._ori435_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_relationship_center_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if not exists (select 1 from public.organization_relationship_profiles where organization_id = p_org_id limit 1) then
    perform public._rie_seed_org_profiles(p_org_id);
  end if;

  if exists (select 1 from public.organizational_relationship_entities where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organizational_relationship_entities (
    organization_id, section_key, entity_type, title, summary, owner_label, department,
    status_key, risk_level, last_contact_at, open_tasks, open_support_cases, revenue_label,
    contract_expires_at, blocked_by, dependencies, suggested_action
  ) values
    (p_org_id, 'customer_relationships', 'customer', 'Unonight AS', 'High-value customer relationship.',
     'Account Manager', 'Sales', 'requires_attention', 'high', now() - interval '92 days', 2, 1, 'NOK 840k ARR',
     null, '', '[]'::jsonb, 'Schedule follow-up.'),
    (p_org_id, 'vendor_relationships', 'vendor', 'CloudHost Nordic', 'Critical infrastructure vendor.',
     'Ops Lead', 'Operations', 'requires_attention', 'critical', now() - interval '14 days', 0, 0, '',
     current_date + 28, '', '["Primary hosting", "Backup storage"]'::jsonb, 'Renew contract before expiry.'),
    (p_org_id, 'partner_relationships', 'partner', 'Growth Partner Bergen', 'Regional growth partner.',
     'Partnerships', 'Growth', 'waiting', 'medium', now() - interval '21 days', 1, 0, '',
     current_date + 120, '', '[]'::jsonb, 'Schedule quarterly review.'),
    (p_org_id, 'employee_relationships', 'employee', 'Engineering Team Alpha', 'Cross-functional delivery team.',
     'Engineering Manager', 'Engineering', 'information', 'low', now() - interval '3 days', 4, 0, '',
     null, '', '["Product", "Support"]'::jsonb, 'Review collaboration map.'),
    (p_org_id, 'project_relationships', 'project', 'Platform Migration Q3', 'Major platform migration initiative.',
     'Program Lead', 'Engineering', 'waiting', 'medium', now() - interval '7 days', 6, 0, '',
     null, 'Legal approval pending', '["Legal review", "Vendor contract"]'::jsonb, 'Follow up on legal approval.'),
    (p_org_id, 'dependency_map', 'dependency', 'Legal approval → Platform Migration', 'Project blocked by pending legal approval.',
     'Program Lead', 'Legal', 'waiting', 'high', now() - interval '5 days', 0, 0, '',
     null, 'Legal approval pending', '["Platform Migration Q3"]'::jsonb, 'Escalate legal review timeline.');

  insert into public.organizational_relationship_risks (
    organization_id, risk_type, title, summary, status_key, owner_label, suggested_action
  ) values
    (p_org_id, 'knowledge_concentration', 'Single owner for billing workflow',
     'Only one employee understands the critical billing reconciliation process.', 'requires_attention',
     'Finance Lead', 'Create documentation and training.'),
    (p_org_id, 'critical_vendor', 'Single vendor for hosting',
     'Critical vendor dependency with contract expiring within 30 days.', 'requires_attention',
     'Ops Lead', 'Add backup owner and evaluate secondary vendor.'),
    (p_org_id, 'communication_bottleneck', 'Support-to-engineering handoff',
     'Communication bottleneck between Support and Engineering on escalations.', 'information',
     'Support Lead', 'Schedule cross-team review.');

  insert into public.organizational_relationship_timeline (
    organization_id, event_type, title, summary, occurred_at
  ) values
    (p_org_id, 'meeting', 'Quarterly business review', 'Customer QBR with Unonight leadership.', now() - interval '95 days'),
    (p_org_id, 'support_case', 'Escalated billing inquiry', 'Support case escalated to Finance.', now() - interval '12 days'),
    (p_org_id, 'approval', 'Vendor contract review', 'Legal review pending for CloudHost renewal.', now() - interval '5 days'),
    (p_org_id, 'task', 'Migration milestone delayed', 'Platform migration waiting on legal approval.', now() - interval '2 days');

  insert into public.organizational_relationship_recommendations (
    organization_id, recommendation_type, title, summary, suggested_action, status_key
  ) values
    (p_org_id, 'contact_customer', 'Contact high-value customer', 'Unonight has not been contacted in 90 days.', 'Schedule follow-up call this week.', 'requires_attention'),
    (p_org_id, 'renew_contract', 'Renew critical vendor contract', 'CloudHost Nordic contract expires in 30 days.', 'Begin renewal review with legal and ops.', 'requires_attention'),
    (p_org_id, 'add_backup_owner', 'Reduce billing knowledge risk', 'Only one employee owns billing reconciliation.', 'Assign backup owner and document process.', 'requires_attention'),
    (p_org_id, 'schedule_review', 'Partner quarterly review', 'Growth Partner Bergen review is due.', 'Schedule partner review meeting.', 'waiting');
end; $$;

create or replace function public.get_organizational_relationship_intelligence()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid;
  v_customers jsonb; v_employees jsonb; v_vendors jsonb; v_partners jsonb; v_projects jsonb; v_dependencies jsonb;
  v_risks jsonb; v_timeline jsonb; v_recommendations jsonb; v_executive jsonb := '{}'::jsonb;
begin
  perform public._irp_require_permission('relationship_intelligence.view');
  v_ctx := public._ori435_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._ori435_seed(v_org_id);

  select coalesce(jsonb_agg(public._ori435_entity_json(e) order by e.last_contact_at nulls first), '[]'::jsonb)
  into v_customers from public.organizational_relationship_entities e
  where e.organization_id = v_org_id and e.section_key = 'customer_relationships';

  select coalesce(jsonb_agg(public._ori435_entity_json(e) order by e.title), '[]'::jsonb)
  into v_employees from public.organizational_relationship_entities e
  where e.organization_id = v_org_id and e.section_key = 'employee_relationships';

  select coalesce(jsonb_agg(public._ori435_entity_json(e) order by e.contract_expires_at nulls first), '[]'::jsonb)
  into v_vendors from public.organizational_relationship_entities e
  where e.organization_id = v_org_id and e.section_key = 'vendor_relationships';

  select coalesce(jsonb_agg(public._ori435_entity_json(e) order by e.title), '[]'::jsonb)
  into v_partners from public.organizational_relationship_entities e
  where e.organization_id = v_org_id and e.section_key = 'partner_relationships';

  select coalesce(jsonb_agg(public._ori435_entity_json(e) order by e.updated_at desc), '[]'::jsonb)
  into v_projects from public.organizational_relationship_entities e
  where e.organization_id = v_org_id and e.section_key = 'project_relationships';

  select coalesce(jsonb_agg(public._ori435_entity_json(e) order by e.title), '[]'::jsonb)
  into v_dependencies from public.organizational_relationship_entities e
  where e.organization_id = v_org_id and e.section_key = 'dependency_map';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'risk_type', r.risk_type,
    'status_key', r.status_key, 'owner', r.owner_label, 'suggested_action', r.suggested_action,
    'item_type', 'risk'
  ) order by r.created_at desc), '[]'::jsonb)
  into v_risks from public.organizational_relationship_risks r
  where r.organization_id = v_org_id and not r.resolved;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'title', t.title, 'summary', t.summary,
    'occurred_at', t.occurred_at, 'item_type', 'timeline'
  ) order by t.occurred_at desc), '[]'::jsonb)
  into v_timeline from public.organizational_relationship_timeline t
  where t.organization_id = v_org_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'recommendation_type', r.recommendation_type,
    'status_key', r.status_key, 'suggested_action', r.suggested_action, 'status', r.status,
    'item_type', 'recommendation'
  ) order by r.created_at desc), '[]'::jsonb)
  into v_recommendations from public.organizational_relationship_recommendations r
  where r.organization_id = v_org_id and r.status = 'open';

  if coalesce(v_ctx->>'can_executive', 'false') = 'true' then
    v_executive := jsonb_build_object(
      'most_important_customers', coalesce((
        select jsonb_agg(jsonb_build_object('title', e.title, 'revenue_label', e.revenue_label, 'risk_level', e.risk_level)
          order by e.revenue_label desc nulls last)
        from public.organizational_relationship_entities e
        where e.organization_id = v_org_id and e.section_key = 'customer_relationships' limit 5
      ), '[]'::jsonb),
      'most_important_vendors', coalesce((
        select jsonb_agg(jsonb_build_object('title', e.title, 'contract_expires_at', e.contract_expires_at, 'risk_level', e.risk_level)
          order by e.contract_expires_at nulls first)
        from public.organizational_relationship_entities e
        where e.organization_id = v_org_id and e.section_key = 'vendor_relationships' limit 5
      ), '[]'::jsonb),
      'most_important_projects', coalesce((
        select jsonb_agg(jsonb_build_object('title', e.title, 'blocked_by', e.blocked_by, 'status_key', e.status_key)
          order by e.updated_at desc)
        from public.organizational_relationship_entities e
        where e.organization_id = v_org_id and e.section_key = 'project_relationships' limit 5
      ), '[]'::jsonb),
      'relationship_risks', jsonb_array_length(v_risks),
      'relationship_opportunities', jsonb_array_length(v_recommendations)
    );
  end if;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Most business problems are relationship problems. Aipify helps you see who depends on whom — humans decide every action.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All relationship insights are auditable, role-controlled, and permission-based.',
    'sections', jsonb_build_object(
      'customer_relationships', v_customers,
      'employee_relationships', v_employees,
      'vendor_relationships', v_vendors,
      'partner_relationships', v_partners,
      'project_relationships', v_projects,
      'dependency_map', v_dependencies
    ),
    'organizational_risks', v_risks,
    'relationship_timeline', v_timeline,
    'companion_recommendations', v_recommendations,
    'executive_dashboard', v_executive,
    'statistics', jsonb_build_object(
      'customer_count', jsonb_array_length(v_customers),
      'employee_count', jsonb_array_length(v_employees),
      'vendor_count', jsonb_array_length(v_vendors),
      'partner_count', jsonb_array_length(v_partners),
      'project_count', jsonb_array_length(v_projects),
      'dependency_count', jsonb_array_length(v_dependencies),
      'risk_count', jsonb_array_length(v_risks),
      'recommendation_count', jsonb_array_length(v_recommendations)
    ),
    'privacy_note', 'Metadata only — Aipify never impersonates users or auto-sends messages on your behalf.'
  );
end; $$;

create or replace function public.manage_organizational_relationship_item(
  p_item_type text,
  p_item_id uuid,
  p_action text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._ori435_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'resolve', 'complete') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'recommendation' then
    update public.organizational_relationship_recommendations set
      status = case p_action
        when 'acknowledge' then 'acknowledged'
        when 'dismiss' then 'dismissed'
        when 'complete' then 'completed'
        else status end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'risk' then
    update public.organizational_relationship_risks set
      resolved = p_action in ('resolve', 'complete', 'dismiss'),
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._ori435_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Relationship intelligence item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_organizational_relationship_intelligence() to authenticated;
grant execute on function public.manage_organizational_relationship_item(text, uuid, text) to authenticated;
