import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ShiftSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="flex min-h-[70vh] items-center py-24">
      <div className="section-container">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 text-3xl font-semibold text-foreground md:text-4xl"
          >
            Comfort and safety have to start at the surface.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-body space-y-6"
          >
            <p>
              Air conditioning fights symptoms after heat is already inside.
              <br />
              Coatings that reflect heat, buffer peaks, and breathe with the
              monsoon address the envelope itself.
            </p>

            <p className="text-lg font-medium text-foreground md:text-xl">
              What if the paint layer did real thermal and moisture work — and
              still supported flame-retardant performance where it matters?
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShiftSection;
