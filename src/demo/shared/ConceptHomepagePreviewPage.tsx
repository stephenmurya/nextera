import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { DraftIndicator } from "@/components/DraftIndicator";
import { BlueprintHomepagePreview } from "@/demo/blueprint/BlueprintHomepagePreview";
import { GridlineHomepagePreview } from "@/demo/gridline/GridlineHomepagePreview";
import { MonographHomepagePreview } from "@/demo/monograph/MonographHomepagePreview";
import { PanoramaHomepagePreview } from "@/demo/panorama/PanoramaHomepagePreview";
import { getPageByUri } from "@/lib/wordpress/client";
import type { ConceptSlug } from "@/demo/shared/concepts";

type ConceptHomepagePreviewPageProps = {
  concept: ConceptSlug;
};

export async function ConceptHomepagePreviewPage({
  concept,
}: ConceptHomepagePreviewPageProps) {
  const { isEnabled } = await draftMode();
  const page = await getPageByUri("/", isEnabled);

  if (!page) {
    notFound();
  }

  return (
    <>
      {isEnabled ? <DraftIndicator /> : null}
      {concept === "monograph" ? (
        <MonographHomepagePreview page={page} />
      ) : null}
      {concept === "gridline" ? (
        <GridlineHomepagePreview page={page} />
      ) : null}
      {concept === "blueprint" ? (
        <BlueprintHomepagePreview page={page} />
      ) : null}
      {concept === "panorama" ? (
        <PanoramaHomepagePreview page={page} />
      ) : null}
    </>
  );
}
