-- Phase 460 — Book a Demo & Discovery Center (Public Marketing)
-- Route: /book-demo · CRM-ready lead + opportunity + audit trail

create table if not exists public.marketing_demo_advisors (
  id uuid primary key default gen_random_uuid(),
  advisor_key text not null unique,
  display_name text not null,
  role_title text not null default '',
  availability_status text not null default 'available' check (availability_status in (
    'available', 'limited', 'unavailable'
  )),
  availability_note text not null default '',
  languages text[] not null default '{English,Norwegian}',
  contact_email text not null default '',
  contact_phone text not null default '',
  is_active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.marketing_demo_leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  company_name text not null,
  job_title text not null default '',
  business_email text not null,
  phone text not null default '',
  country text not null default '',
  company_size text not null default '',
  industry text not null default '',
  current_challenge text not null default '',
  additional_notes text not null default '' check (char_length(additional_notes) <= 2000),
  meeting_type text not null default 'no_preference' check (meeting_type in (
    'video', 'phone', 'in_person', 'no_preference'
  )),
  lead_source text not null default 'book_demo',
  submission_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists marketing_demo_leads_email_idx
  on public.marketing_demo_leads (business_email, created_at desc);

create table if not exists public.marketing_demo_opportunities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.marketing_demo_leads (id) on delete cascade,
  pipeline_stage text not null default 'discovery_scheduled' check (pipeline_stage in (
    'demo_requested', 'discovery_scheduled', 'demo_completed',
    'follow_up_required', 'qualified_opportunity', 'customer_activated'
  )),
  assigned_advisor_id uuid references public.marketing_demo_advisors (id) on delete set null,
  meeting_outcome text not null default '',
  follow_up_history jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique (lead_id)
);

create index if not exists marketing_demo_opportunities_stage_idx
  on public.marketing_demo_opportunities (pipeline_stage, updated_at desc);

create table if not exists public.marketing_demo_activity_log (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.marketing_demo_leads (id) on delete cascade,
  opportunity_id uuid references public.marketing_demo_opportunities (id) on delete set null,
  activity_key text not null,
  activity_type text not null check (activity_type in (
    'submission', 'pipeline_change', 'confirmation', 'follow_up', 'meeting', 'audit'
  )),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists marketing_demo_activity_log_lead_idx
  on public.marketing_demo_activity_log (lead_id, created_at desc);

alter table public.marketing_demo_advisors enable row level security;
alter table public.marketing_demo_leads enable row level security;
alter table public.marketing_demo_opportunities enable row level security;
alter table public.marketing_demo_activity_log enable row level security;

revoke all on public.marketing_demo_advisors from authenticated, anon;
revoke all on public.marketing_demo_leads from authenticated, anon;
revoke all on public.marketing_demo_opportunities from authenticated, anon;
revoke all on public.marketing_demo_activity_log from authenticated, anon;

insert into public.marketing_demo_advisors
  (advisor_key, display_name, role_title, availability_status, availability_note, languages, contact_email, sort_order)
values
  (
    'default-discovery-advisor',
    'Aipify Discovery Team',
    'Enterprise Discovery Advisor',
    'available',
    'Nordic business hours · response within one business day',
    array['English', 'Norwegian', 'Swedish', 'Danish'],
    'discovery@aipify.ai',
    1
  )
on conflict (advisor_key) do nothing;

create or replace function public._demo460_default_advisor_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.marketing_demo_advisors
  where is_active = true
  order by sort_order, display_name
  limit 1;
$$;

create or replace function public.get_book_demo_discovery_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_advisor public.marketing_demo_advisors;
begin
  select * into v_advisor
  from public.marketing_demo_advisors
  where is_active = true
  order by sort_order, display_name
  limit 1;

  return jsonb_build_object(
    'found', v_advisor.id is not null,
    'advisor', case when v_advisor.id is null then null else jsonb_build_object(
      'id', v_advisor.id,
      'display_name', v_advisor.display_name,
      'role_title', v_advisor.role_title,
      'availability_status', v_advisor.availability_status,
      'availability_note', v_advisor.availability_note,
      'languages', to_jsonb(v_advisor.languages),
      'contact_email', v_advisor.contact_email,
      'contact_phone', v_advisor.contact_phone
    ) end,
    'pipeline_stages', jsonb_build_array(
      jsonb_build_object('key', 'demo_requested', 'status_key', 'waiting', 'label', 'Demo Requested'),
      jsonb_build_object('key', 'discovery_scheduled', 'status_key', 'waiting', 'label', 'Discovery Scheduled'),
      jsonb_build_object('key', 'demo_completed', 'status_key', 'information', 'label', 'Demo Completed'),
      jsonb_build_object('key', 'follow_up_required', 'status_key', 'requires_attention', 'label', 'Follow-Up Required'),
      jsonb_build_object('key', 'qualified_opportunity', 'status_key', 'verified', 'label', 'Qualified Opportunity'),
      jsonb_build_object('key', 'customer_activated', 'status_key', 'completed', 'label', 'Customer Activated')
    ),
    'governance_note', 'Every submission stores submission date, lead source, assigned advisor, activity log, and audit trail. Platform operators review opportunities — no cross-tenant customer data in public demo records.',
    'privacy_note', 'Business contact metadata only — never store passwords or unrelated PII.'
  );
end; $$;

create or replace function public.submit_book_demo_request(
  p_first_name text,
  p_last_name text,
  p_company_name text,
  p_job_title text default '',
  p_business_email text default '',
  p_phone text default '',
  p_country text default '',
  p_company_size text default '',
  p_industry text default '',
  p_current_challenge text default '',
  p_additional_notes text default '',
  p_meeting_type text default 'no_preference',
  p_lead_source text default 'book_demo'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_lead_id uuid;
  v_opp_id uuid;
  v_advisor_id uuid;
  v_email text;
begin
  v_email := lower(trim(coalesce(p_business_email, '')));
  if coalesce(trim(p_first_name), '') = '' or coalesce(trim(p_last_name), '') = '' then
    raise exception 'First and last name are required';
  end if;
  if coalesce(trim(p_company_name), '') = '' then
    raise exception 'Company name is required';
  end if;
  if v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'Valid business email is required';
  end if;

  v_advisor_id := public._demo460_default_advisor_id();

  insert into public.marketing_demo_leads (
    first_name, last_name, company_name, job_title, business_email, phone, country,
    company_size, industry, current_challenge, additional_notes, meeting_type, lead_source
  ) values (
    left(trim(p_first_name), 80),
    left(trim(p_last_name), 80),
    left(trim(p_company_name), 200),
    left(trim(coalesce(p_job_title, '')), 120),
    left(v_email, 254),
    left(trim(coalesce(p_phone, '')), 40),
    left(trim(coalesce(p_country, '')), 80),
    left(trim(coalesce(p_company_size, '')), 40),
    left(trim(coalesce(p_industry, '')), 80),
    left(trim(coalesce(p_current_challenge, '')), 80),
    left(trim(coalesce(p_additional_notes, '')), 2000),
    coalesce(nullif(trim(p_meeting_type), ''), 'no_preference'),
    left(trim(coalesce(p_lead_source, 'book_demo')), 40)
  ) returning id into v_lead_id;

  insert into public.marketing_demo_opportunities (lead_id, pipeline_stage, assigned_advisor_id)
  values (v_lead_id, 'discovery_scheduled', v_advisor_id)
  returning id into v_opp_id;

  insert into public.marketing_demo_activity_log
    (lead_id, opportunity_id, activity_key, activity_type, summary, metadata)
  values
    (v_lead_id, v_opp_id, 'demo-submitted', 'submission',
     'Demo request submitted via Book Demo & Discovery Center.',
     jsonb_build_object('lead_source', left(trim(coalesce(p_lead_source, 'book_demo')), 40), 'meeting_type', coalesce(nullif(trim(p_meeting_type), ''), 'no_preference'))),
    (v_lead_id, v_opp_id, 'pipeline-discovery-scheduled', 'pipeline_change',
     'Sales pipeline stage set to Discovery Scheduled.',
     jsonb_build_object('pipeline_stage', 'discovery_scheduled')),
    (v_lead_id, v_opp_id, 'confirmation-queued', 'confirmation',
     'Confirmation email queued for discovery advisor follow-up.',
     jsonb_build_object('confirmation_status', 'queued', 'calendar_booking', 'optional_future'));

  return jsonb_build_object(
    'ok', true,
    'lead_id', v_lead_id,
    'opportunity_id', v_opp_id,
    'pipeline_stage', 'discovery_scheduled',
    'pipeline_stage_label', 'Discovery Scheduled',
    'assigned_advisor_id', v_advisor_id,
    'confirmation_sent', false,
    'confirmation_note', 'Your discovery conversation is scheduled. A member of the Aipify team will confirm your meeting shortly.'
  );
end; $$;

grant execute on function public.get_book_demo_discovery_center() to anon, authenticated;
grant execute on function public.submit_book_demo_request(text, text, text, text, text, text, text, text, text, text, text, text, text) to anon, authenticated;
