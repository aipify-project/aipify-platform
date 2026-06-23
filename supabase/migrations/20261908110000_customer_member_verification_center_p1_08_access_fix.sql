-- P1.08 access fix — use organization membership context; allow org operators for read-only metadata.

create or replace function public._cmvc08_assert_read_access(p_org_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_license text := 'active';
  v_user_id uuid := public._mta_app_user_id();
  v_user_role text;
begin
  if v_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'permission_denied');
  end if;

  select u.role into v_user_role from public.users u where u.id = v_user_id limit 1;

  if not (
    public._irp_has_permission('unonight_verification_read', p_org_id)
    or public._irp_has_permission('customer_community.view', p_org_id)
    or coalesce(v_user_role, '') in ('owner', 'admin', 'support')
    or exists (
      select 1
      from public.organization_users ou
      where ou.organization_id = p_org_id
        and ou.user_id = v_user_id
        and ou.status = 'active'
        and ou.role in (
          'organization_owner', 'organization_admin', 'owner', 'admin', 'support'
        )
    )
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

create or replace function public.get_customer_member_verification_center(
  p_section text default 'queue',
  p_case_id text default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
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
  v_org_id := public._presence_tenant_for_auth();
  v_user_id := public._mta_app_user_id();
  if v_org_id is null or v_user_id is null then
    return jsonb_build_object('found', false, 'error', 'access_denied');
  end if;

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

    insert into public.customer_member_verification_audit (
      organization_id, actor_user_id, action, section, case_key, source_reference
    ) values (
      v_org_id, v_user_id, 'read', 'case', trim(p_case_id), 'get_customer_member_verification_center'
    );

    if not found then
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

NOTIFY pgrst, 'reload schema';
