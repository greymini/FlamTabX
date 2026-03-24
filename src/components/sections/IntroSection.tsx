import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const IntroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="products"
      className="min-h-[70vh] flex items-center justify-center py-24 scroll-mt-20"
    >
      <div className="section-container">
        <div className="section-text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="brand-name mb-8 font-display"
          >
            FlamTabX
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-subheadline max-w-2xl mx-auto"
          >
            Climate adaptive, bio based coatings for roofs and walls.
            <br />
            Cooler indoors, healthier air, and engineered surface safety.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
