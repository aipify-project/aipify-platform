-- CMD09 member directory: expose provider metadata for generic Core classification.
create or replace function public.get_customer_member_directory_center(
  p_search_term text default null,
  p_search_field text default 'name'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_access jsonb;
  v_total_count int := 0;
  v_members jsonb := '[]'::jsonb;
  v_match_count int := 0;
  v_term text := nullif(trim(p_search_term), '');
  v_field text := lower(coalesce(nullif(trim(p_search_field), ''), 'name'));
  v_completeness text := 'empty';
  v_generated_at timestamptz := now();
begin
  v_org_id := public._presence_tenant_for_auth();
  v_user_id := public._mta_app_user_id();
  if v_org_id is null or v_user_id is null then
    return jsonb_build_object('found', false, 'error', 'access_denied');
  end if;

  v_access := public._cmd09_assert_read_access(v_org_id);
  if coalesce(v_access->>'ok', 'false') <> 'true' then
    return jsonb_build_object(
      'found', false,
      'error', coalesce(v_access->>'error', 'access_denied'),
      'organization_id', v_org_id
    );
  end if;

  perform public._cmd09_seed_members(v_org_id);

  select count(*)::int
  into v_total_count
  from public.customer_community_members m
  where m.organization_id = v_org_id
    and m.is_system_user = false
    and m.is_admin_user = false
    and m.is_test = false
    and m.is_demo = false;

  v_completeness := case when v_total_count > 0 then 'complete' else 'empty' end;

  if v_term is not null then
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'member_id', m.member_key,
        'username', m.username,
        'display_name', m.display_name,
        'membership_status', m.membership_status,
        'membership_level', m.membership_level,
        'verification_status', m.verification_status,
        'profile_reference', m.profile_reference,
        'email_masked', m.email_masked,
        'phone_masked', m.phone_masked
      ) order by m.display_name asc
    ), '[]'::jsonb)
    into v_members
    from public.customer_community_members m
    where m.organization_id = v_org_id
      and m.is_system_user = false
      and m.is_admin_user = false
      and m.is_test = false
      and m.is_demo = false
      and (
        (v_field = 'name' and lower(m.display_name) like '%' || lower(v_term) || '%')
        or (v_field = 'username' and lower(m.username) like '%' || lower(v_term) || '%')
        or (v_field in ('external_id', 'member_id') and lower(m.member_key) = lower(v_term))
      );

    v_match_count := coalesce(jsonb_array_length(v_members), 0);
  end if;

  insert into public.customer_community_member_directory_audit (
    organization_id, actor_user_id, action, search_field, search_term, match_count, source_reference
  ) values (
    v_org_id, v_user_id, 'read', v_field, v_term, v_match_count, 'get_customer_member_directory_center'
  );

  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'source_reference', 'get_customer_member_directory_center',
    'completeness', v_completeness,
    'total_member_count', v_total_count,
    'members', coalesce(v_members, '[]'::jsonb),
    'data_classification', 'seed',
    'source_verified', false,
    'search', jsonb_build_object(
      'field', v_field,
      'term', v_term,
      'match_count', v_match_count
    ),
    'generated_at', v_generated_at,
    'privacy_note', 'Masked community member directory metadata — no raw email or phone values.'
  );
end;
$$;
