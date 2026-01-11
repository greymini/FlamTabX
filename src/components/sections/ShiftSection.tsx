import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ShiftSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-[70vh] flex items-center py-24">
      <div className="section-container">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-semibold mb-8 text-foreground"
          >
            Firefighting starts too late.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-body space-y-6"
          >
            <p>
              Most fire safety systems react after ignition.
              <br />
              But modern fires spread faster than response systems can act.
            </p>

            <p className="text-lg md:text-xl font-medium text-foreground">
              What if materials themselves could resist fire?
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShiftSection;
