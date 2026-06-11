-- Phase A.12 — Aipify Self-Support Engine
-- Principle: knowledge-driven self-service with human escalation when necessary.

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
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'aipify_self_support_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. self_support_settings
-- ---------------------------------------------------------------------------
create table if not exists public.self_support_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  auto_response_enabled boolean not null default true,
  escalation_confidence_threshold numeric(4, 2) not null default 0.50,
  sensitive_topic_escalation boolean not null default true,
  channels_enabled jsonb not null default '["support_widget","dashboard","knowledge_search"]'::jsonb,
  future_channels jsonb not null default '["email","messaging","voice"]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.self_support_settings enable row level security;
revoke all on public.self_support_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. self_support_conversations
-- ---------------------------------------------------------------------------
create table if not exists public.self_support_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_number text not null,
  subject text not null,
  channel text not null default 'dashboard' check (
    channel in ('support_widget', 'dashboard', 'knowledge_search', 'email', 'messaging', 'voice')
  ),
  status text not null default 'active' check (
    status in ('active', 'escalated', 'resolved', 'closed')
  ),
  started_by uuid references public.users (id) on delete set null,
  escalation_count int not null default 0,
  satisfaction_rating text check (satisfaction_rating in ('positive', 'neutral', 'negative')),
  last_confidence_level text check (last_confidence_level in ('high', 'medium', 'low')),
  escalated_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, conversation_number)
);

create index if not exists self_support_conversations_org_status_idx
  on public.self_support_conversations (organization_id, status, created_at desc);

alter table public.self_support_conversations enable row level security;
revoke all on public.self_support_conversations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. self_support_messages (metadata summaries only — no raw chat transcripts)
-- ---------------------------------------------------------------------------
create table if not exists public.self_support_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_id uuid not null references public.self_support_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content_summary text not null,
  confidence_level text check (confidence_level in ('high', 'medium', 'low')),
  confidence_score numeric(4, 2),
  response_mode text check (response_mode in ('automatic', 'draft', 'escalated')),
  knowledge_sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  constraint self_support_messages_summary_len check (char_length(content_summary) <= 500)
);

create index if not exists self_support_messages_conversation_idx
  on public.self_support_messages (conversation_id, created_at);

alter table public.self_support_messages enable row level security;
revoke all on public.self_support_messages from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. self_support_escalations
-- ---------------------------------------------------------------------------
create table if not exists public.self_support_escalations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_id uuid not null references public.self_support_conversations (id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'assigned', 'resolved')),
  assigned_to uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists self_support_escalations_org_status_idx
  on public.self_support_escalations (organization_id, status, created_at desc);

alter table public.self_support_escalations enable row level security;
revoke all on public.self_support_escalations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. self_support_feedback
-- ---------------------------------------------------------------------------
create table if not exists public.self_support_feedback (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  conversation_id uuid not null references public.self_support_conversations (id) on delete cascade,
  message_id uuid references public.self_support_messages (id) on delete set null,
  rating text not null check (rating in ('helpful', 'unhelpful')),
  comment text,
  improvement_suggestion text,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.self_support_feedback enable row level security;
revoke all on public.self_support_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. self_support_knowledge_gaps
-- ---------------------------------------------------------------------------
create table if not exists public.self_support_knowledge_gaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  question text not null,
  occurrence_count int not null default 1,
  gap_type text not null default 'unanswered_question' check (
    gap_type in (
      'unanswered_question', 'repeated_topic', 'outdated_article',
      'missing_onboarding', 'missing_faq', 'documentation_gap'
    )
  ),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  suggested_article_title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.self_support_knowledge_gaps enable row level security;
revoke all on public.self_support_knowledge_gaps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'self_support', v.description
from (values
  ('self_support.view', 'View Self-Support', 'View self-support conversations and dashboard'),
  ('self_support.manage', 'Manage Self-Support', 'Manage self-support settings and conversations'),
  ('self_support.review_feedback', 'Review Self-Support Feedback', 'Review customer feedback on self-support responses'),
  ('self_support.manage_knowledge', 'Manage Self-Support Knowledge', 'Manage knowledge gaps and KC recommendations')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'self_support.view'), ('owner', 'self_support.manage'),
  ('owner', 'self_support.review_feedback'), ('owner', 'self_support.manage_knowledge'),
  ('administrator', 'self_support.view'), ('administrator', 'self_support.manage'),
  ('administrator', 'self_support.review_feedback'), ('administrator', 'self_support.manage_knowledge'),
  ('manager', 'self_support.view'), ('manager', 'self_support.review_feedback'),
  ('support_agent', 'self_support.view'), ('support_agent', 'self_support.review_feedback'),
  ('viewer', 'self_support.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Helpers (_sse_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._sse_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'self_support_conversation',
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

create or replace function public._sse_next_conversation_number(p_organization_id uuid)
returns text language plpgsql as $$
declare v_count int;
begin
  select count(*) + 1 into v_count from public.self_support_conversations where organization_id = p_organization_id;
  return 'SS-' || lpad(v_count::text, 5, '0');
end; $$;

create or replace function public._sse_ensure_settings(p_organization_id uuid)
returns public.self_support_settings language plpgsql security definer set search_path = public as $$
declare v_row public.self_support_settings;
begin
  insert into public.self_support_settings (organization_id) values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.self_support_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._sse_detect_sensitive(p_text text)
returns boolean language plpgsql immutable as $$
declare v_text text := lower(coalesce(p_text, ''));
begin
  return v_text ~ '(billing|refund|legal|privacy|security breach|account suspension|chargeback|gdpr|password reset|account access|invoice)';
end; $$;

create or replace function public._sse_evaluate_confidence(
  p_knowledge jsonb,
  p_sensitive boolean,
  p_threshold numeric default 0.50
)
returns jsonb language plpgsql immutable as $$
declare
  v_source_count int;
  v_score numeric;
  v_level text;
  v_mode text;
begin
  v_source_count := jsonb_array_length(coalesce(p_knowledge->'sources', '[]'::jsonb));

  if p_sensitive then
    v_score := 0.35;
    v_level := 'low';
    v_mode := 'escalated';
  elsif v_source_count >= 2 then
    v_score := 0.88;
    v_level := 'high';
    v_mode := 'automatic';
  elsif v_source_count = 1 then
    v_score := 0.62;
    v_level := 'medium';
    v_mode := 'draft';
  else
    v_score := 0.30;
    v_level := 'low';
    v_mode := 'escalated';
  end if;

  if v_score < p_threshold then
    v_level := 'low';
    v_mode := 'escalated';
  elsif v_score < 0.80 then
    v_level := 'medium';
    v_mode := 'draft';
  end if;

  return jsonb_build_object(
    'confidence_score', v_score,
    'confidence_level', v_level,
    'response_mode', v_mode,
    'should_escalate', v_level = 'low' or p_sensitive
  );
end; $$;

create or replace function public._sse_record_knowledge_gap(
  p_organization_id uuid,
  p_question text,
  p_gap_type text default 'unanswered_question'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.self_support_knowledge_gaps set
    occurrence_count = occurrence_count + 1,
    updated_at = now()
  where organization_id = p_organization_id
    and question = p_question
    and status = 'open';

  if not found then
    insert into public.self_support_knowledge_gaps (organization_id, question, gap_type)
    values (p_organization_id, p_question, p_gap_type);
  end if;
end; $$;

create or replace function public._sse_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_conv_id uuid;
begin
  perform public._sse_ensure_settings(p_organization_id);

  insert into public.self_support_conversations (
    organization_id, conversation_number, subject, channel, status, last_confidence_level, created_at
  )
  select p_organization_id, v.num, v.subject, v.channel, v.status, v.conf_level, now() - v.ago
  from (values
    ('SS-00001', 'How do I connect my first integration?', 'dashboard', 'active', 'high', interval '3 hours'),
    ('SS-00002', 'Billing question about subscription upgrade', 'dashboard', 'escalated', 'low', interval '6 hours'),
    ('SS-00003', 'API authentication returning 401 errors', 'support_widget', 'active', 'medium', interval '1 hour'),
    ('SS-00004', 'Where is the onboarding checklist?', 'knowledge_search', 'resolved', 'high', interval '2 days')
  ) as v(num, subject, channel, status, conf_level, ago)
  where not exists (
    select 1 from public.self_support_conversations c
    where c.organization_id = p_organization_id and c.conversation_number = v.num
  );

  select id into v_conv_id from public.self_support_conversations
  where organization_id = p_organization_id and conversation_number = 'SS-00001' limit 1;

  if v_conv_id is not null then
    insert into public.self_support_messages (
      organization_id, conversation_id, role, content_summary,
      confidence_level, confidence_score, response_mode, knowledge_sources
    )
    select p_organization_id, v_conv_id, v.role, v.summary, v.conf_level, v.conf, v.mode, v.sources
    from (values
      ('user', 'How do I connect my first integration?', null::text, null::numeric, null::text, '[]'::jsonb),
      ('assistant', 'Go to Integrations, choose a connector, and follow the setup wizard.', 'high', 0.88, 'automatic',
       '[{"title":"Integration Setup Guide","source_type":"article"}]'::jsonb)
    ) as v(role, summary, conf_level, conf, mode, sources)
    where not exists (
      select 1 from public.self_support_messages m where m.conversation_id = v_conv_id limit 1
    );
  end if;

  insert into public.self_support_knowledge_gaps (organization_id, question, occurrence_count, gap_type, status)
  select p_organization_id, v.q, v.cnt, v.gtype, 'open'
  from (values
    ('How do I export audit logs?', 5, 'missing_faq'),
    ('What modules are included in Business plan?', 4, 'documentation_gap'),
    ('How long does onboarding take?', 3, 'missing_onboarding')
  ) as v(q, cnt, gtype)
  where not exists (
    select 1 from public.self_support_knowledge_gaps g
    where g.organization_id = p_organization_id and g.question = v.q
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Conversation lifecycle RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_self_support_conversation(
  p_subject text,
  p_channel text default 'dashboard'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid; v_num text;
begin
  perform public._irp_require_permission('self_support.view');
  v_org_id := public._mta_require_organization();
  v_num := public._sse_next_conversation_number(v_org_id);

  insert into public.self_support_conversations (
    organization_id, conversation_number, subject, channel, status, started_by
  ) values (
    v_org_id, v_num, p_subject,
    coalesce(p_channel, 'dashboard'), 'active', public._mta_app_user_id()
  ) returning id into v_id;

  perform public._sse_log(v_org_id, 'self_support_conversation_created', 'self_support_conversation', v_id,
    jsonb_build_object('conversation_number', v_num, 'subject', left(p_subject, 200)));

  return jsonb_build_object('id', v_id, 'conversation_number', v_num, 'status', 'active');
end; $$;

create or replace function public.search_self_support_knowledge(p_query text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._irp_require_permission('self_support.view');
  return public.retrieve_knowledge_for_ai(p_query, 'en', 'internal');
end; $$;

create or replace function public.ask_self_support(
  p_conversation_id uuid,
  p_question text,
  p_request_human boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_conv public.self_support_conversations;
  v_settings public.self_support_settings;
  v_knowledge jsonb;
  v_eval jsonb;
  v_content text;
  v_user_msg_id uuid;
  v_assistant_msg_id uuid;
  v_sensitive boolean;
  v_should_escalate boolean;
begin
  perform public._irp_require_permission('self_support.view');
  v_org_id := public._mta_require_organization();

  select * into v_conv from public.self_support_conversations
  where id = p_conversation_id and organization_id = v_org_id;
  if v_conv.id is null then raise exception 'Conversation not found'; end if;
  if v_conv.status in ('closed', 'resolved') then raise exception 'Conversation is closed'; end if;

  v_settings := public._sse_ensure_settings(v_org_id);
  v_sensitive := public._sse_detect_sensitive(p_question);
  v_knowledge := public.retrieve_knowledge_for_ai(p_question, 'en', 'internal');
  v_eval := public._sse_evaluate_confidence(
    v_knowledge, v_sensitive or p_request_human, v_settings.escalation_confidence_threshold
  );
  v_should_escalate := (v_eval->>'should_escalate')::boolean or p_request_human;

  insert into public.self_support_messages (
    organization_id, conversation_id, role, content_summary
  ) values (
    v_org_id, p_conversation_id, 'user', left(p_question, 500)
  ) returning id into v_user_msg_id;

  if v_should_escalate then
    v_content := 'Your question requires specialist review. A support team member will follow up shortly.';
    if p_request_human then
      v_content := 'Connecting you with a support team member. Someone will follow up shortly.';
    end if;
  elsif (v_eval->>'confidence_level') = 'high' and v_settings.auto_response_enabled then
    v_content := 'Based on our knowledge base: ' ||
      coalesce(v_knowledge->'sources'->0->>'summary', v_knowledge->'sources'->0->>'content', 'Please see our help documentation.');
  elsif (v_eval->>'confidence_level') = 'medium' then
    v_content := 'Here is a suggested answer based on our knowledge: ' ||
      coalesce(v_knowledge->'sources'->0->>'summary', v_knowledge->'sources'->0->>'content', 'We are preparing guidance for your question.');
  else
    v_content := 'Thank you for your question. We are researching this and will respond shortly.';
  end if;

  insert into public.self_support_messages (
    organization_id, conversation_id, role, content_summary,
    confidence_level, confidence_score, response_mode, knowledge_sources
  ) values (
    v_org_id, p_conversation_id, 'assistant', left(v_content, 500),
    v_eval->>'confidence_level', (v_eval->>'confidence_score')::numeric,
    v_eval->>'response_mode',
    coalesce(v_knowledge->'sources', '[]'::jsonb)
  ) returning id into v_assistant_msg_id;

  update public.self_support_conversations set
    last_confidence_level = v_eval->>'confidence_level',
    updated_at = now()
  where id = p_conversation_id;

  if coalesce(jsonb_array_length(v_knowledge->'sources'), 0) > 0 then
    perform public._sse_log(v_org_id, 'self_support_knowledge_recommended', 'self_support_conversation', p_conversation_id,
      jsonb_build_object('message_id', v_assistant_msg_id, 'source_count', jsonb_array_length(v_knowledge->'sources')), true);
  end if;

  if (v_eval->>'response_mode') = 'automatic' and not v_should_escalate then
    perform public._sse_log(v_org_id, 'self_support_response_sent', 'self_support_conversation', p_conversation_id,
      jsonb_build_object('message_id', v_assistant_msg_id, 'confidence', v_eval->>'confidence_score'), true);
  else
    perform public._sse_log(v_org_id, 'self_support_draft_generated', 'self_support_conversation', p_conversation_id,
      jsonb_build_object('message_id', v_assistant_msg_id, 'mode', v_eval->>'response_mode'), true);
  end if;

  if v_should_escalate then
    perform public._sse_escalate_internal(
      v_org_id,
      p_conversation_id,
      case when p_request_human then 'Customer requested human support'
           when v_sensitive then 'Sensitive topic detected'
           else 'Confidence below threshold' end
    );
    perform public._sse_record_knowledge_gap(v_org_id, p_question, 'unanswered_question');
  elsif (v_eval->>'confidence_level') = 'low' then
    perform public._sse_record_knowledge_gap(v_org_id, p_question, 'unanswered_question');
  end if;

  return jsonb_build_object(
    'conversation_id', p_conversation_id,
    'user_message_id', v_user_msg_id,
    'assistant_message_id', v_assistant_msg_id,
    'content', v_content,
    'confidence_level', v_eval->>'confidence_level',
    'confidence_score', v_eval->>'confidence_score',
    'response_mode', v_eval->>'response_mode',
    'knowledge_sources', v_knowledge->'sources',
    'should_escalate', v_should_escalate
  );
end; $$;

create or replace function public._sse_escalate_internal(
  p_organization_id uuid,
  p_conversation_id uuid,
  p_reason text default 'Low confidence or customer request'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.self_support_conversations set
    status = 'escalated',
    escalation_count = escalation_count + 1,
    escalated_at = now(),
    updated_at = now()
  where id = p_conversation_id and organization_id = p_organization_id;

  insert into public.self_support_escalations (organization_id, conversation_id, reason)
  values (p_organization_id, p_conversation_id, p_reason);

  perform public._sse_log(p_organization_id, 'self_support_escalated', 'self_support_conversation', p_conversation_id,
    jsonb_build_object('reason', p_reason), true);
end; $$;

create or replace function public.escalate_self_support_conversation(
  p_conversation_id uuid,
  p_reason text default 'Low confidence or customer request'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('self_support.manage');
  v_org_id := public._mta_require_organization();
  perform public._sse_escalate_internal(v_org_id, p_conversation_id, p_reason);
  return jsonb_build_object('conversation_id', p_conversation_id, 'status', 'escalated');
end; $$;

create or replace function public.close_self_support_conversation(p_conversation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('self_support.manage');
  v_org_id := public._mta_require_organization();

  update public.self_support_conversations set
    status = 'closed', resolved_at = now(), updated_at = now()
  where id = p_conversation_id and organization_id = v_org_id;

  perform public._sse_log(v_org_id, 'self_support_conversation_closed', 'self_support_conversation', p_conversation_id, '{}'::jsonb, false);

  return jsonb_build_object('conversation_id', p_conversation_id, 'status', 'closed');
end; $$;

create or replace function public.submit_self_support_feedback(
  p_conversation_id uuid,
  p_rating text,
  p_message_id uuid default null,
  p_comment text default null,
  p_improvement_suggestion text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('self_support.view');
  v_org_id := public._mta_require_organization();

  insert into public.self_support_feedback (
    organization_id, conversation_id, message_id, rating, comment, improvement_suggestion, created_by
  ) values (
    v_org_id, p_conversation_id, p_message_id, p_rating,
    p_comment, p_improvement_suggestion, public._mta_app_user_id()
  ) returning id into v_id;

  perform public._sse_log(v_org_id, 'self_support_feedback_submitted', 'self_support_conversation', p_conversation_id,
    jsonb_build_object('rating', p_rating, 'feedback_id', v_id), false);

  if p_rating = 'unhelpful' then
    perform public._sse_record_knowledge_gap(
      v_org_id,
      coalesce((select subject from public.self_support_conversations where id = p_conversation_id), 'Unhelpful response'),
      'repeated_topic'
    );
  end if;

  return jsonb_build_object('feedback_id', v_id, 'rating', p_rating);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Metrics & gaps
-- ---------------------------------------------------------------------------
create or replace function public.detect_self_support_knowledge_gaps()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('self_support.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', g.id, 'question', g.question, 'occurrence_count', g.occurrence_count,
      'gap_type', g.gap_type, 'status', g.status, 'suggested_article_title', g.suggested_article_title
    ) order by g.occurrence_count desc)
    from public.self_support_knowledge_gaps g
    where g.organization_id = v_org_id and g.status = 'open'
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_self_support_conversations()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('self_support.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', c.id, 'conversation_number', c.conversation_number, 'subject', c.subject,
      'channel', c.channel, 'status', c.status, 'last_confidence_level', c.last_confidence_level,
      'escalation_count', c.escalation_count, 'created_at', c.created_at, 'escalated_at', c.escalated_at
    ) order by c.updated_at desc)
    from public.self_support_conversations c
    where c.organization_id = v_org_id and c.status not in ('closed') limit 20
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_self_support_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.self_support_settings;
begin
  perform public._irp_require_permission('self_support.view');
  v_org_id := public._mta_require_organization();
  perform public._sse_seed_demo_content(v_org_id);
  v_settings := public._sse_ensure_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Knowledge-driven self-service that helps customers resolve questions quickly — with human escalation when necessary.',
    'safety_note', 'Only high-confidence responses are sent automatically. Sensitive topics and low-confidence answers escalate to the support team.',
    'principles', jsonb_build_array(
      'Knowledge-driven responses',
      'Tenant-aware support',
      'Human escalation when necessary',
      'Continuous learning through feedback',
      'Audit logging for important activities'
    ),
    'settings', jsonb_build_object(
      'auto_response_enabled', v_settings.auto_response_enabled,
      'escalation_confidence_threshold', v_settings.escalation_confidence_threshold,
      'sensitive_topic_escalation', v_settings.sensitive_topic_escalation,
      'channels_enabled', v_settings.channels_enabled,
      'future_channels', v_settings.future_channels
    ),
    'active_conversations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'conversation_number', c.conversation_number, 'subject', c.subject,
        'channel', c.channel, 'status', c.status, 'last_confidence_level', c.last_confidence_level,
        'escalation_count', c.escalation_count, 'created_at', c.created_at
      ) order by c.updated_at desc)
      from public.self_support_conversations c
      where c.organization_id = v_org_id and c.status = 'active' limit 12
    ), '[]'::jsonb),
    'escalation_queue', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'conversation_id', e.conversation_id, 'reason', e.reason,
        'status', e.status, 'created_at', e.created_at,
        'subject', c.subject, 'conversation_number', c.conversation_number
      ) order by e.created_at desc)
      from public.self_support_escalations e
      join public.self_support_conversations c on c.id = e.conversation_id
      where e.organization_id = v_org_id and e.status = 'open' limit 10
    ), '[]'::jsonb),
    'unresolved_issues', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'conversation_number', c.conversation_number, 'subject', c.subject,
        'status', c.status, 'last_confidence_level', c.last_confidence_level
      ) order by c.updated_at desc)
      from public.self_support_conversations c
      where c.organization_id = v_org_id and c.status in ('active', 'escalated') limit 10
    ), '[]'::jsonb),
    'satisfaction_trends', jsonb_build_object(
      'helpful', (select count(*) from public.self_support_feedback where organization_id = v_org_id and rating = 'helpful'),
      'unhelpful', (select count(*) from public.self_support_feedback where organization_id = v_org_id and rating = 'unhelpful'),
      'positive', (select count(*) from public.self_support_conversations where organization_id = v_org_id and satisfaction_rating = 'positive'),
      'neutral', (select count(*) from public.self_support_conversations where organization_id = v_org_id and satisfaction_rating = 'neutral'),
      'negative', (select count(*) from public.self_support_conversations where organization_id = v_org_id and satisfaction_rating = 'negative')
    ),
    'statistics', jsonb_build_object(
      'total_conversations', (select count(*) from public.self_support_conversations where organization_id = v_org_id),
      'automatic_responses', (select count(*) from public.self_support_messages where organization_id = v_org_id and response_mode = 'automatic'),
      'draft_responses', (select count(*) from public.self_support_messages where organization_id = v_org_id and response_mode = 'draft'),
      'escalated_conversations', (select count(*) from public.self_support_conversations where organization_id = v_org_id and status = 'escalated'),
      'open_escalations', (select count(*) from public.self_support_escalations where organization_id = v_org_id and status = 'open')
    ),
    'knowledge_gaps', public.detect_self_support_knowledge_gaps(),
    'confidence_levels', jsonb_build_array('high', 'medium', 'low'),
    'channels', jsonb_build_array('support_widget', 'dashboard', 'knowledge_search'),
    'future_channels', v_settings.future_channels
  );
end; $$;

create or replace function public.get_self_support_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_conversations', (select count(*) from public.self_support_conversations where organization_id = v_org_id and status = 'active'),
    'open_escalations', (select count(*) from public.self_support_escalations where organization_id = v_org_id and status = 'open'),
    'philosophy', 'Self-service support powered by Knowledge Center.'
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
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._sse_ensure_settings(v_org_id);
    perform public._sse_seed_demo_content(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'self-support-engine', 'Self-Support Engine', 'Aipify self-service support with Knowledge Center integration and human escalation.', 'authenticated', 60
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'self-support-engine' and tenant_id is null);

grant execute on function public.create_self_support_conversation(text, text) to authenticated;
grant execute on function public.search_self_support_knowledge(text) to authenticated;
grant execute on function public.ask_self_support(uuid, text, boolean) to authenticated;
grant execute on function public.escalate_self_support_conversation(uuid, text) to authenticated;
grant execute on function public.close_self_support_conversation(uuid) to authenticated;
grant execute on function public.submit_self_support_feedback(uuid, text, uuid, text, text) to authenticated;
grant execute on function public.detect_self_support_knowledge_gaps() to authenticated;
grant execute on function public.get_self_support_conversations() to authenticated;
grant execute on function public.get_self_support_engine_dashboard() to authenticated;
grant execute on function public.get_self_support_engine_card() to authenticated;
