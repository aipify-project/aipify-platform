-- Phase 280 (APP) — Compliance & Policy Management Center

create table if not exists public.app_portal_compliance_policies (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in (
    'information_security', 'privacy_data_protection', 'employee_policies', 'acceptable_use',
    'incident_response', 'vendor_management', 'financial_controls', 'business_continuity',
    'operational_procedures', 'custom'
  )),
  owner_id uuid references public.users (id) on delete set null,
  contributor_ids jsonb not null default '[]'::jsonb,
  audience_user_ids jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in (
    'draft', 'active', 'under_review', 'retired'
  )),
  version_number integer not null default 1,
  effective_date date,
  review_date date,
  review_frequency text check (review_frequency is null or review_frequency in (
    'monthly', 'quarterly', 'semi_annual', 'annual'
  )),
  audience text not null default 'all_organization_members' check (audience in (
    'all_organization_members', 'managers', 'owners_admins', 'custom'
  )),
  related_playbook_ids jsonb not null default '[]'::jsonb,
  related_knowledge_content jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_portal_compliance_policies_company_idx
  on public.app_portal_compliance_policies (company_id, category, status, updated_at desc);

create table if not exists public.app_portal_compliance_policy_versions (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.app_portal_compliance_policies (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  version_number integer not null,
  change_summary text not null default '',
  snapshot jsonb not null default '{}'::jsonb,
  updated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_compliance_policy_versions_idx
  on public.app_portal_compliance_policy_versions (policy_id, version_number desc);

create table if not exists public.app_portal_compliance_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.app_portal_compliance_policies (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  acknowledged_at timestamptz not null default now(),
  unique (policy_id, user_id)
);

create index if not exists app_portal_compliance_ack_policy_idx
  on public.app_portal_compliance_acknowledgements (policy_id, acknowledged_at desc);

create table if not exists public.app_portal_compliance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.app_portal_compliance_policies (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_compliance_audit_idx
  on public.app_portal_compliance_audit_logs (policy_id, created_at desc);

alter table public.app_portal_compliance_policies enable row level security;
alter table public.app_portal_compliance_policy_versions enable row level security;
alter table public.app_portal_compliance_acknowledgements enable row level security;
alter table public.app_portal_compliance_audit_logs enable row level security;
revoke all on public.app_portal_compliance_policies from authenticated, anon;
revoke all on public.app_portal_compliance_policy_versions from authenticated, anon;
revoke all on public.app_portal_compliance_acknowledgements from authenticated, anon;
revoke all on public.app_portal_compliance_audit_logs from authenticated, anon;

create or replace function public._apcomp280_access_context()
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
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager')
  );
end;
$$;

create or replace function public._apcomp280_user_name(p_user_id uuid)
returns text
language sql
stable
as $$
  select coalesce((select u.full_name from public.users u where u.id = p_user_id), 'Unassigned');
$$;

create or replace function public._apcomp280_can_view(
  p public.app_portal_compliance_policies,
  p_ctx jsonb
)
returns boolean
language plpgsql
stable
as $$
declare v_uid uuid;
        v_role text;
begin
  if (p_ctx->>'company_id')::uuid <> p.company_id then return false; end if;
  if coalesce(p_ctx->>'can_manage', 'false') = 'true' then return true; end if;
  v_uid := (p_ctx->>'user_id')::uuid;
  v_role := p_ctx->>'organization_role';
  if p.owner_id = v_uid then return true; end if;
  if coalesce(p.contributor_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text) then return true; end if;
  if coalesce(p.audience_user_ids, '[]'::jsonb) @> jsonb_build_array(v_uid::text) then return true; end if;
  if p.audience = 'all_organization_members' and p.status in ('active', 'under_review') then return true; end if;
  if p.audience = 'managers' and v_role in ('organization_owner', 'organization_admin', 'organization_manager') then return true; end if;
  if p.audience = 'owners_admins' and v_role in ('organization_owner', 'organization_admin') then return true; end if;
  return false;
end;
$$;

create or replace function public._apcomp280_needs_review(p public.app_portal_compliance_policies)
returns boolean
language sql
stable
as $$
  select p.status in ('active', 'under_review')
    and (
      p.review_date is not null and p.review_date <= current_date
      or p.review_date is null and p.effective_date is not null and p.effective_date < current_date - interval '365 days'
    );
$$;

create or replace function public._apcomp280_ack_stats(p_policy_id uuid, p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_total integer := 0;
  v_ack integer := 0;
  v_outstanding integer := 0;
begin
  select count(*)::int into v_ack
  from public.app_portal_compliance_acknowledgements a
  where a.policy_id = p_policy_id;

  select count(*)::int into v_total
  from public.users u
  where u.company_id = p_company_id;

  v_outstanding := greatest(v_total - v_ack, 0);
  return jsonb_build_object(
    'acknowledged_count', v_ack,
    'outstanding_count', v_outstanding,
    'completion_rate', case when v_total > 0 then round((v_ack::numeric / v_total) * 100) else 0 end
  );
end;
$$;

create or replace function public._apcomp280_row(p public.app_portal_compliance_policies)
returns jsonb
language plpgsql
stable
as $$
begin
  return jsonb_build_object(
    'id', p.id,
    'title', p.title,
    'description', left(p.description, 500),
    'category', p.category,
    'owner_id', p.owner_id,
    'owner_name', public._apcomp280_user_name(p.owner_id),
    'contributor_ids', p.contributor_ids,
    'audience_user_ids', p.audience_user_ids,
    'status', p.status,
    'version_number', p.version_number,
    'effective_date', p.effective_date,
    'review_date', p.review_date,
    'review_frequency', p.review_frequency,
    'audience', p.audience,
    'related_playbook_ids', p.related_playbook_ids,
    'related_knowledge_content', p.related_knowledge_content,
    'notes', left(p.notes, 300),
    'needs_review', public._apcomp280_needs_review(p),
    'acknowledgement', public._apcomp280_ack_stats(p.id, p.company_id),
    'created_at', p.created_at,
    'updated_at', p.updated_at
  );
end;
$$;

create or replace function public._apcomp280_build_recommendations(p_items jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  v_recs jsonb := '[]'::jsonb;
  v_item jsonb;
begin
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    if coalesce((v_item->>'needs_review')::boolean, false) then
      v_recs := v_recs || jsonb_build_object('id', 'review-' || (v_item->>'id'), 'key', 'reviewOverdue', 'policy_id', v_item->>'id', 'priority', 'high');
    elsif (v_item->>'owner_id') is null and (v_item->>'status') <> 'retired' then
      v_recs := v_recs || jsonb_build_object('id', 'owner-' || (v_item->>'id'), 'key', 'assignOwner', 'policy_id', v_item->>'id', 'priority', 'high');
    elsif coalesce((v_item->'acknowledgement'->>'outstanding_count')::integer, 0) > 0 and (v_item->>'status') = 'active' then
      v_recs := v_recs || jsonb_build_object('id', 'ack-' || (v_item->>'id'), 'key', 'requestAcknowledgements', 'policy_id', v_item->>'id', 'priority', 'medium');
    end if;
  end loop;
  v_recs := v_recs || jsonb_build_object('id', 'update-outdated', 'key', 'updateOutdated', 'priority', 'medium');
  v_recs := v_recs || jsonb_build_object('id', 'archive-retired', 'key', 'archiveRetired', 'priority', 'low');
  return v_recs;
end;
$$;

create or replace function public._apcomp280_readiness(p_company_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_active integer := 0;
  v_owned integer := 0;
  v_current_review integer := 0;
  v_score integer := 0;
begin
  select count(*)::int into v_active from public.app_portal_compliance_policies where company_id = p_company_id and status = 'active';
  select count(*)::int into v_owned from public.app_portal_compliance_policies where company_id = p_company_id and status = 'active' and owner_id is not null;
  select count(*)::int into v_current_review
  from public.app_portal_compliance_policies p
  where p.company_id = p_company_id and p.status = 'active' and not public._apcomp280_needs_review(p);

  if v_active = 0 then
    return jsonb_build_object('score', 0, 'label', 'building');
  end if;

  v_score := round(((v_owned::numeric / v_active) * 40) + ((v_current_review::numeric / v_active) * 60));
  return jsonb_build_object(
    'score', v_score,
    'label', case when v_score >= 80 then 'strong' when v_score >= 50 then 'moderate' else 'needs_attention' end
  );
end;
$$;

create or replace function public.list_app_portal_compliance_policies(
  p_category text default null,
  p_owner_id uuid default null,
  p_status text default null,
  p_review_before date default null,
  p_audience text default null,
  p_recently_updated boolean default null,
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
  v_active integer := 0;
  v_needs_review integer := 0;
  v_outstanding integer := 0;
  v_no_owner integer := 0;
  v_recent jsonb := '[]'::jsonb;
begin
  v_ctx := public._apcomp280_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;

  select coalesce(jsonb_agg(public._apcomp280_row(p) order by p.updated_at desc), '[]'::jsonb)
  into v_items
  from public.app_portal_compliance_policies p
  where p.company_id = v_company_id
    and public._apcomp280_can_view(p, v_ctx)
    and (p_category is null or p.category = p_category)
    and (p_owner_id is null or p.owner_id = p_owner_id)
    and (p_status is null or p.status = p_status)
    and (p_review_before is null or p.review_date <= p_review_before)
    and (p_audience is null or p.audience = p_audience)
    and (p_recently_updated is null or p_recently_updated = false or p.updated_at >= now() - interval '30 days')
    and (
      p_search is null or trim(p_search) = ''
      or p.title ilike '%' || trim(p_search) || '%'
      or p.description ilike '%' || trim(p_search) || '%'
      or p.notes ilike '%' || trim(p_search) || '%'
    );

  select count(*)::int into v_active from public.app_portal_compliance_policies where company_id = v_company_id and status = 'active';
  select count(*)::int into v_needs_review
  from public.app_portal_compliance_policies p where p.company_id = v_company_id and public._apcomp280_needs_review(p);
  select count(*)::int into v_no_owner
  from public.app_portal_compliance_policies where company_id = v_company_id and owner_id is null and status <> 'retired';

  select coalesce(sum((public._apcomp280_ack_stats(p.id, p.company_id)->>'outstanding_count')::integer), 0)::int
  into v_outstanding
  from public.app_portal_compliance_policies p
  where p.company_id = v_company_id and p.status = 'active';

  select coalesce(jsonb_agg(public._apcomp280_row(p) order by p.updated_at desc), '[]'::jsonb)
  into v_recent
  from (select * from public.app_portal_compliance_policies where company_id = v_company_id order by updated_at desc limit 5) p;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'items', v_items,
    'dashboard', jsonb_build_object(
      'active', v_active,
      'needs_review', v_needs_review,
      'outstanding_acknowledgements', v_outstanding,
      'without_owner', v_no_owner,
      'recently_updated', v_recent,
      'readiness', public._apcomp280_readiness(v_company_id)
    ),
    'recommendations', public._apcomp280_build_recommendations(v_items),
    'principle', 'Clear policies support readiness — Aipify does not provide legal advice.'
  );
end;
$$;

create or replace function public.get_app_portal_compliance_policy(p_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_compliance_policies;
  v_contributors jsonb := '[]'::jsonb;
  v_versions jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_acknowledgements jsonb := '[]'::jsonb;
  v_user_ack boolean := false;
  v_uid uuid;
begin
  v_ctx := public._apcomp280_access_context();
  v_uid := (v_ctx->>'user_id')::uuid;
  select * into v_p from public.app_portal_compliance_policies where id = p_id;
  if v_p.id is null then return jsonb_build_object('found', false); end if;
  if not public._apcomp280_can_view(v_p, v_ctx) then
    raise exception 'Policy access denied';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('user_id', u.id, 'name', u.full_name)), '[]'::jsonb)
  into v_contributors
  from public.users u
  where u.id in (
    select t.value::uuid from jsonb_array_elements_text(coalesce(v_p.contributor_ids, '[]'::jsonb)) as t(value)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', v.id, 'version_number', v.version_number, 'change_summary', v.change_summary,
    'updated_by', public._apcomp280_user_name(v.updated_by), 'created_at', v.created_at
  ) order by v.version_number desc), '[]'::jsonb)
  into v_versions
  from public.app_portal_compliance_policy_versions v where v.policy_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'description', l.description,
    'created_at', l.created_at, 'performed_by', public._apcomp280_user_name(l.performed_by)
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.app_portal_compliance_audit_logs l where l.policy_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'user_id', a.user_id, 'user_name', public._apcomp280_user_name(a.user_id), 'acknowledged_at', a.acknowledged_at
  ) order by a.acknowledged_at desc), '[]'::jsonb)
  into v_acknowledgements
  from public.app_portal_compliance_acknowledgements a where a.policy_id = p_id;

  select exists(
    select 1 from public.app_portal_compliance_acknowledgements a
    where a.policy_id = p_id and a.user_id = v_uid
  ) into v_user_ack;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'policy', public._apcomp280_row(v_p) || jsonb_build_object(
      'description_full', v_p.description,
      'notes_full', v_p.notes
    ),
    'contributors', v_contributors,
    'version_history', v_versions,
    'acknowledgements', v_acknowledgements,
    'user_acknowledged', v_user_ack,
    'activity_timeline', v_audit,
    'audit_history', v_audit,
    'recommendations', public._apcomp280_build_recommendations(jsonb_build_array(public._apcomp280_row(v_p)))
  );
end;
$$;

create or replace function public.create_app_portal_compliance_policy(
  p_title text,
  p_description text default '',
  p_category text default 'custom',
  p_owner_id uuid default null,
  p_contributor_ids jsonb default '[]'::jsonb,
  p_status text default 'draft',
  p_effective_date date default null,
  p_review_date date default null,
  p_review_frequency text default null,
  p_audience text default 'all_organization_members',
  p_related_playbook_ids jsonb default '[]'::jsonb,
  p_related_knowledge_content jsonb default '[]'::jsonb,
  p_notes text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_p public.app_portal_compliance_policies;
  v_snapshot jsonb;
begin
  v_ctx := public._apcomp280_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Policy creation requires compliance manager access';
  end if;
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  insert into public.app_portal_compliance_policies (
    company_id, title, description, category, owner_id, contributor_ids, status,
    effective_date, review_date, review_frequency, audience,
    related_playbook_ids, related_knowledge_content, notes, created_by
  ) values (
    v_company_id,
    left(trim(p_title), 200),
    left(coalesce(p_description, ''), 5000),
    coalesce(nullif(trim(p_category), ''), 'custom'),
    p_owner_id,
    coalesce(p_contributor_ids, '[]'::jsonb),
    coalesce(nullif(trim(p_status), ''), 'draft'),
    p_effective_date,
    p_review_date,
    nullif(trim(p_review_frequency), ''),
    coalesce(nullif(trim(p_audience), ''), 'all_organization_members'),
    coalesce(p_related_playbook_ids, '[]'::jsonb),
    coalesce(p_related_knowledge_content, '[]'::jsonb),
    left(coalesce(p_notes, ''), 2000),
    v_user_id
  ) returning id into v_id;

  insert into public.app_portal_compliance_audit_logs (policy_id, company_id, event_type, description, performed_by)
  values (v_id, v_company_id, 'created', 'Policy created', v_user_id);

  select * into v_p from public.app_portal_compliance_policies where id = v_id;
  v_snapshot := jsonb_build_object('policy', public._apcomp280_row(v_p));
  insert into public.app_portal_compliance_policy_versions (policy_id, company_id, version_number, change_summary, snapshot, updated_by)
  values (v_id, v_company_id, 1, 'Initial version', v_snapshot, v_user_id);

  return jsonb_build_object('created', true, 'policy', public._apcomp280_row(v_p));
end;
$$;

create or replace function public.update_app_portal_compliance_policy(
  p_id uuid,
  p_title text default null,
  p_description text default null,
  p_category text default null,
  p_owner_id uuid default null,
  p_contributor_ids jsonb default null,
  p_status text default null,
  p_effective_date date default null,
  p_review_date date default null,
  p_review_frequency text default null,
  p_audience text default null,
  p_related_playbook_ids jsonb default null,
  p_related_knowledge_content jsonb default null,
  p_notes text default null,
  p_change_summary text default null,
  p_clear_owner boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_compliance_policies;
  v_user_id uuid;
  v_changed boolean := false;
  v_snapshot jsonb;
begin
  v_ctx := public._apcomp280_access_context();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Policy update requires compliance manager access';
  end if;
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_p from public.app_portal_compliance_policies where id = p_id;
  if v_p.id is null then raise exception 'Policy not found'; end if;
  if v_p.company_id <> (v_ctx->>'company_id')::uuid then raise exception 'Access denied'; end if;

  v_changed := p_title is not null or p_description is not null or p_status is not null;

  update public.app_portal_compliance_policies set
    title = coalesce(nullif(trim(p_title), ''), title),
    description = case when p_description is not null then left(p_description, 5000) else description end,
    category = coalesce(nullif(trim(p_category), ''), category),
    owner_id = case when p_clear_owner then null when p_owner_id is not null then p_owner_id else owner_id end,
    contributor_ids = coalesce(p_contributor_ids, contributor_ids),
    status = coalesce(nullif(trim(p_status), ''), status),
    effective_date = coalesce(p_effective_date, effective_date),
    review_date = coalesce(p_review_date, review_date),
    review_frequency = case when p_review_frequency is not null then nullif(trim(p_review_frequency), '') else review_frequency end,
    audience = coalesce(nullif(trim(p_audience), ''), audience),
    related_playbook_ids = coalesce(p_related_playbook_ids, related_playbook_ids),
    related_knowledge_content = coalesce(p_related_knowledge_content, related_knowledge_content),
    notes = case when p_notes is not null then left(p_notes, 2000) else notes end,
    version_number = case when v_changed then version_number + 1 else version_number end,
    updated_at = now()
  where id = p_id;

  if v_changed then
    select * into v_p from public.app_portal_compliance_policies where id = p_id;
    v_snapshot := jsonb_build_object('policy', public._apcomp280_row(v_p));
    insert into public.app_portal_compliance_policy_versions (policy_id, company_id, version_number, change_summary, snapshot, updated_by)
    values (p_id, v_p.company_id, v_p.version_number, coalesce(nullif(trim(p_change_summary), ''), 'Policy updated'), v_snapshot, v_user_id);
  end if;

  insert into public.app_portal_compliance_audit_logs (policy_id, company_id, event_type, description, performed_by)
  values (p_id, v_p.company_id, 'updated', coalesce(nullif(trim(p_change_summary), ''), 'Policy updated'), v_user_id);

  select * into v_p from public.app_portal_compliance_policies where id = p_id;
  return jsonb_build_object('updated', true, 'policy', public._apcomp280_row(v_p));
end;
$$;

create or replace function public.acknowledge_app_portal_compliance_policy(p_policy_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_p public.app_portal_compliance_policies;
  v_user_id uuid;
begin
  v_ctx := public._apcomp280_access_context();
  v_user_id := (v_ctx->>'user_id')::uuid;
  select * into v_p from public.app_portal_compliance_policies where id = p_policy_id;
  if v_p.id is null then raise exception 'Policy not found'; end if;
  if not public._apcomp280_can_view(v_p, v_ctx) then
    raise exception 'Policy access denied';
  end if;
  if v_p.status not in ('active', 'under_review') then
    raise exception 'Policy is not available for acknowledgement';
  end if;

  insert into public.app_portal_compliance_acknowledgements (policy_id, company_id, user_id)
  values (p_policy_id, v_p.company_id, v_user_id)
  on conflict (policy_id, user_id) do update set acknowledged_at = now();

  insert into public.app_portal_compliance_audit_logs (policy_id, company_id, event_type, description, performed_by)
  values (p_policy_id, v_p.company_id, 'acknowledged', 'Policy acknowledged', v_user_id);

  return jsonb_build_object(
    'acknowledged', true,
    'policy', public._apcomp280_row((select r from public.app_portal_compliance_policies r where r.id = p_policy_id))
  );
end;
$$;

grant execute on function public.list_app_portal_compliance_policies(text, uuid, text, date, text, boolean, text) to authenticated;
grant execute on function public.get_app_portal_compliance_policy(uuid) to authenticated;
grant execute on function public.create_app_portal_compliance_policy(text, text, text, uuid, jsonb, text, date, date, text, text, jsonb, jsonb, text) to authenticated;
grant execute on function public.update_app_portal_compliance_policy(uuid, text, text, text, uuid, jsonb, text, date, date, text, text, jsonb, jsonb, text, text, boolean) to authenticated;
grant execute on function public.acknowledge_app_portal_compliance_policy(uuid) to authenticated;
