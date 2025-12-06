// components/HeroIntro.tsx
"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function HeroIntro() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-[#fff7f7] via-[#eff6ff] to-[#ecfeff]">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft color blobs */}
        <div className="absolute -left-16 -top-10 h-56 w-56 rounded-full bg-[#d71920]/20 blur-3xl" />
        <div className="absolute right-[-32px] top-6 h-64 w-64 rounded-full bg-[#005f63]/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-3xl" />

        {/* Hero decorative rings - no text, just colorful shapes */}

        {/* Large multi ring - top right */}
        <div className="absolute -right-[720px] -top-[15%] h-[1000px] w-[1000px]">
          <div className="relative h-full w-full">
            {/* Warm teal red band */}
            <div className="absolute inset-1 rounded-full bg-[conic-gradient(from_120deg,rgba(0,95,99,0.98),rgba(15,23,42,0.16),rgba(215,25,32,0.2),rgba(244,180,26,0.2),rgba(0,95,99,0.18))] opacity-90" />
            {/* Outer white ring */}
            <div className="absolute inset-3 rounded-full border-[12px] border-white/78 shadow-[0_0_0_1px_rgba(148,163,184,0.35)]" />
            {/* Inner dark ring */}
            <div className="absolute inset-11 rounded-full border-[8px] border-[#0f172a]/22" />
          </div>
        </div>

        {/* Large multi ring - bottom right */}
        <div className="absolute right-0 bottom-0 h-100 w-100">
          <div className="relative h-full w-full">
            <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(148,163,184,0.32),transparent_70%)]" />
            <div className="absolute inset-3 rounded-full border-[6px] border-white/75 shadow-[0_0_0_1px_rgba(148,163,184,0.3)]" />
          </div>
        </div>

        {/* Small accent ring - mid left */}
        <div className="absolute -left-[10%] top-[28%] h-100 w-100">
          <div className="relative h-full w-full">
            <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(148,163,184,0.32),transparent_70%)]" />
            <div className="absolute inset-3 rounded-full border-[6px] border-white/75 shadow-[0_0_0_1px_rgba(148,163,184,0.3)]" />
          </div>
        </div>

        {/* Bottom soft band */}
        <div className="absolute inset-x-6 bottom-[-4rem] h-40 rounded-[3rem] bg-gradient-to-r from-[#0f172a]/7 via-transparent to-[#0f172a]/7 blur-2xl" />

        {/* Subtle radial tint over everything */}
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_60%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-10 sm:py-12 lg:py-16 grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
        {/* Left copy */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.04 },
            },
          }}
          className="space-y-6"
        >
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-base font-semibold tracking-[0.18em] uppercase text-[#005f63] shadow-sm"
          >
            Business Administration Program · CNC
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight"
          >
            Explore short, stackable{" "}
            <span className="text-[#d71920]">business pathways</span> at CNC.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base lg:text-lg text-slate-800 max-w-2xl"
          >
            This page helps future students and recruiters compare programs, job
            options, earning potential and opportunities in northern BC. You can
            start with a short credential now and later stack into a 1 year
            certificate or 2 year diploma when you are ready.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-1 flex flex-wrap gap-3">
            <a
              href="#programs"
              className="inline-flex items-center rounded-md bg-[#d71920] px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#b8141b] hover:shadow-md transition"
            >
              Start with a program
            </a>
            <a
              href="#guided-match"
              className="inline-flex items-center rounded-md border border-slate-300 bg-white/80 px-5 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100 transition"
            >
              Not sure yet? Try guided match
            </a>
          </motion.div>

          {/* Quick facts - full width */}
          <motion.div
            variants={fadeUp}
            className="mt-4 grid w-full gap-3 text-base text-slate-800 sm:grid-cols-3"
          >
            <div className="border border-slate-200 bg-white/90 px-4 py-3 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
              <p className="font-semibold text-slate-900">
                3 associate certificates
              </p>
              <p>
                Business Essentials, Business Fundamentals and Hospitality and
                Guest Experience Management.
              </p>
            </div>
            <div className="border border-slate-200 bg-white/90 px-4 py-3 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
              <p className="font-semibold text-slate-900">
                1 year certificate option
              </p>
              <p>
                Shorter time commitment than most 2 year and 4 year business
                programs.
              </p>
            </div>
            <div className="border border-slate-200 bg-white/90 px-4 py-3 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.12)]">
              <p className="font-semibold text-slate-900">
                Labour market informed
              </p>
              <p>
                Uses NOC codes, wage bands and outlook data for northern BC and
                provincial labour markets.
              </p>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="pt-1 text-base text-slate-700 max-w-2xl"
          >
            All information comes from the Business Administration Program (BAP)
            labour market analysis. It is a planning tool to support
            conversations with students and does not replace official CNC
            advising.
          </motion.p>
        </motion.div>

        {/* Right panel – how to use this page */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[1.8rem] bg-gradient-to-br from-[#005f63]/30 via-[#d71920]/25 to-[#0f172a]/35 blur-xl" />
          <div className="relative rounded-[1.6rem] bg-gradient-to-br from-white via-white/95 to-slate-50 border border-slate-200/80 shadow-[0_18px_40px_rgba(15,23,42,0.16)] overflow-hidden">
            <div className="bg-gradient-to-r from-[#005f63] via-[#0f172a] to-[#d71920] text-white px-5 py-3 flex items-center justify-between">
              <span className="text-base font-semibold tracking-[0.18em] uppercase">
                How to use it
              </span>
              <span className="text-base opacity-80">
                Directed search for BAP pathways
              </span>
            </div>

            <div className="p-5 space-y-4 text-base text-slate-800">
              <p className="font-semibold">
                Choose a starting point that matches how you like to explore:
              </p>

              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-8 w-8 shrink-0 rounded-full border border-[#d71920]/40 bg-[#d71920]/10 text-base font-semibold text-[#d71920] flex items-center justify-center">
                    1
                  </span>
                  <span>
                    <strong>By program</strong> - see time commitment, job
                    prospects, earning potential and regional opportunities for
                    a specific CNC business credential.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 h-8 w-8 shrink-0 rounded-full border border-[#005f63]/40 bg-[#005f63]/10 text-base font-semibold text-[#005f63] flex items-center justify-center">
                    2
                  </span>
                  <span>
                    <strong>By skills you want to build</strong> - if you know
                    you enjoy customer service, accounting, leadership or
                    similar skills and want to see which programs strengthen
                    them.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 h-8 w-8 shrink-0 rounded-full border border-[#f4b41a]/50 bg-[#f4b41a]/20 text-base font-semibold text-[#8a5a00] flex items-center justify-center">
                    3
                  </span>
                  <span>
                    <strong>By job title or earning potential</strong> - when
                    you have a role or wage band in mind and want to find the
                    CNC pathway that connects there.
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-1 h-8 w-8 shrink-0 rounded-full border border-slate-400/50 bg-slate-100 text-base font-semibold text-slate-800 flex items-center justify-center">
                    4
                  </span>
                  <span>
                    <strong>Guided match</strong> - type a short description of
                    yourself and your interests, and the tool will suggest
                    starting programs from the BAP list using static rules.
                  </span>
                </li>
              </ol>

              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href="#programs"
                  className="inline-flex items-center rounded-md bg-[#d71920] px-4 py-2.5 text-base font-semibold text-white hover:bg-[#b8141b] transition"
                >
                  Explore by program
                </a>
                <a
                  href="#skills"
                  className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-base font-semibold text-slate-900 hover:bg-slate-100 transition"
                >
                  Explore by skills
                </a>
                <a
                  href="#jobs"
                  className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-base font-semibold text-slate-900 hover:bg-slate-100 transition"
                >
                  Explore by job title
                </a>
              </div>

              <p className="pt-1 text-base text-slate-700">
                Staff can open this page during presentations or school visits
                and walk students through options using the same information
                shown in the colourful BAP framework materials.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
