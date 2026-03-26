import { z } from "zod";

const requiredTextField = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} is required.`);

const optionalTextField = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, z.string().optional());

const sharedLeadFields = {
  first_name: requiredTextField("First name"),
  last_name: requiredTextField("Last name"),
  email: z.email("Enter a valid work email address."),
  company_name: requiredTextField("Company name"),
  utm_source: optionalTextField,
  utm_medium: optionalTextField,
  utm_campaign: optionalTextField,
  landing_page_url: optionalTextField,
  bot_field: optionalTextField,
} as const;

export const demoFormSchema = z
  .object({
    formType: z.literal("demo"),
    ...sharedLeadFields,
  })
  .strict();

export const waitlistFormSchema = z
  .object({
    formType: z.literal("waitlist"),
    ...sharedLeadFields,
  })
  .strict();

export const contactFormSchema = z
  .object({
    formType: z.literal("contact"),
    ...sharedLeadFields,
  })
  .strict();

export const submissionPayloadSchema = z.discriminatedUnion("formType", [
  demoFormSchema,
  waitlistFormSchema,
  contactFormSchema,
]);

export const formTypeSchema = z.enum(["demo", "waitlist", "contact"]);

export const hubSpotProxySubmissionSchema = z
  .object({
    formType: formTypeSchema,
    email: z.email("Enter a valid email address."),
    firstname: requiredTextField("First name"),
    lastname: requiredTextField("Last name"),
    message: optionalTextField,
  })
  .strict();

export const formSchemaMap = {
  demo: demoFormSchema,
  waitlist: waitlistFormSchema,
  contact: contactFormSchema,
} as const;

export type DemoFormValues = z.infer<typeof demoFormSchema>;
export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type SubmissionPayload = z.infer<typeof submissionPayloadSchema>;
export type SubmissionFormType = SubmissionPayload["formType"];
export type HubSpotProxySubmission = z.infer<typeof hubSpotProxySubmissionSchema>;
