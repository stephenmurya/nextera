"use client";

import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import {
  type WaitlistFormValues,
  waitlistFormSchema,
} from "@/lib/validations/forms";

const defaultValues: WaitlistFormValues = {
  formType: "waitlist",
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

export function WaitlistForm() {
  return (
    <LeadCaptureForm
      defaultValues={defaultValues}
      description="Join the early access list and we’ll let you know when your team can start onboarding."
      schema={waitlistFormSchema}
      submitLabel="Join the waitlist"
      title="Reserve your place"
    />
  );
}
