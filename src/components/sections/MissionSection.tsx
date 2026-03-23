import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const MissionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-[60vh] flex items-center justify-center py-24 section-dark">
      <div className="section-container">
        <div className="section-text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-2xl font-medium leading-relaxed text-[hsl(var(--section-dark-foreground))] mb-8 md:text-3xl lg:text-4xl"
          >
            Thermal comfort and surface safety should not be bolted on later.
            <br />
            They should be designed into the coating system.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-body-dark max-w-2xl mx-auto"
          >
            FlamTabX exists to cut heat and moisture risk at the envelope,
            <br className="hidden md:block" />
            and to make everyday structures more livable and resilient.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
