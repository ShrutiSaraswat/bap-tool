// components/ExploreByCards.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  BriefcaseBusiness,
  BookOpen,
  CircleDollarSign,
  TrendingUp,
  Timer,
  Star,
  Search,
  Sparkles,
  MapPin,
  BarChart3,
  GraduationCap,
  ListChecks,
} from "lucide-react";

import { TimeComparisonInline } from "./TimeComparisonInline";
import { NocLink } from "./NocLink";

import programsData from "../public/programs.json";
import jobsData from "../public/jobs.json";
import coursesData from "../public/courses.json";
import skillsData from "../public/skills.json";
import programBandsData from "../public/programsBand.json";

// ---------- Types ----------

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
  earningBand?: string;
  opportunityBand?: string;
};

type ProgramBand = {
  programId: string;
  earningBandId?: string;
  opportunityBandId?: string;
};

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

type SkillCluster = {
  id: string;
  name: string;
  description: string;
  programIds: string[];
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
  openingsBC?: number | null;
  projectedOpeningsBC?: number | null;
  wageBand?: string | null;
  wageBandId?: string | null;
  opportunityLevel?: string | null;
  opportunityBandId?: string | null;
  region?: string;
};

type EarningRangeId = "18_27" | "28_37" | "37_plus";

type Mode = "program" | "course" | "skill" | "job" | "earnings";

// ---------- Static data ----------

const PROGRAMS: Program[] = programsData as Program[];
const JOBS: Job[] = jobsData as Job[];
const COURSES: Course[] = coursesData as Course[];
const SKILL_CLUSTERS: SkillCluster[] = skillsData as SkillCluster[];
const PROGRAM_BANDS: ProgramBand[] = programBandsData as ProgramBand[];

// Shared earning labels (used in other sections)
const earningBandLabels: Record<string, string> = {
  // programBand style ids
  "earning-entry": "Entry (around $18-22/hr)",
  "earning-moderate": "Entry to medium ($20-26/hr)",
  "earning-good": "Medium (around $24-30/hr)",
  "earning-strong": "Medium to high ($28-35+/hr)",
  // earning section style ids
  entry: "Entry ($18-22/hr approx.)",
  entry_to_medium: "Entry to medium ($20-26/hr approx.)",
  medium: "Medium ($24-30/hr approx.)",
  medium_high: "Medium to high ($28-35+ /hr approx.)",
};

const opportunityLabels: Record<string, string> = {
  // programBand ids
  "opportunity-limited": "Some opportunities in the region",
  "opportunity-steady": "Good opportunities in the region",
  "opportunity-good": "Strong opportunities in the region",
  "opportunity-strong": "Very strong and stable demand",
  // job / earnings ids
  medium: "Some opportunities in the region",
  medium_high: "Good opportunities in the region",
  high: "Strong opportunities in the region",
  very_high: "Very strong and stable demand",
  broad: "Broad opportunities across sectors",
  emerging: "Emerging or growing area",
};

// New earning range options for the client request
const earningRangeOptions: { id: EarningRangeId; label: string }[] = [
  { id: "18_27", label: "$18 to $27 an hour" },
  { id: "28_37", label: "$28 to $37 an hour" },
  { id: "37_plus", label: "$37+ an hour" },
];

// Map existing earning bands to the 3 new ranges
const bandToRange: Record<string, EarningRangeId> = {
  entry: "18_27",
  entry_to_medium: "18_27",
  medium: "28_37",
  medium_high: "37_plus",
};

// ---------- Motion variants ----------

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

// ---------- Helpers ----------

function getProgramBand(programId: string) {
  return PROGRAM_BANDS.find((pb) => pb.programId === programId);
}

function getSkillsForProgram(programId: string): SkillCluster[] {
  return SKILL_CLUSTERS.filter((s) => s.programIds.includes(programId));
}

function getMedianHourly(job: Job): number | null {
  const anyJob = job as any;
  return job.medianHourlyWage ?? anyJob.median_hourly_wage ?? null;
}

function getAnnual(job: Job, hourly: number | null): number | null {
  const anyJob = job as any;
  const direct = job.medianAnnualSalary ?? anyJob.median_annual_salary ?? null;
  if (direct != null) return direct;
  if (hourly == null) return null;
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
  return opportunityLabels[id] ?? null;
}

function getJobWageBand(job: Job): string | null {
  const anyJob = job as any;
  return (
    job.wageBand ??
    anyJob.wage_band ??
    job.wageBandId ??
    anyJob.wage_band_id ??
    null
  );
}

function getRangeLabel(rangeId: EarningRangeId | "") {
  const opt = earningRangeOptions.find((o) => o.id === rangeId);
  return opt?.label ?? "";
}

/**
 * If a time label is written like "3 courses" / "2 courses",
 * convert it to the client format:
 *   "One Semester (4 Months)/3 Courses"
 * Otherwise, return the label as-is.
 */
function formatCoursesLabel(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const match = trimmed.match(/^(\d+)\s+courses?$/i);
  if (!match) return trimmed;

  const count = Number(match[1]);
  if (!Number.isFinite(count) || count <= 0) return trimmed;

  const plural = count === 1 ? "Course" : "Courses";
  return `One Semester (4 Months)/${count} ${plural}`;
}

// ---------- Main component ----------

export function ExploreByCards() {
  const [activeMode, setActiveMode] = useState<Mode | null>(null);

  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedBand, setSelectedBand] = useState<EarningRangeId | "">("");

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const hasAnySkills = SKILL_CLUSTERS.length > 0;

  // Skill search filtering
  const filteredSkills = useMemo(() => {
    if (!hasAnySkills) return [] as SkillCluster[];
    if (!skillSearch.trim()) return SKILL_CLUSTERS;

    const term = skillSearch.toLowerCase();
    return SKILL_CLUSTERS.filter((skill) =>
      skill.name.toLowerCase().includes(term)
    );
  }, [skillSearch, hasAnySkills]);

  const selectedSkill = useMemo(
    () => SKILL_CLUSTERS.find((s) => s.id === selectedSkillId),
    [selectedSkillId]
  );

  const programsForSkill = useMemo(() => {
    if (!selectedSkill) return [];
    return PROGRAMS.filter((p) => selectedSkill.programIds.includes(p.id));
  }, [selectedSkill]);

  // Program derived data
  const selectedProgram = useMemo(
    () => PROGRAMS.find((p) => p.id === selectedProgramId) || null,
    [selectedProgramId]
  );

  const relatedJobsForProgram: Job[] =
    selectedProgram?.jobIds
      ?.map((id) => JOBS.find((j) => j.id === id))
      .filter((j): j is Job => Boolean(j)) ?? [];

  const programBand = selectedProgram
    ? getProgramBand(selectedProgram.id)
    : null;
  const programEarningLabel =
    programBand?.earningBandId && earningBandLabels[programBand.earningBandId];
  const programOpportunityLabel =
    programBand?.opportunityBandId &&
    opportunityLabels[programBand.opportunityBandId];

  // Course derived data
  const selectedCourse = useMemo(
    () => COURSES.find((c) => c.id === selectedCourseId) || null,
    [selectedCourseId]
  );

  const linkedProgramsForCourse: Program[] =
    selectedCourse?.programIds
      ?.map((pid) => PROGRAMS.find((p) => p.id === pid))
      .filter((p): p is Program => Boolean(p)) ?? [];

  const linkedJobsForCourse: Job[] =
    selectedCourse?.jobIds
      ?.map((jid) => JOBS.find((j) => j.id === jid))
      .filter((j): j is Job => Boolean(j)) ?? [];

  // Job derived data
  const selectedJob = useMemo(
    () => JOBS.find((j) => j.id === selectedJobId) || null,
    [selectedJobId]
  );

  const linkedProgramsForJob: Program[] =
    selectedJob == null
      ? []
      : PROGRAMS.filter((p) => {
          const fromJob = selectedJob.programIds?.includes(p.id) ?? false;
          const fromProgram = p.jobIds?.includes(selectedJob.id) ?? false;
          return fromJob || fromProgram;
        });

  // Earnings derived data
  const programsForBand =
    selectedBand === ""
      ? []
      : PROGRAMS.filter((p) => {
          if (!p.earningBand) return false;
          const range = bandToRange[p.earningBand];
          return range === selectedBand;
        });

  const jobsForBand =
    selectedBand === ""
      ? []
      : JOBS.filter((j) => {
          const band = getJobWageBand(j);
          if (!band) return false;
          const range = bandToRange[band];
          return range === selectedBand;
        });

  // Scroll helper - offset for fixed navbar so content is not hidden
  const scrollToResults = (mode: Mode) => {
    setActiveMode(mode);

    requestAnimationFrame(() => {
      if (!resultsRef.current) return;

      const rect = resultsRef.current.getBoundingClientRect();
      const NAVBAR_OFFSET = 96; // adjust if your header height changes

      const targetY = window.scrollY + rect.top - NAVBAR_OFFSET;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    });
  };

  return (
    <section
      id="explore"
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-pink-50 to-white border-b border-indigo-100 py-12 sm:py-14"
    >
      {/* background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.18),transparent_65%)]" />
        <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -right-8 top-0 h-48 w-48 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-4 lg:px-0 space-y-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
      >
        {/* Intro */}
        <motion.div
          className="space-y-3 text-center pb-6 pt-4"
          variants={fadeUp}
          id="programs"
        >
          {/* <p
            className="text-base font-semibold tracking-[0.2em] uppercase text-indigo-700"
            id="courses"
          >
            Explore CNC business pathways
          </p> */}
          <h2
            className="text-lg sm:text-3xl font-bold text-slate-900"
            id="skills"
          >
            Discover your business path in the way that works for you.
          </h2>
        </motion.div>
        {/* Decorative divider */}
        <motion.div className="mx-auto -mt-5 h-1 w-40 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-90" />

        {/* Cards grid */}
        <motion.div
          className="pt-6 grid gap-7 lg:gap-8 md:grid-cols-2 xl:grid-cols-3 auto-rows-[minmax(0,1fr)] xl:[&>*:nth-child(5)]:col-start-3"
          variants={fadeUp}
        >
          {/* Program card (light) */}
          <div className="group relative h-full overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-pink-50 shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl min-h-[260px]">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br from-indigo-200/60 via-transparent to-pink-200/60" />
            <div className="relative flex h-full flex-col gap-5 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 aspect-square items-center justify-center rounded-full bg-white border border-indigo-100 shadow-sm">
                  <Timer className="h-5 w-5 text-indigo-700" />
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">
                    By program
                  </p>
                  <p className="text-base text-slate-800">
                    See jobs, wages and stackability for a CNC business program.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="card-program-select"
                    className="text-base font-semibold uppercase tracking-[0.16em] text-slate-800"
                  >
                    Program selector
                  </label>
                  <select
                    id="card-program-select"
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    value={selectedProgramId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedProgramId(value);
                      if (value) scrollToResults("program");
                    }}
                  >
                    <option value="">Select a CNC business program...</option>
                    {PROGRAMS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-auto pt-1 text-base text-slate-700">
                  Includes current BAP associate certificates and the Business
                  Administration Certificate.
                </p>
              </div>
            </div>
          </div>

          {/* Course card (slightly darker) */}
          <div className="group relative h-full overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-100 via-white to-purple-100 shadow-md transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl min-h-[260px]">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br from-indigo-300/70 via-transparent to-purple-300/70" />
            <div className="relative flex h-full flex-col gap-5 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 aspect-square items-center justify-center rounded-full bg-white border border-indigo-200 shadow-sm">
                  <BookOpen className="h-5 w-5 text-indigo-800" />
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-800">
                    By course
                  </p>
                  <p className="text-base text-slate-800">
                    Start from a specific course and see linked programs and
                    jobs.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="card-course-select"
                    className="text-base font-semibold uppercase tracking-[0.16em] text-slate-800"
                  >
                    Course selector
                  </label>
                  <select
                    id="card-course-select"
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    value={selectedCourseId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedCourseId(value);
                      if (value) scrollToResults("course");
                    }}
                  >
                    <option value="">Select a course...</option>
                    {COURSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-auto pt-1 text-base text-slate-700" id="jobs">
                  Helpful if you already know a course you are interested in.
                </p>
              </div>
            </div>
          </div>

          {/* Skill card (same light theme) */}
          <div className="group relative h-full overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-pink-50 shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl min-h-[260px]">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br from-purple-200/60 via-transparent to-pink-200/60" />
            <div className="relative flex h-full flex-col gap-5 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 aspect-square items-center justify-center rounded-full bg-white border border-indigo-100 shadow-sm">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>

                <div className="text-left space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-700">
                    By skill
                  </p>
                  <p className="text-base text-slate-800">
                    Start with what you are good at or want to build further.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="card-skill-search"
                    className="text-base font-semibold uppercase tracking-[0.16em] text-slate-800"
                  >
                    Skill search
                  </label>

                  {/* <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="card-skill-search"
                      type="text"
                      placeholder="Type a skill (customer service, accounting, marketing...)"
                      className="block w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-3 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      disabled={!hasAnySkills}
                    />
                  </div> */}

                  <select
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer disabled:cursor-default"
                    value={selectedSkillId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedSkillId(value);
                      if (value) scrollToResults("skill");
                    }}
                    disabled={!hasAnySkills}
                  >
                    {!hasAnySkills && (
                      <option value="">
                        Skill details for these programs are still being added.
                      </option>
                    )}

                    {hasAnySkills && (
                      <>
                        <option value="">
                          {filteredSkills.length === 0
                            ? "No skills match this search"
                            : "Select a skill..."}
                        </option>
                        {filteredSkills.map((skill) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                <p
                  className="mt-auto pt-1 text-base text-slate-700"
                  id="earnings"
                >
                  Works well if you know the kind of work you enjoy but are not
                  sure which credential to start with.
                </p>
              </div>
            </div>
          </div>

          {/* Job card (slightly darker) */}
          <div className="group relative h-full overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-100 via-white to-pink-100 shadow-md transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl min-h-[260px] xl:translate-x-1/2">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br from-indigo-300/70 via-transparent to-pink-300/70" />
            <div className="relative flex h-full flex-col gap-5 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 aspect-square items-center justify-center rounded-full bg-white border border-indigo-200 shadow-sm">
                  <BriefcaseBusiness className="h-5 w-5 text-indigo-800" />
                </div>

                <div className="text-left space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-800">
                    By job title
                  </p>
                  <p className="text-base text-slate-800">
                    See typical wages and CNC programs linked to a job.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="card-job-select"
                    className="text-base font-semibold uppercase tracking-[0.16em] text-slate-800"
                  >
                    Job title
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <select
                      id="card-job-select"
                      className="block w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-3 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                      value={selectedJobId}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedJobId(value);
                        if (value) scrollToResults("job");
                      }}
                    >
                      <option value="">Select a job title...</option>
                      {JOBS.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="mt-auto pt-1 text-base text-slate-700">
                  Titles are based on NOC 2021 groupings used in the labour
                  market analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Earnings card (slightly darker) */}
          <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-indigo-100 shadow-md transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl md:col-span-2 xl:col-span-1 xl:col-start-3 xl:-translate-x-1/2 min-h-[260px]">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br from-slate-300/70 via-transparent to-indigo-300/70" />
            <div className="relative flex h-full flex-col gap-5 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 aspect-square items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
                  <BarChart3 className="h-5 w-5 text-slate-800" />
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
                    By earning range
                  </p>
                  <p className="text-base text-slate-800">
                    Choose a wage band to see connected programs and jobs.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="card-earning-band"
                    className="text-base font-semibold uppercase tracking-[0.16em] text-slate-800"
                  >
                    Earning range
                  </label>
                  <select
                    id="card-earning-band"
                    className="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    value={selectedBand}
                    onChange={(e) => {
                      const value = e.target.value as EarningRangeId | "";
                      setSelectedBand(value);
                      if (value) scrollToResults("earnings");
                    }}
                  >
                    <option value="">Select an earning range...</option>
                    {earningRangeOptions.map((range) => (
                      <option key={range.id} value={range.id}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-auto pt-1 text-base text-slate-700">
                  Based on median wages and typical labour market bands.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <div ref={resultsRef} className="pt-4 space-y-8">
          {/* Program results - rethemed to indigo/purple */}
          {activeMode === "program" && selectedProgram && (
            <motion.div
              key={`program-${selectedProgramId}`}
              className="grid gap-6 lg:grid-cols-[3fr,2fr]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Program overview */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-100/80 via-white to-purple-100/80 opacity-90" />
                <div className="relative border border-indigo-200 rounded-3xl bg-white shadow-[0_18px_50px_rgba(79,70,229,0.25)] overflow-hidden">
                  <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 px-6 py-5">
                    <p className="text-base font-semibold tracking-[0.18em] uppercase text-indigo-900">
                      {selectedProgram.credentialType || "Program"}
                    </p>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">
                      {selectedProgram.name}
                    </h3>
                    {selectedProgram.shortTagline && (
                      <p className="mt-2 text-base text-slate-800">
                        {selectedProgram.shortTagline}
                      </p>
                    )}
                  </div>

                  <div className="px-6 py-5 space-y-4 text-base text-slate-800">
                    {selectedProgram.overview && (
                      <p>{selectedProgram.overview}</p>
                    )}

                    <div className="flex flex-wrap gap-2.5">
                      {selectedProgram.timeCommitment?.label && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-900">
                          <Timer className="h-4 w-4 text-indigo-700" />
                          <span>
                            {formatCoursesLabel(
                              selectedProgram.timeCommitment.label
                            )}
                          </span>
                        </span>
                      )}
                      {programEarningLabel && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-800">
                          <CircleDollarSign className="h-4 w-4" />
                          <span>{programEarningLabel}</span>
                        </span>
                      )}
                      {programOpportunityLabel && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-800">
                          <TrendingUp className="h-4 w-4" />
                          <span>{programOpportunityLabel}</span>
                        </span>
                      )}
                    </div>

                    {selectedProgram.stackability?.stackMessage && (
                      <div className="border border-indigo-200 bg-indigo-50/80 px-4 py-3 rounded-2xl">
                        <p className="text-sm font-semibold text-indigo-900 uppercase tracking-[0.16em] mb-1">
                          Stackable pathway
                        </p>
                        <p>{selectedProgram.stackability.stackMessage}</p>
                      </div>
                    )}

                    <TimeComparisonInline
                      approxMonths={
                        selectedProgram.timeCommitment?.approxMonths
                      }
                    />

                    {selectedProgram.courses &&
                      selectedProgram.courses.length > 0 && (
                        <div className="pt-1">
                          <p className="text-sm font-semibold tracking-[0.14em] uppercase text-slate-800 mb-2">
                            Key courses
                          </p>
                          <ul className="grid gap-1.5 text-base">
                            {selectedProgram.courses.map((course) => {
                              const detailedCourse = COURSES.find(
                                (c) =>
                                  c.code === course.code ||
                                  c.id ===
                                    course.code
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")
                              );

                              const description =
                                detailedCourse?.shortTagline ||
                                detailedCourse?.overview;

                              return (
                                <li key={course.code} className="space-y-0.5">
                                  <p className="flex gap-2">
                                    <span className="font-semibold text-slate-900">
                                      {course.code}
                                    </span>
                                    {course.title && (
                                      <span className="text-slate-800">
                                        {course.title}
                                      </span>
                                    )}
                                  </p>
                                  {description && (
                                    <p className="text-sm text-slate-700">
                                      {description}
                                    </p>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Jobs for program */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-100/75 via-white to-purple-100/75 opacity-90" />
                <div className="relative border border-indigo-200 rounded-3xl bg-white/95 shadow-[0_18px_50px_rgba(79,70,229,0.2)] overflow-hidden">
                  <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 px-6 py-5">
                    <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-900 flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4 text-indigo-700" />
                      Job prospects and opportunities
                    </p>
                    <p className="mt-2 text-base text-slate-800">
                      Based on the BAP labour market analysis, here are example
                      roles this program can connect to.
                    </p>
                  </div>

                  <div className="px-6 py-5 space-y-3 max-h-[400px] overflow-y-auto text-base">
                    {relatedJobsForProgram.length === 0 && (
                      <p className="text-slate-800">
                        Job information for this program will be added as the
                        data is updated.
                      </p>
                    )}

                    {relatedJobsForProgram.map((j) => {
                      const hourly = getMedianHourly(j);
                      const annual = getAnnual(j, hourly);
                      const openings = getOpenings(j);
                      const earning = getJobEarningLabel(j);
                      const opp = getJobOpportunityLabel(j);

                      return (
                        <div
                          key={j.id}
                          className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/90 space-y-2"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {j.title}
                              </p>
                              {j.noc2021 && (
                                <p className="text-sm text-slate-700">
                                  <NocLink code={j.noc2021} />
                                  {j.nocTitle && (
                                    <>
                                      {" · "}
                                      {j.nocTitle}
                                    </>
                                  )}
                                </p>
                              )}
                            </div>
                            {(hourly || annual) && (
                              <div className="text-right text-sm text-slate-700">
                                {hourly != null && (
                                  <p>Median: ${hourly.toFixed(2)}/hr</p>
                                )}
                                {annual != null && (
                                  <p>
                                    ≈ ${annual.toLocaleString("en-CA")} per year
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {j.shortSummary && (
                            <p className="text-slate-800">{j.shortSummary}</p>
                          )}

                          {j.typicalJobTitles &&
                            j.typicalJobTitles.length > 0 && (
                              <p className="text-slate-800">
                                <span className="font-semibold">
                                  Example job titles:
                                </span>{" "}
                                {j.typicalJobTitles.join(", ")}
                              </p>
                            )}

                          <div className="flex flex-wrap gap-2 pt-1">
                            {openings != null && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-800">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  Approx. {openings.toLocaleString("en-CA")}{" "}
                                  openings in BC
                                </span>
                              </span>
                            )}

                            {opp && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-sm text-sky-800">
                                <TrendingUp className="h-4 w-4" />
                                <span>{opp}</span>
                              </span>
                            )}

                            {earning && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-800">
                                <CircleDollarSign className="h-4 w-4" />
                                <span>{earning}</span>
                              </span>
                            )}

                            {j.typicalEmployers && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-800">
                                <MapPin className="h-4 w-4" />
                                <span>{j.typicalEmployers}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Course results - already indigo/sky theme */}
          {activeMode === "course" && selectedCourse && (
            <motion.div
              key={`course-${selectedCourseId}`}
              className="grid gap-6 lg:grid-cols-[3fr,2fr]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Course overview */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-100/80 via-white to-sky-100/80 opacity-90" />
                <div className="relative border border-indigo-200 rounded-3xl bg-white shadow-[0_18px_50px_rgba(15,23,42,0.2)] overflow-hidden">
                  <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-sky-50 px-6 py-5">
                    <p className="text-base font-semibold tracking-[0.18em] uppercase text-indigo-800 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-indigo-700" />
                      {selectedCourse.category || "Course"}
                    </p>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">
                      {selectedCourse.code} - {selectedCourse.title}
                    </h3>
                    {selectedCourse.shortTagline && (
                      <p className="mt-2 text-base text-slate-800">
                        {selectedCourse.shortTagline}
                      </p>
                    )}
                  </div>

                  <div className="px-6 py-5 space-y-4 text-base text-slate-800">
                    {selectedCourse.overview && (
                      <p>{selectedCourse.overview}</p>
                    )}

                    {selectedCourse.region && (
                      <p className="flex items-center gap-2 text-slate-700">
                        <MapPin className="h-4 w-4 text-indigo-700" />
                        Delivered in {selectedCourse.region}
                      </p>
                    )}

                    {selectedCourse.skills &&
                      selectedCourse.skills.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold tracking-[0.14em] uppercase text-slate-800 mb-2 flex items-center gap-2">
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

              {/* Programs & jobs for course */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-100/70 via-white to-sky-100/80 opacity-90" />
                <div className="relative border border-indigo-200 rounded-3xl bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.18)] overflow-hidden">
                  <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-sky-50 px-6 py-5">
                    <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-900 flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4 text-indigo-700" />
                      Programs and job pathways
                    </p>
                    <p className="mt-2 text-base text-slate-800">
                      Credentials that include this course and example jobs
                      linked to those pathways.
                    </p>
                  </div>

                  <div className="px-6 py-5 space-y-4 max-h-[420px] overflow-y-auto text-base">
                    {/* Programs */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold tracking-[0.14em] uppercase text-slate-800">
                        CNC programs that include this course
                      </p>

                      {linkedProgramsForCourse.length === 0 && (
                        <p className="text-slate-800">
                          Program information for this course will be added as
                          additional data is confirmed.
                        </p>
                      )}

                      {linkedProgramsForCourse.map((p) => {
                        const band = getProgramBand(p.id);
                        const earning =
                          band?.earningBandId &&
                          earningBandLabels[band.earningBandId];
                        const opportunity =
                          band?.opportunityBandId &&
                          opportunityLabels[band.opportunityBandId];

                        return (
                          <div
                            key={p.id}
                            className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/90 space-y-2"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {p.name}
                                </p>
                                {p.credentialType && (
                                  <p className="text-sm text-slate-700">
                                    {p.credentialType}
                                  </p>
                                )}
                              </div>
                              {p.timeCommitment?.label && (
                                <p className="text-sm text-slate-700">
                                  {formatCoursesLabel(p.timeCommitment.label)}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                              {earning && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-800">
                                  <CircleDollarSign className="h-4 w-4" />
                                  <span>{earning}</span>
                                </span>
                              )}
                              {opportunity && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-sm text-sky-800">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>{opportunity}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Jobs */}
                    <div className="space-y-2 pt-2">
                      <p className="text-sm font-semibold tracking-[0.14em] uppercase text-slate-800">
                        Example jobs connected to this course
                      </p>

                      {linkedJobsForCourse.length === 0 && (
                        <p className="text-slate-800">
                          Job pathways for this course will be added as more
                          labour market information is available.
                        </p>
                      )}

                      {linkedJobsForCourse.map((job) => {
                        const hourly = getMedianHourly(job);
                        const annual = getAnnual(job, hourly);
                        const openings = getOpenings(job);
                        const earningLabel = getJobEarningLabel(job);
                        const opportunityLabel = getJobOpportunityLabel(job);

                        return (
                          <div
                            key={job.id}
                            className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/90 space-y-2"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {job.title}
                                </p>
                                {job.noc2021 && (
                                  <p className="text-sm text-slate-700">
                                    <NocLink code={job.noc2021} />
                                  </p>
                                )}
                              </div>

                              <div className="text-right text-sm text-slate-700">
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
                              <p className="text-slate-800">
                                {job.shortSummary}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-2 pt-1">
                              {openings != null && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-800">
                                  <MapPin className="h-4 w-4" />
                                  <span>
                                    Approx. {openings.toLocaleString("en-CA")}{" "}
                                    openings in BC
                                  </span>
                                </span>
                              )}

                              {opportunityLabel && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-sm text-sky-800">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>{opportunityLabel}</span>
                                </span>
                              )}

                              {earningLabel && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-800">
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

          {/* Skill results - rethemed to purple/indigo */}
          {activeMode === "skill" && hasAnySkills && selectedSkill && (
            <motion.div
              key={`skill-${selectedSkill.id}`}
              className="relative"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-purple-100/80 via-white to-indigo-100/80 opacity-90" />
              <div className="relative border border-purple-200 rounded-3xl bg-white/95 shadow-[0_18px_50px_rgba(109,40,217,0.25)]">
                <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-indigo-50 px-6 py-5">
                  <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Programs that build this skill
                  </p>
                  <p className="mt-2 text-base text-slate-800">
                    Showing CNC business programs that list{" "}
                    <span className="font-semibold">{selectedSkill.name}</span>{" "}
                    as a key skill outcome.
                  </p>
                </div>

                <div className="px-6 py-5 space-y-3 max-h-[400px] overflow-y-auto">
                  {programsForSkill.length === 0 && (
                    <p className="text-base text-slate-800">
                      Skill information for this area will be added as more data
                      becomes available.
                    </p>
                  )}

                  {programsForSkill.map((p) => {
                    const band = getProgramBand(p.id);
                    const earningLabel =
                      band?.earningBandId &&
                      earningBandLabels[band.earningBandId];
                    const opportunityLabel =
                      band?.opportunityBandId &&
                      opportunityLabels[band.opportunityBandId];

                    const programSkills = getSkillsForProgram(p.id);
                    const otherSkills = programSkills.filter(
                      (s) => s.id !== selectedSkill.id
                    );

                    return (
                      <motion.div
                        key={p.id}
                        className="border border-slate-200 rounded-2xl px-4 py-3 text-base space-y-2 bg-slate-50/90"
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
                              <p className="text-sm text-slate-700">
                                {p.credentialType}
                              </p>
                            )}
                          </div>
                          {p.timeCommitment?.label && (
                            <p className="text-sm text-slate-700">
                              {formatCoursesLabel(p.timeCommitment.label)}
                            </p>
                          )}
                        </div>

                        {p.overview && (
                          <p className="text-slate-800">
                            {p.overview.length > 220
                              ? p.overview.slice(0, 217) + "..."
                              : p.overview}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 pt-1">
                          {earningLabel && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-800">
                              <CircleDollarSign className="h-4 w-4" />
                              <span>{earningLabel}</span>
                            </span>
                          )}
                          {opportunityLabel && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-sm text-sky-800">
                              <TrendingUp className="h-4 w-4" />
                              <span>{opportunityLabel}</span>
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-sm text-indigo-700">
                            <Star className="h-4 w-4" />
                            <span>Focus on {selectedSkill.name}</span>
                          </span>
                        </div>

                        {otherSkills.length > 0 && (
                          <p className="text-sm text-slate-700 pt-1">
                            <span className="font-semibold">Other skills:</span>{" "}
                            {otherSkills
                              .slice(0, 5)
                              .map((s) => s.name)
                              .join(", ")}
                            {otherSkills.length > 5 ? " ..." : ""}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Job results - cool red toned down into indigo/rose mix */}
          {activeMode === "job" && selectedJob && (
            <motion.div
              key={`job-${selectedJobId}`}
              className="grid gap-6 lg:grid-cols-[3fr,2fr]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Job details */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-rose-100/70 via-white to-indigo-100/80 opacity-90" />
                <div className="relative border border-rose-200 rounded-3xl bg-white shadow-[0_18px_50px_rgba(190,24,93,0.23)] overflow-hidden">
                  <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50 via-white to-indigo-50 px-6 py-5">
                    <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-900 flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4 text-rose-600" />
                      Job details
                    </p>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">
                      {selectedJob.title}
                    </h3>
                    {selectedJob.noc2021 && (
                      <p className="mt-1 text-base text-slate-700">
                        <NocLink code={selectedJob.noc2021} />
                        {selectedJob.nocTitle && (
                          <>
                            {" · "}
                            {selectedJob.nocTitle}
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="px-6 py-5 space-y-4 text-base text-slate-800">
                    {(selectedJob.description || selectedJob.shortSummary) && (
                      <p>
                        {selectedJob.description ?? selectedJob.shortSummary}
                      </p>
                    )}

                    {selectedJob.typicalEmployers && (
                      <p className="text-slate-700">
                        <span className="font-semibold">
                          Typical employers:{" "}
                        </span>
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
                      {/* Wages */}
                      <div className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/90">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-800 mb-2">
                          Typical wages
                        </p>
                        <div className="space-y-1 text-base text-slate-800">
                          {(() => {
                            const hourly = getMedianHourly(selectedJob);
                            const annual = getAnnual(selectedJob, hourly);
                            const band = getJobEarningLabel(selectedJob);

                            return (
                              <>
                                {hourly != null && (
                                  <p>Median wage: ${hourly.toFixed(2)}/hr</p>
                                )}
                                {annual != null && (
                                  <p>
                                    ≈ ${annual.toLocaleString("en-CA")} per year
                                  </p>
                                )}
                                {band && (
                                  <p className="text-slate-700">{band}</p>
                                )}
                                {!hourly && !annual && !band && (
                                  <p className="text-slate-700">
                                    Detailed wage data for this job will be
                                    added as more labour market information is
                                    available.
                                  </p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Opportunities */}
                      <div className="border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50/90">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-800 mb-2">
                          Opportunities
                        </p>
                        <div className="space-y-1 text-base text-slate-800">
                          {(() => {
                            const openings = getOpenings(selectedJob);
                            const opp = getJobOpportunityLabel(selectedJob);
                            return (
                              <>
                                {openings != null && (
                                  <p>
                                    Approx. {openings.toLocaleString("en-CA")}{" "}
                                    openings in BC (forecast)
                                  </p>
                                )}
                                {opp && <p className="text-slate-700">{opp}</p>}
                                {openings == null && !opp && (
                                  <p className="text-slate-700">
                                    Detailed outlook information for this job
                                    will be added as more data is available.
                                  </p>
                                )}
                              </>
                            );
                          })()}
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

              {/* Programs linked to job */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-rose-100/70 via-white to-indigo-100/70 opacity-90" />
                <div className="relative border border-rose-200 rounded-3xl bg-white/95 shadow-[0_18px_50px_rgba(190,24,93,0.2)] overflow-hidden">
                  <div className="border-b border-rose-200 bg-gradient-to-r from-rose-50 via-white to-indigo-50 px-6 py-5">
                    <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-900">
                      CNC programs connected to this job
                    </p>
                    <p className="mt-2 text-base text-slate-800">
                      Shorter CNC business programs that can be useful starting
                      points toward this role. Many can later be stacked into
                      longer credentials.
                    </p>
                  </div>

                  <div className="px-6 py-5 space-y-3 max-h-[400px] overflow-y-auto text-base">
                    {linkedProgramsForJob.length === 0 && (
                      <p className="text-slate-800">
                        Program connections for this job are still being added.
                      </p>
                    )}

                    {linkedProgramsForJob.map((p) => {
                      const band = getProgramBand(p.id);
                      const earning =
                        band?.earningBandId &&
                        earningBandLabels[band.earningBandId];
                      const opp =
                        band?.opportunityBandId &&
                        opportunityLabels[band.opportunityBandId];

                      return (
                        <motion.div
                          key={p.id}
                          className="border border-slate-200 rounded-2xl px-4 py-3 text-base space-y-2 bg-slate-50/90"
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
                                <p className="text-sm text-slate-700">
                                  {p.credentialType}
                                </p>
                              )}
                            </div>
                            {p.timeCommitment?.label && (
                              <p className="text-sm text-slate-700">
                                {formatCoursesLabel(p.timeCommitment.label)}
                              </p>
                            )}
                          </div>

                          {p.stackability?.stackMessage && (
                            <p className="text-slate-800">
                              <span className="font-semibold">
                                Stackable pathway:
                              </span>{" "}
                              {p.stackability.stackMessage}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 pt-1">
                            {earning && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-800">
                                <CircleDollarSign className="h-4 w-4" />
                                <span>{earning}</span>
                              </span>
                            )}
                            {opp && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-sm text-sky-800">
                                <TrendingUp className="h-4 w-4" />
                                <span>{opp}</span>
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

          {/* Earnings results - neutralised into indigo/slate */}
          {activeMode === "earnings" && selectedBand !== "" && (
            <motion.div
              key={`earnings-${selectedBand}`}
              className="grid gap-6 lg:grid-cols-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Programs in band */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-indigo-100/80 via-white to-slate-100/80 opacity-90" />
                <div className="relative border border-indigo-200 rounded-3xl bg-white/95 shadow-[0_18px_50px_rgba(79,70,229,0.2)]">
                  <div className="border-b border-indigo-100 bg-gradient-to-r from-slate-100 via-white to-indigo-50 px-6 py-5">
                    <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-900 flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-indigo-700" />
                      CNC programs in this earning band
                    </p>
                    <p className="mt-2 text-base text-slate-800">
                      Programs usually connected to jobs paying around{" "}
                      <span className="font-semibold">
                        {getRangeLabel(selectedBand)}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="px-6 py-5 space-y-3 max-h-[400px] overflow-y-auto text-base">
                    {programsForBand.length === 0 && (
                      <p className="text-slate-800">
                        Program earning information for this band will be added
                        as more data is available. The jobs list already
                        reflects the wage band.
                      </p>
                    )}

                    {programsForBand.map((program) => {
                      const band = getProgramBand(program.id);
                      const opp =
                        band?.opportunityBandId &&
                        opportunityLabels[band.opportunityBandId];

                      return (
                        <motion.div
                          key={program.id}
                          className="border border-slate-200 rounded-2xl px-4 py-3 text-base space-y-2 bg-slate-50/90"
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
                                <p className="text-sm text-slate-700">
                                  {program.credentialType}
                                </p>
                              )}
                            </div>
                            {program.timeCommitment?.label && (
                              <p className="text-sm text-slate-700">
                                {formatCoursesLabel(
                                  program.timeCommitment.label
                                )}
                              </p>
                            )}
                          </div>

                          {program.stackability?.stackMessage && (
                            <p className="text-slate-800">
                              <span className="font-semibold">
                                Stackable pathway:
                              </span>{" "}
                              {program.stackability.stackMessage}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm text-amber-800">
                              <CircleDollarSign className="h-4 w-4" />
                              <span>{getRangeLabel(selectedBand)}</span>
                            </span>
                            {opp && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-sm text-sky-800">
                                <TrendingUp className="h-4 w-4" />
                                <span>{opp}</span>
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Jobs in band */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-slate-100/80 via-white to-indigo-100/80 opacity-90" />
                <div className="relative border border-slate-200 rounded-3xl bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-100 via-white to-indigo-50 px-6 py-5">
                    <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-900 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-slate-800" />
                      Example jobs in this earning band
                    </p>
                    <p className="mt-2 text-base text-slate-800">
                      Sample job titles that usually sit in this wage band.
                    </p>
                  </div>

                  <div className="px-6 py-5 space-y-3 max-h-[400px] overflow-y-auto text-base">
                    {jobsForBand.length === 0 && (
                      <p className="text-slate-800">
                        Job information for this band will be added as more data
                        is available.
                      </p>
                    )}

                    {jobsForBand.map((job) => {
                      const hourly = getMedianHourly(job);
                      const annual = getAnnual(job, hourly);
                      const openings = getOpenings(job);
                      const opp = getJobOpportunityLabel(job);

                      return (
                        <motion.div
                          key={job.id}
                          className="border border-slate-200 rounded-2xl px-4 py-3 text-base space-y-2 bg-slate-50/90"
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
                                <p className="text-sm text-slate-700">
                                  <NocLink code={job.noc2021} />
                                  {job.nocTitle && (
                                    <>
                                      {" · "}
                                      {job.nocTitle}
                                    </>
                                  )}
                                </p>
                              )}
                            </div>
                            <div className="text-right text-sm text-slate-700">
                              {hourly != null && (
                                <p>Median: ${hourly.toFixed(2)}/hr</p>
                              )}
                              {annual != null && (
                                <p>
                                  ≈ ${annual.toLocaleString("en-CA")} per year
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm text-amber-800">
                              <CircleDollarSign className="h-4 w-4" />
                              <span>{getRangeLabel(selectedBand)}</span>
                            </span>
                            {openings != null && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-800">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  Approx. {openings.toLocaleString("en-CA")}{" "}
                                  openings in BC
                                </span>
                              </span>
                            )}
                            {opp && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-sm text-sky-800">
                                <TrendingUp className="h-4 w-4" />
                                <span>{opp}</span>
                              </span>
                            )}
                          </div>

                          {job.region && (
                            <p className="flex items-center gap-2 text-sm text-slate-700 pt-1">
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
        </div>
      </motion.div>
    </section>
  );
}
