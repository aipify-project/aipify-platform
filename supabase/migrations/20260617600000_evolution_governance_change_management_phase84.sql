-- Phase 84 — Evolution Governance & Change Management Engine
-- Core principle: Aipify proposes evolution. Humans approve evolution.

-- Extend Trust Engine decision types
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance'
  )
);

-- ---------------------------------------------------------------------------
-- 1. evolution_proposals (tenant-scoped governance)
-- ---------------------------------------------------------------------------
create table if not exists public.evolution_proposals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  category text not null check (
    category in (
      'knowledge', 'automation', 'workflow', 'blueprint', 'marketplace',
      'prompt', 'desktop', 'policy'
    )
  ),
  title text not null,
  description text not null,
  source text not null default 'learning_engine' check (
    source in (
      'learning_engine', 'global_learning', 'evolution_lab', 'knowledge_gap',
      'strategic_intelligence', 'human_feedback', 'simulation', 'operational_watcher'
    )
  ),
  expected_value jsonb not null default '{}'::jsonb,
  expected_benefits text,
  potential_risks text,
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'proposed' check (
    status in (
      'proposed', 'under_review', 'approved', 'scheduled', 'implemented',
      'validated', 'archived', 'rejected'
    )
  ),
  recommended_reviewers jsonb not null default '[]'::jsonb,
  implementation_recommendation text,
  rollback_guidance text,
  supporting_evidence jsonb not null default '[]'::jsonb,
  confidence_level text not null default 'medium' check (
    confidence_level in ('high', 'medium', 'low')
  ),
  simulation_required boolean not null default false,
  simulation_validated boolean not null default false,
  source_ref_id uuid,
  scheduled_at timestamptz,
  implemented_at timestamptz,
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evolution_proposals_tenant_status_idx
  on public.evolution_proposals (tenant_id, status, risk_level, created_at desc);

create unique index if not exists evolution_proposals_tenant_title_active_idx
  on public.evolution_proposals (tenant_id, title)
  where status not in ('archived', 'rejected');

alter table public.evolution_proposals enable row level security;
revoke all on public.evolution_proposals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. evolution_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.evolution_reviews (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.evolution_proposals (id) on delete cascade,
  reviewer_id uuid references public.users (id) on delete set null,
  decision text not null check (
    decision in ('approve_review', 'reject', 'request_revision', 'defer')
  ),
  notes text,
  reviewed_at timestamptz not null default now()
);

create index if not exists evolution_reviews_proposal_idx
  on public.evolution_reviews (proposal_id, reviewed_at desc);

alter table public.evolution_reviews enable row level security;
revoke all on public.evolution_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. evolution_approvals
-- ---------------------------------------------------------------------------
create table if not exists public.evolution_approvals (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.evolution_proposals (id) on delete cascade,
  approver_id uuid references public.users (id) on delete set null,
  approval_level text not null check (
    approval_level in ('reviewer', 'governance', 'executive')
  ),
  approved_at timestamptz not null default now()
);

create index if not exists evolution_approvals_proposal_idx
  on public.evolution_approvals (proposal_id, approved_at desc);

alter table public.evolution_approvals enable row level security;
revoke all on public.evolution_approvals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. evolution_history
-- ---------------------------------------------------------------------------
create table if not exists public.evolution_history (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.evolution_proposals (id) on delete cascade,
  outcome text not null,
  implementation_status text not null default 'pending' check (
    implementation_status in (
      'pending', 'in_progress', 'completed', 'failed', 'rolled_back'
    )
  ),
  notes text,
  recorded_at timestamptz not null default now()
);

create index if not exists evolution_history_proposal_idx
  on public.evolution_history (proposal_id, recorded_at desc);

alter table public.evolution_history enable row level security;
revoke all on public.evolution_history from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. evolution_settings
-- ---------------------------------------------------------------------------
create table if not exists public.evolution_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  suggestions_enabled boolean not null default true,
  low_risk_auto_publish boolean not null default false,
  simulation_required_for_high boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.evolution_settings enable row level security;
revoke all on public.evolution_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. evolution_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.evolution_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.evolution_briefings enable row level security;
revoke all on public.evolution_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. evolution_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.evolution_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.evolution_audit_log enable row level security;
revoke all on public.evolution_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers (_evo_)
-- ---------------------------------------------------------------------------
create or replace function public._evo_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._evo_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._evo_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.evolution_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._evo_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'evolution_' || p_event_type, 'evolution_governance', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._evo_ensure_settings(p_tenant_id uuid)
returns public.evolution_settings language plpgsql security definer set search_path = public as $$
declare v_row public.evolution_settings;
begin
  insert into public.evolution_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.evolution_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._evo_approval_level(p_risk_level text)
returns text language sql immutable as $$
  select case p_risk_level
    when 'low' then 'reviewer'
    when 'medium' then 'reviewer'
    when 'high' then 'governance'
    when 'critical' then 'executive'
    else 'governance'
  end;
$$;

create or replace function public._evo_risk_priority(p_risk_level text)
returns int language sql immutable as $$
  select case p_risk_level
    when 'critical' then 1
    when 'high' then 2
    when 'medium' then 3
    else 4
  end;
$$;

create or replace function public._evo_create_task(
  p_tenant_id uuid,
  p_proposal_id uuid,
  p_task_type text,
  p_title text,
  p_description text,
  p_priority text,
  p_requires_approval boolean default true
)
returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._ach_upsert_item(
    p_tenant_id,
    'evolution.' || p_task_type || '.' || p_proposal_id::text,
    p_title,
    p_description,
    'evolution_governance',
    'evolution_proposal',
    p_proposal_id,
    'evolution',
    case p_priority when 'critical' then 'critical' when 'high' then 'high' else 'medium' end,
    p_priority,
    case p_priority when 'critical' then 'executive' when 'high' then 'governance' else 'reviewer' end,
    now() + interval '7 days',
    '/app/evolution',
    p_requires_approval,
    'Evolution Governance requires human authorization before any change is implemented.',
    jsonb_build_object('task_type', p_task_type, 'proposal_id', p_proposal_id)
  );
end; $$;

create or replace function public._evo_trust_explanation(
  p_proposal public.evolution_proposals,
  p_action text default 'proposed'
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.generate_decision_explanation(
    'evo-' || p_proposal.id::text,
    'evolution_governance',
    'evolution_governance',
    'Evolution proposal: ' || p_proposal.title,
    'Risk level ' || p_proposal.risk_level || '. Source: ' || p_proposal.source || '. ' ||
      coalesce(p_proposal.potential_risks, 'Potential risks documented in proposal.'),
    coalesce(p_proposal.supporting_evidence, '[]'::jsonb),
    jsonb_build_array(
      'approval_matrix_' || p_proposal.risk_level,
      'human_authority_required',
      'no_autonomous_implementation'
    ),
    p_proposal.confidence_level,
    '["defer","reject","revise"]'::jsonb,
    jsonb_build_array(
      'Review proposal evidence',
      'Approve or reject with documented rationale',
      coalesce(p_proposal.implementation_recommendation, 'Follow implementation recommendation')
    ),
    jsonb_build_object(
      'simple', 'Aipify recommends this improvement. Humans must approve before anything changes.',
      'operational', 'Evolution Governance classified this as ' || p_proposal.risk_level || ' risk requiring ' ||
        public._evo_approval_level(p_proposal.risk_level) || ' approval.',
      'technical', 'Proposal ' || p_action || ' from ' || p_proposal.source || ' with confidence ' ||
        p_proposal.confidence_level || '. Rollback: ' || coalesce(p_proposal.rollback_guidance, 'See proposal.')
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Seed proposals from integrated sources
-- ---------------------------------------------------------------------------
create or replace function public._evo_seed_proposals(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_settings public.evolution_settings;
  v_prop public.evolution_proposals;
begin
  v_settings := public._evo_ensure_settings(p_tenant_id);
  if not v_settings.suggestions_enabled then return; end if;

  -- Strategic Intelligence → workflow/automation proposals
  insert into public.evolution_proposals (
    tenant_id, category, title, description, source, expected_value,
    expected_benefits, potential_risks, risk_level, status,
    recommended_reviewers, implementation_recommendation, rollback_guidance,
    supporting_evidence, confidence_level, simulation_required, source_ref_id
  )
  select
    p_tenant_id,
    case o.category
      when 'knowledge' then 'knowledge'
      when 'automation' then 'automation'
      when 'blueprint' then 'blueprint'
      when 'marketplace' then 'marketplace'
      else 'workflow'
    end,
    'Strategic: ' || o.title,
    o.description,
    'strategic_intelligence',
    jsonb_build_object(
      'time_savings', 'Estimated from strategic opportunity analysis',
      'strategic_value', coalesce(o.expected_value, 'Medium-term organizational benefit')
    ),
    o.expected_value,
    'Change may affect existing workflows. Review with process owners.',
    o.risk_level,
    'proposed',
    '["process_owner","governance_reviewer"]'::jsonb,
    'Review strategic opportunity and approve phased implementation.',
    'Document current state before changes. Revert to prior workflow configuration if issues arise.',
    coalesce(o.supporting_evidence, '[]'::jsonb),
    o.confidence_level,
    o.risk_level in ('high', 'critical'),
    o.id
  from public.strategic_opportunities o
  where o.tenant_id = p_tenant_id and o.status = 'open'
  and not exists (
    select 1 from public.evolution_proposals ep
    where ep.tenant_id = p_tenant_id and ep.source_ref_id = o.id and ep.status not in ('archived', 'rejected')
  )
  limit 5;

  -- Knowledge gaps → knowledge proposals (low risk)
  insert into public.evolution_proposals (
    tenant_id, category, title, description, source, expected_value,
    expected_benefits, potential_risks, risk_level, status,
    recommended_reviewers, implementation_recommendation, rollback_guidance,
    supporting_evidence, confidence_level, source_ref_id
  )
  select
    p_tenant_id,
    'knowledge',
    'Knowledge: ' || left(coalesce(kg.suggested_title, kg.question, 'Documentation gap'), 80),
    coalesce(kg.question, 'Missing or outdated knowledge detected.'),
    'knowledge_gap',
    jsonb_build_object(
      'knowledge_improvement', 'Reduced support escalations and faster self-service',
      'time_savings', 'Fewer repeated support inquiries'
    ),
    'Improved self-service accuracy and reduced support load.',
    'Content may need review for accuracy and brand voice.',
    'low',
    case when v_settings.low_risk_auto_publish then 'approved' else 'proposed' end,
    '["knowledge_owner"]'::jsonb,
    'Draft FAQ or documentation update for Knowledge Owner review.',
    'Restore previous article version from Knowledge Center history.',
    jsonb_build_array(jsonb_build_object('gap_id', kg.id, 'frequency', kg.frequency_count)),
    'medium',
    kg.id
  from public.aipify_knowledge_gaps kg
  where kg.tenant_id = p_tenant_id
    and kg.status in ('open', 'reviewing')
  and not exists (
    select 1 from public.evolution_proposals ep
    where ep.tenant_id = p_tenant_id and ep.source_ref_id = kg.id and ep.status not in ('archived', 'rejected')
  )
  limit 5;

  -- Friction events → workflow proposals (medium risk)
  insert into public.evolution_proposals (
    tenant_id, category, title, description, source, expected_value,
    expected_benefits, potential_risks, risk_level, status,
    recommended_reviewers, implementation_recommendation, rollback_guidance,
    supporting_evidence, confidence_level, source_ref_id
  )
  select
    p_tenant_id,
    'workflow',
    'Workflow: Reduce ' || coalesce(fe.category, 'operational') || ' friction',
    coalesce(fe.description, fe.title),
    'operational_watcher',
    jsonb_build_object(
      'efficiency_improvement', 'Reduced repeated friction events',
      'time_savings', 'Estimated 2–4 hours per week for affected teams'
    ),
    'Smoother workflows and fewer repeated blockers.',
    'Process changes may affect team habits. Communicate before rollout.',
    'medium',
    'proposed',
    '["process_owner","team_lead"]'::jsonb,
    'Review friction pattern and pilot workflow adjustment with affected team.',
    'Revert workflow configuration to previous escalation rules.',
    jsonb_build_array(jsonb_build_object('friction_event_id', fe.id, 'category', fe.category)),
    'medium',
    fe.id
  from public.aipify_friction_events fe
  where fe.tenant_id = p_tenant_id and fe.resolved_at is null
  and not exists (
    select 1 from public.evolution_proposals ep
    where ep.tenant_id = p_tenant_id and ep.source_ref_id = fe.id and ep.status not in ('archived', 'rejected')
  )
  limit 3;

  -- Policy proposals from strategic risks (high/critical)
  insert into public.evolution_proposals (
    tenant_id, category, title, description, source, expected_value,
    expected_benefits, potential_risks, risk_level, status,
    recommended_reviewers, implementation_recommendation, rollback_guidance,
    supporting_evidence, confidence_level, simulation_required, source_ref_id
  )
  select
    p_tenant_id,
    'policy',
    'Policy: ' || sr.title,
    sr.description || coalesce(' Mitigation: ' || sr.mitigation_suggestion, ''),
    'strategic_intelligence',
    jsonb_build_object('risk_reduction', 'Addresses identified strategic risk', 'strategic_value', 'High'),
    'Reduced organizational risk exposure.',
    'Policy changes affect governance boundaries. Requires careful review.',
    case sr.impact_level when 'critical' then 'critical' else 'high' end,
    'proposed',
    case sr.impact_level when 'critical' then '["executive","governance"]'::jsonb else '["governance"]'::jsonb end,
    coalesce(sr.mitigation_suggestion, 'Review with Governance before policy adjustment.'),
    'Reinstate previous policy version from Governance audit history.',
    jsonb_build_array(jsonb_build_object('risk_id', sr.id, 'impact', sr.impact_level)),
    sr.confidence_level,
    true,
    sr.id
  from public.strategic_risks sr
  where sr.tenant_id = p_tenant_id and sr.status = 'open'
    and sr.impact_level in ('high', 'critical')
  and not exists (
    select 1 from public.evolution_proposals ep
    where ep.tenant_id = p_tenant_id and ep.source_ref_id = sr.id and ep.status not in ('archived', 'rejected')
  )
  limit 3;

  -- Create review tasks for open proposals
  for v_prop in
    select * from public.evolution_proposals
    where tenant_id = p_tenant_id and status in ('proposed', 'under_review')
    order by public._evo_risk_priority(risk_level), created_at desc
    limit 20
  loop
    perform public._evo_create_task(
      p_tenant_id, v_prop.id, 'review',
      'Review evolution proposal: ' || v_prop.title,
      v_prop.description,
      v_prop.risk_level,
      v_prop.risk_level not in ('low')
    );
    perform public._evo_trust_explanation(v_prop, 'seeded');
  end loop;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Proposal lifecycle RPCs
-- ---------------------------------------------------------------------------
create or replace function public.review_evolution_proposal(
  p_proposal_id uuid,
  p_decision text,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_prop public.evolution_proposals;
  v_review_id uuid;
begin
  v_tenant_id := public._evo_require_tenant();
  select * into v_prop from public.evolution_proposals
  where id = p_proposal_id and tenant_id = v_tenant_id;
  if v_prop.id is null then raise exception 'Proposal not found'; end if;
  if p_decision not in ('approve_review', 'reject', 'request_revision', 'defer') then
    raise exception 'Invalid review decision';
  end if;

  insert into public.evolution_reviews (proposal_id, reviewer_id, decision, notes)
  values (p_proposal_id, public._evo_auth_user_id(), p_decision, p_notes)
  returning id into v_review_id;

  if p_decision = 'reject' then
    update public.evolution_proposals set status = 'rejected', updated_at = now() where id = p_proposal_id;
    insert into public.evolution_history (proposal_id, outcome, implementation_status, notes)
    values (p_proposal_id, 'rejected', 'completed', p_notes);
  elsif p_decision = 'approve_review' then
    update public.evolution_proposals set status = 'under_review', updated_at = now() where id = p_proposal_id;
    perform public._evo_create_task(
      v_tenant_id, p_proposal_id, 'approve',
      'Approve evolution proposal: ' || v_prop.title,
      'Review completed. Governance approval required before implementation.',
      v_prop.risk_level, true
    );
  elsif p_decision = 'request_revision' then
    update public.evolution_proposals set status = 'proposed', updated_at = now() where id = p_proposal_id;
    perform public._evo_create_task(
      v_tenant_id, p_proposal_id, 'revise',
      'Revise evolution proposal: ' || v_prop.title,
      coalesce(p_notes, 'Reviewer requested revision.'),
      v_prop.risk_level, false
    );
  end if;

  perform public._evo_log_audit(v_tenant_id, 'review_' || p_decision,
    'Review decision on: ' || v_prop.title,
    jsonb_build_object('proposal_id', p_proposal_id, 'review_id', v_review_id, 'decision', p_decision));
  perform public._evo_trust_explanation(v_prop, 'reviewed');

  return jsonb_build_object(
    'status', (select status from public.evolution_proposals where id = p_proposal_id),
    'human_authority_required', true,
    'note', 'Humans authorize all evolution. Aipify never implements changes autonomously.'
  );
end; $$;

create or replace function public.approve_evolution_proposal(p_proposal_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_prop public.evolution_proposals;
  v_level text;
  v_approval_id uuid;
begin
  v_tenant_id := public._evo_require_tenant();
  select * into v_prop from public.evolution_proposals
  where id = p_proposal_id and tenant_id = v_tenant_id;
  if v_prop.id is null then raise exception 'Proposal not found'; end if;
  if v_prop.status in ('rejected', 'archived', 'implemented', 'validated') then
    raise exception 'Proposal cannot be approved in current status';
  end if;

  v_level := public._evo_approval_level(v_prop.risk_level);

  if v_prop.risk_level in ('high', 'critical') and v_prop.simulation_required
     and not v_prop.simulation_validated then
    raise exception 'Simulation validation required before approval of high-risk proposals';
  end if;

  insert into public.evolution_approvals (proposal_id, approver_id, approval_level)
  values (p_proposal_id, public._evo_auth_user_id(), v_level)
  returning id into v_approval_id;

  update public.evolution_proposals set status = 'approved', updated_at = now() where id = p_proposal_id;

  perform public._evo_log_audit(v_tenant_id, 'approved',
    'Approved: ' || v_prop.title,
    jsonb_build_object('proposal_id', p_proposal_id, 'approval_level', v_level, 'approval_id', v_approval_id));
  perform public._evo_trust_explanation(v_prop, 'approved');

  return jsonb_build_object(
    'status', 'approved',
    'approval_level', v_level,
    'human_authority_required', true,
    'note', 'Approval recorded. Implementation still requires explicit scheduling and execution by authorized personnel.'
  );
end; $$;

create or replace function public.reject_evolution_proposal(
  p_proposal_id uuid,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_prop public.evolution_proposals;
begin
  v_tenant_id := public._evo_require_tenant();
  select * into v_prop from public.evolution_proposals
  where id = p_proposal_id and tenant_id = v_tenant_id;
  if v_prop.id is null then raise exception 'Proposal not found'; end if;

  update public.evolution_proposals set status = 'rejected', updated_at = now() where id = p_proposal_id;
  insert into public.evolution_history (proposal_id, outcome, implementation_status, notes)
  values (p_proposal_id, 'rejected', 'completed', p_notes);

  perform public._evo_log_audit(v_tenant_id, 'rejected', 'Rejected: ' || v_prop.title,
    jsonb_build_object('proposal_id', p_proposal_id, 'notes', p_notes));

  return jsonb_build_object('status', 'rejected', 'human_authority_required', true,
    'note', 'Rejected proposals remain visible for audit and learning.');
end; $$;

create or replace function public.schedule_evolution_proposal(p_proposal_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_prop public.evolution_proposals;
begin
  v_tenant_id := public._evo_require_tenant();
  select * into v_prop from public.evolution_proposals
  where id = p_proposal_id and tenant_id = v_tenant_id and status = 'approved';
  if v_prop.id is null then raise exception 'Approved proposal not found'; end if;

  update public.evolution_proposals
  set status = 'scheduled', scheduled_at = now(), updated_at = now()
  where id = p_proposal_id;

  insert into public.evolution_history (proposal_id, outcome, implementation_status)
  values (p_proposal_id, 'scheduled', 'pending');

  perform public._evo_log_audit(v_tenant_id, 'scheduled', 'Scheduled: ' || v_prop.title,
    jsonb_build_object('proposal_id', p_proposal_id));

  return jsonb_build_object('status', 'scheduled', 'human_authority_required', true);
end; $$;

create or replace function public.implement_evolution_proposal(p_proposal_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_prop public.evolution_proposals;
begin
  v_tenant_id := public._evo_require_tenant();
  select * into v_prop from public.evolution_proposals
  where id = p_proposal_id and tenant_id = v_tenant_id
    and status in ('approved', 'scheduled');
  if v_prop.id is null then raise exception 'Proposal not ready for implementation'; end if;

  -- Advisory only: mark status, never modify systems autonomously
  update public.evolution_proposals
  set status = 'implemented', implemented_at = now(), updated_at = now()
  where id = p_proposal_id;

  insert into public.evolution_history (proposal_id, outcome, implementation_status, notes)
  values (p_proposal_id, 'implemented', 'completed',
    'Implementation recorded by authorized personnel. No autonomous system modification performed.');

  perform public._evo_log_audit(v_tenant_id, 'implemented', 'Implemented: ' || v_prop.title,
    jsonb_build_object('proposal_id', p_proposal_id, 'autonomous', false));

  return jsonb_build_object(
    'status', 'implemented',
    'autonomous_implementation', false,
    'human_authority_required', true,
    'rollback_guidance', v_prop.rollback_guidance
  );
end; $$;

create or replace function public.validate_evolution_proposal(p_proposal_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_prop public.evolution_proposals;
begin
  v_tenant_id := public._evo_require_tenant();
  select * into v_prop from public.evolution_proposals
  where id = p_proposal_id and tenant_id = v_tenant_id and status = 'implemented';
  if v_prop.id is null then raise exception 'Implemented proposal not found'; end if;

  update public.evolution_proposals
  set status = 'validated', validated_at = now(), updated_at = now()
  where id = p_proposal_id;

  insert into public.evolution_history (proposal_id, outcome, implementation_status)
  values (p_proposal_id, 'validated', 'completed');

  perform public._evo_log_audit(v_tenant_id, 'validated', 'Validated: ' || v_prop.title,
    jsonb_build_object('proposal_id', p_proposal_id));

  return jsonb_build_object('status', 'validated');
end; $$;

create or replace function public.rollback_evolution_proposal(
  p_proposal_id uuid,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_prop public.evolution_proposals;
begin
  v_tenant_id := public._evo_require_tenant();
  select * into v_prop from public.evolution_proposals
  where id = p_proposal_id and tenant_id = v_tenant_id
    and status in ('implemented', 'validated', 'scheduled');
  if v_prop.id is null then raise exception 'Proposal not eligible for rollback'; end if;

  insert into public.evolution_history (proposal_id, outcome, implementation_status, notes)
  values (p_proposal_id, 'rolled_back', 'rolled_back',
    coalesce(p_notes, v_prop.rollback_guidance));

  update public.evolution_proposals set status = 'archived', updated_at = now() where id = p_proposal_id;

  perform public._evo_log_audit(v_tenant_id, 'rollback', 'Rollback: ' || v_prop.title,
    jsonb_build_object('proposal_id', p_proposal_id, 'notes', p_notes));

  return jsonb_build_object(
    'status', 'archived',
    'outcome', 'rolled_back',
    'rollback_guidance', v_prop.rollback_guidance,
    'human_authority_required', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Briefing & dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_evolution_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_id uuid;
  v_summary text;
  v_content jsonb;
  v_open int;
  v_pending_approval int;
  v_bottleneck int;
  v_implemented int;
begin
  v_tenant_id := public._evo_require_tenant();
  perform public._evo_seed_proposals(v_tenant_id);

  select count(*) into v_open from public.evolution_proposals
  where tenant_id = v_tenant_id and status in ('proposed', 'under_review');

  select count(*) into v_pending_approval from public.evolution_proposals
  where tenant_id = v_tenant_id and status = 'under_review';

  select count(*) into v_bottleneck from public.evolution_proposals
  where tenant_id = v_tenant_id and status = 'under_review'
    and risk_level in ('high', 'critical')
    and created_at < now() - interval '7 days';

  select count(*) into v_implemented from public.evolution_proposals
  where tenant_id = v_tenant_id and status in ('implemented', 'validated')
    and implemented_at > now() - interval '30 days';

  v_summary := v_open || ' open proposals, ' || v_pending_approval || ' awaiting approval, ' ||
    v_implemented || ' implemented in last 30 days.';

  v_content := jsonb_build_object(
    'open_proposals', v_open,
    'pending_approval', v_pending_approval,
    'approval_bottlenecks', v_bottleneck,
    'recent_implementations', v_implemented,
    'major_proposals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'title', p.title, 'risk_level', p.risk_level, 'status', p.status
      ) order by public._evo_risk_priority(p.risk_level))
      from public.evolution_proposals p
      where p.tenant_id = v_tenant_id and p.risk_level in ('high', 'critical')
        and p.status not in ('archived', 'rejected')
      limit 10
    ), '[]'::jsonb),
    'strategic_improvements', coalesce((
      select jsonb_agg(jsonb_build_object('title', p.title, 'category', p.category, 'status', p.status))
      from public.evolution_proposals p
      where p.tenant_id = v_tenant_id and p.source = 'strategic_intelligence'
        and p.status not in ('archived', 'rejected')
      limit 5
    ), '[]'::jsonb),
    'change_outcomes', coalesce((
      select jsonb_agg(jsonb_build_object('outcome', h.outcome, 'recorded_at', h.recorded_at))
      from public.evolution_history h
      join public.evolution_proposals p on p.id = h.proposal_id
      where p.tenant_id = v_tenant_id
      order by h.recorded_at desc limit 10
    ), '[]'::jsonb),
    'human_authority_required', true
  );

  insert into public.evolution_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_content)
  returning id into v_id;

  perform public._evo_log_audit(v_tenant_id, 'briefing_generated', v_summary,
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'content', v_content);
end; $$;

create or replace function public.get_evolution_governance_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_open int;
  v_critical int;
  v_settings public.evolution_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public._evo_ensure_settings(v_tenant_id);

  select count(*) into v_open from public.evolution_proposals
  where tenant_id = v_tenant_id and status in ('proposed', 'under_review', 'approved');

  select count(*) into v_critical from public.evolution_proposals
  where tenant_id = v_tenant_id and risk_level = 'critical'
    and status not in ('archived', 'rejected', 'validated');

  return jsonb_build_object(
    'has_customer', true,
    'open_proposals', v_open,
    'critical_pending', v_critical,
    'suggestions_enabled', v_settings.suggestions_enabled,
    'philosophy', 'Aipify proposes evolution. Humans approve evolution.',
    'human_authority_required', true
  );
end; $$;

create or replace function public.get_evolution_governance_board()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.evolution_settings;
  v_proposals jsonb;
  v_history jsonb;
  v_briefings jsonb;
  v_approval_matrix jsonb;
  v_categories jsonb;
begin
  v_tenant_id := public._evo_require_tenant();
  v_settings := public._evo_ensure_settings(v_tenant_id);
  perform public._evo_seed_proposals(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'category', p.category, 'title', p.title, 'description', p.description,
    'source', p.source, 'expected_value', p.expected_value,
    'expected_benefits', p.expected_benefits, 'potential_risks', p.potential_risks,
    'risk_level', p.risk_level, 'status', p.status,
    'recommended_reviewers', p.recommended_reviewers,
    'implementation_recommendation', p.implementation_recommendation,
    'rollback_guidance', p.rollback_guidance,
    'confidence_level', p.confidence_level,
    'simulation_required', p.simulation_required,
    'simulation_validated', p.simulation_validated,
    'approval_level_required', public._evo_approval_level(p.risk_level),
    'created_at', p.created_at, 'scheduled_at', p.scheduled_at,
    'implemented_at', p.implemented_at
  ) order by public._evo_risk_priority(p.risk_level), p.created_at desc), '[]'::jsonb)
  into v_proposals
  from public.evolution_proposals p
  where p.tenant_id = v_tenant_id and p.status not in ('archived')
  limit 30;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'proposal_id', h.proposal_id, 'outcome', h.outcome,
    'implementation_status', h.implementation_status, 'notes', h.notes,
    'recorded_at', h.recorded_at,
    'proposal_title', p.title
  ) order by h.recorded_at desc), '[]'::jsonb)
  into v_history
  from public.evolution_history h
  join public.evolution_proposals p on p.id = h.proposal_id
  where p.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb)
  into v_briefings
  from public.evolution_briefings b where b.tenant_id = v_tenant_id limit 5;

  v_approval_matrix := jsonb_build_object(
    'low', jsonb_build_object('approver', 'reviewer', 'auto_publish_optional', v_settings.low_risk_auto_publish),
    'medium', jsonb_build_object('approver', 'reviewer', 'requires_designated_reviewer', true),
    'high', jsonb_build_object('approver', 'governance', 'requires_governance_approval', true),
    'critical', jsonb_build_object('approver', 'executive', 'requires_executive_approval', true)
  );

  v_categories := jsonb_build_array(
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge Changes', 'examples', 'FAQ, documentation, ownership'),
    jsonb_build_object('key', 'automation', 'label', 'Automation Changes', 'examples', 'Workflow optimizations'),
    jsonb_build_object('key', 'workflow', 'label', 'Workflow Changes', 'examples', 'Process improvements'),
    jsonb_build_object('key', 'blueprint', 'label', 'Blueprint Changes', 'examples', 'Industry packages'),
    jsonb_build_object('key', 'marketplace', 'label', 'Marketplace Changes', 'examples', 'Pack recommendations'),
    jsonb_build_object('key', 'prompt', 'label', 'Prompt Changes', 'examples', 'Assistant behavior'),
    jsonb_build_object('key', 'desktop', 'label', 'Desktop Changes', 'examples', 'Notification adjustments'),
    jsonb_build_object('key', 'policy', 'label', 'Policy Changes', 'examples', 'Governance recommendations')
  );

  return jsonb_build_object(
    'has_customer', true,
    'human_authority_required', true,
    'suggestions_enabled', v_settings.suggestions_enabled,
    'low_risk_auto_publish', v_settings.low_risk_auto_publish,
    'philosophy', 'Aipify proposes evolution. Humans approve evolution.',
    'safety_note', 'Aipify never modifies systems autonomously or bypasses Governance.',
    'proposals', v_proposals,
    'history', v_history,
    'briefings', v_briefings,
    'approval_matrix', v_approval_matrix,
    'categories', v_categories,
    'status_flow', jsonb_build_array(
      'proposed', 'under_review', 'approved', 'scheduled', 'implemented', 'validated', 'archived'
    ),
    'integrations', jsonb_build_object(
      'trust_engine', 'Evidence, assumptions, and alternatives on every proposal',
      'learning_engine', 'Repeated opportunities and high-value improvements (advisory)',
      'global_learning', 'Industry best practices (privacy-protected)',
      'simulation_engine', 'Validation for high-risk proposals',
      'strategic_intelligence', 'Long-term change candidates',
      'knowledge_center', 'Knowledge proposals route to Knowledge Owners',
      'action_center', 'Review, approve, revise, and reject tasks',
      'executive_briefing', 'Major proposals, bottlenecks, and outcomes'
    )
  );
end; $$;

create or replace function public.get_evolution_proposal_detail(p_proposal_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_prop jsonb;
  v_reviews jsonb;
  v_approvals jsonb;
  v_history jsonb;
begin
  v_tenant_id := public._evo_require_tenant();

  select jsonb_build_object(
    'id', p.id, 'category', p.category, 'title', p.title, 'description', p.description,
    'source', p.source, 'expected_value', p.expected_value,
    'expected_benefits', p.expected_benefits, 'potential_risks', p.potential_risks,
    'risk_level', p.risk_level, 'status', p.status,
    'recommended_reviewers', p.recommended_reviewers,
    'implementation_recommendation', p.implementation_recommendation,
    'rollback_guidance', p.rollback_guidance,
    'supporting_evidence', p.supporting_evidence,
    'confidence_level', p.confidence_level,
    'approval_level_required', public._evo_approval_level(p.risk_level),
    'human_authority_required', true
  ) into v_prop
  from public.evolution_proposals p
  where p.id = p_proposal_id and p.tenant_id = v_tenant_id;

  if v_prop is null then raise exception 'Proposal not found'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'decision', r.decision, 'notes', r.notes, 'reviewed_at', r.reviewed_at
  ) order by r.reviewed_at desc), '[]'::jsonb) into v_reviews
  from public.evolution_reviews r where r.proposal_id = p_proposal_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'approval_level', a.approval_level, 'approved_at', a.approved_at
  ) order by a.approved_at desc), '[]'::jsonb) into v_approvals
  from public.evolution_approvals a where a.proposal_id = p_proposal_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'outcome', h.outcome, 'implementation_status', h.implementation_status,
    'notes', h.notes, 'recorded_at', h.recorded_at
  ) order by h.recorded_at desc), '[]'::jsonb) into v_history
  from public.evolution_history h where h.proposal_id = p_proposal_id;

  return jsonb_build_object(
    'proposal', v_prop,
    'reviews', v_reviews,
    'approvals', v_approvals,
    'history', v_history
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'evolution', 'Evolution Governance', 'Controlled evolution, change management, and approval processes.', 'authenticated', 29
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'evolution' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 13. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_evolution_governance_card() to authenticated;
grant execute on function public.get_evolution_governance_board() to authenticated;
grant execute on function public.get_evolution_proposal_detail(uuid) to authenticated;
grant execute on function public.review_evolution_proposal(uuid, text, text) to authenticated;
grant execute on function public.approve_evolution_proposal(uuid) to authenticated;
grant execute on function public.reject_evolution_proposal(uuid, text) to authenticated;
grant execute on function public.schedule_evolution_proposal(uuid) to authenticated;
grant execute on function public.implement_evolution_proposal(uuid) to authenticated;
grant execute on function public.validate_evolution_proposal(uuid) to authenticated;
grant execute on function public.rollback_evolution_proposal(uuid, text) to authenticated;
grant execute on function public.generate_evolution_briefing() to authenticated;
