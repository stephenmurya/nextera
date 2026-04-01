import { ContactForm } from "@/components/forms/ContactForm";
import { DemoForm } from "@/components/forms/DemoForm";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import type { FormSection } from "@/types/cms";

type ConceptEmbeddedFormProps = {
  section: FormSection;
};

export function ConceptEmbeddedForm({
  section,
}: ConceptEmbeddedFormProps) {
  switch (section.formType) {
    case "demo":
      return (
        <DemoForm
          embedded
          description={section.body}
          title={section.headline}
        />
      );
    case "waitlist":
      return (
        <WaitlistForm
          embedded
          description={section.body}
          title={section.headline}
        />
      );
    case "contact":
      return (
        <ContactForm
          embedded
          description={section.body}
          title={section.headline}
        />
      );
  }
}
