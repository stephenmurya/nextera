import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type SelectOption = {
  label: string;
  value: string;
};

type BaseFormInputProps = {
  id: string;
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
};

type TextInputProps = BaseFormInputProps &
  Pick<
    InputHTMLAttributes<HTMLInputElement>,
    | "autoComplete"
    | "disabled"
    | "inputMode"
    | "placeholder"
    | "readOnly"
    | "type"
  > & {
    as?: "input";
  };

type SelectInputProps = BaseFormInputProps &
  Pick<
    SelectHTMLAttributes<HTMLSelectElement>,
    "autoComplete" | "defaultValue" | "disabled"
  > & {
    as: "select";
    options: SelectOption[];
    placeholderOption?: string;
  };

type FormInputProps = TextInputProps | SelectInputProps;

const baseFieldClassName =
  "w-full rounded-[1.35rem] border border-black/12 bg-white/92 px-4 py-3.5 text-sm text-foreground shadow-[0_12px_32px_rgba(17,17,17,0.04)] transition placeholder:text-muted/70 focus:border-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f6ef] disabled:cursor-not-allowed disabled:bg-[#f4efe8] disabled:text-[#8f8579]";

export function FormInput(props: FormInputProps) {
  const { id, label, error, registration } = props;
  const describedBy = error ? `${id}-error` : undefined;

  if (props.as === "select") {
    return (
      <div className="space-y-2">
        <label
          className="text-sm font-semibold tracking-[0.01em] text-foreground"
          htmlFor={id}
        >
          {label}
        </label>
        <select
          {...registration}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : "false"}
          autoComplete={props.autoComplete}
          className={baseFieldClassName}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          id={id}
        >
          {props.placeholderOption ? (
            <option value="">{props.placeholderOption}</option>
          ) : null}
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p
            className="mt-1 text-sm text-[#b74431] transition-colors"
            id={describedBy}
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        className="text-sm font-semibold tracking-[0.01em] text-foreground"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        {...registration}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : "false"}
        autoComplete={props.autoComplete}
        className={baseFieldClassName}
        disabled={props.disabled}
        id={id}
        inputMode={props.inputMode}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        type={props.type}
      />
      {error ? (
        <p
          className="mt-1 text-sm text-[#b74431] transition-colors"
          id={describedBy}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
