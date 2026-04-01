"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  useForm,
  type DefaultValues,
  type FieldErrors,
  type Path,
  type Resolver,
} from "react-hook-form";
import type { ZodType } from "zod";
import { FormInput } from "@/components/forms/FormInput";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { SubmissionPayload } from "@/lib/validations/forms";

type LeadCaptureFormProps<TFormValues extends SubmissionPayload> = {
  defaultValues: TFormValues;
  description: string;
  embedded?: boolean;
  hideHeader?: boolean;
  schema: ZodType<TFormValues>;
  submitLabel: string;
  title: string;
};

export function LeadCaptureForm<TFormValues extends SubmissionPayload>({
  defaultValues,
  description,
  embedded = false,
  hideHeader = false,
  schema,
  submitLabel,
  title,
}: LeadCaptureFormProps<TFormValues>) {
  const searchParams = useSearchParams();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<TFormValues>({
    resolver: zodResolver(
      schema as Parameters<typeof zodResolver>[0],
    ) as Resolver<TFormValues>,
    defaultValues: defaultValues as DefaultValues<TFormValues>,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const getErrorMessage = (error: unknown) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      return error.message;
    }

    return undefined;
  };

  const handleFirstFocus = () => {
    if (hasStarted) {
      return;
    }

    setHasStarted(true);
    trackAnalyticsEvent("form_start", {
      formType: defaultValues.formType,
    });
  };

  const handleInvalidSubmit = (_errors: FieldErrors<TFormValues>) => {
    trackAnalyticsEvent("form_submit_error", {
      formType: defaultValues.formType,
      errorType: "validation",
    });
  };

  const formBody = isSuccess ? (
    <div className="px-6 py-10 sm:px-8">
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ebf5ee] text-[#1f6b3b] shadow-[0_14px_40px_rgba(31,107,59,0.12)]">
          <svg
            aria-hidden="true"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 12.5 9.5 17 19 7.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.25"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-semibold tracking-tight text-foreground">
            Thank you!
          </h3>
          <p className="max-w-lg text-base leading-8 text-muted">
            We&apos;ve received your information and will be in touch shortly.
          </p>
        </div>
      </div>
    </div>
  ) : (
      <form
        aria-busy={isSubmitting}
        className="space-y-6 px-6 py-8 sm:px-8"
        onFocusCapture={handleFirstFocus}
      onSubmit={handleSubmit(
        async (values) => {
          setSubmissionError(null);
          try {
            const trackingValues = {
              utm_source: searchParams.get("utm_source") ?? undefined,
              utm_medium: searchParams.get("utm_medium") ?? undefined,
              utm_campaign: searchParams.get("utm_campaign") ?? undefined,
              landing_page_url:
                typeof window !== "undefined" ? window.location.href : undefined,
            };
            const response = await fetch("/api/forms/submit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...values,
                ...trackingValues,
              }),
            });

            if (!response.ok) {
              setSubmissionError("Something went wrong. Please try again.");
              trackAnalyticsEvent("form_submit_error", {
                formType: defaultValues.formType,
                errorType: "server",
              });
              return;
            }

            trackAnalyticsEvent("form_submit_success", {
              formType: defaultValues.formType,
            });
            setIsSuccess(true);
          } catch {
            setSubmissionError("Something went wrong. Please try again.");
            trackAnalyticsEvent("form_submit_error", {
              formType: defaultValues.formType,
              errorType: "network",
            });
            return;
          }
        },
        handleInvalidSubmit,
      )}
    >
      <input
        type="hidden"
        value={defaultValues.formType}
        {...register("formType" as Path<TFormValues>)}
        readOnly
      />
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <input
          aria-hidden="true"
          autoComplete="off"
          className="absolute opacity-0 -z-10"
          tabIndex={-1}
          type="text"
          {...register("bot_field" as Path<TFormValues>)}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          autoComplete="given-name"
          disabled={isSubmitting}
          error={getErrorMessage(errors.first_name)}
          id={`${defaultValues.formType}-first-name`}
          label="First name"
          placeholder="Ada"
          registration={register("first_name" as Path<TFormValues>)}
          type="text"
        />
        <FormInput
          autoComplete="family-name"
          disabled={isSubmitting}
          error={getErrorMessage(errors.last_name)}
          id={`${defaultValues.formType}-last-name`}
          label="Last name"
          placeholder="Lovelace"
          registration={register("last_name" as Path<TFormValues>)}
          type="text"
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          autoComplete="email"
          disabled={isSubmitting}
          error={getErrorMessage(errors.email)}
          id={`${defaultValues.formType}-email`}
          label="Work email"
          placeholder="ada@company.com"
          registration={register("email" as Path<TFormValues>)}
          type="email"
        />
        <FormInput
          autoComplete="organization"
          disabled={isSubmitting}
          error={getErrorMessage(errors.company_name)}
          id={`${defaultValues.formType}-company`}
          label="Company name"
          placeholder="Analytical Engines Ltd."
          registration={register("company_name" as Path<TFormValues>)}
          type="text"
        />
      </div>
      {submissionError ? (
        <p
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          role="alert"
        >
          {submissionError}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted">
          We will never expose your information client-side or store it in this
          app.
        </p>
        <button
          className={getButtonClassName(
            "primary",
            "md",
            "min-w-[12rem] gap-3 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-100",
          )}
          disabled={isSubmitting}
          style={
            isSubmitting
              ? {
                  ...getButtonStyle("primary"),
                  backgroundColor: "#a3988a",
                  color: "#f9f4ee",
                  WebkitTextFillColor: "#f9f4ee",
                }
              : getButtonStyle("primary")
          }
          type="submit"
        >
          {isSubmitting ? (
            <>
              <svg
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-90"
                  d="M22 12a10 10 0 0 0-10-10"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
      </div>
    </form>
  );

  const formCard = (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] border border-border/80 bg-surface/95 shadow-[0_28px_90px_rgba(33,28,22,0.08)]">
      {!hideHeader ? (
        <div className="border-b border-border/70 px-6 py-8 sm:px-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Lead Capture
            </span>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h2>
              <p className="text-base leading-8 text-muted">{description}</p>
            </div>
          </div>
        </div>
      ) : null}
      {formBody}
    </div>
  );

  if (embedded) {
    return formCard;
  }

  return <section className="py-16 md:py-24">{formCard}</section>;
}
