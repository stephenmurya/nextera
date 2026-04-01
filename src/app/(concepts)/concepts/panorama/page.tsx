import { ConceptHomepagePreviewPage } from "@/demo/shared/ConceptHomepagePreviewPage";
import { buildConceptMetadata } from "@/demo/shared/metadata";

export const metadata = buildConceptMetadata(
  "Expansive Concept Preview",
  "Full-bleed canvas homepage concept preview for AgentFlow.",
);

export default function PanoramaConceptPage() {
  return <ConceptHomepagePreviewPage concept="panorama" />;
}
