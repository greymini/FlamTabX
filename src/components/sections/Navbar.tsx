import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/BrandMark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Navbar(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("/");

  const scrollHomeToTop = useCallback(() => {
    if (location.hash) {
      navigate("/", { replace: true });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.hash, navigate]);

  const goToHomeHash = useCallback(
    (hashPath: string) => {
      const id = hashPath.startsWith("#") ? hashPath.slice(1) : hashPath;
      if (location.pathname !== "/") {
        navigate({ pathname: "/", hash: id });
      } else {
        scrollToId(id);
      }
    },
    [location.pathname, navigate]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.location.pathname !== "/") {
        setActiveSection(window.location.pathname);
        return;
      }

      const sections = ["products", "closing"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            setActiveSection(`#${section}`);
            return;
          }
        }
      }
      setActiveSection("/");
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hashchange", handleScroll);
    window.addEventListener("popstate", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleScroll);
      window.removeEventListener("popstate", handleScroll);
    };
  }, []);

  const linkClass = (active: boolean) =>
    cn(
      "text-sm font-medium transition-colors",
      active ? "text-primary" : "text-foreground hover:text-primary"
    );

  const blogMenuActive = location.pathname.startsWith("/blog");

  const handleLogoOrHomeClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      scrollHomeToTop();
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          onClick={handleLogoOrHomeClick}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-primary transition-opacity hover:opacity-85"
        >
          <BrandMark />
          FlamTabX
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
            end
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                scrollHomeToTop();
              }
            }}
            className={({ isActive }) =>
              linkClass(isActive && activeSection === "/" && !location.hash)
            }
          >
            Home
          </NavLink>

          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className={cn(
                "flex items-center gap-1 text-sm font-medium outline-none transition-colors",
                blogMenuActive ? "text-primary" : "text-foreground hover:text-primary"
              )}
            >
              Blog
              <ChevronDown className="h-4 w-4 opacity-70" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[12rem]">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/blog">All posts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/blog/flamtabx">Venture story</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/blog/energy-calculator">Calculator research</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/blog/pdrc-engineering">Formulas & pipeline</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              goToHomeHash("#products");
            }}
            className={linkClass(activeSection === "#products")}
          >
            Products
          </a>
          <a
            href="#closing"
            onClick={(e) => {
              e.preventDefault();
              goToHomeHash("#closing");
            }}
            className={linkClass(activeSection === "#closing")}
          >
            Contact
          </a>
        </nav>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-foreground transition-colors hover:text-primary md:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-border bg-background md:hidden"
          >
            <div className="flex flex-col space-y-4 px-6 py-4">
              <NavLink
                to="/"
                end
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    scrollHomeToTop();
                  }
                  setIsOpen(false);
                }}
                className={({ isActive }) =>
                  linkClass(isActive && activeSection === "/" && !location.hash)
                }
              >
                Home
              </NavLink>

              <div className="space-y-2 border-l-2 border-primary/30 pl-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Blog
                </p>
                <Link
                  to="/blog"
                  onClick={() => setIsOpen(false)}
                  className={linkClass(location.pathname === "/blog")}
                >
                  All posts
                </Link>
                <Link
                  to="/blog/flamtabx"
                  onClick={() => setIsOpen(false)}
                  className={linkClass(location.pathname === "/blog/flamtabx")}
                >
                  Venture story
                </Link>
                <Link
                  to="/blog/energy-calculator"
                  onClick={() => setIsOpen(false)}
                  className={linkClass(location.pathname === "/blog/energy-calculator")}
                >
                  Calculator research
                </Link>
                <Link
                  to="/blog/pdrc-engineering"
                  onClick={() => setIsOpen(false)}
                  className={linkClass(location.pathname === "/blog/pdrc-engineering")}
                >
                  Formulas & pipeline
                </Link>
              </div>

              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  goToHomeHash("#products");
                  setIsOpen(false);
                }}
                className={linkClass(activeSection === "#products")}
              >
                Products
              </a>
              <a
                href="#closing"
                onClick={(e) => {
                  e.preventDefault();
                  goToHomeHash("#closing");
                  setIsOpen(false);
                }}
                className={linkClass(activeSection === "#closing")}
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
