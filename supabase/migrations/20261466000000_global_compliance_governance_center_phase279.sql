-- Phase 279 — Global Compliance & Governance Center (Platform Admin)

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.compliance_governance_policies (
  id uuid primary key default gen_random_uuid(),
  policy_name text not null,
  category text not null check (
    category in (
      'security', 'privacy', 'data_handling', 'billing',
      'customer_communications', 'ai_governance', 'operational_standards'
    )
  ),
  owner text not null default '',
  effective_date date not null default current_date,
  review_date date not null default (current_date + interval '365 days'),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'under_review', 'archived')
  ),
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists compliance_governance_policies_status_idx
  on public.compliance_governance_policies (status, review_date);

create table if not exists public.compliance_governance_approvals (
  id uuid primary key default gen_random_uuid(),
  request_title text not null,
  category text not null default 'operational_standards' check (
    category in (
      'security', 'privacy', 'data_handling', 'billing',
      'customer_communications', 'ai_governance', 'operational_standards'
    )
  ),
  submitted_by text not null default '',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  due_date date not null default (current_date + interval '7 days'),
  approver text not null default '',
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'changes_requested', 'escalated')
  ),
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists compliance_governance_approvals_pending_idx
  on public.compliance_governance_approvals (status, due_date);

create table if not exists public.compliance_governance_retention_controls (
  id uuid primary key default gen_random_uuid(),
  data_type text not null unique check (
    data_type in (
      'support_data', 'audit_logs', 'feedback_records',
      'customer_activity_logs', 'knowledge_articles'
    )
  ),
  retention_days integer not null default 365 check (retention_days between 30 and 3650),
  updated_at timestamptz not null default now()
);

create table if not exists public.compliance_governance_access_records (
  id uuid primary key default gen_random_uuid(),
  record_type text not null check (
    record_type in ('role_assignment', 'privileged_user', 'super_admin_access', 'permission_exception')
  ),
  subject text not null,
  detail text not null default '',
  risk_level text not null default 'medium' check (risk_level in ('low', 'medium', 'high', 'critical')),
  active boolean not null default true,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists compliance_governance_access_active_idx
  on public.compliance_governance_access_records (active, risk_level);

create table if not exists public.compliance_governance_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null check (
    alert_type in (
      'overdue_policy_review', 'expired_approval', 'excessive_privilege',
      'high_risk_action', 'governance_violation'
    )
  ),
  message text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists compliance_governance_alerts_open_idx
  on public.compliance_governance_alerts (resolved, severity);

create table if not exists public.compliance_governance_exceptions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'operational_standards',
  owner text not null default '',
  risk_level text not null default 'high' check (risk_level in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'resolved', 'expired')),
  summary text not null default '',
  expires_at date,
  created_at timestamptz not null default now()
);

create index if not exists compliance_governance_exceptions_open_idx
  on public.compliance_governance_exceptions (status, risk_level);

create table if not exists public.compliance_governance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in (
      'policy_created', 'policy_updated', 'approval_completed',
      'governance_exception_raised', 'access_review_completed', 'compliance_report_generated'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists compliance_governance_audit_created_idx
  on public.compliance_governance_audit_logs (created_at desc);

alter table public.compliance_governance_policies enable row level security;
alter table public.compliance_governance_approvals enable row level security;
alter table public.compliance_governance_retention_controls enable row level security;
alter table public.compliance_governance_access_records enable row level security;
alter table public.compliance_governance_alerts enable row level security;
alter table public.compliance_governance_exceptions enable row level security;
alter table public.compliance_governance_audit_logs enable row level security;

revoke all on public.compliance_governance_policies from authenticated, anon;
revoke all on public.compliance_governance_approvals from authenticated, anon;
revoke all on public.compliance_governance_retention_controls from authenticated, anon;
revoke all on public.compliance_governance_access_records from authenticated, anon;
revoke all on public.compliance_governance_alerts from authenticated, anon;
revoke all on public.compliance_governance_exceptions from authenticated, anon;
revoke all on public.compliance_governance_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cgc279_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._cgc279_log_audit(
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.compliance_governance_audit_logs (event_type, summary, context)
  values (p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._cgc279_seed_if_empty()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.compliance_governance_policies limit 1) then return; end if;

  insert into public.compliance_governance_policies (
    policy_name, category, owner, effective_date, review_date, status, risk_level, summary
  ) values
    ('Platform Data Privacy Standard', 'privacy', 'Trust Team', current_date - 180, current_date + 30, 'under_review', 'high',
     'Defines metadata-only storage and customer data ownership boundaries.'),
    ('AI Action Approval Policy', 'ai_governance', 'Trust & Action Team', current_date - 90, current_date + 275, 'active', 'critical',
     'Level 4 actions prohibited for AI; explicit human approval required for sensitive operations.'),
    ('Customer Communication Standards', 'customer_communications', 'Communications Team', current_date - 60, current_date + 305, 'active', 'medium',
     'Professional tone, no fake urgency, enterprise-ready messaging.'),
    ('Billing & License Grace Period Policy', 'billing', 'Finance Ops', current_date - 120, current_date - 5, 'under_review', 'high',
     '3-day grace period; service pause without data deletion.'),
    ('Security Access Control Policy', 'security', 'Security Team', current_date - 200, current_date + 165, 'active', 'critical',
     '2FA, RBAC visibility, platform admin separation from customer data.'),
    ('Operational Incident Response', 'operational_standards', 'Platform Ops', current_date - 30, current_date + 335, 'draft', 'medium',
     'Incident classification, escalation paths, and customer notification windows.');

  insert into public.compliance_governance_approvals (
    request_title, category, submitted_by, priority, due_date, approver, status, risk_level
  ) values
    ('Enterprise SSO configuration change', 'security', 'Platform Support', 'high', current_date + 2, 'Super Admin', 'pending', 'high'),
    ('AI model profile policy update', 'ai_governance', 'Intelligence Team', 'critical', current_date - 1, 'Super Admin', 'pending', 'critical'),
    ('Customer data export procedure', 'data_handling', 'Trust Team', 'medium', current_date + 5, 'Knowledge Admin', 'pending', 'medium'),
    ('Growth Partner commission rule change', 'billing', 'Finance Ops', 'high', current_date + 3, 'Product Owner', 'pending', 'high'),
    ('Emergency maintenance notification template', 'customer_communications', 'Communications Team', 'medium', current_date + 7, 'Product Owner', 'changes_requested', 'medium');

  insert into public.compliance_governance_retention_controls (data_type, retention_days)
  values
    ('support_data', 365),
    ('audit_logs', 2555),
    ('feedback_records', 730),
    ('customer_activity_logs', 365),
    ('knowledge_articles', 1825)
  on conflict (data_type) do nothing;

  insert into public.compliance_governance_access_records (record_type, subject, detail, risk_level)
  values
    ('super_admin_access', 'platform_admins', '4 active Super Admin accounts', 'high'),
    ('privileged_user', 'Finance Ops Lead', 'Cross-tenant billing read access', 'medium'),
    ('role_assignment', 'Platform Support', '12 users with platform_support role', 'low'),
    ('permission_exception', 'Unonight pilot support', 'Temporary elevated install diagnostics — expires 2026-07-01', 'high');

  insert into public.compliance_governance_alerts (alert_type, message, severity)
  values
    ('overdue_policy_review', 'Billing & License Grace Period Policy review is overdue.', 'high'),
    ('expired_approval', 'AI model profile policy update approval is past due date.', 'critical'),
    ('excessive_privilege', '3 permission exceptions active beyond 90 days.', 'medium'),
    ('high_risk_action', '2 critical-risk approvals pending Super Admin review.', 'critical'),
    ('governance_violation', 'Draft policy published without required review workflow.', 'high');

  insert into public.compliance_governance_exceptions (
    title, category, owner, risk_level, status, summary, expires_at
  ) values
    ('Unonight pilot diagnostics access', 'security', 'Platform Support', 'high', 'open',
     'Temporary cross-tenant install diagnostics for Customer Zero pilot.', current_date + 45),
    ('Legacy API endpoint grace period', 'operational_standards', 'Platform Ops', 'medium', 'open',
     'Deprecated install endpoints remain documented for 60-day transition.', current_date + 30);

  insert into public.compliance_governance_audit_logs (event_type, summary)
  values
    ('policy_created', 'Compliance & Governance Center initialized with seed policies.'),
    ('access_review_completed', 'Quarterly privileged access review completed.');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Main RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_compliance_governance_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_policies jsonb;
  v_approvals jsonb;
  v_retention jsonb;
  v_access jsonb;
  v_alerts jsonb;
  v_exceptions jsonb;
  v_reports jsonb;
  v_audit jsonb;
  v_category_filter text;
  v_status_filter text;
  v_risk_filter text;
  v_owner_filter text;
  v_review_from date;
  v_review_to date;
begin
  perform public._cgc279_require_platform_admin();
  perform public._cgc279_seed_if_empty();

  v_category_filter := nullif(p_filters->>'category', '');
  v_status_filter := nullif(p_filters->>'status', '');
  v_risk_filter := nullif(p_filters->>'risk_level', '');
  v_owner_filter := nullif(p_filters->>'owner', '');
  v_review_from := nullif(p_filters->>'review_from', '')::date;
  v_review_to := nullif(p_filters->>'review_to', '')::date;

  v_overview := jsonb_build_object(
    'compliance_alerts', (select count(*)::int from public.compliance_governance_alerts where resolved = false),
    'policies_requiring_review', (select count(*)::int from public.compliance_governance_policies where status = 'under_review' or review_date <= current_date + 30),
    'pending_approvals', (select count(*)::int from public.compliance_governance_approvals where status in ('pending', 'escalated', 'changes_requested')),
    'governance_exceptions', (select count(*)::int from public.compliance_governance_exceptions where status = 'open'),
    'audit_findings', (select count(*)::int from public.compliance_governance_audit_logs where created_at >= now() - interval '30 days'),
    'high_risk_activities', (
      select count(*)::int from public.compliance_governance_approvals
      where status in ('pending', 'escalated') and risk_level in ('high', 'critical')
    )
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id,
    'policy_name', p.policy_name,
    'category', p.category,
    'owner', p.owner,
    'effective_date', p.effective_date,
    'review_date', p.review_date,
    'status', p.status,
    'risk_level', p.risk_level,
    'summary', p.summary,
    'updated_at', p.updated_at
  ) order by p.review_date asc), '[]'::jsonb)
  into v_policies
  from public.compliance_governance_policies p
  where (v_category_filter is null or p.category = v_category_filter)
    and (v_status_filter is null or p.status = v_status_filter)
    and (v_risk_filter is null or p.risk_level = v_risk_filter)
    and (v_owner_filter is null or p.owner ilike '%' || v_owner_filter || '%')
    and (v_review_from is null or p.review_date >= v_review_from)
    and (v_review_to is null or p.review_date <= v_review_to);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id,
    'request_title', a.request_title,
    'category', a.category,
    'submitted_by', a.submitted_by,
    'priority', a.priority,
    'due_date', a.due_date,
    'approver', a.approver,
    'status', a.status,
    'risk_level', a.risk_level
  ) order by a.due_date asc), '[]'::jsonb)
  into v_approvals
  from public.compliance_governance_approvals a
  where a.status in ('pending', 'escalated', 'changes_requested');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'data_type', r.data_type,
    'retention_days', r.retention_days,
    'updated_at', r.updated_at
  ) order by r.data_type), '[]'::jsonb)
  into v_retention
  from public.compliance_governance_retention_controls r;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ar.id,
    'record_type', ar.record_type,
    'subject', ar.subject,
    'detail', ar.detail,
    'risk_level', ar.risk_level,
    'active', ar.active,
    'reviewed_at', ar.reviewed_at
  ) order by case ar.risk_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_access
  from public.compliance_governance_access_records ar
  where ar.active = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', al.id,
    'alert_type', al.alert_type,
    'message', al.message,
    'severity', al.severity,
    'created_at', al.created_at
  ) order by case al.severity when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end), '[]'::jsonb)
  into v_alerts
  from public.compliance_governance_alerts al
  where al.resolved = false;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id,
    'title', e.title,
    'category', e.category,
    'owner', e.owner,
    'risk_level', e.risk_level,
    'status', e.status,
    'summary', e.summary,
    'expires_at', e.expires_at
  ) order by e.expires_at nulls last), '[]'::jsonb)
  into v_exceptions
  from public.compliance_governance_exceptions e
  where e.status = 'open';

  v_reports := jsonb_build_object(
    'governance_activities', (select count(*)::int from public.compliance_governance_audit_logs),
    'approval_histories', (select count(*)::int from public.compliance_governance_approvals where status in ('approved', 'rejected')),
    'policy_compliance', (select count(*)::int from public.compliance_governance_policies where status = 'active'),
    'audit_summaries', (select count(*)::int from public.compliance_governance_audit_logs where created_at >= now() - interval '90 days')
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.compliance_governance_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'Trust is built through accountability. Governance should enable responsible growth, not unnecessary complexity.',
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'modules', jsonb_build_array(
      'policy_management', 'approval_workflows', 'data_retention_controls',
      'access_governance', 'security_governance', 'compliance_reporting'
    ),
    'policies', v_policies,
    'approvals', v_approvals,
    'retention', v_retention,
    'access', v_access,
    'alerts', v_alerts,
    'exceptions', v_exceptions,
    'reports', v_reports,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_compliance_governance_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_id uuid;
  v_days integer;
begin
  perform public._cgc279_require_platform_admin();

  v_action := p_payload->>'action';
  v_id := (p_payload->>'id')::uuid;

  case v_action
    when 'create_policy' then
      insert into public.compliance_governance_policies (
        policy_name, category, owner, effective_date, review_date, status, risk_level, summary
      ) values (
        coalesce(p_payload->>'policy_name', 'New policy'),
        coalesce(p_payload->>'category', 'operational_standards'),
        coalesce(p_payload->>'owner', ''),
        coalesce((p_payload->>'effective_date')::date, current_date),
        coalesce((p_payload->>'review_date')::date, current_date + 365),
        'draft',
        coalesce(p_payload->>'risk_level', 'medium'),
        coalesce(p_payload->>'summary', '')
      )
      returning id into v_id;
      perform public._cgc279_log_audit('policy_created', 'Governance policy created.', p_payload);

    when 'update_policy_status' then
      update public.compliance_governance_policies set
        status = coalesce(p_payload->>'status', status),
        updated_at = now()
      where id = v_id;
      perform public._cgc279_log_audit('policy_updated', coalesce(p_payload->>'summary', 'Policy status updated.'), p_payload);

    when 'approve_request' then
      update public.compliance_governance_approvals set
        status = 'approved',
        updated_at = now()
      where id = v_id;
      perform public._cgc279_log_audit('approval_completed', coalesce(p_payload->>'summary', 'Approval request approved.'), p_payload);

    when 'reject_request' then
      update public.compliance_governance_approvals set
        status = 'rejected',
        updated_at = now()
      where id = v_id;
      perform public._cgc279_log_audit('approval_completed', coalesce(p_payload->>'summary', 'Approval request rejected.'), p_payload);

    when 'request_changes' then
      update public.compliance_governance_approvals set
        status = 'changes_requested',
        updated_at = now()
      where id = v_id;
      perform public._cgc279_log_audit('approval_completed', coalesce(p_payload->>'summary', 'Changes requested on approval.'), p_payload);

    when 'escalate_request' then
      update public.compliance_governance_approvals set
        status = 'escalated',
        priority = 'critical',
        updated_at = now()
      where id = v_id;
      perform public._cgc279_log_audit('approval_completed', coalesce(p_payload->>'summary', 'Approval request escalated.'), p_payload);

    when 'update_retention' then
      v_days := (p_payload->>'retention_days')::integer;
      update public.compliance_governance_retention_controls set
        retention_days = coalesce(v_days, retention_days),
        updated_at = now()
      where id = v_id;
      perform public._cgc279_log_audit('policy_updated', coalesce(p_payload->>'summary', 'Data retention period updated.'), p_payload);

    when 'resolve_alert' then
      update public.compliance_governance_alerts set resolved = true where id = v_id;

    when 'raise_exception' then
      insert into public.compliance_governance_exceptions (
        title, category, owner, risk_level, status, summary, expires_at
      ) values (
        coalesce(p_payload->>'title', 'Governance exception'),
        coalesce(p_payload->>'category', 'operational_standards'),
        coalesce(p_payload->>'owner', ''),
        coalesce(p_payload->>'risk_level', 'high'),
        'open',
        coalesce(p_payload->>'summary', ''),
        (p_payload->>'expires_at')::date
      )
      returning id into v_id;
      perform public._cgc279_log_audit('governance_exception_raised', coalesce(p_payload->>'summary', 'Governance exception raised.'), p_payload);

    when 'resolve_exception' then
      update public.compliance_governance_exceptions set status = 'resolved' where id = v_id;
      perform public._cgc279_log_audit('governance_exception_raised', 'Governance exception resolved.', p_payload);

    when 'complete_access_review' then
      update public.compliance_governance_access_records set
        reviewed_at = now()
      where id = v_id;
      perform public._cgc279_log_audit('access_review_completed', coalesce(p_payload->>'summary', 'Access review completed.'), p_payload);

    when 'generate_report' then
      perform public._cgc279_log_audit(
        'compliance_report_generated',
        coalesce(p_payload->>'summary', format('Compliance report generated (%s).', coalesce(p_payload->>'format', 'csv'))),
        p_payload
      );

    else
      raise exception 'Invalid action';
  end case;

  return public.get_compliance_governance_center(coalesce(p_payload->'filters', '{}'::jsonb));
end;
$$;

grant execute on function public.get_compliance_governance_center(jsonb) to authenticated;
grant execute on function public.record_compliance_governance_action(jsonb) to authenticated;
