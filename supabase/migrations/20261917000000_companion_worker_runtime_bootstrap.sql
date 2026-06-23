-- POST-P1.09C — Companion queue worker tenant context bootstrap (service-role, explicit scope)
-- Feature owner: CUSTOMER APP (Companion chat queue)

create or replace function public._companion_worker_assert_scope(
  p_tenant_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer public.customers;
  v_user public.users;
  v_membership public.organization_users;
  v_org_role text;
begin
  perform public._companion_assert_service_role();

  if p_tenant_id is null or p_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_scope');
  end if;

  select * into v_customer
  from public.customers c
  where c.id = p_tenant_id
  limit 1;

  if v_customer.id is null then
    return jsonb_build_object('ok', false, 'error', 'tenant_not_found');
  end if;

  select * into v_user
  from public.users u
  where u.id = p_user_id
  limit 1;

  if v_user.id is null or v_user.company_id is distinct from v_customer.company_id then
    return jsonb_build_object('ok', false, 'error', 'tenant_mismatch');
  end if;

  v_membership := public._mta_membership_active(p_tenant_id, p_user_id);
  if v_membership.id is null then
    return jsonb_build_object('ok', false, 'error', 'membership_missing');
  end if;

  v_org_role := coalesce(
    v_membership.role,
    public._apsf260_map_org_role(v_user.role)
  );

  return jsonb_build_object(
    'ok', true,
    'tenant_id', p_tenant_id,
    'user_id', p_user_id,
    'customer_id', p_tenant_id,
    'company_id', v_customer.company_id,
    'organization_id', p_tenant_id,
    'user_role', v_user.role,
    'organization_role', v_org_role
  );
end;
$$;

create or replace function public._companion_worker_irp_has_permission(
  p_permission_key text,
  p_organization_id uuid,
  p_user_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_membership public.organization_users;
  v_override boolean;
begin
  if p_organization_id is null or p_user_id is null then
    return false;
  end if;

  if not public._irp_user_account_ok(p_user_id) then
    return false;
  end if;

  v_membership := public._mta_membership_active(p_organization_id, p_user_id);
  if v_membership.id is null or v_membership.status <> 'active' then
    return false;
  end if;

  select granted into v_override
  from public.organization_user_permissions
  where organization_id = p_organization_id
    and user_id = p_user_id
    and permission_key = p_permission_key;
  if found then
    return v_override;
  end if;

  return exists (
    select 1
    from public.organization_role_permissions rp
    where rp.organization_id = p_organization_id
      and rp.role = v_membership.role
      and rp.permission_key = p_permission_key
  );
end;
$$;

create or replace function public._companion_worker_assert_community_read(
  p_org_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_role text;
  v_license text := 'active';
begin
  if p_org_id is null or p_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'permission_denied');
  end if;

  select u.role into v_user_role from public.users u where u.id = p_user_id limit 1;

  if not (
    public._companion_worker_irp_has_permission('customer_community.view', p_org_id, p_user_id)
    or coalesce(v_user_role, '') in ('owner', 'admin', 'support')
    or exists (
      select 1
      from public.organization_users ou
      where ou.organization_id = p_org_id
        and ou.user_id = p_user_id
        and ou.status = 'active'
        and ou.role in (
          'organization_owner', 'organization_admin', 'owner', 'admin', 'support'
        )
    )
  ) then
    return jsonb_build_object('ok', false, 'error', 'permission_denied');
  end if;

  begin
    v_license := coalesce(public.resolve_license_service_status(p_org_id), 'active');
  exception when others then
    v_license := 'active';
  end;

  if v_license = 'paused' then
    return jsonb_build_object('ok', false, 'error', 'app_suspended');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public._companion_worker_build_organization_context(
  p_tenant_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_scope jsonb;
  v_user public.users;
  v_org public.organizations;
  v_membership public.organization_users;
  v_company_name text;
  v_plan_name text;
  v_license_status text;
  v_app_license_status text;
  v_can_self_support boolean := false;
begin
  v_scope := public._companion_worker_assert_scope(p_tenant_id, p_user_id);
  if coalesce(v_scope->>'ok', 'false') <> 'true' then
    return jsonb_build_object(
      'authenticated', false,
      'state', 'membership_missing',
      'has_customer', false,
      'has_organization_membership', false,
      'has_app_access', false
    );
  end if;

  select * into v_user from public.users where id = p_user_id limit 1;
  select * into v_org from public.organizations where id = p_tenant_id limit 1;
  v_membership := public._mta_membership_active(p_tenant_id, p_user_id);

  select co.name into v_company_name
  from public.companies co
  where co.id = v_user.company_id;

  select coalesce(
    s.plan_name,
    initcap(replace(coalesce(os.plan_key, s.plan_key, s.plan_type, 'business'), '_', ' '))
  )
  into v_plan_name
  from public.customers c
  left join public.subscriptions s on s.customer_id = c.id
  left join public.organization_subscriptions os on os.organization_id = c.id
  where c.id = p_tenant_id
  limit 1;

  select als.app_license_status
  into v_app_license_status
  from public.organization_app_license_state als
  where als.organization_id = p_tenant_id
  limit 1;

  v_license_status := public.resolve_license_service_status(p_tenant_id);

  if v_membership.id is not null then
    select exists (
      select 1
      from public.organization_role_permissions rp
      where rp.organization_id = p_tenant_id
        and rp.role = v_membership.role
        and rp.permission_key = 'self_support.view'
    ) into v_can_self_support;
  end if;

  return jsonb_build_object(
    'authenticated', true,
    'state', 'ready',
    'user_role', v_user.role,
    'organization_role', coalesce(v_membership.role, public._apsf260_map_org_role(v_user.role)),
    'company_id', v_user.company_id,
    'customer_id', p_tenant_id,
    'organization_id', p_tenant_id,
    'workspace_name', coalesce(v_org.name, v_company_name),
    'licensed_to', coalesce(v_org.name, v_company_name),
    'plan_name', v_plan_name,
    'license_status', coalesce(v_app_license_status, v_license_status, 'active'),
    'has_customer', true,
    'has_organization_membership', v_membership.id is not null,
    'has_app_access', true,
    'can_access_self_support', v_can_self_support,
    'context_version', 2
  );
end;
$$;

create or replace function public._companion_worker_build_identity_permissions(
  p_tenant_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_membership public.organization_users;
begin
  v_membership := public._mta_membership_active(p_tenant_id, p_user_id);
  if v_membership.id is null then
    return jsonb_build_object('has_organization', false);
  end if;

  perform public._irp_seed_role_permissions(p_tenant_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Every user, role, permission, and AI action operates within secure boundaries.',
    'safety_note', 'Only low-risk AI actions may execute automatically. Medium and high-risk actions require human approval.',
    'current_role', v_membership.role,
    'user_permissions', coalesce((
      select jsonb_agg(rp.permission_key order by rp.permission_key)
      from public.organization_role_permissions rp
      where rp.organization_id = p_tenant_id and rp.role = v_membership.role
    ), '[]'::jsonb),
    'can_approve_low', public._irp_can_approve_risk('low', p_tenant_id),
    'can_approve_medium', public._irp_can_approve_risk('medium', p_tenant_id),
    'can_approve_high', public._irp_can_approve_risk('high', p_tenant_id)
  );
end;
$$;

create or replace function public._companion_worker_build_license_center(
  p_tenant_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_company_name text;
  v_limits jsonb;
  v_license_status text;
begin
  if coalesce((public._companion_worker_assert_scope(p_tenant_id, p_user_id)->>'ok'), 'false') <> 'true' then
    return jsonb_build_object('has_customer', false);
  end if;

  select co.name into v_company_name
  from public.customers c
  join public.companies co on co.id = c.company_id
  where c.id = p_tenant_id
  limit 1;

  v_license_status := public.resolve_license_service_status(p_tenant_id);
  v_limits := public.get_customer_license_limits(p_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'company_name', v_company_name,
    'license_status', v_license_status,
    'subscription', jsonb_build_object(
      'plan_name', v_limits ->> 'plan_name',
      'plan_type', v_limits ->> 'plan_type',
      'subscription_status', v_limits ->> 'subscription_status',
      'plan_key', coalesce(v_limits ->> 'plan_key', v_limits ->> 'plan_type')
    )
  );
end;
$$;

create or replace function public._companion_worker_build_integrations_hub(
  p_tenant_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_scope jsonb;
  v_company_id uuid;
  v_role text;
  v_providers jsonb := '[]'::jsonb;
  v_connections jsonb := '[]'::jsonb;
begin
  v_scope := public._companion_worker_assert_scope(p_tenant_id, p_user_id);
  if coalesce(v_scope->>'ok', 'false') <> 'true' then
    return jsonb_build_object('connections', '[]'::jsonb, 'providers', '[]'::jsonb);
  end if;

  v_company_id := (v_scope->>'company_id')::uuid;
  v_role := v_scope->>'organization_role';

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'provider_key', p.provider_key,
      'display_name', p.display_name,
      'category', p.category,
      'setup_type', p.setup_type,
      'oauth_available', p.oauth_available,
      'default_permission_level', p.default_permission_level,
      'recommended_scopes', p.recommended_scopes
    ) order by p.sort_order
  ), '[]'::jsonb)
  into v_providers
  from public.app_portal_integration_providers p
  where p.is_available;

  select coalesce(jsonb_agg(
    public._apsf260i_connection_json(c) order by c.updated_at desc
  ), '[]'::jsonb)
  into v_connections
  from public.app_portal_integration_connections c
  where c.company_id = v_company_id
    and c.removed_at is null;

  return jsonb_build_object(
    'can_manage', v_role in ('organization_owner', 'organization_admin', 'organization_manager'),
    'providers', v_providers,
    'connections', v_connections,
    'duplicate_warnings', '[]'::jsonb
  );
end;
$$;

create or replace function public._companion_worker_build_personality_card(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_settings public.personality_settings;
begin
  v_settings := public._per_ensure_settings(p_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'personality_mode', v_settings.personality_mode,
    'humor_enabled', v_settings.humor_enabled,
    'emoji_enabled', v_settings.emoji_enabled,
    'philosophy', 'Competent first. Human second. Funny third.',
    'default_mode', 'warm_professional'
  );
end;
$$;

create or replace function public._companion_worker_build_assistant_identity(
  p_tenant_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_settings public.assistant_identity_settings;
  v_profile public.assistant_identity_profiles;
  v_prefs public.assistant_communication_preferences;
begin
  if coalesce((public._companion_worker_assert_scope(p_tenant_id, p_user_id)->>'ok'), 'false') <> 'true' then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public._aid_ensure_settings(p_tenant_id);
  v_profile := public._aid_ensure_profile(p_tenant_id, p_user_id);

  select * into v_prefs
  from public.assistant_communication_preferences
  where tenant_id = p_tenant_id and user_id = p_user_id;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'require_welcome_flow', v_settings.require_welcome_flow,
    'profile', public._aid_profile_json(v_profile),
    'preferences', case when v_prefs.id is not null then jsonb_build_object(
      'preferred_language', v_prefs.preferred_language,
      'preferred_tone', v_prefs.preferred_tone,
      'use_name_in_greetings', v_prefs.use_name_in_greetings,
      'allow_personalized_phrases', v_prefs.allow_personalized_phrases,
      'allow_encouragement', v_prefs.allow_encouragement,
      'reminder_style', v_prefs.reminder_style,
      'notification_style', v_prefs.notification_style
    ) else null end,
    'display_name', coalesce(v_profile.preferred_address_name, v_profile.assistant_owner_name),
    'privacy_note', 'Personalization is tenant-isolated. You remain in control of all decisions.'
  );
end;
$$;

create or replace function public._companion_worker_build_identity_center(
  p_tenant_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_profile public.identity_profiles;
  v_user_name text;
begin
  if coalesce((public._companion_worker_assert_scope(p_tenant_id, p_user_id)->>'ok'), 'false') <> 'true' then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.full_name into v_user_name from public.users u where u.id = p_user_id limit 1;
  v_profile := public.ensure_identity_profile(p_tenant_id, p_user_id);

  return jsonb_build_object(
    'has_customer', true,
    'user_name', split_part(coalesce(v_user_name, ''), ' ', 1),
    'profile', jsonb_build_object(
      'id', v_profile.id,
      'communication_style', v_profile.communication_style,
      'proactivity_level', v_profile.proactivity_level,
      'tone', v_profile.tone,
      'name_usage', v_profile.name_usage,
      'notification_style', v_profile.notification_style,
      'identity_mode', v_profile.identity_mode,
      'social_interaction_style', v_profile.social_interaction_style,
      'response_length', v_profile.response_length,
      'notification_preferences', v_profile.notification_preferences,
      'boundaries', v_profile.boundaries,
      'onboarding_completed', v_profile.onboarding_completed,
      'created_at', v_profile.created_at,
      'updated_at', v_profile.updated_at
    ),
    'boundary_principles', jsonb_build_array(
      'No repeated contact without purpose',
      'No excessive notifications',
      'No emotional pressure or guilt',
      'No encouragement of dependency',
      'Transparency always — you can change anything'
    ),
    'pending_observations', '[]'::jsonb,
    'interaction_history', '[]'::jsonb
  );
end;
$$;

create or replace function public.companion_worker_get_runtime_bootstrap(
  p_tenant_id uuid,
  p_user_id uuid,
  p_locale text default 'en'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_scope jsonb;
  v_crisis boolean := false;
begin
  perform public._companion_assert_service_role();

  v_scope := public._companion_worker_assert_scope(p_tenant_id, p_user_id);
  if coalesce(v_scope->>'ok', 'false') <> 'true' then
    return jsonb_build_object('ok', false, 'error', coalesce(v_scope->>'error', 'invalid_scope'));
  end if;

  begin
    v_crisis := public._per_is_crisis_context(p_tenant_id);
  exception when others then
    v_crisis := false;
  end;

  return jsonb_build_object(
    'ok', true,
    'scope', v_scope,
    'locale', left(coalesce(nullif(trim(p_locale), ''), 'en'), 8),
    'organization_context', public._companion_worker_build_organization_context(p_tenant_id, p_user_id),
    'identity_permissions', public._companion_worker_build_identity_permissions(p_tenant_id, p_user_id),
    'customer_license_center', public._companion_worker_build_license_center(p_tenant_id, p_user_id),
    'integrations_hub', public._companion_worker_build_integrations_hub(p_tenant_id, p_user_id),
    'identity_center', public._companion_worker_build_identity_center(p_tenant_id, p_user_id),
    'assistant_identity', public._companion_worker_build_assistant_identity(p_tenant_id, p_user_id),
    'personality_card', public._companion_worker_build_personality_card(p_tenant_id),
    'companion_identity_relationship', coalesce(
      public.get_companion_identity_relationship_center(p_tenant_id),
      jsonb_build_object('has_customer', false)
    ),
    'install_discovery_context', jsonb_build_object('found', false, 'discovery_status', 'empty'),
    'install_discovery_center', jsonb_build_object('found', false),
    'support_operations_center', public.companion_worker_get_customer_support_operations_center(p_tenant_id, p_user_id),
    'executive_command_center', jsonb_build_object('found', false, 'has_customer', true),
    'marketplace_summary', jsonb_build_object('found', false),
    'license_subscription_center', jsonb_build_object('found', false),
    'memory_center_preferences', jsonb_build_object('found', false),
    'learning_center', jsonb_build_object('has_customer', false),
    'crisis_mode_active', v_crisis
  );
end;
$$;

create or replace function public.companion_worker_get_customer_member_directory_center(
  p_tenant_id uuid,
  p_user_id uuid,
  p_search_term text default null,
  p_search_field text default 'name'
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_field text := lower(coalesce(nullif(trim(p_search_field), ''), 'name'));
  v_term text := nullif(trim(p_search_term), '');
  v_members jsonb := '[]'::jsonb;
  v_match_count int := 0;
  v_total_count int := 0;
  v_completeness text := 'empty';
begin
  perform public._companion_assert_service_role();

  if coalesce((public._companion_worker_assert_scope(p_tenant_id, p_user_id)->>'ok'), 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', 'access_denied');
  end if;

  v_access := public._companion_worker_assert_community_read(p_tenant_id, p_user_id);
  if coalesce(v_access->>'ok', 'false') <> 'true' then
    return jsonb_build_object(
      'found', false,
      'error', coalesce(v_access->>'error', 'access_denied'),
      'organization_id', p_tenant_id
    );
  end if;

  perform public._cmd09_seed_members(p_tenant_id);

  select count(*)::int into v_total_count
  from public.customer_community_members m
  where m.organization_id = p_tenant_id
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
    where m.organization_id = p_tenant_id
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
    p_tenant_id, p_user_id, 'read', v_field, v_term, v_match_count, 'get_customer_member_directory_center'
  );

  return jsonb_build_object(
    'found', true,
    'organization_id', p_tenant_id,
    'source_reference', 'get_customer_member_directory_center',
    'completeness', v_completeness,
    'total_member_count', v_total_count,
    'members', coalesce(v_members, '[]'::jsonb),
    'search', jsonb_build_object(
      'field', v_field,
      'term', v_term,
      'match_count', v_match_count
    ),
    'generated_at', now(),
    'privacy_note', 'Masked community member directory metadata — no raw email or phone values.'
  );
end;
$$;

create or replace function public._companion_worker_assert_verification_read(
  p_org_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_role text;
  v_license text := 'active';
begin
  if p_org_id is null or p_user_id is null then
    return jsonb_build_object('ok', false, 'error', 'permission_denied');
  end if;

  select u.role into v_user_role from public.users u where u.id = p_user_id limit 1;

  if not (
    public._companion_worker_irp_has_permission('unonight_verification_read', p_org_id, p_user_id)
    or public._companion_worker_irp_has_permission('customer_community.view', p_org_id, p_user_id)
    or coalesce(v_user_role, '') in ('owner', 'admin', 'support')
    or exists (
      select 1
      from public.organization_users ou
      where ou.organization_id = p_org_id
        and ou.user_id = p_user_id
        and ou.status = 'active'
        and ou.role in (
          'organization_owner', 'organization_admin', 'owner', 'admin', 'support'
        )
    )
  ) then
    return jsonb_build_object('ok', false, 'error', 'permission_denied');
  end if;

  begin
    v_license := coalesce(public.resolve_license_service_status(p_org_id), 'active');
  exception when others then
    v_license := 'active';
  end;

  if v_license = 'paused' then
    return jsonb_build_object('ok', false, 'error', 'app_suspended');
  end if;

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.companion_worker_get_customer_member_verification_center(
  p_tenant_id uuid,
  p_user_id uuid,
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
  v_access jsonb;
  v_section text := coalesce(nullif(trim(p_section), ''), 'queue');
  v_cases jsonb := '[]'::jsonb;
  v_pending int := 0;
  v_needs_info int := 0;
  v_in_review int := 0;
  v_high_priority int := 0;
  v_oldest timestamptz;
  v_completeness text := 'empty';
  v_generated_at timestamptz := now();
  v_case_row public.customer_member_verification_cases;
begin
  perform public._companion_assert_service_role();

  if coalesce((public._companion_worker_assert_scope(p_tenant_id, p_user_id)->>'ok'), 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', 'access_denied');
  end if;

  v_access := public._companion_worker_assert_verification_read(p_tenant_id, p_user_id);
  if coalesce(v_access->>'ok', 'false') <> 'true' then
    return jsonb_build_object(
      'found', false,
      'error', coalesce(v_access->>'error', 'access_denied'),
      'organization_id', p_tenant_id
    );
  end if;

  perform public._cmvc08_seed_cases(p_tenant_id);

  if p_case_id is not null and trim(p_case_id) <> '' then
    select * into v_case_row
    from public.customer_member_verification_cases c
    where c.organization_id = p_tenant_id
      and lower(c.case_key) = lower(trim(p_case_id));

    insert into public.customer_member_verification_audit (
      organization_id, actor_user_id, action, section, case_key, source_reference
    ) values (
      p_tenant_id, p_user_id, 'read', 'case', trim(p_case_id), 'get_customer_member_verification_center'
    );

    if not found then
      return jsonb_build_object(
        'found', true,
        'organization_id', p_tenant_id,
        'section', 'case',
        'case', null,
        'source_reference', 'get_customer_member_verification_center',
        'completeness', 'empty',
        'generated_at', v_generated_at
      );
    end if;

    return jsonb_build_object(
      'found', true,
      'organization_id', p_tenant_id,
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
      'generated_at', v_generated_at
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
  where c.organization_id = p_tenant_id
    and c.verification_status in ('pending', 'in_review', 'needs_information');

  select
    count(*)::int,
    count(*) filter (where verification_status = 'needs_information')::int,
    count(*) filter (where verification_status = 'in_review')::int,
    count(*) filter (where priority = 'high')::int,
    min(submitted_at)
  into v_pending, v_needs_info, v_in_review, v_high_priority, v_oldest
  from public.customer_member_verification_cases
  where organization_id = p_tenant_id
    and verification_status in ('pending', 'in_review', 'needs_information');

  v_completeness := case when v_pending > 0 then 'complete' else 'empty' end;

  insert into public.customer_member_verification_audit (
    organization_id, actor_user_id, action, section, source_reference
  ) values (
    p_tenant_id, p_user_id, 'read', v_section, 'get_customer_member_verification_center'
  );

  return jsonb_build_object(
    'found', true,
    'organization_id', p_tenant_id,
    'section', v_section,
    'queue', jsonb_build_object(
      'pending_count', v_pending,
      'needs_information_count', v_needs_info,
      'in_review_count', v_in_review,
      'high_priority_count', v_high_priority,
      'oldest_pending_at', v_oldest,
      'cases', coalesce(v_cases, '[]'::jsonb)
    ),
    'source_reference', 'get_customer_member_verification_center',
    'completeness', v_completeness,
    'generated_at', v_generated_at,
    'privacy_note', 'Metadata-only verification queue — no documents or identity numbers.'
  );
end;
$$;

create or replace function public.companion_worker_get_customer_support_operations_center(
  p_tenant_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_settings public.aso_settings;
  v_readiness jsonb;
  v_open integer;
  v_sla_ready boolean;
  v_sla_at_risk integer := 0;
  v_sla_breached integer := 0;
begin
  perform public._companion_assert_service_role();

  if coalesce((public._companion_worker_assert_scope(p_tenant_id, p_user_id)->>'ok'), 'false') <> 'true' then
    return jsonb_build_object('has_customer', false);
  end if;

  select * into v_settings
  from public.aso_settings
  where tenant_id = p_tenant_id
  limit 1;

  if v_settings.id is null then
    v_settings.tenant_id := p_tenant_id;
    v_settings.autonomy_level := 1;
    v_settings.proactive_support_enabled := true;
    v_settings.knowledge_gap_detection_enabled := true;
    v_settings.self_healing_enabled := true;
    v_settings.human_collaboration_mode := true;
    v_settings.sla_policy_enabled := false;
  end if;

  v_readiness := public.calculate_automation_readiness_score(p_tenant_id);
  v_sla_ready := public._aso_sla_policy_ready(v_settings);

  select count(*) into v_open
  from public.support_cases
  where tenant_id = p_tenant_id and status not in ('resolved', 'closed', 'auto_replied');

  if v_sla_ready then
    select
      count(*) filter (
        where public._aso_compute_case_sla_status(now(), sc, v_settings) in ('warning', 'at_risk')
      ),
      count(*) filter (
        where public._aso_compute_case_sla_status(now(), sc, v_settings) = 'breached'
      )
    into v_sla_at_risk, v_sla_breached
    from public.support_cases sc
    where sc.tenant_id = p_tenant_id
      and sc.status not in ('resolved', 'closed', 'auto_replied');
  end if;

  return jsonb_build_object(
    'has_customer', true,
    'source_reference', 'autonomous_support_operations:get_customer_support_operations_center',
    'settings', row_to_json(v_settings)::jsonb,
    'performance', jsonb_build_object(
      'open_cases', v_open,
      'sla_at_risk_count', v_sla_at_risk,
      'sla_breached_count', v_sla_breached,
      'sla_policy_ready', v_sla_ready
    ),
    'high_risk_cases', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', sc.id, 'subject', sc.subject, 'risk_level', sc.risk_level, 'status', sc.status,
        'sla_status', public._aso_compute_case_sla_status(now(), sc, v_settings)
      ) order by sc.created_at desc)
      from public.support_cases sc
      where sc.tenant_id = p_tenant_id and sc.risk_level in ('high', 'critical')
        and sc.status not in ('resolved', 'closed') limit 10),
      '[]'::jsonb
    ),
    'readiness', v_readiness
  );
end;
$$;

create or replace function public.companion_worker_get_playful_bell_moment(
  p_tenant_id uuid,
  p_user_id uuid,
  p_context text default 'task_complete'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings public.personality_settings;
  v_context text;
  v_moment jsonb;
begin
  perform public._companion_assert_service_role();

  if coalesce((public._companion_worker_assert_scope(p_tenant_id, p_user_id)->>'ok'), 'false') <> 'true' then
    return null;
  end if;

  v_settings := public._per_ensure_settings(p_tenant_id);
  if not coalesce(v_settings.bell_moments_enabled, true) then
    return null;
  end if;

  v_context := lower(trim(coalesce(p_context, 'task_complete')));
  if v_context = 'milestone' then v_context := 'celebration'; end if;

  if not public._per_is_playful_allowed(p_tenant_id, v_context, v_settings) then
    return null;
  end if;

  if not public._per_is_humor_allowed(p_tenant_id, case
    when v_context in ('task_complete', 'small_win') then 'task_complete'
    when v_context = 'self_love' then 'positive_reinforcement'
    when v_context in ('fox_spoken', 'friday_energy') then 'greeting'
    else 'celebration'
  end, v_settings) then
    return null;
  end if;

  select elem into v_moment
  from jsonb_array_elements(public._per_playful_moments_seed_json()->'bell_personality_moments') elem
  where elem->>'context' = v_context
  limit 1;

  if v_moment is null then
    select elem into v_moment
    from jsonb_array_elements(public._per_playful_moments_seed_json()->'bell_personality_moments') elem
    where elem->>'context' = 'task_complete'
    limit 1;
  end if;

  if v_moment is null then return null; end if;

  return jsonb_build_object(
    'context', v_context,
    'emoji', v_moment->>'emoji',
    'text', v_moment->>'text',
    'signature', 'bell',
    'metadata_only', true
  );
end;
$$;

create or replace function public.companion_worker_has_presence_dedupe(
  p_tenant_id uuid,
  p_dedupe_key text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_exists boolean := false;
begin
  perform public._companion_assert_service_role();

  select exists (
    select 1
    from public.presence_notifications pn
    where pn.tenant_id = p_tenant_id
      and pn.metadata->>'dedupe_key' = p_dedupe_key
  ) into v_exists;

  return jsonb_build_object('exists', v_exists);
end;
$$;

revoke all on function public._companion_worker_assert_scope(uuid, uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_irp_has_permission(text, uuid, uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_assert_community_read(uuid, uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_assert_verification_read(uuid, uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_build_organization_context(uuid, uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_build_identity_permissions(uuid, uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_build_license_center(uuid, uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_build_integrations_hub(uuid, uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_build_personality_card(uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_build_assistant_identity(uuid, uuid) from public, authenticated, anon;
revoke all on function public._companion_worker_build_identity_center(uuid, uuid) from public, authenticated, anon;

revoke all on function public.companion_worker_get_runtime_bootstrap(uuid, uuid, text) from public, authenticated, anon;
revoke all on function public.companion_worker_get_customer_member_directory_center(uuid, uuid, text, text) from public, authenticated, anon;
revoke all on function public.companion_worker_get_customer_member_verification_center(uuid, uuid, text, text) from public, authenticated, anon;
revoke all on function public.companion_worker_get_customer_support_operations_center(uuid, uuid) from public, authenticated, anon;
revoke all on function public.companion_worker_get_playful_bell_moment(uuid, uuid, text) from public, authenticated, anon;
revoke all on function public.companion_worker_has_presence_dedupe(uuid, text) from public, authenticated, anon;

grant execute on function public.companion_worker_get_runtime_bootstrap(uuid, uuid, text) to service_role;
grant execute on function public.companion_worker_get_customer_member_directory_center(uuid, uuid, text, text) to service_role;
grant execute on function public.companion_worker_get_customer_member_verification_center(uuid, uuid, text, text) to service_role;
grant execute on function public.companion_worker_get_customer_support_operations_center(uuid, uuid) to service_role;
grant execute on function public.companion_worker_get_playful_bell_moment(uuid, uuid, text) to service_role;
grant execute on function public.companion_worker_has_presence_dedupe(uuid, text) to service_role;
