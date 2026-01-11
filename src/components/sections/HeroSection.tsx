import { motion } from "framer-motion";
import heroTexture from "@/assets/hero-fire-texture.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroTexture})`,
          filter: 'brightness(0.55) contrast(1.1)'
        }}
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
            className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            Fire doesn't give second chances.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto mb-6 text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
          >
            Wildfires and urban fires are no longer rare.
            <br />
            When fire reaches a structure, failure happens in minutes.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="text-sm italic max-w-xl mx-auto text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          >
            Most materials don't slow fire. They surrender to it.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
