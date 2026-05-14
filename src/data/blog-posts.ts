export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date string for sorting and display */
  publishedAt: string;
  readMinutes: number;
  path: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "pdrc-engineering",
    title: "Passive cooling calculator: formulas and pipeline",
    description:
      "Key physics equations, humidity and heating corrections, and how kWh and CO₂ flow from roof area and climate, typeset for clarity.",
    publishedAt: "2025-03-20",
    readMinutes: 14,
    path: "/blog/pdrc-engineering",
  },
  {
    slug: "energy-calculator",
    title: "How we built the energy savings calculator",
    description:
      "Executive summary of the lookup architecture, NASA POWER and IEA data, limitations, and how to interpret results.",
    publishedAt: "2025-03-18",
    readMinutes: 8,
    path: "/blog/energy-calculator",
  },
  {
    slug: "flamtabx",
    title: "FlamTabX venture story",
    description:
      "Problem, product, traction, go to market, team, impact, and IP, structured for explorers and investors.",
    publishedAt: "2025-03-15",
    readMinutes: 11,
    path: "/blog/flamtabx",
  },
];

export function blogPostsSorted(): BlogPostMeta[] {
  return [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
