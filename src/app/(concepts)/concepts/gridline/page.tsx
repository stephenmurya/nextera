import { ConceptHomepagePreviewPage } from "@/demo/shared/ConceptHomepagePreviewPage";
import { buildConceptMetadata } from "@/demo/shared/metadata";

export const metadata = buildConceptMetadata(
  "Gridline Concept Preview",
  "Modern product-minimal homepage concept preview for AgentFlow.",
);

export default function GridlineConceptPage() {
  return <ConceptHomepagePreviewPage concept="gridline" />;
}
