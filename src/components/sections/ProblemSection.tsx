import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
  "Indoor heat regularly exceeds safe comfort bands where AC is scarce",
  "Humidity drives damp walls, mold, and poor air quality in monsoon seasons",
  "Grid-powered cooling is costly, uneven, and adds carbon where grids are dirty",
  "Fragmented paints solve only reflectivity, waterproofing, or biocides, not all three",
  "When fire does reach exposed materials, many substrates still offer little resistance",
];

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-[80vh] flex items-center py-24 section-dark">
      <div className="section-container">
        <div className="section-content">
          <div className="bullet-list mb-16">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                className="bullet-item"
              >
                <span className="bullet-dot" />
                <span>{problem}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="divider-line-dark" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-xl md:text-2xl text-subheadline-dark">
              The real gap isn't one more box product.
            </p>
            <p className="font-display text-xl font-medium text-[hsl(var(--section-dark-foreground))] md:text-2xl">
              It is an affordable, passive envelope layer: thermal, moisture, and
              safer materials together.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
