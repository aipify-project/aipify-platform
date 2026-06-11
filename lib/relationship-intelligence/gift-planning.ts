export function buildGiftSuggestion(
  name: string,
  favoriteActivities: string[],
  preferredGifts: string[]
): string {
  if (preferredGifts.length > 0) {
    return `Based on what you've shared, ${name} might appreciate ${preferredGifts[0]}. Would you like more ideas?`;
  }
  if (favoriteActivities.length > 0) {
    return `You mentioned ${name} enjoys ${favoriteActivities[0]}. Would you like gift suggestions around that?`;
  }
  return `Would you like thoughtful gift ideas for ${name}?`;
}
