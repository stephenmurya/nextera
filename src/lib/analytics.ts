import { track } from "@vercel/analytics";
import type { SubmissionFormType } from "@/lib/validations/forms";

export type PageViewEventPayload = {
  path: string;
  template: string;
};

export type CtaClickEventPayload = {
  label: string;
  href: string;
  location: string;
};

export type FormViewEventPayload = {
  formType: SubmissionFormType;
  location: string;
};

export type FormStartEventPayload = {
  formType: SubmissionFormType;
};

export type FormSubmitSuccessEventPayload = {
  formType: SubmissionFormType;
};

export type FormSubmitErrorType = "validation" | "server" | "network";

export type FormSubmitErrorEventPayload = {
  formType: SubmissionFormType;
  errorType: FormSubmitErrorType;
};

export interface AnalyticsEventMap {
  page_view: PageViewEventPayload;
  cta_click: CtaClickEventPayload;
  form_view: FormViewEventPayload;
  form_start: FormStartEventPayload;
  form_submit_success: FormSubmitSuccessEventPayload;
  form_submit_error: FormSubmitErrorEventPayload;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

export function trackAnalyticsEvent<TEventName extends AnalyticsEventName>(
  eventName: TEventName,
  payload: AnalyticsEventMap[TEventName],
) {
  if (typeof window === "undefined") {
    return;
  }

  track(eventName, payload);
}
