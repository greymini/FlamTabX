import { motion } from "framer-motion";
import heroTexture from "@/assets/hero-fire-texture.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroTexture})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/70 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container">
        <div className="section-text-center py-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-headline mb-8"
          >
            Fire doesn't give second chances.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-subheadline max-w-2xl mx-auto mb-6"
          >
            Wildfires and urban fires are no longer rare.
            <br />
            When fire reaches a structure, failure happens in minutes.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="text-micro max-w-xl mx-auto"
          >
            Most materials don't slow fire. They surrender to it.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
