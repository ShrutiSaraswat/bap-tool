import { ByEarningsSection } from "@/components/ByEarningSection";
import { ByJobSection } from "@/components/ByJobsSection";
import { ByProgramSection } from "@/components/ByProgramSection";
import { BySkillSection } from "@/components/BySkillSection";
import { FeaturesSection } from "@/components/Features";
import { CncFooter } from "@/components/Footer";
import { GuidedMatchSection } from "@/components/GuidedMatchSection";
import { CncHeader } from "@/components/Hero";
import { HeroIntro } from "@/components/HeroIntro";
import { ScrollToTopButton } from "@/components/ScrollToTop";
import { TimeComparisonStrip } from "@/components/TimeComparisionStrip";

import React from "react";

const page = () => {
  return (
    <div>
      {/* <HomePage /> */}
      <CncHeader />
      <ScrollToTopButton />
      <HeroIntro />
      {/* <FeaturesSection /> */}
      <GuidedMatchSection />
      {/* <TimeComparisonStrip /> */}
      <ByProgramSection />
      <BySkillSection />
      <ByJobSection />
      <ByEarningsSection />
      <CncFooter />
    </div>
  );
};

export default page;
