-- P1.11A — Register appointment booking permissions in Core IRP catalog.
-- Feature owner: CUSTOMER APP. Permissions only — no booking write RPC or activation.

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, v.module_key, v.description
from (values
  (
    'appointments.view',
    'View Appointments',
    'appointments_services',
    'View appointment schedules, services, availability metadata, and booking summaries'
  ),
  (
    'appointments.manage',
    'Manage Appointments',
    'appointments_services',
    'Create, update, and cancel appointments through governed booking operations'
  )
) as v(key, label, module_key, description)
where not exists (
  select 1 from public.aipify_permissions p where p.permission_key = v.key
);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'appointments.view'),
  ('owner', 'appointments.manage'),
  ('administrator', 'appointments.view'),
  ('administrator', 'appointments.manage'),
  ('manager', 'appointments.view'),
  ('support_agent', 'appointments.view'),
  ('viewer', 'appointments.view')
) as v(role, key)
on conflict (organization_id, role, permission_key) do nothing;
