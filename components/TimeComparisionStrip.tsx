// components/TimeComparisonStrip.tsx

"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function TimeComparisonStrip() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-50 via-white to-pink-100 border-b border-indigo-100/70 overflow-hidden">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-40 w-40 rounded-full bg-gradient-to-tr from-pink-200/60 via-fuchsia-200/50 to-purple-200/50 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-44 w-44 rounded-full bg-gradient-to-tr from-indigo-200/60 via-sky-200/50 to-purple-200/50 blur-3xl" />

        {/* subtle donut graphic in the background */}
        <motion.div
          className="hidden md:block absolute -right-40 -bottom-40 h-100 w-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="relative h-full w-full"
            animate={{ scale: [1, 1.03, 1], opacity: [0.9, 1, 0.9] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            {/* outer soft ring */}
            <div className="absolute inset-1 rounded-full border border-indigo-100/70 bg-gradient-to-br from-white/70 via-transparent to-indigo-100/90" />

            {/* conic gradient segment ring */}
            <div className="absolute inset-6 rounded-full border-2 border-transparent bg-[conic-gradient(from_140deg,_#4f46e5_0deg,_#4f46e5_80deg,_#7c3aed_80deg,_#7c3aed_130deg,_#ec4899_130deg,_#ec4899_200deg,_#f97316_200deg,_#f97316_320deg,_#e5e7eb_320deg,_#e5e7eb_360deg)] opacity-85" />

            {/* inner mask to create donut */}
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-[#f9fafb] via-[#ffffff] to-[#e5e7eb]" />

            {/* subtle inner ring */}
            <div className="absolute inset-16 rounded-full border border-indigo-100/80 bg-white/85" />

            {/* light radial tick marks */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-32 w-32 rounded-full">
                <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-slate-300/70" />
                <span className="absolute right-0 top-1/2 h-px w-5 -translate-y-1/2 bg-slate-300/70" />
                <span className="absolute left-1/2 bottom-0 h-5 w-px -translate-x-1/2 bg-slate-200/70" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-8 sm:py-14 space-y-6"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0 }}
      >
        {/* Heading */}
        <motion.div className="flex flex-col gap-2" variants={fadeUp}>
          <p className="text-base md:text-2xl font-semibold tracking-[0.18em] text-indigo-700">
            Full-Time Study Pathway
          </p>
        </motion.div>

        {/* Time rail */}
        <motion.div className="space-y-4" variants={fadeUp}>
          <div className="relative h-3 rounded-full bg-slate-200/80 overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-indigo-500 to-indigo-400" />
            <div className="absolute inset-y-0 left-1/4 w-1/4 bg-gradient-to-r from-indigo-400 to-purple-500" />
            <div className="absolute inset-y-0 left-1/2 w-1/2 bg-gradient-to-r from-purple-500 to-pink-500" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between text-base text-slate-800 my-10">
            <div className="flex flex-col items-start gap-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow-sm border border-indigo-100">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="font-semibold">One Semester</span>
              </span>
            </div>
            <div className="flex flex-col items-start sm:items-center gap-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow-sm border border-purple-100">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="font-semibold">One Year (2 Semesters)</span>
              </span>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow-sm border border-pink-100">
                <span className="h-2 w-2 rounded-full bg-pink-500" />
                <span className="font-semibold">Two Years (4 Semesters)</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Cards - simplified content */}
        <motion.div
          className="grid gap-4 md:grid-cols-3 mt-6"
          variants={fadeUp}
        >
          {/* Short associate certificates */}
          <motion.div
            variants={cardVariant}
            className="group relative flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white/95 p-5 shadow-sm hover:shadow-lg hover:border-indigo-200 transition"
          >
            <div className="absolute inset-x-3 -top-1 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80" />
            <p className="text-base font-semibold uppercase tracking-[0.12em] text-indigo-700">
              Associate Certificates
            </p>
            <p className="text-base text-slate-800">
              A fast, focused way to start your business studies and gain
              job-ready skills.
            </p>
            <ul className="mt-1 space-y-1.5 text-base text-slate-800">
              <li>• Completed in one semester (3 courses, 9 credits).</li>
              <li>• Provides a job-ready credential you can use right away.</li>
              <li>
                • Ladders directly into the one-year certificate and diploma.
              </li>
            </ul>
          </motion.div>

          {/* 1 year CNC Business Administration Certificate */}
          <motion.div
            variants={cardVariant}
            className="group relative flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white/95 p-5 shadow-md ring-1 ring-purple-200/60"
          >
            <div className="absolute inset-x-3 -top-1 h-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
            <p className="text-base font-semibold uppercase tracking-[0.12em] text-purple-700">
              Certificate
            </p>
            <p className="text-base text-slate-800">
              A solid next step that deepens your business skills and expands
              your career options.
            </p>
            <ul className="mt-1 space-y-1.5 text-base text-slate-800">
              <li>• Completed in one year of full-time study (30 credits).</li>
              <li>
                • Provides a stronger credential for administrative,
                coordination, and entry-level business roles.
              </li>
              <li>
                • Ladders directly into the two-year Business Administration
                Diploma.
              </li>
            </ul>
          </motion.div>

          {/* Typical 2 and 4 year paths */}
          <motion.div
            variants={cardVariant}
            className="group relative flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white/95 p-5 shadow-sm hover:shadow-lg hover:border-pink-200 transition"
          >
            <div className="absolute inset-x-3 -top-1 h-1 rounded-full bg-gradient-to-r from-pink-500 to-slate-700 opacity-85" />
            <p className="text-base font-semibold uppercase tracking-[0.12em] text-slate-700">
              Diploma
            </p>
            <p className="text-base text-slate-800">
              A comprehensive two-year program that builds advanced business
              skills and supports stronger career opportunities.
            </p>
            <ul className="mt-1 space-y-1.5 text-base text-slate-800">
              <li>• Completed in two years of full-time study (60 credits).</li>
              <li>
                • Choose from a predefined second-year specialization or build
                your own path from a selection of upper-level courses.
              </li>
              <li>
                • A strong stand-alone credential that also supports future
                degree pathways.
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
