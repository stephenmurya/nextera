"use client";

import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { ContactFormValues, contactFormSchema } from "@/lib/validations/forms";

type ContactFormProps = {
  description?: string;
  embedded?: boolean;
  hideHeader?: boolean;
  title?: string;
};

const defaultValues: ContactFormValues = {
  formType: "contact",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company_name: "",
  market_or_city: "",
  team_size: "" as ContactFormValues["team_size"],
  current_workflow: "",
  biggest_pain_point: "",
  interest_type: "contact_sales",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  landing_page_url: "",
  bot_field: "",
};

export function ContactForm({
  description = "Send your questions to our team and we'll follow up with the right next step for your workflow.",
  embedded = false,
  hideHeader = false,
  title = "Talk to our team",
}: ContactFormProps) {
  return (
    <LeadCaptureForm
      defaultValues={defaultValues}
      description={description}
      embedded={embedded}
      hideHeader={hideHeader}
      schema={contactFormSchema}
      submitLabel="Contact sales"
      title={title}
    />
  );
}
