// components/ByEarningsSection.tsx
"use client";

import { useEffect, useState } from "react";

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
      className="bg-white border-b border-slate-200 py-8 sm:py-10"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Compare by earning potential
            </h2>
            <p className="mt-1 text-sm text-slate-700 max-w-2xl">
              Choose a wage range to see which programs and example jobs fall in
              that band. This helps students understand what shorter, stackable
              credentials can lead to compared with longer 2 or 4 year options.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[240px]">
            <label
              htmlFor="earning-band-select"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
            >
              Earning range
            </label>
            <select
              id="earning-band-select"
              className="block w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63]"
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
          </div>
        </div>

        {selectedBand === "" && (
          <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-700">
            Use the dropdown above to choose an earning range. We will show you
            example jobs in that band along with CNC programs that usually lead
            into those levels of pay.
          </div>
        )}

        {selectedBand !== "" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Programs list */}
            <div className="border border-slate-200 rounded-lg bg-slate-50/80">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-600">
                  CNC programs in this earning band
                </p>
                <p className="mt-1 text-xs text-slate-700">
                  These programs are typically connected to jobs in the{" "}
                  {earningBandLabels[selectedBand]} range.
                </p>
              </div>
              <div className="px-4 py-3 space-y-3 max-h-[360px] overflow-y-auto">
                {programsForBand.length === 0 && (
                  <p className="text-sm text-slate-700">
                    Program earning data for this band will be added as the
                    dataset is completed.
                  </p>
                )}

                {programsForBand.map((program) => (
                  <div
                    key={program.id}
                    className="border border-slate-200 rounded-md px-3 py-2.5 text-xs sm:text-[13px] space-y-1.5 bg-white"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {program.name}
                        </p>
                        {program.credentialType && (
                          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-600">
                            {program.credentialType}
                          </p>
                        )}
                      </div>
                    </div>

                    {program.timeCommitment?.label && (
                      <p className="text-[11px] text-slate-700 mt-1">
                        Time commitment: {program.timeCommitment.label}
                      </p>
                    )}

                    {program.stackability?.stackMessage && (
                      <p className="text-[11px] text-slate-700">
                        Stackable pathway: {program.stackability.stackMessage}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] text-emerald-800">
                        💰{" "}
                        {earningBandLabels[program.earningBand || ""] ??
                          "Earning potential information available"}
                      </span>
                      {program.opportunityBand && (
                        <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-2.5 py-1 text-[11px] text-sky-800">
                          📈{" "}
                          {opportunityLabels[program.opportunityBand] ??
                            "Opportunities in the region"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs list */}
            <div className="border border-slate-200 rounded-lg bg-white">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-600">
                  Example jobs in this earning band
                </p>
                <p className="mt-1 text-xs text-slate-700">
                  These are sample job titles from the labour market that
                  typically sit in this wage band.
                </p>
              </div>
              <div className="px-4 py-3 space-y-3 max-h-[360px] overflow-y-auto">
                {jobsForBand.length === 0 && (
                  <p className="text-sm text-slate-700">
                    Job data for this band will be added as the dataset is
                    completed.
                  </p>
                )}

                {jobsForBand.map((job) => {
                  const annual =
                    job.medianAnnualSalary ??
                    (job.medianHourlyWage
                      ? job.medianHourlyWage * 40 * 52
                      : null);

                  return (
                    <div
                      key={job.id}
                      className="border border-slate-200 rounded-md px-3 py-2.5 text-xs sm:text-[13px] space-y-1.5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {job.title}
                          </p>
                          {job.noc2021 && (
                            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                              NOC {job.noc2021}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-[11px] text-slate-700">
                          {job.medianHourlyWage && (
                            <p>Median: ${job.medianHourlyWage.toFixed(2)}/hr</p>
                          )}
                          {annual && (
                            <p>≈ ${annual.toLocaleString("en-CA")} per year</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {job.projectedOpeningsBC != null && (
                          <span className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] text-slate-800">
                            📍 Approx.{" "}
                            {job.projectedOpeningsBC.toLocaleString("en-CA")}{" "}
                            openings in BC
                          </span>
                        )}
                        {job.opportunityLevel && (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] text-emerald-800">
                            📈{" "}
                            {opportunityLabels[job.opportunityLevel] ??
                              "Opportunity information available"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
