-- Skills Marketplace naming standard — replace AI skill labels with product-oriented names

create or replace function public._sme_normalize_skill_name(p_key text, p_name text)
returns text
language sql
immutable
as $$
  select case coalesce(p_key, '')
    when 'support-assistant' then 'Support Specialist'
    when 'analytics-assistant' then 'Analytics Center'
    when 'commerce-assistant' then 'Commerce Specialist'
    when 'executive-briefings' then 'Executive Briefing'
    when 'executive-briefing' then 'Executive Briefing'
    when 'marketing-assistant' then 'Marketing Specialist'
    when 'moderation-assistant' then 'Moderation Center'
    when 'memory-engine' then 'Memory Engine'
    when 'knowledge-center' then 'Knowledge Center'
    when 'knowledge-assistant' then 'Knowledge Center'
    else case coalesce(p_name, '')
      when 'Analytics AI' then 'Analytics Center'
      when 'Commerce AI' then 'Commerce Specialist'
      when 'Executive AI' then 'Executive Briefing'
      when 'Executive Briefings' then 'Executive Briefing'
      when 'Marketing AI' then 'Marketing Specialist'
      when 'Moderation AI' then 'Moderation Center'
      when 'Memory Engine AI' then 'Memory Engine'
      when 'Support AI' then 'Support Specialist'
      when 'Support Assistant' then 'Support Specialist'
      when 'Knowledge AI' then 'Knowledge Center'
      when 'Knowledge Base Assistant' then 'Knowledge Center'
      when 'Compliance AI' then 'Compliance Center'
      when 'Growth AI' then 'Growth Specialist'
      when 'Marketing Assistant' then 'Marketing Specialist'
      when 'Commerce Assistant' then 'Commerce Specialist'
      else coalesce(p_name, 'Skill')
    end
  end;
$$;

update public.skills set
  name = public._sme_normalize_skill_name(key, name),
  description = case key
    when 'support-assistant' then 'Operational support for customer-facing questions.'
    when 'analytics-assistant' then 'Operational analytics and trend summaries.'
    when 'commerce-assistant' then 'Commerce operations and order-flow coordination.'
    when 'executive-briefings' then 'Morning briefings and executive operational summaries.'
    when 'marketing-assistant' then 'Campaign and communication drafting support.'
    when 'moderation-assistant' then 'Content moderation and policy enforcement operations.'
    else description
  end,
  updated_at = now()
where key in (
  'support-assistant', 'analytics-assistant', 'commerce-assistant',
  'executive-briefings', 'marketing-assistant', 'moderation-assistant',
  'knowledge-assistant'
)
or name in (
  'Analytics AI', 'Commerce AI', 'Executive AI', 'Marketing AI', 'Moderation AI',
  'Memory Engine AI', 'Support AI', 'Knowledge AI', 'Compliance AI', 'Growth AI'
);

grant execute on function public._sme_normalize_skill_name(text, text) to authenticated;
