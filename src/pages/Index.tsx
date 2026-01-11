import HeroSection from "@/components/sections/HeroSection";
import QuestionSection from "@/components/sections/QuestionSection";
import ShiftSection from "@/components/sections/ShiftSection";
import ProblemSection from "@/components/sections/ProblemSection";
import IntroSection from "@/components/sections/IntroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import TrustSection from "@/components/sections/TrustSection";
import AudienceSection from "@/components/sections/AudienceSection";
import MissionSection from "@/components/sections/MissionSection";
import ClosingSection from "@/components/sections/ClosingSection";

const Index = () => {
  return (
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
      
      {/* Section 09 - Who It's For */}
      <AudienceSection />
      
      {/* Section 10 - Mission Statement */}
      <MissionSection />
      
      {/* Section 11 - Closing */}
      <ClosingSection />
    </main>
  );
};

export default Index;
