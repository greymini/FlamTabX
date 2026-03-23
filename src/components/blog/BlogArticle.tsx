import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TocItem {
  title: string;
  slug: string;
}

function buildToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(/^## (.+)$/);
    if (m) {
      const title = m[1].trim();
      items.push({ title, slug: slugger.slug(title) });
    }
  }
  return items;
}

interface BlogArticleProps {
  markdown: string;
  className?: string;
}

export function BlogArticle({ markdown, className }: BlogArticleProps) {
  const toc = useMemo(() => buildToc(markdown), [markdown]);

  return (
    <div className={cn("relative", className)}>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-10 lg:flex lg:gap-12 lg:pt-14">
        <aside className="mb-10 hidden w-56 shrink-0 lg:block">
          <nav
            aria-label="On this page"
            className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-border bg-card/80 p-4 text-sm backdrop-blur-sm"
          >
            <p className="mb-3 font-semibold text-foreground">On this page</p>
            <ul className="space-y-2 text-muted-foreground">
              {toc.map((item) => (
                <li key={item.slug}>
                  <a
                    href={`#${item.slug}`}
                    className="block border-l-2 border-transparent py-0.5 pl-2 transition-colors hover:border-primary hover:text-primary"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border pt-4">
              <Link
                to="/tools/energy-savings"
                className="text-sm font-medium text-primary hover:underline"
              >
                PDRC energy savings calculator →
              </Link>
            </div>
          </nav>
        </aside>

        <article
          className={cn(
            "prose-blog min-w-0 flex-1",
            "rounded-xl border border-border bg-card px-6 py-10 shadow-sm sm:px-10"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={{
              h1: ({ children }) => (
                <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="scroll-mt-24 border-b border-border pb-2 font-display text-2xl font-semibold tracking-tight text-foreground first:mt-0 mt-12">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-8 font-display text-xl font-semibold text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {children}
                </p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  rel="noopener noreferrer"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-foreground/90">{children}</em>
              ),
              blockquote: ({ children }) => (
                <blockquote className="mt-4 border-l-4 border-primary/40 bg-muted/40 py-2 pl-4 pr-2 text-muted-foreground">
                  {children}
                </blockquote>
              ),
              code: ({ className, children }) => {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <code className={cn("font-mono text-sm", className)}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 text-sm">
                  {children}
                </pre>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
