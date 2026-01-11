import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import workshopImage from "@/assets/workshop-environment.jpg";

const useCases = [
  "Workshops & MSMEs",
  "Warehouses",
  "Low-rise buildings",
  "Fire-prone regions",
  "Retrofitted structures",
  "Industrial storage",
];

const AudienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24">
      <div className="section-container">
        <div className="max-w-5xl mx-auto">
          {/* Workshop image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16 rounded-lg overflow-hidden"
          >
            <img
              src={workshopImage}
              alt="Small industrial workshop with wooden structures"
              className="w-full h-64 md:h-80 object-cover"
            />
          </motion.div>

          {/* Use cases grid */}
          <div className="usecase-grid mb-12">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="usecase-item"
              >
                <span className="usecase-text">{useCase}</span>
              </motion.div>
            ))}
          </div>

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center text-lg text-muted-foreground italic"
          >
            Designed for places that can't wait for help to arrive.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
