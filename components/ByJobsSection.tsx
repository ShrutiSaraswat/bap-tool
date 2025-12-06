// components/ByJobSection.tsx
"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  CircleDollarSign,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

import programsData from "./programs.json";
import jobsData from "./jobs.json";
import programBandsData from "./programsBand.json";

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
};

type ProgramBand = {
  programId: string;
  earningBandId?: string;
  opportunityBandId?: string;
};

type Job = {
  id: string;
  title: string;
  noc2021?: string;
  description?: string; // long text (old)
  shortSummary?: string; // short text (new)
  medianHourlyWage?: number | null;
  medianAnnualSalary?: number | null;
  // bands - support both old + new names
  wageBand?: string;
  earningBandId?: string;
  opportunityLevel?: string;
  opportunityBandId?: string;
  projectedOpeningsBC?: number | null;
  region?: string;
  regionNotes?: string;
  linkedProgramIds?: string[];
  typicalJobTitles?: string[];
  typicalEmployers?: string;
};

const PROGRAMS: Program[] = programsData as Program[];
const JOBS: Job[] = jobsData as Job[];
const PROGRAM_BANDS: ProgramBand[] = programBandsData as ProgramBand[];

// Map to IDs used in programsBand.json / bands.json
const earningBandLabels: Record<string, string> = {
  "earning-entry": "Entry (around $18-22/hr)",
  "earning-moderate": "Entry to medium ($20-26/hr)",
  "earning-good": "Medium (around $24-30/hr)",
  "earning-strong": "Medium to high ($28-35+/hr)",
};

const opportunityLabels: Record<string, string> = {
  "opportunity-limited": "Some opportunities in the region",
  "opportunity-steady": "Good opportunities in the region",
  "opportunity-good": "Strong opportunities in the region",
  "opportunity-strong": "Very strong and stable demand",
};

// Motion variants (for top area / empty state)
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

function getProgramBand(programId: string) {
  return PROGRAM_BANDS.find((pb) => pb.programId === programId);
}

// Helper to get a single band key, supporting both old + new fields
function getJobEarningBandKey(job: Job): string | undefined {
  return job.earningBandId ?? job.wageBand ?? undefined;
}
function getJobOpportunityBandKey(job: Job): string | undefined {
  return job.opportunityBandId ?? job.opportunityLevel ?? undefined;
}

export function ByJobSection() {
  const [selectedJobId, setSelectedJobId] = useState("");

  const jobs = JOBS;
  const programs = PROGRAMS;

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  const linkedPrograms =
    selectedJob?.linkedProgramIds
      ?.map((pid) => programs.find((p) => p.id === pid))
      .filter((p): p is Program => Boolean(p)) ?? [];

  // Precompute job level band labels so they always show something
  const jobEarningBandKey = selectedJob
    ? getJobEarningBandKey(selectedJob)
    : undefined;
  const jobOpportunityBandKey = selectedJob
    ? getJobOpportunityBandKey(selectedJob)
    : undefined;

  const jobEarningLabel =
    jobEarningBandKey && earningBandLabels[jobEarningBandKey];
  const jobOpportunityLabel =
    jobOpportunityBandKey && opportunityLabels[jobOpportunityBandKey];

  // Wage numbers (if present)
  const medianHourly =
    selectedJob && typeof selectedJob.medianHourlyWage === "number"
      ? selectedJob.medianHourlyWage
      : null;

  const annual =
    selectedJob && typeof selectedJob.medianAnnualSalary === "number"
      ? selectedJob.medianAnnualSalary
      : medianHourly
      ? medianHourly * 40 * 52
      : null;

  return (
    <section
      id="jobs"
      className="relative overflow-hidden bg-gradient-to-br from-[#f9fafb] via-white to-[#eff6ff] border-b border-slate-200 py-10 sm:py-12"
    >
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
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
              business programs can help you move toward that role. This makes
              it easier to compare shorter, stackable credentials with longer 2
              or 4 year paths.
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
                className="block w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63] cursor-pointer"
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
            Use the dropdown above to pick a job. For each job, this page shows:
            <ul className="mt-2 space-y-1">
              <li>
                - Typical median hourly wage and approximate annual salary.
              </li>
              <li>
                - Approximate number of openings in BC based on forecasts.
              </li>
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
                  {(selectedJob.shortSummary || selectedJob.description) && (
                    <p className="text-slate-800">
                      {selectedJob.shortSummary || selectedJob.description}
                    </p>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Wage card */}
                    <div className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
                      <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700 mb-2">
                        Typical wages
                      </p>
                      <div className="space-y-1 text-base text-slate-800">
                        {medianHourly && (
                          <p>Median wage: ${medianHourly.toFixed(2)}/hr</p>
                        )}
                        {annual && (
                          <p>≈ ${annual.toLocaleString("en-CA")} per year</p>
                        )}
                        {jobEarningLabel && (
                          <p className="text-base text-slate-700">
                            {jobEarningLabel}
                          </p>
                        )}
                        {!medianHourly && !annual && !jobEarningLabel && (
                          <p className="text-base text-slate-700">
                            Wage information is available in the labour market
                            notes.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Opportunities card */}
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
                        {jobOpportunityLabel && (
                          <p className="text-base text-slate-700">
                            {jobOpportunityLabel}
                          </p>
                        )}
                        {selectedJob.projectedOpeningsBC == null &&
                          !jobOpportunityLabel && (
                            <p className="text-base text-slate-700">
                              Opportunity information is available in the labour
                              market notes.
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  {selectedJob.typicalJobTitles &&
                    selectedJob.typicalJobTitles.length > 0 && (
                      <p className="text-base text-slate-800">
                        <span className="font-semibold">
                          Example job titles:
                        </span>{" "}
                        {selectedJob.typicalJobTitles.join(", ")}
                      </p>
                    )}

                  {selectedJob.typicalEmployers && (
                    <p className="text-base text-slate-800">
                      <span className="font-semibold">Typical employers:</span>{" "}
                      {selectedJob.typicalEmployers}
                    </p>
                  )}

                  {(selectedJob.regionNotes || selectedJob.region) && (
                    <p className="flex items-center gap-2 text-base text-slate-700">
                      <MapPin className="h-4 w-4 text-slate-800" />
                      {selectedJob.regionNotes || selectedJob.region}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Programs that lead here */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#005f63]/12 via-white to-[#d71920]/10 opacity-80" />
              <div className="relative border border-slate-200 rounded-2xl bg-white/95 shadow-[0_14px_40px_rgba(15,23,42,0.15)] overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-white to-slate-100 px-5 py-4">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700">
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

                  {linkedPrograms.map((p) => {
                    const band = getProgramBand(p.id);
                    const earningLabel =
                      band?.earningBandId &&
                      earningBandLabels[band.earningBandId];
                    const opportunityLabel =
                      band?.opportunityBandId &&
                      opportunityLabels[band.opportunityBandId];

                    return (
                      <motion.div
                        key={p.id}
                        className="border border-slate-200 rounded-xl px-4 py-3 text-base space-y-2 bg-slate-50/80"
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
                          {earningLabel && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                              <CircleDollarSign className="h-4 w-4" />
                              <span>{earningLabel}</span>
                            </span>
                          )}
                          {opportunityLabel && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-base text-sky-800">
                              <TrendingUp className="h-4 w-4" />
                              <span>{opportunityLabel}</span>
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
