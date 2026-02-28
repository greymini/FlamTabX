import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Zap,
  Leaf,
  TrendingUp,
  Shield,
  Droplets,
  X,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";

// Type definitions
interface SectionProps {
  children: React.ReactNode;
  isDark?: boolean;
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

// Reusable animation wrapper
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Hero Section
const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-20 bg-gradient-to-b from-[hsl(30,10%,97%)] to-[hsl(35,15%,94%)]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-4 py-2 rounded-full text-xs font-medium bg-[hsl(20,70%,45%)] text-[hsl(30,10%,97%)]">
              Climate Tech
            </span>
            <span className="px-4 py-2 rounded-full text-xs font-medium bg-[hsl(20,70%,45%)] text-[hsl(30,10%,97%)]">
              Sustainability
            </span>
            <span className="px-4 py-2 rounded-full text-xs font-medium bg-[hsl(20,70%,45%)] text-[hsl(30,10%,97%)]">
              Passive Cooling
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-[hsl(220,15%,15%)]">
            FlamTabX
          </h1>

          <p className="text-2xl md:text-3xl font-light text-[hsl(220,10%,45%)] mb-6 leading-relaxed">
            Climate Adaptive Bio-Based Cooling Coating
          </p>

          <p className="text-lg md:text-xl text-[hsl(220,8%,60%)] max-w-3xl mx-auto leading-relaxed">
            A bio-based, climate-adaptive coating system designed to reduce
            indoor heat, manage moisture, and prevent microbial growth without
            increasing energy consumption.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Problem Section
const ProblemSection: React.FC = () => {
  const problems = [
    "Extreme heat reaches 45–50°C in vulnerable regions",
    "Indoor heat retention without active cooling solutions",
    "Only ~8% of households have access to air conditioning",
    "Heat-related productivity loss impacts economic output",
    "Fragmented cooling solutions lack scalability",
  ];

  return (
    <section className="py-20 bg-[hsl(220,15%,12%)] text-[hsl(30,20%,92%)]">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            The Problem
          </h2>
        </AnimatedSection>

        <div className="space-y-6 mb-16">
          {problems.map((problem, index) => (
            <AnimatedSection key={index} delay={0.1 * (index + 1)}>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-[hsl(20,70%,45%)] flex-shrink-0 mt-2" />
                <p className="text-lg md:text-xl leading-relaxed">{problem}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="border-t border-[hsl(220,12%,25%)] my-16" />

        <AnimatedSection delay={0.7}>
          <div className="text-center">
            <p className="text-xl md:text-2xl font-light mb-2">
              The real gap isn't the need for cooling.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-[hsl(25,70%,50%)]">
              It's passive, sustainable, adaptive thermal solutions.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Solution Section
const SolutionSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Phase Change Materials",
      description:
        "Absorbs and releases heat intelligently with temperature fluctuations",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Reflective + UV Protection",
      description:
        "Reflects incoming solar radiation while maintaining structural integrity",
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Breathable Bio-Based Matrix",
      description:
        "Allows moisture vapor transmission while preventing water ingress",
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Antimicrobial Protection",
      description:
        "Naturally inhibits microbial growth without chemical additives",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Climate Adaptive Behavior",
      description: "Performance optimized for diverse environmental conditions",
    },
  ];

  return (
    <section className="py-20 bg-[hsl(30,10%,97%)]">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-[hsl(220,15%,15%)]">
            The Solution
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={0.1 * (index + 1)}>
              <div className="p-8 rounded-lg bg-white border border-[hsl(30,10%,85%)] hover:border-[hsl(20,70%,45%)] transition-colors duration-300">
                <div className="w-12 h-12 rounded-lg bg-[hsl(20,70%,45%)] text-white flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[hsl(220,15%,15%)]">
                  {feature.title}
                </h3>
                <p className="text-[hsl(220,8%,60%)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// Gallery Section
const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const galleryImages: GalleryImage[] = [
    {
      id: "1",
      src: "/src/assets/prototype-notes.png",
      alt: "Prototype testing notes and sample documentation",
      title: "Testing Notes & Documentation",
      description:
        "Lab notes documenting composition (PCM, bio-based matrix) and thermal performance metrics from initial testing phases.",
    },
    {
      id: "2",
      src: "/src/assets/applications.png",
      alt: "Application trials on industrial metal sheets",
      title: "Metal Sheet Applications",
      description:
        "Industrial metal sheet coating trials (Application 2 & 3) demonstrating adhesion, reflectivity, and durability on steel substrates.",
    },
    {
      id: "3",
      src: "/src/assets/industrial-testing.png",
      alt: "Industrial testing with temperature sensors",
      title: "Thermal Performance Testing",
      description:
        "Real-world industrial testing setup with thermocouples measuring temperature reduction and phase change material response under intense solar conditions.",
    },
  ];

  return (
    <section className="py-20 bg-[hsl(220,15%,12%)] text-[hsl(30,20%,92%)]">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Prototype in Action
          </h2>
          <p className="text-center text-[hsl(220,8%,70%)] text-lg mb-16">
            Real-world testing and validation of FlamTabX coating system
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {galleryImages.map((image, index) => (
            <AnimatedSection key={image.id} delay={0.1 * (index + 1)}>
              <button
                onClick={() => setSelectedImage(image)}
                className="group relative overflow-hidden rounded-lg aspect-video bg-[hsl(220,12%,18%)] border border-[hsl(220,12%,25%)] hover:border-[hsl(25,70%,50%)] transition-all duration-300 cursor-pointer"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23333' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {image.title}
                    </h3>
                    <p className="text-sm text-white/80">{image.description}</p>
                  </div>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4}>
          <div className="p-8 rounded-lg bg-[hsl(220,12%,18%)] border border-[hsl(220,12%,25%)]">
            <h3 className="text-2xl font-bold mb-4 text-[hsl(25,70%,50%)]">
              Testing Methodology
            </h3>
            <div className="space-y-3 text-[hsl(220,8%,70%)]">
              <p>
                <span className="font-semibold text-white">
                  Industrial Substrate Testing:
                </span>{" "}
                Applied to various metal sheets and concrete panels under
                controlled laboratory and outdoor conditions.
              </p>
              <p>
                <span className="font-semibold text-white">
                  Thermal Monitoring:
                </span>{" "}
                Temperature sensors track surface and subsurface thermal
                behavior, documenting heat absorption and phase change cycles.
              </p>
              <p>
                <span className="font-semibold text-white">
                  Durability Assessment:
                </span>{" "}
                Adhesion tests, UV exposure, thermal cycling, and moisture
                resistance validate long-term performance.
              </p>
              <p>
                <span className="font-semibold text-white">
                  Partner Validation:
                </span>{" "}
                Two industrial partners conducting independent verification with
                Letters of Intent for pilot deployment.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Modal for full-size image view */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-[hsl(220,15%,12%)] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-[hsl(220,12%,18%)] hover:bg-[hsl(25,70%,50%)] transition-colors duration-300 text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23333' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="p-6 bg-[hsl(220,12%,18%)] border-t border-[hsl(220,12%,25%)]">
              <h3 className="text-2xl font-bold mb-2 text-[hsl(25,70%,50%)]">
                {selectedImage.title}
              </h3>
              <p className="text-[hsl(220,8%,70%)] text-lg leading-relaxed">
                {selectedImage.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

// Prototype & Validation Section
const PrototypeSection: React.FC = () => {
  const validations = [
    "Industrial metal sheet testing under extreme conditions",
    "Concrete panel comparison with standard coatings",
    "Adhesion & durability testing across climate zones",
    "Two Letters of Intent secured from industrial partners",
  ];

  return (
    <section className="py-20 bg-[hsl(220,15%,12%)] text-[hsl(30,20%,92%)]">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            Prototype & Validation
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {validations.map((validation, index) => (
            <AnimatedSection key={index} delay={0.1 * (index + 1)}>
              <div className="p-8 rounded-lg bg-[hsl(220,12%,18%)] border border-[hsl(220,12%,25%)]">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[hsl(25,70%,50%)] flex-shrink-0 mt-1" />
                  <p className="text-lg leading-relaxed">{validation}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5}>
          <div className="text-center p-8 rounded-lg bg-gradient-to-r from-[hsl(20,70%,45%)] to-[hsl(25,70%,50%)]">
            <p className="text-xl font-semibold">
              Ready for pilot deployment and commercial scaling
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Environmental Impact Section
const ImpactSection: React.FC = () => {
  const impacts = [
    {
      metric: "500–1,000 kWh",
      description: "Annual energy savings per building",
    },
    {
      metric: "0.4–0.8 tons CO₂",
      description: "Annual CO₂ reduction per building",
    },
    {
      metric: "5–10 GWh",
      description: "Total energy saved across 10,000 buildings",
    },
  ];

  return (
    <section className="py-20 bg-[hsl(30,10%,97%)]">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-[hsl(220,15%,15%)]">
            Environmental Impact
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {impacts.map((impact, index) => (
            <AnimatedSection key={index} delay={0.15 * (index + 1)}>
              <div className="p-8 rounded-lg bg-gradient-to-br from-[hsl(25,70%,50%)] to-[hsl(20,70%,45%)] text-white text-center">
                <p className="text-4xl md:text-5xl font-bold mb-4">
                  {impact.metric}
                </p>
                <p className="text-lg leading-relaxed opacity-95">
                  {impact.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5}>
          <div className="p-12 rounded-lg bg-white border border-[hsl(30,10%,85%)]">
            <h3 className="text-2xl font-bold mb-6 text-[hsl(220,15%,15%)]">
              Scaling Impact
            </h3>
            <p className="text-lg text-[hsl(220,8%,60%)] leading-relaxed mb-4">
              Deploying FlamTabX across 10,000 buildings globally would prevent
              approximately{" "}
              <span className="font-semibold text-[hsl(20,70%,45%)]">
                5–10 GWh of energy consumption
              </span>{" "}
              annually while reducing carbon emissions by thousands of tons.
            </p>
            <p className="text-lg text-[hsl(220,8%,60%)] leading-relaxed">
              This is equivalent to the annual energy consumption of thousands
              of households, demonstrating meaningful climate impact at scale.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Business Model Section
const BusinessModelSection: React.FC = () => {
  const models = [
    {
      title: "Per Square Foot Pricing",
      description: "Transparent, scalable pricing based on coverage area",
    },
    {
      title: "Contractor Partnerships",
      description:
        "Direct partnerships with application specialists and contractors",
    },
    {
      title: "Industrial Bulk Supply",
      description:
        "Supply agreements with manufacturers and large-scale projects",
    },
    {
      title: "Recoating Cycles",
      description: "Recurring revenue from maintenance and recoating services",
    },
  ];

  return (
    <section className="py-20 bg-[hsl(220,15%,12%)] text-[hsl(30,20%,92%)]">
      <div className="max-w-5xl mx-auto px-6">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            Business Model
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {models.map((model, index) => (
            <AnimatedSection key={index} delay={0.1 * (index + 1)}>
              <div className="p-8 rounded-lg border border-[hsl(220,12%,25%)] hover:bg-[hsl(220,12%,20%)] transition-colors duration-300">
                <h3 className="text-xl font-semibold mb-3 text-[hsl(25,70%,50%)]">
                  {model.title}
                </h3>
                <p className="text-[hsl(220,8%,70%)] leading-relaxed">
                  {model.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// Vision & CTA Section
const VisionSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[hsl(20,70%,45%)] to-[hsl(25,70%,50%)] text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <AnimatedSection>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Making thermally comfortable living a basic standard.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
            FlamTabX represents a fundamental shift in how we approach passive
            thermal management—combining climate science, sustainable materials,
            and scalable economics.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <button className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white text-[hsl(20,70%,45%)] font-semibold hover:bg-[hsl(30,10%,97%)] transition-colors duration-300 group">
            Request Pilot Collaboration
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Main Component
const FlamTabXBlog: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <GallerySection />
        <PrototypeSection />
        <ImpactSection />
        <BusinessModelSection />
        <VisionSection />
      </main>
    </>
  );
};

export default FlamTabXBlog;
