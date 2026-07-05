-- WEBSITE.KOMPIS.V2.06A — Allow Website Kompis domain activation audit actions
-- Builds on: 20261932800000_website_kompis_domain_activation_binding.sql
-- Root cause: activate/deactivate RPCs record lifecycle audit events that violated FAQ-only checks.

-- ---------------------------------------------------------------------------
-- 1. Extend audit action enum (preserve existing FAQ actions)
-- ---------------------------------------------------------------------------
alter table public.tenant_public_companion_faq_audit_events
  drop constraint if exists tenant_public_companion_faq_audit_events_action_check;

alter table public.tenant_public_companion_faq_audit_events
  add constraint tenant_public_companion_faq_audit_events_action_check check (
    action in (
      'created',
      'updated',
      'published',
      'unpublished',
      'archived',
      'restored',
      'activated',
      'deactivated'
    )
  );

-- ---------------------------------------------------------------------------
-- 2. Extend status enums for domain activation lifecycle (active/disabled)
-- ---------------------------------------------------------------------------
alter table public.tenant_public_companion_faq_audit_events
  drop constraint if exists tenant_public_companion_faq_audit_events_old_status_check;

alter table public.tenant_public_companion_faq_audit_events
  add constraint tenant_public_companion_faq_audit_events_old_status_check check (
    old_status is null
    or old_status in ('draft', 'published', 'archived', 'active', 'disabled')
  );

alter table public.tenant_public_companion_faq_audit_events
  drop constraint if exists tenant_public_companion_faq_audit_events_new_status_check;

alter table public.tenant_public_companion_faq_audit_events
  add constraint tenant_public_companion_faq_audit_events_new_status_check check (
    new_status is null
    or new_status in ('draft', 'published', 'archived', 'active', 'disabled')
  );
