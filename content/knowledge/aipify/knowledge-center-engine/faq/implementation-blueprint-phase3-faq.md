# Implementation Blueprint Phase 3 — Knowledge Center Foundation FAQ

## What is Phase 3 of the Implementation Blueprint?

Phase 3 aligns the Knowledge Center Engine (A.5) with ABOS organizational memory requirements — categories, articles, review workflow, visibility, and companion integration.

## How is this different from KC Phase 55 (`/app/knowledge-center`)?

Phase 55 is Aipify self-knowledge (product FAQ about Aipify itself). Phase A.5 / Blueprint Phase 3 is **tenant-owned** organizational knowledge at `/app/knowledge-center-engine`.

## What knowledge types does the blueprint define?

Operational, support, organizational, companion, training, and strategic — mapped to categories and article content.

## What visibility levels are supported?

Blueprint defines public, organization, workspace, and restricted. The engine maps these to `public`, `internal`, and `customer` with permission enforcement.

## Can AI use draft or review content?

No. `retrieve_knowledge_for_ai()` includes **published** content only. Draft and review items never power customer-facing responses.

## What is the knowledge evolution scaffold?

Metadata in organization settings for gap detection, evolution tracking, Self Love integration (A.76 scaffold), and review cycle defaults — full automation is future work.

## What dogfood categories exist for Aipify Group?

Product, Engineering, Support, Sales, Governance, Self Love, Human Values, and Companion Guidelines.

## Are article tags and related content supported?

Not yet — blueprint documents the structure; tags and related content remain scaffold items for a future phase.

## Where is gap detection handled?

KC Phase 55 gap detection at `/app/knowledge-center/gaps` for product self-knowledge. Organizational gap detection aligns via evolution scaffold metadata.

## What are the Phase 3 success criteria?

Categories, published articles, FAQs, review workflow, version history, visibility enforcement, safe AI retrieval, evolution scaffold, and dogfood categories for pilot orgs — computed live on the dashboard.
