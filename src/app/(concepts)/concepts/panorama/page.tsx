import { ConceptHomepagePreviewPage } from "@/demo/shared/ConceptHomepagePreviewPage";
import { buildConceptMetadata } from "@/demo/shared/metadata";

export const metadata = buildConceptMetadata(
  "Panorama Concept Preview",
  "Full-bleed blueprint homepage concept preview for AgentFlow.",
);

export default function PanoramaConceptPage() {
  return <ConceptHomepagePreviewPage concept="panorama" />;
}
