-- Core provider onboarding + connector distribution V1
-- Extends app_portal_integration_providers (no parallel registry).
-- Unonight remains an ordinary api_key_existing_provider row.

alter table public.app_portal_integration_providers
  add column if not exists onboarding_contract jsonb;

comment on column public.app_portal_integration_providers.onboarding_contract is
  'Authoritative Core onboarding/distribution contract (versioned JSON). Modes, ownership, install target, connector/OAuth/hosted/custom metadata, readiness and support.';

create table if not exists public.platform_provider_contract_audit (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null,
  actor_user_id uuid,
  action text not null check (action in ('upsert_onboarding_contract', 'seed_onboarding_contract')),
  contract_version integer,
  onboarding_mode text,
  readiness_level text,
  support_level text,
  created_at timestamptz not null default now()
);

alter table public.platform_provider_contract_audit enable row level security;

drop policy if exists platform_provider_contract_audit_admin_select on public.platform_provider_contract_audit;
create policy platform_provider_contract_audit_admin_select
  on public.platform_provider_contract_audit
  for select
  to authenticated
  using (public.is_platform_admin());

revoke all on table public.platform_provider_contract_audit from public, anon;
grant select on table public.platform_provider_contract_audit to authenticated;

-- Unonight ordinary provider onboarding contract (idempotent)
update public.app_portal_integration_providers
set onboarding_contract = $onb_unonight${"version":1,"requiresExternalLogin":true,"requiresCustomerInstallation":false,"requiresCustomerDeveloper":false,"requiresAipifyApproval":false,"requiresProviderApproval":false,"supportsAutomaticProvisioning":false,"supportsManualProvisioning":true,"supportsOAuth":false,"supportsApiKey":true,"supportsConnectorPackage":false,"supportsHostedConnector":false,"supportsCustomImplementation":false,"supportsHealthCheck":true,"supportsStatusReadback":true,"supportsUpgrade":true,"supportsRollback":true,"supportsUninstall":true,"supportsRotation":true,"supportsRevoke":true,"supportsOneTimeReveal":true,"callbackPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"redirectPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"requiredScopes":["metadata.read"],"optionalScopes":[],"requiredEnvironmentVariables":[],"requiredNetworkAccess":["https"],"requiredPorts":[443],"requiredDomains":["api.customer.example"],"requiredWebhookEndpoints":[],"requiredPermissions":["read"],"setupSteps":[{"key":"begin","labelKey":"customerApp.portalStructure.integrations.onboarding.unonight.begin","actor":"customer"}],"verificationSteps":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.unonight.verify","actor":"aipify"}],"customerResponsibilities":[{"key":"approve","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.customerApprove"}],"aipifyResponsibilities":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.aipifyVerify"}],"providerResponsibilities":[],"partnerResponsibilities":[],"supportLevel":"guided","readinessLevel":"production_ready","docs":{"gettingStarted":{"url":"https://docs.aipify.ai/integrations/getting-started"},"installation":{"url":"https://docs.aipify.ai/integrations/install"},"credentialSetup":{"url":"https://docs.aipify.ai/integrations/credentials"},"permissions":{"url":"https://docs.aipify.ai/integrations/permissions"},"testing":{"url":"https://docs.aipify.ai/integrations/testing"},"troubleshooting":{"url":"https://docs.aipify.ai/integrations/troubleshooting"},"upgrade":{"url":"https://docs.aipify.ai/integrations/upgrade"},"uninstall":{"url":"https://docs.aipify.ai/integrations/uninstall"},"security":{"url":"https://docs.aipify.ai/security"},"privacy":{"url":"https://docs.aipify.ai/privacy"},"support":{"url":"https://docs.aipify.ai/support"}},"versionPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"compatibilityPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"activationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"deactivationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"uninstallPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"failurePolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"auditPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"providerKey":"unonight","onboardingMode":"api_key_existing_provider","implementationOwner":"provider","distributionChannel":"not_applicable","credentialType":"api_key","installTarget":"provider_saas","apiKeyMetadata":{"labelKey":"customerApp.portalStructure.integrations.onboarding.apiKey","oneTimeReveal":true},"packageMetadata":null,"marketplaceMetadata":null,"oauthMetadata":null,"hostedConnectorMetadata":null,"customImplementationMetadata":null}$onb_unonight$::jsonb
where provider_key = 'unonight';


insert into public.app_portal_integration_providers (
  provider_key, display_name, category, setup_type, oauth_available,
  default_permission_level, recommended_scopes, sort_order, is_available, onboarding_contract
) values (
  'commerce_provider',
  'Commerce provider (reference)',
  'reference',
  'manual',
  true,
  'read_only',
  '["metadata.read"]'::jsonb,
  900,
  false,
  $onb_commerce_provider${"version":1,"requiresExternalLogin":true,"requiresCustomerInstallation":false,"requiresCustomerDeveloper":false,"requiresAipifyApproval":false,"requiresProviderApproval":false,"supportsAutomaticProvisioning":false,"supportsManualProvisioning":true,"supportsOAuth":true,"supportsApiKey":false,"supportsConnectorPackage":false,"supportsHostedConnector":false,"supportsCustomImplementation":false,"supportsHealthCheck":true,"supportsStatusReadback":true,"supportsUpgrade":true,"supportsRollback":true,"supportsUninstall":true,"supportsRotation":true,"supportsRevoke":true,"supportsOneTimeReveal":true,"callbackPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"redirectPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"requiredScopes":["metadata.read"],"optionalScopes":[],"requiredEnvironmentVariables":[],"requiredNetworkAccess":["https"],"requiredPorts":[443],"requiredDomains":["api.customer.example"],"requiredWebhookEndpoints":[],"requiredPermissions":["read"],"setupSteps":[{"key":"begin","labelKey":"customerApp.portalStructure.integrations.onboarding.commerce_provider.begin","actor":"customer"}],"verificationSteps":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.commerce_provider.verify","actor":"aipify"}],"customerResponsibilities":[{"key":"approve","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.customerApprove"}],"aipifyResponsibilities":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.aipifyVerify"}],"providerResponsibilities":[],"partnerResponsibilities":[],"supportLevel":"guided","readinessLevel":"production_ready","docs":{"gettingStarted":{"url":"https://docs.aipify.ai/integrations/getting-started"},"installation":{"url":"https://docs.aipify.ai/integrations/install"},"credentialSetup":{"url":"https://docs.aipify.ai/integrations/credentials"},"permissions":{"url":"https://docs.aipify.ai/integrations/permissions"},"testing":{"url":"https://docs.aipify.ai/integrations/testing"},"troubleshooting":{"url":"https://docs.aipify.ai/integrations/troubleshooting"},"upgrade":{"url":"https://docs.aipify.ai/integrations/upgrade"},"uninstall":{"url":"https://docs.aipify.ai/integrations/uninstall"},"security":{"url":"https://docs.aipify.ai/security"},"privacy":{"url":"https://docs.aipify.ai/privacy"},"support":{"url":"https://docs.aipify.ai/support"}},"versionPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"compatibilityPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"activationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"deactivationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"uninstallPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"failurePolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"auditPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"providerKey":"commerce_provider","onboardingMode":"oauth","implementationOwner":"provider","distributionChannel":"provider_marketplace","credentialType":"oauth","installTarget":"provider_saas","marketplaceMetadata":{"listingUrl":"https://apps.shopify.com/example-connector","listingId":"example-connector","publisher":"NETTSTED_NAVN","installLabelKey":"customerApp.portalStructure.integrations.onboarding.install"},"oauthMetadata":{"authorizationUrl":"https://github.com/example/oauth-authorize","tokenUrl":"https://github.com/example/oauth-token","callbackUrls":["https://app.aipify.ai/api/oauth/callback"],"pkceRequired":true,"supportsRefreshTokens":true},"packageMetadata":null,"hostedConnectorMetadata":null,"customImplementationMetadata":null,"apiKeyMetadata":null}$onb_commerce_provider$::jsonb
)
on conflict (provider_key) do update set
  display_name = excluded.display_name,
  category = 'reference',
  is_available = false,
  onboarding_contract = excluded.onboarding_contract;


insert into public.app_portal_integration_providers (
  provider_key, display_name, category, setup_type, oauth_available,
  default_permission_level, recommended_scopes, sort_order, is_available, onboarding_contract
) values (
  'cms_provider',
  'CMS provider (reference)',
  'reference',
  'manual',
  false,
  'read_only',
  '["metadata.read"]'::jsonb,
  900,
  false,
  $onb_cms_provider${"version":1,"requiresExternalLogin":true,"requiresCustomerInstallation":true,"requiresCustomerDeveloper":false,"requiresAipifyApproval":false,"requiresProviderApproval":false,"supportsAutomaticProvisioning":false,"supportsManualProvisioning":true,"supportsOAuth":false,"supportsApiKey":false,"supportsConnectorPackage":true,"supportsHostedConnector":false,"supportsCustomImplementation":false,"supportsHealthCheck":true,"supportsStatusReadback":true,"supportsUpgrade":true,"supportsRollback":true,"supportsUninstall":true,"supportsRotation":true,"supportsRevoke":true,"supportsOneTimeReveal":true,"callbackPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"redirectPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"requiredScopes":["metadata.read"],"optionalScopes":[],"requiredEnvironmentVariables":[],"requiredNetworkAccess":["https"],"requiredPorts":[443],"requiredDomains":["api.customer.example"],"requiredWebhookEndpoints":[],"requiredPermissions":["read"],"setupSteps":[{"key":"begin","labelKey":"customerApp.portalStructure.integrations.onboarding.cms_provider.begin","actor":"customer"}],"verificationSteps":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.cms_provider.verify","actor":"aipify"}],"customerResponsibilities":[{"key":"approve","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.customerApprove"}],"aipifyResponsibilities":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.aipifyVerify"}],"providerResponsibilities":[],"partnerResponsibilities":[],"supportLevel":"guided","readinessLevel":"production_ready","docs":{"gettingStarted":{"url":"https://docs.aipify.ai/integrations/getting-started"},"installation":{"url":"https://docs.aipify.ai/integrations/install"},"credentialSetup":{"url":"https://docs.aipify.ai/integrations/credentials"},"permissions":{"url":"https://docs.aipify.ai/integrations/permissions"},"testing":{"url":"https://docs.aipify.ai/integrations/testing"},"troubleshooting":{"url":"https://docs.aipify.ai/integrations/troubleshooting"},"upgrade":{"url":"https://docs.aipify.ai/integrations/upgrade"},"uninstall":{"url":"https://docs.aipify.ai/integrations/uninstall"},"security":{"url":"https://docs.aipify.ai/security"},"privacy":{"url":"https://docs.aipify.ai/privacy"},"support":{"url":"https://docs.aipify.ai/support"}},"versionPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"compatibilityPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"activationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"deactivationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"uninstallPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"failurePolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"auditPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"providerKey":"cms_provider","onboardingMode":"installable_connector","implementationOwner":"shared","distributionChannel":"provider_marketplace","credentialType":"custom","installTarget":"customer_cms","marketplaceMetadata":{"listingUrl":"https://wordpress.org/plugins/example-connector/","listingId":"example-connector","publisher":"NETTSTED_NAVN","installLabelKey":"customerApp.portalStructure.integrations.onboarding.install"},"packageMetadata":{"packageType":"wordpress_plugin","name":"example-connector","version":"1.0.0","downloadUrl":"https://wordpress.org/plugins/example-connector/","checksumAlgorithm":"sha256","checksum":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","signatureAlgorithm":"sigstore","signature":"signed-artifact","signatureUrl":"https://github.com/example/example-connector/releases","installCommand":null,"supportedPlatforms":["wordpress"]},"oauthMetadata":null,"hostedConnectorMetadata":null,"customImplementationMetadata":null,"apiKeyMetadata":null}$onb_cms_provider$::jsonb
)
on conflict (provider_key) do update set
  display_name = excluded.display_name,
  category = 'reference',
  is_available = false,
  onboarding_contract = excluded.onboarding_contract;


insert into public.app_portal_integration_providers (
  provider_key, display_name, category, setup_type, oauth_available,
  default_permission_level, recommended_scopes, sort_order, is_available, onboarding_contract
) values (
  'hosted_connector',
  'Hosted connector (reference)',
  'reference',
  'manual',
  false,
  'read_only',
  '["metadata.read"]'::jsonb,
  900,
  false,
  $onb_hosted_connector${"version":1,"requiresExternalLogin":true,"requiresCustomerInstallation":false,"requiresCustomerDeveloper":false,"requiresAipifyApproval":false,"requiresProviderApproval":false,"supportsAutomaticProvisioning":true,"supportsManualProvisioning":true,"supportsOAuth":false,"supportsApiKey":false,"supportsConnectorPackage":false,"supportsHostedConnector":true,"supportsCustomImplementation":false,"supportsHealthCheck":true,"supportsStatusReadback":true,"supportsUpgrade":true,"supportsRollback":true,"supportsUninstall":true,"supportsRotation":true,"supportsRevoke":true,"supportsOneTimeReveal":true,"callbackPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"redirectPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"requiredScopes":["metadata.read"],"optionalScopes":[],"requiredEnvironmentVariables":[],"requiredNetworkAccess":["https"],"requiredPorts":[443],"requiredDomains":["api.customer.example"],"requiredWebhookEndpoints":[],"requiredPermissions":["read"],"setupSteps":[{"key":"begin","labelKey":"customerApp.portalStructure.integrations.onboarding.hosted_connector.begin","actor":"customer"}],"verificationSteps":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.hosted_connector.verify","actor":"aipify"}],"customerResponsibilities":[{"key":"approve","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.customerApprove"}],"aipifyResponsibilities":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.aipifyVerify"}],"providerResponsibilities":[],"partnerResponsibilities":[],"supportLevel":"guided","readinessLevel":"production_ready","docs":{"gettingStarted":{"url":"https://docs.aipify.ai/integrations/getting-started"},"installation":{"url":"https://docs.aipify.ai/integrations/install"},"credentialSetup":{"url":"https://docs.aipify.ai/integrations/credentials"},"permissions":{"url":"https://docs.aipify.ai/integrations/permissions"},"testing":{"url":"https://docs.aipify.ai/integrations/testing"},"troubleshooting":{"url":"https://docs.aipify.ai/integrations/troubleshooting"},"upgrade":{"url":"https://docs.aipify.ai/integrations/upgrade"},"uninstall":{"url":"https://docs.aipify.ai/integrations/uninstall"},"security":{"url":"https://docs.aipify.ai/security"},"privacy":{"url":"https://docs.aipify.ai/privacy"},"support":{"url":"https://docs.aipify.ai/support"}},"versionPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"compatibilityPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"activationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"deactivationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"uninstallPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"failurePolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"auditPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"providerKey":"hosted_connector","onboardingMode":"aipify_hosted_connector","implementationOwner":"aipify","distributionChannel":"aipify_managed","credentialType":"bearer","installTarget":"aipify_cloud","hostedConnectorMetadata":{"serviceUrl":"https://docs.aipify.ai/hosted-connectors","provisioningLabelKey":"customerApp.portalStructure.integrations.onboarding.provision","requiresCustomerConfiguration":false},"packageMetadata":null,"marketplaceMetadata":null,"oauthMetadata":null,"customImplementationMetadata":null,"apiKeyMetadata":null}$onb_hosted_connector$::jsonb
)
on conflict (provider_key) do update set
  display_name = excluded.display_name,
  category = 'reference',
  is_available = false,
  onboarding_contract = excluded.onboarding_contract;


insert into public.app_portal_integration_providers (
  provider_key, display_name, category, setup_type, oauth_available,
  default_permission_level, recommended_scopes, sort_order, is_available, onboarding_contract
) values (
  'custom_erp',
  'Custom ERP (reference)',
  'reference',
  'manual',
  false,
  'read_only',
  '["metadata.read"]'::jsonb,
  900,
  false,
  $onb_custom_erp${"version":1,"requiresExternalLogin":true,"requiresCustomerInstallation":false,"requiresCustomerDeveloper":true,"requiresAipifyApproval":false,"requiresProviderApproval":false,"supportsAutomaticProvisioning":false,"supportsManualProvisioning":true,"supportsOAuth":false,"supportsApiKey":false,"supportsConnectorPackage":false,"supportsHostedConnector":false,"supportsCustomImplementation":true,"supportsHealthCheck":true,"supportsStatusReadback":true,"supportsUpgrade":true,"supportsRollback":true,"supportsUninstall":true,"supportsRotation":true,"supportsRevoke":true,"supportsOneTimeReveal":true,"callbackPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"redirectPolicy":{"allowedHosts":["app.aipify.ai"],"allowSubdomains":true},"requiredScopes":["metadata.read"],"optionalScopes":[],"requiredEnvironmentVariables":[],"requiredNetworkAccess":["https"],"requiredPorts":[443],"requiredDomains":["api.customer.example"],"requiredWebhookEndpoints":[],"requiredPermissions":["read"],"setupSteps":[{"key":"begin","labelKey":"customerApp.portalStructure.integrations.onboarding.custom_erp.begin","actor":"customer"}],"verificationSteps":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.custom_erp.verify","actor":"aipify"}],"customerResponsibilities":[{"key":"approve","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.customerApprove"}],"aipifyResponsibilities":[{"key":"verify","labelKey":"customerApp.portalStructure.integrations.onboarding.responsibilities.aipifyVerify"}],"providerResponsibilities":[],"partnerResponsibilities":[],"supportLevel":"guided","readinessLevel":"reference_only","docs":{"gettingStarted":{"url":"https://docs.aipify.ai/integrations/getting-started"},"installation":{"url":"https://docs.aipify.ai/integrations/install"},"credentialSetup":{"url":"https://docs.aipify.ai/integrations/credentials"},"permissions":{"url":"https://docs.aipify.ai/integrations/permissions"},"testing":{"url":"https://docs.aipify.ai/integrations/testing"},"troubleshooting":{"url":"https://docs.aipify.ai/integrations/troubleshooting"},"upgrade":{"url":"https://docs.aipify.ai/integrations/upgrade"},"uninstall":{"url":"https://docs.aipify.ai/integrations/uninstall"},"security":{"url":"https://docs.aipify.ai/security"},"privacy":{"url":"https://docs.aipify.ai/privacy"},"support":{"url":"https://docs.aipify.ai/support"}},"versionPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"compatibilityPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"activationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"deactivationPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"uninstallPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"failurePolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"auditPolicy":{"labelKey":"customerApp.portalStructure.integrations.onboarding.policy.standard","requiresApproval":true},"providerKey":"custom_erp","onboardingMode":"custom_provider_implementation","implementationOwner":"customer","distributionChannel":"customer_developer","credentialType":"custom","installTarget":"customer_custom_system","customImplementationMetadata":{"implementationState":"requirements_pending","specificationUrl":"https://github.com/example/custom-connector-specification","deliveryModel":"customer_developer","acceptanceCriteria":["metadata-readback"],"estimatedEffortLabelKey":"customerApp.portalStructure.integrations.onboarding.customEffort"},"packageMetadata":null,"marketplaceMetadata":null,"oauthMetadata":null,"hostedConnectorMetadata":null,"apiKeyMetadata":null}$onb_custom_erp$::jsonb
)
on conflict (provider_key) do update set
  display_name = excluded.display_name,
  category = 'reference',
  is_available = false,
  onboarding_contract = excluded.onboarding_contract;


-- Installation state mapping from secret-stream connection fields
create or replace function public._map_secret_stream_to_installation_state(
  p_connection public.app_portal_integration_connections
)
returns text
language plpgsql
stable
set search_path = public
as $$
declare
  v_canonical text;
  v_has_credential boolean;
begin
  if p_connection.id is null then
    return 'not_started';
  end if;

  v_has_credential := coalesce(p_connection.credentials_reference is not null, false)
    or coalesce(nullif(trim(p_connection.masked_credential_hint), ''), '') <> '';

  v_canonical := public._apsf260i_compute_canonical_status(
    p_connection.status,
    v_has_credential,
    p_connection.last_test_success_at,
    p_connection.last_test_failed_at,
    p_connection.activated_at,
    p_connection.deactivated_at,
    p_connection.removed_at
  );

  return case v_canonical
    when 'not_configured' then 'credential_required'
    when 'credential_saved' then 'credential_stored'
    when 'verification_pending' then 'connection_test_required'
    when 'verification_failed' then 'connection_test_failed'
    when 'rotation_required' then 'revoke_required'
    when 'verified' then 'verified'
    when 'active' then 'active'
    when 'inactive' then 'suspended'
    when 'revoked' then 'revoke_required'
    when 'removed' then 'removed'
    else 'awaiting_customer_action'
  end;
end;
$$;

revoke all on function public._map_secret_stream_to_installation_state(public.app_portal_integration_connections) from public, anon;

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
  v_onboarding jsonb;
  v_manual_steps jsonb;
  v_scopes jsonb;
  v_install_state text;
  v_safe_actions jsonb;
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

  v_onboarding := v_provider.onboarding_contract;
  if v_onboarding is null or jsonb_typeof(v_onboarding) <> 'object' then
    v_onboarding := '{}'::jsonb;
  end if;

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

  v_install_state := public._map_secret_stream_to_installation_state(v_connection);

  v_safe_actions := jsonb_build_object(
    'showOAuthConnect', coalesce((v_onboarding->>'supportsOAuth')::boolean, false),
    'showApiKeyFields', coalesce((v_onboarding->>'supportsApiKey')::boolean, false),
    'showConnectorDownload', coalesce((v_onboarding->>'supportsConnectorPackage')::boolean, false),
    'showHostedActivate', coalesce((v_onboarding->>'supportsHostedConnector')::boolean, false),
    'showCustomSteps', coalesce((v_onboarding->>'supportsCustomImplementation')::boolean, false),
    'showUpgrade', coalesce((v_onboarding->>'supportsUpgrade')::boolean, false),
    'showRollback', coalesce((v_onboarding->>'supportsRollback')::boolean, false),
    'showUninstall', coalesce((v_onboarding->>'supportsUninstall')::boolean, false),
    'showRotate', coalesce((v_onboarding->>'supportsRotation')::boolean, false),
    'showRevoke', coalesce((v_onboarding->>'supportsRevoke')::boolean, false),
    'showHealthCheck', coalesce((v_onboarding->>'supportsHealthCheck')::boolean, false),
    'showActivate', v_install_state in ('verified', 'activation_required')
      and coalesce(v_onboarding->>'readinessLevel', '') not in ('blocked', 'unsupported', 'deprecated')
      and coalesce(v_onboarding->>'supportLevel', '') <> 'unsupported'
  );

  return jsonb_build_object(
    'provider_key', v_provider.provider_key,
    'display_name', coalesce(nullif(v_contract->>'displayName', ''), v_provider.display_name),
    'setup_type', v_provider.setup_type,
    'oauth_available', v_provider.oauth_available,
    'default_permission_level', v_provider.default_permission_level,
    'recommended_scopes', v_scopes,
    'presentation_contract', v_contract,
    'onboarding_contract', v_onboarding,
    'onboarding_mode', v_onboarding->>'onboardingMode',
    'readiness_level', v_onboarding->>'readinessLevel',
    'support_level', v_onboarding->>'supportLevel',
    'installation_state', v_install_state,
    'safe_actions', v_safe_actions,
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

create or replace function public.list_platform_provider_onboarding_contracts()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'provider_key', p.provider_key,
        'display_name', p.display_name,
        'is_available', p.is_available,
        'category', p.category,
        'has_presentation_contract', p.presentation_contract is not null and jsonb_typeof(p.presentation_contract) = 'object',
        'has_onboarding_contract', p.onboarding_contract is not null and jsonb_typeof(p.onboarding_contract) = 'object',
        'onboarding_mode', p.onboarding_contract->>'onboardingMode',
        'readiness_level', p.onboarding_contract->>'readinessLevel',
        'support_level', p.onboarding_contract->>'supportLevel',
        'implementation_owner', p.onboarding_contract->>'implementationOwner',
        'distribution_channel', p.onboarding_contract->>'distributionChannel',
        'install_target', p.onboarding_contract->>'installTarget'
      )
      order by p.sort_order, p.provider_key
    )
    from public.app_portal_integration_providers p
  ), '[]'::jsonb);
end;
$$;

revoke all on function public.list_platform_provider_onboarding_contracts() from public, anon;
grant execute on function public.list_platform_provider_onboarding_contracts() to authenticated;

create or replace function public.get_platform_provider_onboarding_contract(p_provider_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.app_portal_integration_providers;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select * into v_row
  from public.app_portal_integration_providers p
  where p.provider_key = p_provider_key;

  if v_row.provider_key is null then
    raise exception 'Provider not found';
  end if;

  return jsonb_build_object(
    'provider_key', v_row.provider_key,
    'display_name', v_row.display_name,
    'is_available', v_row.is_available,
    'category', v_row.category,
    'onboarding_contract', coalesce(v_row.onboarding_contract, '{}'::jsonb),
    'presentation_contract', coalesce(v_row.presentation_contract, '{}'::jsonb)
  );
end;
$$;

revoke all on function public.get_platform_provider_onboarding_contract(text) from public, anon;
grant execute on function public.get_platform_provider_onboarding_contract(text) to authenticated;

create or replace function public.upsert_platform_provider_onboarding_contract(
  p_provider_key text,
  p_contract jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.app_portal_integration_providers;
  v_mode text;
  v_version integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  if p_contract is null or jsonb_typeof(p_contract) <> 'object' then
    raise exception 'Invalid onboarding contract';
  end if;

  v_version := nullif(p_contract->>'version', '')::integer;
  if v_version is distinct from 1 then
    raise exception 'Unsupported onboarding contract version';
  end if;

  if coalesce(p_contract->>'providerKey', '') <> p_provider_key then
    raise exception 'Provider key mismatch';
  end if;

  v_mode := p_contract->>'onboardingMode';
  if v_mode is null or v_mode not in (
    'oauth', 'api_key_existing_provider', 'installable_connector',
    'aipify_hosted_connector', 'custom_provider_implementation'
  ) then
    raise exception 'Invalid onboarding mode';
  end if;

  if coalesce(p_contract->>'implementationOwner', '') not in ('provider', 'customer', 'aipify', 'shared') then
    raise exception 'Invalid implementation owner';
  end if;

  if coalesce(p_contract->>'distributionChannel', '') not in (
    'provider_marketplace', 'direct_download', 'package_registry', 'container_image',
    'customer_developer', 'aipify_managed', 'not_applicable'
  ) then
    raise exception 'Invalid distribution channel';
  end if;

  if coalesce(p_contract->>'installTarget', '') not in (
    'none', 'provider_saas', 'customer_server', 'customer_cms', 'customer_ecommerce',
    'customer_cloud', 'customer_container_platform', 'aipify_cloud', 'customer_custom_system'
  ) then
    raise exception 'Invalid install target';
  end if;

  select * into v_row
  from public.app_portal_integration_providers p
  where p.provider_key = p_provider_key;

  if v_row.provider_key is null then
    raise exception 'Provider not found';
  end if;

  update public.app_portal_integration_providers
  set onboarding_contract = p_contract
  where provider_key = p_provider_key;

  insert into public.platform_provider_contract_audit (
    provider_key, actor_user_id, action, contract_version, onboarding_mode, readiness_level, support_level
  ) values (
    p_provider_key,
    auth.uid(),
    'upsert_onboarding_contract',
    v_version,
    v_mode,
    p_contract->>'readinessLevel',
    p_contract->>'supportLevel'
  );

  return jsonb_build_object(
    'ok', true,
    'provider_key', p_provider_key,
    'onboarding_mode', v_mode
  );
end;
$$;

revoke all on function public.upsert_platform_provider_onboarding_contract(text, jsonb) from public, anon;
grant execute on function public.upsert_platform_provider_onboarding_contract(text, jsonb) to authenticated;
