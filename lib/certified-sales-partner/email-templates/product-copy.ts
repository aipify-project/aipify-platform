/** Product lines already used by the live template preview. Shared so send matches preview. */
export function cspMarketingProductDescription(productKey: string): string {
  if (productKey === "kompis_web") {
    return "Kompis Web answers visitor questions using content you approve.";
  }
  if (productKey === "kompis_bedrift") {
    return "Kompis Bedrift supports internal knowledge with approved sources.";
  }
  return "";
}
