-- Phase 574 — Organizational Learning, Lessons Learned & Continuous Improvement Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/learning-center (distinct from Learning Engine at /app/learning)
-- Helpers: _cmol574_*

create table if not exists public.organization_companion_learning_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  learning_center_enabled boolean not null default true,
  improvement_pipeline_enabled boolean not null default true,
  retrospective_enabled boolean not null default true,
  mistake_detection_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_learning_settings enable row level security;
revoke all on public.organization_companion_learning_settings from authenticated, anon;

create table if not exists public.organization_companion_learning_lessons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  lesson_key text not null,
  lesson_id text not null,
  lesson_title text not null,
  lesson_category text not null check (
    lesson_category in (
      'project', 'customer', 'supplier', 'support',
      'financial', 'operational', 'custom'
    )
  ),
  lesson_source text not null default '',
  owner_name text not null default '',
  impact text not null default '',
  lesson_status text not null default 'open' check (
    lesson_status in ('open', 'reviewed', 'improvement_planned', 'implemented', 'archived')
  ),
  recorded_at date not null default current_date,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, lesson_key)
);

alter table public.organization_companion_learning_lessons enable row level security;
revoke all on public.organization_companion_learning_lessons from authenticated, anon;

create table if not exists public.organization_companion_learning_improvements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  improvement_key text not null,
  improvement_title text not null,
  pipeline_stage text not null default 'suggestion' check (
    pipeline_stage in ('suggestion', 'review', 'approval', 'implementation', 'outcome', 'validation')
  ),
  pipeline_status text not null default 'active' check (
    pipeline_status in ('active', 'completed', 'blocked', 'archived')
  ),
  owner_name text not null default '',
  expected_impact text not null default '',
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'failed', 'skipped')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, improvement_key)
);

alter table public.organization_companion_learning_improvements enable row level security;
revoke all on public.organization_companion_learning_improvements from authenticated, anon;

create table if not exists public.organization_companion_learning_successes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  success_key text not null,
  success_title text not null,
  success_type text not null check (
    success_type in (
      'project', 'campaign', 'process', 'decision', 'partnership', 'custom'
    )
  ),
  success_date date not null default current_date,
  impact text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, success_key)
);

alter table public.organization_companion_learning_successes enable row level security;
revoke all on public.organization_companion_learning_successes from authenticated, anon;

create table if not exists public.organization_companion_learning_retrospectives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  retrospective_key text not null,
  retrospective_title text not null,
  retrospective_type text not null check (
    retrospective_type in ('project', 'quarterly', 'department', 'annual')
  ),
  retrospective_status text not null default 'scheduled' check (
    retrospective_status in ('scheduled', 'in_progress', 'completed', 'archived')
  ),
  what_worked text not null default '',
  what_failed text not null default '',
  what_surprised text not null default '',
  what_should_change text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, retrospective_key)
);

alter table public.organization_companion_learning_retrospectives enable row level security;
revoke all on public.organization_companion_learning_retrospectives from authenticated, anon;

create table if not exists public.organization_companion_learning_mistake_patterns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pattern_key text not null,
  pattern_title text not null,
  pattern_type text not null check (
    pattern_type in (
      'repeated_delay', 'approval_issue', 'customer_complaint',
      'supplier_problem', 'project_failure', 'custom'
    )
  ),
  occurrence_count integer not null default 0,
  pattern_status text not null default 'active' check (
    pattern_status in ('active', 'mitigating', 'resolved')
  ),
  improvement_recommended boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pattern_key)
);

alter table public.organization_companion_learning_mistake_patterns enable row level security;
revoke all on public.organization_companion_learning_mistake_patterns from authenticated, anon;

create table if not exists public.organization_companion_learning_library (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  library_key text not null,
  library_title text not null,
  library_type text not null check (
    library_type in ('lesson', 'review', 'success_story', 'best_practice', 'template', 'playbook')
  ),
  department text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, library_key)
);

alter table public.organization_companion_learning_library enable row level security;
revoke all on public.organization_companion_learning_library from authenticated, anon;

create table if not exists public.organization_companion_learning_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'high_friction', 'repeated_delay', 'manual_work',
      'knowledge_gap', 'approval_bottleneck', 'custom'
    )
  ),
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'critical')
  ),
  companion_recommended boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, opportunity_key)
);

alter table public.organization_companion_learning_opportunities enable row level security;
revoke all on public.organization_companion_learning_opportunities from authenticated, anon;

create table if not exists public.organization_companion_learning_department_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_key text not null,
  department_title text not null,
  learning_score numeric(5,2) not null default 0 check (learning_score between 0 and 100),
  learning_status text not null default 'stagnating' check (
    learning_status in ('excellent', 'improving', 'stagnating', 'improvement_needed')
  ),
  review_activity numeric(5,2) not null default 0,
  lesson_capture numeric(5,2) not null default 0,
  improvement_completion numeric(5,2) not null default 0,
  knowledge_sharing numeric(5,2) not null default 0,
  success_documentation numeric(5,2) not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, department_key)
);

alter table public.organization_companion_learning_department_scores enable row level security;
revoke all on public.organization_companion_learning_department_scores from authenticated, anon;

create table if not exists public.organization_companion_learning_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  lessons jsonb not null default '[]'::jsonb,
  reviews jsonb not null default '[]'::jsonb,
  improvements jsonb not null default '[]'::jsonb,
  success_stories jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_learning_business_packs enable row level security;
revoke all on public.organization_companion_learning_business_packs from authenticated, anon;

create table if not exists public.organization_companion_learning_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'learning' check (
    audit_category in (
      'lesson', 'review', 'improvement', 'success', 'pattern', 'report', 'learning'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_learning_audit_logs_org_idx
  on public.organization_companion_learning_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_learning_audit_logs enable row level security;
revoke all on public.organization_companion_learning_audit_logs from authenticated, anon;

create or replace function public._cmol574_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmol574_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'learning'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_learning_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'learning'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmol574_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_learning_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmol574_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_learning_lessons where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_learning_lessons (
    organization_id, lesson_key, lesson_id, lesson_title, lesson_category, lesson_source, owner_name, impact, lesson_status, summary
  ) values
    (p_org_id, 'les_project_launch', 'LL-2025-001', 'Project launch delays without buffer', 'project', 'Q1 Product Launch', 'Project Lead', 'high', 'improvement_planned',
     'Projects without timeline buffer repeat delays — lesson captured for pipeline.'),
    (p_org_id, 'les_customer_esc', 'LL-2025-002', 'Escalation without knowledge owner', 'customer', 'Support Review', 'Support Lead', 'moderate', 'reviewed',
     'Customer escalations repeat when knowledge owner is unclear.'),
    (p_org_id, 'les_supplier', 'LL-2025-003', 'Supplier onboarding without pilot', 'supplier', 'Vendor Migration', 'Procurement', 'high', 'implemented',
     'Supplier changes without pilot phase caused rework — now standard practice.'),
    (p_org_id, 'les_finance_forecast', 'LL-2025-004', 'Marketing forecast optimism', 'financial', 'Budget Review', 'CFO', 'moderate', 'open',
     'Financial forecasts for marketing consistently optimistic by ~8%.');

  insert into public.organization_companion_learning_improvements (
    organization_id, improvement_key, improvement_title, pipeline_stage, pipeline_status, owner_name, expected_impact, verification_status, summary
  ) values
    (p_org_id, 'imp_timeline_buffer', 'Mandatory timeline buffer on projects', 'implementation', 'active', 'Project Lead', 'Reduce delay recurrence 40%', 'pending',
     'Observation → Lesson → Recommendation → Approval → Improvement → Verification.'),
    (p_org_id, 'imp_escalation_owner', 'Escalation knowledge owner registry', 'approval', 'active', 'Support Lead', 'Faster resolution', 'pending',
     'Link to Expertise Center knowledge owners.'),
    (p_org_id, 'imp_supplier_pilot', 'Supplier pilot requirement', 'validation', 'completed', 'Procurement', 'Zero failed migrations', 'verified',
     'Improvement validated — supplier pilot now mandatory.');

  insert into public.organization_companion_learning_successes (
    organization_id, success_key, success_title, success_type, impact, summary
  ) values
    (p_org_id, 'suc_support_pack', 'Support Pack rollout', 'process', 'Response time improved 22%', 'Learn from success — structured onboarding worked.'),
    (p_org_id, 'suc_partner_nordic', 'Nordic partner campaign', 'campaign', 'Partner pipeline +35%', 'Successful campaign — replicate playbook.'),
    (p_org_id, 'suc_vendor_migration', 'Vendor migration zero downtime', 'project', '18% cost reduction', 'Successful project — document as success story.');

  insert into public.organization_companion_learning_retrospectives (
    organization_id, retrospective_key, retrospective_title, retrospective_type, retrospective_status,
    what_worked, what_failed, what_surprised, what_should_change, summary
  ) values
    (p_org_id, 'retro_q1', 'Q1 Quarterly Review', 'quarterly', 'completed',
     'Cross-team communication improved', 'Timeline estimates too optimistic', 'Partner channel exceeded forecast',
     'Add buffer to all project timelines', 'Quarterly retrospective complete — Companion assisted.'),
    (p_org_id, 'retro_support', 'Support Department Review', 'department', 'in_progress',
     'Knowledge base adoption', 'Escalation handoffs', 'Customer satisfaction uptick',
     'Assign escalation owners', 'Department review in progress.');

  insert into public.organization_companion_learning_mistake_patterns (
    organization_id, pattern_key, pattern_title, pattern_type, occurrence_count, pattern_status, improvement_recommended, summary
  ) values
    (p_org_id, 'pat_delay', 'Project timeline delays', 'repeated_delay', 5, 'active', true,
     'Issue repeated 5 times — pattern detected — improvement recommended.'),
    (p_org_id, 'pat_approval', 'Finance approval bottlenecks Q1', 'approval_issue', 4, 'mitigating', true,
     'Repeated approval delays in Q1 — bottleneck identified.'),
    (p_org_id, 'pat_complaint', 'Repeat customer escalation theme', 'customer_complaint', 3, 'active', true,
     'Same complaint category recurring — knowledge gap suspected.');

  insert into public.organization_companion_learning_library (
    organization_id, library_key, library_title, library_type, department, summary
  ) values
    (p_org_id, 'lib_supplier_playbook', 'Supplier Pilot Playbook', 'playbook', 'Operations', 'Best practice from vendor migration success.'),
    (p_org_id, 'lib_q1_retro', 'Q1 Retrospective Notes', 'review', 'Executive', 'Quarterly review — reusable organizational memory.'),
    (p_org_id, 'lib_support_success', 'Support Pack Success Story', 'success_story', 'Support', 'Document what worked for replication.');

  insert into public.organization_companion_learning_opportunities (
    organization_id, opportunity_key, opportunity_title, opportunity_type, priority, companion_recommended, summary
  ) values
    (p_org_id, 'opp_manual_report', 'Manual weekly reporting', 'manual_work', 'high', true, 'High friction — automate reporting pipeline.'),
    (p_org_id, 'opp_approval_queue', 'Approval queue bottleneck', 'approval_bottleneck', 'critical', true, 'Repeated delays — streamline approval workflow.'),
    (p_org_id, 'opp_kb_gap', 'Support knowledge gap on refunds', 'knowledge_gap', 'moderate', true, 'Knowledge gap causing repeat escalations.');

  insert into public.organization_companion_learning_department_scores (
    organization_id, department_key, department_title, learning_score, learning_status,
    review_activity, lesson_capture, improvement_completion, knowledge_sharing, success_documentation, summary
  ) values
    (p_org_id, 'dept_support', 'Support', 82, 'improving', 85, 78, 80, 75, 88, 'Support Pack driving improvement culture.'),
    (p_org_id, 'dept_operations', 'Operations', 76, 'improving', 70, 82, 74, 80, 72, 'Strong lesson capture from projects.'),
    (p_org_id, 'dept_finance', 'Finance', 68, 'stagnating', 65, 60, 70, 62, 55, 'Review activity needs increase.'),
    (p_org_id, 'dept_executive', 'Executive', 88, 'excellent', 92, 85, 90, 88, 86, 'Quarterly reviews consistent.');

  insert into public.organization_companion_learning_business_packs (
    organization_id, pack_key, pack_title, lessons, reviews, improvements, success_stories, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack', '["Marketing forecast optimism"]'::jsonb, '["Q1 Budget Review"]'::jsonb,
     '["Forecast buffer process"]'::jsonb, '[]'::jsonb, 'Finance Pack → Financial Lessons.'),
    (p_org_id, 'support', 'Support Pack', '["Escalation without owner"]'::jsonb, '["Support Department Review"]'::jsonb,
     '["Escalation owner registry"]'::jsonb, '["Support Pack rollout"]'::jsonb, 'Support Pack → Support Improvements.'),
    (p_org_id, 'warehouse', 'Warehouse Pack', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, 'Warehouse Pack → Operational Improvements.');
end; $$;

create or replace function public.get_organization_companion_learning_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_lessons jsonb; v_improvements jsonb;
  v_successes jsonb; v_retrospectives jsonb; v_patterns jsonb; v_library jsonb;
  v_opportunities jsonb; v_departments jsonb; v_packs jsonb; v_executive jsonb;
  v_companion jsonb; v_reports jsonb; v_audit jsonb;
begin
  v_org_id := public._cmol574_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmol574_ensure_settings(v_org_id);
  perform public._cmol574_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'total_lessons', (select count(*) from public.organization_companion_learning_lessons where organization_id = v_org_id),
    'active_improvements', (select count(*) from public.organization_companion_learning_improvements where organization_id = v_org_id and pipeline_status = 'active'),
    'success_stories', (select count(*) from public.organization_companion_learning_successes where organization_id = v_org_id),
    'reviews_completed', (select count(*) from public.organization_companion_learning_retrospectives where organization_id = v_org_id and retrospective_status = 'completed'),
    'patterns_detected', (select count(*) from public.organization_companion_learning_mistake_patterns where organization_id = v_org_id and pattern_status = 'active'),
    'opportunities', (select count(*) from public.organization_companion_learning_opportunities where organization_id = v_org_id),
    'library_items', (select count(*) from public.organization_companion_learning_library where organization_id = v_org_id),
    'avg_learning_score', coalesce((select round(avg(learning_score)) from public.organization_companion_learning_department_scores where organization_id = v_org_id), 0)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'lesson_key', l.lesson_key, 'lesson_id', l.lesson_id, 'lesson_title', l.lesson_title,
    'lesson_category', l.lesson_category, 'lesson_source', l.lesson_source, 'owner_name', l.owner_name,
    'impact', l.impact, 'lesson_status', l.lesson_status, 'recorded_at', l.recorded_at, 'summary', l.summary
  ) order by l.recorded_at desc), '[]'::jsonb)
  into v_lessons from public.organization_companion_learning_lessons l where l.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'improvement_key', i.improvement_key, 'improvement_title', i.improvement_title,
    'pipeline_stage', i.pipeline_stage, 'pipeline_status', i.pipeline_status,
    'owner_name', i.owner_name, 'expected_impact', i.expected_impact,
    'verification_status', i.verification_status, 'summary', i.summary
  ) order by i.pipeline_stage), '[]'::jsonb)
  into v_improvements from public.organization_companion_learning_improvements i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'success_key', s.success_key, 'success_title', s.success_title, 'success_type', s.success_type,
    'success_date', s.success_date, 'impact', s.impact, 'summary', s.summary
  ) order by s.success_date desc), '[]'::jsonb)
  into v_successes from public.organization_companion_learning_successes s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'retrospective_key', r.retrospective_key, 'retrospective_title', r.retrospective_title,
    'retrospective_type', r.retrospective_type, 'retrospective_status', r.retrospective_status,
    'what_worked', r.what_worked, 'what_failed', r.what_failed,
    'what_surprised', r.what_surprised, 'what_should_change', r.what_should_change, 'summary', r.summary
  ) order by r.retrospective_title), '[]'::jsonb)
  into v_retrospectives from public.organization_companion_learning_retrospectives r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pattern_key', p.pattern_key, 'pattern_title', p.pattern_title, 'pattern_type', p.pattern_type,
    'occurrence_count', p.occurrence_count, 'pattern_status', p.pattern_status,
    'improvement_recommended', p.improvement_recommended, 'summary', p.summary
  ) order by p.occurrence_count desc), '[]'::jsonb)
  into v_patterns from public.organization_companion_learning_mistake_patterns p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'library_key', lb.library_key, 'library_title', lb.library_title, 'library_type', lb.library_type,
    'department', lb.department, 'summary', lb.summary
  ) order by lb.library_title), '[]'::jsonb)
  into v_library from public.organization_companion_learning_library lb where lb.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
    'opportunity_type', o.opportunity_type, 'priority', o.priority,
    'companion_recommended', o.companion_recommended, 'summary', o.summary
  ) order by case o.priority when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end), '[]'::jsonb)
  into v_opportunities from public.organization_companion_learning_opportunities o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'department_key', d.department_key, 'department_title', d.department_title,
    'learning_score', d.learning_score, 'learning_status', d.learning_status,
    'review_activity', d.review_activity, 'lesson_capture', d.lesson_capture,
    'improvement_completion', d.improvement_completion, 'knowledge_sharing', d.knowledge_sharing,
    'success_documentation', d.success_documentation, 'summary', d.summary
  ) order by d.learning_score desc), '[]'::jsonb)
  into v_departments from public.organization_companion_learning_department_scores d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', bp.pack_key, 'pack_title', bp.pack_title, 'lessons', bp.lessons,
    'reviews', bp.reviews, 'improvements', bp.improvements, 'success_stories', bp.success_stories, 'summary', bp.summary
  ) order by bp.pack_title), '[]'::jsonb)
  into v_packs from public.organization_companion_learning_business_packs bp where bp.organization_id = v_org_id;

  select jsonb_build_object(
    'top_lessons', (select jsonb_agg(x) from (select jsonb_build_object('title', lesson_title, 'impact', impact) as x from public.organization_companion_learning_lessons where organization_id = v_org_id order by case impact when 'high' then 1 when 'moderate' then 2 else 3 end limit 5) t),
    'top_improvements', v_improvements,
    'improvement_trends', v_patterns,
    'success_stories', v_successes,
    'risk_reductions', (select count(*) from public.organization_companion_learning_improvements where organization_id = v_org_id and verification_status = 'verified'),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Implement approval queue automation', 'reason', 'Critical bottleneck detected'),
      jsonb_build_object('title', 'Complete Support department retrospective', 'reason', 'Review in progress'),
      jsonb_build_object('title', 'Document Support Pack as success story', 'reason', 'Replicate success')
    )
  ) into v_executive;

  select jsonb_build_object(
    'learning_advisor_prompts', jsonb_build_array(
      'What have we learned recently?', 'What mistakes keep repeating?',
      'What improvements had the highest impact?', 'What departments are improving fastest?',
      'Generate learning report.'
    )
  ) into v_companion;

  select jsonb_build_object(
    'executive_dashboard', v_executive,
    'learning_library', v_library,
    'department_scores', v_departments,
    'improvement_opportunities', v_opportunities
  ) into v_reports;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_learning_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Experience alone does not create improvement. Learning creates improvement.',
    'philosophy', 'One Learning Center. One Improvement Engine. One Continuous Improvement Framework.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'lessons', v_lessons,
    'lessons_learned', v_lessons,
    'improvements', v_improvements,
    'successes', v_successes,
    'reviews', v_retrospectives,
    'retrospectives', v_retrospectives,
    'patterns', v_patterns,
    'repeated_mistakes', v_patterns,
    'library', v_library,
    'learning_library', v_library,
    'opportunities', v_opportunities,
    'improvement_opportunities', v_opportunities,
    'department_scores', v_departments,
    'business_packs', v_packs,
    'executive_dashboard', v_executive,
    'recommendations', (v_executive->'companion_recommendations'),
    'companion', v_companion,
    'reports', v_reports,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'learning_center', '/app/learning-center',
      'learning_engine', '/app/learning'
    ),
    'mobile_access', jsonb_build_object(
      'review_lessons', true, 'submit_improvements', true,
      'review_success_stories', true, 'participate_reviews', true, 'view_learning_reports', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_learning_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_lesson_key text := coalesce(p_payload->>'lesson_key', '');
  v_improvement_key text := coalesce(p_payload->>'improvement_key', '');
begin
  v_org_id := public._cmol574_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_learning' then
    perform public._cmol574_log(v_org_id, 'learning_refreshed', 'Learning center refreshed', p_payload, 'learning');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_lesson' then
    perform public._cmol574_log(v_org_id, 'lesson_created', 'Lesson created', p_payload, 'lesson');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'complete_review' then
    perform public._cmol574_log(v_org_id, 'review_completed', 'Retrospective review completed', p_payload, 'review');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'approve_improvement' and v_improvement_key <> '' then
    update public.organization_companion_learning_improvements
    set pipeline_stage = 'approval' where organization_id = v_org_id and improvement_key = v_improvement_key;
    perform public._cmol574_log(v_org_id, 'improvement_approved', 'Improvement approved', p_payload, 'improvement');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'implement_improvement' and v_improvement_key <> '' then
    update public.organization_companion_learning_improvements
    set pipeline_stage = 'implementation' where organization_id = v_org_id and improvement_key = v_improvement_key;
    perform public._cmol574_log(v_org_id, 'improvement_implemented', 'Improvement implemented', p_payload, 'improvement');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'add_success_story' then
    perform public._cmol574_log(v_org_id, 'success_story_added', 'Success story added', p_payload, 'success');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'detect_pattern' then
    perform public._cmol574_log(v_org_id, 'pattern_detected', 'Repeated mistake pattern detected', p_payload, 'pattern');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_learning_report' then
    perform public._cmol574_log(v_org_id, 'learning_report_generated', 'Learning report generated', p_payload, 'report');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'submit_improvement' then
    perform public._cmol574_log(v_org_id, 'improvement_submitted', 'Improvement suggestion submitted', p_payload, 'improvement');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_learning_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmol574_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_learning_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/learning-center');
end; $$;

create or replace function public.get_assistant_companion_learning_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmol574_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations remember lessons, capture success, and continuously improve.',
    'advisor_prompts', jsonb_build_array(
      'What have we learned recently?', 'What mistakes keep repeating?',
      'What improvements had the highest impact?', 'Generate learning report.'
    ),
    'total_lessons', (select count(*) from public.organization_companion_learning_lessons where organization_id = v_org_id),
    'patterns_active', (select count(*) from public.organization_companion_learning_mistake_patterns where organization_id = v_org_id and pattern_status = 'active'),
    'route', '/app/learning-center'
  );
end; $$;

grant execute on function public.get_organization_companion_learning_center(text) to authenticated;
grant execute on function public.perform_organization_companion_learning_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_learning_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_learning_advisor_context() to authenticated;
