// components/ByJobSection.tsx
"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  CircleDollarSign,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

type Program = {
  id: string;
  name: string;
  credentialType?: string;
  overview?: string;
  timeCommitment?: {
    label?: string;
    approxMonths?: number;
  };
  stackability?: {
    isStackable?: boolean;
    stackMessage?: string;
  };
  earningBand?: string;
  opportunityBand?: string;
};

type Job = {
  id: string;
  title: string;
  noc2021?: string;
  medianHourlyWage?: number | null;
  medianAnnualSalary?: number | null;
  wageBand?: string;
  projectedOpeningsBC?: number | null;
  opportunityLevel?: string;
  region?: string;
  description?: string;
  linkedProgramIds?: string[];
};

const earningBandLabels: Record<string, string> = {
  entry: "Entry (around $18-22/hr)",
  entry_to_medium: "Entry to medium ($20-26/hr)",
  medium: "Medium (around $24-30/hr)",
  medium_high: "Medium to high ($28-35+/hr)",
};

const opportunityLabels: Record<string, string> = {
  medium: "Some opportunities in the region",
  medium_high: "Good opportunities in the region",
  high: "Strong opportunities in the region",
  very_high: "Very strong and stable demand",
  broad: "Broad opportunities across sectors",
  emerging: "Emerging or growing area",
};

// Motion variants (gentle and consistent)
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function ByJobSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  useEffect(() => {
    fetch("/jobs.json")
      .then((res) => res.json())
      .then((data: Job[]) => setJobs(data))
      .catch((err) => console.error("Error loading jobs.json", err));

    fetch("/programs.json")
      .then((res) => res.json())
      .then((data: Program[]) => setPrograms(data))
      .catch((err) => console.error("Error loading programs.json", err));
  }, []);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;
  const linkedPrograms =
    selectedJob?.linkedProgramIds
      ?.map((pid) => programs.find((p) => p.id === pid))
      .filter(Boolean) ?? [];

  return (
    <section
      id="jobs"
      className="relative overflow-hidden bg-gradient-to-br from-[#f9fafb] via-white to-[#eff6ff] border-b border-slate-200 py-10 sm:py-12"
    >
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-8 h-52 w-52 rounded-full bg-[#005f63]/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-60 w-60 rounded-full bg-[#d71920]/10 blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Heading and selector */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          variants={fadeUp}
        >
          <div className="space-y-2 max-w-3xl">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-[#005f63] flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-[#005f63]" />
              Search by job title
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Start with the job you have in mind.
            </h2>
            <p className="text-base text-slate-800">
              Choose a job title you are interested in. You will see typical
              wages, the number of openings in British Columbia, and which CNC
              business programs can lead you there. This makes it easier to
              compare shorter, stackable credentials with longer 2 or 4 year
              paths.
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[260px]">
            <label
              htmlFor="job-select"
              className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700"
            >
              Job title
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select
                id="job-select"
                className="block w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63]"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
              >
                <option value="">Select a job title…</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-base text-slate-700">
              Titles are based on NOC 2021 job groupings used in labour market
              data.
            </p>
          </div>
        </motion.div>

        {/* Empty state when no job selected */}
        {!selectedJob && (
          <motion.div
            className="border border-dashed border-slate-300 bg-white px-5 py-6 text-base text-slate-800 rounded-2xl shadow-sm"
            variants={fadeUp}
          >
            Use the dropdown above to pick a job. For each job, this page will
            show:
            <ul className="mt-2 space-y-1">
              <li>
                - Typical median hourly wage and approximate annual salary.
              </li>
              <li>
                - Approximate number of openings in BC based on forecasts.
              </li>
              <li>
                - Short CNC business programs that can be starting points toward
                that role.
              </li>
            </ul>
          </motion.div>
        )}

        {/* Selected job details + programs */}
        {selectedJob && (
          <motion.div
            className="grid gap-6 lg:grid-cols-[3fr,2fr]"
            variants={fadeUp}
          >
            {/* Job details card */}
            <motion.div className="relative" variants={cardVariants}>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-slate-200/60 via-white to-slate-100 opacity-70" />
              <div className="relative border border-slate-200 rounded-2xl bg-white shadow-[0_14px_40px_rgba(15,23,42,0.12)] overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-white to-slate-100 px-5 py-4">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700 flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4 text-slate-800" />
                    Job details
                  </p>
                  <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900">
                    {selectedJob.title}
                  </h3>
                  {selectedJob.noc2021 && (
                    <p className="mt-1 text-base text-slate-700">
                      NOC {selectedJob.noc2021}
                    </p>
                  )}
                </div>

                <div className="px-5 py-4 space-y-4 text-base text-slate-800">
                  {selectedJob.description && (
                    <p className="text-slate-800">{selectedJob.description}</p>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Wage */}
                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                      <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700 mb-2">
                        Typical wages
                      </p>
                      <div className="space-y-1 text-base text-slate-800">
                        {selectedJob.medianHourlyWage && (
                          <p>
                            Median wage: $
                            {selectedJob.medianHourlyWage.toFixed(2)}/hr
                          </p>
                        )}
                        {(() => {
                          const annual =
                            selectedJob.medianAnnualSalary ??
                            (selectedJob.medianHourlyWage
                              ? selectedJob.medianHourlyWage * 40 * 52
                              : null);
                          return (
                            annual && (
                              <p>
                                ≈ ${annual.toLocaleString("en-CA")} per year
                              </p>
                            )
                          );
                        })()}
                        {selectedJob.wageBand && (
                          <p className="text-base text-slate-700">
                            {earningBandLabels[selectedJob.wageBand] ??
                              "Earning potential information available"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Opportunities */}
                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                      <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700 mb-2">
                        Opportunities
                      </p>
                      <div className="space-y-1 text-base text-slate-800">
                        {selectedJob.projectedOpeningsBC != null && (
                          <p>
                            Approx.{" "}
                            {selectedJob.projectedOpeningsBC.toLocaleString(
                              "en-CA"
                            )}{" "}
                            openings in BC (forecast)
                          </p>
                        )}
                        {selectedJob.opportunityLevel && (
                          <p className="text-base text-slate-700">
                            {opportunityLabels[selectedJob.opportunityLevel] ??
                              "Opportunity information available"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedJob.region && (
                    <p className="flex items-center gap-2 text-base text-slate-700">
                      <MapPin className="h-4 w-4 text-slate-800" />
                      Region: {selectedJob.region}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Programs that lead here */}
            <motion.div className="relative" variants={cardVariants}>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#005f63]/12 via-white to-[#d71920]/10 opacity-80" />
              <div className="relative border border-slate-200 rounded-2xl bg-white/95 shadow-[0_14px_40px_rgba(15,23,42,0.15)] overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-white to-slate-100 px-5 py-4">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700">
                    CNC programs connected to this job
                  </p>
                  <p className="mt-2 text-base text-slate-800">
                    These are shorter, stackable CNC business programs that can
                    be used as starting points toward this role. Many can later
                    be stacked into a 1 year certificate or 2 year diploma.
                  </p>
                </div>

                <div className="px-5 py-4 space-y-3 max-h-[360px] overflow-y-auto">
                  {linkedPrograms.length === 0 && (
                    <p className="text-base text-slate-800">
                      Program links for this job will be added as the dataset is
                      completed.
                    </p>
                  )}

                  {linkedPrograms.map((program) => {
                    const p = program as Program;
                    return (
                      <motion.div
                        key={p.id}
                        className="border border-slate-200 rounded-xl px-4 py-3 text-base space-y-2 bg-slate-50/80"
                        variants={cardVariants}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {p.name}
                            </p>
                            {p.credentialType && (
                              <p className="text-base text-slate-700">
                                {p.credentialType}
                              </p>
                            )}
                          </div>
                          {p.timeCommitment?.label && (
                            <p className="text-base text-slate-700">
                              {p.timeCommitment.label}
                            </p>
                          )}
                        </div>

                        {p.stackability?.stackMessage && (
                          <p className="text-base text-slate-800">
                            <span className="font-semibold">
                              Stackable pathway:
                            </span>{" "}
                            {p.stackability.stackMessage}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 pt-1">
                          {p.earningBand && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                              <CircleDollarSign className="h-4 w-4" />
                              <span>
                                {earningBandLabels[p.earningBand] ??
                                  "Earning potential information available"}
                              </span>
                            </span>
                          )}
                          {p.opportunityBand && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-base text-sky-800">
                              <TrendingUp className="h-4 w-4" />
                              <span>
                                {opportunityLabels[p.opportunityBand] ??
                                  "Opportunities in the region"}
                              </span>
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
