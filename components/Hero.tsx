// components/CncHeader.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const mainLinks = [
  { label: "Home", href: "#top" },
  { label: "By Program", href: "#programs" },
  { label: "By Skills", href: "#skills" },
  { label: "By Job Title", href: "#jobs" },
  { label: "By Earning Potential", href: "#earnings" },
  { label: "Guided Match", href: "#guided-match" },
];

const navItemVariant = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0 },
};

export function CncHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow border-b ${
        scrolled ? "shadow-lg border-slate-200" : "shadow-sm border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between py-3 sm:py-3.5">
          {/* Brand */}
          <motion.a
            href="#top"
            className="flex items-stretch gap-3"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Left color bar for a more logo feel */}
            <div className="hidden sm:block w-1.5 rounded-full bg-[#d71920]" />
            <div className="flex flex-col justify-center leading-tight">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-slate-700">
                College of New Caledonia
              </span>
              <span className="text-lg sm:text-xl font-semibold text-[#d71920] tracking-[0.36em] uppercase">
                CNC
              </span>
            </div>
          </motion.a>

          {/* Desktop nav */}
          <motion.nav
            className="hidden md:flex items-center gap-7 text-base font-medium text-slate-800"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.05, delayChildren: 0.1 },
              },
            }}
          >
            {mainLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                variants={navItemVariant}
                className="relative group pb-1 hover:text-[#005f63] transition-colors"
              >
                {link.label}
                <span className="pointer-events-none absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 origin-left bg-[#005f63] transition-transform group-hover:scale-x-100" />
              </motion.a>
            ))}
            <motion.a
              href="#apply"
              variants={navItemVariant}
              className="ml-2 inline-flex items-center rounded-md bg-gradient-to-r from-[#d71920] to-[#b8141b] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:shadow-md hover:brightness-105"
            >
              Apply to BAP
            </motion.a>
          </motion.nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-slate-300 rounded-md bg-white/90"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-slate-800 transition-transform ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-slate-800 transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-slate-800 transition-transform ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Thin accent bar under header for CNC feel */}
      <div className="h-0.5 bg-gradient-to-r from-[#d71920] via-[#005f63] to-[#d71920] shadow-[0_1px_0_rgba(0,0,0,0.06)]" />

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="md:hidden bg-white border-b border-slate-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 space-y-1.5 text-base font-medium text-slate-800">
              {mainLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-1 py-2 rounded hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#apply"
                className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-[#d71920] to-[#b8141b] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:shadow-md"
                onClick={() => setOpen(false)}
              >
                Apply to BAP
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
