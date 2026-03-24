import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const EnergyCalculator = lazy(() => import("@/components/energy/EnergyCalculator"));

const EnergyCalculatorSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="calculator"
      className="scroll-mt-20 border-t border-border bg-gradient-to-b from-secondary/20 to-background py-20 md:py-28"
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Interactive tool
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            PDRC energy savings calculator
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Pick a city, roof area, and building type to see estimated annual kWh
            saved, CO₂ avoided, and cost proxies. Results use precalculated lookups
            from solar and grid data, entirely in your browser.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link
              to="/blog/energy-calculator"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              How we built this (methodology)
            </Link>
            {" · "}
            <Link
              to="/blog/pdrc-engineering"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Formulas and pipeline
            </Link>
            {" · "}
            <Link
              to="/tools/energy-savings"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Open full page
            </Link>
          </p>
        </motion.div>

        <Suspense
          fallback={
            <div className="mx-auto flex min-h-[200px] max-w-4xl items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
              Loading calculator…
            </div>
          }
        >
          <div className="mx-auto max-w-[1100px] rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">
            <EnergyCalculator embedded />
          </div>
        </Suspense>
      </div>
    </section>
  );
};

export default EnergyCalculatorSection;
