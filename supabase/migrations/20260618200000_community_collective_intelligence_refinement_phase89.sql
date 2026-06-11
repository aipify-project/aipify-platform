-- Phase 89 refinement — Community & Collective Intelligence alignment
-- Organizations own their knowledge. Organizations control participation.

-- ---------------------------------------------------------------------------
-- 1. Add category + anonymization_check workflow step
-- ---------------------------------------------------------------------------
alter table public.community_contributions
  add column if not exists category text;

update public.community_contributions set category = case contribution_type
  when 'knowledge_article' then 'knowledge'
  when 'implementation_guide' then 'knowledge'
  when 'blueprint_enhancement' then 'industry'
  when 'business_pack_review' then 'marketplace'
  when 'operational_lesson' then 'operational'
  when 'governance_recommendation' then 'governance'
  when 'adoption_success_story' then 'customer_success'
  when 'risk_mitigation_practice' then 'operational'
  else 'knowledge'
end where category is null;

alter table public.community_contributions
  alter column category set default 'knowledge';

alter table public.community_contributions drop constraint if exists community_contributions_category_check;
alter table public.community_contributions add constraint community_contributions_category_check check (
  category in ('knowledge', 'operational', 'governance', 'customer_success', 'industry', 'marketplace')
);

alter table public.community_contributions drop constraint if exists community_contributions_status_check;
alter table public.community_contributions add constraint community_contributions_status_check check (
  status in ('draft', 'review', 'governance_check', 'anonymization_check', 'published', 'rejected', 'archived')
);

-- usefulness_rating alias on ratings
alter table public.community_ratings
  add column if not exists usefulness_rating int check (usefulness_rating between 1 and 5);

update public.community_ratings set usefulness_rating = rating where usefulness_rating is null;

-- Spec-aligned health scores view
create or replace view public.community_health_scores as
select
  id,
  tenant_id,
  health_score,
  contribution_score as intelligence_score,
  calculated_at
from public.community_scores;

-- ---------------------------------------------------------------------------
-- 2. Enhanced anonymization engine
-- ---------------------------------------------------------------------------
create or replace function public._col_anonymize_text(p_text text)
returns text language plpgsql immutable as $$
declare v_result text;
begin
  v_result := coalesce(p_text, '');
  v_result := regexp_replace(v_result, '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', '[email removed]', 'gi');
  v_result := regexp_replace(v_result, '\b[A-Z][a-z]+ (Inc|LLC|Ltd|Corp|Company|Organization|AS|AB|GmbH)\b', 'an organization', 'g');
  v_result := regexp_replace(v_result, '\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[phone removed]', 'g');
  v_result := regexp_replace(v_result, '\$[\d,]+(\.\d{2})?', '[financial detail removed]', 'g');
  v_result := regexp_replace(v_result, '\b\d{4,}[-/]\d+\b', '[identifier removed]', 'g');
  v_result := regexp_replace(v_result, '\b(Mr|Mrs|Ms|Dr)\.?\s+[A-Z][a-z]+\b', 'a team member', 'g');
  v_result := regexp_replace(v_result, '\bcustomer\s+[A-Z][a-z]+\b', 'a customer', 'gi');
  return v_result;
end; $$;

create or replace function public._col_category_label(p_category text)
returns text language sql immutable as $$
  select case p_category
    when 'knowledge' then 'Knowledge Contributions'
    when 'operational' then 'Operational Contributions'
    when 'governance' then 'Governance Contributions'
    when 'customer_success' then 'Customer Success Contributions'
    when 'industry' then 'Industry Contributions'
    when 'marketplace' then 'Marketplace Contributions'
    else p_category
  end;
$$;

create or replace function public._col_type_to_category(p_type text)
returns text language sql immutable as $$
  select case p_type
    when 'knowledge_article' then 'knowledge'
    when 'implementation_guide' then 'knowledge'
    when 'blueprint_enhancement' then 'industry'
    when 'business_pack_review' then 'marketplace'
    when 'operational_lesson' then 'operational'
    when 'governance_recommendation' then 'governance'
    when 'adoption_success_story' then 'customer_success'
    when 'risk_mitigation_practice' then 'operational'
    else 'knowledge'
  end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed templates with categories + industry insight
-- ---------------------------------------------------------------------------
create or replace function public._col_seed_templates(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.community_contributions (
    tenant_id, category, contribution_type, title, description,
    anonymized_title, anonymized_description, anonymization_verified,
    source_module, status, published_at
  )
  select p_tenant_id, v.cat, v.type, v.title, v.desc, v.title, v.desc, true,
    'community_intelligence', 'published', now()
  from (values
    ('knowledge', 'knowledge_article', 'Structured FAQ maintenance reduces support volume',
     'Organizations that review FAQs monthly report fewer repeated support questions and faster resolution times.'),
    ('customer_success', 'adoption_success_story', 'Quick wins accelerate onboarding adoption',
     'Celebrating first automation and first briefing milestones within the first two weeks improves long-term adoption.'),
    ('governance', 'governance_recommendation', 'Governance review before automation expansion',
     'Requiring governance approval for high-impact automations reduces rollback incidents and builds trust.'),
    ('industry', 'blueprint_enhancement', 'Industry Blueprint alignment improves rollout consistency',
     'Organizations applying vertical Blueprints report faster configuration and fewer governance escalations during rollout.'),
    ('operational', 'operational_lesson', 'Crisis playbooks reduce recovery time',
     'Documented continuity approaches help teams respond to external dependency disruptions with clearer ownership.')
  ) as v(cat, type, title, desc)
  where not exists (
    select 1 from public.community_contributions cc
    where cc.tenant_id = p_tenant_id and cc.title = v.title and cc.status = 'published'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Industry + learning engine integration seeds
-- ---------------------------------------------------------------------------
create or replace function public._col_seed_suggestions(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_settings public.community_settings;
begin
  v_settings := public._col_ensure_settings(p_tenant_id);
  if not v_settings.participation_enabled or not v_settings.allow_contributions then return; end if;

  insert into public.community_contributions (tenant_id, category, contribution_type, title, description, source_module, status)
  select p_tenant_id, 'operational', 'operational_lesson',
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

  insert into public.community_contributions (tenant_id, category, contribution_type, title, description, source_module, status)
  select p_tenant_id, 'customer_success', 'adoption_success_story',
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

  insert into public.community_contributions (tenant_id, category, contribution_type, title, description, source_module, status)
  select p_tenant_id, 'marketplace', 'business_pack_review',
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

  insert into public.community_contributions (tenant_id, category, contribution_type, title, description, source_module, status, governance_flag)
  select p_tenant_id, 'governance', 'governance_recommendation',
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

  insert into public.community_contributions (tenant_id, category, contribution_type, title, description, source_module, status)
  select p_tenant_id, 'industry', 'blueprint_enhancement',
    'Blueprint experience: ' || coalesce(ib.title, 'Industry Blueprint'),
    'Applied industry blueprint — share vertical-specific practices after anonymization review.',
    'industry_blueprints', 'draft'
  from public.tenant_blueprint_installs tbi
  join public.industry_blueprints ib on ib.id = tbi.blueprint_id
  where tbi.tenant_id = p_tenant_id and tbi.status in ('applied', 'partially_applied')
  and not exists (
    select 1 from public.community_contributions cc
    where cc.tenant_id = p_tenant_id
      and cc.title = 'Blueprint experience: ' || coalesce(ib.title, 'Industry Blueprint')
  )
  limit 2;
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Scores — Collective Intelligence Score naming
-- ---------------------------------------------------------------------------
create or replace function public._col_calculate_scores(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_intelligence_score numeric := 60;
  v_health_score numeric := 65;
  v_published int;
  v_draft int;
  v_pending int;
  v_avg_rating numeric;
  v_global_published int;
  v_cat_diversity int;
  v_id uuid;
begin
  select count(*) filter (where status = 'published'),
         count(*) filter (where status = 'draft'),
         count(*) filter (where status in ('review', 'governance_check', 'anonymization_check'))
  into v_published, v_draft, v_pending
  from public.community_contributions where tenant_id = p_tenant_id;

  select coalesce(avg(rating_avg), 0) into v_avg_rating
  from public.community_contributions
  where tenant_id = p_tenant_id and status = 'published';

  select count(distinct category) into v_cat_diversity
  from public.community_contributions where tenant_id = p_tenant_id;

  select count(*) into v_global_published
  from public.community_contributions where status = 'published' and anonymization_verified = true;

  v_intelligence_score := least(100, 35 + v_published * 10 + v_avg_rating * 8 + v_cat_diversity * 3);
  v_health_score := least(100, 25 + v_global_published * 2 + v_cat_diversity * 10 + case when v_pending > 0 then 8 else 15 end);

  insert into public.community_scores (tenant_id, contribution_score, health_score, score_components)
  values (p_tenant_id, v_intelligence_score, v_health_score, jsonb_build_object(
    'validation_quality', least(100, 50 + v_published * 15),
    'community_usefulness', v_intelligence_score,
    'governance_compliance', case when v_pending = 0 then 92 else 68 end,
    'outcome_evidence', least(100, 40 + v_published * 12),
    'relevance', least(100, 45 + v_cat_diversity * 10),
    'participation_diversity', least(100, v_cat_diversity * 16),
    'contribution_quality', v_intelligence_score,
    'governance_maturity', case when v_pending = 0 then 88 else 72 end,
    'community_trust', 85,
    'knowledge_growth', least(100, 30 + v_global_published * 3)
  )) returning id into v_id;

  perform public._col_log_audit(p_tenant_id, 'scores_calculated',
    'Collective Intelligence Score: ' || v_intelligence_score || ', Health Score: ' || v_health_score,
    jsonb_build_object('intelligence_score', v_intelligence_score, 'health_score', v_health_score));

  return jsonb_build_object(
    'intelligence_score', v_intelligence_score,
    'contribution_score', v_intelligence_score,
    'health_score', v_health_score,
    'components', jsonb_build_object(
      'validation_quality', least(100, 50 + v_published * 15),
      'community_usefulness', v_intelligence_score,
      'governance_compliance', case when v_pending = 0 then 92 else 68 end,
      'outcome_evidence', least(100, 40 + v_published * 12),
      'relevance', least(100, 45 + v_cat_diversity * 10),
      'participation_diversity', least(100, v_cat_diversity * 16),
      'contribution_quality', v_intelligence_score,
      'governance_maturity', case when v_pending = 0 then 88 else 72 end,
      'community_trust', 85,
      'knowledge_growth', least(100, 30 + v_global_published * 3)
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Governance workflow with anonymization check
-- ---------------------------------------------------------------------------
create or replace function public.review_community_contribution(
  p_contribution_id uuid, p_decision text, p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_contrib public.community_contributions;
  v_new_status text;
  v_anon_title text;
  v_anon_desc text;
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
      v_new_status := case when v_contrib.governance_flag then 'governance_check' else 'anonymization_check' end;
    when p_decision = 'approve' and v_contrib.status = 'governance_check' then
      v_new_status := 'anonymization_check';
    when p_decision = 'publish' and v_contrib.status = 'anonymization_check' then
      v_new_status := 'published';
    when p_decision = 'publish' and v_contrib.status in ('review', 'governance_check') then
      v_new_status := 'anonymization_check';
    else null;
  end case;

  if v_new_status = 'published' then
    v_anon_title := public._col_anonymize_text(v_contrib.title);
    v_anon_desc := public._col_anonymize_text(v_contrib.description);
    update public.community_contributions set
      status = 'published',
      anonymized_title = v_anon_title,
      anonymized_description = v_anon_desc,
      anonymization_verified = true,
      published_at = now(),
      updated_at = now()
    where id = p_contribution_id;
    perform public._col_log_audit(v_tenant_id, 'contribution_published',
      'Contribution published after anonymization: ' || v_contrib.title,
      jsonb_build_object('contribution_id', p_contribution_id, 'anonymization_verified', true));
  elsif v_new_status = 'anonymization_check' then
    update public.community_contributions set
      status = 'anonymization_check',
      anonymized_title = public._col_anonymize_text(v_contrib.title),
      anonymized_description = public._col_anonymize_text(v_contrib.description),
      updated_at = now()
    where id = p_contribution_id;
    perform public._col_log_audit(v_tenant_id, 'anonymization_check',
      'Anonymization check queued: ' || v_contrib.title,
      jsonb_build_object('contribution_id', p_contribution_id));
  elsif v_new_status is not null then
    update public.community_contributions set status = v_new_status, updated_at = now()
    where id = p_contribution_id;
    perform public._col_log_audit(v_tenant_id,
      case when p_decision = 'reject' then 'contribution_rejected' else 'contribution_reviewed' end,
      'Review decision: ' || p_decision,
      jsonb_build_object('contribution_id', p_contribution_id, 'decision', p_decision, 'new_status', v_new_status));
  end if;

  insert into public.community_reviews (contribution_id, tenant_id, reviewer_id, decision, notes)
  values (p_contribution_id, v_tenant_id, public._col_auth_user_id(), p_decision, p_notes);

  return jsonb_build_object('status', v_new_status, 'decision', p_decision, 'anonymization_required', true);
end; $$;

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

  if v_settings.require_governance_review then v_status := 'review'; end if;

  insert into public.community_contributions (
    tenant_id, category, contribution_type, title, description, status
  ) values (
    v_tenant_id, public._col_type_to_category(p_type), p_type, p_title, p_description, v_status
  ) returning id into v_id;

  perform public._col_log_audit(v_tenant_id, 'contribution_created',
    'Contribution submitted: ' || p_title,
    jsonb_build_object('contribution_id', v_id, 'type', p_type, 'category', public._col_type_to_category(p_type), 'status', v_status));

  return jsonb_build_object(
    'contribution_id', v_id, 'status', v_status,
    'governance_required', v_settings.require_governance_review,
    'participation_voluntary', true
  );
end; $$;

create or replace function public.rate_community_contribution(
  p_contribution_id uuid, p_rating int
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_avg numeric; v_count int;
begin
  v_tenant_id := public._col_require_tenant();
  if p_rating < 1 or p_rating > 5 then raise exception 'Usefulness rating must be between 1 and 5'; end if;

  if not exists (
    select 1 from public.community_contributions
    where id = p_contribution_id and status = 'published'
  ) then raise exception 'Contribution not found or not published'; end if;

  insert into public.community_ratings (contribution_id, tenant_id, rating, usefulness_rating)
  values (p_contribution_id, v_tenant_id, p_rating, p_rating)
  on conflict (contribution_id, tenant_id) do update set rating = p_rating, usefulness_rating = p_rating;

  select avg(usefulness_rating)::numeric(3,2), count(*) into v_avg, v_count
  from public.community_ratings where contribution_id = p_contribution_id;

  update public.community_contributions set rating_avg = v_avg, rating_count = v_count
  where id = p_contribution_id;

  perform public._col_log_audit(v_tenant_id, 'contribution_rated',
    'Rated contribution usefulness',
    jsonb_build_object('contribution_id', p_contribution_id, 'usefulness_rating', p_rating));

  return jsonb_build_object('rating_avg', v_avg, 'rating_count', v_count, 'usefulness_rating', p_rating);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Dashboard RPCs — hub + admin enrichment
-- ---------------------------------------------------------------------------
create or replace function public.get_community_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_health numeric; v_intelligence numeric; v_pending int;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  select health_score, contribution_score into v_health, v_intelligence
  from public.community_scores where tenant_id = v_tenant_id order by calculated_at desc limit 1;

  select count(*) into v_pending from public.community_contributions
  where tenant_id = v_tenant_id and status in ('review', 'governance_check', 'anonymization_check');

  return jsonb_build_object(
    'has_customer', true,
    'health_score', coalesce(v_health, 0),
    'intelligence_score', coalesce(v_intelligence, 0),
    'contribution_score', coalesce(v_intelligence, 0),
    'pending_reviews', v_pending,
    'philosophy', 'Organizations own their knowledge. Organizations control participation.',
    'participation_voluntary', true
  );
end; $$;

create or replace function public.get_community_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.community_settings;
  v_scores jsonb;
  v_briefings jsonb;
begin
  v_tenant_id := public._col_require_tenant();
  v_settings := public._col_ensure_settings(v_tenant_id);
  perform public._col_seed_templates(v_tenant_id);
  perform public._col_seed_suggestions(v_tenant_id);
  v_scores := public._col_calculate_scores(v_tenant_id);
  perform public._col_trust_explanation(v_tenant_id, (v_scores->>'health_score')::numeric);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'summary', b.summary, 'created_at', b.created_at
  ) order by b.created_at desc), '[]'::jsonb) into v_briefings
  from public.community_briefings b where b.tenant_id = v_tenant_id limit 5;

  return jsonb_build_object(
    'has_customer', true,
    'participation_enabled', v_settings.participation_enabled,
    'participation_voluntary', true,
    'anonymization_required', v_settings.anonymization_required,
    'philosophy', 'Organizations own their knowledge. Organizations control participation.',
    'safety_note', 'No confidential sharing. Participation is voluntary, governed, and anonymized.',
    'health_score', v_scores->'health_score',
    'intelligence_score', v_scores->'intelligence_score',
    'contribution_score', v_scores->'contribution_score',
    'score_components', v_scores->'components',
    'featured_learnings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 300),
        'category', c.category, 'category_label', public._col_category_label(c.category),
        'contribution_type', c.contribution_type, 'type_label', public._col_contribution_type_label(c.contribution_type),
        'rating_avg', c.rating_avg, 'rating_count', c.rating_count, 'published_at', c.published_at
      ) order by c.published_at desc)
      from public.community_contributions c
      where c.status = 'published' and c.anonymization_verified = true limit 6
    ), '[]'::jsonb),
    'featured_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 300),
        'category', c.category, 'contribution_type', c.contribution_type,
        'type_label', public._col_contribution_type_label(c.contribution_type),
        'rating_avg', c.rating_avg, 'rating_count', c.rating_count
      ) order by c.published_at desc)
      from public.community_contributions c
      where c.status = 'published' and c.anonymization_verified = true limit 6
    ), '[]'::jsonb),
    'best_practices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'category', c.category,
        'category_label', public._col_category_label(c.category), 'rating_avg', c.rating_avg
      ) order by c.rating_avg desc)
      from public.community_contributions c
      where c.status = 'published' and c.category in ('knowledge', 'governance', 'operational') limit 8
    ), '[]'::jsonb),
    'recently_validated', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'category', c.category,
        'category_label', public._col_category_label(c.category), 'published_at', c.published_at
      ) order by c.published_at desc)
      from public.community_contributions c
      where c.status = 'published' and c.published_at > now() - interval '90 days' limit 8
    ), '[]'::jsonb),
    'blueprint_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200)
      ))
      from public.community_contributions c
      where c.status = 'published' and c.category = 'industry' limit 5
    ), '[]'::jsonb),
    'blueprint_discussions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200)
      ))
      from public.community_contributions c
      where c.status = 'published' and c.contribution_type = 'blueprint_enhancement' limit 5
    ), '[]'::jsonb),
    'industry_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'description', left(c.anonymized_description, 200),
        'category_label', public._col_category_label(c.category)
      ))
      from public.community_contributions c
      where c.status = 'published' and c.category = 'industry' limit 6
    ), '[]'::jsonb),
    'popular_resources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'rating_avg', c.rating_avg, 'rating_count', c.rating_count
      ) order by c.rating_avg desc, c.rating_count desc)
      from public.community_contributions c where c.status = 'published' limit 10
    ), '[]'::jsonb),
    'top_rated', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'title', c.anonymized_title, 'rating_avg', c.rating_avg, 'rating_count', c.rating_count
      ) order by c.rating_avg desc, c.rating_count desc)
      from public.community_contributions c where c.status = 'published' limit 10
    ), '[]'::jsonb),
    'briefings', v_briefings,
    'intelligence_categories', jsonb_build_array(
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge Contributions'),
      jsonb_build_object('key', 'operational', 'label', 'Operational Contributions'),
      jsonb_build_object('key', 'governance', 'label', 'Governance Contributions'),
      jsonb_build_object('key', 'customer_success', 'label', 'Customer Success Contributions'),
      jsonb_build_object('key', 'industry', 'label', 'Industry Contributions'),
      jsonb_build_object('key', 'marketplace', 'label', 'Marketplace Contributions')
    ),
    'contribution_types', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_article', 'label', 'Knowledge Articles'),
      jsonb_build_object('key', 'implementation_guide', 'label', 'Implementation Guides'),
      jsonb_build_object('key', 'blueprint_enhancement', 'label', 'Blueprint Enhancements'),
      jsonb_build_object('key', 'business_pack_review', 'label', 'Business Pack Reviews'),
      jsonb_build_object('key', 'operational_lesson', 'label', 'Operational Lessons Learned'),
      jsonb_build_object('key', 'governance_recommendation', 'label', 'Governance Recommendations'),
      jsonb_build_object('key', 'adoption_success_story', 'label', 'Adoption Success Stories'),
      jsonb_build_object('key', 'risk_mitigation_practice', 'label', 'Risk Mitigation Practices')
    ),
    'approval_workflow', jsonb_build_array(
      jsonb_build_object('step', 'draft', 'label', 'Draft'),
      jsonb_build_object('step', 'review', 'label', 'Internal Review'),
      jsonb_build_object('step', 'governance_check', 'label', 'Governance Validation'),
      jsonb_build_object('step', 'anonymization_check', 'label', 'Anonymization Check'),
      jsonb_build_object('step', 'published', 'label', 'Publication Approval'),
      jsonb_build_object('step', 'community_rating', 'label', 'Community Availability')
    ),
    'integrations', jsonb_build_object(
      'learning_engine', 'Improves recommendations, knowledge suggestions, and Human Success initiatives',
      'knowledge_center', 'Enriches FAQs, playbooks, best practices, and Blueprint guidance',
      'global_learning', 'Strengthens pattern recognition and industry guidance',
      'marketplace', 'Community feedback, outcome validation, and pack improvements',
      'strategic_intelligence', 'Emerging trends, repeated opportunities, and community priorities',
      'human_success', 'Successful onboarding patterns and adoption accelerators',
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
  v_governance jsonb;
  v_trends jsonb;
  v_categories jsonb;
  v_participation jsonb;
begin
  v_tenant_id := public._col_require_tenant();
  perform public._col_require_admin();
  v_settings := public._col_ensure_settings(v_tenant_id);
  perform public._col_seed_suggestions(v_tenant_id);
  v_scores := public._col_calculate_scores(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.title, 'category', c.category,
    'category_label', public._col_category_label(c.category),
    'contribution_type', c.contribution_type,
    'type_label', public._col_contribution_type_label(c.contribution_type),
    'status', c.status, 'governance_flag', c.governance_flag, 'created_at', c.created_at
  ) order by c.created_at desc), '[]'::jsonb) into v_pending
  from public.community_contributions c
  where c.tenant_id = v_tenant_id and c.status in ('review', 'governance_check', 'anonymization_check')
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.title, 'category', c.category, 'contribution_type', c.contribution_type,
    'status', c.status, 'source_module', c.source_module, 'created_at', c.created_at
  ) order by case c.status when 'draft' then 1 when 'review' then 2 when 'governance_check' then 3 else 4 end, c.created_at desc), '[]'::jsonb)
  into v_queue
  from public.community_contributions c
  where c.tenant_id = v_tenant_id and c.status not in ('archived', 'rejected')
  limit 25;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'title', c.title, 'governance_flag', c.governance_flag, 'status', c.status, 'category', c.category
  )), '[]'::jsonb) into v_governance
  from public.community_contributions c
  where c.tenant_id = v_tenant_id
    and (c.governance_flag = true or c.status in ('governance_check', 'anonymization_check'))
    and c.status not in ('published', 'rejected', 'archived')
  limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'health_score', s.health_score,
    'intelligence_score', s.contribution_score,
    'contribution_score', s.contribution_score,
    'calculated_at', s.calculated_at
  ) order by s.calculated_at desc), '[]'::jsonb) into v_trends
  from public.community_scores s where s.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'category', c.category, 'label', public._col_category_label(c.category), 'count', count(*)
  )), '[]'::jsonb) into v_categories
  from public.community_contributions c
  where c.tenant_id = v_tenant_id and c.status != 'archived'
  group by c.category;

  v_participation := jsonb_build_object(
    'participation_enabled', v_settings.participation_enabled,
    'allow_contributions', v_settings.allow_contributions,
    'published_count', (select count(*) from public.community_contributions where tenant_id = v_tenant_id and status = 'published'),
    'draft_count', (select count(*) from public.community_contributions where tenant_id = v_tenant_id and status = 'draft'),
    'pending_count', (select count(*) from public.community_contributions where tenant_id = v_tenant_id and status in ('review', 'governance_check', 'anonymization_check'))
  );

  return jsonb_build_object(
    'has_customer', true,
    'participation_enabled', v_settings.participation_enabled,
    'require_governance_review', v_settings.require_governance_review,
    'health_score', v_scores->'health_score',
    'intelligence_score', v_scores->'intelligence_score',
    'contribution_score', v_scores->'contribution_score',
    'pending_reviews', v_pending,
    'governance_queue', v_governance,
    'governance_flags', v_governance,
    'contribution_queue', v_queue,
    'contribution_trends', v_trends,
    'intelligence_trends', v_trends,
    'intelligence_categories', v_categories,
    'participation_insights', v_participation,
    'pending_count', jsonb_array_length(v_pending),
    'queue_count', jsonb_array_length(v_queue)
  );
end; $$;

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
    'Collective Intelligence Score ' || (v_scores->>'intelligence_score') || '/100';

  v_content := jsonb_build_object(
    'health_score', v_scores->'health_score',
    'intelligence_score', v_scores->'intelligence_score',
    'emerging_themes', coalesce((
      select jsonb_agg(distinct category) from public.community_contributions where status = 'published' limit 8
    ), '[]'::jsonb),
    'validated_best_practices', coalesce((
      select jsonb_agg(jsonb_build_object('title', anonymized_title, 'category', category, 'rating', rating_avg))
      from public.community_contributions
      where status = 'published' and anonymization_verified = true
      order by rating_avg desc limit 5
    ), '[]'::jsonb),
    'high_value_insights', coalesce((
      select jsonb_agg(jsonb_build_object('title', anonymized_title, 'description', left(anonymized_description, 200)))
      from public.community_contributions
      where status = 'published' order by published_at desc limit 5
    ), '[]'::jsonb),
    'improvement_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'category', category))
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

create or replace function public._col_trust_explanation(p_tenant_id uuid, p_health numeric)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.generate_decision_explanation(
    'col-health-' || p_tenant_id::text,
    'community',
    'community',
    'Community Health Score: ' || p_health || '/100',
    'Based on governed, anonymized contributions only. Organizations own their knowledge and control participation.',
    jsonb_build_array(
      jsonb_build_object('source', 'community_contributions'),
      jsonb_build_object('source', 'governance_reviews'),
      jsonb_build_object('source', 'anonymization_validation')
    ),
    jsonb_build_array('voluntary_participation', 'anonymization_required', 'no_confidential_sharing', 'opt_in_only'),
    'medium',
    '["opt_out","defer_sharing"]'::jsonb,
    jsonb_build_array('Review pending contributions', 'Verify anonymization', 'Participate voluntarily'),
    jsonb_build_object(
      'simple', 'This score reflects the strength of shared, governed community intelligence.',
      'operational', 'Only anonymized and approved contributions contribute to collective intelligence.',
      'technical', 'Factors: participation diversity, contribution quality, governance maturity, community trust, knowledge growth.'
    )
  );
end; $$;
