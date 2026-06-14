-- Phase 40 — Autonomous Support Operations (ASO)
-- Intelligent support operator: triage, confidence, autonomy levels, audit transparency.

-- ---------------------------------------------------------------------------
-- 1. aso_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aso_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  autonomy_level integer not null default 1 check (autonomy_level between 0 and 3),
  proactive_support_enabled boolean not null default true,
  knowledge_gap_detection_enabled boolean not null default true,
  self_healing_enabled boolean not null default true,
  human_collaboration_mode boolean not null default true,
  channels_enabled jsonb not null default '{
    "email": true,
    "chat": true,
    "ticket": true,
    "mobile": false
  }'::jsonb,
  confidence_auto_reply_threshold integer not null default 90 check (
    confidence_auto_reply_threshold between 50 and 100
  ),
  confidence_draft_threshold integer not null default 70 check (
    confidence_draft_threshold between 30 and 100
  ),
  privacy_settings jsonb not null default '{
    "store_case_content": true,
    "share_performance_aggregates": false
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aso_settings enable row level security;
revoke all on public.aso_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. support_categories (classification config per tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.support_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  risk_level text not null default 'low' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  automation_level integer not null default 1 check (automation_level between 0 and 3),
  approval_required boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, name)
);

alter table public.support_categories enable row level security;
revoke all on public.support_categories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. support_cases
-- ---------------------------------------------------------------------------
-- Phase 7 metrics used customer_id; ASO phase 40 needs tenant_id + triage fields.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'support_cases' and column_name = 'customer_id'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'support_cases' and column_name = 'tenant_id'
  ) then
    alter table public.support_cases rename to support_cases_phase7_legacy;
  end if;
end $$;

create table if not exists public.support_cases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  channel text not null default 'email' check (
    channel in ('email', 'chat', 'ticket', 'mobile', 'other')
  ),
  subject text not null default '',
  body text not null default '',
  customer_name text,
  language text not null default 'en',
  category text,
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  confidence_band text not null default 'escalate' check (
    confidence_band in ('autonomous', 'draft', 'review', 'escalate')
  ),
  status text not null default 'received' check (
    status in (
      'received', 'triaged', 'draft', 'pending_approval',
      'auto_replied', 'escalated', 'resolved', 'closed'
    )
  ),
  triage_action text,
  escalation_reason text,
  case_summary text,
  draft_id uuid references public.business_email_drafts (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_cases_tenant_status_idx
  on public.support_cases (tenant_id, status, created_at desc);

alter table public.support_cases enable row level security;
revoke all on public.support_cases from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. support_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.support_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  case_id uuid references public.support_cases (id) on delete set null,
  event_type text not null,
  performed_by text not null default 'system',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists support_audit_logs_tenant_idx
  on public.support_audit_logs (tenant_id, created_at desc);

alter table public.support_audit_logs enable row level security;
revoke all on public.support_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. support_knowledge_gaps
-- ---------------------------------------------------------------------------
create table if not exists public.support_knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null,
  occurrence_count integer not null default 1,
  sample_question text not null default '',
  status text not null default 'open' check (
    status in ('open', 'suggested', 'resolved', 'dismissed')
  ),
  suggestion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_knowledge_gaps enable row level security;
revoke all on public.support_knowledge_gaps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. support_proactive_alerts
-- ---------------------------------------------------------------------------
create table if not exists public.support_proactive_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alert_type text not null,
  title text not null,
  message text not null,
  status text not null default 'pending' check (
    status in ('pending', 'sent', 'dismissed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.support_proactive_alerts enable row level security;
revoke all on public.support_proactive_alerts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public.record_support_audit_event(
  p_tenant_id uuid,
  p_case_id uuid,
  p_event_type text,
  p_performed_by text default 'system',
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.support_audit_logs (
    tenant_id, case_id, event_type, performed_by, details
  )
  values (p_tenant_id, p_case_id, p_event_type, p_performed_by, p_details)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.assess_support_risk(p_category text, p_subject text, p_body text)
returns text
language plpgsql
immutable
as $$
declare
  v_text text := lower(coalesce(p_subject, '') || ' ' || coalesce(p_body, ''));
begin
  if v_text ~ '(threat|lawsuit|regulator|breach|data leak|fraud)' then return 'critical'; end if;
  if v_text ~ '(lawyer|legal|chargeback|sue|complaint|angry)' then return 'high'; end if;
  if p_category in ('complaint', 'refund', 'payment', 'account') then return 'medium'; end if;
  if p_category in ('delivery', 'booking', 'verification', 'general') then return 'low'; end if;
  return 'medium';
end;
$$;

create or replace function public.confidence_to_band(p_score integer)
returns text
language plpgsql
immutable
as $$
begin
  if p_score >= 90 then return 'autonomous'; end if;
  if p_score >= 70 then return 'draft'; end if;
  if p_score >= 50 then return 'review'; end if;
  return 'escalate';
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. ensure_aso_settings + default categories
-- ---------------------------------------------------------------------------
create or replace function public.ensure_aso_settings(p_tenant_id uuid)
returns public.aso_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.aso_settings;
begin
  insert into public.aso_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row from public.aso_settings where tenant_id = p_tenant_id;

  if not exists (select 1 from public.support_categories where tenant_id = p_tenant_id limit 1) then
    insert into public.support_categories (tenant_id, name, risk_level, automation_level, approval_required)
    values
      (p_tenant_id, 'delivery', 'low', 2, false),
      (p_tenant_id, 'general', 'low', 2, false),
      (p_tenant_id, 'booking', 'low', 2, true),
      (p_tenant_id, 'verification', 'medium', 1, true),
      (p_tenant_id, 'account', 'medium', 1, true),
      (p_tenant_id, 'subscription', 'medium', 1, true),
      (p_tenant_id, 'technical', 'medium', 1, true),
      (p_tenant_id, 'refund', 'medium', 1, true),
      (p_tenant_id, 'payment', 'high', 0, true),
      (p_tenant_id, 'complaint', 'high', 0, true),
      (p_tenant_id, 'legal', 'critical', 0, true),
      (p_tenant_id, 'security', 'critical', 0, true);
  end if;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. update_aso_settings
-- ---------------------------------------------------------------------------
create or replace function public.update_aso_settings(
  p_autonomy_level integer default null,
  p_proactive_support_enabled boolean default null,
  p_knowledge_gap_detection_enabled boolean default null,
  p_self_healing_enabled boolean default null,
  p_human_collaboration_mode boolean default null,
  p_channels_enabled jsonb default null,
  p_confidence_auto_reply_threshold integer default null,
  p_confidence_draft_threshold integer default null,
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

  perform public.ensure_aso_settings(v_tenant_id);

  update public.aso_settings
  set
    autonomy_level = coalesce(p_autonomy_level, autonomy_level),
    proactive_support_enabled = coalesce(p_proactive_support_enabled, proactive_support_enabled),
    knowledge_gap_detection_enabled = coalesce(p_knowledge_gap_detection_enabled, knowledge_gap_detection_enabled),
    self_healing_enabled = coalesce(p_self_healing_enabled, self_healing_enabled),
    human_collaboration_mode = coalesce(p_human_collaboration_mode, human_collaboration_mode),
    channels_enabled = coalesce(p_channels_enabled, channels_enabled),
    confidence_auto_reply_threshold = coalesce(p_confidence_auto_reply_threshold, confidence_auto_reply_threshold),
    confidence_draft_threshold = coalesce(p_confidence_draft_threshold, confidence_draft_threshold),
    privacy_settings = coalesce(p_privacy_settings, privacy_settings),
    updated_at = now()
  where tenant_id = v_tenant_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. detect_support_knowledge_gap
-- ---------------------------------------------------------------------------
create or replace function public.detect_support_knowledge_gap(
  p_tenant_id uuid,
  p_category text,
  p_question text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_has_knowledge boolean;
  v_settings public.aso_settings;
begin
  select * into v_settings from public.aso_settings where tenant_id = p_tenant_id;
  if not coalesce(v_settings.knowledge_gap_detection_enabled, true) then return; end if;

  select exists (
    select 1 from public.support_knowledge_items
    where tenant_id = p_tenant_id and category = p_category and approved
  ) into v_has_knowledge;

  if v_has_knowledge then return; end if;

  if exists (
    select 1 from public.support_knowledge_gaps
    where tenant_id = p_tenant_id and category = p_category and status = 'open'
  ) then
    update public.support_knowledge_gaps
    set occurrence_count = occurrence_count + 1,
        sample_question = left(p_question, 200),
        updated_at = now()
    where tenant_id = p_tenant_id and category = p_category and status = 'open';
  else
    insert into public.support_knowledge_gaps (tenant_id, category, sample_question, suggestion)
    values (
      p_tenant_id, p_category, left(p_question, 200),
      format('Customers frequently ask about %s. Would you like me to generate a help article draft?', p_category)
    );
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 11. summarize_support_case
-- ---------------------------------------------------------------------------
create or replace function public.summarize_support_case(p_case_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_case public.support_cases;
  v_summary text;
begin
  select * into v_case from public.support_cases where id = p_case_id;
  if v_case.id is null then return ''; end if;

  v_summary := format(
    E'Customer Issue:\n%s\n\nCategory: %s | Risk: %s | Confidence: %s%%\n\nRecommended Action: %s',
    coalesce(nullif(v_case.subject, ''), left(v_case.body, 120)),
    coalesce(v_case.category, 'unknown'),
    v_case.risk_level,
    v_case.confidence_score,
    coalesce(v_case.triage_action, 'Review required')
  );

  update public.support_cases set case_summary = v_summary, updated_at = now() where id = p_case_id;
  return v_summary;
end;
$$;

-- ---------------------------------------------------------------------------
-- 12. triage_support_case — core triage engine
-- ---------------------------------------------------------------------------
create or replace function public.triage_support_case(
  p_subject text,
  p_body text,
  p_channel text default 'email',
  p_customer_name text default null,
  p_language text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aso_settings;
  v_category text;
  v_cat_config public.support_categories;
  v_risk text;
  v_analysis jsonb;
  v_confidence integer;
  v_band text;
  v_action text;
  v_case_id uuid;
  v_draft_result jsonb;
  v_draft_id uuid;
  v_escalate boolean := false;
  v_escalation_reason text;
  v_status text := 'triaged';
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  perform public.ensure_business_dna_profile(v_tenant_id);
  v_settings := public.ensure_aso_settings(v_tenant_id);

  v_category := public.classify_support_email_intent(p_subject, p_body);
  v_risk := public.assess_support_risk(v_category, p_subject, p_body);

  select * into v_cat_config
  from public.support_categories
  where tenant_id = v_tenant_id and name = v_category and active
  limit 1;

  if v_cat_config.id is null then
    select * into v_cat_config
    from public.support_categories
    where tenant_id = v_tenant_id and name = 'general' and active
    limit 1;
  end if;

  v_analysis := public.analyze_support_email(p_subject, p_body, p_language);
  v_confidence := coalesce((v_analysis ->> 'confidence_score')::integer, 30);
  v_band := public.confidence_to_band(v_confidence);

  if (v_analysis ->> 'escalate')::boolean or v_risk in ('high', 'critical') then
    v_escalate := true;
    v_escalation_reason := coalesce(v_analysis ->> 'escalation_reason', 'High risk category');
  end if;

  if v_confidence < 50 then
    v_escalate := true;
    v_escalation_reason := coalesce(v_escalation_reason, 'Confidence below 50%');
  end if;

  if v_cat_config.automation_level > v_settings.autonomy_level then
    v_escalate := true;
    v_escalation_reason := coalesce(v_escalation_reason, 'Category exceeds tenant autonomy level');
  end if;

  if v_escalate then
    v_action := 'escalate_to_human';
    v_status := 'escalated';
  elsif v_settings.autonomy_level = 0 then
    v_action := 'generate_draft';
    v_status := 'draft';
  elsif v_settings.autonomy_level = 1 then
    v_action := 'generate_draft';
    v_status := 'pending_approval';
  elsif v_band = 'autonomous'
    and v_confidence >= v_settings.confidence_auto_reply_threshold
    and v_risk = 'low'
    and v_settings.autonomy_level >= 2
    and not coalesce(v_cat_config.approval_required, true) then
    v_action := 'reply_automatically';
    v_status := 'auto_replied';
  elsif v_band in ('autonomous', 'draft')
    and v_confidence >= v_settings.confidence_draft_threshold
    and v_settings.autonomy_level >= 2 then
    v_action := 'generate_draft';
    v_status := case when v_settings.autonomy_level >= 3 then 'draft' else 'pending_approval' end;
  else
    v_action := 'human_review';
    v_status := 'pending_approval';
  end if;

  insert into public.support_cases (
    tenant_id, channel, subject, body, customer_name, language,
    category, risk_level, confidence_score, confidence_band,
    status, triage_action, escalation_reason
  )
  values (
    v_tenant_id, coalesce(p_channel, 'email'), p_subject, p_body, p_customer_name,
    coalesce(v_analysis ->> 'language', 'en'),
    v_category, v_risk, v_confidence, v_band,
    v_status, v_action, v_escalation_reason
  )
  returning id into v_case_id;

  if v_action in ('generate_draft', 'reply_automatically', 'human_review') then
    v_draft_result := public.draft_support_email_response(
      p_subject, p_body, coalesce(p_customer_name, 'there'), '{}'::jsonb,
      coalesce(v_analysis ->> 'language', null)
    );
    v_draft_id := (v_draft_result ->> 'draft_id')::uuid;
    update public.support_cases set draft_id = v_draft_id where id = v_case_id;

    if v_action = 'reply_automatically' and v_draft_id is not null then
      begin
        perform public.approve_support_email_draft(v_draft_id);
        perform public.send_approved_support_email(v_draft_id);
        update public.support_cases
        set status = 'auto_replied', resolved_at = now()
        where id = v_case_id;
      exception when others then
        v_action := 'generate_draft';
        v_status := 'pending_approval';
        update public.support_cases
        set status = v_status, triage_action = v_action
        where id = v_case_id;
      end;
    end if;
  end if;

  perform public.detect_support_knowledge_gap(v_tenant_id, v_category, p_subject);

  perform public.record_support_audit_event(
    v_tenant_id, v_case_id, 'case_triaged', 'system',
    jsonb_build_object(
      'category', v_category, 'risk', v_risk, 'confidence', v_confidence,
      'action', v_action, 'autonomy_level', v_settings.autonomy_level
    )
  );

  return jsonb_build_object(
    'has_customer', true,
    'case_id', v_case_id,
    'category', v_category,
    'risk_level', v_risk,
    'confidence_score', v_confidence,
    'confidence_band', v_band,
    'triage_action', v_action,
    'status', v_status,
    'escalate', v_escalate,
    'escalation_reason', v_escalation_reason,
    'draft_id', v_draft_id,
    'case_summary', public.summarize_support_case(v_case_id),
    'analysis', v_analysis,
    'ethical_note', 'Aipify never hides uncertainty — escalation preserves human judgment.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 13. calculate_automation_readiness_score
-- ---------------------------------------------------------------------------
create or replace function public.calculate_automation_readiness_score(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_score integer := 0;
  v_bde_health jsonb;
  v_bde_score integer;
  v_categories integer;
  v_templates integer;
  v_resolved_auto integer;
  v_total_cases integer;
  v_level text;
  v_label text;
begin
  v_bde_health := public.calculate_business_dna_health(p_tenant_id);
  v_bde_score := coalesce((v_bde_health ->> 'health_score')::integer, 0);

  select count(*) into v_categories
  from public.support_categories where tenant_id = p_tenant_id and active;

  select count(*) into v_templates
  from public.business_email_templates where tenant_id = p_tenant_id and approved;

  select count(*) into v_total_cases from public.support_cases where tenant_id = p_tenant_id;
  select count(*) into v_resolved_auto
  from public.support_cases
  where tenant_id = p_tenant_id and status = 'auto_replied';

  v_score := least(100,
    (v_bde_score * 40 / 100) +
    (case when v_categories >= 8 then 15 when v_categories >= 4 then 8 else 0 end) +
    (case when v_templates >= 5 then 20 when v_templates >= 2 then 10 else 0 end) +
    (case when v_total_cases > 0 then least(25, (v_resolved_auto * 25 / greatest(v_total_cases, 1))) else 0 end)
  );

  v_level := case
    when v_score <= 25 then 'human_only'
    when v_score <= 50 then 'assisted'
    when v_score <= 75 then 'partial_automation'
    else 'trusted_operations'
  end;

  v_label := case v_level
    when 'human_only' then 'Human-only mode'
    when 'assisted' then 'Assisted support'
    when 'partial_automation' then 'Partial automation'
    else 'Trusted autonomous operations'
  end;

  return jsonb_build_object(
    'readiness_score', v_score,
    'level', v_level,
    'readiness_label', v_label,
    'factors', jsonb_build_object(
      'business_dna_health', v_bde_score,
      'support_categories', v_categories,
      'approved_templates', v_templates,
      'auto_resolution_rate', case when v_total_cases > 0
        then round((v_resolved_auto::numeric / v_total_cases) * 100) else 0 end
    ),
    'recommended_autonomy_level', case
      when v_score <= 25 then 0
      when v_score <= 50 then 1
      when v_score <= 75 then 2
      else 3
    end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 14. run_proactive_support_check
-- ---------------------------------------------------------------------------
create or replace function public.run_proactive_support_check()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aso_settings;
  v_gaps integer;
  v_inserted integer := 0;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();
  v_settings := public.ensure_aso_settings(v_tenant_id);

  if not v_settings.proactive_support_enabled then
    return jsonb_build_object('ran', false, 'message', 'Proactive support disabled');
  end if;

  select count(*) into v_gaps
  from public.support_knowledge_gaps
  where tenant_id = v_tenant_id and status = 'open' and occurrence_count >= 3;

  if v_gaps > 0 and not exists (
    select 1 from public.support_proactive_alerts
    where tenant_id = v_tenant_id and alert_type = 'knowledge_gap' and status = 'pending'
  ) then
    insert into public.support_proactive_alerts (tenant_id, alert_type, title, message)
    values (
      v_tenant_id, 'knowledge_gap',
      format('%s recurring knowledge gaps detected', v_gaps),
      'Customers frequently ask questions without approved knowledge. Review Business DNA to add articles or templates.'
    );
    v_inserted := v_inserted + 1;
  end if;

  return jsonb_build_object('ran', true, 'alerts_created', v_inserted);
end;
$$;

-- ---------------------------------------------------------------------------
-- 15. get_customer_support_operations_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_support_operations_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_settings public.aso_settings;
  v_readiness jsonb;
  v_open integer;
  v_auto_month integer;
  v_escalated_month integer;
  v_total_month integer;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public.ensure_aso_settings(v_tenant_id);
  v_readiness := public.calculate_automation_readiness_score(v_tenant_id);

  select count(*) into v_open
  from public.support_cases
  where tenant_id = v_tenant_id and status not in ('resolved', 'closed', 'auto_replied');

  select count(*) into v_total_month
  from public.support_cases
  where tenant_id = v_tenant_id and created_at >= date_trunc('month', now());

  select count(*) into v_auto_month
  from public.support_cases
  where tenant_id = v_tenant_id and status = 'auto_replied'
    and created_at >= date_trunc('month', now());

  select count(*) into v_escalated_month
  from public.support_cases
  where tenant_id = v_tenant_id and status = 'escalated'
    and created_at >= date_trunc('month', now());

  return jsonb_build_object(
    'has_customer', true,
    'settings', jsonb_build_object(
      'autonomy_level', v_settings.autonomy_level,
      'proactive_support_enabled', v_settings.proactive_support_enabled,
      'knowledge_gap_detection_enabled', v_settings.knowledge_gap_detection_enabled,
      'self_healing_enabled', v_settings.self_healing_enabled,
      'human_collaboration_mode', v_settings.human_collaboration_mode,
      'channels_enabled', v_settings.channels_enabled,
      'confidence_auto_reply_threshold', v_settings.confidence_auto_reply_threshold,
      'confidence_draft_threshold', v_settings.confidence_draft_threshold,
      'privacy_settings', v_settings.privacy_settings
    ),
    'autonomy_levels', jsonb_build_array(
      jsonb_build_object('level', 0, 'name', 'Human Only', 'description', 'Drafts and suggestions only'),
      jsonb_build_object('level', 1, 'name', 'Assisted Support', 'description', 'AI assistance, human approval'),
      jsonb_build_object('level', 2, 'name', 'Supervised Automation', 'description', 'Low-risk auto-replies with oversight'),
      jsonb_build_object('level', 3, 'name', 'Trusted Operations', 'description', 'Approved categories managed autonomously')
    ),
    'readiness', v_readiness,
    'categories', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', c.id, 'name', c.name, 'risk_level', c.risk_level,
        'automation_level', c.automation_level, 'approval_required', c.approval_required
      ) order by c.name) from public.support_categories c where c.tenant_id = v_tenant_id and c.active),
      '[]'::jsonb
    ),
    'open_cases', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', sc.id, 'subject', sc.subject, 'category', sc.category,
        'risk_level', sc.risk_level, 'confidence_score', sc.confidence_score,
        'status', sc.status, 'triage_action', sc.triage_action, 'created_at', sc.created_at
      ) order by sc.created_at desc)
      from public.support_cases sc
      where sc.tenant_id = v_tenant_id and sc.status not in ('resolved', 'closed')
      limit 20),
      '[]'::jsonb
    ),
    'performance', jsonb_build_object(
      'open_cases', v_open,
      'cases_this_month', v_total_month,
      'auto_resolved_this_month', v_auto_month,
      'escalated_this_month', v_escalated_month,
      'automation_rate', case when v_total_month > 0
        then round((v_auto_month::numeric / v_total_month) * 100) else 0 end,
      'insights', coalesce(
        (select jsonb_agg(insight) from (
          select format(
            'Aipify resolved %s%% of cases autonomously this month.',
            case when v_total_month > 0 then round((v_auto_month::numeric / v_total_month) * 100) else 0 end
          ) as insight where v_total_month > 0
          union all
          select format('Escalations this month: %s', v_escalated_month)
          union all
          select format('Open cases requiring attention: %s', v_open) where v_open > 0
        ) sub),
        '[]'::jsonb
      )
    ),
    'knowledge_gaps', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', g.id, 'category', g.category, 'occurrence_count', g.occurrence_count,
        'sample_question', g.sample_question, 'suggestion', g.suggestion, 'status', g.status
      ) order by g.occurrence_count desc)
      from public.support_knowledge_gaps g
      where g.tenant_id = v_tenant_id and g.status = 'open' limit 10),
      '[]'::jsonb
    ),
    'proactive_alerts', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_type', a.alert_type, 'title', a.title, 'message', a.message, 'status', a.status
      ) order by a.created_at desc)
      from public.support_proactive_alerts a
      where a.tenant_id = v_tenant_id and a.status = 'pending' limit 5),
      '[]'::jsonb
    ),
    'approval_queue', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', sc.id, 'subject', sc.subject, 'category', sc.category,
        'confidence_score', sc.confidence_score, 'draft_id', sc.draft_id
      ) order by sc.created_at desc)
      from public.support_cases sc
      where sc.tenant_id = v_tenant_id and sc.status = 'pending_approval' limit 10),
      '[]'::jsonb
    ),
    'high_risk_cases', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', sc.id, 'subject', sc.subject, 'risk_level', sc.risk_level, 'status', sc.status
      ) order by sc.created_at desc)
      from public.support_cases sc
      where sc.tenant_id = v_tenant_id and sc.risk_level in ('high', 'critical')
        and sc.status not in ('resolved', 'closed') limit 10),
      '[]'::jsonb
    ),
    'audit_log', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', al.id, 'case_id', al.case_id, 'event_type', al.event_type,
        'performed_by', al.performed_by, 'created_at', al.created_at
      ) order by al.created_at desc)
      from public.support_audit_logs al where al.tenant_id = v_tenant_id limit 20),
      '[]'::jsonb
    ),
    'ethical_principles', jsonb_build_array(
      'Never hide uncertainty',
      'Escalate sensitive situations to humans',
      'Respect business policies from Business DNA',
      'Full audit transparency'
    ),
    'privacy_note', 'Support case data belongs to your business. Platform admins see aggregates only.',
    'integrations', jsonb_build_object(
      'business_dna', 'Templates, knowledge, tone, escalation rules',
      'trust_actions', 'Send and publish permissions',
      'learning_engine', 'Approved interaction patterns only'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 16. Platform overview
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_support_operations_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;

  return jsonb_build_object(
    'privacy_note', 'Administrators cannot access support case content. Aggregates only.',
    'aso_profiles', (select count(*) from public.aso_settings),
    'open_cases', (select count(*) from public.support_cases where status not in ('resolved', 'closed', 'auto_replied')),
    'auto_replied_total', (select count(*) from public.support_cases where status = 'auto_replied'),
    'escalated_total', (select count(*) from public.support_cases where status = 'escalated'),
    'knowledge_gaps_open', (select count(*) from public.support_knowledge_gaps where status = 'open'),
    'by_autonomy_level', coalesce(
      (select jsonb_object_agg(autonomy_level::text, cnt)
      from (select autonomy_level, count(*)::integer as cnt from public.aso_settings group by autonomy_level) sub),
      '{}'::jsonb
    )
  );
end;
$$;

grant execute on function public.record_support_audit_event(uuid, uuid, text, text, jsonb) to authenticated;
grant execute on function public.assess_support_risk(text, text, text) to authenticated;
grant execute on function public.confidence_to_band(integer) to authenticated;
grant execute on function public.ensure_aso_settings(uuid) to authenticated;
grant execute on function public.update_aso_settings(integer, boolean, boolean, boolean, boolean, jsonb, integer, integer, jsonb) to authenticated;
grant execute on function public.detect_support_knowledge_gap(uuid, text, text) to authenticated;
grant execute on function public.summarize_support_case(uuid) to authenticated;
grant execute on function public.triage_support_case(text, text, text, text, text) to authenticated;
grant execute on function public.calculate_automation_readiness_score(uuid) to authenticated;
grant execute on function public.run_proactive_support_check() to authenticated;
grant execute on function public.get_customer_support_operations_center() to authenticated;
grant execute on function public.get_platform_support_operations_overview() to authenticated;
