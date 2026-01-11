import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import coatingImage from "@/assets/coating-closeup.jpg";

const steps = [
  {
    title: "Applied Like a Coating",
    description: "Works on wood, panels, partitions, exposed surfaces.",
  },
  {
    title: "Reacts to Heat",
    description: "Forms a protective barrier when exposed to fire.",
  },
  {
    title: "Buys Time",
    description: "Delays ignition and slows flame spread automatically.",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 section-cream">
      <div className="section-container">
        <div className="max-w-5xl mx-auto">
          {/* Optional coating image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16 rounded-lg overflow-hidden max-w-md mx-auto"
          >
            <img
              src={coatingImage}
              alt="Fire-resistant coating forming protective char layer on wood"
              className="w-full h-auto"
            />
          </motion.div>

          {/* Three Cards */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15, ease: "easeOut" }}
                className="feature-card text-center"
              >
                <div className="text-4xl font-light mb-4 text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="feature-card-title">{step.title}</h3>
                <p className="feature-card-text">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Footer line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center text-lg font-medium text-foreground"
          >
            No power. No sensors. No human intervention.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
