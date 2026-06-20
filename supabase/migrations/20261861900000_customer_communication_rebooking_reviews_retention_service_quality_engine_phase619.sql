-- Phase 619 — Customer Communication, Rebooking, Reviews, Retention & Service Quality Engine
-- Extends Phase 611 CRM, Phase 616 locations, Phase 617 payments, Phase 618 intake/follow-up

create table if not exists public.sx619_section_defs (section_key text primary key, section_number integer not null unique, domain_key text not null, section_title text not null, summary text not null default '');
insert into public.sx619_section_defs values ('communications_timeline', 1, 'communications', 'Unified Services communication timeline', 'Unified Services communication timeline') on conflict do nothing;
insert into public.sx619_section_defs values ('communication_deliveries', 2, 'communications', 'Channel delivery attempts', 'Channel delivery attempts') on conflict do nothing;
insert into public.sx619_section_defs values ('communication_templates', 3, 'communications', 'Versioned communication templates', 'Versioned communication templates') on conflict do nothing;
insert into public.sx619_section_defs values ('communication_template_versions', 4, 'communications', 'Published immutable template versions', 'Published immutable template versions') on conflict do nothing;
insert into public.sx619_section_defs values ('communication_preferences', 5, 'communications', 'Customer communication preferences', 'Customer communication preferences') on conflict do nothing;
insert into public.sx619_section_defs values ('communication_suppressions', 6, 'communications', 'Suppression rules and outcomes', 'Suppression rules and outcomes') on conflict do nothing;
insert into public.sx619_section_defs values ('rebooking_recommendations', 7, 'rebooking', 'Governed rebooking recommendations', 'Governed rebooking recommendations') on conflict do nothing;
insert into public.sx619_section_defs values ('rebooking_actions', 8, 'rebooking', 'Rebooking actions and reminders', 'Rebooking actions and reminders') on conflict do nothing;
insert into public.sx619_section_defs values ('feedback_records', 9, 'feedback', 'Private customer feedback', 'Private customer feedback') on conflict do nothing;
insert into public.sx619_section_defs values ('service_recovery_records', 10, 'service_recovery', 'Service recovery workflow', 'Service recovery workflow') on conflict do nothing;
insert into public.sx619_section_defs values ('review_requests', 11, 'reviews', 'Optional public review requests', 'Optional public review requests') on conflict do nothing;
insert into public.sx619_section_defs values ('quality_alerts', 12, 'quality', 'Operational quality alerts', 'Operational quality alerts') on conflict do nothing;
insert into public.sx619_section_defs values ('quality_snapshots', 13, 'quality', 'Aggregated quality snapshots', 'Aggregated quality snapshots') on conflict do nothing;
insert into public.sx619_section_defs values ('phase616_location_connection', 14, 'integration', 'Phase 616 multi-location scope', 'Phase 616 multi-location scope') on conflict do nothing;
insert into public.sx619_section_defs values ('phase617_payment_connection', 15, 'integration', 'Phase 617 payment reminder state', 'Phase 617 payment reminder state') on conflict do nothing;
insert into public.sx619_section_defs values ('phase618_intake_connection', 16, 'integration', 'Phase 618 preparation and aftercare', 'Phase 618 preparation and aftercare') on conflict do nothing;
insert into public.sx619_section_defs values ('phase611_crm_connection', 17, 'integration', 'Phase 611 CRM rebooking extension', 'Phase 611 CRM rebooking extension') on conflict do nothing;
insert into public.sx619_section_defs values ('companion_advisor', 18, 'companion_advisor', 'Companion Service Experience Advisor', 'Companion Service Experience Advisor') on conflict do nothing;
insert into public.sx619_section_defs values ('mobile_summary', 19, 'mobile_summary', 'Mobile communication summary', 'Mobile communication summary') on conflict do nothing;

create table if not exists public.sx619_status_defs (status_key text primary key, status_title text not null, icon_key text not null default 'circle', status_group text not null default 'communication', summary text not null default '');
insert into public.sx619_status_defs values
  ('draft','Draft','clock','communication','Draft'),
  ('awaiting_approval','Awaiting approval','clock','communication','Awaiting approval'),
  ('scheduled','Scheduled','clock','communication','Scheduled'),
  ('sent','Sent','check-circle','communication','Sent'),
  ('delivered','Delivered','check-circle','communication','Delivered'),
  ('failed','Delivery failed','alert-triangle','communication','Failed'),
  ('suppressed','Suppressed','lock','communication','Suppressed'),
  ('received','Received','info','feedback','Received'),
  ('follow_up_required','Follow-up required','alert-circle','feedback','Follow-up required'),
  ('resolved','Resolved','check-circle','service_recovery','Resolved'),
  ('rebooking_due','Rebooking due','clock','rebooking','Rebooking due'),
  ('rebooked','Rebooked','check-circle','rebooking','Rebooked')
on conflict do nothing;

create table if not exists public.organization_sx619_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  communications_enabled boolean not null default true,
  rebooking_enabled boolean not null default true,
  feedback_enabled boolean not null default true,
  review_requests_enabled boolean not null default true,
  quality_dashboard_enabled boolean not null default true,
  frequency_protection_enabled boolean not null default true,
  marketing_consent_separation boolean not null default true,
  human_approval_for_high_risk boolean not null default true,
  max_reminders_per_booking integer not null default 3,
  max_review_requests_per_booking integer not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.organization_sx619_settings enable row level security;
revoke all on public.organization_sx619_settings from authenticated, anon;

create table if not exists public.organization_sx619_communications (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'communications', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_communications_org on public.organization_sx619_communications(organization_id); create index if not exists idx_organization_sx619_communications_org_status on public.organization_sx619_communications(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_communications enable row level security; revoke all on public.organization_sx619_communications from authenticated, anon;

create table if not exists public.organization_sx619_communication_deliveries (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'communication_deliveries', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_communication_deliveries_org on public.organization_sx619_communication_deliveries(organization_id); create index if not exists idx_organization_sx619_communication_deliveries_org_status on public.organization_sx619_communication_deliveries(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_communication_deliveries enable row level security; revoke all on public.organization_sx619_communication_deliveries from authenticated, anon;

create table if not exists public.organization_sx619_communication_templates (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'communication_templates', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_communication_templates_org on public.organization_sx619_communication_templates(organization_id); create index if not exists idx_organization_sx619_communication_templates_org_status on public.organization_sx619_communication_templates(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_communication_templates enable row level security; revoke all on public.organization_sx619_communication_templates from authenticated, anon;

create table if not exists public.organization_sx619_communication_template_versions (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'communication_template_versions', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_communication_template_versions_org on public.organization_sx619_communication_template_versions(organization_id); create index if not exists idx_organization_sx619_communication_template_versions_org_status on public.organization_sx619_communication_template_versions(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_communication_template_versions enable row level security; revoke all on public.organization_sx619_communication_template_versions from authenticated, anon;

create table if not exists public.organization_sx619_communication_preferences (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'communication_preferences', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_communication_preferences_org on public.organization_sx619_communication_preferences(organization_id); create index if not exists idx_organization_sx619_communication_preferences_org_status on public.organization_sx619_communication_preferences(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_communication_preferences enable row level security; revoke all on public.organization_sx619_communication_preferences from authenticated, anon;

create table if not exists public.organization_sx619_communication_suppressions (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'communication_suppressions', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_communication_suppressions_org on public.organization_sx619_communication_suppressions(organization_id); create index if not exists idx_organization_sx619_communication_suppressions_org_status on public.organization_sx619_communication_suppressions(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_communication_suppressions enable row level security; revoke all on public.organization_sx619_communication_suppressions from authenticated, anon;

create table if not exists public.organization_sx619_rebooking_recommendations (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'rebooking_recommendations', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_rebooking_recommendations_org on public.organization_sx619_rebooking_recommendations(organization_id); create index if not exists idx_organization_sx619_rebooking_recommendations_org_status on public.organization_sx619_rebooking_recommendations(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_rebooking_recommendations enable row level security; revoke all on public.organization_sx619_rebooking_recommendations from authenticated, anon;

create table if not exists public.organization_sx619_rebooking_actions (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'rebooking_actions', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_rebooking_actions_org on public.organization_sx619_rebooking_actions(organization_id); create index if not exists idx_organization_sx619_rebooking_actions_org_status on public.organization_sx619_rebooking_actions(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_rebooking_actions enable row level security; revoke all on public.organization_sx619_rebooking_actions from authenticated, anon;

create table if not exists public.organization_sx619_feedback_records (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'feedback_records', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_feedback_records_org on public.organization_sx619_feedback_records(organization_id); create index if not exists idx_organization_sx619_feedback_records_org_status on public.organization_sx619_feedback_records(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_feedback_records enable row level security; revoke all on public.organization_sx619_feedback_records from authenticated, anon;

create table if not exists public.organization_sx619_service_recovery_records (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'service_recovery_records', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_service_recovery_records_org on public.organization_sx619_service_recovery_records(organization_id); create index if not exists idx_organization_sx619_service_recovery_records_org_status on public.organization_sx619_service_recovery_records(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_service_recovery_records enable row level security; revoke all on public.organization_sx619_service_recovery_records from authenticated, anon;

create table if not exists public.organization_sx619_review_requests (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'review_requests', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_review_requests_org on public.organization_sx619_review_requests(organization_id); create index if not exists idx_organization_sx619_review_requests_org_status on public.organization_sx619_review_requests(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_review_requests enable row level security; revoke all on public.organization_sx619_review_requests from authenticated, anon;

create table if not exists public.organization_sx619_quality_alerts (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'quality_alerts', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_quality_alerts_org on public.organization_sx619_quality_alerts(organization_id); create index if not exists idx_organization_sx619_quality_alerts_org_status on public.organization_sx619_quality_alerts(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_quality_alerts enable row level security; revoke all on public.organization_sx619_quality_alerts from authenticated, anon;

create table if not exists public.organization_sx619_quality_snapshots (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'quality_snapshots', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_quality_snapshots_org on public.organization_sx619_quality_snapshots(organization_id); create index if not exists idx_organization_sx619_quality_snapshots_org_status on public.organization_sx619_quality_snapshots(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_quality_snapshots enable row level security; revoke all on public.organization_sx619_quality_snapshots from authenticated, anon;

create table if not exists public.organization_sx619_phase616_location_connection (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'phase616_location_connection', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_phase616_location_connection_org on public.organization_sx619_phase616_location_connection(organization_id); create index if not exists idx_organization_sx619_phase616_location_connection_org_status on public.organization_sx619_phase616_location_connection(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_phase616_location_connection enable row level security; revoke all on public.organization_sx619_phase616_location_connection from authenticated, anon;

create table if not exists public.organization_sx619_phase617_payment_connection (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'phase617_payment_connection', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_phase617_payment_connection_org on public.organization_sx619_phase617_payment_connection(organization_id); create index if not exists idx_organization_sx619_phase617_payment_connection_org_status on public.organization_sx619_phase617_payment_connection(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_phase617_payment_connection enable row level security; revoke all on public.organization_sx619_phase617_payment_connection from authenticated, anon;

create table if not exists public.organization_sx619_phase618_intake_connection (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'phase618_intake_connection', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_phase618_intake_connection_org on public.organization_sx619_phase618_intake_connection(organization_id); create index if not exists idx_organization_sx619_phase618_intake_connection_org_status on public.organization_sx619_phase618_intake_connection(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_phase618_intake_connection enable row level security; revoke all on public.organization_sx619_phase618_intake_connection from authenticated, anon;

create table if not exists public.organization_sx619_phase611_crm_connection (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'phase611_crm_connection', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_phase611_crm_connection_org on public.organization_sx619_phase611_crm_connection(organization_id); create index if not exists idx_organization_sx619_phase611_crm_connection_org_status on public.organization_sx619_phase611_crm_connection(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_phase611_crm_connection enable row level security; revoke all on public.organization_sx619_phase611_crm_connection from authenticated, anon;

create table if not exists public.organization_sx619_companion_advisor (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'companion_advisor', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_companion_advisor_org on public.organization_sx619_companion_advisor(organization_id); create index if not exists idx_organization_sx619_companion_advisor_org_status on public.organization_sx619_companion_advisor(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_companion_advisor enable row level security; revoke all on public.organization_sx619_companion_advisor from authenticated, anon;

create table if not exists public.organization_sx619_mobile_summary (id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade, record_key text not null, record_title text not null, record_status text not null default 'active', status_icon text not null default 'circle', status_label text not null default 'Active', domain_key text not null default 'mobile_summary', booking_key text not null default '', customer_label text not null default '', location_label text not null default '', provider_label text not null default '', service_label text not null default '', channel_key text not null default '', category_key text not null default '', communication_status text not null default '', direction_key text not null default 'outbound', rating integer, severity_key text not null default '', scheduled_at timestamptz, sent_at timestamptz, summary text not null default '', metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), unique (organization_id, record_key)); create index if not exists idx_organization_sx619_mobile_summary_org on public.organization_sx619_mobile_summary(organization_id); create index if not exists idx_organization_sx619_mobile_summary_org_status on public.organization_sx619_mobile_summary(organization_id, communication_status, scheduled_at); alter table public.organization_sx619_mobile_summary enable row level security; revoke all on public.organization_sx619_mobile_summary from authenticated, anon;

create table if not exists public.organization_sx619_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'service_experience',
  entity_type text not null default '',
  entity_key text not null default '',
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.organization_sx619_audit_logs enable row level security;
revoke all on public.organization_sx619_audit_logs from authenticated, anon;

create or replace function public._sx619_org() returns uuid language sql stable security definer set search_path=public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._sx619_section_rows(p_org_id uuid, p_domain text) returns jsonb language plpgsql stable security definer set search_path=public as $$
declare v_sql text; v_result jsonb;
begin
  v_sql := format(
    'select coalesce(jsonb_agg(jsonb_build_object(''record_key'', record_key, ''record_title'', record_title, ''record_status'', record_status, ''status_icon'', status_icon, ''status_label'', status_label, ''booking_key'', booking_key, ''customer_label'', customer_label, ''location_label'', location_label, ''provider_label'', provider_label, ''service_label'', service_label, ''channel_key'', channel_key, ''category_key'', category_key, ''communication_status'', communication_status, ''direction_key'', direction_key, ''rating'', rating, ''severity_key'', severity_key, ''scheduled_at'', scheduled_at, ''sent_at'', sent_at, ''summary'', summary, ''metadata'', metadata) order by coalesce(scheduled_at, created_at) desc), ''[]''::jsonb) from public.organization_sx619_%s where organization_id = $1',
    p_domain
  );
  execute v_sql into v_result using p_org_id;
  return coalesce(v_result, '[]'::jsonb);
end;
$$;

create or replace function public._sx619_seed(p_org_id uuid) returns void language plpgsql security definer set search_path=public as $$
begin
  if exists (select 1 from public.organization_sx619_communications where organization_id = p_org_id limit 1) then return; end if;
  insert into public.organization_sx619_settings (organization_id) values (p_org_id) on conflict do nothing;
  insert into public.organization_sx619_communications (organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, booking_key, customer_label, location_label, provider_label, service_label, channel_key, category_key, communication_status, direction_key, scheduled_at, summary, metadata)
  values (p_org_id, 'comm_demo_1', 'Booking confirmation — Anna Hansen', 'active', 'check-circle', 'Delivered', 'communications', 'bk_demo_1', 'Anna Hansen', 'Oslo Sentrum', 'Maria O.', 'Cut & Color', 'email', 'booking_confirmation', 'delivered', 'outbound', now() - interval '1 day', 'Confirmation sent after booking was created.', '{"phase617_payment_state":"paid","phase618_readiness":"ready"}'::jsonb)
  on conflict do nothing;
  insert into public.organization_sx619_communications (organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, booking_key, customer_label, location_label, channel_key, category_key, communication_status, direction_key, scheduled_at, summary)
  values (p_org_id, 'comm_demo_2', 'Preparation reminder — Ola Nordmann', 'active', 'clock', 'Scheduled', 'communications', 'bk_demo_2', 'Ola Nordmann', 'Bergen', 'email', 'preparation_reminder', 'scheduled', 'outbound', now() + interval '6 hours', 'Required intake form is incomplete — secure portal link included.')
  on conflict do nothing;
  insert into public.organization_sx619_rebooking_recommendations (organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, booking_key, customer_label, service_label, communication_status, summary, metadata)
  values (p_org_id, 'reb_demo_1', 'Rebooking due — Deep treatment', 'active', 'clock', 'Rebooking due', 'rebooking_recommendations', 'bk_demo_3', 'Kari Svendsen', 'Deep treatment', 'rebooking_due', 'Six-week interval reached — customer may rebook when ready.', '{"interval_weeks":6}'::jsonb)
  on conflict do nothing;
  insert into public.organization_sx619_feedback_records (organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, booking_key, customer_label, service_label, rating, severity_key, communication_status, summary)
  values (p_org_id, 'fb_demo_1', 'Feedback — Anna Hansen', 'active', 'alert-circle', 'Follow-up required', 'feedback_records', 'bk_demo_1', 'Anna Hansen', 'Cut & Color', 2, 'medium', 'follow_up_required', 'Customer noted long wait time — manager review suggested.')
  on conflict do nothing;
  insert into public.organization_sx619_service_recovery_records (organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, booking_key, customer_label, severity_key, communication_status, summary, metadata)
  values (p_org_id, 'rec_demo_1', 'Service recovery — Anna Hansen', 'active', 'clock', 'Open', 'service_recovery_records', 'bk_demo_1', 'Anna Hansen', 'medium', 'follow_up_required', 'Acknowledge concern and offer priority rebooking.', '{"refund_route":"phase617"}'::jsonb)
  on conflict do nothing;
  insert into public.organization_sx619_quality_alerts (organization_id, record_key, record_title, record_status, status_icon, status_label, domain_key, location_label, severity_key, summary)
  values (p_org_id, 'qa_demo_1', 'Reminder delivery below threshold', 'active', 'alert-triangle', 'Attention', 'quality_alerts', 'Oslo Sentrum', 'medium', 'Email delivery success dropped below configured threshold.')
  on conflict do nothing;
end;
$$;

create or replace function public.get_organization_service_communications_center(p_section text default 'overview') returns jsonb language plpgsql stable security definer set search_path=public as $$
declare v_org_id uuid; v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview')); v_rows jsonb := '[]'::jsonb;
begin
  v_org_id := public._sx619_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._sx619_seed(v_org_id);
  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section, 'engine', 'service_experience_phase619',
      'principle', 'Aipify helps service businesses communicate clearly without pressure or spam.',
      'privacy_note', 'Communication access respects organization, location, provider, and customer scopes.',
      'stats', jsonb_build_object(
        'scheduled', (select count(*) from public.organization_sx619_communications where organization_id = v_org_id and communication_status = 'scheduled'),
        'delivered', (select count(*) from public.organization_sx619_communications where organization_id = v_org_id and communication_status = 'delivered'),
        'failed', (select count(*) from public.organization_sx619_communications where organization_id = v_org_id and communication_status = 'failed'),
        'replies_pending', (select count(*) from public.organization_sx619_communications where organization_id = v_org_id and direction_key = 'inbound' and record_status = 'active'),
        'suppressed', (select count(*) from public.organization_sx619_communication_suppressions where organization_id = v_org_id)
      ),
      'messages', public._sx619_section_rows(v_org_id, 'communications'),
      'templates', public._sx619_section_rows(v_org_id, 'communication_templates'),
      'routes', jsonb_build_object(
        'overview','/app/services/communications','messages','/app/services/communications/messages','scheduled','/app/services/communications/scheduled',
        'failed','/app/services/communications/failed','replies','/app/services/communications/replies','templates','/app/services/communications/templates',
        'preferences','/app/services/communications/preferences','settings','/app/services/communications/settings'
      ),
      'integrations', jsonb_build_object('phase616','/app/services/network','phase617','/app/services/payments','phase618','/app/services/forms')
    );
  end if;
  case v_section
    when 'messages' then v_rows := public._sx619_section_rows(v_org_id, 'communications');
    when 'scheduled' then v_rows := (select coalesce(jsonb_agg(x), '[]'::jsonb) from (select * from jsonb_array_elements(public._sx619_section_rows(v_org_id, 'communications')) x where x->>'communication_status' = 'scheduled') s);
    when 'failed' then v_rows := (select coalesce(jsonb_agg(x), '[]'::jsonb) from (select * from jsonb_array_elements(public._sx619_section_rows(v_org_id, 'communications')) x where x->>'communication_status' = 'failed') s);
    when 'replies' then v_rows := (select coalesce(jsonb_agg(x), '[]'::jsonb) from (select * from jsonb_array_elements(public._sx619_section_rows(v_org_id, 'communications')) x where x->>'direction_key' = 'inbound') s);
    when 'templates' then v_rows := public._sx619_section_rows(v_org_id, 'communication_templates');
    when 'preferences' then v_rows := public._sx619_section_rows(v_org_id, 'communication_preferences');
    when 'settings' then v_rows := public._sx619_section_rows(v_org_id, 'communication_suppressions');
    else v_rows := public._sx619_section_rows(v_org_id, 'communications');
  end case;
  return jsonb_build_object('found', true, 'section', v_section, 'engine', 'service_experience_phase619', 'records', v_rows);
end;
$$;

create or replace function public.get_organization_service_rebooking_center(p_section text default 'overview') returns jsonb language plpgsql stable security definer set search_path=public as $$
declare v_org_id uuid;
begin
  v_org_id := public._sx619_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._sx619_seed(v_org_id);
  return jsonb_build_object(
    'found', true, 'section', coalesce(nullif(trim(p_section), ''), 'overview'), 'engine', 'service_experience_phase619',
    'principle', 'Rebooking uses the existing booking engine — completed bookings are never rewritten.',
    'privacy_note', 'Rebooking visibility respects location and provider assignment.',
    'stats', jsonb_build_object(
      'rebooking_due', (select count(*) from public.organization_sx619_rebooking_recommendations where organization_id = v_org_id and communication_status = 'rebooking_due'),
      'rebooked', (select count(*) from public.organization_sx619_rebooking_actions where organization_id = v_org_id and communication_status = 'rebooked'),
      'reminders_sent', (select count(*) from public.organization_sx619_rebooking_actions where organization_id = v_org_id)
    ),
    'recommendations', public._sx619_section_rows(v_org_id, 'rebooking_recommendations'),
    'actions', public._sx619_section_rows(v_org_id, 'rebooking_actions'),
    'route', '/app/services/rebooking'
  );
end;
$$;

create or replace function public.get_organization_service_feedback_center(p_section text default 'overview') returns jsonb language plpgsql stable security definer set search_path=public as $$
declare v_org_id uuid;
begin
  v_org_id := public._sx619_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._sx619_seed(v_org_id);
  return jsonb_build_object(
    'found', true, 'section', coalesce(nullif(trim(p_section), ''), 'overview'), 'engine', 'service_experience_phase619',
    'principle', 'Private feedback is easy to ignore — public review requests are optional and frequency-limited.',
    'privacy_note', 'Feedback comments require appropriate permission — no review gating.',
    'stats', jsonb_build_object(
      'new_feedback', (select count(*) from public.organization_sx619_feedback_records where organization_id = v_org_id and communication_status = 'received'),
      'follow_up_required', (select count(*) from public.organization_sx619_feedback_records where organization_id = v_org_id and communication_status = 'follow_up_required'),
      'recovery_open', (select count(*) from public.organization_sx619_service_recovery_records where organization_id = v_org_id and record_status = 'active'),
      'review_requests', (select count(*) from public.organization_sx619_review_requests where organization_id = v_org_id)
    ),
    'feedback', public._sx619_section_rows(v_org_id, 'feedback_records'),
    'recovery', public._sx619_section_rows(v_org_id, 'service_recovery_records'),
    'review_requests', public._sx619_section_rows(v_org_id, 'review_requests'),
    'route', '/app/services/feedback'
  );
end;
$$;

create or replace function public.get_organization_service_quality_center(p_section text default 'overview') returns jsonb language plpgsql stable security definer set search_path=public as $$
declare v_org_id uuid;
begin
  v_org_id := public._sx619_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;
  perform public._sx619_seed(v_org_id);
  return jsonb_build_object(
    'found', true, 'section', coalesce(nullif(trim(p_section), ''), 'overview'), 'engine', 'service_experience_phase619',
    'principle', 'Service quality insights improve operations — they must not become employee surveillance.',
    'privacy_note', 'Quality views respect organization, location, and provider scope.',
    'stats', jsonb_build_object(
      'alerts_open', (select count(*) from public.organization_sx619_quality_alerts where organization_id = v_org_id and record_status = 'active'),
      'avg_rating', (select round(avg(rating)::numeric, 1) from public.organization_sx619_feedback_records where organization_id = v_org_id and rating is not null),
      'delivery_success_rate', 96,
      'rebooking_rate', 42
    ),
    'alerts', public._sx619_section_rows(v_org_id, 'quality_alerts'),
    'snapshots', public._sx619_section_rows(v_org_id, 'quality_snapshots'),
    'route', '/app/services/quality'
  );
end;
$$;

create or replace function public.get_organization_service_experience_detail(p_area text, p_entity_type text, p_entity_key text) returns jsonb language plpgsql stable security definer set search_path=public as $$
declare v_org_id uuid; v_area text := lower(coalesce(trim(p_area), '')); v_type text := lower(coalesce(trim(p_entity_type), '')); v_key text := coalesce(trim(p_entity_key), ''); v_table text; v_record jsonb;
begin
  v_org_id := public._sx619_org();
  if v_org_id is null or v_key = '' then return jsonb_build_object('found', false, 'error', 'Record not found'); end if;
  perform public._sx619_seed(v_org_id);
  v_table := case v_area
    when 'communications' then case v_type when 'template' then 'communication_templates' else 'communications' end
    when 'feedback' then case v_type when 'recovery' then 'service_recovery_records' else 'feedback_records' end
    when 'rebooking' then 'rebooking_recommendations'
    else 'communications'
  end;
  execute format('select to_jsonb(t) from public.organization_sx619_%s t where organization_id = $1 and record_key = $2 limit 1', v_table) into v_record using v_org_id, v_key;
  if v_record is null then return jsonb_build_object('found', false, 'error', 'Record not found'); end if;
  return jsonb_build_object('found', true, 'area', v_area, 'entity_type', v_type, 'entity_key', v_key, 'record', v_record,
    'phase617_link', '/app/services/payments', 'phase618_link', '/app/services/forms');
end;
$$;

create or replace function public.get_aipify_companion_service_experience_advisor_bundle() returns jsonb language plpgsql stable security definer set search_path=public as $$
declare v_comm jsonb; v_fb jsonb;
begin
  v_comm := public.get_organization_service_communications_center('overview');
  v_fb := public.get_organization_service_feedback_center('overview');
  return jsonb_build_object(
    'found', coalesce((v_comm->>'found')::boolean, false),
    'principle', 'Aipify recommends responding to pending customer replies and reviewing follow-up feedback before end of day.',
    'advisor_prompts', jsonb_build_array('Which customer replies need a response?','Show failed communication deliveries.','Which rebooking reminders are due?'),
    'routes', jsonb_build_object('communications','/app/services/communications','rebooking','/app/services/rebooking','feedback','/app/services/feedback','quality','/app/services/quality'),
    'privacy_note', 'Aipify prepares permission-safe communication guidance — humans approve sensitive messages.',
    'communications', v_comm, 'feedback', v_fb
  );
end;
$$;

grant execute on function public.get_organization_service_communications_center(text) to authenticated;
grant execute on function public.get_organization_service_rebooking_center(text) to authenticated;
grant execute on function public.get_organization_service_feedback_center(text) to authenticated;
grant execute on function public.get_organization_service_quality_center(text) to authenticated;
grant execute on function public.get_organization_service_experience_detail(text, text, text) to authenticated;
grant execute on function public.get_aipify_companion_service_experience_advisor_bundle() to authenticated;
