import Image from "next/image";

/**
 * Approved facing-in Kompis mark.
 * Source artwork: svevende idérobot med lysende lyspære, placed on the right
 * so the face and bulb point left toward the page content.
 * The painted bulb is the motion: a light CSS glow. Reduced motion stays still.
 */
export function KompisWorkspaceMascot() {
  return (
    <div className="aipify-workspace-mascot" aria-hidden="true">
      <Image
        src="/website-kompis/dashboard/kompis_mascot_idea_facing_in.png"
        alt=""
        width={1100}
        height={872}
        className="aipify-workspace-mascot__figure"
        priority={false}
      />
      <span className="aipify-workspace-mascot__bulb" />
    </div>
  );
}
