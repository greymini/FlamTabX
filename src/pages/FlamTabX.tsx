import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/sections/Navbar";
import { BlogArticle } from "@/components/blog/BlogArticle";
import pitchMarkdown from "@/content/flamtabx-pitch.md?raw";

const FlamTabXBlog = () => {
  useEffect(() => {
    const prev = document.title;
    document.title =
      "FlamTabX | Venture story: climate adaptive coating and passive cooling";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Why FlamTabX: heat and moisture problem, product thesis, pilots, GTM, team, impact, and IP, plus links to the energy savings calculator and methodology article."
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
              Why FlamTabX
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Venture story
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A concise narrative for explorers and investors (figures from the
              original deck omitted). Use the table of contents to jump around.
              For geography-specific savings, try the{" "}
              <Link
                to="/tools/energy-savings"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                energy savings calculator
              </Link>{" "}
              and the{" "}
              <Link
                to="/blog/energy-calculator"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                methodology article
              </Link>
              .
            </p>
          </div>
        </header>
        <BlogArticle
          markdown={pitchMarkdown}
          tocFooterLinks={[
            { to: "/blog", label: "All posts →" },
            { to: "/tools/energy-savings", label: "Energy calculator →" },
            { to: "/blog/energy-calculator", label: "Calculator methodology →" },
            { to: "/blog/pdrc-engineering", label: "Formulas & pipeline →" },
          ]}
        />
      </main>
    </>
  );
};

export default FlamTabXBlog;
