-- P0: Worker bootstrap failed because companion_worker_get_runtime_bootstrap called
-- get_companion_identity_relationship_center, which requires session auth via _irp_require_permission.
-- Service role has no auth.uid() → P0001 Permission denied: companion_identity_relationship.view.

create or replace function public._companion_worker_build_companion_identity_relationship(
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
  v_settings public.aipify_companion_identity_relationship_settings;
  v_seed jsonb := null;
begin
  if coalesce((public._companion_worker_assert_scope(p_tenant_id, p_user_id)->>'ok'), 'false') <> 'true' then
    return jsonb_build_object('has_customer', false);
  end if;

  if not public._companion_worker_irp_has_permission(
    'companion_identity_relationship.view',
    p_tenant_id,
    p_user_id
  ) then
    return jsonb_build_object('has_customer', false);
  end if;

  v_settings := public._cire_ensure_settings(p_tenant_id);

  if not exists (
    select 1
    from public.aipify_companion_relationship_milestones
    where tenant_id = p_tenant_id
    limit 1
  ) then
    begin
      v_seed := public._cire_seed_relationship_data(p_tenant_id);
    exception when others then
      v_seed := null;
    end;
  end if;

  select * into v_settings
  from public.aipify_companion_identity_relationship_settings
  where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'tenant_id', p_tenant_id,
    'route', '/app/companion/identity-relationship',
    'identity_settings', public._cire_settings_to_json(v_settings),
    'settings', public._cire_settings_to_json(v_settings),
    'communication_preferences', jsonb_build_object(
      'tone_preference', v_settings.tone_preference,
      'proactivity_level', v_settings.proactivity_level,
      'humor_preference', v_settings.humor_preference,
      'notification_style', v_settings.notification_style,
      'encouragement_preference', v_settings.encouragement_preference,
      'briefing_style', v_settings.briefing_style
    ),
    'relationship_mode', v_settings.relationship_mode,
    'trust_indicators', coalesce(public._cire_build_trust_indicators(p_tenant_id), '[]'::jsonb),
    'personalization_status', coalesce(public._cire_build_personalization_status(p_tenant_id), '[]'::jsonb),
    'boundaries', v_settings.boundary_settings,
    'milestones', coalesce(public._cire_build_milestones(p_tenant_id), '[]'::jsonb),
    'pending_reviews', coalesce(public._cire_build_pending_reviews(p_tenant_id), '[]'::jsonb),
    'introduction_framework', public._cirebp291_introduction_framework(),
    'blueprint', public._cirebp291_blueprint_summary(),
    'identity_profile_metadata', public._cire_identity_profile_metadata(p_tenant_id),
    'links', jsonb_build_object(
      'identity_relationship', '/app/companion/identity-relationship',
      'trust_adoption', '/app/companion/trust-adoption',
      'life_events', '/app/companion/life-events',
      'companion_identity_engine', '/app/companion-identity-engine',
      'assistant_identity', '/app/assistant/identity',
      'approvals', '/app/approvals'
    ),
    'seed', v_seed,
    'privacy_note', public._cirebp291_privacy_note(),
    'can_manage', public._companion_worker_irp_has_permission(
      'companion_identity_relationship.manage',
      p_tenant_id,
      p_user_id
    ),
    'can_record', public._companion_worker_irp_has_permission(
      'companion_identity_relationship.record',
      p_tenant_id,
      p_user_id
    )
  );
exception when others then
  return jsonb_build_object('has_customer', false);
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
  v_support_ops jsonb := jsonb_build_object('has_customer', false);
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

  begin
    v_support_ops := public.companion_worker_get_customer_support_operations_center(p_tenant_id, p_user_id);
  exception when others then
    v_support_ops := jsonb_build_object('has_customer', false);
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
    'companion_identity_relationship', public._companion_worker_build_companion_identity_relationship(
      p_tenant_id,
      p_user_id
    ),
    'install_discovery_context', jsonb_build_object('found', false, 'discovery_status', 'empty'),
    'install_discovery_center', jsonb_build_object('found', false),
    'support_operations_center', v_support_ops,
    'executive_command_center', jsonb_build_object('found', false, 'has_customer', true),
    'marketplace_summary', jsonb_build_object('found', false),
    'license_subscription_center', jsonb_build_object('found', false),
    'memory_center_preferences', jsonb_build_object('found', false),
    'learning_center', jsonb_build_object('has_customer', false),
    'crisis_mode_active', v_crisis
  );
end;
$$;

revoke all on function public._companion_worker_build_companion_identity_relationship(uuid, uuid)
  from public, authenticated, anon;

grant execute on function public._companion_worker_build_companion_identity_relationship(uuid, uuid)
  to service_role;
