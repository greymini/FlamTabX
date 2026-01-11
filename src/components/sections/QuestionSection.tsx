import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const QuestionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-[60vh] flex items-center justify-center py-24 section-cream">
      <div className="section-container">
        <div className="section-text-center">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-question mb-12"
          >
            Why do we accept that losing everything is normal
            <br className="hidden md:block" /> once a fire starts?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-body max-w-xl mx-auto space-y-4"
          >
            <p>Homes don't fail because they are weak.</p>
            <p>They fail because nothing slows the fire down.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuestionSection;
