// components/ByCourseSection.tsx
"use client";

import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  BriefcaseBusiness,
  CircleDollarSign,
  TrendingUp,
  MapPin,
  ListChecks,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

import coursesData from "../public/courses.json";
import programsData from "../public/programs.json";
import jobsData from "../public/jobs.json";
import programBandsData from "../public/programsBand.json";

type Course = {
  id: string;
  code: string;
  title: string;
  category?: string;
  shortTagline?: string;
  overview?: string;
  region?: string;
  programIds?: string[];
  jobIds?: string[];
  skills?: string[];
};

type Program = {
  id: string;
  name: string;
  credentialType?: string;
  shortTagline?: string;
  timeCommitment?: {
    label?: string;
    approxMonths?: number;
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
  noc2021?: string | null;
  nocTitle?: string;
  shortSummary?: string;
  typicalJobTitles?: string[];
  typicalEmployers?: string;
  // wage and opportunity fields are optional and can come in with different names
  medianHourlyWage?: number | null;
  medianAnnualSalary?: number | null;
  openingsBC?: number | null;
  projectedOpeningsBC?: number | null;
  wageBandId?: string | null;
  wageBand?: string | null;
  opportunityBandId?: string | null;
  opportunityLevel?: string | null;
};

// Static data
const COURSES: Course[] = coursesData as Course[];
const PROGRAMS: Program[] = programsData as Program[];
const JOBS: Job[] = jobsData as Job[];
const PROGRAM_BANDS: ProgramBand[] = programBandsData as ProgramBand[];

// Same ID scheme as programsBand.json
const earningBandLabels: Record<string, string> = {
  "earning-entry": "Entry (around $18-22/hr)",
  "earning-moderate": "Entry to medium ($20-26/hr)",
  "earning-good": "Medium (around $24-30/hr)",
  "earning-strong": "Medium to high ($28-35+/hr)",
  entry: "Entry (around $18-22/hr)",
  entry_to_medium: "Entry to medium ($20-26/hr)",
  medium: "Medium (around $24-30/hr)",
  medium_high: "Medium to high ($28-35+/hr)",
};

const opportunityBandLabels: Record<string, string> = {
  "opportunity-limited": "Some opportunities in the region",
  "opportunity-steady": "Good opportunities in the region",
  "opportunity-good": "Strong opportunities in the region",
  "opportunity-strong": "Very strong and stable demand",
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

// Helpers to handle small naming differences in jobs.json
function getMedianHourly(job: Job): number | null {
  const anyJob = job as any;
  return job.medianHourlyWage ?? anyJob.median_hourly_wage ?? null;
}

function getAnnual(job: Job, hourly: number | null): number | null {
  const anyJob = job as any;
  const direct = job.medianAnnualSalary ?? anyJob.median_annual_salary ?? null;
  if (direct != null) return direct;
  if (hourly == null) return null;
  // 40 hours per week, 52 weeks per year
  return hourly * 40 * 52;
}

function getOpenings(job: Job): number | null {
  const anyJob = job as any;
  return (
    job.openingsBC ??
    job.projectedOpeningsBC ??
    anyJob.openings_bc ??
    anyJob.projected_openings_bc ??
    null
  );
}

function getJobEarningLabel(job: Job): string | null {
  const anyJob = job as any;
  const bandId =
    job.wageBandId ??
    anyJob.wage_band_id ??
    job.wageBand ??
    anyJob.wage_band ??
    null;

  if (!bandId) return null;
  return earningBandLabels[bandId] ?? null;
}

function getJobOpportunityLabel(job: Job): string | null {
  const anyJob = job as any;
  const id =
    job.opportunityBandId ??
    anyJob.opportunity_band_id ??
    job.opportunityLevel ??
    anyJob.opportunity_level ??
    null;
  if (!id) return null;
  return opportunityBandLabels[id] ?? null;
}

function getProgramBand(programId: string) {
  return PROGRAM_BANDS.find((pb) => pb.programId === programId);
}

export function ByCourseSection() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const selectedCourse = COURSES.find((c) => c.id === selectedCourseId) || null;

  const linkedPrograms: Program[] =
    selectedCourse?.programIds
      ?.map((pid) => PROGRAMS.find((p) => p.id === pid))
      .filter((p): p is Program => Boolean(p)) ?? [];

  const linkedJobs: Job[] =
    selectedCourse?.jobIds
      ?.map((jid) => JOBS.find((j) => j.id === jid))
      .filter((j): j is Job => Boolean(j)) ?? [];

  return (
    <section
      id="courses"
      className="relative overflow-hidden bg-gradient-to-br from-[#eef2ff] via-white to-[#e0f2fe] border-b border-slate-200 py-10 sm:py-12"
    >
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-28 top-8 h-52 w-52 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-60 w-60 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Heading + selector */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          variants={fadeUp}
        >
          <div className="space-y-2 max-w-3xl">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-indigo-700 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-700" />
              Explore by course
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              See how individual courses link to programs and jobs.
            </h2>
            <p className="text-base text-slate-800">
              Choose a course to see where it fits in the Business
              Administration Program, which credentials it supports, and example
              jobs and wage bands that it helps prepare you for.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[260px]">
            <label
              htmlFor="course-select"
              className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700"
            >
              Course selector
            </label>
            <select
              id="course-select"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 cursor-pointer"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="">Select a course…</option>
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.title}
                </option>
              ))}
            </select>
            <p className="text-base text-slate-700">
              Includes key BAP courses across accounting, HR, analytics,
              hospitality, and general business.
            </p>
          </div>
        </motion.div>

        {/* Empty state */}
        {!selectedCourse && (
          <motion.div
            className="border border-dashed border-slate-300 bg-white/90 px-5 py-6 text-base text-slate-800 rounded-2xl shadow-sm"
            variants={fadeUp}
          >
            Use the dropdown above to pick a course. When you select one, you
            will see:
            <ul className="mt-2 space-y-1">
              <li>- What the course covers and key skills you build.</li>
              <li>- Which CNC credentials include the course.</li>
              <li>
                - Example job pathways with typical wages and opportunity
                information linked to that course.
              </li>
            </ul>
          </motion.div>
        )}

        {/* Selected course view */}
        {selectedCourse && (
          <motion.div
            key={selectedCourseId}
            className="grid gap-6 lg:grid-cols-[3fr,2fr]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Course overview card */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-100/80 via-white to-sky-100/80 opacity-80" />
              <div className="relative border border-slate-200 rounded-2xl bg-white shadow-[0_14px_40px_rgba(15,23,42,0.16)] overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-sky-50 px-5 py-4">
                  <p className="text-base font-semibold tracking-[0.18em] uppercase text-slate-800 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-700" />
                    {selectedCourse.category || "Course"}
                  </p>
                  <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900">
                    {selectedCourse.code} – {selectedCourse.title}
                  </h3>
                  {selectedCourse.shortTagline && (
                    <p className="mt-2 text-base text-slate-800">
                      {selectedCourse.shortTagline}
                    </p>
                  )}
                </div>

                <div className="px-5 py-4 space-y-4 text-base text-slate-800">
                  {selectedCourse.overview && (
                    <p className="text-slate-800">{selectedCourse.overview}</p>
                  )}

                  {selectedCourse.region && (
                    <p className="flex items-center gap-2 text-base text-slate-700">
                      <MapPin className="h-4 w-4 text-indigo-700" />
                      Delivered in {selectedCourse.region}
                    </p>
                  )}

                  {selectedCourse.skills &&
                    selectedCourse.skills.length > 0 && (
                      <div>
                        <p className="text-base font-semibold tracking-[0.14em] uppercase text-slate-700 mb-2 flex items-center gap-2">
                          <ListChecks className="h-4 w-4 text-indigo-700" />
                          Key skills
                        </p>
                        <ul className="grid gap-1.5 text-base list-disc pl-5">
                          {selectedCourse.skills.map((skill) => (
                            <li key={skill}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Programs and jobs card */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-100/70 via-white to-sky-100/80 opacity-80" />
              <div className="relative border border-slate-200 rounded-2xl bg-white/95 shadow-[0_14px_40px_rgba(15,23,42,0.18)] overflow-hidden">
                <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-sky-50 px-5 py-4">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-800 flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4 text-indigo-700" />
                    Programs and job pathways
                  </p>
                  <p className="mt-2 text-base text-slate-800">
                    These are CNC credentials that include this course and
                    sample job titles connected to those pathways, based on the
                    BAP labour market analysis.
                  </p>
                </div>

                <div className="px-5 py-4 space-y-4 max-h-[420px] overflow-y-auto text-base">
                  {/* Programs list */}
                  <div className="space-y-2">
                    <p className="text-base font-semibold tracking-[0.14em] uppercase text-slate-700">
                      CNC programs that include this course
                    </p>

                    {linkedPrograms.length === 0 && (
                      <p className="text-base text-slate-800">
                        Program information for this course will be added as
                        additional data is confirmed.
                      </p>
                    )}

                    {linkedPrograms.map((p) => {
                      const band = getProgramBand(p.id);
                      const earning =
                        band?.earningBandId &&
                        earningBandLabels[band.earningBandId];
                      const opportunity =
                        band?.opportunityBandId &&
                        opportunityBandLabels[band.opportunityBandId];

                      return (
                        <div
                          key={p.id}
                          className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/80 space-y-2"
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

                          <div className="flex flex-wrap gap-2 pt-1">
                            {earning && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                                <CircleDollarSign className="h-4 w-4" />
                                <span>{earning}</span>
                              </span>
                            )}
                            {opportunity && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-base text-sky-800">
                                <TrendingUp className="h-4 w-4" />
                                <span>{opportunity}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Jobs list */}
                  <div className="space-y-2 pt-2">
                    <p className="text-base font-semibold tracking-[0.14em] uppercase text-slate-700">
                      Example jobs connected to this course
                    </p>

                    {linkedJobs.length === 0 && (
                      <p className="text-base text-slate-800">
                        Job pathways for this course will be added as more
                        labour market information is available.
                      </p>
                    )}

                    {linkedJobs.map((job) => {
                      const hourly = getMedianHourly(job);
                      const annual = getAnnual(job, hourly);
                      const openings = getOpenings(job);
                      const earningLabel = getJobEarningLabel(job);
                      const opportunityLabel = getJobOpportunityLabel(job);

                      return (
                        <div
                          key={job.id}
                          className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/80 space-y-2"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {job.title}
                              </p>
                              {job.noc2021 && (
                                <p className="text-base text-slate-700">
                                  NOC {job.noc2021}
                                </p>
                              )}
                            </div>

                            <div className="text-right text-base text-slate-700">
                              {hourly != null && (
                                <p>Median wage: ${hourly.toFixed(2)}/hr</p>
                              )}
                              {annual != null && (
                                <p>
                                  ≈ ${annual.toLocaleString("en-CA")} per year
                                </p>
                              )}
                            </div>
                          </div>

                          {job.shortSummary && (
                            <p className="text-base text-slate-800">
                              {job.shortSummary}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 pt-1">
                            {openings != null && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-base text-slate-800">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  Approx. {openings.toLocaleString("en-CA")}{" "}
                                  openings in BC
                                </span>
                              </span>
                            )}

                            {opportunityLabel && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                                <TrendingUp className="h-4 w-4" />
                                <span>{opportunityLabel}</span>
                              </span>
                            )}

                            {earningLabel && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-base text-sky-800">
                                <CircleDollarSign className="h-4 w-4" />
                                <span>{earningLabel}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
