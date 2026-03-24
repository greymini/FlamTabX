import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/sections/Navbar";
import { BlogArticle } from "@/components/blog/BlogArticle";
import engineeringMarkdown from "@/content/pdrc-engineering.md?raw";

const PdrcEngineeringBlog = () => {
  useEffect(() => {
    const prev = document.title;
    document.title =
      "FlamTabX | PDRC formulas and pipeline: engineering deep dive";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Equations behind the PDRC calculator: net cooling power, GHI to irradiance, kWh and CO₂ per m², humidity and heating corrections, typeset with LaTeX."
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
          <div className="mx-auto max-w-3xl px-6 py-8 text-center lg:max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Engineering
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Formulas & pipeline
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Mathematical backbone of the lookup tool. Start with the{" "}
              <Link
                to="/blog/energy-calculator"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                methodology overview
              </Link>
              , then{" "}
              <Link
                to="/tools/energy-savings"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                run numbers
              </Link>
              .
            </p>
          </div>
        </header>
        <BlogArticle
          markdown={engineeringMarkdown}
          tocFooterLinks={[
            { to: "/blog", label: "All posts →" },
            { to: "/blog/energy-calculator", label: "Methodology overview →" },
            { to: "/tools/energy-savings", label: "Open calculator →" },
          ]}
        />
      </main>
    </>
  );
};

export default PdrcEngineeringBlog;
