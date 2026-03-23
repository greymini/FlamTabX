import { useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import Navbar from "@/components/sections/Navbar";
import { blogPostsSorted } from "@/data/blog-posts";
import { ArrowRight, Clock, Calendar } from "lucide-react";

const BlogIndex = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = "FlamTabX — Blog";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Articles on the FlamTabX venture, passive cooling methodology, and PDRC calculator engineering."
    );
    return () => {
      document.title = prev;
      if (meta) meta.setAttribute("content", prevDesc);
    };
  }, []);

  const posts = blogPostsSorted();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/25">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl px-6 py-12 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Writing
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Blog
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Stories, methodology, and technical depth on climate-adaptive
              surfaces and the PDRC savings tool.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl space-y-6 px-6 py-12 pb-24">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/30"
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {post.readMinutes} min read
                </span>
              </div>
              <h2 className="font-display mt-3 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                <Link
                  to={post.path}
                  className="transition-colors hover:text-primary"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {post.description}
              </p>
              <Link
                to={post.path}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Read article
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
};

export default BlogIndex;
