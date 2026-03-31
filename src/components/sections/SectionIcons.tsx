import type { FC, SVGProps } from "react";

type IconComponent = FC<SVGProps<SVGSVGElement>>;

const RouteIcon: IconComponent = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M6 6h6a3 3 0 1 1 0 6h-1a3 3 0 1 0 0 6h7" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
};

const TimelineIcon: IconComponent = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 4v16" />
      <path d="M7 8h10" />
      <path d="M7 16h10" />
      <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="20" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
};

const ShieldIcon: IconComponent = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M12 3 5 6v5c0 4.5 2.7 8.6 7 10 4.3-1.4 7-5.5 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.2-3.6" />
    </svg>
  );
};

const MarkerIcon: IconComponent = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
    </svg>
  );
};

const iconMap: Record<string, IconComponent> = {
  route: RouteIcon,
  timeline: TimelineIcon,
  shield: ShieldIcon,
};

type SectionIconProps = {
  icon?: string;
  className?: string;
};

export function SectionIcon({
  icon,
  className = "h-5 w-5",
}: SectionIconProps) {
  const Icon = icon ? iconMap[icon] ?? MarkerIcon : MarkerIcon;

  return <Icon className={className} />;
}
