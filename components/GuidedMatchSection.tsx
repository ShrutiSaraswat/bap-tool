// components/GuidedMatchSection.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Program = {
  id: string;
  name: string;
  credentialType?: string;
  overview?: string;
  timeCommitment?: { label?: string; approxMonths?: number };
  stackability?: { isStackable?: boolean; stackMessage?: string };
  earningBand?: string;
  opportunityBand?: string;
  skills?: string[]; // make sure you have some skills in programs.json for better matching
};

type ProgramScore = {
  program: Program;
  score: number;
};

const earningBandLabels: Record<string, string> = {
  entry: "Entry ($18-22/hr approx.)",
  entry_to_medium: "Entry to medium ($20-26/hr approx.)",
  medium: "Medium ($24-30/hr approx.)",
  medium_high: "Medium to high ($28-35+ /hr approx.)",
};

const opportunityLabels: Record<string, string> = {
  medium: "Some opportunities in the region",
  medium_high: "Good opportunities in the region",
  high: "Strong opportunities in the region",
  very_high: "Very strong and stable demand",
  broad: "Broad opportunities across sectors",
  emerging: "Emerging or growing area",
};

function matchStrengthLabel(score: number): string {
  if (score >= 10) return "Strong match";
  if (score >= 5) return "Good match";
  return "Initial match";
}

// Very small stopword list so we do not score on “and / the / to / in…”
const STOP_WORDS = new Set([
  "the",
  "and",
  "or",
  "for",
  "of",
  "to",
  "in",
  "on",
  "with",
  "a",
  "an",
  "at",
  "by",
  "from",
  "about",
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitWords(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((w) => w && !STOP_WORDS.has(w));
}

// Simple scoring using only frontend data
function scoreProgram(program: Program, input: string): number {
  if (!input.trim()) return 0;

  const loweredInput = input.toLowerCase();
  const inputWords = new Set(splitWords(input));

  let score = 0;

  // 1) Exact skill phrase hits (high weight)
  if (program.skills && program.skills.length > 0) {
    for (const skill of program.skills) {
      const s = skill.toLowerCase().trim();
      if (!s) continue;

      // full phrase match
      if (loweredInput.includes(s)) {
        score += 4;
        continue;
      }

      // partial word overlap within the skill phrase
      const skillWords = splitWords(s);
      const matches = skillWords.filter((w) => inputWords.has(w)).length;
      if (matches > 0) {
        score += 1 + matches; // small boost per overlapping word
      }
    }
  }

  // 2) Program name overlap
  const nameWords = splitWords(program.name || "");
  const nameHits = nameWords.filter((w) => inputWords.has(w)).length;
  if (nameHits > 0) {
    score += 1 + nameHits;
  }

  // 3) Overview overlap (lighter weight)
  if (program.overview) {
    const overviewWords = splitWords(program.overview);
    const overlap = overviewWords.filter((w) => inputWords.has(w)).length;
    if (overlap > 0) {
      score += Math.min(3, overlap); // cap so overview does not dominate
    }
  }

  return score;
}

// Motion variants
const sectionContainer = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const fadeChild = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const resultItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};

export function GuidedMatchSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [text, setText] = useState("");
  const [results, setResults] = useState<ProgramScore[] | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    fetch("/programs.json")
      .then((res) => res.json())
      .then((data: Program[]) => setPrograms(data))
      .catch((err) => console.error("Error loading programs.json", err));
  }, []);

  function runMatch() {
    const input = text.trim();
    setTouched(true);

    if (!input || programs.length === 0) {
      setResults(null);
      return;
    }

    const scored: ProgramScore[] = programs
      .map((program) => ({
        program,
        score: scoreProgram(program, input),
      }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);

    setResults(scored.length > 0 ? scored : null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runMatch();
  }

  const showEmptyState = touched && !results;

  return (
    <section
      id="guided-match"
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 py-10 sm:py-12 border-t border-slate-200"
    >
      {/* soft background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-16 h-64 w-64 rounded-full bg-[#005f63]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#d71920]/10 blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-7"
        variants={sectionContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Heading block */}
        <motion.div className="max-w-3xl space-y-3" variants={fadeChild}>
          <p className="text-base font-semibold tracking-[0.2em] uppercase text-[#005f63]">
            Guided match
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Not sure where to start? Try a guided match.
          </h2>
          <p className="text-base text-slate-800">
            In your own words, describe the kinds of work you enjoy, the
            subjects you like, or the environment you want to be in. The tool
            compares what you write with the skills and focus areas in each CNC
            business program and suggests possible starting points.
          </p>
        </motion.div>

        {/* Input + actions */}
        <motion.form
          onSubmit={handleSubmit}
          className="grid gap-5 lg:grid-cols-[2fr,3fr] items-start"
          variants={fadeChild}
        >
          <div className="space-y-4">
            <label
              htmlFor="guided-text"
              className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700"
            >
              Tell us a bit about you
            </label>
            <textarea
              id="guided-text"
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63] resize-vertical"
              placeholder="For example: I like working with people in hotels or restaurants, I enjoy planning events, and I want a program that lets me start working sooner and possibly move into management later."
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-[#d71920] px-5 py-3 text-base font-semibold text-white hover:bg-[#b8141b] shadow-sm hover:shadow-md transition cursor-pointer"
              >
                See suggested programs
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                onClick={() =>
                  setText(
                    "I like working with people, guests and visitors. I enjoy social media and events, and I want to start in a shorter business program that can lead to management later."
                  )
                }
              >
                Use an example
              </button>
            </div>

            <p className="text-base text-slate-700">
              This is a planning tool to help you think about options. It does
              not replace speaking with CNC advising or submitting an
              application.
            </p>
          </div>

          {/* Results panel */}
          <motion.div
            className="border border-slate-200 rounded-2xl bg-white/95 overflow-hidden shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
            variants={fadeChild}
          >
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 px-5 py-4">
              <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700">
                Suggested CNC programs
              </p>
              <p className="mt-2 text-base text-slate-800">
                Results are ordered from strongest to lighter match based on how
                closely your description aligns with each program.
              </p>
            </div>

            <div className="px-5 py-4 space-y-4 max-h-[380px] overflow-y-auto text-base">
              {!touched && (
                <p className="text-base text-slate-800">
                  Type a few sentences and select{" "}
                  <span className="font-semibold">See suggested programs</span>{" "}
                  to view matches here.
                </p>
              )}

              {showEmptyState && (
                <p className="text-base text-slate-800">
                  There is not a clear match yet. Try adding more detail about
                  the kinds of tasks you enjoy, the setting you prefer (office,
                  hospitality, finance, marketing) or whether you want to start
                  working quickly and build further credentials later.
                </p>
              )}

              {results &&
                results.map((result) => {
                  const p = result.program;
                  const matchLabel = matchStrengthLabel(result.score);
                  return (
                    <motion.div
                      key={p.id}
                      variants={resultItem}
                      initial="hidden"
                      animate="visible"
                      className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/70 space-y-2"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {p.name}
                          </p>
                          {p.credentialType && (
                            <p className="text-base text-slate-700">
                              {p.credentialType}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-[#005f63]/10 px-3 py-1 text-base font-semibold text-[#005f63]">
                            {matchLabel}
                          </span>
                          <span className="text-base text-slate-600">
                            Match score: {result.score}
                          </span>
                        </div>
                      </div>

                      {p.overview && (
                        <p className="text-base text-slate-800">
                          {p.overview.length > 260
                            ? p.overview.slice(0, 257) + "..."
                            : p.overview}
                        </p>
                      )}

                      {p.timeCommitment?.label && (
                        <p className="text-base text-slate-700">
                          <span className="font-semibold">
                            Time commitment:
                          </span>{" "}
                          {p.timeCommitment.label}
                        </p>
                      )}

                      {p.stackability?.stackMessage && (
                        <p className="text-base text-slate-700">
                          <span className="font-semibold">
                            Stackable pathway:
                          </span>{" "}
                          {p.stackability.stackMessage}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {p.earningBand && (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                            💰
                            <span className="ml-1">
                              {earningBandLabels[p.earningBand] ??
                                "Earning potential information available"}
                            </span>
                          </span>
                        )}
                        {p.opportunityBand && (
                          <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-base text-sky-800">
                            📈
                            <span className="ml-1">
                              {opportunityLabels[p.opportunityBand] ??
                                "Opportunities in the region"}
                            </span>
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        </motion.form>
      </motion.div>
    </section>
  );
}
