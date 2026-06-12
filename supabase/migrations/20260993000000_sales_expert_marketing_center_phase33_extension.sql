-- Phase 33 Extension — Sales Expert Marketing Center
-- Extends Sales Expert Operating System (A.95 + Phase 41 + 45 + 46). Metadata only — no PII in dashboard RPCs.

-- ---------------------------------------------------------------------------
-- 1. sales_expert_marketing_settings
-- ---------------------------------------------------------------------------
create table if not exists public.sales_expert_marketing_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  tracking_slug text not null default '',
  preferred_locale text not null default 'en' check (preferred_locale in ('en', 'no', 'sv', 'da')),
  tracking_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.sales_expert_marketing_settings enable row level security;
revoke all on public.sales_expert_marketing_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. sales_expert_marketing_events (metadata counts only — no PII)
-- ---------------------------------------------------------------------------
create table if not exists public.sales_expert_marketing_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_type text not null check (event_type in ('click', 'lead', 'signup', 'subscription')),
  channel_key text not null default 'unknown',
  banner_key text,
  link_pattern text,
  count_value int not null default 1 check (count_value >= 0),
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);

create index if not exists sales_expert_marketing_events_org_idx
  on public.sales_expert_marketing_events (organization_id, event_type, recorded_at desc);

alter table public.sales_expert_marketing_events enable row level security;
revoke all on public.sales_expert_marketing_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Helpers (_seosmc_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._seosmc_ensure_settings(p_organization_id uuid)
returns public.sales_expert_marketing_settings language plpgsql security definer set search_path = public as $$
declare
  v_row public.sales_expert_marketing_settings;
  v_seos public.organization_sales_expert_settings;
  v_slug text;
begin
  v_seos := public._seos_ensure_settings(p_organization_id);

  v_slug := coalesce(
    nullif(trim(v_seos.metadata->>'tracking_slug'), ''),
    nullif(trim(v_seos.personal_link), ''),
    lower(regexp_replace(
      coalesce(nullif(trim(v_seos.expert_display_name), ''), 'sales-expert'),
      '[^a-zA-Z0-9]+', '-', 'g'
    )) || '-' || left(replace(p_organization_id::text, '-', ''), 6)
  );

  insert into public.sales_expert_marketing_settings (organization_id, tracking_slug)
  values (p_organization_id, v_slug)
  on conflict (organization_id) do update
    set tracking_slug = case
      when sales_expert_marketing_settings.tracking_slug = '' then excluded.tracking_slug
      else sales_expert_marketing_settings.tracking_slug
    end,
    updated_at = now();

  select * into v_row from public.sales_expert_marketing_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._seosmc_resolve_locale(p_organization_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare
  v_locale text;
begin
  select coalesce(nullif(trim(s.preferred_locale), ''), 'en')
    into v_locale
  from public.sales_expert_marketing_settings s
  where s.organization_id = p_organization_id;

  if v_locale is null then
    v_locale := 'en';
  end if;

  return v_locale;
end; $$;

create or replace function public._seosmc_blueprint_mission()
returns text language sql immutable as $$
  select 'Equip Sales Experts with ethical, honest marketing tools — personal tracking links, banners, and ready-made copy that represent Aipify accurately.';
$$;

create or replace function public._seosmc_blueprint_features()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Personal Sales Expert tracking links (slug-based)',
    'Banner embed codes — four standard sizes auto-linked to expert URL',
    'Ready-made promotional text packs (general, WordPress, Shopify, WooCommerce)',
    'Social media copy, forum examples, email snippets, video content ideas',
    'Platform-specific promotion guidance',
    'Channel guidance — local visits, phone, email, LinkedIn, TikTok, YouTube, communities',
    'Forum & community guidelines — helpful and educational, never spam',
    'Performance tracking summary — link clicks, signups, subscriptions (metadata counts)',
    'Sales Coach marketing connection — companion examples for sustainable outreach',
    'Self Love connection — one channel at a time, sustainable marketing pace'
  );
$$;

create or replace function public._seosmc_personal_links(p_slug text)
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'partner',
      'label', 'Partner link',
      'url', format('https://aipify.ai/partner/%s', p_slug),
      'pattern', 'aipify.ai/partner/{slug}',
      'tracks', jsonb_build_array('leads', 'signups', 'subscriptions', 'customer_source', 'commission_eligibility')
    ),
    jsonb_build_object(
      'key', 'sales',
      'label', 'Sales Expert link',
      'url', format('https://aipify.ai/sales/%s', p_slug),
      'pattern', 'aipify.ai/sales/{slug}',
      'tracks', jsonb_build_array('leads', 'signups', 'subscriptions', 'customer_source', 'commission_eligibility')
    ),
    jsonb_build_object(
      'key', 'ref',
      'label', 'Referral parameter link',
      'url', format('https://aipify.ai/?ref=%s', p_slug),
      'pattern', 'aipify.ai/?ref={slug}',
      'tracks', jsonb_build_array('leads', 'signups', 'subscriptions', 'customer_source', 'commission_eligibility')
    )
  );
$$;

create or replace function public._seosmc_banner_embed(p_slug text, p_size_key text, p_width int, p_height int)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'key', p_size_key,
    'label', format('%sx%s banner', p_width, p_height),
    'width', p_width,
    'height', p_height,
    'banner_url', format('https://aipify.ai/knowledge/assets/banners/sales-expert/%s.png', p_size_key),
    'tracking_url', format('https://aipify.ai/sales/%s', p_slug),
    'embed_html', format(
      '<a href="https://aipify.ai/sales/%s" target="_blank" rel="noopener noreferrer"><img src="https://aipify.ai/knowledge/assets/banners/sales-expert/%s.png" width="%s" height="%s" alt="Aipify — AI that works for your business" /></a>',
      p_slug, p_size_key, p_width, p_height
    ),
    'note', 'Illustrative KC/static asset path — replace with approved partner marketing assets when available.'
  );
$$;

create or replace function public._seosmc_banners(p_slug text)
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    public._seosmc_banner_embed(p_slug, '728x90', 728, 90),
    public._seosmc_banner_embed(p_slug, '300x250', 300, 250),
    public._seosmc_banner_embed(p_slug, '1080x1080', 1080, 1080),
    public._seosmc_banner_embed(p_slug, '1080x1920', 1080, 1920)
  );
$$;

create or replace function public._seosmc_promotional_text_packs(p_locale text, p_slug text)
returns jsonb language plpgsql immutable as $$
declare
  v_locale text := coalesce(nullif(trim(p_locale), ''), 'en');
begin
  if v_locale = 'no' then
    return jsonb_build_object(
      'locale', 'no',
      'packs', jsonb_build_array(
        jsonb_build_object('key', 'general', 'label', 'Generell', 'text', format('Aipify hjelper organisasjoner å jobbe smartere med install-first operasjonell AI. Lær mer: https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'wordpress', 'label', 'WordPress', 'text', format('Kjører du WordPress? Aipify installeres i admin og støtter support, assistent og arbeidsflyt der teamet ditt allerede jobber. https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'shopify', 'label', 'Shopify', 'text', format('Shopify-butikker kan få Aipify som operasjonelt lag — ikke enda et panel du må logge inn i hver dag. https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'woocommerce', 'label', 'WooCommerce', 'text', format('WooCommerce + WordPress? Aipify kobler seg til butikken og hjelper med kundestøtte og daglig drift. https://aipify.ai/sales/%s', p_slug))
      ),
      'social_media', jsonb_build_array(
        jsonb_build_object('key', 'linkedin', 'text', format('Hjelper bedrifter å jobbe smartere med Aipify — install-first AI som jobber der teamet ditt allerede er. Ærlig veiledning, ingen hype. https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'facebook', 'text', format('Lurer du på om AI kan hjelpe bedriften din uten å bli enda et system? Aipify installeres i det du allerede bruker. https://aipify.ai/sales/%s', p_slug))
      ),
      'forum_post', jsonb_build_object('title', 'Tips: operasjonell AI uten daglig innlogging', 'body', format('Hei — jeg hjelper bedrifter med Aipify, et install-first operasjonelt AI-lag. Det erstatter ikke folk; det støtter teamet der de jobber. Spør gjerne — ærlige svar. https://aipify.ai/sales/%s', p_slug)),
      'email_snippet', jsonb_build_object('subject', 'Kort om Aipify for [Organisasjon]', 'body', format('Hei [Navn], jeg tenkte Aipify kan være relevant — install-first AI som støtter support og drift i systemet dere allerede bruker. Kan vi ta en kort samtale? https://aipify.ai/sales/%s', p_slug))
    );
  elsif v_locale = 'sv' then
    return jsonb_build_object(
      'locale', 'sv',
      'packs', jsonb_build_array(
        jsonb_build_object('key', 'general', 'label', 'Allmän', 'text', format('Aipify hjälper organisationer att arbeta smartare med install-first operativ AI. Läs mer: https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'wordpress', 'label', 'WordPress', 'text', format('Kör du WordPress? Aipify installeras i admin och stödjer support, assistent och arbetsflöde där teamet redan arbetar. https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'shopify', 'label', 'Shopify', 'text', format('Shopify-butiker kan få Aipify som operativt lager — inte ännu en panel att logga in i varje dag. https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'woocommerce', 'label', 'WooCommerce', 'text', format('WooCommerce + WordPress? Aipify ansluter till butiken och hjälper med kundsupport och daglig drift. https://aipify.ai/sales/%s', p_slug))
      ),
      'social_media', jsonb_build_array(
        jsonb_build_object('key', 'linkedin', 'text', format('Hjälper företag att arbeta smartare med Aipify — install-first AI som arbetar där teamet redan är. Ärlig vägledning, inget hype. https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'facebook', 'text', format('Undrar du om AI kan hjälpa ditt företag utan att bli ännu ett system? Aipify installeras i det du redan använder. https://aipify.ai/sales/%s', p_slug))
      ),
      'forum_post', jsonb_build_object('title', 'Tips: operativ AI utan daglig inloggning', 'body', format('Hej — jag hjälper företag med Aipify, ett install-first operativt AI-lager. Det ersätter inte människor; det stödjer teamet där de arbetar. Fråga gärna — ärliga svar. https://aipify.ai/sales/%s', p_slug)),
      'email_snippet', jsonb_build_object('subject', 'Kort om Aipify för [Organisation]', 'body', format('Hej [Namn], jag tänkte Aipify kan vara relevant — install-first AI som stödjer support och drift i systemet ni redan använder. Kan vi ta ett kort samtal? https://aipify.ai/sales/%s', p_slug))
    );
  elsif v_locale = 'da' then
    return jsonb_build_object(
      'locale', 'da',
      'packs', jsonb_build_array(
        jsonb_build_object('key', 'general', 'label', 'Generel', 'text', format('Aipify hjælper organisationer med at arbejde smartere med install-first operationel AI. Læs mere: https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'wordpress', 'label', 'WordPress', 'text', format('Kører du WordPress? Aipify installeres i admin og understøtter support, assistent og arbejdsgang, hvor teamet allerede arbejder. https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'shopify', 'label', 'Shopify', 'text', format('Shopify-butikker kan få Aipify som operationelt lag — ikke endnu et panel at logge ind i hver dag. https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'woocommerce', 'label', 'WooCommerce', 'text', format('WooCommerce + WordPress? Aipify forbinder til butikken og hjælper med kundesupport og daglig drift. https://aipify.ai/sales/%s', p_slug))
      ),
      'social_media', jsonb_build_array(
        jsonb_build_object('key', 'linkedin', 'text', format('Hjælper virksomheder med at arbejde smartere med Aipify — install-first AI, der arbejder, hvor teamet allerede er. Ærlig vejledning, ingen hype. https://aipify.ai/sales/%s', p_slug)),
        jsonb_build_object('key', 'facebook', 'text', format('Spekulerer du på, om AI kan hjælpe din virksomhed uden at blive endnu et system? Aipify installeres i det, du allerede bruger. https://aipify.ai/sales/%s', p_slug))
      ),
      'forum_post', jsonb_build_object('title', 'Tip: operationel AI uden daglig login', 'body', format('Hej — jeg hjælper virksomheder med Aipify, et install-first operationelt AI-lag. Det erstatter ikke mennesker; det understøtter teamet, hvor de arbejder. Spørg gerne — ærlige svar. https://aipify.ai/sales/%s', p_slug)),
      'email_snippet', jsonb_build_object('subject', 'Kort om Aipify for [Organisation]', 'body', format('Hej [Navn], jeg tænkte Aipify kan være relevant — install-first AI, der understøtter support og drift i systemet, I allerede bruger. Kan vi tage en kort samtale? https://aipify.ai/sales/%s', p_slug))
    );
  end if;

  return jsonb_build_object(
    'locale', 'en',
    'packs', jsonb_build_array(
      jsonb_build_object('key', 'general', 'label', 'General', 'text', format('Aipify helps organizations work smarter with install-first operational AI. Learn more: https://aipify.ai/sales/%s', p_slug)),
      jsonb_build_object('key', 'wordpress', 'label', 'WordPress', 'text', format('Running WordPress? Aipify installs into your admin and supports support, assistant, and workflow where your team already works. https://aipify.ai/sales/%s', p_slug)),
      jsonb_build_object('key', 'shopify', 'label', 'Shopify', 'text', format('Shopify stores can add Aipify as an operational layer — not another panel to log into every day. https://aipify.ai/sales/%s', p_slug)),
      jsonb_build_object('key', 'woocommerce', 'label', 'WooCommerce', 'text', format('WooCommerce + WordPress? Aipify connects to your store and helps with customer support and daily operations. https://aipify.ai/sales/%s', p_slug))
    ),
    'social_media', jsonb_build_array(
      jsonb_build_object('key', 'linkedin', 'text', format('Helping businesses work smarter with Aipify — install-first AI that works where your team already is. Honest guidance, no hype. https://aipify.ai/sales/%s', p_slug)),
      jsonb_build_object('key', 'facebook', 'text', format('Wondering if AI can help your business without becoming another system to manage? Aipify installs into what you already use. https://aipify.ai/sales/%s', p_slug))
    ),
    'forum_post', jsonb_build_object('title', 'Tip: operational AI without daily login', 'body', format('Hi — I help businesses with Aipify, an install-first operational AI layer. It does not replace people; it supports teams where they work. Happy to answer questions honestly. https://aipify.ai/sales/%s', p_slug)),
    'email_snippet', jsonb_build_object('subject', 'Quick note about Aipify for [Organization]', 'body', format('Hi [Name], I thought Aipify might be relevant — install-first AI that supports support and operations in the system you already use. Open to a brief conversation? https://aipify.ai/sales/%s', p_slug))
  );
end; $$;

create or replace function public._seosmc_channel_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Choose channels that fit your strengths — one channel at a time, sustainable pace.',
    'channels', jsonb_build_array(
      jsonb_build_object('key', 'local_visits', 'label', 'Local visits', 'guidance', 'In-person conversations build trust — prepare honest talking points, never overpromise.'),
      jsonb_build_object('key', 'phone', 'label', 'Phone', 'guidance', 'One-to-one calls — use Coach telephone framework; curiosity over scripts.'),
      jsonb_build_object('key', 'email', 'label', 'Email', 'guidance', 'Personal email only — Email Center templates; mass unsolicited outreach not supported.'),
      jsonb_build_object('key', 'linkedin', 'label', 'LinkedIn', 'guidance', 'Professional posts and thoughtful comments — educational, not spammy.'),
      jsonb_build_object('key', 'tiktok', 'label', 'TikTok', 'guidance', 'Short honest explainers — show real workflow value, not hype.'),
      jsonb_build_object('key', 'youtube', 'label', 'YouTube', 'guidance', 'Demo walkthroughs and customer education — install-first positioning.'),
      jsonb_build_object('key', 'facebook_groups', 'label', 'Facebook groups', 'guidance', 'Answer questions helpfully — follow community rules; disclose Sales Expert role.'),
      jsonb_build_object('key', 'wp_communities', 'label', 'WordPress communities', 'guidance', 'Share install experience — helpful plugins discussion, not aggressive promotion.'),
      jsonb_build_object('key', 'shopify_communities', 'label', 'Shopify communities', 'guidance', 'Merchant-focused tips — operational AI value for store owners.'),
      jsonb_build_object('key', 'woo_communities', 'label', 'WooCommerce communities', 'guidance', 'Woo-specific workflow examples — honest about scope and setup.'),
      jsonb_build_object('key', 'networking_events', 'label', 'Networking events', 'guidance', 'Listen first — offer follow-up, not hard pitches at the event.')
    ),
    'platform_guidance', jsonb_build_array(
      jsonb_build_object('platform', 'WordPress', 'note', 'Emphasize install into existing admin — Support AI and Assistant where users already work.'),
      jsonb_build_object('platform', 'Shopify', 'note', 'Merchant operations focus — inventory, support, and daily workflow augmentation.'),
      jsonb_build_object('platform', 'WooCommerce', 'note', 'Combined store + content workflow — honest about integration scope.'),
      jsonb_build_object('platform', 'Custom', 'note', 'Install Engine discovery — never promise unsupported integrations.')
    )
  );
$$;

create or replace function public._seosmc_forum_guidelines()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Be helpful and educational — never spam or make claims Aipify cannot support.',
    'encourage', jsonb_build_array(
      'Answer questions honestly with your experience',
      'Share educational content and KC articles',
      'Disclose your role as an Aipify Sales Expert when relevant',
      'Direct interested organizations to subscribe through your personal link',
      'Respect community rules and moderators'
    ),
    'discourage', jsonb_build_array(
      'Mass unsolicited outreach or copy-paste spam',
      'Fake claims, guaranteed results, or fear-based selling',
      'Implying Aipify replaces employees or runs companies alone',
      'Using forbidden public terms like Affiliate',
      'Pressure tactics or manipulative urgency'
    ),
    'mass_unsolicited_outreach', false
  );
$$;

create or replace function public._seosmc_video_ideas()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'install_walkthrough', 'title', 'Install walkthrough', 'idea', 'Show the modern install experience — token-free, honest timeline.'),
    jsonb_build_object('key', 'support_ai_demo', 'title', 'Support AI in action', 'idea', 'Demonstrate how Support AI works inside WordPress admin — metadata only, no customer data.'),
    jsonb_build_object('key', 'day_in_life', 'title', 'A day with Aipify', 'idea', 'Operational partner narrative — Aipify in background, humans decide.'),
    jsonb_build_object('key', 'objection_honest', 'title', 'Honest objection responses', 'idea', 'Address common concerns transparently — Coach objection library as inspiration.'),
    jsonb_build_object('key', 'customer_success', 'title', 'Customer success story format', 'idea', 'Structure for anonymised outcome stories — counts and trends, never private details.')
  );
$$;

create or replace function public._seosmc_coach_marketing_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sales Coach companions support sustainable marketing — observe, inform, recommend; never pressure.',
    'coach_tab_cross_link', 'Phase 45 Coach tab — daily coaching complements marketing outreach',
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'example', 'You shared helpful content in a WordPress forum — thoughtful outreach builds trust over time.'),
      jsonb_build_object('emoji', '🦉', 'example', 'Three prospects clicked your link this week — consider a gentle follow-up, not a mass email.'),
      jsonb_build_object('emoji', '🔔', 'example', 'Your LinkedIn post reached engagement — one channel at a time keeps marketing sustainable.'),
      jsonb_build_object('emoji', '❤️', 'example', 'Marketing pace looks healthy — Self Love reminds you that consistency beats intensity.')
    ),
    'performance_cross_link', 'Phase 41 Performance tab — milestone recognition for sustainable growth'
  );
$$;

create or replace function public._seosmc_performance_tracking(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_clicks int;
  v_leads int;
  v_signups int;
  v_subscriptions int;
  v_best_banner text;
  v_best_channel text;
  v_estimated_commission numeric;
begin
  select coalesce(sum(count_value), 0) into v_clicks
  from public.sales_expert_marketing_events
  where organization_id = p_organization_id and event_type = 'click';

  select coalesce(sum(count_value), 0) into v_leads
  from public.sales_expert_marketing_events
  where organization_id = p_organization_id and event_type = 'lead';

  select coalesce(sum(count_value), 0) into v_signups
  from public.sales_expert_marketing_events
  where organization_id = p_organization_id and event_type = 'signup';

  select coalesce(sum(count_value), 0) into v_subscriptions
  from public.sales_expert_marketing_events
  where organization_id = p_organization_id and event_type = 'subscription';

  select e.banner_key into v_best_banner
  from public.sales_expert_marketing_events e
  where e.organization_id = p_organization_id and e.banner_key is not null
  group by e.banner_key
  order by sum(e.count_value) desc
  limit 1;

  select e.channel_key into v_best_channel
  from public.sales_expert_marketing_events e
  where e.organization_id = p_organization_id
  group by e.channel_key
  order by sum(e.count_value) desc
  limit 1;

  select coalesce(sum(c.amount), 0) into v_estimated_commission
  from public.organization_sales_expert_commissions c
  where c.organization_id = p_organization_id
    and c.status in ('pending', 'paid', 'forecasted');

  return jsonb_build_object(
    'status', 'metadata_scaffold',
    'link_clicks', v_clicks,
    'leads', v_leads,
    'signups', v_signups,
    'subscriptions', v_subscriptions,
    'best_banner_key', v_best_banner,
    'best_channel_key', v_best_channel,
    'estimated_commission_metadata', v_estimated_commission,
    'currency', 'NOK',
    'privacy_note', 'Counts and commission metadata only — no visitor PII stored.',
    'performance_tab_cross_link', 'Phase 41 Performance tab — full milestone and recognition context'
  );
exception when others then
  return jsonb_build_object(
    'status', 'metadata_scaffold',
    'link_clicks', 0, 'leads', 0, 'signups', 0, 'subscriptions', 0,
    'privacy_note', 'Marketing event tracking scaffold — counts populate as events are recorded.'
  );
end; $$;

create or replace function public._seosmc_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sustainable marketing — one channel at a time. Consistency and honesty beat intensity.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'Pick one channel this month — master it before adding another.'),
      jsonb_build_object('emoji', '❤️', 'example', 'Rest is part of professional sales — burnout is not a success metric.')
    ),
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 influences marketing tone — encouragement only, not wellbeing storage.'
  );
$$;

create or replace function public._seosmc_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Honest representation — Aipify supports organizations; it does not replace employees. Customers subscribe directly to Aipify.',
    'experts_should_understand', jsonb_build_array(
      'Personal links track metadata counts — leads, signups, subscriptions, commission eligibility',
      'Banner URLs are illustrative KC/static scaffolds until approved assets ship',
      'Promotional text packs are starting points — adapt honestly to each organization',
      'Mass unsolicited outreach is explicitly not supported — same boundary as Email Center',
      'Never use forbidden public terms like Affiliate — use Sales Representative / Sales Expert',
      'Subscription relationship: Customer ↔ Aipify; consulting: Customer ↔ Sales Expert'
    ),
    'metadata_only', true
  );
$$;

create or replace function public._seosmc_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Ethical promotion builds lasting partnerships — honesty is the best marketing.',
    'Sales Experts represent Aipify professionally while building their own sustainable businesses.',
    'One helpful conversation beats a hundred spam messages.',
    'Aipify supports people — marketing should never imply replacement or manipulation.'
  );
$$;

create or replace function public._seosmc_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) partners grow through genuine value — marketing tools should reflect install-first, human-centered operations.';
$$;

create or replace function public._seosmc_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'sales_coach', 'label', 'Sales Coach Phase 45/46', 'route', '/app/sales-expert-engine', 'note', 'Coach & Certification tabs — sustainable outreach guidance'),
    jsonb_build_object('key', 'performance', 'label', 'Performance Phase 41', 'route', '/app/sales-expert-engine', 'note', 'Milestones and commission overview'),
    jsonb_build_object('key', 'partner_ecosystem', 'label', 'Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'note', 'Certified partner program context'),
    jsonb_build_object('key', 'localization', 'label', 'Global Expansion Phase 35', 'route', '/app/localization-global-expansion-engine', 'note', 'Promotional text locale packs'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable marketing pace')
  );
$$;

create or replace function public._seosmc_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Email Center (one-to-one templates) and Partner Resources (KC assets) — Marketing Center provides personal tracking links, banner embeds, promotional copy, and metadata performance counts within /app/sales-expert-engine Marketing tab. Cross-links Coach Phase 45/46, Performance Phase 41, Partner Ecosystem A.45, Localization Phase 35 — never duplicates.';
$$;

create or replace function public._seosmc_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.sales_expert_marketing_settings;
begin
  v_settings := public._seosmc_ensure_settings(p_organization_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'tracking_links', 'label', 'Personal tracking links scaffolded', 'met', jsonb_array_length(public._seosmc_personal_links(v_settings.tracking_slug)) = 3, 'note', null),
    jsonb_build_object('key', 'banners', 'label', 'Four banner embed sizes available', 'met', jsonb_array_length(public._seosmc_banners(v_settings.tracking_slug)) = 4, 'note', 'Illustrative KC asset paths'),
    jsonb_build_object('key', 'promotional_packs', 'label', 'Promotional text packs (general, WP, Shopify, Woo)', 'met', jsonb_array_length(public._seosmc_promotional_text_packs(v_settings.preferred_locale, v_settings.tracking_slug)->'packs') = 4, 'note', null),
    jsonb_build_object('key', 'channel_guidance', 'label', 'Channel guidance documented', 'met', jsonb_array_length(public._seosmc_channel_guidance()->'channels') >= 10, 'note', null),
    jsonb_build_object('key', 'forum_guidelines', 'label', 'Forum guidelines — helpful, not spam', 'met', (public._seosmc_forum_guidelines()->>'mass_unsolicited_outreach')::boolean = false, 'note', null),
    jsonb_build_object('key', 'coach_connection', 'label', 'Sales Coach marketing connection', 'met', jsonb_array_length(public._seosmc_coach_marketing_connection()->'companion_examples') = 4, 'note', null),
    jsonb_build_object('key', 'performance_tracking', 'label', 'Performance tracking metadata scaffold', 'met', (public._seosmc_performance_tracking(p_organization_id)->>'privacy_note') is not null, 'note', null),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love sustainable marketing connection', 'met', (public._seosmc_self_love_connection()->>'route') is not null, 'note', null),
    jsonb_build_object('key', 'trust', 'label', 'Trust connection — honest representation', 'met', jsonb_array_length(public._seosmc_trust_connection()->'experts_should_understand') >= 6, 'note', null),
    jsonb_build_object('key', 'localization', 'label', 'Locale-aware promotional packs', 'met', v_settings.preferred_locale in ('en', 'no', 'sv', 'da'), 'note', format('Active locale: %s', v_settings.preferred_locale))
  );
end; $$;

create or replace function public._seosmc_marketing_center_bundle(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.sales_expert_marketing_settings;
  v_locale text;
  v_slug text;
begin
  v_settings := public._seosmc_ensure_settings(p_organization_id);
  v_locale := public._seosmc_resolve_locale(p_organization_id);
  v_slug := coalesce(nullif(trim(v_settings.tracking_slug), ''), 'sales-expert');

  return jsonb_build_object(
    'mission', public._seosmc_blueprint_mission(),
    'abos_principle', public._seosmc_abos_principle(),
    'features', public._seosmc_blueprint_features(),
    'tracking_slug', v_slug,
    'preferred_locale', v_locale,
    'tracking_enabled', v_settings.tracking_enabled,
    'personal_links', public._seosmc_personal_links(v_slug),
    'banners', public._seosmc_banners(v_slug),
    'promotional_text_packs', public._seosmc_promotional_text_packs(v_locale, v_slug),
    'channel_guidance', public._seosmc_channel_guidance(),
    'forum_guidelines', public._seosmc_forum_guidelines(),
    'video_ideas', public._seosmc_video_ideas(),
    'coach_marketing_connection', public._seosmc_coach_marketing_connection(),
    'performance_tracking', public._seosmc_performance_tracking(p_organization_id),
    'self_love', public._seosmc_self_love_connection(),
    'trust', public._seosmc_trust_connection(),
    'success_criteria', public._seosmc_blueprint_success_criteria(p_organization_id),
    'vision', public._seosmc_vision_phrases(),
    'integration_links', public._seosmc_integration_links(),
    'distinction_note', public._seosmc_distinction_note(),
    'implementation_blueprint', jsonb_build_object(
      'phase', '33-extension-marketing',
      'title', 'Sales Expert Marketing Center',
      'doc', 'SALES_EXPERT_MARKETING_CENTER.md',
      'engine_phase', 'A.95',
      'mapping_note', 'Marketing tab on Sales Expert OS — cross-links Coach 45/46, Performance 41, Partner Ecosystem A.45, Localization Phase 35'
    ),
    'mass_unsolicited_outreach', false,
    'privacy_note', 'Metadata counts only — no visitor PII in marketing dashboard RPCs.'
  );
end; $$;

-- Extend dashboard — preserve ALL A.95 + Phase 41 + Phase 45 + Phase 46 fields; append Marketing Center
create or replace function public.get_sales_expert_operating_system_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_sales_expert_settings;
  v_summary jsonb;
  v_base jsonb;
begin
  perform public._irp_require_permission('sales_expert.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);

  v_base := jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Sales Expert Operating System — partner portal for pipeline, commissions, training, and one-to-one follow-up. Metadata only — no mass email.',
    'principles', jsonb_build_array(
      'Official partner tiers — never Affiliate publicly',
      'Aipify subscription: Customer ↔ Aipify; consulting: Customer ↔ Sales Expert',
      'One-to-one email only — mass campaigns explicitly not supported',
      'Human approval for sensitive commission and program changes',
      'Metadata only — no raw email bodies or customer PII in logs'
    ),
    'privacy_note', 'Customer org names and commission metadata only — no email content or PII stored.',
    'engine_phase', 'A.95',
    'implementation_blueprint', jsonb_build_object(
      'phase', '33-extension',
      'title', 'Sales Expert Operating System',
      'engine_phase', 'A.95',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md',
      'parent', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md'
    ),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', v_summary,
    'sections', jsonb_build_object(
      'dashboard', jsonb_build_object(
        'revenue_overview', v_summary,
        'monthly_commissions', jsonb_build_object(
          'pending', v_summary->'monthly_commissions_pending',
          'paid', v_summary->'monthly_commissions_paid',
          'forecasted', v_summary->'forecasted_commissions'
        ),
        'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
        'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
        'active_opportunities', v_summary->'active_opportunities'
      ),
      'customers', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'org_name', c.org_name, 'status', c.status,
          'subscription_status', c.subscription_status,
          'onboarding_progress', c.onboarding_progress,
          'next_follow_up', c.next_follow_up,
          'notes_metadata', c.notes_metadata
        ) order by c.next_follow_up nulls last)
        from public.organization_sales_expert_customers c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'opportunities', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', o.id, 'title', o.title, 'pipeline_stage', o.pipeline_stage,
          'estimated_value', o.estimated_value, 'currency', o.currency,
          'next_action', o.next_action, 'recommended_action', o.recommended_action,
          'status', o.status, 'customer_id', o.customer_id
        ) order by
          case o.pipeline_stage
            when 'negotiation' then 0 when 'proposal' then 1 when 'demo' then 2 else 3 end)
        from public.organization_sales_expert_opportunities o
        where o.organization_id = v_org_id and o.status = 'open' limit 50
      ), '[]'::jsonb),
      'commissions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'commission_type', c.commission_type, 'amount', c.amount,
          'currency', c.currency, 'status', c.status,
          'subscription_plan_key', c.subscription_plan_key, 'period_month', c.period_month
        ) order by c.period_month desc)
        from public.organization_sales_expert_commissions c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'email_templates', coalesce((
        select jsonb_agg(jsonb_build_object(
          'template_key', t.template_key, 'title', t.title,
          'subject_pattern', t.subject_pattern, 'category', t.category,
          'placeholders', t.placeholders
        ) order by t.template_key)
        from public.organization_sales_expert_email_templates t
        where t.organization_id = v_org_id
      ), '[]'::jsonb),
      'emails', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', e.id, 'template_key', e.template_key, 'subject_metadata', e.subject_metadata,
          'status', e.status, 'delivery_mode', e.delivery_mode,
          'scheduled_for', e.scheduled_for, 'sent_at', e.sent_at
        ) order by e.created_at desc)
        from public.organization_sales_expert_emails e
        where e.organization_id = v_org_id limit 30
      ), '[]'::jsonb),
      'follow_ups', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', f.id, 'cadence_days', f.cadence_days, 'template_key', f.template_key,
          'scheduled_for', f.scheduled_for, 'status', f.status, 'customer_id', f.customer_id
        ) order by f.scheduled_for)
        from public.organization_sales_expert_follow_ups f
        where f.organization_id = v_org_id limit 30
      ), '[]'::jsonb)
    ),
    'official_terminology', public._seos_blueprint_official_terminology(),
    'portal_sections', public._seos_blueprint_portal_sections(),
    'blueprint_email_templates', public._seos_blueprint_email_templates_list(),
    'follow_up_cadences', public._seos_blueprint_follow_up_cadences(),
    'implementation_services', public._seos_blueprint_implementation_services_pricing(),
    'subscription_principles', public._seos_blueprint_subscription_principles(),
    'commercial_commission_summary', public._seos_commercial_commission_summary(v_org_id),
    'mass_email_supported', false,
    'integration_links', jsonb_build_array(
      jsonb_build_object('key', 'marketplace_ecosystem', 'label', 'Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine'),
      jsonb_build_object('key', 'partners', 'label', 'Partner Certification Phase 91', 'route', '/app/partners'),
      jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine'),
      jsonb_build_object('key', 'certification', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine'),
      jsonb_build_object('key', 'partner_success', 'label', 'Partner Success A.73', 'route', '/app/partner-success-engine'),
      jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine')
    ),
    'training_center', jsonb_build_object(
      'foundations_route', '/app/learning-training-engine',
      'certification_route', '/app/certification-achievement-engine',
      'demo_simulations_note', 'Demo simulations scaffold — metadata only',
      'product_updates_note', 'Product update briefings via Notification Engine — metadata cross-link'
    ),
    'resource_library', jsonb_build_object(
      'status', 'metadata_scaffold',
      'categories', jsonb_build_array('Marketing materials', 'Playbooks', 'Product sheets', 'Templates', 'Case studies'),
      'privacy_note', 'Resource metadata only — assets stored in approved KC or partner program surfaces.'
    ),
    'distinction_note', public._seos_distinction_note()
  );

  return v_base || jsonb_build_object(
    'implementation_blueprint_phase41', jsonb_build_object(
      'phase', 41,
      'title', 'Sales Performance & Recognition Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE41_SALES_PERFORMANCE_RECOGNITION.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — cross-links Gratitude & Recognition A.89 Phase 9, not a duplicate engine.'
    ),
    'performance_recognition_mission', 'Help Sales Experts maintain momentum, celebrate achievements, and build sustainable businesses around Aipify.',
    'performance_recognition_philosophy', 'Recognition strengthens motivation. Competition should inspire growth. Success should never come at the expense of integrity.',
    'performance_recognition_abos_principle', 'People thrive when their efforts are noticed. Recognition should reinforce values, not ego.',
    'performance_objectives', public._sprbp_blueprint_objectives(),
    'performance_dashboard_fields', public._sprbp_blueprint_performance_dashboard_fields(),
    'performance_summary', public._sprbp_performance_summary(v_org_id),
    'milestone_recognition', public._sprbp_blueprint_milestones(),
    'milestone_progress', public._sprbp_milestone_progress(v_org_id),
    'bell_moments', public._sprbp_blueprint_bell_moments(),
    'recognition_roses', public._sprbp_blueprint_recognition_roses(),
    'leaderboards', public._sprbp_blueprint_leaderboards(),
    'performance_self_love_connection', public._sprbp_blueprint_self_love_connection(),
    'performance_trust_connection', public._sprbp_blueprint_trust_connection(),
    'performance_dogfooding', public._sprbp_blueprint_dogfooding(),
    'performance_vision_phrases', public._sprbp_blueprint_vision_phrases(),
    'performance_integration_links', public._sprbp_blueprint_integration_links(),
    'performance_blueprint_success_criteria', public._sprbp_blueprint_success_criteria(v_org_id),
    'performance_distinction_note', public._sprbp_distinction_note()
  ) || jsonb_build_object(
    'implementation_blueprint_phase45', jsonb_build_object(
      'phase', 45,
      'title', 'Sales Coach & Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Coach & Enablement tab; cross-links Phase 41 bell moments without duplication.'
    ),
    'sales_coach_mission', 'Equip Sales Experts with supportive coaching, enablement guidance, and sustainable pacing — never punitive judgment.',
    'sales_coach_philosophy', 'Coaching strengthens confidence. Guidance should inspire thoughtful action. Success should never come at the expense of wellbeing or integrity.',
    'sales_coach_abos_principle', 'People thrive when they feel equipped and respected. Coaching should reinforce professional growth, not pressure.',
    'sales_companion_roles', public._scebp_blueprint_companion_roles(),
    'sales_coach_dashboard_fields', public._scebp_blueprint_coach_dashboard_fields(),
    'sales_coach_summary', public._scebp_coach_summary(v_org_id),
    'daily_sales_briefing', public._scebp_daily_briefing(v_org_id),
    'sales_activity_recommendations', public._scebp_activity_recommendations(v_org_id),
    'field_sales_coaching', public._scebp_blueprint_field_sales_coaching(),
    'demonstration_guidance', public._scebp_blueprint_demonstration_guidance(),
    'objection_handling_library', public._scebp_blueprint_objection_handling_library(),
    'communication_coaching', public._scebp_blueprint_communication_coaching(),
    'personal_performance_insights', public._scebp_performance_insights(v_org_id),
    'sales_coach_self_love_connection', public._scebp_blueprint_self_love_connection(),
    'sales_coach_bell_moments', public._scebp_blueprint_bell_moments(),
    'sales_training_integration', public._scebp_blueprint_sales_training_integration(),
    'roleplay_simulation', public._scebp_blueprint_roleplay_simulation(),
    'sales_coach_trust_connection', public._scebp_blueprint_trust_connection(),
    'sales_coach_dogfooding', public._scebp_blueprint_dogfooding(),
    'sales_coach_success_criteria', public._scebp_blueprint_success_criteria(v_org_id),
    'sales_coach_vision_phrases', public._scebp_blueprint_vision_phrases(),
    'sales_coach_distinction_note', public._scebp_distinction_note(),
    'sales_coach_integration_links', public._scebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase46', jsonb_build_object(
      'phase', 46,
      'title', 'Sales Coach Certification & Field Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE46_SALES_COACH_CERTIFICATION_FIELD_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Certification & Field Enablement tab; cross-links A.37, A.36, Phase 91, Phase 45 coach tab.'
    ),
    'sales_certification_mission', 'Develop competent professionals — training strengthens confidence; certification reflects genuine competence.',
    'sales_certification_philosophy', 'Assessment encourages growth, not fear. Mastery not exclusion. Field enablement supports excellence at a sustainable pace.',
    'sales_certification_abos_principle', 'Aipify Business Operating System (ABOS) partners grow through genuine capability — certification means readiness to help organizations work smarter.',
    'sales_training_pathway', public._sccfebp_blueprint_sales_training_pathway(),
    'sales_simulation_engine', public._sccfebp_blueprint_sales_simulation_engine(),
    'telephone_sales_coaching', public._sccfebp_blueprint_telephone_sales_coaching(),
    'assessment_principles', public._sccfebp_blueprint_assessment_principles(),
    'certification_requirements', public._sccfebp_blueprint_certification_requirements(),
    'reassessment_principles', public._sccfebp_blueprint_reassessment_principles(),
    'certification_display', public._sccfebp_blueprint_certification_display(),
    'email_enablement_center', public._sccfebp_blueprint_email_enablement_center(),
    'implementation_pricing_guidance', public._sccfebp_blueprint_implementation_pricing_guidance(),
    'installation_experience_journey', public._sccfebp_blueprint_installation_experience_journey(),
    'field_sales_enablement', public._sccfebp_blueprint_field_sales_enablement(),
    'sales_performance_culture', public._sccfebp_blueprint_sales_performance_culture(),
    'sales_certification_summary', public._sccfebp_certification_summary(v_org_id),
    'sales_certification_self_love_connection', public._sccfebp_blueprint_self_love_connection(),
    'sales_certification_trust_connection', public._sccfebp_blueprint_trust_connection(),
    'sales_certification_dogfooding', public._sccfebp_blueprint_dogfooding(),
    'sales_certification_success_criteria', public._sccfebp_blueprint_success_criteria(v_org_id),
    'sales_certification_vision_phrases', public._sccfebp_blueprint_vision_phrases(),
    'sales_certification_distinction_note', public._sccfebp_distinction_note(),
    'sales_certification_integration_links', public._sccfebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'sales_expert_marketing_center', public._seosmc_marketing_center_bundle(v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_sales_expert_operating_system_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_summary jsonb;
  v_perf jsonb;
  v_coach jsonb;
  v_cert jsonb;
  v_marketing jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);
  v_cert := public._sccfebp_certification_summary(v_org_id);
  v_marketing := public._seosmc_performance_tracking(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Professional partner portal — Customers, Opportunities, Pipeline, Commission Overview.',
    'engine_phase', 'A.95',
    'route', '/app/sales-expert-engine',
    'active_opportunities', v_summary->'active_opportunities',
    'monthly_commissions_pending', v_summary->'monthly_commissions_pending',
    'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
    'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
    'milestones_achieved', v_perf->'milestones_achieved',
    'performance_recognition_phase', 41,
    'sales_coach_enablement_phase', 45,
    'sales_certification_field_enablement_phase', 46,
    'sales_expert_marketing_center_phase', '33-extension-marketing',
    'coach_suggested_actions', v_coach->'suggested_next_actions_count',
    'coach_scheduled_demos', v_coach->'scheduled_demos',
    'coach_brief_summary', format(
      '%s follow-ups · %s demos · %s new this month',
      coalesce(v_coach->>'upcoming_follow_ups', '0'),
      coalesce(v_coach->>'scheduled_demos', '0'),
      coalesce(v_coach->>'new_customers_this_month', '0')
    ),
    'certification_tier_label', v_cert->'current_tier_label',
    'certification_attempts_remaining', v_cert->'attempts_remaining',
    'certification_brief_summary', format(
      '%s · %s attempts remaining',
      coalesce(v_cert->>'current_tier_label', 'Training in progress'),
      coalesce(v_cert->>'attempts_remaining', '3')
    ),
    'marketing_link_clicks', v_marketing->'link_clicks',
    'marketing_signups', v_marketing->'signups',
    'marketing_subscriptions', v_marketing->'subscriptions',
    'marketing_brief_summary', format(
      '%s clicks · %s signups · %s subscriptions',
      coalesce(v_marketing->>'link_clicks', '0'),
      coalesce(v_marketing->>'signups', '0'),
      coalesce(v_marketing->>'subscriptions', '0')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._seosmc_ensure_settings(uuid) to authenticated;
grant execute on function public._seosmc_resolve_locale(uuid) to authenticated;
grant execute on function public._seosmc_blueprint_mission() to authenticated;
grant execute on function public._seosmc_blueprint_features() to authenticated;
grant execute on function public._seosmc_personal_links(text) to authenticated;
grant execute on function public._seosmc_banner_embed(text, text, int, int) to authenticated;
grant execute on function public._seosmc_banners(text) to authenticated;
grant execute on function public._seosmc_promotional_text_packs(text, text) to authenticated;
grant execute on function public._seosmc_channel_guidance() to authenticated;
grant execute on function public._seosmc_forum_guidelines() to authenticated;
grant execute on function public._seosmc_video_ideas() to authenticated;
grant execute on function public._seosmc_coach_marketing_connection() to authenticated;
grant execute on function public._seosmc_performance_tracking(uuid) to authenticated;
grant execute on function public._seosmc_self_love_connection() to authenticated;
grant execute on function public._seosmc_trust_connection() to authenticated;
grant execute on function public._seosmc_vision_phrases() to authenticated;
grant execute on function public._seosmc_abos_principle() to authenticated;
grant execute on function public._seosmc_integration_links() to authenticated;
grant execute on function public._seosmc_distinction_note() to authenticated;
grant execute on function public._seosmc_blueprint_success_criteria(uuid) to authenticated;
grant execute on function public._seosmc_marketing_center_bundle(uuid) to authenticated;
