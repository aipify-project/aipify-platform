-- Phase 89 — Community & Collective Intelligence Engine
-- Core principle: Collective Intelligence amplifies wisdom. Not compromise trust.

-- Extend Trust Engine decision types
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community'
  )
);

-- ---------------------------------------------------------------------------
-- 1. community_contributions
-- ---------------------------------------------------------------------------
create table if not exists public.community_contributions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  contribution_type text not null check (
    contribution_type in (
      'knowledge_article', 'implementation_guide', 'blueprint_enhancement',
      'business_pack_review', 'operational_lesson', 'governance_recommendation',
      'adoption_success_story', 'risk_mitigation_practice'
    )
  ),
  title text not null,
  description text not null,
  anonymized_title text,
  anonymized_description text,
  anonymization_verified boolean not null default false,
  governance_flag boolean not null default false,
  source_module text,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'governance_check', 'published', 'rejected', 'archived')
  ),
  rating_avg numeric(3, 2) not null default 0 check (rating_avg between 0 and 5),
  rating_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists community_contributions_tenant_idx
  on public.community_contributions (tenant_id, status, created_at desc);
create index if not exists community_contributions_published_idx
  on public.community_contributions (status, rating_avg desc, published_at desc)
  where status = 'published';

alter table public.community_contributions enable row level security;
revoke all on public.community_contributions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. community_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.community_reviews (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid not null references public.community_contributions (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reviewer_id uuid references public.users (id) on delete set null,
  decision text not null check (
    decision in ('approve', 'reject', 'request_changes', 'escalate_governance', 'publish')
  ),
  notes text,
  reviewed_at timestamptz not null default now()
);

create index if not exists community_reviews_contribution_idx
  on public.community_reviews (contribution_id, reviewed_at desc);

alter table public.community_reviews enable row level security;
revoke all on public.community_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. community_ratings
-- ---------------------------------------------------------------------------
create table if not exists public.community_ratings (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid not null references public.community_contributions (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (contribution_id, tenant_id)
);

alter table public.community_ratings enable row level security;
revoke all on public.community_ratings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. community_scores
-- ---------------------------------------------------------------------------
create table if not exists public.community_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  contribution_score numeric(5, 2) not null default 0 check (contribution_score between 0 and 100),
  health_score numeric(5, 2) not null default 0 check (health_score between 0 and 100),
  score_components jsonb not null default '{}'::jsonb,
  calculated_at timestamptz not null default now()
);

create index if not exists community_scores_tenant_idx
  on public.community_scores (tenant_id, calculated_at desc);

alter table public.community_scores enable row level security;
revoke all on public.community_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. community_briefings
-- ---------------------------------------------------------------------------
create table if not exists public.community_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.community_briefings enable row level security;
revoke all on public.community_briefings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. community_settings
-- ---------------------------------------------------------------------------
create table if not exists public.community_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  participation_enabled boolean not null default true,
  allow_contributions boolean not null default true,
  require_governance_review boolean not null default true,
  anonymization_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_settings enable row level security;
revoke all on public.community_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. community_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.community_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.community_audit_log enable row level security;
revoke all on public.community_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers (_col_)
-- ---------------------------------------------------------------------------
create or replace function public._col_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._col_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._col_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce((select role from public.users where auth_user_id = auth.uid() limit 1), 'staff')
     not in ('owner', 'admin', 'master_admin') then
    raise exception 'Admin access required';
  end if;
end; $$;

create or replace function public._col_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.community_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._col_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'community_' || p_event_type, 'community', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._col_ensure_settings(p_tenant_id uuid)
returns public.community_settings language plpgsql security definer set search_path = public as $$
declare v_row public.community_settings;
begin
  insert into public.community_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.community_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._col_anonymize_text(p_text text)
returns text language plpgsql immutable as $$
declare v_result text;
begin
  v_result := coalesce(p_text, '');
  v_result := regexp_replace(v_result, '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', '[email removed]', 'gi');
  v_result := regexp_replace(v_result, '\b[A-Z][a-z]+ (Inc|LLC|Ltd|Corp|Company|Organization)\b', 'an organization', 'g');
  v_result := regexp_replace(v_result, '\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[phone removed]', 'g');
  return v_result;
end; $$;

create or replace function public._col_contribution_type_label(p_type text)
returns text language sql immutable as $$
  select case p_type
    when 'knowledge_article' then 'Knowledge Article'
    when 'implementation_guide' then 'Implementation Guide'
    when 'blueprint_enhancement' then 'Blueprint Enhancement'
    when 'business_pack_review' then 'Business Pack Review'
    when 'operational_lesson' then 'Operational Lesson Learned'
    when 'governance_recommendation' then 'Governance Recommendation'
    when 'adoption_success_story' then 'Adoption Success Story'
    when 'risk_mitigation_practice' then 'Risk Mitigation Practice'
    else p_type
  end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Seed platform best-practice contributions (anonymized, per-tenant templates)
-- ---------------------------------------------------------------------------
create or replace function public._col_seed_templates(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.community_contributions (
    tenant_id, contribution_type, title, description,
    anonymized_title, anonymized_description, anonymization_verified,
    source_module, status, published_at
  )
  select p_tenant_id, v.type, v.title, v.desc, v.title, v.desc, true,
    'community_intelligence', 'published', now()
  from (values
    ('knowledge_article', 'Structured FAQ maintenance reduces support volume',
     'Organizations that review FAQs monthly report fewer repeated support questions and faster resolution times.'),
    ('adoption_success_story', 'Quick wins accelerate onboarding adoption',
     'Celebrating first automation and first briefing milestones within the first two weeks improves long-term adoption.'),
    ('governance_recommendation', 'Governance review before automation expansion',
     'Requiring governance approval for high-impact automations reduces rollback incidents and builds trust.')
  ) as v(type, title, desc)
  where not exists (
    select 1 from public.community_contributions cc
    where cc.tenant_id = p_tenant_id and cc.title = v.title and cc.status = 'published'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Seed contribution suggestions from integrations
-- ---------------------------------------------------------------------------
create or replace function public._col_seed_suggestions(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_settings public.community_settings;
begin
  v_settings := public._col_ensure_settings(p_tenant_id);
  if not v_settings.participation_enabled or not v_settings.allow_contributions then return; end if;

  insert into public.community_contributions (tenant_id, contribution_type, title, description, source_module, status)
  select p_tenant_id, 'operational_lesson',
    'Validated outcome: ' || left(sh.title, 80),
    coalesce(vr.findings, 'Outcome validation completed — consider sharing anonymized lessons learned.'),
    'outcomes', 'draft'
  from public.validation_results vr
  join public.success_hypotheses sh on sh.id = vr.hypothesis_id
  where sh.tenant_id = p_tenant_id and vr.validation_status = 'validated'
  and not exists (
    select 1 from public.community_contributions cc
    where cc.tenant_id = p_tenant_id and cc.title like 'Validated outcome:%'
      and cc.title like '%' || left(sh.title, 40) || '%'
  )
  limit 2;

  insert into public.community_contributions (tenant_id, contribution_type, title, description, source_module, status)
  select p_tenant_id, 'adoption_success_story',
    'Quick win milestone: ' || cm.description,
    'A customer success milestone was achieved — this pattern may help other organizations.',
    'human_success', 'draft'
  from public.customer_milestones cm
  where cm.tenant_id = p_tenant_id and cm.is_quick_win = true
  and not exists (
    select 1 from public.community_contributions cc
    where cc.tenant_id = p_tenant_id and cc.title = 'Quick win milestone: ' || cm.description
  )
  limit 2;

  insert into public.community_contributions (tenant_id, contribution_type, title, description, source_module, status)
  select p_tenant_id, 'business_pack_review',
    'Marketplace pack experience: ' || coalesce(s.name, 'Business Pack'),
    'Installed marketplace capability — share implementation experience after governance review.',
    'marketplace', 'draft'
  from public.tenant_skills ts
  join public.skills s on s.id = ts.skill_id
  where ts.tenant_id = p_tenant_id and ts.status = 'active'
  and not exists (
    select 1 from public.community_contributions cc
    where cc.tenant_id = p_tenant_id
      and cc.title = 'Marketplace pack experience: ' || coalesce(s.name, 'Business Pack')
  )
  limit 2;

  insert into public.community_contributions (tenant_id, contribution_type, title, description, source_module, status, governance_flag)
  select p_tenant_id, 'governance_recommendation',
    'Strategic insight: ' || so.title,
    coalesce(so.description, 'Strategic opportunity identified — review before sharing.'),
    'strategic_intelligence', 'draft', true
  from public.strategic_opportunities so
  where so.tenant_id = p_tenant_id and so.status = 'open'
  and not exists (
    select 1 from public.community_contributions cc
    where cc.tenant_id = p_tenant_id and cc.title = 'Strategic insight: ' || so.title
  )
  limit 2;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Calculate scores
-- ---------------------------------------------------------------------------
create or replace function public._col_calculate_scores(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_contribution_score numeric := 60;
  v_health_score numeric := 65;
  v_published int;
  v_draft int;
  v_pending int;
  v_avg_rating numeric;
  v_global_published int;
  v_diversity int;
  v_id uuid;
begin
  select count(*) filter (where status = 'published'),
         count(*) filter (where status = 'draft'),
         count(*) filter (where status in ('review', 'governance_check'))
  into v_published, v_draft, v_pending
  from public.community_contributions where tenant_id = p_tenant_id;

  select coalesce(avg(rating_avg), 0) into v_avg_rating
  from public.community_contributions
  where tenant_id = p_tenant_id and status = 'published';

  select count(distinct contribution_type) into v_diversity
  from public.community_contributions where tenant_id = p_tenant_id;

  select count(*) into v_global_published
  from public.community_contributions where status = 'published' and anonymization_verified = true;

  v_contribution_score := least(100, 40 + v_published * 10 + v_avg_rating * 8);
  v_health_score := least(100, 30 + v_global_published * 2 + v_diversity * 8 + case when v_pending > 0 then 10 else 0 end);

  insert into public.community_scores (tenant_id, contribution_score, health_score, score_components)
  values (p_tenant_id, v_contribution_score, v_health_score, jsonb_build_object(
    'community_usefulness', v_contribution_score,
    'validation_quality', least(100, 50 + v_published * 15),
    'adoption_impact', least(100, 40 + v_diversity * 12),
    'governance_compliance', case when v_pending = 0 then 90 else 70 end,
    'participation', least(100, 30 + v_published * 12 + v_draft * 3),
    'knowledge_quality', v_contribution_score,
    'contribution_diversity', least(100, v_diversity * 15),
    'governance_alignment', 85
  )) returning id into v_id;

  perform public._col_log_audit(p_tenant_id, 'scores_calculated',
    'Contribution Score: ' || v_contribution_score || ', Health Score: ' || v_health_score,
    jsonb_build_object('contribution_score', v_contribution_score, 'health_score', v_health_score));

  return jsonb_build_object(
    'contribution_score', v_contribution_score,
    'health_score', v_health_score,
    'components', jsonb_build_object(
      'community_usefulness', v_contribution_score,
      'validation_quality', least(100, 50 + v_published * 15),
      'adoption_impact', least(100, 40 + v_diversity * 12),
      'governance_compliance', case when v_pending = 0 then 90 else 70 end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Trust explanation
-- ---------------------------------------------------------------------------
create or replace function public._col_trust_explanation(p_tenant_id uuid, p_health numeric)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.generate_decision_explanation(
    'col-health-' || p_tenant_id::text,
    'community',
    'community',
    'Community Health Score: ' || p_health || '/100',
    'Based on governed, anonymized contributions only. Participation is voluntary and opt-out is supported.',
    jsonb_build_array(
      jsonb_build_object('source', 'community_contributions'),
      jsonb_build_object('source', 'governance_reviews'),
      jsonb_build_object('source', 'anonymization_validation')
    ),
    jsonb_build_array('voluntary_participation', 'anonymization_required', 'no_confidential_sharing'),
    'medium',
    '["opt_out","defer_sharing"]'::jsonb,
    jsonb_build_array('Review pending contributions', 'Verify anonymization', 'Participate voluntarily'),
    jsonb_build_object(
      'simple', 'This score reflects the strength of shared, governed community intelligence.',
      'operational', 'Only anonymized and approved contributions contribute to collective intelligence.',
      'technical', 'Factors: participation, knowledge quality, diversity, governance alignment, validation outcomes.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Contribution workflow RPCs
-- ---------------------------------------------------------------------------
create or replace function public.submit_community_contribution(
  p_type text, p_title text, p_description text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.community_settings;
  v_id uuid;
  v_status text := 'draft';
begin
  v_tenant_id := public._col_require_tenant();
  v_settings := public._col_ensure_settings(v_tenant_id);

  if not v_settings.participation_enabled then
    raise exception 'Community participation is disabled for this organization';
  end if;
  if not v_settings.allow_contributions then
    raise exception 'Contributions are not allowed for this organization';
  end if;

  if v_settings.require_governance_review then
    v_status := 'review';
  end if;

  insert into public.community_contributions (
    tenant_id, contribution_type, title, description, status
  ) values (v_tenant_id, p_type, p_title, p_description, v_status)
  returning id into v_id;

  perform public._col_log_audit(v_tenant_id, 'contribution_created',
    'Contribution submitted: ' || p_title,
    jsonb_build_object('contribution_id', v_id, 'type', p_type, 'status', v_status));

  return jsonb_build_object('contribution_id', v_id, 'status', v_status, 'governance_required', v_settings.require_governance_review);
end; $$;

create or replace function public.review_community_contribution(
  p_contribution_id uuid, p_decision text, p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_contrib public.community_contributions;
  v_new_status text;
begin
  v_tenant_id := public._col_require_tenant();
  perform public._col_require_admin();

  select * into v_contrib from public.community_contributions
  where id = p_contribution_id and tenant_id = v_tenant_id;
  if v_contrib.id is null then raise exception 'Contribution not found'; end if;

  v_new_status := v_contrib.status;
  case
    when p_decision = 'reject' then v_new_status := 'rejected';
    when p_decision = 'request_changes' then v_new_status := 'draft';
    when p_decision = 'escalate_governance' then v_new_status := 'governance_check';
    when p_decision = 'approve' and v_contrib.status = 'review' then
      v_new_status := case when v_contrib.governance_flag then 'governance_check' else 'governance_check' end;
    when p_decision = 'publish' and v_contrib.status in ('review', 'governance_check') then
      v_new_status := 'published';
    else null;
  end case;

  if v_new_status = 'published' then
    update public.community_contributions set
      status = 'published',
      anonymized_title = public._col_anonymize_text(v_contrib.title),
      anonymized_description = public._col_anonymize_text(v_contrib.description),
      anonymization_verified = true,
      published_at = now(),
      updated_at = now()
    where id = p_contribution_id;
    perform public._col_log_audit(v_tenant_id, 'contribution_published',
      'Contribution published: ' || v_contrib.title,
      jsonb_build_object('contribution_id', p_contribution_id));
  elsif v_new_status is not null then
    update public.community_contributions set status = v_new_status, updated_at = now()
    where id = p_contribution_id;
    perform public._col_log_audit(v_tenant_id, 'contribution_reviewed',
      'Review decision: ' || p_decision,
      jsonb_build_object('contribution_id', p_contribution_id, 'decision', p_decision, 'new_status', v_new_status));
  end if;

  insert into public.community_reviews (contribution_id, tenant_id, reviewer_id, decision, notes)
  values (p_contribution_id, v_tenant_id, public._col_auth_user_id(), p_decision, p_notes);

  return jsonb_build_object('status', v_new_status, 'decision', p_decision);
end; $$;

create or replace function public.rate_community_contribution(
  p_contribution_id uuid, p_rating int
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_avg numeric; v_count int;
begin
  v_tenant_id := public._col_require_tenant();
  if p_rating < 1 or p_rating > 5 then raise exception 'Rating must be between 1 and 5'; end if;

  if not exists (
    select 1 from public.community_contributions
    where id = p_contribution_id and status = 'published'
  ) then raise exception 'Contribution not found or not published'; end if;

  insert into public.community_ratings (contribution_id, tenant_id, rating)
  values (p_contribution_id, v_tenant_id, p_rating)
  on conflict (contribution_id, tenant_id) do update set rating = p_rating;

  select avg(rating)::numeric(3,2), count(*) into v_avg, v_count
  from public.community_ratings where contribution_id = p_contribution_id;

  update public.community_contributions set rating_avg = v_avg, rating_count = v_count
  where id = p_contribution_id;

  perform public._col_log_audit(v_tenant_id, 'contribution_rated',
    'Rated contribution ' || p_contribution_id,
    jsonb_build_object('contribution_id', p_contribution_id, 'rating', p_rating));

  return jsonb_build_object('rating_avg', v_avg, 'rating_count', v_count);
end; $$;

-- ---------------------------------------------------------------------------
-- 14. Briefing
-- ---------------------------------------------------------------------------
create or replace function public.generate_community_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_scores jsonb;
  v_id uuid;
  v_summary text;
  v_content jsonb;
begin
  v_tenant_id := public._col_require_tenant();
  perform public._col_seed_templates(v_tenant_id);
  perform public._col_seed_suggestions(v_tenant_id);
  v_scores := public._col_calculate_scores(v_tenant_id);
  perform public._col_trust_explanation(v_tenant_id, (v_scores->>'health_score')::numeric);

  v_summary := 'Community Health Score ' || (v_scores->>'health_score') || '/100 — ' ||
    'Contribution Score ' || (v_scores->>'contribution_score') || '/100';

  v_content := jsonb_build_object(
    'health_score', v_scores->'health_score',
    'contribution_score', v_scores->'contribution_score',
    'emerging_themes', coalesce((
      select jsonb_agg(distinct contribution_type)
      from public.community_contributions where status = 'published' limit 8
    ), '[]'::jsonb),
    'validated_best_practices', coalesce((
      select jsonb_agg(jsonb_build_object('title', anonymized_title, 'type', contribution_type, 'rating', rating_avg))
      from public.community_contributions
      where status = 'published' and anonymization_verified = true
      order by rating_avg desc limit 5
    ), '[]'::jsonb),
    'high_value_insights', coalesce((
      select jsonb_agg(jsonb_build_object('title', anonymized_title, 'description', left(anonymized_description, 200)))
      from public.community_contributions
      where status = 'published' order by published_at desc limit 5
    ), '[]'::jsonb),
    'community_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'type', contribution_type))
      from public.community_contributions
      where tenant_id = v_tenant_id and status = 'draft' limit 5
    ), '[]'::jsonb),
    'participation_voluntary', true,
    'anonymization_required', true
  );

  insert into public.community_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_content) returning id into v_id;

  perform public._col_log_audit(v_tenant_id, 'briefing_generated', v_summary,
    jsonb_build_object('briefing_id', v_id));

  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'content', v_content);
end; $$;

-- ---------------------------------------------------------------------------
-- 15. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_community_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_health numeric; v_contribution numeric; v_pending int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select health_score, contribution_score into v_health, v_contribution
  from public.community_scores where tenant_id = v_tenant_id order by calculated_at desc limit 1;

  select count(*) into v_pending from public.community_contributions
  where tenant_id = v_tenant_id and status in ('review', 'governance_check');

  return jsonb_build_object(
    'has_customer', true,
    'health_score', coalesce(v_health, 0),
    'contribution_score', coalesce(v_contribution, 0),
    'pending_reviews', v_pending,
    'philosophy', 'Collective Intelligence amplifies wisdom. Not compromise trust.',
    'participation_voluntary', true
  );
end; $$;

create or replace function public.get_community_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.community_settings;
  v_scores jsonb;
  v_featured jsonb;
  v_best_practices jsonb;
  v_top_rated jsonb;
  v_recent jsonb;
  v_briefings jsonb;
  v_types jsonb;
begin
  v_tenant_id := public._col_require_tenant();
  v_settings := public._col_ensure_settings(v_tenant_id);
  perform public._col_seed_templates(v_tenant_id);
  perform public._col_seed_suggestions(v_tenant_id);
  v_scores := public._col_calculate_scores(v_tenant_id);
  perform public._col_trust_explanation(v_tenant_id, (v_scores->>'health_score')::numeric);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 300),
    'contribution_type', c.contribution_type, 'type_label', public._col_contribution_type_label(c.contribution_type),
    'rating_avg', c.rating_avg, 'rating_count', c.rating_count, 'published_at', c.published_at
  ) order by c.published_at desc), '[]'::jsonb) into v_featured
  from public.community_contributions c
  where c.status = 'published' and c.anonymization_verified = true
  limit 6;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.anonymized_title, 'contribution_type', c.contribution_type,
    'type_label', public._col_contribution_type_label(c.contribution_type), 'rating_avg', c.rating_avg
  ) order by c.rating_avg desc), '[]'::jsonb) into v_best_practices
  from public.community_contributions c
  where c.status = 'published' and c.contribution_type in ('knowledge_article', 'implementation_guide', 'governance_recommendation')
  limit 8;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.anonymized_title, 'rating_avg', c.rating_avg, 'rating_count', c.rating_count
  ) order by c.rating_avg desc, c.rating_count desc), '[]'::jsonb) into v_top_rated
  from public.community_contributions c where c.status = 'published'
  limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.anonymized_title, 'contribution_type', c.contribution_type,
    'type_label', public._col_contribution_type_label(c.contribution_type), 'published_at', c.published_at
  ) order by c.published_at desc), '[]'::jsonb) into v_recent
  from public.community_contributions c
  where c.status = 'published' and c.published_at > now() - interval '90 days'
  limit 8;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.community_briefings b where b.tenant_id = v_tenant_id limit 5;

  v_types := jsonb_build_array(
    jsonb_build_object('key', 'knowledge_article', 'label', 'Knowledge Articles'),
    jsonb_build_object('key', 'implementation_guide', 'label', 'Implementation Guides'),
    jsonb_build_object('key', 'blueprint_enhancement', 'label', 'Blueprint Enhancements'),
    jsonb_build_object('key', 'business_pack_review', 'label', 'Business Pack Reviews'),
    jsonb_build_object('key', 'operational_lesson', 'label', 'Operational Lessons Learned'),
    jsonb_build_object('key', 'governance_recommendation', 'label', 'Governance Recommendations'),
    jsonb_build_object('key', 'adoption_success_story', 'label', 'Adoption Success Stories'),
    jsonb_build_object('key', 'risk_mitigation_practice', 'label', 'Risk Mitigation Practices')
  );

  return jsonb_build_object(
    'has_customer', true,
    'participation_enabled', v_settings.participation_enabled,
    'participation_voluntary', true,
    'anonymization_required', v_settings.anonymization_required,
    'philosophy', 'Collective Intelligence amplifies wisdom. Not compromise trust.',
    'safety_note', 'No confidential sharing. Participation is voluntary, governed, and anonymized.',
    'health_score', v_scores->'health_score',
    'contribution_score', v_scores->'contribution_score',
    'score_components', v_scores->'components',
    'featured_insights', v_featured,
    'best_practices', v_best_practices,
    'top_rated', v_top_rated,
    'recently_validated', v_recent,
    'blueprint_discussions', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200)))
      from public.community_contributions c
      where c.status = 'published' and c.contribution_type = 'blueprint_enhancement'
      limit 5
    ), '[]'::jsonb),
    'briefings', v_briefings,
    'contribution_types', v_types,
    'approval_workflow', jsonb_build_array(
      jsonb_build_object('step', 'draft', 'label', 'Draft'),
      jsonb_build_object('step', 'review', 'label', 'Review'),
      jsonb_build_object('step', 'governance_check', 'label', 'Governance Check'),
      jsonb_build_object('step', 'published', 'label', 'Publication'),
      jsonb_build_object('step', 'community_rating', 'label', 'Community Rating')
    ),
    'integrations', jsonb_build_object(
      'knowledge_center', 'Enriches FAQs, best practices, and playbooks',
      'global_learning', 'Strengthens pattern recognition and industry guidance',
      'marketplace', 'Community reviews and pack improvement suggestions',
      'strategic_intelligence', 'Common opportunities and shared challenges',
      'human_success', 'Successful onboarding and adoption patterns',
      'executive_briefing', 'Community intelligence briefings'
    )
  );
end; $$;

create or replace function public.get_community_intelligence_admin()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.community_settings;
  v_scores jsonb;
  v_pending jsonb;
  v_queue jsonb;
  v_flags jsonb;
  v_trends jsonb;
begin
  v_tenant_id := public._col_require_tenant();
  perform public._col_require_admin();
  v_settings := public._col_ensure_settings(v_tenant_id);
  perform public._col_seed_suggestions(v_tenant_id);
  v_scores := public._col_calculate_scores(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.title, 'contribution_type', c.contribution_type,
    'type_label', public._col_contribution_type_label(c.contribution_type),
    'status', c.status, 'governance_flag', c.governance_flag, 'created_at', c.created_at
  ) order by c.created_at desc), '[]'::jsonb) into v_pending
  from public.community_contributions c
  where c.tenant_id = v_tenant_id and c.status in ('review', 'governance_check')
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.title, 'contribution_type', c.contribution_type,
    'status', c.status, 'source_module', c.source_module, 'created_at', c.created_at
  ) order by case c.status when 'draft' then 1 when 'review' then 2 else 3 end, c.created_at desc), '[]'::jsonb)
  into v_queue
  from public.community_contributions c
  where c.tenant_id = v_tenant_id and c.status not in ('archived', 'rejected')
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.title, 'governance_flag', c.governance_flag, 'status', c.status
  )), '[]'::jsonb) into v_flags
  from public.community_contributions c
  where c.tenant_id = v_tenant_id and c.governance_flag = true and c.status != 'published'
  limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'health_score', s.health_score, 'contribution_score', s.contribution_score, 'calculated_at', s.calculated_at
  ) order by s.calculated_at desc), '[]'::jsonb) into v_trends
  from public.community_scores s where s.tenant_id = v_tenant_id limit 10;

  return jsonb_build_object(
    'has_customer', true,
    'participation_enabled', v_settings.participation_enabled,
    'require_governance_review', v_settings.require_governance_review,
    'health_score', v_scores->'health_score',
    'contribution_score', v_scores->'contribution_score',
    'pending_reviews', v_pending,
    'contribution_queue', v_queue,
    'governance_flags', v_flags,
    'intelligence_trends', v_trends,
    'pending_count', jsonb_array_length(v_pending),
    'queue_count', jsonb_array_length(v_queue)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 16. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'community', 'Community Intelligence', 'Collective intelligence, contribution guidelines, and governance.', 'authenticated', 34
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'community' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 17. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_community_intelligence_card() to authenticated;
grant execute on function public.get_community_intelligence_dashboard() to authenticated;
grant execute on function public.get_community_intelligence_admin() to authenticated;
grant execute on function public.submit_community_contribution(text, text, text) to authenticated;
grant execute on function public.review_community_contribution(uuid, text, text) to authenticated;
grant execute on function public.rate_community_contribution(uuid, int) to authenticated;
grant execute on function public.generate_community_briefing() to authenticated;
