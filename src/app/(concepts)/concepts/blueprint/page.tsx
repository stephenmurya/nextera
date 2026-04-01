import { ConceptHomepagePreviewPage } from "@/demo/shared/ConceptHomepagePreviewPage";
import { buildConceptMetadata } from "@/demo/shared/metadata";

export const metadata = buildConceptMetadata(
  "Structured Concept Preview",
  "Architectural homepage concept preview for AgentFlow.",
);

export default function BlueprintConceptPage() {
  return <ConceptHomepagePreviewPage concept="blueprint" />;
}
