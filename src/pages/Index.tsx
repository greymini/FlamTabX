import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/sections/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import QuestionSection from "@/components/sections/QuestionSection";
import ShiftSection from "@/components/sections/ShiftSection";
import ProblemSection from "@/components/sections/ProblemSection";
import IntroSection from "@/components/sections/IntroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import TrustSection from "@/components/sections/TrustSection";
import EnergyCalculatorSection from "@/components/sections/EnergyCalculatorSection";
import AudienceSection from "@/components/sections/AudienceSection";
import MissionSection from "@/components/sections/MissionSection";
import ClosingSection from "@/components/sections/ClosingSection";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "FlamTabX | Climate adaptive, bio based coatings";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Passive, bio based coatings for cooler, drier, healthier buildings: thermal management, moisture control, and engineered surface safety."
    );
    return () => {
      document.title = prevTitle;
      if (meta) meta.setAttribute("content", prevDesc);
    };
  }, []);

  useLayoutEffect(() => {
    if (location.pathname === "/" && !location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    const scroll = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
    requestAnimationFrame(scroll);
    const timeout = window.setTimeout(scroll, 150);
    return () => clearTimeout(timeout);
  }, [location.hash, location.pathname]);

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        {/* Section 01 - Hero */}
        <HeroSection />

        {/* Section 02 - The Question */}
        <QuestionSection />

        {/* Section 03 - Shift in Thinking */}
        <ShiftSection />

        {/* Section 04 - The Problem */}
        <ProblemSection />

        {/* Section 05 - Introducing FlamTabX */}
        <IntroSection />

        {/* Section 06 - How It Works */}
        <HowItWorksSection />

        {/* Section 07 - Why It's Different */}
        <ComparisonSection />

        {/* Section 08 - Trust & Research */}
        <TrustSection />

        {/* Section 08b - Energy savings calculator (featured) */}
        <EnergyCalculatorSection />

        {/* Section 09 - Who It's For */}
        <AudienceSection />

        {/* Section 10 - Mission Statement */}
        <MissionSection />

        {/* Section 11 - Closing */}
        <ClosingSection />
      </main>
    </>
  );
};

export default Index;
