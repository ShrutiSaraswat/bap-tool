import { ByEarningsSection } from "@/components/ByEarningSection";
import { ByJobSection } from "@/components/ByJobsSection";
import { ByProgramSection } from "@/components/ByProgramSection";
import { GuidedMatchSection } from "@/components/GuidedMatchSection";
import { CncHeader } from "@/components/Hero";
import { HeroIntro } from "@/components/HeroIntro";

import React from "react";

const page = () => {
  return (
    <div>
      <CncHeader />
      {/* <HomePage /> */}
      <HeroIntro />
      <ByProgramSection />
      <ByJobSection />
      <ByEarningsSection />
      <GuidedMatchSection />
    </div>
  );
};

export default page;
