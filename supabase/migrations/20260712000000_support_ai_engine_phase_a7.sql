-- Phase A.7 — Support AI Engine
-- Principle: faster, accurate, scalable customer support with AI assistance and human oversight.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_support_cases
-- ---------------------------------------------------------------------------
create table if not exists public.organization_support_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_number text not null,
  subject text not null,
  customer_identifier text,
  channel text not null default 'admin_inbox' check (
    channel in ('support_widget', 'admin_inbox', 'email_support', 'live_chat', 'social_media', 'messaging')
  ),
  status text not null default 'new' check (
    status in ('new', 'open', 'waiting_for_customer', 'waiting_for_internal', 'resolved', 'closed')
  ),
  priority text not null default 'medium' check (
    priority in ('low', 'medium', 'high', 'urgent')
  ),
  assigned_to uuid references public.users (id) on delete set null,
  ai_summary text,
  first_response_at timestamptz,
  resolved_at timestamptz,
  escalated_at timestamptz,
  escalation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, case_number)
);

create index if not exists organization_support_cases_org_status_idx
  on public.organization_support_cases (organization_id, status, priority, created_at desc);

alter table public.organization_support_cases enable row level security;
revoke all on public.organization_support_cases from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. support_ai_responses
-- ---------------------------------------------------------------------------
create table if not exists public.support_ai_responses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null references public.organization_support_cases (id) on delete cascade,
  response_mode text not null default 'draft' check (
    response_mode in ('automatic', 'draft', 'manual')
  ),
  content text not null,
  confidence_score numeric(4, 2) default 0,
  knowledge_sources jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'sent', 'rejected', 'escalated')
  ),
  approved_by uuid references public.users (id) on delete set null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists support_ai_responses_case_idx
  on public.support_ai_responses (case_id, status, created_at desc);

alter table public.support_ai_responses enable row level security;
revoke all on public.support_ai_responses from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. support_ai_settings
-- ---------------------------------------------------------------------------
create table if not exists public.support_ai_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  default_response_mode text not null default 'draft' check (
    default_response_mode in ('automatic', 'draft', 'manual')
  ),
  auto_faq_enabled boolean not null default true,
  escalation_confidence_threshold numeric(4, 2) not null default 0.65,
  channels_enabled jsonb not null default '["support_widget","admin_inbox","email_support"]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_ai_settings enable row level security;
revoke all on public.support_ai_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. support_case_satisfaction
-- ---------------------------------------------------------------------------
create table if not exists public.support_case_satisfaction (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null references public.organization_support_cases (id) on delete cascade,
  rating text not null check (rating in ('positive', 'neutral', 'negative')),
  comment text,
  created_at timestamptz not null default now(),
  unique (case_id)
);

alter table public.support_case_satisfaction enable row level security;
revoke all on public.support_case_satisfaction from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. support_ai_knowledge_gaps
-- ---------------------------------------------------------------------------
create table if not exists public.support_ai_knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  question text not null,
  occurrence_count int not null default 1,
  gap_type text not null default 'missing_faq' check (
    gap_type in ('unanswered_question', 'missing_faq', 'outdated_article', 'documentation_gap')
  ),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  suggested_article_title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_ai_knowledge_gaps enable row level security;
revoke all on public.support_ai_knowledge_gaps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'support_ai', v.description
from (values
  ('support.assign', 'Assign Support Cases', 'Assign support cases to team members'),
  ('support.close', 'Close Support Cases', 'Close and resolve support cases'),
  ('support.view_metrics', 'View Support Metrics', 'View support performance metrics')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'support.assign'), ('owner', 'support.close'), ('owner', 'support.view_metrics'),
  ('administrator', 'support.assign'), ('administrator', 'support.close'), ('administrator', 'support.view_metrics'),
  ('manager', 'support.assign'), ('manager', 'support.view_metrics'),
  ('support_agent', 'support.assign')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_sai_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._sai_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'support_case',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb,
  p_ai_involved boolean default false
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, p_ai_involved, false, null, p_metadata
  );
end; $$;

create or replace function public._sai_next_case_number(p_organization_id uuid)
returns text language plpgsql as $$
declare v_count int;
begin
  select count(*) + 1 into v_count from public.organization_support_cases where organization_id = p_organization_id;
  return 'SUP-' || lpad(v_count::text, 5, '0');
end; $$;

create or replace function public._sai_ensure_settings(p_organization_id uuid)
returns public.support_ai_settings language plpgsql security definer set search_path = public as $$
declare v_row public.support_ai_settings;
begin
  insert into public.support_ai_settings (organization_id) values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.support_ai_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._sai_detect_high_risk(p_subject text, p_content text default '')
returns boolean language plpgsql immutable as $$
declare v_text text := lower(coalesce(p_subject, '') || ' ' || coalesce(p_content, ''));
begin
  return v_text ~ '(billing|refund|legal|privacy|security breach|account suspension|chargeback|gdpr|lawsuit)';
end; $$;

create or replace function public._sai_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._sai_ensure_settings(p_organization_id);

  insert into public.organization_support_cases (
    organization_id, case_number, subject, customer_identifier, channel, status, priority, ai_summary, created_at
  )
  select p_organization_id, v.num, v.subject, v.customer, v.channel, v.status, v.priority, v.summary, now() - v.ago
  from (values
    ('SUP-00001', 'How do I reset my password?', 'customer@example.com', 'support_widget', 'open', 'medium',
     'Customer needs password reset instructions.', interval '2 hours'),
    ('SUP-00002', 'Billing question about last invoice', 'billing@acme.co', 'email_support', 'waiting_for_internal', 'high',
     'Customer asking about unexpected charge — requires human review.', interval '5 hours'),
    ('SUP-00003', 'Integration sync failing', 'dev@startup.io', 'admin_inbox', 'open', 'urgent',
     'API integration returning 401 errors repeatedly.', interval '1 hour'),
    ('SUP-00004', 'Feature request: export reports', 'user@company.com', 'support_widget', 'new', 'low',
     'Customer requesting CSV export capability.', interval '30 minutes')
  ) as v(num, subject, customer, channel, status, priority, summary, ago)
  where not exists (
    select 1 from public.organization_support_cases c
    where c.organization_id = p_organization_id and c.case_number = v.num
  );

  insert into public.support_ai_responses (
    organization_id, case_id, response_mode, content, confidence_score, knowledge_sources, status
  )
  select p_organization_id, c.id, v.mode, v.content, v.conf, v.sources, v.status
  from public.organization_support_cases c
  cross join (values
    ('automatic', 'To reset your password, go to Settings > Security and click Reset Password.', 0.92,
     '[{"title":"Reset Password Guide","source_type":"article"}]'::jsonb, 'sent'),
    ('draft', 'I understand you have a billing question. Let me review your invoice details with our billing team.', 0.55,
     '[]'::jsonb, 'pending')
  ) as v(mode, content, conf, sources, status)
  where c.organization_id = p_organization_id and c.case_number = 'SUP-00001'
    and not exists (select 1 from public.support_ai_responses r where r.case_id = c.id limit 1);

  insert into public.support_ai_knowledge_gaps (organization_id, question, occurrence_count, gap_type, status)
  select p_organization_id, v.q, v.cnt, v.gtype, 'open'
  from (values
    ('How do I export my data to CSV?', 4, 'missing_faq'),
    ('What are your SLA response times?', 3, 'documentation_gap'),
    ('Is two-factor authentication available?', 2, 'outdated_article')
  ) as v(q, cnt, gtype)
  where not exists (
    select 1 from public.support_ai_knowledge_gaps g
    where g.organization_id = p_organization_id and g.question = v.q
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Case lifecycle RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_support_case(
  p_subject text,
  p_customer_identifier text default null,
  p_channel text default 'admin_inbox',
  p_priority text default 'medium'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid; v_num text;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();
  v_num := public._sai_next_case_number(v_org_id);

  insert into public.organization_support_cases (
    organization_id, case_number, subject, customer_identifier, channel, status, priority
  ) values (
    v_org_id, v_num, p_subject, p_customer_identifier,
    coalesce(p_channel, 'admin_inbox'), 'new', coalesce(p_priority, 'medium')
  ) returning id into v_id;

  perform public._sai_log(v_org_id, 'support_case_created', 'support_case', v_id,
    jsonb_build_object('case_number', v_num, 'subject', p_subject));

  return jsonb_build_object('id', v_id, 'case_number', v_num, 'status', 'new');
end; $$;

create or replace function public.suggest_support_ai_response(p_case_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_case public.organization_support_cases;
  v_settings public.support_ai_settings;
  v_knowledge jsonb;
  v_content text;
  v_confidence numeric;
  v_mode text;
  v_response_id uuid;
  v_high_risk boolean;
begin
  perform public._irp_require_permission('support.reply');
  v_org_id := public._mta_require_organization();
  select * into v_case from public.organization_support_cases
  where id = p_case_id and organization_id = v_org_id;
  if v_case.id is null then raise exception 'Case not found'; end if;

  v_settings := public._sai_ensure_settings(v_org_id);
  v_knowledge := public.retrieve_knowledge_for_ai(v_case.subject, 'en', 'customer');
  v_high_risk := public._sai_detect_high_risk(v_case.subject);

  if v_high_risk or v_case.priority in ('high', 'urgent') then
    v_mode := 'draft';
    v_confidence := 0.45;
    v_content := 'Thank you for contacting us. Your request requires specialist review. A team member will follow up shortly.';
  elsif jsonb_array_length(coalesce(v_knowledge->'sources', '[]'::jsonb)) > 0 then
    v_confidence := 0.85;
    v_mode := case when v_settings.auto_faq_enabled and v_settings.default_response_mode = 'automatic' then 'automatic' else 'draft' end;
    v_content := 'Based on our knowledge base: ' ||
      coalesce(v_knowledge->'sources'->0->>'summary', v_knowledge->'sources'->0->>'content', 'Please see our help documentation.');
  else
    v_mode := 'draft';
    v_confidence := 0.35;
    v_content := 'Thank you for your message. We are researching your question and will respond shortly.';
  end if;

  if v_confidence < v_settings.escalation_confidence_threshold then
    v_mode := 'draft';
  end if;

  insert into public.support_ai_responses (
    organization_id, case_id, response_mode, content, confidence_score, knowledge_sources, status
  ) values (
    v_org_id, p_case_id, v_mode, v_content, v_confidence,
    coalesce(v_knowledge->'sources', '[]'::jsonb),
    case when v_mode = 'automatic' and v_confidence >= 0.8 then 'approved' else 'pending' end
  ) returning id into v_response_id;

  update public.organization_support_cases set
    ai_summary = left(v_content, 200), status = 'open', updated_at = now()
  where id = p_case_id;

  perform public._sai_log(v_org_id, 'support_ai_draft_generated', 'support_case', p_case_id,
    jsonb_build_object('response_id', v_response_id, 'mode', v_mode, 'confidence', v_confidence), true);

  if v_confidence < v_settings.escalation_confidence_threshold then
    insert into public.support_ai_knowledge_gaps (organization_id, question, gap_type)
    values (v_org_id, v_case.subject, 'unanswered_question')
    on conflict do nothing;
  end if;

  return jsonb_build_object(
    'response_id', v_response_id,
    'response_mode', v_mode,
    'content', v_content,
    'confidence_score', v_confidence,
    'knowledge_sources', v_knowledge->'sources',
    'should_escalate', v_confidence < v_settings.escalation_confidence_threshold or v_high_risk
  );
end; $$;

create or replace function public.approve_support_ai_response(p_response_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_resp public.support_ai_responses;
begin
  perform public._irp_require_permission('support.reply');
  v_org_id := public._mta_require_organization();
  update public.support_ai_responses set
    status = 'approved', approved_by = public._mta_app_user_id()
  where id = p_response_id and organization_id = v_org_id and status = 'pending'
  returning * into v_resp;
  if v_resp.id is null then raise exception 'Response not found'; end if;
  perform public._sai_log(v_org_id, 'support_approval_granted', 'support_case', v_resp.case_id,
    jsonb_build_object('response_id', p_response_id), true);
  return jsonb_build_object('response_id', p_response_id, 'status', 'approved');
end; $$;

create or replace function public.send_support_reply(p_response_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_resp public.support_ai_responses;
begin
  perform public._irp_require_permission('support.reply');
  v_org_id := public._mta_require_organization();
  select * into v_resp from public.support_ai_responses
  where id = p_response_id and organization_id = v_org_id;
  if v_resp.id is null then raise exception 'Response not found'; end if;
  if v_resp.status not in ('approved', 'pending') then raise exception 'Response not sendable'; end if;
  if v_resp.response_mode = 'draft' and v_resp.status = 'pending' then
    raise exception 'Draft requires approval before sending';
  end if;

  update public.support_ai_responses set status = 'sent', sent_at = now()
  where id = p_response_id;

  update public.organization_support_cases set
    status = 'waiting_for_customer',
    first_response_at = coalesce(first_response_at, now()),
    updated_at = now()
  where id = v_resp.case_id;

  perform public._sai_log(v_org_id, 'support_reply_sent', 'support_case', v_resp.case_id,
    jsonb_build_object('response_id', p_response_id, 'mode', v_resp.response_mode),
    v_resp.response_mode <> 'manual');

  return jsonb_build_object('response_id', p_response_id, 'status', 'sent', 'sent_at', now());
end; $$;

create or replace function public.escalate_support_case(
  p_case_id uuid,
  p_reason text default 'Low confidence or customer request'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('support.escalate');
  v_org_id := public._mta_require_organization();

  update public.organization_support_cases set
    status = 'waiting_for_internal', priority = 'high',
    escalated_at = now(), escalation_reason = p_reason, updated_at = now()
  where id = p_case_id and organization_id = v_org_id;

  update public.support_ai_responses set status = 'escalated'
  where case_id = p_case_id and organization_id = v_org_id and status = 'pending';

  perform public._sai_log(v_org_id, 'support_escalated', 'support_case', p_case_id,
    jsonb_build_object('reason', p_reason), true);

  return jsonb_build_object('case_id', p_case_id, 'status', 'waiting_for_internal');
end; $$;

create or replace function public.close_organization_support_case(p_case_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('support.close');
  v_org_id := public._mta_require_organization();

  update public.organization_support_cases set
    status = 'closed', resolved_at = now(), updated_at = now()
  where id = p_case_id and organization_id = v_org_id;

  perform public._sai_log(v_org_id, 'support_case_closed', 'support_case', p_case_id, '{}'::jsonb, false);

  return jsonb_build_object('case_id', p_case_id, 'status', 'closed');
end; $$;

create or replace function public.submit_support_satisfaction(
  p_case_id uuid,
  p_rating text,
  p_comment text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();

  insert into public.support_case_satisfaction (organization_id, case_id, rating, comment)
  values (v_org_id, p_case_id, p_rating, p_comment)
  on conflict (case_id) do update set rating = excluded.rating, comment = excluded.comment;

  perform public._sai_log(v_org_id, 'support_satisfaction_received', 'support_case', p_case_id,
    jsonb_build_object('rating', p_rating), false);

  return jsonb_build_object('case_id', p_case_id, 'rating', p_rating);
end; $$;

create or replace function public.assign_support_case(p_case_id uuid, p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('support.assign');
  v_org_id := public._mta_require_organization();
  update public.organization_support_cases set assigned_to = p_user_id, updated_at = now()
  where id = p_case_id and organization_id = v_org_id;
  perform public._sai_log(v_org_id, 'support_case_assigned', 'support_case', p_case_id,
    jsonb_build_object('assigned_to', p_user_id), false);
  return jsonb_build_object('case_id', p_case_id, 'assigned_to', p_user_id);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Metrics & gaps
-- ---------------------------------------------------------------------------
create or replace function public.get_support_ai_metrics()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('support.view_metrics');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'first_response_time_avg_hours', coalesce((
      select avg(extract(epoch from (first_response_at - created_at)) / 3600)
      from public.organization_support_cases
      where organization_id = v_org_id and first_response_at is not null
    ), 0),
    'resolution_time_avg_hours', coalesce((
      select avg(extract(epoch from (resolved_at - created_at)) / 3600)
      from public.organization_support_cases
      where organization_id = v_org_id and resolved_at is not null
    ), 0),
    'escalation_rate', case when (select count(*) from public.organization_support_cases where organization_id = v_org_id) > 0
      then round((select count(*)::numeric from public.organization_support_cases where organization_id = v_org_id and escalated_at is not null) /
        (select count(*) from public.organization_support_cases where organization_id = v_org_id), 3)
      else 0 end,
    'ai_usage_rate', case when (select count(*) from public.support_ai_responses where organization_id = v_org_id) > 0
      then round((select count(*)::numeric from public.support_ai_responses where organization_id = v_org_id) /
        greatest((select count(*) from public.organization_support_cases where organization_id = v_org_id), 1), 3)
      else 0 end,
    'approval_rate', case when (select count(*) from public.support_ai_responses where organization_id = v_org_id and response_mode = 'draft') > 0
      then round((select count(*)::numeric from public.support_ai_responses where organization_id = v_org_id and status in ('approved', 'sent')) /
        (select count(*) from public.support_ai_responses where organization_id = v_org_id and response_mode = 'draft'), 3)
      else 0 end,
    'satisfaction_scores', jsonb_build_object(
      'positive', (select count(*) from public.support_case_satisfaction s join public.organization_support_cases c on c.id = s.case_id where c.organization_id = v_org_id and s.rating = 'positive'),
      'neutral', (select count(*) from public.support_case_satisfaction s join public.organization_support_cases c on c.id = s.case_id where c.organization_id = v_org_id and s.rating = 'neutral'),
      'negative', (select count(*) from public.support_case_satisfaction s join public.organization_support_cases c on c.id = s.case_id where c.organization_id = v_org_id and s.rating = 'negative')
    )
  );
end; $$;

create or replace function public.detect_support_knowledge_gaps()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', g.id, 'question', g.question, 'occurrence_count', g.occurrence_count,
      'gap_type', g.gap_type, 'status', g.status, 'suggested_article_title', g.suggested_article_title
    ) order by g.occurrence_count desc)
    from public.support_ai_knowledge_gaps g
    where g.organization_id = v_org_id and g.status = 'open'
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_support_ai_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.support_ai_settings;
begin
  perform public._irp_require_permission('support.view');
  v_org_id := public._mta_require_organization();
  perform public._sai_seed_demo_content(v_org_id);
  v_settings := public._sai_ensure_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Faster, more accurate, and scalable customer support through AI-assisted workflows with human oversight.',
    'safety_note', 'Only approved low-risk responses may be automated. Medium and high-risk topics always require human review.',
    'principles', jsonb_build_array(
      'Tenant-aware operation',
      'Knowledge-driven responses',
      'Human oversight for medium/high-risk actions',
      'Audit logging for important activities',
      'Continuous improvement through feedback'
    ),
    'settings', jsonb_build_object(
      'default_response_mode', v_settings.default_response_mode,
      'auto_faq_enabled', v_settings.auto_faq_enabled,
      'escalation_confidence_threshold', v_settings.escalation_confidence_threshold,
      'channels_enabled', v_settings.channels_enabled
    ),
    'open_cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'case_number', c.case_number, 'subject', c.subject,
        'customer_identifier', c.customer_identifier, 'channel', c.channel,
        'status', c.status, 'priority', c.priority, 'ai_summary', c.ai_summary,
        'created_at', c.created_at, 'escalated_at', c.escalated_at
      ) order by
        case c.priority when 'urgent' then 1 when 'high' then 2 when 'medium' then 3 else 4 end,
        c.created_at desc)
      from public.organization_support_cases c
      where c.organization_id = v_org_id and c.status not in ('resolved', 'closed') limit 15
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'case_id', r.case_id, 'content', left(r.content, 200),
        'response_mode', r.response_mode, 'confidence_score', r.confidence_score,
        'created_at', r.created_at
      ) order by r.created_at desc)
      from public.support_ai_responses r
      where r.organization_id = v_org_id and r.status = 'pending' limit 10
    ), '[]'::jsonb),
    'escalated_cases', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'case_number', c.case_number, 'subject', c.subject,
        'escalation_reason', c.escalation_reason, 'escalated_at', c.escalated_at
      ) order by c.escalated_at desc nulls last)
      from public.organization_support_cases c
      where c.organization_id = v_org_id and c.escalated_at is not null limit 8
    ), '[]'::jsonb),
    'unresolved_issues', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'case_number', c.case_number, 'subject', c.subject, 'status', c.status, 'priority', c.priority
      ) order by c.updated_at desc)
      from public.organization_support_cases c
      where c.organization_id = v_org_id and c.status in ('open', 'waiting_for_internal', 'waiting_for_customer') limit 10
    ), '[]'::jsonb),
    'ai_statistics', jsonb_build_object(
      'total_responses', (select count(*) from public.support_ai_responses where organization_id = v_org_id),
      'automatic_sent', (select count(*) from public.support_ai_responses where organization_id = v_org_id and response_mode = 'automatic' and status = 'sent'),
      'drafts_pending', (select count(*) from public.support_ai_responses where organization_id = v_org_id and status = 'pending'),
      'escalated', (select count(*) from public.support_ai_responses where organization_id = v_org_id and status = 'escalated')
    ),
    'metrics', public.get_support_ai_metrics(),
    'knowledge_gaps', public.detect_support_knowledge_gaps(),
    'response_modes', jsonb_build_array('automatic', 'draft', 'manual'),
    'channels', jsonb_build_array('support_widget', 'admin_inbox', 'email_support')
  );
end; $$;

create or replace function public.get_support_ai_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'open_cases', (select count(*) from public.organization_support_cases where organization_id = v_org_id and status not in ('resolved', 'closed')),
    'pending_approvals', (select count(*) from public.support_ai_responses where organization_id = v_org_id and status = 'pending'),
    'philosophy', 'AI-assisted support with human oversight.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Update audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._sai_seed_demo_content(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'support-ai-engine', 'Support AI Engine', 'Customer-facing AI support with knowledge-driven responses and human oversight.', 'authenticated', 57
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'support-ai-engine' and tenant_id is null);

grant execute on function public.create_organization_support_case(text, text, text, text) to authenticated;
grant execute on function public.suggest_support_ai_response(uuid) to authenticated;
grant execute on function public.approve_support_ai_response(uuid) to authenticated;
grant execute on function public.send_support_reply(uuid) to authenticated;
grant execute on function public.escalate_support_case(uuid, text) to authenticated;
grant execute on function public.close_organization_support_case(uuid) to authenticated;
grant execute on function public.submit_support_satisfaction(uuid, text, text) to authenticated;
grant execute on function public.assign_support_case(uuid, uuid) to authenticated;
grant execute on function public.get_support_ai_metrics() to authenticated;
grant execute on function public.detect_support_knowledge_gaps() to authenticated;
grant execute on function public.get_support_ai_engine_dashboard() to authenticated;
grant execute on function public.get_support_ai_engine_card() to authenticated;
