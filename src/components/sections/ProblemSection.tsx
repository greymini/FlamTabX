import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
  "Fires spread faster than ever",
  "Common materials ignite instantly",
  "Structural failure happens in minutes",
  "Retrofitting fire systems is expensive or impossible",
  "Small workshops and buildings are left unprotected",
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
              The real gap isn't firefighting.
            </p>
            <p className="text-xl md:text-2xl font-medium text-[hsl(30,20%,92%)]">
              It's material-level fire resilience.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
