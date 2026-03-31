import type { CSSProperties } from "react";

export type ButtonVariant = "primary" | "secondary" | "cream";
export type ButtonSize = "sm" | "md";

const buttonBaseClassName =
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2";

const buttonSizeClassNames: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5",
  md: "px-6 py-3",
};

const buttonVariantClassNames: Record<ButtonVariant, string> = {
  primary:
    "hover:bg-[#2d261e] focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf3]",
  secondary:
    "border hover:border-[#211c16] hover:bg-[#fffcf8] focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf3]",
  cream:
    "hover:bg-white focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2c241b]",
};

const buttonVariantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: "#211c16",
    color: "#fffaf3",
    WebkitTextFillColor: "#fffaf3",
  },
  secondary: {
    backgroundColor: "#ffffff",
    borderColor: "#d8c9b7",
    color: "#211c16",
    WebkitTextFillColor: "#211c16",
  },
  cream: {
    backgroundColor: "#f4ede4",
    color: "#211c16",
    WebkitTextFillColor: "#211c16",
  },
};

export function getButtonClassName(
  variant: ButtonVariant,
  size: ButtonSize = "md",
  extraClassName?: string,
) {
  return [
    buttonBaseClassName,
    buttonSizeClassNames[size],
    buttonVariantClassNames[variant],
    extraClassName,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getButtonStyle(variant: ButtonVariant) {
  return buttonVariantStyles[variant];
}
