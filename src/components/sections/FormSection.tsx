import { ContactForm } from "@/components/forms/ContactForm";
import { DemoForm } from "@/components/forms/DemoForm";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import type { FormSection as FormSectionData } from "@/types/cms";

function renderForm(
  formType: FormSectionData["formType"],
  title: string,
  description?: string,
) {
  switch (formType) {
    case "demo":
      return <DemoForm embedded description={description} title={title} />;
    case "waitlist":
      return <WaitlistForm embedded description={description} title={title} />;
    case "contact":
      return <ContactForm embedded description={description} title={title} />;
  }
}

export function FormSection({
  anchor,
  formType,
  headline,
  body,
}: FormSectionData) {
  const sectionId = anchor ?? (formType === "waitlist" ? "waitlist" : undefined);

  return (
    <section className="py-16 md:py-24" id={sectionId}>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-[linear-gradient(180deg,#fffaf3_0%,#f8f1e7_100%)] px-4 py-4 shadow-[0_28px_90px_rgba(33,28,22,0.08)] sm:px-6 sm:py-6">
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,_rgba(195,153,93,0.18),_transparent_70%)]" />
        <div className="relative">{renderForm(formType, headline, body)}</div>
      </div>
    </section>
  );
}
