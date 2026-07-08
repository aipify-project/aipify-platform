-- WEBSITE.KOMPIS.V2.06A — Allow Website Kompis domain activation audit actions
-- Builds on: 20261932800000_website_kompis_domain_activation_binding.sql
-- Root cause: activate/deactivate RPCs record lifecycle audit events that violated FAQ-only checks.

-- ---------------------------------------------------------------------------
-- 1. Extend audit action enum (preserve existing FAQ actions)
-- Applied when tenant_public_companion_faq_audit_events exists (created in 202619323).
-- ---------------------------------------------------------------------------
create or replace function public._wkpf00600_apply_activation_audit_actions_if_ready()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if to_regclass('public.tenant_public_companion_faq_audit_events') is null then
    return;
  end if;

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
end;
$$;

do $guard$
begin
  perform public._wkpf00600_apply_activation_audit_actions_if_ready();
end;
$guard$;
