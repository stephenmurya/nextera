import { ConceptHomepagePreviewPage } from "@/demo/shared/ConceptHomepagePreviewPage";
import { buildConceptMetadata } from "@/demo/shared/metadata";

export const metadata = buildConceptMetadata(
  "Blueprint Concept Preview",
  "Luxury real-estate-tech homepage concept preview for AgentFlow.",
);

export default function BlueprintConceptPage() {
  return <ConceptHomepagePreviewPage concept="blueprint" />;
}
