# Business Packs Foundation Engine FAQ

## FAQ 1

**Question:** What is a Business Pack?

**Answer:** A Business Pack is a curated bundle of modules, workflows, Knowledge Center templates, dashboard layout hints, notifications, and governance defaults. Packs help organizations activate operational capabilities in one reviewed flow instead of configuring each piece separately.

## FAQ 2

**Question:** How does activation work?

**Answer:** Select a pack, review its modules and workflows, then activate. Activation enables modules via the Module Marketplace Foundation Engine (A.23), registers workflows via Workflow Orchestration (A.42), and syncs install recommendations via the Install Engine (A.22). Every step is logged in the activation audit trail.

## FAQ 3

**Question:** How do Business Packs relate to Industry Blueprints?

**Answer:** Industry Blueprints (Phase 70) provide vertical operating profiles at `/app/industry-blueprints`. Business Packs orchestrate modules and workflows without replacing blueprint apply logic — the two features integrate and do not duplicate each other.

## FAQ 4

**Question:** Who can activate and customize packs?

**Answer:** Viewing requires `business_packs.view`. Activation requires `business_packs.activate`. Customization requires `business_packs.customize`. Owners and administrators typically hold full pack permissions; managers may customize activated packs.
