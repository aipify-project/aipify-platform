-- Phase 39 — Business DNA Engine (BDE)
-- Tenant-specific operational intelligence: products, workflows, templates, tone, escalation.

-- ---------------------------------------------------------------------------
-- 0. Admin gate helper
-- ---------------------------------------------------------------------------
create or replace function public._bde_require_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  select u.role into v_role from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_role not in ('owner', 'admin') then
    raise exception 'Owner or admin role required';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. business_dna_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.business_dna_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  company_name text not null default '',
  industry text not null default '',
  business_description text not null default '',
  primary_language text not null default 'en',
  supported_languages jsonb not null default '["en"]'::jsonb,
  tone_of_voice text not null default 'friendly_professional',
  support_style text not null default 'helpful_clear',
  risk_level text not null default 'balanced' check (
    risk_level in ('conservative', 'balanced', 'progressive')
  ),
  profile_status text not null default 'draft' check (
    profile_status in ('draft', 'pending_review', 'approved', 'active')
  ),
  approved_at timestamptz,
  approved_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_dna_profiles enable row level security;
revoke all on public.business_dna_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. bde_settings
-- ---------------------------------------------------------------------------
create table if not exists public.bde_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  human_review_mode boolean not null default true,
  automation_enabled boolean not null default false,
  high_confidence_auto_draft boolean not null default true,
  learn_from_approved_replies boolean not null default true,
  import_support_history boolean not null default false,
  connected_systems jsonb not null default '[]'::jsonb,
  email_channel_provider text,
  email_channel_status text not null default 'not_connected' check (
    email_channel_status in ('not_connected', 'pending', 'connected')
  ),
  fallback_language text not null default 'en',
  privacy_settings jsonb not null default '{
    "allow_website_scan": true,
    "allow_ticket_learning": false,
    "show_all_imported_knowledge": true
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bde_settings enable row level security;
revoke all on public.bde_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. business_products
-- ---------------------------------------------------------------------------
create table if not exists public.business_products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  description text not null default '',
  category text not null default 'general',
  price text,
  product_url text,
  metadata jsonb not null default '{}'::jsonb,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_products_tenant_idx
  on public.business_products (tenant_id, approved);

alter table public.business_products enable row level security;
revoke all on public.business_products from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. business_workflows
-- ---------------------------------------------------------------------------
create table if not exists public.business_workflows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  description text not null default '',
  trigger_event text not null default 'support_request',
  steps jsonb not null default '[]'::jsonb,
  approval_required boolean not null default true,
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_workflows enable row level security;
revoke all on public.business_workflows from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. support_knowledge_items
-- ---------------------------------------------------------------------------
create table if not exists public.support_knowledge_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null,
  question text not null,
  answer text not null,
  source text not null default 'manual',
  language text not null default 'en',
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_knowledge_tenant_cat_idx
  on public.support_knowledge_items (tenant_id, category, approved);

alter table public.support_knowledge_items enable row level security;
revoke all on public.support_knowledge_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. business_email_templates
-- ---------------------------------------------------------------------------
create table if not exists public.business_email_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  template_name text not null,
  category text not null,
  subject text not null,
  body text not null,
  language text not null default 'en',
  variables jsonb not null default '[]'::jsonb,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_email_templates_tenant_idx
  on public.business_email_templates (tenant_id, category, approved);

alter table public.business_email_templates enable row level security;
revoke all on public.business_email_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. business_tone_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.business_tone_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  tone_name text not null,
  description text not null default '',
  example_phrases jsonb not null default '[]'::jsonb,
  avoid_phrases jsonb not null default '[]'::jsonb,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_tone_profiles enable row level security;
revoke all on public.business_tone_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. business_escalation_rules
-- ---------------------------------------------------------------------------
create table if not exists public.business_escalation_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  rule_name text not null,
  condition text not null,
  risk_level text not null default 'high' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  escalate_to text not null default 'admin',
  approval_required boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_escalation_rules enable row level security;
revoke all on public.business_escalation_rules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. business_knowledge_sources — transparent imports
-- ---------------------------------------------------------------------------
create table if not exists public.business_knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_type text not null,
  source_label text not null,
  source_url text,
  status text not null default 'pending' check (
    status in ('pending', 'imported', 'rejected', 'failed')
  ),
  items_imported integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_knowledge_sources enable row level security;
revoke all on public.business_knowledge_sources from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. business_template_suggestions — learning loop
-- ---------------------------------------------------------------------------
create table if not exists public.business_template_suggestions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null,
  suggested_name text not null,
  subject text not null,
  body text not null,
  language text not null default 'en',
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'edited', 'rejected')
  ),
  source_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_template_suggestions enable row level security;
revoke all on public.business_template_suggestions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. business_email_drafts — human review mode
-- ---------------------------------------------------------------------------
create table if not exists public.business_email_drafts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null,
  subject text not null,
  body text not null,
  language text not null default 'en',
  confidence_score integer not null default 50 check (confidence_score between 0 and 100),
  confidence_level text not null default 'medium' check (
    confidence_level in ('low', 'medium', 'high')
  ),
  template_id uuid references public.business_email_templates (id) on delete set null,
  status text not null default 'draft' check (
    status in ('draft', 'approved', 'sent', 'rejected', 'escalated')
  ),
  escalation_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_email_drafts enable row level security;
revoke all on public.business_email_drafts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 12. business_dna_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.business_dna_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  actor_type text not null default 'user',
  actor_id text,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_dna_audit_tenant_idx
  on public.business_dna_audit_logs (tenant_id, created_at desc);

alter table public.business_dna_audit_logs enable row level security;
revoke all on public.business_dna_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 13. record_bde_audit_event
-- ---------------------------------------------------------------------------
create or replace function public.record_bde_audit_event(
  p_tenant_id uuid,
  p_event_type text,
  p_description text,
  p_actor_type text default 'user',
  p_actor_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_actor text;
begin
  v_actor := coalesce(p_actor_id, auth.uid()::text);
  insert into public.business_dna_audit_logs (
    tenant_id, event_type, actor_type, actor_id, description, metadata
  )
  values (
    p_tenant_id, p_event_type, p_actor_type, v_actor, p_description, p_metadata
  )
  returning id into v_id;
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. ensure_business_dna_profile + default escalation rules
-- ---------------------------------------------------------------------------
create or replace function public.ensure_business_dna_profile(p_tenant_id uuid)
returns public.business_dna_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.business_dna_profiles;
  v_company_name text;
begin
  select coalesce(c.company_name, '') into v_company_name
  from public.customers c where c.id = p_tenant_id;

  insert into public.business_dna_profiles (tenant_id, company_name)
  values (p_tenant_id, v_company_name)
  on conflict (tenant_id) do nothing;

  insert into public.bde_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_profile from public.business_dna_profiles where tenant_id = p_tenant_id;

  if not exists (
    select 1 from public.business_escalation_rules where tenant_id = p_tenant_id limit 1
  ) then
    insert into public.business_escalation_rules (tenant_id, rule_name, condition, risk_level, escalate_to)
    values
      (p_tenant_id, 'Refund above policy', 'refund_request exceeds policy threshold', 'high', 'admin'),
      (p_tenant_id, 'Angry customer', 'customer sentiment angry or abusive', 'high', 'support_lead'),
      (p_tenant_id, 'Legal mention', 'legal issue or lawyer mentioned', 'critical', 'admin'),
      (p_tenant_id, 'Payment dispute', 'payment dispute or chargeback mentioned', 'high', 'admin'),
      (p_tenant_id, 'Security issue', 'security breach or account compromise', 'critical', 'admin'),
      (p_tenant_id, 'Low confidence', 'no approved knowledge or uncertain answer', 'medium', 'human_review'),
      (p_tenant_id, 'Sensitive personal data', 'sensitive personal data in thread', 'critical', 'admin');
  end if;

  return v_profile;
end;
$$;

-- ---------------------------------------------------------------------------
-- 15. calculate_business_dna_health
-- ---------------------------------------------------------------------------
create or replace function public.calculate_business_dna_health(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_score integer := 0;
  v_templates integer;
  v_knowledge integer;
  v_workflows integer;
  v_escalation integer;
  v_products integer;
  v_profile public.business_dna_profiles;
  v_tone integer;
  v_level text;
  v_readiness text;
begin
  select count(*) into v_templates
  from public.business_email_templates where tenant_id = p_tenant_id and approved;
  select count(*) into v_knowledge
  from public.support_knowledge_items where tenant_id = p_tenant_id and approved;
  select count(*) into v_workflows
  from public.business_workflows where tenant_id = p_tenant_id and approved;
  select count(*) into v_escalation
  from public.business_escalation_rules where tenant_id = p_tenant_id and active;
  select count(*) into v_products
  from public.business_products where tenant_id = p_tenant_id and approved;
  select count(*) into v_tone
  from public.business_tone_profiles where tenant_id = p_tenant_id and approved;

  select * into v_profile from public.business_dna_profiles where tenant_id = p_tenant_id;

  v_score := least(100,
    (case when v_templates >= 5 then 20 when v_templates >= 1 then 10 else 0 end) +
    (case when v_knowledge >= 10 then 20 when v_knowledge >= 3 then 12 else 0 end) +
    (case when v_workflows >= 2 then 15 when v_workflows >= 1 then 8 else 0 end) +
    (case when v_escalation >= 5 then 15 else 8 end) +
    (case when v_products >= 1 then 10 else 0 end) +
    (case when v_tone >= 1 then 10 else 0 end) +
    (case when v_profile.profile_status in ('approved', 'active') then 10 else 0 end)
  );

  v_level := case
    when v_score <= 30 then 'not_ready'
    when v_score <= 60 then 'draft_only'
    when v_score <= 80 then 'partial_automation'
    else 'high_automation'
  end;

  v_readiness := case v_level
    when 'not_ready' then 'Not ready for automation'
    when 'draft_only' then 'Draft assistance only'
    when 'partial_automation' then 'Partial automation possible'
    else 'High-confidence automation possible'
  end;

  return jsonb_build_object(
    'health_score', v_score,
    'level', v_level,
    'readiness_label', v_readiness,
    'factors', jsonb_build_object(
      'approved_templates', v_templates,
      'approved_knowledge', v_knowledge,
      'approved_workflows', v_workflows,
      'escalation_rules', v_escalation,
      'approved_products', v_products,
      'tone_profiles', v_tone,
      'profile_approved', v_profile.profile_status in ('approved', 'active')
    ),
    'gaps', coalesce(
      (select jsonb_agg(gap) from (
        select 'Add approved email templates' as gap where v_templates < 3
        union all select 'Import support knowledge' where v_knowledge < 5
        union all select 'Define workflows' where v_workflows < 1
        union all select 'Approve Business DNA profile' where v_profile.profile_status not in ('approved', 'active')
        union all select 'Add tone of voice profile' where v_tone < 1
      ) sub),
      '[]'::jsonb
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 16. seed_business_dna_from_install
-- ---------------------------------------------------------------------------
create or replace function public.seed_business_dna_from_install()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_config jsonb;
  v_business_type text;
  v_discovery jsonb;
  v_imported integer := 0;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  perform public.ensure_business_dna_profile(v_tenant_id);

  select i.provisioning_config into v_config
  from public.installations i
  where i.customer_id = v_tenant_id
  order by i.created_at desc
  limit 1;

  if v_config is null then
    return jsonb_build_object('seeded', false, 'message', 'No installation config found');
  end if;

  v_discovery := coalesce(v_config -> 'discovery', v_config -> 'validation', '{}'::jsonb);
  v_business_type := coalesce(
    v_config -> 'validation' ->> 'confirmed_business_type',
    v_discovery ->> 'businessType',
    'unknown'
  );

  update public.business_dna_profiles
  set
    industry = v_business_type,
    business_description = coalesce(v_discovery ->> 'summary', business_description),
    updated_at = now()
  where tenant_id = v_tenant_id;

  if not exists (
    select 1 from public.business_knowledge_sources
    where tenant_id = v_tenant_id and source_type = 'install_engine'
  ) then
    insert into public.business_knowledge_sources (
      tenant_id, source_type, source_label, status, metadata
    )
    values (
      v_tenant_id, 'install_engine', 'Install Engine discovery',
      'imported',
      jsonb_build_object('business_type', v_business_type, 'discovery', v_discovery)
    );
    v_imported := v_imported + 1;
  end if;

  perform public.record_bde_audit_event(
    v_tenant_id, 'knowledge_imported',
    'Seeded Business DNA from Install Engine discovery',
    'system', null,
    jsonb_build_object('business_type', v_business_type)
  );

  return jsonb_build_object('seeded', true, 'business_type', v_business_type, 'sources_added', v_imported);
end;
$$;

-- ---------------------------------------------------------------------------
-- 17. update_business_dna_profile
-- ---------------------------------------------------------------------------
create or replace function public.update_business_dna_profile(
  p_company_name text default null,
  p_industry text default null,
  p_business_description text default null,
  p_primary_language text default null,
  p_supported_languages jsonb default null,
  p_tone_of_voice text default null,
  p_support_style text default null,
  p_risk_level text default null,
  p_profile_status text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  perform public.ensure_business_dna_profile(v_tenant_id);

  update public.business_dna_profiles
  set
    company_name = coalesce(p_company_name, company_name),
    industry = coalesce(p_industry, industry),
    business_description = coalesce(p_business_description, business_description),
    primary_language = coalesce(p_primary_language, primary_language),
    supported_languages = coalesce(p_supported_languages, supported_languages),
    tone_of_voice = coalesce(p_tone_of_voice, tone_of_voice),
    support_style = coalesce(p_support_style, support_style),
    risk_level = coalesce(p_risk_level, risk_level),
    profile_status = coalesce(p_profile_status, profile_status),
    approved_at = case when p_profile_status in ('approved', 'active') then now() else approved_at end,
    approved_by = case when p_profile_status in ('approved', 'active') then auth.uid()::text else approved_by end,
    updated_at = now()
  where tenant_id = v_tenant_id;

  perform public.record_bde_audit_event(
    v_tenant_id, 'profile_updated', 'Business DNA profile updated'
  );

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 18. update_bde_settings
-- ---------------------------------------------------------------------------
create or replace function public.update_bde_settings(
  p_human_review_mode boolean default null,
  p_automation_enabled boolean default null,
  p_high_confidence_auto_draft boolean default null,
  p_learn_from_approved_replies boolean default null,
  p_import_support_history boolean default null,
  p_connected_systems jsonb default null,
  p_email_channel_provider text default null,
  p_email_channel_status text default null,
  p_fallback_language text default null,
  p_privacy_settings jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  perform public.ensure_business_dna_profile(v_tenant_id);

  update public.bde_settings
  set
    human_review_mode = coalesce(p_human_review_mode, human_review_mode),
    automation_enabled = coalesce(p_automation_enabled, automation_enabled),
    high_confidence_auto_draft = coalesce(p_high_confidence_auto_draft, high_confidence_auto_draft),
    learn_from_approved_replies = coalesce(p_learn_from_approved_replies, learn_from_approved_replies),
    import_support_history = coalesce(p_import_support_history, import_support_history),
    connected_systems = coalesce(p_connected_systems, connected_systems),
    email_channel_provider = coalesce(p_email_channel_provider, email_channel_provider),
    email_channel_status = coalesce(p_email_channel_status, email_channel_status),
    fallback_language = coalesce(p_fallback_language, fallback_language),
    privacy_settings = coalesce(p_privacy_settings, privacy_settings),
    updated_at = now()
  where tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 19. CRUD helpers
-- ---------------------------------------------------------------------------
create or replace function public.create_support_knowledge_item(
  p_category text,
  p_question text,
  p_answer text,
  p_source text default 'manual',
  p_language text default 'en',
  p_approved boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  insert into public.support_knowledge_items (
    tenant_id, category, question, answer, source, language, approved
  )
  values (v_tenant_id, p_category, p_question, p_answer, p_source, p_language, p_approved)
  returning id into v_id;

  perform public.record_bde_audit_event(
    v_tenant_id, 'knowledge_created', format('Knowledge item: %s', p_category),
    'user', null, jsonb_build_object('id', v_id)
  );
  return v_id;
end;
$$;

create or replace function public.create_business_email_template(
  p_template_name text,
  p_category text,
  p_subject text,
  p_body text,
  p_language text default 'en',
  p_variables jsonb default '[]'::jsonb,
  p_approved boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  insert into public.business_email_templates (
    tenant_id, template_name, category, subject, body, language, variables, approved
  )
  values (v_tenant_id, p_template_name, p_category, p_subject, p_body, p_language, p_variables, p_approved)
  returning id into v_id;

  perform public.record_bde_audit_event(
    v_tenant_id, 'template_created', format('Template: %s', p_template_name),
    'user', null, jsonb_build_object('id', v_id)
  );
  return v_id;
end;
$$;

create or replace function public.approve_business_email_template(p_template_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  update public.business_email_templates
  set approved = true, updated_at = now()
  where id = p_template_id and tenant_id = v_tenant_id;

  perform public.record_bde_audit_event(
    v_tenant_id, 'template_approved', 'Email template approved',
    'user', null, jsonb_build_object('template_id', p_template_id)
  );
  return jsonb_build_object('approved', true);
end;
$$;

create or replace function public.create_business_workflow(
  p_name text,
  p_description text default '',
  p_trigger_event text default 'support_request',
  p_steps jsonb default '[]'::jsonb,
  p_approval_required boolean default true,
  p_risk_level text default 'medium'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  insert into public.business_workflows (
    tenant_id, name, description, trigger_event, steps, approval_required, risk_level
  )
  values (v_tenant_id, p_name, p_description, p_trigger_event, p_steps, p_approval_required, p_risk_level)
  returning id into v_id;

  perform public.record_bde_audit_event(v_tenant_id, 'workflow_created', p_name);
  return v_id;
end;
$$;

create or replace function public.create_business_escalation_rule(
  p_rule_name text,
  p_condition text,
  p_risk_level text default 'high',
  p_escalate_to text default 'admin',
  p_approval_required boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  insert into public.business_escalation_rules (
    tenant_id, rule_name, condition, risk_level, escalate_to, approval_required
  )
  values (v_tenant_id, p_rule_name, p_condition, p_risk_level, p_escalate_to, p_approval_required)
  returning id into v_id;

  perform public.record_bde_audit_event(v_tenant_id, 'escalation_rule_created', p_rule_name);
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 20. classify_support_email + draft_support_email_response
-- ---------------------------------------------------------------------------
create or replace function public.classify_support_email_intent(p_subject text, p_body text)
returns text
language plpgsql
immutable
as $$
declare
  v_text text := lower(coalesce(p_subject, '') || ' ' || coalesce(p_body, ''));
begin
  if v_text ~ '(order|tracking|delivery|shipped|where is my)' then return 'delivery'; end if;
  if v_text ~ '(refund|return|money back)' then return 'refund'; end if;
  if v_text ~ '(login|password|sign in|account)' then return 'account'; end if;
  if v_text ~ '(payment|invoice|billing|charge)' then return 'payment'; end if;
  if v_text ~ '(subscription|plan|cancel)' then return 'subscription'; end if;
  if v_text ~ '(book|appointment|reschedule|cancel)' then return 'booking'; end if;
  if v_text ~ '(verify|verification|approved)' then return 'verification'; end if;
  if v_text ~ '(complaint|angry|unacceptable|lawyer|legal)' then return 'complaint'; end if;
  if v_text ~ '(error|bug|not working|technical)' then return 'technical'; end if;
  return 'general';
end;
$$;

create or replace function public.analyze_support_email(
  p_subject text,
  p_body text,
  p_language text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_category text;
  v_template public.business_email_templates;
  v_knowledge public.support_knowledge_items;
  v_profile public.business_dna_profiles;
  v_settings public.bde_settings;
  v_confidence integer := 30;
  v_confidence_level text := 'low';
  v_escalate boolean := false;
  v_escalation_reason text;
  v_text text := lower(coalesce(p_subject, '') || ' ' || coalesce(p_body, ''));
  v_lang text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  perform public.ensure_business_dna_profile(v_tenant_id);
  select * into v_profile from public.business_dna_profiles where tenant_id = v_tenant_id;
  select * into v_settings from public.bde_settings where tenant_id = v_tenant_id;
  v_lang := coalesce(p_language, v_profile.primary_language, 'en');

  v_category := public.classify_support_email_intent(p_subject, p_body);

  if v_text ~ '(lawyer|legal|chargeback|sue)' then
    v_escalate := true;
    v_escalation_reason := 'Legal or payment dispute detected';
  elsif v_text ~ '(angry|unacceptable|terrible|worst)' then
    v_escalate := true;
    v_escalation_reason := 'Customer sentiment requires human review';
  elsif v_text ~ '(password|ssn|credit card)' then
    v_escalate := true;
    v_escalation_reason := 'Sensitive data mentioned';
  end if;

  select * into v_template
  from public.business_email_templates
  where tenant_id = v_tenant_id and category = v_category and approved
    and (language = v_lang or language = v_settings.fallback_language)
  order by case when language = v_lang then 0 else 1 end, created_at desc
  limit 1;

  select * into v_knowledge
  from public.support_knowledge_items
  where tenant_id = v_tenant_id and category = v_category and approved
  order by created_at desc
  limit 1;

  if v_template.id is not null then
    v_confidence := 85;
    v_confidence_level := 'high';
  elsif v_knowledge.id is not null then
    v_confidence := 60;
    v_confidence_level := 'medium';
  elsif v_profile.profile_status in ('approved', 'active') then
    v_confidence := 45;
    v_confidence_level := 'medium';
  else
    v_confidence := 25;
    v_confidence_level := 'low';
    v_escalate := coalesce(v_escalate, false) or true;
    v_escalation_reason := coalesce(v_escalation_reason, 'No approved template or knowledge');
  end if;

  perform public.record_bde_audit_event(
    v_tenant_id, 'email_analyzed', 'Support email analyzed',
    'user', null,
    jsonb_build_object('category', v_category, 'confidence', v_confidence_level)
  );

  return jsonb_build_object(
    'has_customer', true,
    'category', v_category,
    'language', v_lang,
    'confidence_score', v_confidence,
    'confidence_level', v_confidence_level,
    'template_found', v_template.id is not null,
    'template_id', v_template.id,
    'knowledge_found', v_knowledge.id is not null,
    'knowledge_id', v_knowledge.id,
    'escalate', v_escalate,
    'escalation_reason', v_escalation_reason,
    'human_review_required', v_settings.human_review_mode or v_escalate or v_confidence_level = 'low',
    'response_priority', case
      when v_template.id is not null then 'approved_template'
      when v_knowledge.id is not null then 'approved_knowledge'
      when v_profile.id is not null then 'business_tone'
      else 'professional_default'
    end
  );
end;
$$;

create or replace function public.draft_support_email_response(
  p_subject text,
  p_body text,
  p_customer_name text default 'there',
  p_variables jsonb default '{}'::jsonb,
  p_language text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_analysis jsonb;
  v_category text;
  v_template public.business_email_templates;
  v_knowledge public.support_knowledge_items;
  v_profile public.business_dna_profiles;
  v_settings public.bde_settings;
  v_draft_subject text;
  v_draft_body text;
  v_draft_id uuid;
  v_lang text;
  v_confidence_level text;
  v_confidence_score integer;
  v_status text := 'draft';
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  v_analysis := public.analyze_support_email(p_subject, p_body, p_language);
  v_category := v_analysis ->> 'category';
  v_confidence_level := v_analysis ->> 'confidence_level';
  v_confidence_score := (v_analysis ->> 'confidence_score')::integer;
  v_lang := v_analysis ->> 'language';

  select * into v_profile from public.business_dna_profiles where tenant_id = v_tenant_id;
  select * into v_settings from public.bde_settings where tenant_id = v_tenant_id;

  if (v_analysis ->> 'template_id') is not null then
    select * into v_template from public.business_email_templates
    where id = (v_analysis ->> 'template_id')::uuid;
    v_draft_subject := v_template.subject;
    v_draft_body := v_template.body;
  elsif (v_analysis ->> 'knowledge_id') is not null then
    select * into v_knowledge from public.support_knowledge_items
    where id = (v_analysis ->> 'knowledge_id')::uuid;
    v_draft_subject := coalesce(p_subject, 'Re: Your request');
    v_draft_body := v_knowledge.answer;
  else
    v_draft_subject := coalesce(p_subject, 'Thanks for reaching out');
    v_draft_body := format(
      'Hi %s, thanks for contacting %s. We received your message about %s and a team member will review it shortly.',
      p_customer_name,
      coalesce(nullif(v_profile.company_name, ''), 'us'),
      replace(v_category, '_', ' ')
    );
  end if;

  v_draft_body := replace(v_draft_body, '{{customer_name}}', p_customer_name);
  v_draft_body := replace(v_draft_body, '{{company_name}}', coalesce(v_profile.company_name, 'our team'));
  if p_variables is not null then
    v_draft_body := replace(v_draft_body, '{{order_number}}', coalesce(p_variables ->> 'order_number', ''));
    v_draft_body := replace(v_draft_body, '{{tracking_link}}', coalesce(p_variables ->> 'tracking_link', ''));
    v_draft_body := replace(v_draft_body, '{{product_name}}', coalesce(p_variables ->> 'product_name', ''));
  end if;

  if (v_analysis ->> 'escalate')::boolean then
    v_status := 'escalated';
  end if;

  insert into public.business_email_drafts (
    tenant_id, category, subject, body, language,
    confidence_score, confidence_level, template_id, status, escalation_reason, metadata
  )
  values (
    v_tenant_id, v_category, v_draft_subject, v_draft_body, v_lang,
    v_confidence_score, v_confidence_level, v_template.id, v_status,
    v_analysis ->> 'escalation_reason',
    jsonb_build_object('original_subject', p_subject, 'analysis', v_analysis)
  )
  returning id into v_draft_id;

  perform public.record_bde_audit_event(
    v_tenant_id, 'response_generated', 'Support email draft created',
    'user', null, jsonb_build_object('draft_id', v_draft_id, 'category', v_category)
  );

  return jsonb_build_object(
    'draft_id', v_draft_id,
    'subject', v_draft_subject,
    'body', v_draft_body,
    'category', v_category,
    'confidence_level', v_confidence_level,
    'confidence_score', v_confidence_score,
    'status', v_status,
    'human_review_required', (v_analysis ->> 'human_review_required')::boolean,
    'escalate', (v_analysis ->> 'escalate')::boolean
  );
end;
$$;

create or replace function public.send_approved_support_email(p_draft_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_draft public.business_email_drafts;
  v_settings public.bde_settings;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();

  select * into v_draft from public.business_email_drafts
  where id = p_draft_id and tenant_id = v_tenant_id;

  if v_draft.id is null then raise exception 'Draft not found'; end if;
  if v_draft.status = 'escalated' then raise exception 'Escalated drafts cannot be sent automatically'; end if;
  if v_draft.confidence_level = 'low' then raise exception 'Low confidence drafts require human edit before send'; end if;

  select * into v_settings from public.bde_settings where tenant_id = v_tenant_id;
  if v_settings.human_review_mode and v_draft.status <> 'approved' then
    raise exception 'Human review mode: approve draft before send';
  end if;

  update public.business_email_drafts
  set status = 'sent', updated_at = now()
  where id = p_draft_id;

  perform public.record_bde_audit_event(
    v_tenant_id, 'email_sent', 'Approved support email marked sent',
    'user', null, jsonb_build_object('draft_id', p_draft_id)
  );

  return jsonb_build_object('sent', true, 'draft_id', p_draft_id);
end;
$$;

create or replace function public.approve_support_email_draft(p_draft_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();

  update public.business_email_drafts
  set status = 'approved', updated_at = now()
  where id = p_draft_id and tenant_id = v_tenant_id and status in ('draft', 'escalated');

  perform public.record_bde_audit_event(
    v_tenant_id, 'response_approved', 'Support email draft approved'
  );

  return jsonb_build_object('approved', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 21. get_customer_business_dna_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_business_dna_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_profile public.business_dna_profiles;
  v_settings public.bde_settings;
  v_health jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_profile := public.ensure_business_dna_profile(v_tenant_id);
  select * into v_settings from public.bde_settings where tenant_id = v_tenant_id;
  v_health := public.calculate_business_dna_health(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'profile', jsonb_build_object(
      'id', v_profile.id,
      'company_name', v_profile.company_name,
      'industry', v_profile.industry,
      'business_description', v_profile.business_description,
      'primary_language', v_profile.primary_language,
      'supported_languages', v_profile.supported_languages,
      'tone_of_voice', v_profile.tone_of_voice,
      'support_style', v_profile.support_style,
      'risk_level', v_profile.risk_level,
      'profile_status', v_profile.profile_status,
      'approved_at', v_profile.approved_at
    ),
    'settings', jsonb_build_object(
      'human_review_mode', v_settings.human_review_mode,
      'automation_enabled', v_settings.automation_enabled,
      'high_confidence_auto_draft', v_settings.high_confidence_auto_draft,
      'learn_from_approved_replies', v_settings.learn_from_approved_replies,
      'import_support_history', v_settings.import_support_history,
      'connected_systems', v_settings.connected_systems,
      'email_channel_provider', v_settings.email_channel_provider,
      'email_channel_status', v_settings.email_channel_status,
      'fallback_language', v_settings.fallback_language,
      'privacy_settings', v_settings.privacy_settings
    ),
    'health', v_health,
    'products', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', p.id, 'name', p.name, 'description', p.description,
        'category', p.category, 'price', p.price, 'approved', p.approved
      ) order by p.name) from public.business_products p where p.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'workflows', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', w.id, 'name', w.name, 'description', w.description,
        'trigger_event', w.trigger_event, 'approval_required', w.approval_required,
        'risk_level', w.risk_level, 'approved', w.approved
      ) order by w.name) from public.business_workflows w where w.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'knowledge', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', k.id, 'category', k.category, 'question', k.question,
        'answer', k.answer, 'source', k.source, 'language', k.language, 'approved', k.approved
      ) order by k.category) from public.support_knowledge_items k where k.tenant_id = v_tenant_id limit 50),
      '[]'::jsonb
    ),
    'templates', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', t.id, 'template_name', t.template_name, 'category', t.category,
        'subject', t.subject, 'language', t.language, 'approved', t.approved
      ) order by t.category) from public.business_email_templates t where t.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'tone_profiles', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', tp.id, 'tone_name', tp.tone_name, 'description', tp.description,
        'example_phrases', tp.example_phrases, 'avoid_phrases', tp.avoid_phrases, 'approved', tp.approved
      )) from public.business_tone_profiles tp where tp.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'escalation_rules', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', e.id, 'rule_name', e.rule_name, 'condition', e.condition,
        'risk_level', e.risk_level, 'escalate_to', e.escalate_to, 'active', e.active
      ) order by e.risk_level desc) from public.business_escalation_rules e where e.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'knowledge_sources', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', s.id, 'source_type', s.source_type, 'source_label', s.source_label,
        'source_url', s.source_url, 'status', s.status, 'items_imported', s.items_imported
      ) order by s.created_at desc) from public.business_knowledge_sources s where s.tenant_id = v_tenant_id),
      '[]'::jsonb
    ),
    'template_suggestions', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', ts.id, 'category', ts.category, 'suggested_name', ts.suggested_name,
        'subject', ts.subject, 'status', ts.status, 'source_note', ts.source_note
      ) order by ts.created_at desc) from public.business_template_suggestions ts
      where ts.tenant_id = v_tenant_id and ts.status = 'pending' limit 10),
      '[]'::jsonb
    ),
    'automation_readiness', jsonb_build_object(
      'categories', coalesce(
        (select jsonb_agg(jsonb_build_object(
          'category', cat,
          'template_count', (select count(*) from public.business_email_templates t
            where t.tenant_id = v_tenant_id and t.category = cat and t.approved),
          'knowledge_count', (select count(*) from public.support_knowledge_items k
            where k.tenant_id = v_tenant_id and k.category = cat and k.approved),
          'automatable', exists (
            select 1 from public.business_email_templates t
            where t.tenant_id = v_tenant_id and t.category = cat and t.approved
          )
        ))
        from (select distinct category from public.support_knowledge_items where tenant_id = v_tenant_id
          union select distinct category from public.business_email_templates where tenant_id = v_tenant_id) cats(cat)),
        '[]'::jsonb
      )
    ),
    'recent_drafts', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', d.id, 'category', d.category, 'subject', d.subject,
        'confidence_level', d.confidence_level, 'status', d.status, 'created_at', d.created_at
      ) order by d.created_at desc) from public.business_email_drafts d
      where d.tenant_id = v_tenant_id limit 10),
      '[]'::jsonb
    ),
    'audit_log', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'event_type', a.event_type, 'description', a.description,
        'actor_type', a.actor_type, 'created_at', a.created_at
      ) order by a.created_at desc) from public.business_dna_audit_logs a
      where a.tenant_id = v_tenant_id limit 20),
      '[]'::jsonb
    ),
    'privacy_note', 'All imported knowledge is visible here. Aipify never learns from sensitive data without explicit approval.',
    'integrations', jsonb_build_object(
      'install_engine', 'Feeds discovery into Business DNA',
      'learning_engine', 'Learns from approved replies only',
      'trust_actions', 'Controls send, refund, and publish permissions',
      'decision_support', 'Uses Business DNA for operational recommendations'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 22. Platform overview
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_business_dna_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;

  return jsonb_build_object(
    'privacy_note', 'Administrators cannot access Business DNA content. Aggregates only.',
    'profiles', (select count(*) from public.business_dna_profiles),
    'active_profiles', (select count(*) from public.business_dna_profiles where profile_status = 'active'),
    'approved_templates', (select count(*) from public.business_email_templates where approved),
    'approved_knowledge', (select count(*) from public.support_knowledge_items where approved),
    'email_drafts', (select count(*) from public.business_email_drafts),
    'avg_health_score', coalesce(
      (select round(avg((public.calculate_business_dna_health(tenant_id) ->> 'health_score')::numeric))::integer
      from public.business_dna_profiles),
      0
    )
  );
end;
$$;

grant execute on function public._bde_require_admin() to authenticated;
grant execute on function public.record_bde_audit_event(uuid, text, text, text, text, jsonb) to authenticated;
grant execute on function public.ensure_business_dna_profile(uuid) to authenticated;
grant execute on function public.calculate_business_dna_health(uuid) to authenticated;
grant execute on function public.seed_business_dna_from_install() to authenticated;
grant execute on function public.update_business_dna_profile(text, text, text, text, jsonb, text, text, text, text) to authenticated;
grant execute on function public.update_bde_settings(boolean, boolean, boolean, boolean, boolean, jsonb, text, text, text, jsonb) to authenticated;
grant execute on function public.create_support_knowledge_item(text, text, text, text, text, boolean) to authenticated;
grant execute on function public.create_business_email_template(text, text, text, text, text, jsonb, boolean) to authenticated;
grant execute on function public.approve_business_email_template(uuid) to authenticated;
grant execute on function public.create_business_workflow(text, text, text, jsonb, boolean, text) to authenticated;
grant execute on function public.create_business_escalation_rule(text, text, text, text, boolean) to authenticated;
grant execute on function public.classify_support_email_intent(text, text) to authenticated;
grant execute on function public.analyze_support_email(text, text, text) to authenticated;
grant execute on function public.draft_support_email_response(text, text, text, jsonb, text) to authenticated;
grant execute on function public.send_approved_support_email(uuid) to authenticated;
grant execute on function public.approve_support_email_draft(uuid) to authenticated;
grant execute on function public.get_customer_business_dna_center() to authenticated;
grant execute on function public.get_platform_business_dna_overview() to authenticated;
