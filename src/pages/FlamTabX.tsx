import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/sections/Navbar";
import { BlogArticle } from "@/components/blog/BlogArticle";
import pitchMarkdown from "@/content/flamtabx-pitch.md?raw";

const FlamTabXBlog = () => {
  useEffect(() => {
    const prev = document.title;
    document.title =
      "FlamTabX — Climate-adaptive coating venture pitch | Full document";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Full venture pitch: problem, solution, market, prototype, GTM, team, environmental impact, and regulatory strategy for FlamTabX."
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
              Long-form pitch
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              FlamTabX
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Text reproduced from the venture document (figures omitted). Use
              the table of contents to navigate. For interactive savings
              estimates, open the{" "}
              <Link
                to="/tools/energy-savings"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                energy calculator
              </Link>
              .
            </p>
          </div>
        </header>
        <BlogArticle markdown={pitchMarkdown} />
      </main>
    </>
  );
};

export default FlamTabXBlog;
