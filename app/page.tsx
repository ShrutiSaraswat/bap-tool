import { ByCourseSection } from "@/components/ByCourseSection";
import { ByEarningsSection } from "@/components/ByEarningSection";
import { ByJobSection } from "@/components/ByJobsSection";
import { ByProgramSection } from "@/components/ByProgramSection";
import { BySkillSection } from "@/components/BySkillSection";
import { ExploreByCards } from "@/components/ExploreByCards";
import { FeaturesSection } from "@/components/Features";
import { CncFooter } from "@/components/Footer";
import { GuidedMatchSection } from "@/components/GuidedMatchSection";
import { CncHeader } from "@/components/NewNavbar";
import { HeroIntro } from "@/components/HeroIntro";
import { PlarSection } from "@/components/Plar";
import { ScrollToTopButton } from "@/components/ScrollToTop";
import { TimeComparisonStrip } from "@/components/TimeComparisionStrip";
import { CompletionTimelineSection } from "@/components/Timeline";

import React from "react";
import { HomeHero } from "@/components/NewHero";

const page = () => {
  return (
    <div>
      {/* <HomePage /> */}
      <CncHeader />
      <ScrollToTopButton />
      <HomeHero />
      {/* <HeroIntro /> */}
      {/* <FeaturesSection /> */}
      <GuidedMatchSection />
      <ExploreByCards />
      {/* <TimeComparisonStrip /> */}
      {/* <ByProgramSection />
      <ByCourseSection />
      <BySkillSection />
      <ByJobSection />
      <ByEarningsSection /> */}
      {/* <CompletionTimelineSection /> */}
      <PlarSection />
      <CncFooter />
    </div>
  );
};

export default page;
