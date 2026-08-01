-- Idempotent: reference fixtures must not claim production_ready readiness.
-- Unavailable reference rows stay unavailable; no new providers; no secrets/auth/tenant changes.

update public.app_portal_integration_providers
set onboarding_contract = jsonb_set(
  onboarding_contract,
  '{readinessLevel}',
  '"reference_only"'::jsonb,
  true
)
where category = 'reference'
  and onboarding_contract is not null
  and jsonb_typeof(onboarding_contract) = 'object'
  and coalesce(onboarding_contract->>'readinessLevel', '') = 'production_ready';
