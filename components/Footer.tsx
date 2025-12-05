// components/CncFooter.tsx
"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

export function CncFooter() {
  return (
    <footer className="relative bg-slate-900 text-slate-100 border-t border-slate-800 overflow-hidden">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-44 w-44 rounded-full bg-[#005f63]/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-52 w-52 rounded-full bg-[#d71920]/40 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-8 sm:py-10 space-y-8">
        {/* Top CTA strip */}
        <div className="rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-800/90 via-slate-900 to-slate-950 px-5 py-5 sm:px-7 sm:py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-slate-300">
              Business Administration Program · CNC
            </p>
            <p className="text-2xl font-semibold text-white">
              Ready to talk about your next step in business at CNC?
            </p>
            <p className="text-base text-slate-200">
              Use this tool to explore options, then connect with CNC advisors
              for program planning, admissions and supports that fit your life.
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[220px]">
            <Link
              href="#guided-match"
              className="inline-flex items-center justify-center rounded-lg bg-[#f97316] px-4 py-2.5 text-base font-semibold text-slate-900 hover:bg-[#fb923c] transition shadow-md"
            >
              Try guided match
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="#top"
              className="inline-flex items-center justify-center rounded-lg border border-slate-500 px-4 py-2.5 text-base font-semibold text-slate-100 hover:bg-slate-800 transition"
            >
              Back to top
            </a>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid gap-8 md:grid-cols-[2fr,1.4fr,1.4fr]">
          {/* Column 1 - about this tool */}
          <div className="space-y-3">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-slate-300">
              About this planning tool
            </p>
            <p className="text-base text-slate-200">
              This page brings together CNC Business Administration Program
              (BAP) information and labour market data so students can compare
              short, stackable business pathways with typical jobs, earning
              bands and regional opportunities in northern BC.
            </p>
            <p className="text-base text-slate-400">
              The information here is approximate and for exploration only.
              Students should always confirm details with CNC advisors and the
              official CNC website.
            </p>
          </div>

          {/* Column 2 - navigation links */}
          <div className="space-y-3">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-slate-300">
              Explore on this page
            </p>
            <nav className="space-y-2 text-base text-slate-200">
              <Link
                href="#programs"
                className="block hover:text-white hover:underline underline-offset-4"
              >
                By program - jobs, time and stackability
              </Link>
              <Link
                href="#jobs"
                className="block hover:text-white hover:underline underline-offset-4"
              >
                By job title - wages and openings
              </Link>
              <Link
                href="#earnings"
                className="block hover:text-white hover:underline underline-offset-4"
              >
                By earning potential - wage bands
              </Link>
              <Link
                href="#skills"
                className="block hover:text-white hover:underline underline-offset-4"
              >
                By skills - what you want to develop
              </Link>
              <Link
                href="#guided-match"
                className="block hover:text-white hover:underline underline-offset-4"
              >
                Guided match - describe yourself in your own words
              </Link>
            </nav>
          </div>

          {/* Column 3 - CNC and contact */}
          <div className="space-y-3">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-slate-300">
              CNC and program advising
            </p>
            <div className="space-y-2 text-base text-slate-200">
              <a
                href="https://www.cnc.bc.ca"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-white hover:underline underline-offset-4"
              >
                Visit CNC website
                <ExternalLink className="h-4 w-4" />
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="mt-[3px] h-4 w-4 text-slate-300" />
                <span>
                  College of New Caledonia campuses serve students across Prince
                  George, Quesnel, Vanderhoof and northern regions.
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-300" />
                <span>
                  Connect with CNC student services for advising and support.
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-300" />
                <span>
                  Use the CNC contact form or program advising channels for the
                  latest details on admissions and requirements.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-slate-800 pt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-slate-400">
            © {new Date().getFullYear()} College of New Caledonia · Business
            Administration Program.
          </p>
          <div className="flex flex-wrap gap-4 text-base text-slate-400">
            <button className="hover:text-slate-200 hover:underline underline-offset-4">
              Accessibility and alternate formats
            </button>
            <button className="hover:text-slate-200 hover:underline underline-offset-4">
              Privacy and data use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
