"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useForm,
  type DefaultValues,
  type FieldErrors,
  type Path,
  type Resolver,
} from "react-hook-form";
import type { ZodType } from "zod";
import { FormInput } from "@/components/forms/FormInput";
import { panoramaLightPanelStyle } from "@/components/panorama/PanoramaPrimitives";
import { getButtonClassName, getButtonStyle } from "@/components/ui/buttonStyles";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  interestTypeOptions,
  teamSizeOptions,
  type SubmissionPayload,
} from "@/lib/validations/forms";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

  const isBusy = isSubmitting || isRedirecting;

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

  const formBody = (
    <form
      aria-busy={isBusy}
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
            const responseBody = (await response.json().catch(() => null)) as
              | {
                  message?: string;
                  redirectTo?: string;
                  success?: boolean;
                }
              | null;

            if (!response.ok) {
              setSubmissionError(
                responseBody?.message ?? "Something went wrong. Please try again.",
              );
              trackAnalyticsEvent("form_submit_error", {
                formType: defaultValues.formType,
                errorType: "server",
              });
              return;
            }

            trackAnalyticsEvent("form_submit_success", {
              formType: defaultValues.formType,
            });
            setIsRedirecting(true);
            router.push(responseBody?.redirectTo ?? "/thank-you");
          } catch {
            setSubmissionError("Something went wrong. Please try again.");
            trackAnalyticsEvent("form_submit_error", {
              formType: defaultValues.formType,
              errorType: "network",
            });
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
          disabled={isBusy}
          error={getErrorMessage(errors.first_name)}
          id={`${defaultValues.formType}-first-name`}
          label="First name"
          placeholder="Ada"
          registration={register("first_name" as Path<TFormValues>)}
          type="text"
        />
        <FormInput
          autoComplete="family-name"
          disabled={isBusy}
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
          disabled={isBusy}
          error={getErrorMessage(errors.email)}
          id={`${defaultValues.formType}-email`}
          label="Work email"
          placeholder="ada@company.com"
          registration={register("email" as Path<TFormValues>)}
          type="email"
        />
        <FormInput
          autoComplete="tel"
          disabled={isBusy}
          error={getErrorMessage(errors.phone)}
          id={`${defaultValues.formType}-phone`}
          inputMode="tel"
          label="Phone"
          placeholder="+1 (555) 123-4567"
          registration={register("phone" as Path<TFormValues>)}
          type="tel"
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          autoComplete="organization"
          disabled={isBusy}
          error={getErrorMessage(errors.company_name)}
          id={`${defaultValues.formType}-company`}
          label="Company name"
          placeholder="Analytical Engines Ltd."
          registration={register("company_name" as Path<TFormValues>)}
          type="text"
        />
        <FormInput
          disabled={isBusy}
          error={getErrorMessage(errors.market_or_city)}
          id={`${defaultValues.formType}-market`}
          label="Market or city"
          placeholder="Lagos"
          registration={register("market_or_city" as Path<TFormValues>)}
          type="text"
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          as="select"
          disabled={isBusy}
          error={getErrorMessage(errors.team_size)}
          id={`${defaultValues.formType}-team-size`}
          label="Team size"
          options={teamSizeOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          placeholderOption="Select your team size"
          registration={register("team_size" as Path<TFormValues>)}
        />
        <FormInput
          as="select"
          disabled={isBusy}
          error={getErrorMessage(errors.interest_type)}
          id={`${defaultValues.formType}-interest-type`}
          label="Interest type"
          options={interestTypeOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          registration={register("interest_type" as Path<TFormValues>)}
        />
      </div>
      <FormInput
        as="textarea"
        disabled={isBusy}
        error={getErrorMessage(errors.current_workflow)}
        id={`${defaultValues.formType}-current-workflow`}
        label="Current workflow"
        placeholder="Tell us how your team currently captures, assigns, and follows up with leads."
        registration={register("current_workflow" as Path<TFormValues>)}
      />
      <FormInput
        as="textarea"
        disabled={isBusy}
        error={getErrorMessage(errors.biggest_pain_point)}
        id={`${defaultValues.formType}-pain-point`}
        label="Biggest pain point"
        placeholder="What is the biggest bottleneck in your current sales and follow-up process?"
        registration={register("biggest_pain_point" as Path<TFormValues>)}
      />
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
          disabled={isBusy}
          style={
            isBusy
              ? {
                  ...getButtonStyle("primary"),
                  backgroundColor: "#8f8880",
                  color: "#f8f6ef",
                  WebkitTextFillColor: "#f8f6ef",
                }
              : getButtonStyle("primary")
          }
          type="submit"
        >
          {isBusy ? (
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
    <div
      className={[
        "w-full overflow-hidden rounded-[2rem] border border-black/12",
        embedded ? "" : "mx-auto max-w-3xl",
      ]
        .filter(Boolean)
        .join(" ")}
      style={panoramaLightPanelStyle}
    >
      {!hideHeader ? (
        <div className="border-b border-border/70 px-6 py-8 sm:px-8">
          <div className="space-y-3">
            <span
              className="inline-flex rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-black/58"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Lead Capture
            </span>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
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
