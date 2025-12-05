// components/CncHeader.tsx
"use client";

import { useState } from "react";

const utilityLinks = [
  { label: "Events", href: "#" },
  { label: "News", href: "#" },
  { label: "Work at CNC", href: "#" },
  { label: "Give to CNC", href: "#" },
  { label: "Library", href: "#" },
  { label: "Contact", href: "#" },
];

const mainLinks = [
  { label: "Home", href: "#top" },
  { label: "By Program", href: "#programs" },
  { label: "By Job Title", href: "#jobs" },
  { label: "By Earning Potential", href: "#earnings" },
  { label: "Guided Match", href: "#guided-match" },
];

export function CncHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="shadow-md sticky top-0 z-40 bg-white">
      {/* Top red utility bar */}
      <div className="bg-[#d71920] text-white text-[11px] sm:text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-4 py-1.5 gap-3">
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 uppercase tracking-wide">
            {utilityLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:underline decoration-white/70"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Privacy highlight similar to CNC yellow strip */}
            <button className="hidden lg:inline-flex items-center px-3 py-1 bg-[#f4b41a] text-[11px] font-semibold text-slate-900 uppercase tracking-wide">
              Our Privacy Incident Response
            </button>

            {/* Login + search */}
            <button className="hidden sm:inline-flex items-center px-2.5 py-1 border border-white/70 text-[11px] rounded-sm hover:bg-white hover:text-[#d71920] transition">
              Login
            </button>
            <button
              className="inline-flex items-center justify-center w-7 h-7 border border-white/60 rounded-full hover:bg-white/10"
              aria-label="Search"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.49 20.49 19 15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-4 py-3 border-b border-slate-200">
          {/* Brand block (text version of CNC look) */}
          <a href="#top" className="flex items-center gap-3">
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-700">
                College of New Caledonia
              </span>
              <span className="text-base font-semibold text-[#d71920] tracking-[0.3em] uppercase">
                CNC
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-800">
            {mainLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative pb-1 hover:text-[#005f63] transition"
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-[#005f63] transition-all group-hover:w-full" />
              </a>
            ))}
            <a
              href="#apply"
              className="ml-2 inline-flex items-center px-3 py-1.5 text-xs font-semibold uppercase tracking-wide bg-[#d71920] text-white hover:bg-[#b8141b] rounded-sm"
            >
              Apply to BAP
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-9 h-9 border border-slate-300 rounded-sm"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-slate-800 transition-transform ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-slate-800 transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-slate-800 transition-transform ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="md:hidden border-b border-slate-200 bg-white">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 space-y-2 text-sm font-medium text-slate-800">
              {mainLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-1 py-1.5 rounded hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#apply"
                className="mt-2 inline-flex w-full items-center justify-center px-3 py-2 text-xs font-semibold uppercase tracking-wide bg-[#d71920] text-white hover:bg-[#b8141b] rounded-sm"
                onClick={() => setOpen(false)}
              >
                Apply to BAP
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
