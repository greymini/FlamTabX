import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroTexture from "@/assets/coating-closeup.jpg";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroTexture})`,
          filter: "brightness(0.5) contrast(1.05)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-primary/[0.12] to-background/40" />
      </div>

      <div className="relative z-10 section-container">
        <div className="section-text-center py-20">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
          >
            Climate adaptive surfaces
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 font-display text-4xl font-semibold leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] md:text-5xl lg:text-6xl"
          >
            Climate-Adaptive Coatings that dynamically regulate heat flow in
            buildings, reducing cooling loads without electronics.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
            className="mx-auto mb-6 max-w-2xl text-xl font-light leading-relaxed text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)] md:text-2xl"
          >
            FlamTabX is a bio based, climate adaptive coating that cuts heat
            load, manages moisture, and supports safer, more durable surfaces
            without relying on more grid power.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-xl text-sm italic leading-relaxed text-white/85 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)]"
          >
            From informal housing to MSME workshops, we are building a passive
            layer people can actually afford to apply.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Link
              to="/tools/energy-savings"
              className="inline-flex min-h-[44px] min-w-[10rem] items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/20 transition-opacity hover:opacity-90"
            >
              Try energy calculator
            </Link>
            <Link
              to="/blog/flamtabx"
              className="inline-flex min-h-[44px] min-w-[10rem] items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Read the story
            </Link>
            <a
              href="#closing"
              className="inline-flex min-h-[44px] items-center justify-center px-3 text-sm font-medium text-white/90 underline-offset-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] hover:underline"
            >
              Contact
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
