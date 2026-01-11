import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Linkedin } from "lucide-react";

const ClosingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="min-h-[70vh] flex items-center justify-center py-24">
      <div className="section-container">
        <div className="section-text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-medium mb-4 text-foreground"
          >
            When fire strikes, minutes matter.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-16"
          >
            FlamTabX is designed to give them back.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="divider-line" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-caption"
          >
            Currently in pilot development.
          </motion.p>

          {/* Footer Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-16 space-y-4 text-base md:text-lg text-foreground"
          >
            <p className="font-semibold text-lg md:text-xl">
              ©️ 2026 FlamTabX
            </p>
            <p className="font-medium">
              A Bio-based flame-retardant coating project
            </p>
            <p className="text-sm md:text-base">
              Founded by Aditya Ratnaparkhi | Chemical Engineer (ICT Mumbai) | beVisioneers Fellow '25
            </p>
            <p className="text-sm md:text-base italic">
              Early-stage venture in development
            </p>
            
            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex items-center justify-center gap-6 mt-6"
            >
              <a
                href="mailto:adityaxratnaparkhi@gmail.com?subject=Inquiry%20about%20FlamTabX"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                aria-label="Send email to Aditya Ratnaparkhi"
              >
                <Mail className="w-6 h-6 md:w-7 md:h-7" />
              </a>
              <a
                href="https://www.linkedin.com/in/aditya-ratnaparkhi-022345208/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                aria-label="Visit Aditya Ratnaparkhi's LinkedIn profile"
              >
                <Linkedin className="w-6 h-6 md:w-7 md:h-7" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;
