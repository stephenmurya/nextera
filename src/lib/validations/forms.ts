import { z } from "zod";

const requiredTextField = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} is required.`);

const requiredLongTextField = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required.`)
    .max(2_000, `${fieldName} must be shorter than 2000 characters.`);

const optionalTextField = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, z.string().optional());

const optionalPhoneField = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}, z.string()
  .regex(/^[+\d()\-.\s]{7,24}$/, "Enter a valid phone number.")
  .optional());

const teamSizeValues = [
  "solo_agent",
  "2_5_agents",
  "6_15_agents",
  "16_50_agents",
  "50_plus_agents",
] as const;

const interestTypeValues = [
  "request_demo",
  "join_waitlist",
  "contact_sales",
] as const;

const requiredSelectField = <
  TValues extends readonly [string, ...string[]],
>(
  fieldName: string,
  values: TValues,
) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required.`)
    .refine(
      (value): value is TValues[number] =>
        values.includes(value as TValues[number]),
      `Select a valid ${fieldName.toLowerCase()}.`,
    )
    .transform((value) => value as TValues[number]);

export const teamSizeSchema = requiredSelectField("Team size", teamSizeValues);
export const interestTypeSchema = requiredSelectField(
  "Interest type",
  interestTypeValues,
);

export const teamSizeOptions = [
  { label: "Solo agent", value: "solo_agent" },
  { label: "2-5 agents", value: "2_5_agents" },
  { label: "6-15 agents", value: "6_15_agents" },
  { label: "16-50 agents", value: "16_50_agents" },
  { label: "50+ agents", value: "50_plus_agents" },
] as const;

export const interestTypeOptions = [
  { label: "Request a demo", value: "request_demo" },
  { label: "Join early access", value: "join_waitlist" },
  { label: "Contact sales", value: "contact_sales" },
] as const;

const sharedLeadFields = {
  first_name: requiredTextField("First name"),
  last_name: requiredTextField("Last name"),
  email: z.email("Enter a valid work email address."),
  phone: optionalPhoneField,
  company_name: requiredTextField("Company name"),
  market_or_city: requiredTextField("Market or city"),
  team_size: teamSizeSchema,
  current_workflow: requiredLongTextField("Current workflow"),
  biggest_pain_point: requiredLongTextField("Biggest pain point"),
  interest_type: interestTypeSchema,
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
