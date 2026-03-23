import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog/flamtabx" },
  { name: "Products", path: "#products", isHash: true },
  { name: "Contact", path: "#closing", isHash: true },
] as const;

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Navbar(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("/");

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-primary transition-opacity hover:opacity-85"
        >
          <span className="h-6 w-2 rounded-sm bg-primary" aria-hidden />
          FlamTabX
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.path;
            if ("isHash" in item && item.isHash) {
              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    goToHomeHash(item.path);
                  }}
                  className={linkClass(isActive)}
                >
                  {item.name}
                </a>
              );
            }
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: na }) => linkClass(na || isActive)}
              >
                {item.name}
              </NavLink>
            );
          })}
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
              {navItems.map((item) => {
                const isActive = activeSection === item.path;
                if ("isHash" in item && item.isHash) {
                  return (
                    <a
                      key={item.name}
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        goToHomeHash(item.path);
                        setIsOpen(false);
                      }}
                      className={linkClass(isActive)}
                    >
                      {item.name}
                    </a>
                  );
                }
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive: na }) => linkClass(na || isActive)}
                  >
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
