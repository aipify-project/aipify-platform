# Community & Collective Success Engine — Blueprint Phase 117 FAQ

## What is Blueprint Phase 117?

Blueprint Phase 117 — Community & Collective Success Engine extends the existing Community Hub at `/app/community` with community spaces, mentorship, events, knowledge vault, and collective success scaffolds. It preserves all fields from repo Phase 89 and Blueprint Phases 24, 52, and 89.

## Does Phase 117 create a new route?

No. Phase 117 extends `/app/community` only. Admin remains at `/app/community/admin`.

## How is Phase 117 different from Gratitude & Recognition A.89?

Gratitude & Recognition Engine Phase A.89 at `/app/gratitude-recognition-engine` handles recognition experiences. Phase 117 cross-links recognition types but does **not** duplicate Gratitude storage. Phase number collision with repo Community Phase 89 is documented — cross-link only.

## How is Phase 117 different from Cross-Tenant Intelligence A.71?

Cross-Tenant Intelligence at `/app/cross-tenant-intelligence-engine` provides platform-wide pattern intelligence. Phase 117 is the tenant community hub — governed, voluntary, anonymized collective success metadata.

## What are the ten community spaces?

Industry, Growth Partner, Executive, Companion, Support, Commerce, Security, Regional, Language-Based, and Special Interest — each governed and voluntary.

## What contribution types does Phase 117 document?

Knowledge articles, implementation stories, playbooks, templates, lessons learned, case studies, discussion participation, mentorship, resource libraries, and community events — usefulness over visibility.

## What is the mentorship program?

Five mentorship types (Growth Partner, executive, implementation, companion coaching, governance mentoring) governed by four principles: voluntary, mutual respect, psychological safety, and shared growth. Distinct from Sales Community Blueprint Phase 47 peer mentorship at `/app/sales-expert-engine`.

## How do Companions participate in community?

Companions may summarize discussions, organize resources, highlight unanswered questions, suggest knowledge, and support moderation. They must never dominate conversations, replace community leadership, suppress diverse viewpoints, or manipulate participation.

## Do community analytics rank people?

No. Community analytics metrics (participation quality, knowledge contributions, mentorship activity, event engagement, resource utilization, support interactions, community satisfaction, cross-community collaboration) improve community support — they do **not** rank individuals or organizations.

## What is the Community Knowledge Vault?

Eight asset types: best practices, case studies, templates, FAQs, recorded sessions, discussion summaries, implementation frameworks, and governance examples. Cross-links Knowledge Center A.5 at `/app/knowledge-center-engine`.

## What are the success metrics?

Higher knowledge sharing, stronger GP collaboration, improved customer outcomes, increased mentorship, ecosystem resilience, healthier engagement, expanded collective intelligence, sense of belonging, and long-term sustainability.

## Where is the SQL migration?

`supabase/migrations/20261207000000_implementation_blueprint_phase117_community_collective_success.sql` — helpers prefixed `_ccsbp117_*`.

## What RPCs were extended?

`get_community_intelligence_dashboard()` and `get_community_intelligence_card()` — all prior fields preserved; Phase 117 block appended as `community_collective_success_blueprint_phase117`.
