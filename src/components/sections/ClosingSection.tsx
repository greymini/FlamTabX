import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ClosingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-[70vh] flex items-center justify-center py-24">
      <div className="section-container">
        <div className="section-text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-medium mb-4 text-foreground"
          >
            When fire strikes, minutes matter.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-16"
          >
            FlamTabX is designed to give them back.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="divider-line" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-caption"
          >
            Currently in pilot development.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;
