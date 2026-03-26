"use client";

import { ContactFormValues, contactFormSchema } from "@/lib/validations/forms";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";

const defaultValues: ContactFormValues = {
  formType: "contact",
  first_name: "",
  last_name: "",
  email: "",
  company_name: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  landing_page_url: "",
  bot_field: "",
};

export function ContactForm() {
  return (
    <LeadCaptureForm
      defaultValues={defaultValues}
      description="Send your questions to our team and we’ll follow up with the right next step for your workflow."
      schema={contactFormSchema}
      submitLabel="Contact sales"
      title="Talk to our team"
    />
  );
}
