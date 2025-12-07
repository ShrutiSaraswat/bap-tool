// components/ByProgramSection.tsx
"use client";

import { useState } from "react";
import { TimeComparisonInline } from "./TimeComparisonInline";
import {
  Timer,
  CircleDollarSign,
  TrendingUp,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

import programsData from "../public/programs.json";
import jobsData from "../public/jobs.json";
import programBandsData from "../public/programsBand.json";

type Program = {
  id: string;
  name: string;
  credentialType?: string;
  shortTagline?: string;
  overview?: string;
  timeCommitment?: {
    label?: string;
    approxMonths?: number;
  };
  stackability?: {
    isStackable?: boolean;
    stackLevel?: number;
    stacksInto?: string[];
    stackMessage?: string;
  };
  region?: string;
  courses?: { code: string; title?: string }[];
  jobIds?: string[];
  skills?: string[];
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
  nocTitle?: string;
  shortSummary?: string;
  typicalJobTitles?: string[];
  typicalEmployers?: string;
};

const PROGRAMS: Program[] = programsData as Program[];
const JOBS: Job[] = jobsData as Job[];
const PROGRAM_BANDS: ProgramBand[] = programBandsData as ProgramBand[];

// These map to IDs used in programsBand.json
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

// Motion variants for the top copy only
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

export function ByProgramSection() {
  const [selectedId, setSelectedId] = useState<string>("");

  const programs = PROGRAMS;
  const jobs = JOBS;

  const selectedProgram = programs.find((p) => p.id === selectedId) || null;

  const relatedJobs: Job[] =
    selectedProgram?.jobIds
      ?.map((id) => jobs.find((j) => j.id === id))
      .filter((j): j is Job => Boolean(j)) ?? [];

  function getProgramBand(programId: string) {
    return PROGRAM_BANDS.find((pb) => pb.programId === programId);
  }

  const band = selectedProgram ? getProgramBand(selectedProgram.id) : null;
  const earningLabel =
    band?.earningBandId && earningBandLabels[band.earningBandId];
  const opportunityLabel =
    band?.opportunityBandId && opportunityLabels[band.opportunityBandId];

  return (
    <section
      id="programs"
      className="relative overflow-hidden bg-gradient-to-br from-[#fff1f2] via-red-900/10 to-[#fffbeb] border-b border-slate-200 py-10 sm:py-12"
    >
      {/* background accents */}

      <motion.div
        className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Top heading + selector */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          variants={fadeUp}
        >
          <div className="space-y-2 max-w-3xl">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-[#b91c1c]">
              Explore CNC business programs
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Start by selecting a program.
            </h2>
            <p className="text-base text-slate-800">
              Choose a program to see which jobs it connects to, typical earning
              potential, and opportunities in northern British Columbia and
              across the province. All information comes from the Business
              Administration Program (BAP) labour market analysis.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[260px]">
            <label
              htmlFor="program-select"
              className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700"
            >
              Program selector
            </label>
            <select
              id="program-select"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d97706] focus:border-[#d97706] cursor-pointer"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">Select a CNC business program…</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <p className="text-base text-slate-700">
              Includes current BAP associate certificates and the Business
              Administration Certificate.
            </p>
          </div>
        </motion.div>

        {/* Empty state */}
        {!selectedProgram && (
          <motion.div
            className="border border-dashed border-slate-300 bg-white/90 px-5 py-6 text-base text-slate-800 rounded-2xl shadow-sm"
            variants={fadeUp}
          >
            Use the dropdown above to pick a program. When you select one, you
            will see:
            <ul className="mt-2 space-y-1">
              <li>
                - Time commitment and how it compares to 2 and 4 year paths.
              </li>
              <li>
                - How the credential can stack into longer CNC business
                programs.
              </li>
              <li>
                - Example jobs, wages and openings linked to that program.
              </li>
            </ul>
          </motion.div>
        )}

        {/* Selected program area */}
        {selectedProgram && (
          <motion.div
            key={selectedId}
            className="grid gap-6 lg:grid-cols-[3fr,2fr]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Program overview card */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#fed7aa]/60 via-white to-[#fee2e2]/70 opacity-80" />
              <div className="relative border border-slate-200 rounded-2xl bg-white shadow-[0_14px_40px_rgba(120,53,15,0.2)] overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-[#fff7ed] via-white to-[#fee2e2] px-5 py-4">
                  <p className="text-base font-semibold tracking-[0.18em] uppercase text-slate-800">
                    {selectedProgram.credentialType || "Program"}
                  </p>
                  <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900">
                    {selectedProgram.name}
                  </h3>
                  {selectedProgram.shortTagline && (
                    <p className="mt-2 text-base text-slate-800">
                      {selectedProgram.shortTagline}
                    </p>
                  )}
                </div>

                <div className="px-5 py-4 space-y-4 text-base text-slate-800">
                  {selectedProgram.overview && (
                    <p className="text-slate-800">{selectedProgram.overview}</p>
                  )}

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2.5">
                    {selectedProgram.timeCommitment?.label && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-base font-medium text-slate-800">
                        <Timer className="h-4 w-4 text-[#b91c1c]" />
                        <span>{selectedProgram.timeCommitment.label}</span>
                      </span>
                    )}
                    {earningLabel && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-base font-medium text-emerald-800">
                        <CircleDollarSign className="h-4 w-4" />
                        <span>{earningLabel}</span>
                      </span>
                    )}
                    {opportunityLabel && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-base font-medium text-sky-800">
                        <TrendingUp className="h-4 w-4" />
                        <span>{opportunityLabel}</span>
                      </span>
                    )}
                  </div>

                  {selectedProgram.stackability?.stackMessage && (
                    <div className="border border-[#b91c1c]/25 bg-[#fee2e2]/40 px-4 py-3 rounded-xl">
                      <p className="text-base font-semibold text-[#b91c1c] uppercase tracking-[0.16em] mb-1">
                        Stackable pathway
                      </p>
                      <p className="text-base text-slate-800">
                        {selectedProgram.stackability.stackMessage}
                      </p>
                    </div>
                  )}

                  {/* Dynamic time comparison vs 2 year and 4 year paths */}
                  <TimeComparisonInline
                    approxMonths={selectedProgram.timeCommitment?.approxMonths}
                  />

                  {selectedProgram.courses &&
                    selectedProgram.courses.length > 0 && (
                      <div className="pt-1">
                        <p className="text-base font-semibold tracking-[0.14em] uppercase text-slate-700 mb-2">
                          Key courses
                        </p>
                        <ul className="grid gap-1.5 text-base">
                          {selectedProgram.courses.map((course) => (
                            <li key={course.code} className="flex gap-2">
                              <span className="font-semibold text-slate-900">
                                {course.code}
                              </span>
                              {course.title && (
                                <span className="text-slate-800">
                                  {course.title}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Jobs + opportunities */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#fed7aa]/40 via-white to-[#fecaca]/50 opacity-80" />
              <div className="relative border border-slate-200 rounded-2xl bg-white/95 shadow-[0_14px_40px_rgba(120,53,15,0.18)] overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-[#fff7ed] via-white to-[#fee2e2] px-5 py-4">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-800 flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4 text-[#b91c1c]" />
                    Job prospects and opportunities
                  </p>
                  <p className="mt-2 text-base text-slate-800">
                    Based on the BAP labour market analysis, here are example
                    roles this program can connect to.
                  </p>
                </div>

                <div className="px-5 py-4 space-y-3 max-h-[360px] overflow-y-auto text-base">
                  {relatedJobs.length === 0 && (
                    <p className="text-base text-slate-800">
                      Job information for this program will be added as the data
                      is updated.
                    </p>
                  )}

                  {relatedJobs.map((j) => {
                    return (
                      <div
                        key={j.id}
                        className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/80 space-y-2"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {j.title}
                            </p>
                            {j.noc2021 && (
                              <p className="text-base text-slate-700">
                                NOC {j.noc2021}
                              </p>
                            )}
                          </div>
                        </div>

                        {j.shortSummary && (
                          <p className="text-base text-slate-800">
                            {j.shortSummary}
                          </p>
                        )}

                        {j.typicalJobTitles &&
                          j.typicalJobTitles.length > 0 && (
                            <p className="text-base text-slate-800">
                              <span className="font-semibold">
                                Example job titles:
                              </span>{" "}
                              {j.typicalJobTitles.join(", ")}
                            </p>
                          )}

                        {j.typicalEmployers && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-base text-slate-800">
                              <MapPin className="h-4 w-4" />
                              <span>{j.typicalEmployers}</span>
                            </span>
                          </div>
                        )}
                      </div>
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
