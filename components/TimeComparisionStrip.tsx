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
    <section className="relative bg-gradient-to-r from-[#fef2f2] via-[#f9fafb] to-[#eff6ff] border-b border-slate-200 overflow-hidden">
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-40 w-40 rounded-full bg-[#d71920]/15 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-44 w-44 rounded-full bg-[#005f63]/15 blur-3xl" />

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
            <div className="absolute inset-1 rounded-full border border-slate-200/70 bg-gradient-to-br from-white/60 via-transparent to-[#e0f2f1]/80" />

            {/* conic gradient segment ring */}
            <div className="absolute inset-6 rounded-full border-2 border-transparent bg-[conic-gradient(from_140deg,_#005f63_0deg,_#005f63_80deg,_#0f766e_80deg,_#0f766e_130deg,_#f4b41a_130deg,_#f4b41a_200deg,_#d71920_200deg,_#d71920_320deg,_#e5e7eb_320deg,_#e5e7eb_360deg)] opacity-85" />

            {/* inner mask to create donut */}
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-[#f9fafb] via-[#ffffff] to-[#e5e7eb]" />

            {/* subtle inner ring */}
            <div className="absolute inset-16 rounded-full border border-slate-200/80 bg-white/85" />

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
        className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-8 sm:py-10 space-y-6"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Heading */}
        <motion.div className="flex flex-col gap-2" variants={fadeUp}>
          <p className="text-base font-semibold tracking-[0.18em] uppercase text-slate-700">
            How CNC business pathways compare
          </p>
          <p className="text-base text-slate-800 max-w-3xl mb-4">
            All options build business skills, but the{" "}
            <span className="font-semibold">time commitment</span> is very
            different. This overview shows where CNC’s shorter business programs
            fit alongside typical 2 year and 4 year business paths.
          </p>
        </motion.div>

        {/* Time rail */}
        <motion.div className="space-y-3" variants={fadeUp}>
          <div className="relative h-3 rounded-full bg-slate-200/80 overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#005f63] to-[#0f766e]" />
            <div className="absolute inset-y-0 left-1/4 w-1/4 bg-gradient-to-r from-[#0f766e] to-[#d97706]" />
            <div className="absolute inset-y-0 left-1/2 w-1/2 bg-gradient-to-r from-[#d97706] to-[#b91c1c]" />
          </div>

          <div className="flex justify-between text-base text-slate-800 mt-10">
            <div className="flex flex-col items-start gap-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm border border-slate-200">
                <span className="h-2 w-2 rounded-full bg-[#005f63]" />
                <span className="font-semibold">Less than 1 year</span>
              </span>
              <span>Short CNC associate certificates</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm border border-slate-200">
                <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                <span className="font-semibold">About 1 year</span>
              </span>
              <span>CNC Business Administration Certificate</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 shadow-sm border border-slate-200">
                <span className="h-2 w-2 rounded-full bg-[#b91c1c]" />
                <span className="font-semibold">2 - 4 years</span>
              </span>
              <span>Typical diplomas and degrees</span>
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid gap-4 md:grid-cols-3 mt-8"
          variants={fadeUp}
        >
          {/* Short associate certificates */}
          <motion.div
            variants={cardVariant}
            className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm hover:shadow-lg hover:border-[#005f63]/60 transition"
          >
            <div className="absolute inset-x-3 -top-1 h-1 rounded-full bg-gradient-to-r from-[#005f63] to-[#0f766e] opacity-70" />
            <div className="flex items-center gap-3">
              <p className="text-base font-semibold uppercase tracking-[0.12em] text-[#005f63]">
                Short CNC associate certificates
              </p>
            </div>
            <p className="text-base text-slate-800">
              Examples: Business Fundamentals, Business Essentials, Hospitality
              and Guest Experience Management.
            </p>
            <ul className="mt-1 space-y-1.5 text-base text-slate-800">
              <li>• Focused start on a specific area of business.</li>
              <li>• Designed to get you into the workforce sooner.</li>
              <li>• Can be stacked into longer CNC business credentials.</li>
            </ul>
          </motion.div>

          {/* 1 year CNC Business Administration Certificate */}
          <motion.div
            variants={cardVariant}
            className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-md ring-1 ring-[#d71920]/20"
          >
            <div className="absolute inset-x-3 -top-1 h-1 rounded-full bg-gradient-to-r from-[#d97706] via-[#f4b41a] to-[#d71920] opacity-90" />
            <div className="flex items-center gap-3">
              <p className="text-base font-semibold uppercase tracking-[0.12em] text-[#d71920]">
                CNC Business Administration Certificate
              </p>
            </div>
            <p className="text-base text-slate-800">
              10 courses that build a broad foundation in accounting, marketing,
              economics and core business skills.
            </p>
            <ul className="mt-1 space-y-1.5 text-base text-slate-800">
              <li>• Still shorter than many 2 year or 4 year programs.</li>
              <li>
                • Ladders directly into the CNC Business Administration Diploma.
              </li>
              <li>• Helps you qualify for a wider range of business roles.</li>
            </ul>
          </motion.div>

          {/* Typical 2 and 4 year paths */}
          <motion.div
            variants={cardVariant}
            className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm hover:shadow-lg hover:border-slate-400 transition"
          >
            <div className="absolute inset-x-3 -top-1 h-1 rounded-full bg-gradient-to-r from-[#b91c1c] to-slate-700 opacity-80" />
            <div className="flex items-center gap-3">
              <p className="text-base font-semibold uppercase tracking-[0.12em] text-slate-700">
                Typical 2 year and 4 year business paths
              </p>
            </div>
            <p className="text-base text-slate-800">
              Longer business programs offered by colleges and universities that
              sit beyond the shorter CNC business credentials on this page.
            </p>
            <ul className="mt-1 space-y-1.5 text-base text-slate-800">
              <li>• 2 year diploma or 4 year degree length.</li>
              <li>• More time before you complete the full credential.</li>
              <li>
                • CNC business pathways can be a shorter starting point before
                deciding on longer study.
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.p
          className="mt-3 text-base text-slate-700 max-w-3xl"
          variants={fadeUp}
        >
          This page highlights shorter CNC business pathways so students can see
          options that take less time than a traditional 2 year or 4 year
          program, with the ability to{" "}
          <span className="font-semibold">stack into higher credentials</span>{" "}
          later if they choose.
        </motion.p>
      </motion.div>
    </section>
  );
}
