import type { CallToAction, FormSection, Page, PageSection } from "@/types/cms";

const formTargets: Record<FormSection["formType"], string> = {
  demo: "/demo",
  waitlist: "/early-access",
  contact: "/contact",
};

const formLabels: Record<FormSection["formType"], string> = {
  demo: "Request Demo",
  waitlist: "Join Early Access",
  contact: "Contact Sales",
};

function labelForSection(section: PageSection) {
  switch (section._type) {
    case "featureGrid":
      return "Platform";
    case "useCases":
      return "Use Cases";
    case "howItWorks":
      return "Workflow";
    case "statsStrip":
      return "Proof";
    case "testimonial":
      return "Story";
    case "problemSolution":
      return "Problem / Solution";
    case "faq":
      return "FAQ";
    case "formSection":
      return formLabels[section.formType];
    case "richText":
      return "Overview";
    case "ctaBand":
      return "Action";
    case "hero":
      return "Home";
  }
}

export function getConceptPrimaryCta(page: Page): CallToAction {
  for (const section of page.sections) {
    if (section._type === "hero" && section.primaryCta) {
      return section.primaryCta;
    }

    if (section._type === "ctaBand" && section.primaryCta) {
      return section.primaryCta;
    }

    if (section._type === "formSection") {
      return {
        label: formLabels[section.formType],
        href: formTargets[section.formType],
      };
    }
  }

  return {
    label: "Request Demo",
    href: "/demo",
  };
}

export function getSectionNavItems(sections: PageSection[]) {
  return sections
    .filter((section) => section.anchor && section._type !== "hero")
    .slice(0, 4)
    .map((section) => ({
      label: labelForSection(section),
      href: `#${section.anchor}`,
    }));
}
