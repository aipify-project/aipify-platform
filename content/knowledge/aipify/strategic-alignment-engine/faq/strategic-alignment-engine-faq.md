# Strategic Alignment Engine FAQ

## FAQ 1

**Question:** What is the Strategic Alignment Engine?

**Answer:** The Strategic Alignment Engine helps organizations define strategic objectives, link them to operational entities (workflows, improvement initiatives, value metrics, executive priorities, business packs), conduct alignment reviews, and detect misaligned initiatives. Humans define strategy; Aipify surfaces alignment gaps with metadata only.

## FAQ 2

**Question:** How is this different from the legacy Strategy Engine at /app/strategy?

**Answer:** The legacy Strategy Engine focuses on strategic intelligence opportunities and health scoring. The Strategic Alignment Engine (nav id `strategicAlignmentEngine`, route `/app/strategic-alignment-engine`) provides an objective register with entity linking, periodic reviews, misalignment snapshots, and executive strategic summaries. They are intentionally separate surfaces.

## FAQ 3

**Question:** How do alignment reviews and misalignment detection work?

**Answer:** Teams record reviews via `record_strategic_review()` with findings and participant metadata. `detect_misaligned_initiatives()` identifies objectives without linked entities, past target dates, or strategic priorities needing review — storing results in alignment snapshots. Optional org memory hooks capture learnings — metadata only.

## FAQ 4

**Question:** Who can manage and export strategic alignment data?

**Answer:** Viewing requires `strategy.view`. Creating objectives and entity links requires `strategy.manage`. Recording reviews and detecting misalignment requires `strategy.review`. Report export requires `strategy.export`. Owners and administrators typically hold full permissions; support agents may view objectives.
