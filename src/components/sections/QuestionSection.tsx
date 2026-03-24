import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const QuestionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="section-cream flex min-h-[60vh] items-center justify-center py-24"
    >
      <div className="section-container">
        <div className="section-text-center">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-question mb-12"
          >
            Why should families and workers accept indoor heat, damp walls,
            <br className="hidden md:block" />
            and grid-dependent cooling as the only options?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-body mx-auto max-w-xl space-y-4"
          >
            <p>Most buildings still behave like heat sponges.</p>
            <p>
              The gap is not a lack of care. It is a lack of affordable,
              passive material systems that work together.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuestionSection;
