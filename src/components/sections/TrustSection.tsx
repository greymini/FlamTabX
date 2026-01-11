import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-[80vh] flex items-center py-24 section-cream">
      <div className="section-container">
        <div className="section-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-body"
          >
            <p>
              FlamTabX is being developed through material science research using
              Bio-Waste, an abundant industrial byproduct.
            </p>

            <p>
              Early lab-scale prototypes show heat-responsive behavior and char
              formation.
            </p>

            <p>
              Pilot testing with workshops and small industrial units is underway.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-caption mt-12"
          >
            Built by engineers. Validated step by step.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
