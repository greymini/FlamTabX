import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog/flamtabx" },
  { name: "Products", path: "#products", isHash: true },
  { name: "Contact", path: "#closing", isHash: true },
] as const;

const handleHashScroll = (path: string) => {
  if (path.startsWith("#")) {
    const element = document.getElementById(path.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
};

export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("/");

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're on a route page (not homepage)
      if (window.location.pathname !== "/") {
        setActiveSection(window.location.pathname);
        return;
      }

      // For hash-based sections, detect which is in view
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
    // Also listen for navigation events
    window.addEventListener("popstate", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleScroll);
      window.removeEventListener("popstate", handleScroll);
    };
  }, []);

  return (
    <header
      className="w-full border-b sticky top-0 z-50"
      style={{
        backgroundColor: "hsl(30 10% 97%)",
        borderColor: "hsl(30 10% 85%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-bold tracking-tight text-lg transition-colors hover:opacity-80"
          style={{ color: "hsl(20 70% 45%)" }}
        >
          <span className="flex items-center gap-2">
            <div
              className="w-2 h-6 rounded-sm"
              style={{ backgroundColor: "hsl(20 70% 45%)" }}
            />
            FlamTabX
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.path;
            if ("isHash" in item && item.isHash) {
              return (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleHashScroll(item.path);
                  }}
                  className="text-sm font-medium transition-colors"
                  style={{
                    color: isActive ? "hsl(20 70% 45%)" : "hsl(220 15% 15%)",
                  }}
                  onMouseEnter={(e) =>
                    !isActive &&
                    (e.currentTarget.style.color = "hsl(20 70% 45%)")
                  }
                  onMouseLeave={(e) =>
                    !isActive &&
                    (e.currentTarget.style.color = "hsl(220 15% 15%)")
                  }
                >
                  {item.name}
                </a>
              );
            }
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className="text-sm font-medium transition-colors"
                style={{
                  color: isActive ? "hsl(20 70% 45%)" : "hsl(220 15% 15%)",
                }}
                onMouseEnter={(e) =>
                  !isActive && (e.currentTarget.style.color = "hsl(20 70% 45%)")
                }
                onMouseLeave={(e) =>
                  !isActive &&
                  (e.currentTarget.style.color = "hsl(220 15% 15%)")
                }
              >
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden transition-colors"
          aria-label="Toggle Menu"
          style={{ color: "hsl(220 15% 15%)" }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t"
            style={{
              backgroundColor: "hsl(30 10% 97%)",
              borderColor: "hsl(30 10% 85%)",
            }}
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navItems.map((item) => {
                const isActive = activeSection === item.path;
                if ("isHash" in item && item.isHash) {
                  return (
                    <a
                      key={item.name}
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleHashScroll(item.path);
                        setIsOpen(false);
                      }}
                      className="text-sm font-medium transition-colors"
                      style={{
                        color: isActive
                          ? "hsl(20 70% 45%)"
                          : "hsl(220 15% 15%)",
                      }}
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
                    className="text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? "hsl(20 70% 45%)" : "hsl(220 15% 15%)",
                    }}
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
