function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?!.]+$/, "");
}

/** Generic product-concept phrasing — not provider- or customer-specific. */
export function isProductConceptQuery(query: string): boolean {
  const q = normalizeQuery(query);
  if (q.length < 4) return false;

  return (
    /^(hva er|what is|what's|explain|forklar|hva betyr|what does|what do|hva gjør|how does|how do)\b/.test(
      q,
    ) ||
    /\b(hva er|what is|explain|hva betyr|hva gjør|what does .+ mean)\b/.test(q)
  );
}

export function isAppNavigationQuery(query: string): boolean {
  const q = normalizeQuery(query);
  return (
    /^(hvor finner|where (do i |can i )?find|go to|open|navigate|how do i get to)\b/.test(q) ||
    /\b(hvor er|where is|finn .* side|find .* page|åpne .* side|open .* page)\b/.test(q)
  );
}
