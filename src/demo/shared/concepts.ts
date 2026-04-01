export const conceptDefinitions = {
  monograph: {
    slug: "monograph",
    name: "Monograph",
    route: "/concepts/monograph",
    direction: "Editorial Luxury",
    summary:
      "Serif-led, quiet, and premium. More white space, finer lines, and a calmer luxury cadence.",
  },
  gridline: {
    slug: "gridline",
    name: "Gridline",
    route: "/concepts/gridline",
    direction: "Modern Product Minimal",
    summary:
      "Hard-edged product polish with strict grid structure, crisp surfaces, and sharper hierarchy.",
  },
  blueprint: {
    slug: "blueprint",
    name: "Blueprint",
    route: "/concepts/blueprint",
    direction: "Luxury Real Estate Tech",
    summary:
      "Architectural framing, technical labels, and monochrome detail that feels tailored to real estate workflows.",
  },
  panorama: {
    slug: "panorama",
    name: "Panorama",
    route: "/concepts/panorama",
    direction: "Full-Bleed Blueprint",
    summary:
      "Expansive full-bleed property canvases layered with blueprint lines and precise technical structure.",
  },
} as const;

export type ConceptSlug = keyof typeof conceptDefinitions;

export const conceptList = Object.values(conceptDefinitions);
