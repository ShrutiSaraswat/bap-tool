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

export function HomeHero() {
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

      <div className="mx-auto max-w-6xl px-6 pt-14 pb-16 md:pt-18 md:pb-16 text-center relative z-1">
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
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.12] pb-1"
          >
            Start small, build real business skills,{" "}
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              and stack them into bigger opportunities.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-2 text-base md:text-2xl font-semibold text-slate-800 py-5"
          >
            Your pace, your path, your choice.
          </motion.p>

          {/* Tools grid (currently commented out) */}
          {/* <motion.div
            variants={item}
            className="mt-10 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {tools.map((tool) => {
              const isHighlight = tool.highlight;

              return (
                <motion.a
                  key={tool.label}
                  href={tool.href}
                  variants={item}
                  className={[
                    "group relative flex h-full min-h-[64px] items-center justify-center rounded-2xl px-6 md:py-0 text-center text-base font-semibold transition-transform duration-200 hover:-translate-y-1.5",
                    isHighlight
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl hover:shadow-2xl ring-2 ring-indigo-200/70"
                      : "bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-slate-900 shadow-md hover:shadow-xl border border-indigo-100 backdrop-blur-md",
                  ].join(" ")}
                >
                  {!isHighlight && (
                    <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-indigo-200/40 via-transparent to-pink-200/40 opacity-0 blur-2xl transition-opacity duration-200 group-hover:opacity-100" />
                  )}

                  <span className="text-base font-semibold">{tool.label}</span>
                </motion.a>
              );
            })}
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
}
