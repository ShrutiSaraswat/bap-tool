// components/CncHeader.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const mainLinks = [
  {
    label: "Home",
    href: "#top",
    description: "Return to the main overview of this planning tool.",
  },
  {
    label: "By Program",
    href: "#programs",
    description: "Explore jobs, wages and pathways for each CNC program.",
  },
  {
    label: "By Course",
    href: "#courses",
    description: "Start from a specific course and see linked programs.",
  },
  {
    label: "By Skills",
    href: "#skills",
    description: "Match programs to the skills you want to build.",
  },
  {
    label: "By Job Title",
    href: "#jobs",
    description: "Find programs connected to a job you have in mind.",
  },
  {
    label: "By Earning Potential",
    href: "#earnings",
    description: "Browse pathways based on typical wage ranges.",
  },
  {
    label: "Guided Match",
    href: "#guided-match",
    description: "Describe yourself and get a tailored starting point.",
  },
];

const navItemVariant = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0 },
};

export function CncHeader() {
  const [open, setOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false); // dropdown open

  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!navMenuOpen) return;
      const target = e.target as Node;

      if (desktopMenuRef.current && desktopMenuRef.current.contains(target)) {
        return;
      }
      if (mobileMenuRef.current && mobileMenuRef.current.contains(target)) {
        return;
      }

      setNavMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navMenuOpen]);

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

          {/* Desktop nav: dropdown + apply button */}
          <motion.nav
            className="hidden md:flex items-center gap-4 text-base font-medium text-slate-800"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.05, delayChildren: 0.1 },
              },
            }}
          >
            {/* Dropdown */}
            <motion.div
              variants={navItemVariant}
              className="relative"
              ref={desktopMenuRef}
            >
              <button
                type="button"
                onClick={() => setNavMenuOpen((prev) => !prev)}
                className="cursor-pointer inline-flex items-center justify-center rounded-md bg-[#d71920] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#b8141b] hover:shadow-md transition"
              >
                Select a feature type
                {navMenuOpen ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </button>

              <AnimatePresence>
                {navMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-3 w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 z-40"
                  >
                    <div className="px-4 pt-3 pb-2 border-b border-slate-100 bg-gray-100">
                      <p className="text-base font-semibold tracking-[0.18em] uppercase text-slate-500">
                        Choose a section
                      </p>
                    </div>
                    <ul className="py-1 max-h-80 overflow-y-auto">
                      {mainLinks.map((link) => (
                        <li
                          key={link.label}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <a
                            href={link.href}
                            onClick={() => setNavMenuOpen(false)}
                            className="block px-4 py-3 text-base hover:bg-[#fee2e2] hover:text-[#b8141b] transition-colors"
                          >
                            <span className="font-semibold text-slate-900">
                              {link.label}
                            </span>
                            <span className="block text-base text-slate-500 leading-snug">
                              {link.description}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Apply button (unchanged) */}
            <motion.a
              href="#apply"
              variants={navItemVariant}
              className="inline-flex items-center rounded-md bg-gradient-to-r from-[#d71920] to-[#b8141b] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:shadow-md hover:brightness-105"
            >
              Apply to BAP
            </motion.a>
          </motion.nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-slate-300 rounded-md bg-white/90"
            onClick={() => {
              if (open) setNavMenuOpen(false);
              setOpen((o) => !o);
            }}
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
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 space-y-3 text-base font-medium text-slate-800">
              <p className="text-base text-slate-600">Choose a section</p>

              <div className="relative" ref={mobileMenuRef}>
                <button
                  type="button"
                  onClick={() => setNavMenuOpen((prev) => !prev)}
                  className="inline-flex w-full items-center justify-between rounded-md bg-[#d71920] px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#b8141b] hover:shadow-md transition"
                >
                  Select a feature type
                  {navMenuOpen ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </button>

                <AnimatePresence>
                  {navMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute inset-x-0 mt-2 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 z-40"
                    >
                      <ul className="py-1 max-h-80 overflow-y-auto">
                        {mainLinks.map((link) => (
                          <li
                            key={link.label}
                            className="border-b border-slate-100 last:border-b-0"
                          >
                            <a
                              href={link.href}
                              onClick={() => {
                                setNavMenuOpen(false);
                                setOpen(false);
                              }}
                              className="block px-4 py-3 text-base hover:bg-[#fee2e2] hover:text-[#b8141b] transition-colors"
                            >
                              <span className="font-semibold text-slate-900">
                                {link.label}
                              </span>
                              <span className="block text-base text-slate-500 leading-snug">
                                {link.description}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a
                href="#apply"
                className="mt-1 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-[#d71920] to-[#b8141b] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:shadow-md"
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
