"use client";

import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import {
  demoFormSchema,
  type DemoFormValues,
} from "@/lib/validations/forms";

const defaultValues: DemoFormValues = {
  formType: "demo",
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

export function DemoForm() {
  return (
    <LeadCaptureForm
      defaultValues={defaultValues}
      description="Schedule a tailored walkthrough to see how the CRM can improve lead response times and pipeline visibility."
      schema={demoFormSchema}
      submitLabel="Request a demo"
      title="Book a personalized demo"
    />
  );
}
