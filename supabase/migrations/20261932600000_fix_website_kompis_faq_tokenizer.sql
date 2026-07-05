-- WEBSITE.KOMPIS.FAQ.RETRIEVAL.TOKENIZER.HOTFIX — split FAQ query tokens on whitespace/punctuation
-- Fixes _wpkf_faq_query_tokens using a delimiter class that treats spaces as separators.

create or replace function public._wpkf_faq_query_tokens(p_query text)
returns text[]
language sql
immutable
as $$
  select coalesce(array_agg(distinct token order by token), '{}'::text[])
  from (
    select trim(token) as token
    from unnest(
      regexp_split_to_array(
        lower(trim(coalesce(p_query, ''))),
        '[^[:alnum:]æøå]+'
      )
    ) as token
    where length(trim(token)) >= 2
      and trim(token) not in (
        'har','det','den','der','som','kan','jeg','vi','er','når','hva','hvor',
        'du','dere','deg','din','mitt','vår','for','med','til','fra','om','ikke',
        'eller','en','et','i','på','av','the','and','you','your','our','are','can',
        'how','what','when','where','who','why','is','it','be','to','of','in','on',
        'at','by','an','as','we','me','my','do','does','did'
      )
  ) t
  where token <> '';
$$;

revoke all on function public._wpkf_faq_query_tokens(text) from public, anon;
