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
  jobIds?: string[];
};

type Job = {
  id: string;
  title: string;
  noc2021?: string | null;
  nocTitle?: string;
  shortSummary?: string;
  description?: string;
  typicalJobTitles?: string[];
  typicalEmployers?: string;
  programIds?: string[];
  medianHourlyWage?: number | null;
  medianAnnualSalary?: number | null;
  wageBand?: string | null;
  projectedOpeningsBC?: number | null;
  opportunityLevel?: string | null;
  region?: string;
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

// Motion variants
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
    selectedJob == null
      ? []
      : programs.filter((p) => {
          const fromJob = selectedJob.programIds?.includes(p.id) ?? false;
          const fromProgram = p.jobIds?.includes(selectedJob.id) ?? false;
          return fromJob || fromProgram;
        });

  return (
    <section
      id="jobs"
      className="relative overflow-hidden bg-gradient-to-br from-[#fff1f2] via-[#ffe4e6] to-[#fffbeb] border-b border-slate-200 py-10 sm:py-12"
    >
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* warm blobs + diagonal highlight to match skills section theme */}
        <div className="absolute -left-24 top-6 h-56 w-56 rounded-full bg-[#fb7185]/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#f97316]/40 blur-3xl" />
        <div className="absolute -inset-x-32 top-16 h-40 rotate-[-3deg] bg-gradient-to-r from-white/60 via-[#fff7ed]/80 to-white/60" />
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
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-[#b91c1c] flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-[#b91c1c]" />
              Search by job title
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Start with the job you have in mind.
            </h2>
            <p className="text-base text-slate-800">
              Choose a job title you are interested in. You will see typical
              wages, the number of openings in British Columbia, and which CNC
              business programs can help you move toward that role.
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
                className="block w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] cursor-pointer"
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

        {/* Empty state */}
        {!selectedJob && (
          <motion.div
            className="border border-dashed border-slate-300 bg-white/90 px-5 py-6 text-base text-slate-800 rounded-2xl shadow-sm"
            variants={fadeUp}
          >
            Use the dropdown above to pick a job. For each job, this page shows:
            <ul className="mt-2 space-y-1">
              <li>- Typical median wage and earning band (where available).</li>
              <li>- Approximate number of openings in BC (where available).</li>
              <li>
                - Short CNC business programs that can be good starting points
                toward that role.
              </li>
            </ul>
          </motion.div>
        )}

        {/* Selected job details + programs */}
        {selectedJob && (
          <motion.div
            key={selectedJobId}
            className="grid gap-6 lg:grid-cols-[3fr,2fr]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Job details card */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#fed7aa]/60 via-white to-[#fee2e2] opacity-80" />
              <div className="relative border border-slate-200 rounded-2xl bg-white shadow-[0_14px_40px_rgba(120,53,15,0.2)] overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-[#fff7ed] via-white to-[#fee2e2] px-5 py-4">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-800 flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4 text-[#b91c1c]" />
                    Job details
                  </p>
                  <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900">
                    {selectedJob.title}
                  </h3>
                  {selectedJob.noc2021 && (
                    <p className="mt-1 text-base text-slate-700">
                      NOC {selectedJob.noc2021}
                      {selectedJob.nocTitle ? ` · ${selectedJob.nocTitle}` : ""}
                    </p>
                  )}
                </div>

                <div className="px-5 py-4 space-y-4 text-base text-slate-800">
                  {(selectedJob.description || selectedJob.shortSummary) && (
                    <p className="text-slate-800">
                      {selectedJob.description ?? selectedJob.shortSummary}
                    </p>
                  )}

                  {selectedJob.typicalEmployers && (
                    <p className="text-slate-700">
                      <span className="font-semibold">Typical employers: </span>
                      {selectedJob.typicalEmployers}
                    </p>
                  )}

                  {selectedJob.typicalJobTitles &&
                    selectedJob.typicalJobTitles.length > 0 && (
                      <p className="text-slate-700">
                        <span className="font-semibold">
                          Example job titles:
                        </span>{" "}
                        {selectedJob.typicalJobTitles.join(", ")}
                      </p>
                    )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Wage panel */}
                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-[#fff7ed]">
                      <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700 mb-2">
                        Typical wages
                      </p>
                      <div className="space-y-1 text-base text-slate-800">
                        {selectedJob.medianHourlyWage != null && (
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
                            annual != null && (
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
                        {!selectedJob.medianHourlyWage &&
                          !selectedJob.medianAnnualSalary &&
                          !selectedJob.wageBand && (
                            <p className="text-base text-slate-700">
                              Detailed wage data for this job will be added as
                              more labour market information is available.
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Opportunities panel */}
                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-[#fff7ed]">
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
                        {selectedJob.projectedOpeningsBC == null &&
                          !selectedJob.opportunityLevel && (
                            <p className="text-base text-slate-700">
                              Detailed outlook information for this job will be
                              added as more data is available.
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
            </div>

            {/* Programs that lead here */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#fed7aa]/50 via-white to-[#fecaca]/50 opacity-80" />
              <div className="relative border border-slate-200 rounded-2xl bg-white/95 shadow-[0_14px_40px_rgba(120,53,15,0.2)] overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-[#fff7ed] via-white to-[#fee2e2] px-5 py-4">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-800">
                    CNC programs connected to this job
                  </p>
                  <p className="mt-2 text-base text-slate-800">
                    These are shorter CNC business programs that can be useful
                    starting points toward this role. Many can later be stacked
                    into a 1 year certificate or 2 year diploma.
                  </p>
                </div>

                <div className="px-5 py-4 space-y-3 max-h-[360px] overflow-y-auto">
                  {linkedPrograms.length === 0 && (
                    <p className="text-base text-slate-800">
                      Program connections for this job are still being added.
                    </p>
                  )}

                  {linkedPrograms.map((p) => (
                    <motion.div
                      key={p.id}
                      className="border border-slate-200 rounded-xl px-4 py-3 text-base space-y-2 bg-[#fff7ed]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
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
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
