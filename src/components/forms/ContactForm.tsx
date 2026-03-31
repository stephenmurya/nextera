"use client";

import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { ContactFormValues, contactFormSchema } from "@/lib/validations/forms";

type ContactFormProps = {
  description?: string;
  embedded?: boolean;
  title?: string;
};

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

export function ContactForm({
  description = "Send your questions to our team and we'll follow up with the right next step for your workflow.",
  embedded = false,
  title = "Talk to our team",
}: ContactFormProps) {
  return (
    <LeadCaptureForm
      defaultValues={defaultValues}
      description={description}
      embedded={embedded}
      schema={contactFormSchema}
      submitLabel="Contact sales"
      title={title}
    />
  );
}
