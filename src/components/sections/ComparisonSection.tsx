import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const existingItems = ["Reactive", "Expensive", "Complex", "Hard to retrofit"];
const flamtabxItems = ["Prevention-first", "Affordable", "Passive", "Designed for real environments"];

const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-[80vh] flex items-center py-24">
      <div className="section-container">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Existing Solutions */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="comparison-column"
            >
              <h3 className="comparison-title text-muted-foreground">
                What exists today
              </h3>
              <div className="space-y-4">
                {existingItems.map((item, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="comparison-item"
                  >
                    {item}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* FlamTabX */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="comparison-column"
            >
              <h3 className="comparison-title text-foreground font-bold">
                FlamTabX
              </h3>
              <div className="space-y-4">
                {flamtabxItems.map((item, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="comparison-item-highlight"
                  >
                    {item}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
