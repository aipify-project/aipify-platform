-- Public Website & Interactive Product Story Engine — Phase A.69
-- Tenant-agnostic early access leads (metadata only)

create table if not exists public.marketing_early_access_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  company_size text,
  industry text,
  interest_area text,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists marketing_early_access_leads_created_at_idx
  on public.marketing_early_access_leads (created_at desc);

alter table public.marketing_early_access_leads enable row level security;

revoke all on public.marketing_early_access_leads from authenticated, anon;

create or replace function public.submit_marketing_early_access_lead(
  p_name text,
  p_company text,
  p_email text,
  p_company_size text default null,
  p_industry text default null,
  p_interest_area text default null,
  p_message text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'name is required';
  end if;
  if p_company is null or length(trim(p_company)) = 0 then
    raise exception 'company is required';
  end if;
  if p_email is null or p_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'valid email is required';
  end if;

  insert into public.marketing_early_access_leads (
    name, company, email, company_size, industry, interest_area, message
  )
  values (
    left(trim(p_name), 120),
    left(trim(p_company), 200),
    lower(left(trim(p_email), 254)),
    nullif(left(trim(coalesce(p_company_size, '')), 40), ''),
    nullif(left(trim(coalesce(p_industry, '')), 120), ''),
    nullif(left(trim(coalesce(p_interest_area, '')), 80), ''),
    nullif(left(trim(coalesce(p_message, '')), 2000), '')
  )
  returning id into v_id;

  return json_build_object('ok', true, 'id', v_id);
end;
$$;

revoke all on function public.submit_marketing_early_access_lead(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_marketing_early_access_lead(text, text, text, text, text, text, text) to anon, authenticated;

comment on table public.marketing_early_access_leads is
  'Phase A.69 — public marketing early access leads. Tenant-agnostic. No spam resale.';
