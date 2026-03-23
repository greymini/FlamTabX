import {
  useMemo,
  useEffect,
  useState,
  type ReactNode,
  type CSSProperties,
  isValidElement,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { Link } from "react-router-dom";
import { List, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

function getPlainText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getPlainText).join("");
  if (isValidElement(node) && node.props?.children != null) {
    return getPlainText(node.props.children as ReactNode);
  }
  return "";
}

function isCalloutBlockquote(children: ReactNode): boolean {
  const t = getPlainText(children).replace(/\s+/g, " ").trim();
  if (t.length > 360) return false;
  return /^(?:\*\*)?(At a glance|Executive summary|For investors)\b/i.test(t);
}

interface BlogArticleProps {
  markdown: string;
  className?: string;
  /** Shown below the desktop TOC (and in the mobile sheet). */
  tocFooterLinks?: { to: string; label: string }[];
}

function TocLinkList({
  toc,
  onNavigate,
  footerLinks,
}: {
  toc: TocItem[];
  onNavigate?: () => void;
  footerLinks?: { to: string; label: string }[];
}) {
  return (
    <>
      <ul className="space-y-2 text-muted-foreground">
        {toc.map((item) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              onClick={onNavigate}
              className="block border-l-2 border-transparent py-0.5 pl-2 transition-colors hover:border-primary hover:text-primary"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
      {footerLinks && footerLinks.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Also see
          </p>
          <ul className="space-y-2">
            {footerLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={onNavigate}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export function BlogArticle({
  markdown,
  className,
  tocFooterLinks = [
    { to: "/tools/energy-savings", label: "PDRC energy calculator →" },
  ],
}: BlogArticleProps) {
  const toc = useMemo(() => buildToc(markdown), [markdown]);
  const [readProgress, setReadProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  useEffect(() => {
    void import("katex/dist/katex.min.css");
  }, []);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const denom = el.scrollHeight - el.clientHeight;
      const p = denom > 0 ? scrollTop / denom : 0;
      setReadProgress(Math.min(1, Math.max(0, p)));
      setShowTop(scrollTop > 480);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div
        className="blog-reading-progress"
        style={
          { "--read-progress": String(readProgress) } as CSSProperties & {
            "--read-progress": string;
          }
        }
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 pb-28 pt-10 lg:grid lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:gap-10 lg:pt-14">
        <aside className="mb-10 hidden shrink-0 lg:block">
          <nav
            aria-label="On this page"
            className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-border bg-card/80 p-4 text-sm backdrop-blur-sm"
          >
            <p className="mb-3 font-semibold text-foreground">On this page</p>
            <TocLinkList toc={toc} footerLinks={tocFooterLinks} />
          </nav>
        </aside>

        <div className="relative flex min-w-0 flex-col items-center">
          <Sheet open={mobileTocOpen} onOpenChange={setMobileTocOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary lg:hidden"
              >
                <List className="h-4 w-4" aria-hidden />
                On this page
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[min(70vh,520px)] rounded-t-xl">
              <SheetHeader className="text-left">
                <SheetTitle>On this page</SheetTitle>
              </SheetHeader>
              <nav aria-label="On this page mobile" className="mt-4 max-h-[calc(100%-4rem)] overflow-y-auto pr-2 text-sm">
                <TocLinkList
                  toc={toc}
                  footerLinks={tocFooterLinks}
                  onNavigate={() => setMobileTocOpen(false)}
                />
              </nav>
            </SheetContent>
          </Sheet>

          <article
            className={cn(
              "prose-blog w-full max-w-[min(48rem,calc(100vw-2.5rem))] xl:max-w-[52rem]",
              "rounded-xl border border-border bg-card px-6 py-10 shadow-sm sm:px-10"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeKatex, { strict: false, throwOnError: false }],
              ]}
              components={{
                h1: ({ children }) => (
                  <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-12 scroll-mt-24 border-b border-border pb-2 font-display text-2xl font-semibold tracking-tight text-foreground first:mt-0">
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
                a: ({ href, children }) => {
                  if (href?.startsWith("/")) {
                    return (
                      <Link
                        to={href}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {children}
                      </Link>
                    );
                  }
                  return (
                    <a
                      href={href}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      rel="noopener noreferrer"
                      target={href?.startsWith("http") ? "_blank" : undefined}
                    >
                      {children}
                    </a>
                  );
                },
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
                blockquote: ({ children }) => {
                  if (isCalloutBlockquote(children)) {
                    return (
                      <aside className="blog-callout mt-6 border border-primary/25 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                        {children}
                      </aside>
                    );
                  }
                  return (
                    <blockquote className="mt-6 border-l-4 border-climate/50 bg-muted/40 py-2 pl-4 pr-3 text-muted-foreground">
                      {children}
                    </blockquote>
                  );
                },
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
                table: ({ children }) => (
                  <div className="mt-6 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[20rem] border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="border-b border-border bg-muted/50 text-left text-foreground">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 font-semibold">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="border-t border-border px-3 py-2 text-muted-foreground">
                    {children}
                  </td>
                ),
                tr: ({ children }) => <tr>{children}</tr>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                hr: () => <hr className="my-10 border-border" />,
              }}
            >
              {markdown}
            </ReactMarkdown>
          </article>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:border-primary hover:text-primary",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
        aria-label="Back to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
}
