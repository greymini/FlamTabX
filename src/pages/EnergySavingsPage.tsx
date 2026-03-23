import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/sections/Navbar";
import EnergyCalculator from "@/components/energy/EnergyCalculator";

const EnergySavingsPage = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = "FlamTabX — PDRC energy savings calculator";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="border-b border-border bg-card/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm">
          <Link
            to="/blog/flamtabx"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            ← Back to pitch document
          </Link>
          <span className="text-muted-foreground">
            84 cities · lookup-based · client-side
          </span>
        </div>
      </div>
      <EnergyCalculator />
    </>
  );
};

export default EnergySavingsPage;
