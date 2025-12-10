// components/CncHeader.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const mainLinks = [
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
  const hoverTimeoutRef = useRef<number | null>(null);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleDesktopMenuEnter = () => {
    clearHoverTimeout();
    setNavMenuOpen(true);
  };

  const handleDesktopMenuLeave = () => {
    clearHoverTimeout();
    // small delay so user can move through any gap between button and menu
    hoverTimeoutRef.current = window.setTimeout(() => {
      setNavMenuOpen(false);
    }, 220);
  };

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
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-shadow ${
        scrolled
          ? "bg-gradient-to-r from-indigo-50 via-white to-pink-50 shadow-lg border-indigo-100/70"
          : "bg-gradient-to-r from-indigo-50 via-white to-pink-50/90 shadow-sm border-transparent"
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
            <div className="hidden sm:block w-1.5 rounded-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
            <div className="flex flex-col justify-center leading-tight">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-slate-600">
                College of New Caledonia
              </span>
              <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-[0.32em] uppercase">
                CNC Pathways
              </span>
            </div>
          </motion.a>

          {/* Desktop nav: home link + dropdown + apply button */}
          <motion.nav
            className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-800"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.05, delayChildren: 0.1 },
              },
            }}
          >
            <motion.a
              href="/"
              variants={navItemVariant}
              className="text-base font-medium text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Home
            </motion.a>

            <motion.a
              href="/about"
              variants={navItemVariant}
              className="text-base font-medium text-slate-700 hover:text-indigo-600 transition-colors"
            >
              About
            </motion.a>

            {/* Dropdown */}
            <motion.div
              variants={navItemVariant}
              className="relative"
              ref={desktopMenuRef}
              onMouseEnter={handleDesktopMenuEnter}
              onMouseLeave={handleDesktopMenuLeave}
            >
              <button
                type="button"
                onClick={() => setNavMenuOpen((prev) => !prev)}
                className="cursor-pointer inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-base font-semibold uppercase tracking-wide text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition"
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
                    className="absolute right-0 mt-3 w-96 rounded-2xl border border-indigo-100 bg-white/95 shadow-2xl shadow-slate-900/10 ring-1 ring-indigo-100 z-40 backdrop-blur-md"
                  >
                    <div className="px-4 pt-3 pb-2 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-pink-50">
                      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
                        Choose a section
                      </p>
                    </div>
                    <ul className="py-1 max-h-80 overflow-y-auto">
                      {mainLinks.map((link) => (
                        <li
                          key={link.label}
                          className="border-b border-slate-200/70 last:border-b-0"
                        >
                          <a
                            href={link.href}
                            onClick={() => setNavMenuOpen(false)}
                            className="block px-4 py-3 text-sm hover:bg-indigo-50/70 hover:text-indigo-700 transition-colors"
                          >
                            <span className="font-semibold text-slate-900">
                              {link.label}
                            </span>
                            <span className="block text-sm text-slate-500 leading-snug">
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

            {/* Apply button */}
            <motion.a
              href="#apply"
              variants={navItemVariant}
              className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-base font-semibold uppercase tracking-wide text-indigo-700 shadow-md ring-1 ring-indigo-100 hover:bg-white hover:shadow-md"
            >
              Apply to BAP
            </motion.a>
          </motion.nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 border border-indigo-100 rounded-xl bg-white/90 shadow-sm"
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

      {/* Thin accent bar under header */}
      <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_1px_0_rgba(0,0,0,0.04)]" />

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="md:hidden bg-gradient-to-b from-indigo-50 via-white to-pink-50 border-b border-indigo-100/70"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 space-y-3 text-sm font-medium text-slate-800">
              <a
                href="/"
                className="block rounded-md px-3 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                onClick={() => setOpen(false)}
              >
                Home
              </a>

              <a
                href="/about"
                className="block rounded-md px-3 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                onClick={() => setOpen(false)}
              >
                About
              </a>
              <div className="relative" ref={mobileMenuRef}>
                <button
                  type="button"
                  onClick={() => setNavMenuOpen((prev) => !prev)}
                  className="inline-flex w-full items-center justify-between rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transition"
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
                      className="absolute inset-x-0 mt-2 rounded-2xl border border-indigo-100 bg-white/95 shadow-2xl shadow-slate-900/10 ring-1 ring-indigo-100 z-40 backdrop-blur-md"
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
                              className="block px-4 py-3 text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              <span className="font-semibold text-slate-900">
                                {link.label}
                              </span>
                              <span className="block text-sm text-slate-500 leading-snug">
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
                className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 shadow-sm ring-1 ring-indigo-100 hover:bg-white hover:shadow-md"
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
