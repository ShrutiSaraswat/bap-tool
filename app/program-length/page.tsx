import { CncFooter } from "@/components/Footer";
import { InfoBapFeaturesSection } from "@/components/InfoFeatues";
import { InfoBapHero } from "@/components/InfoHero";
import { CncHeader } from "@/components/NewNavbar";
import { PlarSection } from "@/components/Plar";
import { ScrollToTopButton } from "@/components/ScrollToTop";
import { TimeComparisonStrip } from "@/components/TimeComparisionStrip";
import { CompletionTimelineSection } from "@/components/Timeline";
import React from "react";

const Page = () => {
  return (
    <div>
      <CncHeader />
      <ScrollToTopButton />
      <InfoBapHero />
      {/* <InfoBapFeaturesSection /> */}
      <TimeComparisonStrip />
      <CompletionTimelineSection />
      {/* <PlarSection /> */}
      <CncFooter />
    </div>
  );
};

export default Page;
