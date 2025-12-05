// components/ByJobSection.tsx
"use client";

import { useEffect, useState } from "react";

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
  entry: "Entry (around $18–22/hr)",
  entry_to_medium: "Entry to medium ($20–26/hr)",
  medium: "Medium (around $24–30/hr)",
  medium_high: "Medium to high ($28–35+/hr)",
};

const opportunityLabels: Record<string, string> = {
  medium: "Some opportunities in the region",
  medium_high: "Good opportunities in the region",
  high: "Strong opportunities in the region",
  very_high: "Very strong and stable demand",
  broad: "Broad opportunities across sectors",
  emerging: "Emerging or growing area",
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
      className="bg-slate-50 border-b border-slate-200 py-8 sm:py-10"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Search by job title
            </h2>
            <p className="mt-1 text-sm text-slate-700 max-w-2xl">
              Choose a job title you are interested in. You will see typical
              wages, the number of openings in British Columbia, and which CNC
              business programs can lead you there. This highlights how short,
              stackable credentials compare to longer 2 or 4 year degrees.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[240px]">
            <label
              htmlFor="job-select"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
            >
              Job title
            </label>
            <select
              id="job-select"
              className="block w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63]"
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
        </div>

        {!selectedJob && (
          <div className="border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-700">
            Use the dropdown above to pick a job. For each job, this page will
            show typical wages, how many openings there are in BC, and which
            short CNC programs are designed to get you started toward that role.
          </div>
        )}

        {selectedJob && (
          <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
            {/* Job details card */}
            <div className="border border-slate-200 rounded-lg bg-white">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-600">
                  Job details
                </p>
                <h3 className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">
                  {selectedJob.title}
                </h3>
                {selectedJob.noc2021 && (
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    NOC {selectedJob.noc2021}
                  </p>
                )}
              </div>
              <div className="px-4 py-4 space-y-4 text-sm text-slate-800">
                {selectedJob.description && (
                  <p className="text-slate-700">{selectedJob.description}</p>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Wage */}
                  <div className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1">
                      Typical wages
                    </p>
                    <div className="text-sm text-slate-800 space-y-0.5">
                      {selectedJob.medianHourlyWage && (
                        <p>
                          Median wage: $
                          {selectedJob.medianHourlyWage.toFixed(2)}/hr
                        </p>
                      )}
                      {selectedJob.medianAnnualSalary && (
                        <p>
                          ≈ $
                          {selectedJob.medianAnnualSalary.toLocaleString(
                            "en-CA"
                          )}{" "}
                          per year
                        </p>
                      )}
                      {selectedJob.wageBand && (
                        <p className="text-xs text-slate-700 mt-1">
                          {earningBandLabels[selectedJob.wageBand] ??
                            "Earning potential information available"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Openings */}
                  <div className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1">
                      Opportunities
                    </p>
                    <div className="text-sm text-slate-800 space-y-0.5">
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
                        <p className="text-xs text-slate-700 mt-1">
                          {opportunityLabels[selectedJob.opportunityLevel] ??
                            "Opportunity information available"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedJob.region && (
                  <p className="text-xs text-slate-600">
                    Region: {selectedJob.region}
                  </p>
                )}
              </div>
            </div>

            {/* Programs that lead here */}
            <div className="border border-slate-200 rounded-lg bg-white">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-600">
                  CNC programs connected to this job
                </p>
                <p className="mt-1 text-xs text-slate-700">
                  These are shorter, stackable CNC business programs that can be
                  used as starting points toward this job. Many can later be
                  stacked into a 1 year certificate or 2 year diploma.
                </p>
              </div>
              <div className="px-4 py-3 space-y-3 max-h-[360px] overflow-y-auto">
                {linkedPrograms.length === 0 && (
                  <p className="text-sm text-slate-700">
                    Program links for this job will be added as the dataset is
                    completed.
                  </p>
                )}

                {linkedPrograms.map((program) => (
                  <div
                    key={program!.id}
                    className="border border-slate-200 rounded-md px-3 py-2.5 text-xs sm:text-[13px] space-y-1.5 bg-slate-50/80"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {program!.name}
                        </p>
                        {program!.credentialType && (
                          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-600">
                            {program!.credentialType}
                          </p>
                        )}
                      </div>
                    </div>

                    {program!.timeCommitment?.label && (
                      <p className="text-[11px] text-slate-700 mt-1">
                        Time commitment: {program!.timeCommitment.label}
                      </p>
                    )}

                    {program!.stackability?.stackMessage && (
                      <p className="text-[11px] text-slate-700">
                        Stackable pathway: {program!.stackability.stackMessage}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {program!.earningBand && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] text-emerald-800">
                          💰{" "}
                          {earningBandLabels[program!.earningBand] ??
                            "Earning potential information available"}
                        </span>
                      )}
                      {program!.opportunityBand && (
                        <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-2.5 py-1 text-[11px] text-sky-800">
                          📈{" "}
                          {opportunityLabels[program!.opportunityBand] ??
                            "Opportunities in the region"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
