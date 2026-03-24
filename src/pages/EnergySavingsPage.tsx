import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/sections/Navbar";
import EnergyCalculator from "@/components/energy/EnergyCalculator";

const EnergySavingsPage = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = "FlamTabX | PDRC energy savings calculator";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Estimate annual kWh saved and CO₂ avoided for your roof using NASA POWER GHI, IEA grid factors, and PDRC style physics. Client side, 84 cities."
    );
    return () => {
      document.title = prev;
      if (meta) meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="border-b border-border bg-card/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              to="/blog/flamtabx"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              ← Venture story
            </Link>
            <Link
              to="/blog/energy-calculator"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Methodology
            </Link>
            <Link
              to="/blog/pdrc-engineering"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Formulas & pipeline
            </Link>
            <Link
              to="/blog"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              All posts
            </Link>
          </div>
          <span className="text-muted-foreground">
            84 cities · lookup based · client side
          </span>
        </div>
      </div>
      <EnergyCalculator />
    </>
  );
};

export default EnergySavingsPage;
