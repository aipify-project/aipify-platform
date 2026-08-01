-- Core APP dynamic provider presentation contract V1.
-- Extends app_portal_integration_providers (no parallel registry).
-- Seeds ordinary provider contracts; Unonight is an ordinary registry row.

alter table public.app_portal_integration_providers
  add column if not exists presentation_contract jsonb;

comment on column public.app_portal_integration_providers.presentation_contract is
  'Authoritative Core APP presentation/capability contract (versioned JSON). Shared APP wizard reads this only — never hardcodes provider UI.';

-- ---------------------------------------------------------------------------
-- Ordinary provider contract seeds (idempotent)
-- ---------------------------------------------------------------------------

insert into public.app_portal_integration_providers (
  provider_key,
  display_name,
  category,
  setup_type,
  oauth_available,
  default_permission_level,
  recommended_scopes,
  sort_order,
  is_available,
  presentation_contract
) values (
  'unonight',
  'Unonight',
  'integrations',
  'manual',
  false,
  'read_only',
  '["metadata.read","organization.read","integration.status.read"]'::jsonb,
  5,
  true,
  null
)
on conflict (provider_key) do update set
  display_name = excluded.display_name,
  category = 'integrations',
  recommended_scopes = excluded.recommended_scopes,
  is_available = true;

update public.app_portal_integration_providers
set
  display_name = 'Unonight',
  category = 'integrations',
  recommended_scopes = '["metadata.read","organization.read","integration.status.read"]'::jsonb,
  presentation_contract = jsonb_build_object(
    'version', 1,
    'providerKey', 'unonight',
    'displayName', 'Unonight',
    'adminDisplayName', 'Unonight Admin',
    'credentialDisplayName', 'read-only connection key',
    'credentialType', 'api_key',
    'adminBaseUrl', 'https://www.unonight.com',
    'adminIntegrationPath', '/admin/integrations/aipify',
    'adminIntegrationUrl', 'https://www.unonight.com/admin/integrations/aipify',
    'allowedAdminHosts', jsonb_build_array('www.unonight.com', 'unonight.com'),
    'connectionTestLabel', 'Test connection',
    'requiredScopes', jsonb_build_array('metadata.read', 'organization.read', 'integration.status.read'),
    'optionalScopes', '[]'::jsonb,
    'scopeLabels', jsonb_build_object(
      'metadata.read', 'Basic integration metadata',
      'organization.read', 'Organization identity',
      'integration.status.read', 'Integration status'
    ),
    'scopeDescriptions', jsonb_build_object(
      'metadata.read', 'Read basic integration metadata required to verify the connection.',
      'organization.read', 'Read organization identity to bind the connection to the correct workspace.',
      'integration.status.read', 'Read integration health and connection status.'
    ),
    'setupSteps', jsonb_build_array(
      jsonb_build_object('key', 'open_provider_admin', 'actionType', 'open_admin'),
      jsonb_build_object('key', 'navigate_to_integration', 'actionType', 'navigate'),
      jsonb_build_object('key', 'create_credential', 'actionType', 'create_credential'),
      jsonb_build_object('key', 'confirm_scopes', 'actionType', 'confirm_scopes'),
      jsonb_build_object('key', 'copy_credential', 'actionType', 'copy_credential'),
      jsonb_build_object('key', 'return_to_app', 'actionType', 'return_to_app'),
      jsonb_build_object('key', 'save_credential', 'actionType', 'save_credential'),
      jsonb_build_object('key', 'test_connection', 'actionType', 'test_connection')
    ),
    'helpSections', jsonb_build_array(
      jsonb_build_object(
        'key', 'where',
        'body', 'Open the provider admin panel, go to Integrations → Aipify, then create a read-only connection key.'
      )
    ),
    'capabilities', jsonb_build_object(
      'canIssueCredential', true,
      'supportsOneTimeReveal', true,
      'supportsRotation', true,
      'supportsRevoke', true,
      'supportsReturnToApp', true,
      'supportsServerExchange', false,
      'requiresManualCopyPaste', true,
      'supportsConnectionTest', true,
      'requiresScopeReview', true,
      'requiresExternalLogin', false,
      'collectsBaseUrl', true,
      'collectsConnectionName', true
    ),
    'returnPolicy', jsonb_build_object(
      'supportsReturnToApp', true,
      'allowedReturnHosts', jsonb_build_array('app.aipify.ai')
    ),
    'testPolicy', jsonb_build_object(
      'requiredBeforeActivation', true,
      'supportsConnectionTest', true
    ),
    'activationPolicy', jsonb_build_object(
      'requiresVerifiedTest', true,
      'requiresScopeApproval', true
    ),
    'rotationPolicy', jsonb_build_object(
      'supportsRotation', true,
      'requiresNewCredential', true
    ),
    'revokePolicy', jsonb_build_object(
      'supportsRevoke', true,
      'revokeInProviderAdmin', true
    ),
    'statusPresentation', jsonb_build_object(
      'pending', 'Pending',
      'connected', 'Connected',
      'failed', 'Failed',
      'rotationRequired', 'Rotation required',
      'active', 'Active',
      'inactive', 'Inactive'
    ),
    'externalLoginInstruction', null,
    'adminOpenInstruction', 'Open {adminName}',
    'localeFallback', 'en'
  )
where provider_key = 'unonight';

-- Other providers keep null/incomplete contracts until Platform registers destinations.
-- APP fails closed with a controlled contract-error UI — never invents URLs.

-- ---------------------------------------------------------------------------
-- Setup reader — returns presentation_contract + dynamic manual steps
-- ---------------------------------------------------------------------------

create or replace function public.get_app_portal_integration_setup(p_provider_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_company_id uuid;
  v_provider public.app_portal_integration_providers;
  v_connection public.app_portal_integration_connections;
  v_contract jsonb;
  v_manual_steps jsonb;
  v_scopes jsonb;
begin
  v_access := public._apsf260_require_app_access();
  v_company_id := (v_access->>'company_id')::uuid;

  select * into v_provider
  from public.app_portal_integration_providers p
  where p.provider_key = p_provider_key and p.is_available;

  if v_provider.provider_key is null then
    raise exception 'Provider not found';
  end if;

  select * into v_connection
  from public.app_portal_integration_connections c
  where c.company_id = v_company_id
    and c.provider_key = p_provider_key
    and c.removed_at is null;

  v_contract := v_provider.presentation_contract;
  if v_contract is null or jsonb_typeof(v_contract) <> 'object' then
    v_contract := '{}'::jsonb;
  end if;

  -- Prefer contract requiredScopes; fall back to recommended_scopes column.
  v_scopes := coalesce(v_contract->'requiredScopes', v_provider.recommended_scopes, '[]'::jsonb);

  if jsonb_typeof(v_contract->'setupSteps') = 'array' then
    select coalesce(jsonb_agg(elem->>'key'), '[]'::jsonb)
      into v_manual_steps
    from jsonb_array_elements(v_contract->'setupSteps') as elem
    where coalesce(elem->>'actionType', '') <> 'external_login'
       or coalesce((v_contract->'capabilities'->>'requiresExternalLogin')::boolean, false);
  else
    v_manual_steps := jsonb_build_array(
      'open_provider_admin', 'navigate_to_integration', 'create_credential',
      'confirm_scopes', 'copy_credential', 'return_to_app', 'save_credential', 'test_connection'
    );
  end if;

  return jsonb_build_object(
    'provider_key', v_provider.provider_key,
    'display_name', coalesce(nullif(v_contract->>'displayName', ''), v_provider.display_name),
    'setup_type', v_provider.setup_type,
    'oauth_available', v_provider.oauth_available,
    'default_permission_level', v_provider.default_permission_level,
    'recommended_scopes', v_scopes,
    'presentation_contract', v_contract,
    'connection', case when v_connection.id is null then null else public._apsf260i_connection_json(v_connection) end,
    'manual_steps', v_manual_steps,
    'oauth_steps', jsonb_build_array(
      'connect_button', 'permission_preview', 'provider_redirect', 'success_confirmation', 'connected_summary'
    )
  );
end;
$$;

revoke all on function public.get_app_portal_integration_setup(text) from public, anon;
grant execute on function public.get_app_portal_integration_setup(text) to authenticated;
