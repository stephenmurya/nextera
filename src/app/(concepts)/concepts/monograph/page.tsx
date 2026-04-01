import { ConceptHomepagePreviewPage } from "@/demo/shared/ConceptHomepagePreviewPage";
import { buildConceptMetadata } from "@/demo/shared/metadata";

export const metadata = buildConceptMetadata(
  "Monograph Concept Preview",
  "Editorial-luxury homepage concept preview for AgentFlow.",
);

export default function MonographConceptPage() {
  return <ConceptHomepagePreviewPage concept="monograph" />;
}
