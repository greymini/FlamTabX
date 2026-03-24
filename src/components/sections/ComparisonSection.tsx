import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const existingItems = [
  "Single-function (cool roof OR waterproofing OR biocide)",
  "AC first comfort: high bills and grid load",
  "Insulation retrofits costly for informal housing",
  "Fragmented vendors, unclear combined performance",
];
const flamtabxItems = [
  "One envelope layer: thermal + moisture + safer surface",
  "Passive first: less cooling load before you add machines",
  "Paint-process friendly for retrofit at scale",
  "Built for real heat, humidity, and workshop realities",
];

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
