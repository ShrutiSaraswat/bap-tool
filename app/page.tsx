import { ByEarningsSection } from "@/components/ByEarningSection";
import { ByJobSection } from "@/components/ByJobsSection";
import { ByProgramSection } from "@/components/ByProgramSection";
import { BySkillSection } from "@/components/BySkillSection";
import { GuidedMatchSection } from "@/components/GuidedMatchSection";
import { CncHeader } from "@/components/Hero";
import { HeroIntro } from "@/components/HeroIntro";
import { TimeComparisonStrip } from "@/components/TimeComparisionStrip";

import React from "react";

const page = () => {
  return (
    <div>
      {/* <HomePage /> */}
      <CncHeader />
      <HeroIntro />
      <GuidedMatchSection />
      <TimeComparisonStrip />
      <ByProgramSection />
      <BySkillSection />
      <ByJobSection />
      <ByEarningsSection />
    </div>
  );
};

export default page;
