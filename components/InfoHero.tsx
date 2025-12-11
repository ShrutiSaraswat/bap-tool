// components/HomeHero.tsx
"use client";

import { motion } from "framer-motion";

const tools = [
  {
    label: "By Program",
    href: "#programs",
  },
  {
    label: "Not sure yet? Try Guided Match",
    href: "#guided-match",
    highlight: true,
  },
  {
    label: "By Course",
    href: "#courses",
  },
  {
    label: "By Skills",
    href: "#skills",
  },
  {
    label: "By Job Title",
    href: "#jobs",
  },
  {
    label: "By Earning Potential",
    href: "#earnings",
  },
];

const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function InfoBapHero() {
  return (
    <section
      id="top"
      className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-100"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft central spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.18),transparent_65%)]" />
        {/* Left orb */}
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-gradient-to-tr from-pink-200/70 to-purple-300/70 blur-3xl" />
        {/* Right orb */}
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-200/70 to-indigo-200/70 blur-3xl" />
        {/* Bottom glow bar */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 via-white/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-14 pb-16 md:pt-22 md:pb-20 text-center relative z-1">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-5xl flex-col items-center"
        >
          {/* Program tag */}
          <motion.div variants={item} className="mb-9 flex justify-center">
            <span className="inline-flex items-center rounded-full bg-white px-6 py-2 text-sm md:text-base font-semibold text-indigo-700 shadow-lg ring-1 ring-indigo-100">
              Business Administration Program
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.1]"
          >
            See how CNC business pathways
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              fit into your time and your plans.
            </span>
          </motion.h1>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <a
              href="#completion-timeline"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition"
            >
              View completion timelines
            </a>
            <a
              href="/#programs"
              className="inline-flex items-center justify-center rounded-full bg-white/90 px-5 py-2.5 text-base font-semibold text-slate-900 shadow-sm ring-1 ring-indigo-100 hover:bg-indigo-50/80 hover:ring-indigo-200 transition"
            >
              Back to program tools
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
