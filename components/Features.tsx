// components/FeaturesSection.tsx
"use client";

import { motion } from "framer-motion";
import { Compass, BarChart3, Layers, Sparkles, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="
        relative overflow-hidden 
        border-b border-slate-200 
        py-10 sm:py-12
        bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50
      "
    >
      {/* soft color blobs in the background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-25 h-60 w-60 rounded-full bg-[#d71920]/18 blur-3xl" />
        <div className="absolute right-[-40px] top-25 h-60 w-60 rounded-full bg-teal-600/18 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-8">
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 border border-slate-200 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#d71920]" />
            <span className="text-base font-medium tracking-[0.14em] uppercase text-slate-700">
              What this page helps you do
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            A snapshot of your CNC business options.
          </h2>

          <p className="text-base text-slate-700 max-w-2xl mx-auto">
            See your options laid out in a simple, colorful way so you can
            compare programs, jobs and earning ranges at a glance.
          </p>
        </motion.div>

        {/* Feature tiles */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid gap-4 md:grid-cols-4"
        >
          {/* Tile 1 */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0ea5e9]/40 via-white to-emerald-200/50 p-[1px] shadow-sm">
            <div className="h-full rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-5 flex flex-col items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0ea5e9]/10">
                <Compass className="h-6 w-6 text-[#0ea5e9]" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900">
                  One place to explore
                </p>
                <p className="text-base text-slate-700">
                  Move between programs, jobs, skills and earning ranges on a
                  single, easy-to-scan page.
                </p>
              </div>
            </div>
          </div>

          {/* Tile 2 */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#f97316]/40 via-white to-[#d71920]/35 p-[1px] shadow-sm">
            <div className="h-full rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-5 flex flex-col items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d71920]/10">
                <BarChart3 className="h-6 w-6 text-[#d71920]" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900">
                  Data without overload
                </p>
                <p className="text-base text-slate-700">
                  Key details like time, earning bands and openings show up as
                  small, readable cards instead of long tables.
                </p>
              </div>
            </div>
          </div>

          {/* Tile 3 */}
          <div className="relative rounded-2xl bg-gradient-to-br from-emerald-200/60 via-white to-sky-200/60 p-[1px] shadow-sm">
            <div className="h-full rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-5 flex flex-col items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <Layers className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900">
                  Short, stackable view
                </p>
                <p className="text-base text-slate-700">
                  Quickly see how short starts can ladder into longer CNC
                  business credentials over time.
                </p>
              </div>
            </div>
          </div>

          {/* Tile 4 */}
          <div className="relative rounded-2xl bg-gradient-to-br from-sky-200/60 via-white to-rose-200/60 p-[1px] shadow-sm">
            <div className="h-full rounded-2xl bg-white/90 backdrop-blur-sm px-4 py-5 flex flex-col items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50">
                <Users className="h-6 w-6 text-sky-700" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900">
                  Easy starting point
                </p>
                <p className="text-base text-slate-700">
                  Use this page to narrow your options, then meet with CNC
                  advising with clearer questions and ideas.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
