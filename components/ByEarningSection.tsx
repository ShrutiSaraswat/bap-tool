// components/ByEarningsSection.tsx
"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, TrendingUp, MapPin, BarChart3 } from "lucide-react";
import { motion, type Variants } from "framer-motion";

type Program = {
  id: string;
  name: string;
  credentialType?: string;
  timeCommitment?: {
    label?: string;
    approxMonths?: number;
  };
  stackability?: {
    isStackable?: boolean;
    stackMessage?: string;
  };
  earningBand?: string; // optional for now
  opportunityBand?: string; // optional for now
};

type Job = {
  id: string;
  title: string;
  noc2021?: string | null;
  nocTitle?: string;
  medianHourlyWage?: number | null;
  medianAnnualSalary?: number | null;
  wageBand?: string | null;
  projectedOpeningsBC?: number | null;
  opportunityLevel?: string | null;
  region?: string;
};

type BandId = "entry" | "entry_to_medium" | "medium" | "medium_high";

const earningBandOptions: { id: BandId; label: string }[] = [
  { id: "entry", label: "Entry ($18-22/hr approx.)" },
  { id: "entry_to_medium", label: "Entry to medium ($20-26/hr approx.)" },
  { id: "medium", label: "Medium ($24-30/hr approx.)" },
  { id: "medium_high", label: "Medium to high ($28-35+ /hr approx.)" },
];

const earningBandLabels: Record<string, string> = {
  entry: "Entry ($18-22/hr approx.)",
  entry_to_medium: "Entry to medium ($20-26/hr approx.)",
  medium: "Medium ($24-30/hr approx.)",
  medium_high: "Medium to high ($28-35+ /hr approx.)",
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

export function ByEarningsSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedBand, setSelectedBand] = useState<BandId | "">("");

  useEffect(() => {
    fetch("/programs.json")
      .then((res) => res.json())
      .then((data: Program[]) => setPrograms(data))
      .catch((err) => console.error("Error loading programs.json", err));

    fetch("/jobs.json")
      .then((res) => res.json())
      .then((data: Job[]) => setJobs(data))
      .catch((err) => console.error("Error loading jobs.json", err));
  }, []);

  const programsForBand =
    selectedBand === ""
      ? []
      : programs.filter((p) => p.earningBand === selectedBand);

  const jobsForBand =
    selectedBand === "" ? [] : jobs.filter((j) => j.wageBand === selectedBand);

  return (
    <section
      id="earnings"
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
        {/* Heading + filter */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          variants={fadeUp}
        >
          <div className="space-y-2 max-w-3xl">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-[#005f63] flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#005f63]" />
              Compare by earning potential
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              See which programs and jobs sit in each wage band.
            </h2>
            <p className="text-base text-slate-800">
              Choose a wage range to see which CNC business programs and sample
              jobs fall in that band. This helps you compare shorter, stackable
              credentials with longer 2 or 4 year options.
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[260px]">
            <label
              htmlFor="earning-band-select"
              className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700"
            >
              Earning range
            </label>
            <select
              id="earning-band-select"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63] cursor-pointer"
              value={selectedBand}
              onChange={(e) =>
                setSelectedBand(
                  e.target.value === "" ? "" : (e.target.value as BandId)
                )
              }
            >
              <option value="">Select an earning range…</option>
              {earningBandOptions.map((band) => (
                <option key={band.id} value={band.id}>
                  {band.label}
                </option>
              ))}
            </select>
            <p className="text-base text-slate-700">
              Ranges are based on median wages and typical labour market bands.
            </p>
          </div>
        </motion.div>

        {/* Empty state when no band selected */}
        {selectedBand === "" && (
          <motion.div
            className="border border-dashed border-slate-300 bg-white px-5 py-6 text-base text-slate-800 rounded-2xl shadow-sm"
            variants={fadeUp}
          >
            Use the dropdown above to choose an earning range. This section
            shows:
            <ul className="mt-2 space-y-1">
              <li>
                - CNC business programs that usually connect to that wage band
                (where data is available).
              </li>
              <li>- Example job titles and their typical median wages.</li>
              <li>- How opportunities look in BC for that earning range.</li>
            </ul>
          </motion.div>
        )}

        {/* Selected band view */}
        {selectedBand !== "" && (
          <motion.div
            key={selectedBand}
            className="grid gap-6 lg:grid-cols-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Programs list */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#005f63]/14 via-white to-[#d71920]/8 opacity-80" />
              <div className="relative border border-slate-200 rounded-2xl bg-white/95 shadow-[0_14px_40px_rgba(15,23,42,0.15)]">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-white to-slate-100 px-5 py-4">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700 flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-emerald-700" />
                    CNC programs in this earning band
                  </p>
                  <p className="mt-2 text-base text-slate-800">
                    These programs are usually connected to jobs in the{" "}
                    <span className="font-semibold">
                      {earningBandLabels[selectedBand]}
                    </span>{" "}
                    range, where earning information has been mapped.
                  </p>
                </div>

                <div className="px-5 py-4 space-y-3 max-h-[360px] overflow-y-auto">
                  {programsForBand.length === 0 && (
                    <p className="text-base text-slate-800">
                      Program earning information for this band will be added as
                      more data is available. The jobs list on the right already
                      reflects the wage band.
                    </p>
                  )}

                  {programsForBand.map((program) => (
                    <motion.div
                      key={program.id}
                      className="border border-slate-200 rounded-xl px-4 py-3 text-base space-y-2 bg-slate-50/80"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {program.name}
                          </p>
                          {program.credentialType && (
                            <p className="text-base text-slate-700">
                              {program.credentialType}
                            </p>
                          )}
                        </div>
                        {program.timeCommitment?.label && (
                          <p className="text-base text-slate-700">
                            {program.timeCommitment.label}
                          </p>
                        )}
                      </div>

                      {program.stackability?.stackMessage && (
                        <p className="text-base text-slate-800">
                          <span className="font-semibold">
                            Stackable pathway:
                          </span>{" "}
                          {program.stackability.stackMessage}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {program.earningBand && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                            <CircleDollarSign className="h-4 w-4" />
                            <span>
                              {earningBandLabels[program.earningBand] ??
                                "Earning potential information available"}
                            </span>
                          </span>
                        )}
                        {program.opportunityBand && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-base text-sky-800">
                            <TrendingUp className="h-4 w-4" />
                            <span>
                              {opportunityLabels[program.opportunityBand] ??
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

            {/* Jobs list */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-slate-200/60 via-white to-slate-100 opacity-70" />
              <div className="relative border border-slate-200 rounded-2xl bg-white shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-white to-slate-100 px-5 py-4">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-slate-800" />
                    Example jobs in this earning band
                  </p>
                  <p className="mt-2 text-base text-slate-800">
                    These are sample job titles from the labour market that
                    usually sit in this wage band.
                  </p>
                </div>

                <div className="px-5 py-4 space-y-3 max-h-[360px] overflow-y-auto">
                  {jobsForBand.length === 0 && (
                    <p className="text-base text-slate-800">
                      Job information for this band will be added as more data
                      is available.
                    </p>
                  )}

                  {jobsForBand.map((job) => {
                    const annual =
                      job.medianAnnualSalary ??
                      (job.medianHourlyWage
                        ? job.medianHourlyWage * 40 * 52
                        : null);

                    return (
                      <motion.div
                        key={job.id}
                        className="border border-slate-200 rounded-xl px-4 py-3 text-base space-y-2 bg-slate-50/80"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {job.title}
                            </p>
                            {job.noc2021 && (
                              <p className="text-base text-slate-700">
                                NOC {job.noc2021}
                                {job.nocTitle ? ` · ${job.nocTitle}` : ""}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-base text-slate-700">
                            {job.medianHourlyWage != null && (
                              <p>
                                Median: ${job.medianHourlyWage.toFixed(2)}/hr
                              </p>
                            )}
                            {annual != null && (
                              <p>
                                ≈ ${annual.toLocaleString("en-CA")} per year
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {job.wageBand && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                              <CircleDollarSign className="h-4 w-4" />
                              <span>
                                {earningBandLabels[job.wageBand] ??
                                  "Earning potential information available"}
                              </span>
                            </span>
                          )}
                          {job.projectedOpeningsBC != null && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-base text-slate-800">
                              <MapPin className="h-4 w-4" />
                              <span>
                                Approx.{" "}
                                {job.projectedOpeningsBC.toLocaleString(
                                  "en-CA"
                                )}{" "}
                                openings in BC
                              </span>
                            </span>
                          )}
                          {job.opportunityLevel && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                              <TrendingUp className="h-4 w-4" />
                              <span>
                                {opportunityLabels[job.opportunityLevel] ??
                                  "Opportunity information available"}
                              </span>
                            </span>
                          )}
                        </div>

                        {job.region && (
                          <p className="flex items-center gap-2 text-base text-slate-700 pt-1">
                            <MapPin className="h-4 w-4 text-slate-800" />
                            Region: {job.region}
                          </p>
                        )}
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
