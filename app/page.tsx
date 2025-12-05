import { ByJobSection } from "@/components/ByJobsSection";
import { ByProgramSection } from "@/components/ByProgramSection";
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

      {/* Search by job title section */}
      <ByJobSection />

      <section
        id="earnings"
        className="bg-white border-b border-slate-200 py-8 sm:py-10"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Compare by earning potential
          </h2>
          <p className="mt-1 text-sm text-slate-700 max-w-2xl">
            Upcoming section where users can filter programs and jobs by wage
            band and opportunity level.
          </p>
        </div>
      </section>

      <section id="guided-match" className="bg-slate-50 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Guided match (coming next)
          </h2>
          <p className="mt-1 text-sm text-slate-700 max-w-2xl">
            Here we will add a short form where users describe themselves in
            their own words, and the system suggests starting programs from the
            BAP list using static rules.
          </p>
        </div>
      </section>
    </div>
  );
};

export default page;
