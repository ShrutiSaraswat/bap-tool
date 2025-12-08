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
      className="relative overflow-hidden bg-gradient-to-br from-[#fff1f2] via-red-900/10 to-slate-200 border-b border-slate-200 py-10 sm:py-12"
    >
      {/* subtle background accents, matching hero vibe */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-52 w-52 rounded-full bg-rose-200/45 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-60 w-60 rounded-full bg-amber-200/45 blur-3xl" />
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
          <p className="text-base font-semibold tracking-[0.18em] uppercase text-[#b91c1c] flex items-center gap-2">
            Completion timeline
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
          <div className="relative rounded-2xl border border-rose-200 bg-white/95 shadow-[0_14px_40px_rgba(127,29,29,0.18)] px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] uppercase text-rose-700">
                  First step
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Associate certificate
                </h3>
              </div>
              <CalendarClock className="h-6 w-6 text-rose-600" />
            </div>
            <p className="text-base text-slate-800">
              Designed for part-time study while you work or manage other
              responsibilities.
            </p>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-700">
                Typical completion:
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-rose-100">
                  <div className="h-2 w-1/3 rounded-full bg-rose-500" />
                </div>
                <p className="text-sm font-medium text-slate-800">
                  About 2 years
                </p>
              </div>
            </div>
          </div>

          {/* Certificate */}
          <div className="relative rounded-2xl border border-slate-300 bg-white/95 shadow-[0_14px_40px_rgba(180,83,9,0.16)] px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] uppercase text-amber-700">
                  Build on your start
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Certificate
                </h3>
              </div>
              <CalendarClock className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-base text-slate-800">
              Keep adding courses at a steady part-time pace to complete the
              full certificate.
            </p>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-700">
                Typical completion:
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-amber-100">
                  <div className="h-2 w-1/2 rounded-full bg-amber-500" />
                </div>
                <p className="text-sm font-medium text-slate-800">
                  About 3 years
                </p>
              </div>
            </div>
          </div>

          {/* Diploma */}
          <div className="relative rounded-2xl border border-orange-200 bg-white/95 shadow-[0_14px_40px_rgba(194,65,12,0.18)] px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] uppercase text-orange-700">
                  Longer pathway
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Diploma
                </h3>
              </div>
              <CalendarClock className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-base text-slate-800">
              Stack associate certificates and certificate studies into a full
              business diploma.
            </p>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-700">
                Typical completion:
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-orange-100">
                  <div className="h-2 w-full rounded-full bg-orange-500" />
                </div>
                <p className="text-sm font-medium text-slate-800">
                  About 5 years
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Small reassurance footer line */}
        <motion.div
          className="flex items-center gap-2 text-sm sm:text-base text-slate-700"
          variants={fadeUp}
        >
          <ArrowRight className="h-4 w-4 text-[#b91c1c]" />
          <p>
            You can pause and restart along the way. Credits you earn continue
            to count toward the next level.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
