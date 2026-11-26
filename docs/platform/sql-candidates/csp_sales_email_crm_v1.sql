-- PREPARED_ONLY — CSP sales marketing email + inbound CRM V1
-- Do NOT apply from this job. Owner Staging approval required, then separate Production approval.
-- Canonical content hash (see sibling .sha256 file; exclude these SHA comment lines when hashing):
-- ed24863a72400676eedf7aa4c0431f80de4cc0f3a81e64fbe07f244a04ac8091

-- Outbound sends (Aipify internal sellers only in V1)
create table if not exists public.csp_marketing_email_sends (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null,
  product_key text not null,
  template_id text not null,
  template_version int not null,
  marketing_locale text not null,
  recipient_email_hash text not null,
  recipient_domain text not null,
  referral_url text not null,
  conversation_token text not null unique,
  idempotency_key text not null,
  delivery_status text not null default 'draft'
    check (delivery_status in ('draft','queued','accepted_by_provider','delivered','bounced','failed')),
  provider_message_id text,
  consent_basis text not null default 'unverified'
    check (consent_basis in ('unverified','legitimate_interest_documented','prior_customer','explicit_opt_in')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_id, idempotency_key)
);

create index if not exists csp_marketing_email_sends_partner_created_idx
  on public.csp_marketing_email_sends (partner_id, created_at desc);

-- Inbound events (quarantine when correlation fails)
create table if not exists public.csp_marketing_email_inbound_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text not null unique,
  event_type text not null,
  disposition text not null
    check (disposition in ('create_or_attach_lead','transport_event_only','quarantine_manual_review','ignore_duplicate')),
  outbound_send_id uuid references public.csp_marketing_email_sends(id),
  partner_id uuid,
  product_key text,
  non_human boolean not null default false,
  created_at timestamptz not null default now()
);

-- CRM lead status for email channel (server model; no invented UI without this)
create table if not exists public.csp_email_crm_leads (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null,
  product_key text not null,
  outbound_send_id uuid references public.csp_marketing_email_sends(id),
  contact_email_hash text not null,
  status text not null default 'new_inquiry'
    check (status in ('new_inquiry','contacted','interested','meeting_scheduled','offer_sent','converted','closed')),
  last_inbound_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_id, product_key, contact_email_hash)
);

revoke all on public.csp_marketing_email_sends from public, anon, authenticated;
revoke all on public.csp_marketing_email_inbound_events from public, anon, authenticated;
revoke all on public.csp_email_crm_leads from public, anon, authenticated;

-- RPCs intentionally omitted until Staging design review:
-- csp_create_marketing_email_send, csp_record_inbound_email_event, csp_list_email_crm_leads
-- Must be security definer with partner/tenant checks; no client-supplied partner_id trust.
