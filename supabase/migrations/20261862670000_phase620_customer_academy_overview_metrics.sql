-- Phase 620 — Customer Academy overview metrics + course status enrichment

create or replace function public._aclac294_user_progress(p_company_id uuid, p_user_id uuid)
returns jsonb
language plpgsql
stable
as $$
declare
  v_catalog jsonb := public._aclac294_course_catalog();
  v_total integer;
  v_completed integer;
  v_assigned integer;
  v_in_progress integer;
  v_overdue integer;
begin
  select count(*)::int into v_total from jsonb_array_elements(v_catalog) c where (c->>'content_type') = 'course';
  select count(*)::int into v_completed
  from public.app_portal_academy_completions co
  where co.company_id = p_company_id and co.user_id = p_user_id;

  select
    count(*)::int,
    count(*) filter (where a.status = 'in_progress')::int,
    count(*) filter (where a.status = 'overdue' or (a.due_date is not null and a.due_date < current_date and a.status <> 'completed'))::int
  into v_assigned, v_in_progress, v_overdue
  from public.app_portal_academy_assignments a
  where a.company_id = p_company_id
    and (a.assignee_user_id = p_user_id or (a.assignee_user_id is null and trim(a.department) <> ''))
    and a.status <> 'completed';

  return jsonb_build_object(
    'courses_available', v_total,
    'courses_total', v_total,
    'courses_assigned', v_assigned,
    'courses_completed', v_completed,
    'courses_started', v_assigned + v_completed,
    'courses_in_progress', v_in_progress,
    'courses_overdue', v_overdue,
    'completion_percent', case when v_total > 0 then round((v_completed::numeric / v_total) * 100)::int else 0 end,
    'outstanding_assignments', v_assigned
  );
end;
$$;

create or replace function public.list_app_portal_academy(
  p_category text default null,
  p_completion_status text default null,
  p_certification_type text default null,
  p_department text default null,
  p_assigned_by uuid default null,
  p_difficulty text default null,
  p_search text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_company_id uuid;
  v_user_id uuid;
  v_progress jsonb;
  v_courses jsonb := '[]'::jsonb;
  v_recommended jsonb := '[]'::jsonb;
  v_assigned jsonb := '[]'::jsonb;
  v_certifications jsonb := '[]'::jsonb;
  v_recent jsonb := '[]'::jsonb;
  v_paths jsonb := '[]'::jsonb;
  v_team jsonb := '[]'::jsonb;
  v_team_rate integer := 0;
  v_course jsonb;
  v_completed boolean;
  v_assigned_flag boolean;
  v_assignment_status text;
  v_progress_status text;
begin
  v_ctx := public._aclac294_access_context();
  v_company_id := (v_ctx->>'company_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_progress := public._aclac294_user_progress(v_company_id, v_user_id);

  for v_course in
    select c from jsonb_array_elements(public._aclac294_course_catalog()) c
    where (p_category is null or c->>'category' = p_category)
      and (p_difficulty is null or c->>'difficulty' = p_difficulty)
      and (
        p_search is null or trim(p_search) = ''
        or c->>'title' ilike '%' || trim(p_search) || '%'
        or c->>'description' ilike '%' || trim(p_search) || '%'
      )
  loop
    select exists (
      select 1 from public.app_portal_academy_completions co
      where co.company_id = v_company_id and co.user_id = v_user_id and co.course_slug = v_course->>'slug'
    ) into v_completed;

    select exists (
      select 1 from public.app_portal_academy_assignments a
      where a.company_id = v_company_id and a.course_slug = v_course->>'slug'
        and (a.assignee_user_id = v_user_id or (a.assignee_user_id is null and trim(a.department) <> ''))
    ) into v_assigned_flag;

    select a.status into v_assignment_status
    from public.app_portal_academy_assignments a
    where a.company_id = v_company_id and a.course_slug = v_course->>'slug'
      and (a.assignee_user_id = v_user_id or (a.assignee_user_id is null and trim(a.department) <> ''))
    order by a.updated_at desc nulls last
    limit 1;

    if v_completed then
      v_progress_status := 'completed';
    elsif v_assignment_status = 'overdue' or (
      v_assignment_status is not null
      and exists (
        select 1 from public.app_portal_academy_assignments a
        where a.company_id = v_company_id and a.course_slug = v_course->>'slug'
          and (a.assignee_user_id = v_user_id or (a.assignee_user_id is null and trim(a.department) <> ''))
          and a.due_date is not null and a.due_date < current_date and a.status <> 'completed'
      )
    ) then
      v_progress_status := 'overdue';
    elsif v_assignment_status = 'in_progress' then
      v_progress_status := 'in_progress';
    elsif v_assigned_flag then
      v_progress_status := 'assigned';
    else
      v_progress_status := 'not_started';
    end if;

    if p_completion_status is not null then
      if p_completion_status = 'completed' and not v_completed then continue; end if;
      if p_completion_status = 'not_started' and v_completed then continue; end if;
      if p_completion_status = 'in_progress' and v_progress_status <> 'in_progress' then continue; end if;
    end if;

    v_courses := v_courses || (v_course || jsonb_build_object(
      'completed', v_completed,
      'assigned', v_assigned_flag,
      'assignment_status', coalesce(v_assignment_status, ''),
      'progress_status', v_progress_status,
      'recommendation_reason', case
        when v_course->>'section' = 'getting_started' then 'onboarding'
        when v_course->>'slug' ilike '%security%' then 'security'
        when v_course->>'slug' ilike '%business%' then 'businessPacks'
        else 'adoption'
      end
    ));
  end loop;

  select coalesce(jsonb_agg(c order by (c->>'section'), (c->>'title')), '[]'::jsonb)
  into v_recommended
  from (
    select c || jsonb_build_object(
      'completed', false,
      'recommendation_reason', case
        when c->>'section' = 'getting_started' then 'onboarding'
        when c->>'slug' ilike '%security%' then 'security'
        when c->>'slug' ilike '%business%' then 'businessPacks'
        else 'adoption'
      end
    ) as c
    from jsonb_array_elements(public._aclac294_course_catalog()) c
    where c->>'section' in ('getting_started', 'product_training')
      and not exists (
        select 1 from public.app_portal_academy_completions co
        where co.company_id = v_company_id and co.user_id = v_user_id and co.course_slug = c->>'slug'
      )
    limit 5
  ) sub;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'course_slug', a.course_slug, 'course_title', a.course_title,
    'section', a.section, 'required', a.required, 'due_date', a.due_date,
    'status', case when a.due_date is not null and a.due_date < current_date and a.status <> 'completed' then 'overdue' else a.status end,
    'department', a.department
  ) order by a.due_date asc nulls last), '[]'::jsonb)
  into v_assigned
  from public.app_portal_academy_assignments a
  where a.company_id = v_company_id
    and (a.assignee_user_id = v_user_id or (a.assignee_user_id is null and trim(a.department) <> ''))
    and (p_department is null or trim(p_department) = '' or a.department = p_department)
    and (p_assigned_by is null or a.assigned_by = p_assigned_by);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ce.id, 'certification_type', ce.certification_type,
    'title', cat->>'title', 'status', ce.status, 'earned_at', ce.earned_at,
    'required_courses', cat->'required_courses'
  )), '[]'::jsonb)
  into v_certifications
  from public.app_portal_academy_certifications ce
  cross join lateral (
    select c as cat from jsonb_array_elements(public._aclac294_certification_catalog()) c
    where c->>'type' = ce.certification_type limit 1
  ) cat
  where ce.company_id = v_company_id and ce.user_id = v_user_id
    and (p_certification_type is null or ce.certification_type = p_certification_type);

  select coalesce(jsonb_agg(c), '[]'::jsonb) into v_recent
  from (
    select c from jsonb_array_elements(public._aclac294_course_catalog()) c
    where c->>'content_type' = 'course'
    order by c->>'slug' desc limit 4
  ) sub;

  v_paths := jsonb_build_array(
    jsonb_build_object('id', 'path-getting-started', 'title', 'Getting Started Path', 'section', 'getting_started', 'href', '/app/support/academy?section=getting_started'),
    jsonb_build_object('id', 'path-product', 'title', 'Product Training Path', 'section', 'product_training', 'href', '/app/support/academy?section=product_training'),
    jsonb_build_object('id', 'path-certification', 'title', 'Certification Path', 'section', 'certifications', 'href', '/app/support/academy?section=certifications')
  );

  if coalesce(v_ctx->>'can_manage', 'false') = 'true' then
    v_team := public._aclac294_team_reporting(v_company_id);
    select round(avg((t->>'completion_rate')::numeric))::int into v_team_rate
    from jsonb_array_elements(v_team) t
    where (t->>'assigned_count')::int > 0;
  end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'can_admin', coalesce(v_ctx->>'can_admin', 'false') = 'true',
    'progress', v_progress,
    'courses', v_courses,
    'recommended_courses', v_recommended,
    'assigned_training', v_assigned,
    'certifications', v_certifications,
    'recently_released', v_recent,
    'suggested_paths', v_paths,
    'team_reporting', v_team,
    'team_completion_rate', coalesce(v_team_rate, 0)
  );
end;
$$;
