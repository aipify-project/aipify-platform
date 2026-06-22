-- Companion foundation reconnection: import canonical Self Love KC articles from approved seed paths.

create or replace function public._companion_import_self_love_kc_articles()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_self_love_cat uuid;
  v_abos_cat uuid;
  v_faq_cat uuid;
  v_id uuid;
  v_count int := 0;
begin
  perform public.seed_kc_global_categories();

  insert into public.aipify_knowledge_categories (tenant_id, slug, name, sort_order, visibility)
  values
    (null, 'self-love-engine', 'Self Love Engine', 20, 'authenticated'),
    (null, 'abos', 'ABOS', 21, 'authenticated')
  on conflict do nothing;

  select id into v_self_love_cat from public.aipify_knowledge_categories
  where slug = 'self-love-engine' and tenant_id is null limit 1;
  select id into v_abos_cat from public.aipify_knowledge_categories
  where slug = 'abos' and tenant_id is null limit 1;
  select id into v_faq_cat from public.aipify_knowledge_categories
  where slug = 'faq' and tenant_id is null limit 1;

  if not exists (
    select 1 from public.aipify_knowledge_articles
    where source_path = 'content/knowledge/aipify/self-love-engine/articles/what-is-self-love-in-aipify.md'
      and tenant_id is null
  ) then
    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, summary, body, language, article_type, status, visibility,
      tags, keywords, is_global, published_at, source_path
    ) values (
      null, v_self_love_cat,
      'what-is-self-love-in-aipify',
      'What is Self Love in Aipify?',
      'Self Love is a principle and value within ABOS — not a trademarked product name.',
      $body$**Category:** Self Love Engine · **Phase:** A.76

Self Love is a **principle and value** within the Aipify Business Operating System (ABOS) — not a trademarked product name. It expresses care, reflection, recovery, balance, and sustainable growth.

The **Self Love Engine** at `/app/self-love-engine` turns this philosophy into functional behavior: explainable wellbeing recommendations across four areas:

- **User Wellbeing** — pacing, breaks, reflection
- **Team Health** — coordination without surveillance
- **Organization Health** — operational rhythm and clarity
- **System Health** — aggregate quality and platform signals

Self Love informs and prepares; **humans decide**. Settings control *how* reminders appear, not whether wellbeing matters.$body$,
      'en', 'guide', 'published', 'authenticated',
      array['self-love','abos','aipify','self-love-engine'],
      array['self love','selflove','Self Love','hva er selflove','what is self love'],
      true, now(),
      'content/knowledge/aipify/self-love-engine/articles/what-is-self-love-in-aipify.md'
    ) returning id into v_id;
    perform public._kc_refresh_article_search_vector(v_id);
    v_count := v_count + 1;
  end if;

  if not exists (
    select 1 from public.aipify_knowledge_articles
    where source_path = 'content/knowledge/aipify/abos/articles/understanding-self-love.md'
      and tenant_id is null
  ) then
    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, summary, body, language, article_type, status, visibility,
      tags, keywords, is_global, published_at, source_path
    ) values (
      null, v_abos_cat,
      'understanding-self-love',
      'Understanding Self Love',
      'Self Love is an official ABOS capability — a principle, value, philosophy, and reminder.',
      $body$**Self Love** is an official capability within ABOS — Aipify's approach to self-awareness and self-maintenance.

## Naming standard

Use **Self Love** (two words, no ™). Self Love is a principle, value, philosophy, and reminder — not primarily a trademarked product name.

**Avoid:** Self Love™, SelfLove™, SELF LOVE™, Self Love Engine™

## What Self Love does

- Monitors Aipify's operational wellbeing
- Detects problems early
- Attempts **safe** recovery within approved boundaries
- Learns from incidents (metadata only)
- Communicates transparently about maintenance and health

## Philosophy

Self Love supports balance, wellbeing, reflection, sustainable growth, and compassion. ABOS treats it as natural, warm, human, and approachable — never overly commercialized.

> Systems that care for themselves are better equipped to care for others.

Self Love uses calm, positive language — never alarmist or guilt-based messaging.

## Human control

Self Love may recommend actions and perform approved low-risk maintenance. **Irreversible actions always require explicit human authorization.**$body$,
      'en', 'guide', 'published', 'authenticated',
      array['self-love','abos','aipify'],
      array['self love','selflove','Self Love','understanding self love','hva er selflove'],
      true, now(),
      'content/knowledge/aipify/abos/articles/understanding-self-love.md'
    ) returning id into v_id;
    perform public._kc_refresh_article_search_vector(v_id);
    v_count := v_count + 1;
  end if;

  if not exists (
    select 1 from public.aipify_knowledge_articles
    where source_path = 'content/knowledge/aipify/self-love-engine/faq/self-love-engine-faq.md'
      and tenant_id is null
  ) then
    insert into public.aipify_knowledge_articles (
      tenant_id, category_id, slug, title, summary, body, language, article_type, status, visibility,
      tags, keywords, is_global, published_at, source_path
    ) values (
      null, v_faq_cat,
      'self-love-engine-faq',
      'Self Love Engine FAQ',
      'FAQ for the Self Love Engine (Phase A.76).',
      $body$## What is the Self Love Engine?

Phase **A.76** ABOS engine at `/app/self-love-engine`. It unifies wellbeing principles across user, team, organization, and system health with explainable recommendations.

## Is Self Love a trademark?

No. Use **Self Love** (two words, no ™).

## Does Self Love store my emotions or chat?

No. Recommendations are **metadata only** — no raw chat, emotions, or PII.

## How is this different from Attention Guardian?

Attention Guardian (`/app/assistant/attention`) protects personal focus. Self Love Engine covers broader wellbeing across four application areas including team, organization, and system health.

## Can Self Love block my work?

Never. Suggestions only — users retain full autonomy.$body$,
      'en', 'faq', 'published', 'authenticated',
      array['self-love','faq','abos'],
      array['self love','selflove','Self Love','self love engine faq'],
      true, now(),
      'content/knowledge/aipify/self-love-engine/faq/self-love-engine-faq.md'
    ) returning id into v_id;
    perform public._kc_refresh_article_search_vector(v_id);
    v_count := v_count + 1;
  end if;

  return jsonb_build_object('imported', v_count);
end;
$$;

select public._companion_import_self_love_kc_articles();

drop function public._companion_import_self_love_kc_articles();
