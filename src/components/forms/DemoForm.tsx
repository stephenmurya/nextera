"use client";

import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import {
  demoFormSchema,
  type DemoFormValues,
} from "@/lib/validations/forms";

type DemoFormProps = {
  description?: string;
  embedded?: boolean;
  hideHeader?: boolean;
  title?: string;
};

const defaultValues: DemoFormValues = {
  formType: "demo",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company_name: "",
  market_or_city: "",
  team_size: "" as DemoFormValues["team_size"],
  current_workflow: "",
  biggest_pain_point: "",
  interest_type: "request_demo",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  landing_page_url: "",
  bot_field: "",
};

export function DemoForm({
  description = "Schedule a tailored walkthrough to see how the CRM can improve lead response times and pipeline visibility.",
  embedded = false,
  hideHeader = false,
  title = "Book a personalized demo",
}: DemoFormProps) {
  return (
    <LeadCaptureForm
      defaultValues={defaultValues}
      description={description}
      embedded={embedded}
      hideHeader={hideHeader}
      schema={demoFormSchema}
      submitLabel="Request a demo"
      title={title}
    />
  );
}
