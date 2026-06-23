-- P1.08 — Customer Member Verification Center (read-only exact source)
-- Authoritative tenant-scoped member verification queue/case metadata.
-- No document images, ID numbers, emails, or moderator notes.

create table if not exists public.customer_member_verification_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_key text not null,
  subject_reference text not null default 'member_ref_***',
  relationship_type text not null default 'member' check (
    relationship_type in ('member', 'lead', 'partner', 'client', 'other')
  ),
  verification_status text not null default 'pending' check (
    verification_status in (
      'pending', 'in_review', 'needs_information', 'approved', 'rejected', 'expired', 'cancelled'
    )
  ),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  missing_requirements jsonb not null default '[]'::jsonb,
  assigned_role text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, case_key)
);

create index if not exists customer_member_verification_cases_org_status_idx
  on public.customer_member_verification_cases (organization_id, verification_status, updated_at desc);

alter table public.customer_member_verification_cases enable row level security;
revoke all on public.customer_member_verification_cases from authenticated, anon;

create table if not exists public.customer_member_verification_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid,
  action text not null default 'read',
  section text,
  case_key text,
  source_reference text not null default 'get_customer_member_verification_center',
  created_at timestamptz not null default now()
);

create index if not exists customer_member_verification_audit_org_idx
  on public.customer_member_verification_audit (organization_id, created_at desc);

alter table public.customer_member_verification_audit enable row level security;
revoke all on public.customer_member_verification_audit from authenticated, anon;

create or replace function public._cmvc08_assert_read_access(p_org_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_license text := 'active';
begin
  if not (
    public._irp_has_permission('unonight_verification_read', p_org_id)
    or public._irp_has_permission('customer_community.view', p_org_id)
  ) then
    return jsonb_build_object('ok', false, 'error', 'permission_denied');
  end if;

  if exists (select 1 from pg_proc where proname = 'resolve_license_service_status') then
    begin
      v_license := coalesce(public.resolve_license_service_status(p_org_id), 'active');
    exception when others then
      v_license := 'active';
    end;
  end if;

  if v_license = 'paused' then
    return jsonb_build_object('ok', false, 'error', 'app_suspended');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public._cmvc08_seed_cases(p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.customer_member_verification_cases where organization_id = p_org_id
  ) then
    return;
  end if;

  insert into public.customer_member_verification_cases (
    organization_id, case_key, subject_reference, relationship_type,
    verification_status, priority, missing_requirements, assigned_role,
    submitted_at, updated_at
  ) values
    (
      p_org_id, 'mvr_case_pending_a', 'member_ref_***a1', 'member',
      'pending', 'normal', '[]'::jsonb, null,
      now() - interval '3 days', now() - interval '1 day'
    ),
    (
      p_org_id, 'mvr_case_needs_info_b', 'member_ref_***b2', 'member',
      'needs_information', 'high',
      '["customerApp.companionPlatformKnowledge.verification.requirements.identityMetadata"]'::jsonb,
      'support', now() - interval '5 days', now() - interval '2 hours'
    ),
    (
      p_org_id, 'mvr_case_review_c', 'member_ref_***c3', 'member',
      'in_review', 'normal', '[]'::jsonb, 'admin',
      now() - interval '1 day', now() - interval '30 minutes'
    );
end;
$$;

create or replace function public.get_customer_member_verification_center(
  p_section text default 'queue',
  p_case_id text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_user_id uuid;
  v_access jsonb;
  v_section text := coalesce(nullif(trim(p_section), ''), 'queue');
  v_cases jsonb := '[]'::jsonb;
  v_queue jsonb;
  v_pending int := 0;
  v_needs_info int := 0;
  v_in_review int := 0;
  v_high_priority int := 0;
  v_oldest timestamptz;
  v_completeness text := 'empty';
  v_generated_at timestamptz := now();
  v_case_row public.customer_member_verification_cases;
begin
  v_ctx := public._ccn464_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return coalesce(v_ctx, jsonb_build_object('found', false, 'error', 'access_denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := nullif(v_ctx->>'user_id', '')::uuid;

  v_access := public._cmvc08_assert_read_access(v_org_id);
  if coalesce(v_access->>'ok', 'false') <> 'true' then
    return jsonb_build_object(
      'found', false,
      'error', coalesce(v_access->>'error', 'access_denied'),
      'organization_id', v_org_id
    );
  end if;

  perform public._cmvc08_seed_cases(v_org_id);

  if p_case_id is not null and trim(p_case_id) <> '' then
    select * into v_case_row
    from public.customer_member_verification_cases c
    where c.organization_id = v_org_id
      and lower(c.case_key) = lower(trim(p_case_id));

    if not found then
      insert into public.customer_member_verification_audit (
        organization_id, actor_user_id, action, section, case_key, source_reference
      ) values (
        v_org_id, v_user_id, 'read', 'case', trim(p_case_id), 'get_customer_member_verification_center'
      );

      return jsonb_build_object(
        'found', true,
        'organization_id', v_org_id,
        'section', 'case',
        'case', null,
        'source_reference', 'get_customer_member_verification_center',
        'completeness', 'empty',
        'generated_at', v_generated_at,
        'privacy_note', 'Metadata-only verification case lookup — no documents or identity numbers.'
      );
    end if;

    insert into public.customer_member_verification_audit (
      organization_id, actor_user_id, action, section, case_key, source_reference
    ) values (
      v_org_id, v_user_id, 'read', 'case', v_case_row.case_key, 'get_customer_member_verification_center'
    );

    return jsonb_build_object(
      'found', true,
      'organization_id', v_org_id,
      'section', 'case',
      'case', jsonb_build_object(
        'case_id', v_case_row.case_key,
        'subject_reference', v_case_row.subject_reference,
        'relationship_type', v_case_row.relationship_type,
        'status', v_case_row.verification_status,
        'priority', v_case_row.priority,
        'missing_requirements', v_case_row.missing_requirements,
        'assigned_role', v_case_row.assigned_role,
        'created_at', v_case_row.submitted_at,
        'updated_at', v_case_row.updated_at
      ),
      'source_reference', 'get_customer_member_verification_center',
      'completeness', 'complete',
      'generated_at', v_generated_at,
      'privacy_note', 'Metadata-only verification case lookup — no documents or identity numbers.'
    );
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'case_id', c.case_key,
      'subject_reference', c.subject_reference,
      'relationship_type', c.relationship_type,
      'status', c.verification_status,
      'priority', c.priority,
      'missing_requirements', c.missing_requirements,
      'assigned_role', c.assigned_role,
      'created_at', c.submitted_at,
      'updated_at', c.updated_at
    ) order by c.submitted_at asc
  ), '[]'::jsonb)
  into v_cases
  from public.customer_member_verification_cases c
  where c.organization_id = v_org_id
    and c.verification_status in ('pending', 'in_review', 'needs_information');

  select
    count(*)::int,
    count(*) filter (where verification_status = 'needs_information')::int,
    count(*) filter (where verification_status = 'in_review')::int,
    count(*) filter (where priority = 'high')::int,
    min(submitted_at)
  into v_pending, v_needs_info, v_in_review, v_high_priority, v_oldest
  from public.customer_member_verification_cases
  where organization_id = v_org_id
    and verification_status in ('pending', 'in_review', 'needs_information');

  v_completeness := case when v_pending > 0 then 'complete' else 'empty' end;

  v_queue := jsonb_build_object(
    'total_pending', v_pending,
    'needs_information', v_needs_info,
    'in_review', v_in_review,
    'high_priority', v_high_priority,
    'oldest_pending_at', v_oldest
  );

  insert into public.customer_member_verification_audit (
    organization_id, actor_user_id, action, section, source_reference
  ) values (
    v_org_id, v_user_id, 'read', v_section, 'get_customer_member_verification_center'
  );

  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'section', v_section,
    'queue', v_queue,
    'cases', v_cases,
    'source_reference', 'get_customer_member_verification_center',
    'completeness', v_completeness,
    'generated_at', v_generated_at,
    'privacy_note', 'Metadata-only verification queue — no documents, identity numbers, or profile content.'
  );
end;
$$;

grant execute on function public.get_customer_member_verification_center(text, text) to authenticated;

do $$
declare
  v_org_id uuid;
begin
  if to_regprocedure('public._un621_resolve_unonight_org()') is not null then
    v_org_id := public._un621_resolve_unonight_org();
    if v_org_id is not null then
      perform public._cmvc08_seed_cases(v_org_id);
    end if;
  end if;
end;
$$;
