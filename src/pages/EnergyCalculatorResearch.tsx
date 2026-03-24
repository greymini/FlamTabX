import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/sections/Navbar";
import { BlogArticle } from "@/components/blog/BlogArticle";
import researchMarkdown from "@/content/pdrc-calculator-research.md?raw";

const EnergyCalculatorResearch = () => {
  useEffect(() => {
    const prev = document.title;
    document.title =
      "FlamTabX | PDRC calculator methodology: NASA POWER, IEA, lookup pipeline";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "How the passive cooling calculator works: PDRC physics, precalculated lookups, NASA POWER GHI, IEA grid factors, and limitations. Link to formulas deep dive."
    );
    return () => {
      document.title = prev;
      if (meta) meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        <header className="border-b border-border bg-card/60 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Methodology
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              PDRC energy calculator
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A readable summary of the lookup pipeline and data sources. Run
              numbers in the{" "}
              <Link
                to="/tools/energy-savings"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                interactive tool
              </Link>
              ; for LaTeX-style equations and the full formula chain, open{" "}
              <Link
                to="/blog/pdrc-engineering"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Formulas & pipeline
              </Link>
              .
            </p>
          </div>
        </header>
        <BlogArticle
          markdown={researchMarkdown}
          tocFooterLinks={[
            { to: "/blog", label: "All posts →" },
            { to: "/blog/pdrc-engineering", label: "Formulas & pipeline →" },
            { to: "/tools/energy-savings", label: "Open calculator →" },
            { to: "/blog/flamtabx", label: "Venture story →" },
          ]}
        />
      </main>
    </>
  );
};

export default EnergyCalculatorResearch;
