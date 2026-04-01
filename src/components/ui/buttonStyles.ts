import type { CSSProperties } from "react";

export type ButtonVariant = "primary" | "secondary" | "cream" | "ghostInverse";
export type ButtonSize = "sm" | "md";

const buttonBaseClassName =
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold tracking-[0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-2";

const buttonSizeClassNames: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5",
  md: "px-6 py-3",
};

const buttonVariantClassNames: Record<ButtonVariant, string> = {
  primary:
    "hover:bg-[#262626] focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#efeee8]",
  secondary:
    "border hover:border-black/20 hover:bg-white focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#efeee8]",
  cream:
    "hover:bg-white focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]",
  ghostInverse:
    "border hover:bg-white/10 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]",
};

const buttonVariantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: "#111111",
    color: "#f8f6ef",
    WebkitTextFillColor: "#f8f6ef",
  },
  secondary: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "rgba(17,17,17,0.12)",
    color: "#111111",
    WebkitTextFillColor: "#111111",
  },
  cream: {
    backgroundColor: "#f5f5f1",
    color: "#111111",
    WebkitTextFillColor: "#111111",
  },
  ghostInverse: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.22)",
    color: "#ffffff",
    WebkitTextFillColor: "#ffffff",
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
