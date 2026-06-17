-- Phase 338 — Partner Communication & Recognition Email Engine
-- Feature owner: GROWTH PARTNER PORTAL + SUPER ADMIN. Routes: /super/partner-communications, /partner/communications
-- Helpers: _gpe338_*

create table if not exists public.growth_partner_portal_email_senders (
  id uuid primary key default gen_random_uuid(),
  sender_key text not null unique,
  sender_name text not null default 'Aipify Group AS',
  sender_email text not null,
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.growth_partner_portal_email_senders enable row level security;
revoke all on public.growth_partner_portal_email_senders from authenticated, anon;

create table if not exists public.growth_partner_portal_email_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  template_category text not null,
  template_status text not null default 'active' check (
    template_status in ('draft', 'active', 'paused', 'archived')
  ),
  trigger_event text,
  sender_key text not null default 'partners' references public.growth_partner_portal_email_senders (sender_key),
  preference_key text not null default 'general_announcements',
  is_system_critical boolean not null default false,
  default_language text not null default 'en',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists gpp_email_templates_category_idx
  on public.growth_partner_portal_email_templates (template_category, template_status);
alter table public.growth_partner_portal_email_templates enable row level security;
revoke all on public.growth_partner_portal_email_templates from authenticated, anon;

create table if not exists public.growth_partner_portal_email_template_translations (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.growth_partner_portal_email_templates (id) on delete cascade,
  language_code text not null check (
    language_code in ('en', 'no', 'sv', 'da', 'de', 'fr', 'es', 'pl', 'uk')
  ),
  subject_template text not null default '',
  title_template text not null default '',
  greeting_template text not null default '',
  body_template text not null default '',
  details_template text not null default '',
  cta_label_template text not null default '',
  cta_url_template text not null default '/partner/dashboard',
  plain_text_template text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (template_id, language_code)
);
alter table public.growth_partner_portal_email_template_translations enable row level security;
revoke all on public.growth_partner_portal_email_template_translations from authenticated, anon;

create table if not exists public.growth_partner_portal_email_trigger_rules (
  id uuid primary key default gen_random_uuid(),
  trigger_event text not null unique,
  template_key text not null references public.growth_partner_portal_email_templates (template_key),
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_email_trigger_rules enable row level security;
revoke all on public.growth_partner_portal_email_trigger_rules from authenticated, anon;

create table if not exists public.growth_partner_portal_email_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade unique,
  sales_notifications boolean not null default true,
  milestone_notifications boolean not null default true,
  settlement_notifications boolean not null default true,
  academy_notifications boolean not null default true,
  compliance_notifications boolean not null default true,
  marketing_material_updates boolean not null default true,
  general_announcements boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.growth_partner_portal_email_notification_preferences enable row level security;
revoke all on public.growth_partner_portal_email_notification_preferences from authenticated, anon;

create table if not exists public.growth_partner_portal_email_logs (
  id uuid primary key default gen_random_uuid(),
  partner_org_id uuid not null references public.growth_partner_portal_organizations (id) on delete cascade,
  template_id uuid references public.growth_partner_portal_email_templates (id) on delete set null,
  template_key text not null default '',
  recipient_email text not null default '',
  language_code text not null default 'en',
  trigger_event text not null default '',
  subject text not null default '',
  html_body text not null default '',
  plain_text_body text not null default '',
  delivery_status text not null default 'queued' check (
    delivery_status in ('queued', 'sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced')
  ),
  opened_at timestamptz,
  clicked_at timestamptz,
  error_details text not null default '',
  context jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists gpp_email_logs_org_idx
  on public.growth_partner_portal_email_logs (partner_org_id, created_at desc);
create index if not exists gpp_email_logs_status_idx
  on public.growth_partner_portal_email_logs (delivery_status, created_at desc);
alter table public.growth_partner_portal_email_logs enable row level security;
revoke all on public.growth_partner_portal_email_logs from authenticated, anon;

create table if not exists public.growth_partner_portal_email_audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  summary text not null default '',
  actor_auth_user_id uuid,
  partner_org_id uuid references public.growth_partner_portal_organizations (id) on delete set null,
  email_log_id uuid references public.growth_partner_portal_email_logs (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists gpp_email_audit_created_idx
  on public.growth_partner_portal_email_audit_logs (created_at desc);
alter table public.growth_partner_portal_email_audit_logs enable row level security;
revoke all on public.growth_partner_portal_email_audit_logs from authenticated, anon;

create or replace function public._gpe338bp_positioning() returns text language sql immutable as $$
  select 'Professional communication from Aipify Group AS — recognition, settlement, compliance, and partnership updates for Growth Partners.'; $$;

create or replace function public._gpe338_require_super_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._spsf257_require_super_admin();
end; $$;

create or replace function public._gpe338_log_audit(
  p_event_type text,
  p_summary text,
  p_org_id uuid default null,
  p_log_id uuid default null,
  p_context jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_email_audit_logs (
    event_type, summary, actor_auth_user_id, partner_org_id, email_log_id, context
  ) values (
    p_event_type, p_summary, auth.uid(), p_org_id, p_log_id, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._gpe338_seed_senders()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_email_senders (sender_key, sender_name, sender_email) values
    ('partners', 'Aipify Group AS', 'partners@aipify.ai'),
    ('support', 'Aipify Group AS', 'support@aipify.ai'),
    ('finance', 'Aipify Group AS', 'finance@aipify.ai'),
    ('academy', 'Aipify Group AS', 'academy@aipify.ai')
  on conflict (sender_key) do nothing;
end; $$;

create or replace function public._gpe338_substitute(p_template text, p_vars jsonb)
returns text language plpgsql immutable as $$
declare
  v_result text := coalesce(p_template, '');
  v_key text;
  v_val text;
begin
  if p_vars is null then return v_result; end if;
  for v_key, v_val in select * from jsonb_each_text(p_vars) loop
    v_result := replace(v_result, '{{' || v_key || '}}', coalesce(v_val, ''));
  end loop;
  return v_result;
end; $$;

create or replace function public._gpe338_partner_vars(p_org_id uuid, p_extra jsonb default '{}'::jsonb)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org public.growth_partner_portal_organizations;
  v_profile public.growth_partner_portal_profiles;
  v_milestone public.growth_partner_portal_commission_milestones;
  v_first_name text;
  v_base jsonb;
begin
  select * into v_org from public.growth_partner_portal_organizations where id = p_org_id;
  select * into v_profile from public.growth_partner_portal_profiles where partner_org_id = p_org_id;
  select * into v_milestone from public.growth_partner_portal_commission_milestones where partner_org_id = p_org_id;
  v_first_name := split_part(coalesce(v_profile.company_name, v_org.org_name, 'Partner'), ' ', 1);

  v_base := jsonb_build_object(
    'partner_name', coalesce(v_profile.company_name, v_org.org_name, 'Growth Partner'),
    'partner_company', coalesce(v_profile.company_name, v_org.org_name, ''),
    'first_name', v_first_name,
    'current_tier', coalesce(v_milestone.current_tier_label, 'Tier 1'),
    'commission_rate', coalesce(v_milestone.current_rate_pct::text, '5') || '%',
    'next_tier', coalesce(v_milestone.next_tier_label, ''),
    'sales_to_next_tier', coalesce(v_milestone.sales_remaining::text, '0'),
    'dashboard_url', '/partner/dashboard',
    'materials_url', '/partner/materials',
    'compliance_url', '/partner/compliance'
  );

  if p_extra is not null then
    v_base := v_base || p_extra;
  end if;
  return v_base;
end; $$;

create or replace function public._gpe338_partner_language(p_org_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select coalesce(
    nullif((select preferred_language from public.growth_partner_portal_profiles where partner_org_id = p_org_id), ''),
    'en'
  ); $$;

create or replace function public._gpe338_normalize_language(p_lang text)
returns text language plpgsql immutable as $$
begin
  if p_lang in ('en', 'no', 'sv', 'da', 'de', 'fr', 'es', 'pl', 'uk') then return p_lang; end if;
  return 'en';
end; $$;

create or replace function public._gpe338_ensure_preferences(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_portal_email_notification_preferences (partner_org_id)
  values (p_org_id)
  on conflict (partner_org_id) do nothing;
end; $$;

create or replace function public._gpe338_preference_allowed(
  p_org_id uuid,
  p_pref_key text,
  p_critical boolean
) returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_prefs public.growth_partner_portal_email_notification_preferences;
begin
  if p_critical then return true; end if;
  perform public._gpe338_ensure_preferences(p_org_id);
  select * into v_prefs from public.growth_partner_portal_email_notification_preferences where partner_org_id = p_org_id;
  return case p_pref_key
    when 'sales_notifications' then coalesce(v_prefs.sales_notifications, true)
    when 'milestone_notifications' then coalesce(v_prefs.milestone_notifications, true)
    when 'settlement_notifications' then coalesce(v_prefs.settlement_notifications, true)
    when 'academy_notifications' then coalesce(v_prefs.academy_notifications, true)
    when 'compliance_notifications' then coalesce(v_prefs.compliance_notifications, true)
    when 'marketing_material_updates' then coalesce(v_prefs.marketing_material_updates, true)
    else coalesce(v_prefs.general_announcements, true)
  end;
end; $$;

create or replace function public._gpe338_seed_templates()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_tpl uuid;
begin
  perform public._gpe338_seed_senders();

  insert into public.growth_partner_portal_email_templates (
    template_key, template_category, trigger_event, sender_key, preference_key, is_system_critical, template_status
  ) values
    ('first_sale_celebration', 'first_sale_celebration', 'first_sale_approved', 'partners', 'sales_notifications', false, 'active'),
    ('sale_confirmation', 'sale_confirmation', 'sale_approved', 'partners', 'sales_notifications', false, 'active'),
    ('milestone_celebration', 'milestone_celebration', 'milestone_reached', 'partners', 'milestone_notifications', false, 'active'),
    ('commission_tier_increase', 'commission_update', 'commission_tier_increased', 'partners', 'milestone_notifications', false, 'active'),
    ('settlement_ready', 'settlement_ready', 'settlement_ready', 'finance', 'settlement_notifications', true, 'active'),
    ('invoice_generated', 'invoice_approved', 'invoice_generated', 'finance', 'settlement_notifications', true, 'active'),
    ('payment_sent', 'payment_sent', 'payment_sent', 'finance', 'settlement_notifications', true, 'active'),
    ('compliance_reminder', 'compliance_reminder', 'compliance_action_required', 'support', 'compliance_notifications', true, 'active'),
    ('sales_material_update', 'sales_material_update', 'sales_material_published', 'partners', 'marketing_material_updates', false, 'active'),
    ('partner_advisor_message', 'partner_advisor_message', null, 'partners', 'general_announcements', false, 'active'),
    ('general_partner_announcement', 'general_partner_announcement', 'partner_announcement', 'partners', 'general_announcements', false, 'active'),
    ('partner_registration', 'partner_registration', 'partner_registration_received', 'partners', 'general_announcements', false, 'active'),
    ('business_verification_approved', 'business_verification', 'business_verification_approved', 'partners', 'general_announcements', false, 'active'),
    ('business_verification_rejected', 'business_verification', 'business_verification_rejected', 'partners', 'general_announcements', true, 'active'),
    ('partner_onboarding_completed', 'partner_onboarding', 'partner_onboarding_completed', 'partners', 'general_announcements', false, 'active'),
    ('certification_completed', 'certification_completed', 'certification_completed', 'academy', 'academy_notifications', false, 'active'),
    ('academy_course_completed', 'academy_progress', 'academy_course_completed', 'academy', 'academy_notifications', false, 'active')
  on conflict (template_key) do nothing;

  insert into public.growth_partner_portal_email_trigger_rules (trigger_event, template_key) values
    ('first_sale_approved', 'first_sale_celebration'),
    ('sale_approved', 'sale_confirmation'),
    ('milestone_reached', 'milestone_celebration'),
    ('commission_tier_increased', 'commission_tier_increase'),
    ('settlement_ready', 'settlement_ready'),
    ('settlement_approved', 'settlement_ready'),
    ('invoice_generated', 'invoice_generated'),
    ('payment_sent', 'payment_sent'),
    ('compliance_action_required', 'compliance_reminder'),
    ('sales_material_published', 'sales_material_update'),
    ('partner_announcement', 'general_partner_announcement'),
    ('partner_registration_received', 'partner_registration'),
    ('business_verification_approved', 'business_verification_approved'),
    ('business_verification_rejected', 'business_verification_rejected'),
    ('partner_onboarding_completed', 'partner_onboarding_completed'),
    ('certification_completed', 'certification_completed'),
    ('academy_course_completed', 'academy_course_completed')
  on conflict (trigger_event) do nothing;

  select id into v_tpl from public.growth_partner_portal_email_templates where template_key = 'first_sale_celebration';
  if v_tpl is not null then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template, body_template,
      cta_label_template, cta_url_template, plain_text_template
    ) values (
      v_tpl, 'en',
      'Congratulations on your first Aipify sale',
      'Congratulations on your first Aipify sale',
      'Dear {{partner_name}},',
      E'Every successful partner journey starts with one customer.\n\nToday you reached that milestone.\n\nWe are proud to have you as part of the Aipify Growth Partner ecosystem.\n\nThank you for the effort, professionalism and trust you bring to Aipify.\n\nThis is only the beginning.',
      'View Partner Dashboard', '/partner/dashboard',
      E'Congratulations on your first Aipify sale.\n\nEvery successful partner journey starts with one customer. Today you reached that milestone.\n\nView your dashboard: {{dashboard_url}}'
    ) on conflict (template_id, language_code) do nothing;
  end if;

  select id into v_tpl from public.growth_partner_portal_email_templates where template_key = 'sale_confirmation';
  if v_tpl is not null then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template, body_template, details_template,
      cta_label_template, cta_url_template, plain_text_template
    ) values (
      v_tpl, 'en',
      'New Aipify sale approved',
      'New Aipify sale approved',
      'Dear {{partner_name}},',
      E'Great work.\n\nA new Aipify sale has been approved and commission has been added to your partner account.\n\nYour continued effort helps more organizations discover what Aipify can do for them.\n\nKeep building. Keep growing.',
      E'Sale reference: {{sale_reference}}\nPackage: {{package_name}}\nCommission: {{commission_amount}}\nCurrent tier: {{current_tier}}\nSales to next tier: {{sales_to_next_tier}}',
      'View Commission Details', '/partner/commissions',
      E'New Aipify sale approved.\n\nSale: {{sale_reference}} · {{package_name}} · Commission {{commission_amount}}'
    ) on conflict (template_id, language_code) do nothing;
  end if;

  select id into v_tpl from public.growth_partner_portal_email_templates where template_key = 'milestone_celebration';
  if v_tpl is not null then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template, body_template,
      cta_label_template, cta_url_template, plain_text_template
    ) values (
      v_tpl, 'en',
      'Milestone reached with Aipify',
      'Milestone reached with Aipify',
      'Dear {{partner_name}},',
      E'You have reached a new Growth Partner milestone.\n\nThis achievement reflects consistency, professionalism and the value you are creating in the market.\n\nWe are proud to have you building with Aipify.',
      'View Milestone Progress', '/partner/commissions',
      E'Milestone reached with Aipify: {{milestone_label}}'
    ) on conflict (template_id, language_code) do nothing;
  end if;

  select id into v_tpl from public.growth_partner_portal_email_templates where template_key = 'commission_tier_increase';
  if v_tpl is not null then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template, body_template, details_template,
      cta_label_template, cta_url_template, plain_text_template
    ) values (
      v_tpl, 'en',
      'Your commission level has increased',
      'Your commission level has increased',
      'Dear {{partner_name}},',
      E'Your commission tier has increased — a reflection of consistent, professional growth with Aipify.',
      E'Previous tier: {{previous_tier}} ({{previous_commission_rate}})\nNew tier: {{current_tier}} ({{commission_rate}})\nQualifying sales: {{sales_count}}\nNext tier target: {{next_tier}}',
      'View Commission Details', '/partner/commissions',
      E'Commission tier increased to {{current_tier}} at {{commission_rate}}'
    ) on conflict (template_id, language_code) do nothing;
  end if;

  select id into v_tpl from public.growth_partner_portal_email_templates where template_key = 'settlement_ready';
  if v_tpl is not null then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template, body_template, details_template,
      cta_label_template, cta_url_template, plain_text_template
    ) values (
      v_tpl, 'en',
      'Your monthly Aipify settlement is ready',
      'Your monthly Aipify settlement is ready',
      'Dear {{partner_name}},',
      E'Your monthly settlement draft is ready for review and approval.',
      E'Settlement period: {{settlement_period}}\nApproved sales: {{approved_sales_count}}\nCommission amount: {{commission_amount}}\nPlease review and approve before the deadline.',
      'Review and Approve Settlement', '/partner/settlements',
      E'Settlement ready for {{settlement_period}} — {{commission_amount}}'
    ) on conflict (template_id, language_code) do nothing;
  end if;

  select id into v_tpl from public.growth_partner_portal_email_templates where template_key = 'invoice_generated';
  if v_tpl is not null then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template, body_template, details_template,
      cta_label_template, cta_url_template, plain_text_template
    ) values (
      v_tpl, 'en',
      'Your Aipify partner invoice has been generated',
      'Your Aipify partner invoice has been generated',
      'Dear {{partner_name}},',
      E'Your self-billing invoice has been generated following settlement approval.',
      E'Invoice number: {{invoice_number}}\nSettlement period: {{settlement_period}}\nTotal amount: {{commission_amount}}\nStatus: Sent to accounting',
      'View Settlement Details', '/partner/settlements',
      E'Invoice {{invoice_number}} generated for {{settlement_period}}'
    ) on conflict (template_id, language_code) do nothing;
  end if;

  select id into v_tpl from public.growth_partner_portal_email_templates where template_key = 'payment_sent';
  if v_tpl is not null then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template, body_template, details_template,
      cta_label_template, cta_url_template, plain_text_template
    ) values (
      v_tpl, 'en',
      'Your Aipify partner payment has been sent',
      'Your Aipify partner payment has been sent',
      'Dear {{partner_name}},',
      E'Your partner payment has been marked as paid. Thank you for building with Aipify.',
      E'Amount paid: {{commission_amount}}\nInvoice: {{invoice_number}}\nPayment date: {{payment_date}}\nSettlement period: {{settlement_period}}',
      'View Settlement History', '/partner/settlements',
      E'Payment sent: {{commission_amount}} for invoice {{invoice_number}}'
    ) on conflict (template_id, language_code) do nothing;
  end if;

  select id into v_tpl from public.growth_partner_portal_email_templates where template_key = 'compliance_reminder';
  if v_tpl is not null then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template, body_template,
      cta_label_template, cta_url_template, plain_text_template
    ) values (
      v_tpl, 'en',
      'Action required: Partner compliance update',
      'Action required: Partner compliance update',
      'Dear {{partner_name}},',
      E'Your partner compliance information requires attention. Please review and update your records to remain eligible for settlements and official partner status.',
      'Review Compliance Center', '/partner/compliance',
      E'Compliance update required. Review: {{compliance_url}}'
    ) on conflict (template_id, language_code) do nothing;
  end if;

  select id into v_tpl from public.growth_partner_portal_email_templates where template_key = 'sales_material_update';
  if v_tpl is not null then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template, body_template, details_template,
      cta_label_template, cta_url_template, plain_text_template
    ) values (
      v_tpl, 'en',
      'New Aipify sales material is available',
      'New Aipify sales material is available',
      'Dear {{partner_name}},',
      E'New approved sales material is available in your Partner Materials Center.',
      E'Material: {{material_title}}\nCategory: {{material_category}}\nLanguage: {{material_language}}\nRecommended use: {{material_use}}',
      'Open Sales Materials', '/partner/materials',
      E'New material: {{material_title}}'
    ) on conflict (template_id, language_code) do nothing;
  end if;
end; $$;

create or replace function public.trigger_partner_communication_event(
  p_org_id uuid,
  p_event_type text,
  p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_rule public.growth_partner_portal_email_trigger_rules;
  v_tpl public.growth_partner_portal_email_templates;
  v_trans public.growth_partner_portal_email_template_translations;
  v_sender public.growth_partner_portal_email_senders;
  v_profile public.growth_partner_portal_profiles;
  v_lang text;
  v_vars jsonb;
  v_log_id uuid;
  v_subject text;
  v_title text;
  v_greeting text;
  v_body text;
  v_details text;
  v_cta_label text;
  v_cta_url text;
  v_plain text;
  v_html text;
begin
  if p_org_id is null or coalesce(trim(p_event_type), '') = '' then return null; end if;

  perform public._gpe338_seed_templates();

  select * into v_rule from public.growth_partner_portal_email_trigger_rules
  where trigger_event = p_event_type and enabled = true;
  if v_rule.id is null then return null; end if;

  select * into v_tpl from public.growth_partner_portal_email_templates
  where template_key = v_rule.template_key and template_status = 'active';
  if v_tpl.id is null then return null; end if;

  if p_event_type = 'settlement_ready' and coalesce((p_context->>'payable_amount')::numeric, 0) <= 0 then
    return null;
  end if;

  if not public._gpe338_preference_allowed(p_org_id, v_tpl.preference_key, v_tpl.is_system_critical) then
    return null;
  end if;

  select * into v_profile from public.growth_partner_portal_profiles where partner_org_id = p_org_id;
  if coalesce(v_profile.contact_email, '') = '' then return null; end if;

  v_lang := public._gpe338_normalize_language(public._gpe338_partner_language(p_org_id));
  select * into v_trans from public.growth_partner_portal_email_template_translations
  where template_id = v_tpl.id and language_code = v_lang;
  if v_trans.id is null then
    select * into v_trans from public.growth_partner_portal_email_template_translations
    where template_id = v_tpl.id and language_code = 'en';
  end if;
  if v_trans.id is null then return null; end if;

  v_vars := public._gpe338_partner_vars(p_org_id, coalesce(p_context, '{}'::jsonb));

  v_subject := public._gpe338_substitute(v_trans.subject_template, v_vars);
  v_title := public._gpe338_substitute(v_trans.title_template, v_vars);
  v_greeting := public._gpe338_substitute(v_trans.greeting_template, v_vars);
  v_body := public._gpe338_substitute(v_trans.body_template, v_vars);
  v_details := public._gpe338_substitute(coalesce(v_trans.details_template, ''), v_vars);
  v_cta_label := public._gpe338_substitute(v_trans.cta_label_template, v_vars);
  v_cta_url := public._gpe338_substitute(v_trans.cta_url_template, v_vars);
  v_plain := public._gpe338_substitute(v_trans.plain_text_template, v_vars);

  v_html := format(
    '<div data-aipify-partner-email="1"><h1>%s</h1><p>%s</p><p>%s</p>%s<p><a href="%s">%s</a></p></div>',
    replace(v_title, '"', '&quot;'),
    replace(v_greeting, '"', '&quot;'),
    replace(replace(v_body, E'\n', '<br/>'), '"', '&quot;'),
    case when coalesce(v_details, '') <> '' then format('<pre style="white-space:pre-wrap">%s</pre>', replace(v_details, '"', '&quot;')) else '' end,
    replace(v_cta_url, '"', '&quot;'),
    replace(v_cta_label, '"', '&quot;')
  );

  select * into v_sender from public.growth_partner_portal_email_senders where sender_key = v_tpl.sender_key;

  insert into public.growth_partner_portal_email_logs (
    partner_org_id, template_id, template_key, recipient_email, language_code, trigger_event,
    subject, html_body, plain_text_body, delivery_status, context
  ) values (
    p_org_id, v_tpl.id, v_tpl.template_key, v_profile.contact_email, v_lang, p_event_type,
    v_subject, v_html, v_plain, 'queued',
    jsonb_build_object(
      'sender_name', coalesce(v_sender.sender_name, 'Aipify Group AS'),
      'sender_email', coalesce(v_sender.sender_email, 'partners@aipify.ai'),
      'cta_url', v_cta_url,
      'cta_label', v_cta_label,
      'variables', v_vars
    )
  ) returning id into v_log_id;

  perform public._gpe338_log_audit(
    'email_queued', format('Partner email queued: %s (%s)', v_tpl.template_key, p_event_type),
    p_org_id, v_log_id, jsonb_build_object('trigger_event', p_event_type)
  );

  return v_log_id;
end; $$;

create or replace function public.get_super_partner_communications()
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public._gpe338_require_super_admin();
  perform public._gpe338_seed_templates();

  return jsonb_build_object(
    'positioning', public._gpe338bp_positioning(),
    'sections', jsonb_build_array(
      'templates', 'campaigns', 'automated', 'recognition', 'settlement', 'compliance', 'logs'
    ),
    'stats', jsonb_build_object(
      'active_templates', (select count(*) from public.growth_partner_portal_email_templates where template_status = 'active'),
      'queued_emails', (select count(*) from public.growth_partner_portal_email_logs where delivery_status = 'queued'),
      'sent_emails', (select count(*) from public.growth_partner_portal_email_logs where delivery_status in ('sent', 'delivered', 'opened', 'clicked')),
      'failed_emails', (select count(*) from public.growth_partner_portal_email_logs where delivery_status in ('failed', 'bounced'))
    ),
    'senders', coalesce((
      select jsonb_agg(jsonb_build_object(
        'sender_key', s.sender_key, 'sender_name', s.sender_name, 'sender_email', s.sender_email, 'enabled', s.enabled
      ) order by s.sender_key)
      from public.growth_partner_portal_email_senders s where s.enabled
    ), '[]'::jsonb),
    'trigger_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'trigger_event', r.trigger_event, 'template_key', r.template_key, 'enabled', r.enabled
      ) order by r.trigger_event)
      from public.growth_partner_portal_email_trigger_rules r
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_super_partner_communication_templates(p_category text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public._gpe338_require_super_admin();
  perform public._gpe338_seed_templates();

  return jsonb_build_object(
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id,
        'template_key', t.template_key,
        'template_category', t.template_category,
        'template_status', t.template_status,
        'trigger_event', t.trigger_event,
        'sender_key', t.sender_key,
        'preference_key', t.preference_key,
        'is_system_critical', t.is_system_critical,
        'default_language', t.default_language,
        'translations', coalesce((
          select jsonb_agg(jsonb_build_object(
            'language_code', tr.language_code,
            'subject_template', tr.subject_template,
            'title_template', tr.title_template,
            'body_template', tr.body_template,
            'cta_label_template', tr.cta_label_template,
            'cta_url_template', tr.cta_url_template
          ) order by tr.language_code)
          from public.growth_partner_portal_email_template_translations tr where tr.template_id = t.id
        ), '[]'::jsonb)
      ) order by t.template_category, t.template_key)
      from public.growth_partner_portal_email_templates t
      where p_category is null or t.template_category = p_category
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.update_super_partner_communication_template(
  p_template_id uuid,
  p_patch jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public._gpe338_require_super_admin();
  if p_template_id is null then raise exception 'template_id required'; end if;

  update public.growth_partner_portal_email_templates set
    template_status = coalesce(p_patch->>'template_status', template_status),
    sender_key = coalesce(p_patch->>'sender_key', sender_key),
    updated_at = now()
  where id = p_template_id;

  if p_patch ? 'translation' then
    insert into public.growth_partner_portal_email_template_translations (
      template_id, language_code, subject_template, title_template, greeting_template,
      body_template, details_template, cta_label_template, cta_url_template, plain_text_template
    ) values (
      p_template_id,
      public._gpe338_normalize_language(p_patch->'translation'->>'language_code'),
      coalesce(p_patch->'translation'->>'subject_template', ''),
      coalesce(p_patch->'translation'->>'title_template', ''),
      coalesce(p_patch->'translation'->>'greeting_template', ''),
      coalesce(p_patch->'translation'->>'body_template', ''),
      coalesce(p_patch->'translation'->>'details_template', ''),
      coalesce(p_patch->'translation'->>'cta_label_template', ''),
      coalesce(p_patch->'translation'->>'cta_url_template', '/partner/dashboard'),
      coalesce(p_patch->'translation'->>'plain_text_template', '')
    )
    on conflict (template_id, language_code) do update set
      subject_template = excluded.subject_template,
      title_template = excluded.title_template,
      greeting_template = excluded.greeting_template,
      body_template = excluded.body_template,
      details_template = excluded.details_template,
      cta_label_template = excluded.cta_label_template,
      cta_url_template = excluded.cta_url_template,
      plain_text_template = excluded.plain_text_template,
      updated_at = now();
  end if;

  perform public._gpe338_log_audit('template_updated', 'Partner email template updated', null, null,
    jsonb_build_object('template_id', p_template_id));

  return public.get_super_partner_communication_templates(null);
end; $$;

create or replace function public.get_super_partner_communication_logs(p_limit integer default 100)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public._gpe338_require_super_admin();

  return jsonb_build_object(
    'logs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id,
        'partner_org_id', l.partner_org_id,
        'template_key', l.template_key,
        'recipient_email', l.recipient_email,
        'language_code', l.language_code,
        'trigger_event', l.trigger_event,
        'subject', l.subject,
        'delivery_status', l.delivery_status,
        'sent_at', coalesce(l.sent_at::text, ''),
        'opened_at', coalesce(l.opened_at::text, ''),
        'clicked_at', coalesce(l.clicked_at::text, ''),
        'error_details', l.error_details,
        'created_at', l.created_at::text
      ) order by l.created_at desc)
      from (
        select * from public.growth_partner_portal_email_logs
        order by created_at desc limit greatest(coalesce(p_limit, 100), 1)
      ) l
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.queue_super_partner_communication_test(
  p_template_key text,
  p_recipient_email text,
  p_org_id uuid default null,
  p_language text default 'en'
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid := p_org_id;
  v_log_id uuid;
begin
  perform public._gpe338_require_super_admin();
  perform public._gpe338_seed_templates();

  if v_org_id is null then
    select id into v_org_id from public.growth_partner_portal_organizations order by created_at limit 1;
  end if;
  if v_org_id is null then raise exception 'No partner organization available for test'; end if;

  v_log_id := public.trigger_partner_communication_event(
    v_org_id,
    coalesce(
      (select trigger_event from public.growth_partner_portal_email_templates where template_key = p_template_key limit 1),
      'partner_announcement'
    ),
    jsonb_build_object(
      'test_mode', true,
      'sale_reference', 'SALE-TEST-001',
      'package_name', 'Business',
      'commission_amount', '420.00 NOK',
      'settlement_period', to_char(current_date, 'YYYY-MM'),
      'invoice_number', 'INV-TEST-001',
      'payment_date', current_date::text,
      'milestone_label', '10 approved sales',
      'material_title', 'Aipify Executive Overview',
      'material_category', 'Presentation',
      'material_language', public._gpe338_normalize_language(p_language),
      'material_use', 'Discovery meetings',
      'approved_sales_count', '3',
      'payable_amount', '1260.00'
    )
  );

  if v_log_id is not null and coalesce(trim(p_recipient_email), '') <> '' then
    update public.growth_partner_portal_email_logs set recipient_email = p_recipient_email where id = v_log_id;
  end if;

  perform public._gpe338_log_audit('test_email_queued', 'Test partner email queued', v_org_id, v_log_id,
    jsonb_build_object('template_key', p_template_key, 'recipient', p_recipient_email));

  return jsonb_build_object('email_log_id', v_log_id, 'queued', v_log_id is not null);
end; $$;

create or replace function public.resend_super_partner_communication_email(p_log_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform public._gpe338_require_super_admin();
  if p_log_id is null then raise exception 'log_id required'; end if;

  update public.growth_partner_portal_email_logs set
    delivery_status = 'queued',
    error_details = '',
    sent_at = null
  where id = p_log_id and delivery_status in ('failed', 'bounced');

  perform public._gpe338_log_audit('email_resent', 'Partner email re-queued', null, p_log_id, '{}'::jsonb);
  return jsonb_build_object('email_log_id', p_log_id, 'delivery_status', 'queued');
end; $$;

create or replace function public.mark_partner_communication_delivery(
  p_log_id uuid,
  p_status text,
  p_error text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if p_log_id is null then raise exception 'log_id required'; end if;

  update public.growth_partner_portal_email_logs set
    delivery_status = coalesce(p_status, delivery_status),
    error_details = coalesce(p_error, error_details),
    sent_at = case when p_status in ('sent', 'delivered', 'opened', 'clicked') then coalesce(sent_at, now()) else sent_at end,
    opened_at = case when p_status = 'opened' then coalesce(opened_at, now()) else opened_at end,
    clicked_at = case when p_status = 'clicked' then coalesce(clicked_at, now()) else clicked_at end
  where id = p_log_id;

  return jsonb_build_object('email_log_id', p_log_id, 'delivery_status', p_status);
end; $$;

create or replace function public.get_partner_communications()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  perform public._gpe338_ensure_preferences(v_org_id);

  return jsonb_build_object(
    'has_access', true,
    'org_id', v_org_id,
    'positioning', public._gpe338bp_positioning(),
    'preferences', (
      select jsonb_build_object(
        'sales_notifications', p.sales_notifications,
        'milestone_notifications', p.milestone_notifications,
        'settlement_notifications', p.settlement_notifications,
        'academy_notifications', p.academy_notifications,
        'compliance_notifications', p.compliance_notifications,
        'marketing_material_updates', p.marketing_material_updates,
        'general_announcements', p.general_announcements,
        'system_critical_note', 'Compliance, settlement, agreement, and payment notices may still be sent when required.'
      )
      from public.growth_partner_portal_email_notification_preferences p
      where p.partner_org_id = v_org_id
    ),
    'communications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id,
        'subject', l.subject,
        'template_key', l.template_key,
        'trigger_event', l.trigger_event,
        'language_code', l.language_code,
        'delivery_status', l.delivery_status,
        'sent_at', coalesce(l.sent_at::text, l.created_at::text),
        'preview', left(l.plain_text_body, 240)
      ) order by l.created_at desc)
      from public.growth_partner_portal_email_logs l
      where l.partner_org_id = v_org_id
      limit 100
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.update_partner_communication_preferences(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  perform public._gpe338_ensure_preferences(v_org_id);

  update public.growth_partner_portal_email_notification_preferences set
    sales_notifications = coalesce((p_patch->>'sales_notifications')::boolean, sales_notifications),
    milestone_notifications = coalesce((p_patch->>'milestone_notifications')::boolean, milestone_notifications),
    settlement_notifications = coalesce((p_patch->>'settlement_notifications')::boolean, settlement_notifications),
    academy_notifications = coalesce((p_patch->>'academy_notifications')::boolean, academy_notifications),
    compliance_notifications = coalesce((p_patch->>'compliance_notifications')::boolean, compliance_notifications),
    marketing_material_updates = coalesce((p_patch->>'marketing_material_updates')::boolean, marketing_material_updates),
    general_announcements = coalesce((p_patch->>'general_announcements')::boolean, general_announcements),
    updated_at = now()
  where partner_org_id = v_org_id;

  perform public._gpe338_log_audit('preferences_updated', 'Partner communication preferences updated', v_org_id, null, p_patch);
  return public.get_partner_communications();
end; $$;

create or replace function public.get_partner_communication_log(p_log_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
declare v_row public.growth_partner_portal_email_logs;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  select * into v_row from public.growth_partner_portal_email_logs
  where id = p_log_id and partner_org_id = v_org_id;
  if v_row.id is null then raise exception 'Communication not found'; end if;

  return jsonb_build_object(
    'has_access', true,
    'id', v_row.id,
    'subject', v_row.subject,
    'html_body', v_row.html_body,
    'plain_text_body', v_row.plain_text_body,
    'delivery_status', v_row.delivery_status,
    'trigger_event', v_row.trigger_event,
    'sent_at', coalesce(v_row.sent_at::text, v_row.created_at::text),
    'context', v_row.context
  );
end; $$;

create or replace function public.fetch_partner_communication_outbox(p_limit integer default 25)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'emails', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id,
        'partner_org_id', l.partner_org_id,
        'recipient_email', l.recipient_email,
        'subject', l.subject,
        'html_body', l.html_body,
        'plain_text_body', l.plain_text_body,
        'delivery_status', l.delivery_status,
        'context', l.context
      ) order by l.created_at)
      from (
        select * from public.growth_partner_portal_email_logs
        where delivery_status = 'queued'
        order by created_at asc
        limit greatest(coalesce(p_limit, 25), 1)
      ) l
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public._gpe338_check_milestones(p_org_id uuid, p_sales integer)
returns void language plpgsql security definer set search_path = public as $$
declare v_label text;
begin
  if p_sales in (10, 25, 50, 100) then
    v_label := p_sales::text || ' approved sales';
    perform public.trigger_partner_communication_event(
      p_org_id, 'milestone_reached', jsonb_build_object('milestone_label', v_label, 'sales_count', p_sales::text)
    );
  end if;
end; $$;

create or replace function public.record_partner_commission_approval(
  p_commission_record_id uuid
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_row public.growth_partner_portal_commission_engine_records;
  v_org_id uuid;
  v_sales integer;
  v_prev_tier integer;
  v_milestone public.growth_partner_portal_commission_milestones;
  v_is_first boolean;
  v_ctx jsonb;
begin
  perform public._gpe338_require_super_admin();
  select * into v_row from public.growth_partner_portal_commission_engine_records where id = p_commission_record_id;
  if v_row.id is null then raise exception 'Commission record not found'; end if;
  if v_row.commission_status = 'approved' then
    return jsonb_build_object('already_approved', true);
  end if;

  v_org_id := v_row.partner_org_id;
  select current_tier_number into v_prev_tier
  from public.growth_partner_portal_commission_milestones where partner_org_id = v_org_id;

  update public.growth_partner_portal_commission_engine_records set
    commission_status = 'approved', updated_at = now()
  where id = p_commission_record_id;

  perform public._gpc333_refresh_milestone(v_org_id);
  v_sales := public._gpc333_qualifying_sales_count(v_org_id);

  select not exists (
    select 1 from public.growth_partner_portal_commission_engine_records
    where partner_org_id = v_org_id and commission_status = 'approved' and id <> p_commission_record_id
  ) into v_is_first;

  v_ctx := jsonb_build_object(
    'sale_reference', coalesce((select sale_reference from public.growth_partner_portal_commission_sales where id = v_row.sale_id), v_row.commission_key),
    'customer_name', v_row.customer_name,
    'package_name', v_row.package_label,
    'commission_amount', v_row.commission_amount::text || ' NOK',
    'commission_rate', v_row.commission_rate_pct::text || '%'
  );

  if v_is_first then
    perform public.trigger_partner_communication_event(v_org_id, 'first_sale_approved', v_ctx);
  else
    perform public.trigger_partner_communication_event(v_org_id, 'sale_approved', v_ctx);
  end if;

  perform public._gpe338_check_milestones(v_org_id, v_sales);

  select * into v_milestone from public.growth_partner_portal_commission_milestones where partner_org_id = v_org_id;
  if v_prev_tier is not null and v_milestone.current_tier_number > v_prev_tier then
    perform public.trigger_partner_communication_event(v_org_id, 'commission_tier_increased', jsonb_build_object(
      'previous_tier', 'Tier ' || v_prev_tier::text,
      'previous_commission_rate', coalesce((select commission_rate_pct::text || '%' from public.growth_partner_portal_commission_tiers where tier_number = v_prev_tier), ''),
      'current_tier', v_milestone.current_tier_label,
      'commission_rate', v_milestone.current_rate_pct::text || '%',
      'sales_count', v_milestone.qualifying_sales_count::text,
      'next_tier', coalesce(v_milestone.next_tier_label, '')
    ));
  end if;

  perform public._gpc333_log_timeline(v_org_id, p_commission_record_id, 'commission_approved', 'Commission approved', 'Commission approved for partner sale.', '{}'::jsonb);
  return jsonb_build_object('approved', true, 'org_id', v_org_id);
end; $$;

-- Hook settlement prepare (only when payable > 0)
create or replace function public.prepare_partner_monthly_settlement(p_period text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_bounds record;
  v_total numeric;
  v_vat_rate numeric;
  v_vat_amount numeric;
  v_payable numeric;
  v_settlement_id uuid;
  v_key text;
  v_existing uuid;
  v_sales_count integer;
  v_result jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();
  perform public._gps334_ensure_agreement_row(v_org_id);
  perform public._gpc333_seed_demo(v_org_id);

  select * into v_bounds from public._gps334_period_bounds(p_period);

  select id into v_existing from public.growth_partner_portal_settlements
  where partner_org_id = v_org_id and settlement_period = v_bounds.period_label
    and settlement_status not in ('rejected', 'cancelled')
  limit 1;

  if v_existing is not null then
    return public.get_partner_settlement(v_existing);
  end if;

  v_total := public._gps334_payable_commissions(v_org_id, v_bounds.period_from, v_bounds.period_to);

  if v_total <= 0 then
    return jsonb_build_object(
      'has_access', true,
      'has_payable_settlement', false,
      'message', 'No payable settlement this month.',
      'settlement_period', v_bounds.period_label
    );
  end if;

  v_vat_rate := public._gps334_vat_rate(v_org_id);
  v_vat_amount := round(v_total * v_vat_rate / 100, 2);
  v_payable := v_total + v_vat_amount;
  v_key := 'STL-' || replace(v_bounds.period_label, '-', '') || '-' || left(replace(gen_random_uuid()::text, '-', ''), 6);

  insert into public.growth_partner_portal_settlements (
    partner_org_id, settlement_key, settlement_period, period_from, period_to,
    commission_total, vat_rate_pct, vat_amount, total_payable,
    settlement_status, due_date
  ) values (
    v_org_id, v_key, v_bounds.period_label, v_bounds.period_from, v_bounds.period_to,
    v_total, v_vat_rate, v_vat_amount, v_payable,
    'awaiting_partner_approval', current_date + 30
  ) returning id into v_settlement_id;

  insert into public.growth_partner_portal_settlement_items (
    settlement_id, commission_record_id, sale_reference, customer_name, package_label,
    sale_value, commission_rate_pct, commission_amount, line_description, sort_order
  )
  select
    v_settlement_id, cr.id, coalesce(s.sale_reference, cr.commission_key),
    cr.customer_name, cr.package_label, cr.sale_value, cr.commission_rate_pct,
    cr.commission_amount,
    'Commission — initial sale — ' || cr.customer_name || ' (' || cr.package_label || ')',
    row_number() over (order by cr.record_date)::int * 10
  from public.growth_partner_portal_commission_engine_records cr
  left join public.growth_partner_portal_commission_sales s on s.id = cr.sale_id
  where cr.partner_org_id = v_org_id
    and cr.commission_status in ('approved', 'ready_for_settlement')
    and cr.record_date between v_bounds.period_from and v_bounds.period_to;

  select count(*) into v_sales_count from public.growth_partner_portal_settlement_items where settlement_id = v_settlement_id;

  perform public._gps334_log_audit(
    v_org_id, v_settlement_id, 'settlement_draft_created',
    'Monthly settlement draft created.', jsonb_build_object('total_payable', v_payable)
  );

  perform public.trigger_partner_communication_event(v_org_id, 'settlement_ready', jsonb_build_object(
    'settlement_period', v_bounds.period_label,
    'commission_amount', v_payable::text || ' NOK',
    'approved_sales_count', v_sales_count::text,
    'payable_amount', v_payable
  ));

  v_result := public.get_partner_settlement(v_settlement_id);
  return v_result;
end; $$;

-- Hook settlement approval -> invoice generated email
create or replace function public.approve_partner_settlement(
  p_settlement_id uuid,
  p_approval_statement text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.growth_partner_portal_settlements;
  v_agreement public.growth_partner_portal_self_billing_agreements;
  v_invoice_number text;
  v_seller jsonb;
  v_buyer jsonb;
  v_lines jsonb;
  v_invoice_id uuid;
  v_accounting jsonb;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._gppf05_require_org();

  select * into v_agreement from public.growth_partner_portal_self_billing_agreements
  where partner_org_id = v_org_id and agreement_version = '1.0';
  if coalesce(v_agreement.accepted, false) = false then
    raise exception 'Self-billing agreement must be accepted before invoice generation';
  end if;

  select * into v_row from public.growth_partner_portal_settlements
  where id = p_settlement_id and partner_org_id = v_org_id;
  if v_row.id is null then raise exception 'Settlement not found'; end if;
  if v_row.total_payable <= 0 then raise exception 'Cannot approve empty settlement'; end if;
  if v_row.settlement_status not in ('draft', 'awaiting_partner_approval') then
    raise exception 'Settlement is not awaiting approval';
  end if;

  if coalesce(trim(p_approval_statement), '') = '' then
    raise exception 'Partner approval statement is required';
  end if;

  update public.growth_partner_portal_settlements set
    settlement_status = 'approved',
    partner_approved_at = now(),
    partner_approved_by = auth.uid(),
    approval_statement = p_approval_statement,
    updated_at = now()
  where id = p_settlement_id;

  v_invoice_number := public._gps334_next_invoice_number(v_org_id);
  v_seller := public._gps334_seller_snapshot(v_org_id);
  v_buyer := public._gps334_aipify_buyer();

  select coalesce(jsonb_agg(jsonb_build_object(
    'sale_reference', si.sale_reference,
    'customer', si.customer_name,
    'package', si.package_label,
    'commission_pct', si.commission_rate_pct,
    'amount', si.commission_amount
  ) order by si.sort_order), '[]'::jsonb) into v_lines
  from public.growth_partner_portal_settlement_items si where si.settlement_id = p_settlement_id;

  v_accounting := jsonb_build_object(
    'integration', 'fiken_ready',
    'direction', 'incoming_supplier_invoice',
    'supplier', v_seller,
    'buyer', v_buyer,
    'currency', 'NOK',
    'line_items', v_lines
  );

  insert into public.growth_partner_portal_settlement_invoices (
    partner_org_id, settlement_id, invoice_number, invoice_date, due_date,
    settlement_period, commission_total, vat_rate_pct, vat_amount, total_payable,
    payment_terms, invoice_status, seller_snapshot, buyer_snapshot, line_items,
    immutable, finalized_at, sent_to_accounting_at, accounting_payload
  ) values (
    v_org_id, p_settlement_id, v_invoice_number, current_date, v_row.due_date,
    v_row.settlement_period, v_row.commission_total, v_row.vat_rate_pct, v_row.vat_amount, v_row.total_payable,
    v_row.payment_terms, 'sent_to_accounting', v_seller, v_buyer, v_lines,
    true, now(), now(), v_accounting
  ) returning id into v_invoice_id;

  update public.growth_partner_portal_settlements set
    settlement_status = 'sent_to_accounting', updated_at = now()
  where id = p_settlement_id;

  update public.growth_partner_portal_commission_engine_records cr set
    commission_status = 'paid', updated_at = now()
  from public.growth_partner_portal_settlement_items si
  where si.commission_record_id = cr.id and si.settlement_id = p_settlement_id;

  perform public._gps334_log_audit(
    v_org_id, p_settlement_id, 'settlement_approved_invoice_generated',
    'Partner approved settlement; legal invoice generated.',
    jsonb_build_object('invoice_id', v_invoice_id, 'invoice_number', v_invoice_number)
  );

  perform public.trigger_partner_communication_event(v_org_id, 'invoice_generated', jsonb_build_object(
    'invoice_number', v_invoice_number,
    'settlement_period', v_row.settlement_period,
    'commission_amount', v_row.total_payable::text || ' NOK'
  ));

  return public.get_partner_settlement(p_settlement_id);
end; $$;

create or replace function public.mark_partner_settlement_payment_sent(
  p_invoice_id uuid,
  p_payment_date date default current_date
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_inv public.growth_partner_portal_settlement_invoices;
begin
  perform public._gpe338_require_super_admin();
  select * into v_inv from public.growth_partner_portal_settlement_invoices where id = p_invoice_id;
  if v_inv.id is null then raise exception 'Invoice not found'; end if;

  update public.growth_partner_portal_settlement_invoices set
    invoice_status = 'paid',
    paid_at = coalesce(p_payment_date, current_date)::timestamptz
  where id = p_invoice_id;

  perform public.trigger_partner_communication_event(v_inv.partner_org_id, 'payment_sent', jsonb_build_object(
    'invoice_number', v_inv.invoice_number,
    'settlement_period', v_inv.settlement_period,
    'commission_amount', v_inv.total_payable::text || ' NOK',
    'payment_date', coalesce(p_payment_date, current_date)::text
  ));

  perform public._gpe338_log_audit('payment_sent', 'Partner settlement marked paid', v_inv.partner_org_id, null,
    jsonb_build_object('invoice_id', p_invoice_id));

  return jsonb_build_object('invoice_id', p_invoice_id, 'invoice_status', 'paid');
end; $$;

create or replace function public.publish_partner_sales_material_email(
  p_material_id uuid
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_mat record;
  v_org record;
begin
  perform public._gpe338_require_super_admin();
  select m.material_key, m.title, m.category, m.language_code, m.usage_recommendations
  into v_mat
  from public.growth_partner_portal_sales_materials m where m.id = p_material_id;
  if v_mat.material_key is null then raise exception 'Material not found'; end if;

  for v_org in select id from public.growth_partner_portal_organizations where activation_status in ('verified', 'active') loop
    perform public.trigger_partner_communication_event(v_org.id, 'sales_material_published', jsonb_build_object(
      'material_title', v_mat.title,
      'material_category', v_mat.category,
      'material_language', v_mat.language_code,
      'material_use', coalesce(v_mat.usage_recommendations, 'Sales conversations')
    ));
  end loop;

  return jsonb_build_object('material_id', p_material_id, 'notified', true);
end; $$;

select public._gpe338_seed_templates();

grant execute on function public.get_super_partner_communications() to authenticated;
grant execute on function public.get_super_partner_communication_templates(text) to authenticated;
grant execute on function public.update_super_partner_communication_template(uuid, jsonb) to authenticated;
grant execute on function public.get_super_partner_communication_logs(integer) to authenticated;
grant execute on function public.queue_super_partner_communication_test(text, text, uuid, text) to authenticated;
grant execute on function public.resend_super_partner_communication_email(uuid) to authenticated;
grant execute on function public.mark_partner_communication_delivery(uuid, text, text) to authenticated;
grant execute on function public.get_partner_communications() to authenticated;
grant execute on function public.update_partner_communication_preferences(jsonb) to authenticated;
grant execute on function public.get_partner_communication_log(uuid) to authenticated;
grant execute on function public.fetch_partner_communication_outbox(integer) to authenticated;
grant execute on function public.trigger_partner_communication_event(uuid, text, jsonb) to authenticated;
grant execute on function public.record_partner_commission_approval(uuid) to authenticated;
grant execute on function public.mark_partner_settlement_payment_sent(uuid, date) to authenticated;
grant execute on function public.publish_partner_sales_material_email(uuid) to authenticated;
