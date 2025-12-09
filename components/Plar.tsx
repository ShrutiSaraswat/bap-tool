// components/PlarSection.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { BadgeCheck, BriefcaseBusiness, FastForward, Mail } from "lucide-react";
import Link from "next/link";

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

export function PlarSection() {
  return (
    <section
      id="plar"
      className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 bg-dots border-b border-gray-200 py-10 sm:py-12"
    >
      {/* soft background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-40 w-40 rounded-full bg-gradient-to-tr from-indigo-200/60 to-purple-200/60 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-gradient-to-tr from-pink-200/60 to-indigo-200/60 blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 space-y-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="grid gap-8 lg:grid-cols-[3fr,2fr] items-start"
          variants={fadeUp}
        >
          {/* Left column - main PLAR copy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <p className="text-sm sm:text-base font-semibold tracking-[0.22em] uppercase text-indigo-600 flex items-center">
                PLAR: Credit your experience
              </p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              PLAR: Credit Your Experience
            </h2>

            <p className="text-base sm:text-lg text-gray-700">
              Have you worked in a business-related role? You may be eligible to
              earn credit through Prior Learning Assessment and Recognition.
              Skip what you already know and move toward your credential faster.
            </p>

            {/* >>> UPDATED TYPOGRAPHY + ICON SIZE HERE <<< */}
            <div className="grid gap-5 sm:grid-cols-2 pt-2">
              <div className="flex flex-col items-start gap-3">
                <div className="mt-1 rounded-full bg-slate-200/60 border border-indigo-200 px-3 py-2.5 flex items-center gap-3 shadow-sm backdrop-blur">
                  <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    Recognize real experience
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-base text-gray-700 leading-relaxed">
                    Work in admin, HR, accounting, hospitality, small business,
                    or other business settings may count toward your studies.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3">
                <div className="mt-1 rounded-full bg-slate-200/60 border border-indigo-200 px-3 py-2.5 flex items-center gap-3 shadow-sm backdrop-blur">
                  <FastForward className="h-5 w-5 text-purple-600" />
                  <p className="text-base sm:text-lg font-semibold text-gray-900">
                    Move faster towards a credential
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-base text-gray-700 leading-relaxed">
                    PLAR can reduce the number of courses you need, helping you
                    reach an associate certificate, certificate, or diploma
                    sooner.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - contact card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-100 via-white to-pink-50 opacity-90" />
            <div className="relative h-full rounded-2xl border border-white/70 bg-white/85 shadow-2xl shadow-indigo-100 px-5 py-5 flex flex-col justify-between gap-4 backdrop-blur-md">
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-semibold tracking-[0.18em] uppercase text-gray-800 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  Contact us
                </p>

                <p className="text-sm sm:text-lg text-gray-700">
                  Not sure whether your experience qualifies for PLAR? Connect
                  with the program team to talk about your background and
                  possible credit options.
                </p>
              </div>

              <div className="flex flex-col md:flex-row text-xs md:text-sm gap-2 pt-1">
                <button
                  type="button"
                  className="cursor-pointer inline-flex items-center justify-center self-start rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5  font-semibold uppercase tracking-wide text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transition"
                >
                  Contact Us
                </button>{" "}
                <Link href="https://skylerpathfinder.com/">
                  <button
                    type="button"
                    className="cursor-pointer inline-flex items-center justify-center self-start rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 md:px-5 py-2.5 text-sm md:uppercase font-semibold tracking-wide text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transition"
                  >
                    Credit for What You Know
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
