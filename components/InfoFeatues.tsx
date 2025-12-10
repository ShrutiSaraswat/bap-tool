// components/InfoBapFeaturesSection.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { Clock, Layers, LineChart } from "lucide-react";

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

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function InfoBapFeaturesSection() {
  return (
    <section
      id="info-bap-features"
      className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/50 to-pink-50/70 border-b border-indigo-100/70"
    >
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 h-52 w-52 rounded-full bg-gradient-to-tr from-pink-200/50 via-fuchsia-200/40 to-purple-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-60 w-60 rounded-full bg-gradient-to-tr from-indigo-200/50 via-sky-200/40 to-purple-200/40 blur-3xl" />
      </div>

      <motion.div
        className="relative mx-auto max-w-6xl px-6 py-10 sm:py-14 space-y-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.24 }}
      >
        {/* Heading */}
        <motion.div className="space-y-3 max-w-3xl" variants={fadeUp}>
          <p className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-base font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-100">
            What this page helps you see
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug">
            A clear snapshot of how the Business Administration Program fits
            your time, pace and next steps.
          </h2>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={fadeUp}
        >
          {/* Time and length */}
          <motion.div
            variants={cardVariant}
            className="group relative flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-white/90 px-4 py-4 shadow-sm hover:shadow-lg hover:border-indigo-200 transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-900">
                How long each option takes
              </p>
            </div>
            <p className="text-base text-slate-700">
              Compare shorter CNC business credentials with typical 2 year and 4
              year paths so you know what each choice means for your calendar.
            </p>
          </motion.div>

          {/* Stackability */}
          <motion.div
            variants={cardVariant}
            className="group relative flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white/90 px-4 py-4 shadow-sm hover:shadow-lg hover:border-purple-200 transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 text-white shadow-md">
                <Layers className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-900">
                How credentials stack over time
              </p>
            </div>
            <p className="text-base text-slate-700">
              See how an associate certificate can lead into a certificate and
              then a diploma without losing the progress you make along the way.
            </p>
          </motion.div>

          {/* Realistic paths */}
          <motion.div
            variants={cardVariant}
            className="group relative flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white/90 px-4 py-4 shadow-sm hover:shadow-lg hover:border-pink-200 transition lg:col-span-1 sm:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 text-white shadow-md">
                <LineChart className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-slate-900">
                What a realistic path could look like
              </p>
            </div>
            <p className="text-base text-slate-700">
              Use the sample completion timelines to picture how part-time study
              could fit with work, family and other commitments over the next
              few years.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
