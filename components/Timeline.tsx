// components/CompletionTimelineSection.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { Timer, CalendarClock, ArrowRight } from "lucide-react";

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

export function CompletionTimelineSection() {
  return (
    <section
      id="completion-timeline"
      className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-100 border-b border-indigo-100/70 py-10 sm:py-12"
    >
      {/* subtle background accents, matching info-bap hero vibe */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-52 w-52 rounded-full bg-gradient-to-tr from-pink-200/55 via-fuchsia-200/45 to-purple-200/45 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-60 w-60 rounded-full bg-gradient-to-tr from-indigo-200/55 via-sky-200/45 to-purple-200/45 blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Heading and intro copy */}
        <motion.div className="space-y-3 max-w-3xl" variants={fadeUp}>
          <p className="text-base font-semibold tracking-[0.18em] uppercase text-indigo-700 flex items-center gap-2">
            Part-Time Study Pathway
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Fit business study around real life.
          </h2>
          <p className="text-base text-slate-800">
            Life is busy. Part-time paths let you finish an associate
            certificate in 2 years, a certificate in 3, and a diploma in 5. You
            don&apos;t need to change your lifestyle to earn a business
            credential. Start small and keep moving.
          </p>
        </motion.div>

        {/* Timeline cards */}
        <motion.div
          className="grid gap-4 sm:gap-5 md:grid-cols-3"
          variants={fadeUp}
        >
          {/* Associate certificate */}
          <div className="relative rounded-2xl border border-indigo-100 bg-white/95 shadow-[0_14px_40px_rgba(79,70,229,0.18)] px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                {/* <p className="text-base font-semibold tracking-[0.16em] uppercase text-indigo-700">
                  First step
                </p> */}
                <h3 className="text-base font-semibold text-slate-900">
                  Associate certificate
                </h3>
              </div>
              <CalendarClock className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="text-base text-slate-800">
              Designed for part-time study while you work or manage other
              responsibilities.
            </p>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-slate-700">
                Suggested Completion Timeline:
              </p>
              <div className="flex items-center gap-2">
                {/* <div className="h-2 flex-1 rounded-full bg-indigo-100">
                  <div className="h-2 w-1/3 rounded-full bg-indigo-500" />
                </div> */}
                <p className="text-base font-medium text-indigo-600">
                  About 2 years
                </p>
              </div>
            </div>
          </div>

          {/* Certificate */}
          <div className="relative rounded-2xl border border-purple-100 bg-white/95 shadow-[0_14px_40px_rgba(147,51,234,0.16)] px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                {/* <p className="text-base font-semibold tracking-[0.16em] uppercase text-purple-700">
                  Build on your start
                </p> */}
                <h3 className="text-base font-semibold text-slate-900">
                  Certificate
                </h3>
              </div>
              <CalendarClock className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-base text-slate-800">
              Keep adding courses at a steady part-time pace to complete the
              full certificate.
            </p>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-slate-700">
                Suggested Completion Timeline:
              </p>
              <div className="flex items-center gap-2">
                {/* <div className="h-2 flex-1 rounded-full bg-purple-100">
                  <div className="h-2 w-1/2 rounded-full bg-purple-500" />
                </div> */}
                <p className="text-base font-medium text-purple-600">
                  About 3 years
                </p>
              </div>
            </div>
          </div>

          {/* Diploma */}
          <div className="relative rounded-2xl border border-pink-100 bg-white/95 shadow-[0_14px_40px_rgba(236,72,153,0.18)] px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                {/* <p className="text-base font-semibold tracking-[0.16em] uppercase text-pink-700">
                  Longer pathway
                </p> */}
                <h3 className="text-base font-semibold text-slate-900">
                  Diploma
                </h3>
              </div>
              <CalendarClock className="h-6 w-6 text-pink-500" />
            </div>
            <p className="text-base text-slate-800">
              Stack associate certificates and certificate studies into a full
              business diploma.
            </p>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-slate-700">
                Suggested Completion Timeline:
              </p>
              <div className="flex items-center gap-2">
                {/* <div className="h-2 flex-1 rounded-full bg-pink-100">
                  <div className="h-2 w-full rounded-full bg-pink-500" />
                </div> */}
                <p className="text-base font-medium text-pink-600">
                  About 5 years
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Small reassurance footer line */}
        <motion.div
          className="flex items-center gap-2 text-base text-slate-700"
          variants={fadeUp}
        >
          <ArrowRight className="h-4 w-4 text-indigo-600" />
          <p>
            You can pause and restart along the way. Credits you earn continue
            to count toward the next level.
          </p>
        </motion.div>

        <motion.div className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href="/#programs"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition"
          >
            Explore Programs
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
