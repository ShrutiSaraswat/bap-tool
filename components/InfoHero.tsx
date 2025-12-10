// components/InfoBapHero.tsx
"use client";

import { motion } from "framer-motion";

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
      id="info-bap-top"
      className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-100 border-b border-indigo-100/60"
    >
      {/* Background effects - same family as HomeHero */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.22),transparent_65%)]" />
        {/* Left orb */}
        <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-200/70 via-fuchsia-200/70 to-purple-300/70 blur-3xl" />
        {/* Right orb */}
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-200/80 via-violet-200/80 to-sky-200/80 blur-3xl" />
        {/* Bottom glow */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-16 md:pt-20 md:pb-18">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] items-center"
        >
          {/* Left: text */}
          <div className="space-y-6">
            <motion.div variants={item} className="inline-flex">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-base font-semibold text-indigo-700 shadow-md ring-1 ring-indigo-100">
                <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
                About Us
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.1]"
            >
              See how CNC business pathways
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                fit into your time and your plans.
              </span>
            </motion.h1>

            {/* Page highlights */}
            <motion.div
              variants={item}
              className="grid gap-3 sm:grid-cols-2 max-w-xl"
            >
              <div className="flex gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-indigo-100/70 backdrop-blur">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Time comparisons
                  </p>
                  <p className="text-base text-slate-700">
                    See how associate certificates, certificates and diplomas
                    compare to typical 2 year and 4 year business study.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-fuchsia-100/80 backdrop-blur">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 opacity-90" />
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Stackable pathways
                  </p>
                  <p className="text-base text-slate-700">
                    Understand how shorter CNC business credentials can build
                    toward a full diploma over time.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-indigo-100/80 backdrop-blur sm:col-span-2">
                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-500 opacity-90" />
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Realistic completion timelines
                  </p>
                  <p className="text-base text-slate-700">
                    Explore sample part-time timelines that fit around work,
                    family and other responsibilities.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={item}
              className="mt-2 flex flex-wrap items-center gap-3"
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
          </div>

          {/* Right: compact visual summary card */}
          <motion.div
            variants={item}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/40 blur-2xl" />
            <div className="relative rounded-3xl bg-white/90 shadow-2xl ring-1 ring-indigo-100/80 px-5 py-5 md:px-6 md:py-6 backdrop-blur">
              <p className="text-base font-semibold uppercase tracking-[0.18em] text-indigo-700 mb-3">
                On this page
              </p>

              <div className="space-y-4 text-base">
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[15px] font-semibold text-indigo-700">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Compare study length
                    </p>
                    <p className="text-base text-slate-700">
                      See where shorter CNC business options sit next to longer
                      college and university paths.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-[15px] font-semibold text-purple-700">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Follow a stackable path
                    </p>
                    <p className="text-base text-slate-700">
                      Start with an associate certificate, add courses over
                      time, and build toward a diploma.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-50 text-[15px] font-semibold text-pink-700">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">
                      Plan around real life
                    </p>
                    <p className="text-base text-slate-700">
                      Use sample timelines to think about what is realistic for
                      your schedule and goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
