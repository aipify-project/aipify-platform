-- Phase A.29 — Compliance & Regulatory Readiness Engine

create table if not exists public.compliance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category text not null check (category in ('data_protection', 'audit_readiness', 'access_review', 'retention', 'approval_documentation', 'incident_documentation')),
  title text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed', 'overdue', 'archived')),
  owner_user_id uuid references public.users (id) on delete set null,
  due_date date,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.compliance_records enable row level security;
revoke all on public.compliance_records from authenticated, anon;

create table if not exists public.compliance_retention_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  data_category text not null check (data_category in ('audit_logs', 'support_cases', 'notifications', 'knowledge_revisions', 'approval_requests')),
  retention_days int not null default 365,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, data_category)
);

alter table public.compliance_retention_policies enable row level security;
revoke all on public.compliance_retention_policies from authenticated, anon;

create table if not exists public.compliance_review_schedules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_type text not null check (review_type in ('quarterly', 'annual', 'custom', 'access_review')),
  next_review_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'overdue')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.compliance_review_schedules enable row level security;
revoke all on public.compliance_review_schedules from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'compliance_regulatory', v.description
from (values
  ('compliance.view', 'View Compliance', 'View compliance status and records'),
  ('compliance.manage', 'Manage Compliance', 'Manage compliance records and policies'),
  ('compliance.export', 'Export Compliance', 'Export compliance reports'),
  ('compliance.review', 'Review Compliance', 'Complete compliance reviews')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

create or replace function public._crr_log(
  p_organization_id uuid, p_action_type text, p_entity_type text default 'compliance',
  p_entity_id uuid default null, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata);
end; $$;

create or replace function public._crr_seed_org(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.compliance_retention_policies (organization_id, data_category, retention_days)
  select p_organization_id, v.cat, v.days
  from (values ('audit_logs', 730), ('support_cases', 365), ('notifications', 90), ('knowledge_revisions', 365), ('approval_requests', 365)) as v(cat, days)
  on conflict (organization_id, data_category) do nothing;

  insert into public.compliance_records (organization_id, category, title, description, status, due_date)
  select p_organization_id, v.cat, v.title, v.item_description, v.status, v.due
  from (values
    ('data_protection', 'Data protection review', 'Review data handling practices', 'open', current_date + 30),
    ('access_review', 'Privileged account review', 'Review administrator access', 'open', current_date + 14),
    ('audit_readiness', 'Audit log completeness check', 'Verify audit coverage', 'in_progress', current_date + 7)
  ) as v(cat, title, item_description, status, due)
  where not exists (select 1 from public.compliance_records where organization_id = p_organization_id limit 1);

  insert into public.compliance_review_schedules (organization_id, review_type, next_review_at)
  select p_organization_id, v.type, v.next_at
  from (values ('quarterly', now() + interval '3 months'), ('annual', now() + interval '1 year'), ('access_review', now() + interval '1 month')) as v(type, next_at)
  where not exists (select 1 from public.compliance_review_schedules where organization_id = p_organization_id limit 1);
end; $$;

create or replace function public.complete_compliance_record(p_record_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.compliance_records;
begin
  perform public._irp_require_permission('compliance.review');
  v_org_id := public._mta_require_organization();
  update public.compliance_records set status = 'completed', completed_at = now(), updated_at = now()
  where id = p_record_id and organization_id = v_org_id returning * into v_row;
  perform public._crr_log(v_org_id, 'compliance_review_completed', 'compliance_record', p_record_id, '{}'::jsonb);
  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_compliance_report(p_report_type text default 'summary')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('compliance.export');
  v_org_id := public._mta_require_organization();
  perform public._crr_log(v_org_id, 'compliance_report_exported', 'compliance', null, jsonb_build_object('report_type', p_report_type));
  return jsonb_build_object('report_type', p_report_type, 'generated_at', now());
end; $$;

create or replace function public.get_compliance_regulatory_readiness_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('compliance.view');
  v_org_id := public._mta_require_organization();
  perform public._crr_seed_org(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Compliance readiness through documentation, retention policies, and scheduled reviews — not legal advice.',
    'principles', jsonb_build_array('Tenant-aware compliance', 'Documentation readiness', 'Configurable retention', 'Access review program', 'Audit-supported accountability'),
    'summary', jsonb_build_object(
      'open_records', coalesce((select count(*) from public.compliance_records where organization_id = v_org_id and status in ('open', 'in_progress')), 0),
      'overdue_records', coalesce((select count(*) from public.compliance_records where organization_id = v_org_id and status = 'overdue'), 0),
      'completed_records', coalesce((select count(*) from public.compliance_records where organization_id = v_org_id and status = 'completed'), 0),
      'upcoming_reviews', coalesce((select count(*) from public.compliance_review_schedules where organization_id = v_org_id and status = 'scheduled'), 0)
    ),
    'records', coalesce((select jsonb_agg(row_to_json(r) order by r.due_date nulls last) from public.compliance_records r where r.organization_id = v_org_id), '[]'::jsonb),
    'retention_policies', coalesce((select jsonb_agg(row_to_json(p)) from public.compliance_retention_policies p where p.organization_id = v_org_id), '[]'::jsonb),
    'review_schedules', coalesce((select jsonb_agg(row_to_json(s) order by s.next_review_at) from public.compliance_review_schedules s where s.organization_id = v_org_id), '[]'::jsonb)
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_compliance_regulatory_readiness_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'open_records', coalesce((select count(*) from public.compliance_records where organization_id = v_org_id and status in ('open', 'in_progress', 'overdue')), 0),
    'philosophy', 'Governance and regulatory readiness for enterprise adoption.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'compliance-regulatory-readiness-engine', 'Compliance & Regulatory Readiness', 'Compliance records, retention, and review scheduling.', 'authenticated', 72
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'compliance-regulatory-readiness-engine' and tenant_id is null);

grant execute on function public.get_compliance_regulatory_readiness_engine_dashboard() to authenticated;
grant execute on function public.get_compliance_regulatory_readiness_engine_card() to authenticated;
grant execute on function public.complete_compliance_record(uuid) to authenticated;
grant execute on function public.generate_compliance_report(text) to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop perform public._crr_seed_org(v_org_id); end loop;
end $$;
