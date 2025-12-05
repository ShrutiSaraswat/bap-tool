// components/ByProgramSection.tsx
"use client";

import { useEffect, useState } from "react";
import { TimeComparisonInline } from "./TimeComparisonInline";

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
  region?: string;
  earningBand?: string;
  opportunityBand?: string;
  courses?: { code: string; title?: string }[];
  jobIds?: string[];
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
  emerging: "Emerging / growing area",
};

export function ByProgramSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    // Adjust paths if your filenames are different
    fetch("/programs.json")
      .then((res) => res.json())
      .then((data: Program[]) => setPrograms(data))
      .catch((err) => console.error("Error loading programs.json", err));

    fetch("/jobs.json")
      .then((res) => res.json())
      .then((data: Job[]) => setJobs(data))
      .catch((err) => console.error("Error loading jobs.json", err));
  }, []);

  const selectedProgram = programs.find((p) => p.id === selectedId) || null;
  const relatedJobs =
    selectedProgram?.jobIds
      ?.map((id) => jobs.find((j) => j.id === id))
      .filter(Boolean) ?? [];

  return (
    <section
      id="programs"
      className="bg-white border-b border-slate-200 py-8 sm:py-10"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Start by selecting a program
            </h2>
            <p className="mt-1 text-sm text-slate-700 max-w-2xl">
              Choose a program to see what kinds of jobs it connects to, typical
              earning potential, and how many opportunities there are in British
              Columbia and northern regions. All information is based on the BAP
              labour market analysis.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[240px]">
            <label
              htmlFor="program-select"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
            >
              Program
            </label>
            <select
              id="program-select"
              className="block w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63]"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">Select a program…</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!selectedProgram && (
          <div className="border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-700">
            Use the dropdown above to pick a program. We will show the time
            commitment, how it can stack into longer credentials, and the jobs,
            wages and openings connected to that program.
          </div>
        )}

        {selectedProgram && (
          <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
            {/* Program overview card */}
            <div className="border border-slate-200 rounded-lg bg-slate-50/60">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-600">
                  {selectedProgram.credentialType || "Program"}
                </p>
                <h3 className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">
                  {selectedProgram.name}
                </h3>
              </div>
              <div className="px-4 py-4 space-y-4 text-sm text-slate-800">
                {selectedProgram.overview && (
                  <p className="text-slate-700">{selectedProgram.overview}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedProgram.timeCommitment?.label && (
                    <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-800">
                      ⏱{" "}
                      <span className="ml-1">
                        {selectedProgram.timeCommitment.label}
                      </span>
                    </span>
                  )}
                  {selectedProgram.earningBand && (
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                      💰{" "}
                      <span className="ml-1">
                        {earningBandLabels[selectedProgram.earningBand] ??
                          "Earning potential information available"}
                      </span>
                    </span>
                  )}
                  {selectedProgram.opportunityBand && (
                    <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
                      📈{" "}
                      <span className="ml-1">
                        {opportunityLabels[selectedProgram.opportunityBand] ??
                          "Opportunities in the region"}
                      </span>
                    </span>
                  )}
                </div>

                {selectedProgram.stackability?.stackMessage && (
                  <div className="border border-[#005f63]/20 bg-[#005f63]/5 px-3 py-2 rounded">
                    <p className="text-xs font-semibold text-[#005f63] uppercase tracking-[0.16em] mb-1">
                      Stackable pathway
                    </p>
                    <p className="text-sm text-slate-800">
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
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-600 mb-1.5">
                        Key courses
                      </p>
                      <ul className="grid gap-1.5 text-xs sm:text-[13px]">
                        {selectedProgram.courses.map((course) => (
                          <li key={course.code} className="flex gap-2">
                            <span className="font-semibold text-slate-900">
                              {course.code}
                            </span>
                            {course.title && (
                              <span className="text-slate-700">
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

            {/* Jobs + opportunities */}
            <div className="border border-slate-200 rounded-lg bg-white">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-600">
                  Job prospects &amp; opportunities
                </p>
                <p className="mt-1 text-xs text-slate-700">
                  Based on the BAP labour market analysis, these are examples of
                  roles this program connects to.
                </p>
              </div>
              <div className="px-4 py-3 space-y-3 max-h-[360px] overflow-y-auto">
                {relatedJobs.length === 0 && (
                  <p className="text-sm text-slate-700">
                    Job information for this program will be added as the
                    dataset is completed.
                  </p>
                )}

                {relatedJobs.map((job) => {
                  const annual =
                    job!.medianAnnualSalary ??
                    (job!.medianHourlyWage
                      ? job!.medianHourlyWage * 40 * 52
                      : null);

                  return (
                    <div
                      key={job!.id}
                      className="border border-slate-200 rounded-md px-3 py-2.5 text-xs sm:text-[13px] space-y-1.5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {job!.title}
                          </p>
                          {job!.noc2021 && (
                            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                              NOC {job!.noc2021}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-[11px] text-slate-700">
                          {job!.medianHourlyWage && (
                            <p>
                              Median wage: ${job!.medianHourlyWage.toFixed(2)}
                              /hr
                            </p>
                          )}
                          {annual && (
                            <p>≈ ${annual.toLocaleString("en-CA")} per year</p>
                          )}
                        </div>
                      </div>

                      {job!.description && (
                        <p className="text-slate-700">{job!.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {job!.projectedOpeningsBC != null && (
                          <span className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] text-slate-800">
                            📍 Approx.{" "}
                            {job!.projectedOpeningsBC.toLocaleString("en-CA")}{" "}
                            openings in BC
                          </span>
                        )}
                        {job!.opportunityLevel && (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] text-emerald-800">
                            📈{" "}
                            {opportunityLabels[job!.opportunityLevel] ??
                              "Opportunity information available"}
                          </span>
                        )}
                        {job!.wageBand && (
                          <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-2.5 py-1 text-[11px] text-sky-800">
                            💰{" "}
                            {earningBandLabels[job!.wageBand] ??
                              "Wage information available"}
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
