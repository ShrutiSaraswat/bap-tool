// components/ByJobSection.tsx
"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Search, MapPin } from "lucide-react";
import { motion, type Variants } from "framer-motion";

type Program = {
  id: string;
  name: string;
  credentialType?: string;
  region?: string;
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
  jobIds?: string[];
};

type Job = {
  id: string;
  title: string;
  noc2021?: string | null;
  nocTitle?: string;
  shortSummary?: string;
  typicalJobTitles?: string[];
  typicalEmployers?: string;
  programIds?: string[];
};

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

  // Robust link: use job.programIds if present, and also program.jobIds
  const linkedPrograms: Program[] =
    selectedJob == null
      ? []
      : programs.filter((p) => {
          const fromJob = selectedJob.programIds?.includes(p.id);
          const fromProgram = p.jobIds?.includes(selectedJob.id);
          return Boolean(fromJob || fromProgram);
        });

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
              Choose a job title you are interested in. You will see what the
              work involves, typical job titles and employers, and which CNC
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
              <li>- A short summary of what the job involves.</li>
              <li>- Example job titles and typical employers.</li>
              <li>- CNC programs that prepare you for that kind of work.</li>
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
                  {(selectedJob.noc2021 || selectedJob.nocTitle) && (
                    <p className="mt-1 text-base text-slate-700">
                      {selectedJob.noc2021 && <>NOC {selectedJob.noc2021}</>}{" "}
                      {selectedJob.nocTitle && <>- {selectedJob.nocTitle}</>}
                    </p>
                  )}
                </div>

                <div className="px-5 py-4 space-y-4 text-base text-slate-800">
                  {selectedJob.shortSummary && (
                    <p className="text-slate-800">{selectedJob.shortSummary}</p>
                  )}

                  {selectedJob.typicalJobTitles &&
                    selectedJob.typicalJobTitles.length > 0 && (
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">
                          Typical job titles
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-800">
                          {selectedJob.typicalJobTitles.map((title) => (
                            <li key={title}>{title}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {selectedJob.typicalEmployers && (
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">
                        Typical employers
                      </p>
                      <p className="text-slate-800">
                        {selectedJob.typicalEmployers}
                      </p>
                    </div>
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
                    These CNC business credentials are directly linked to this
                    job in the pathway data. They can be starting points or
                    stackable steps toward this kind of role.
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

                      {p.region && (
                        <p className="flex items-center gap-2 text-base text-slate-700 pt-1">
                          <MapPin className="h-4 w-4 text-slate-800" />
                          {p.region}
                        </p>
                      )}
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
