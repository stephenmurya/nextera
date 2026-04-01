"use client";

import { ContactForm } from "@/components/forms/ContactForm";
import { DemoForm } from "@/components/forms/DemoForm";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import type { FormSection } from "@/types/cms";

type HubSpotFormProps = {
  formType: FormSection["formType"];
};

export function HubSpotForm({ formType }: HubSpotFormProps) {
  switch (formType) {
    case "demo":
      return <DemoForm embedded hideHeader title="" description="" />;
    case "waitlist":
      return <WaitlistForm embedded hideHeader title="" description="" />;
    case "contact":
      return <ContactForm embedded hideHeader title="" description="" />;
  }
}
