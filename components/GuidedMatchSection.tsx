// components/GuidedMatchSection.tsx
"use client";

import { useEffect, useState } from "react";

type Program = {
  id: string;
  name: string;
  credentialType?: string;
  overview?: string;
  timeCommitment?: { label?: string; approxMonths?: number };
  stackability?: { isStackable?: boolean; stackMessage?: string };
  earningBand?: string;
  opportunityBand?: string;
};

type RecommendationRule = {
  id: string;
  description: string;
  keywords: string[];
  recommendProgramIds: string[];
};

type ProgramScore = {
  program: Program;
  score: number;
  ruleIds: string[];
};

const earningBandLabels: Record<string, string> = {
  entry: "Entry ($18-22/hr approx.)",
  entry_to_medium: "Entry to medium ($20-26/hr approx.)",
  medium: "Medium ($24-30/hr approx.)",
  medium_high: "Medium to high ($28-35+ /hr approx.)",
};

function matchStrengthLabel(score: number): string {
  if (score >= 3) return "Strong match";
  if (score === 2) return "Good match";
  return "Initial match";
}

export function GuidedMatchSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [rules, setRules] = useState<RecommendationRule[]>([]);
  const [text, setText] = useState("");
  const [results, setResults] = useState<ProgramScore[] | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    fetch("/programs.json")
      .then((res) => res.json())
      .then((data: Program[]) => setPrograms(data))
      .catch((err) => console.error("Error loading programs.json", err));

    fetch("/recommendation_rules.json")
      .then((res) => res.json())
      .then((data: RecommendationRule[]) => setRules(data))
      .catch((err) =>
        console.error("Error loading recommendation_rules.json", err)
      );
  }, []);

  function runMatch() {
    const input = text.trim();
    setTouched(true);

    if (!input || programs.length === 0 || rules.length === 0) {
      setResults(null);
      return;
    }

    const normalized = input.toLowerCase();
    const scores = new Map<string, ProgramScore>();

    for (const rule of rules) {
      const hit = rule.keywords.some((keyword) =>
        normalized.includes(keyword.toLowerCase())
      );
      if (!hit) continue;

      for (const pid of rule.recommendProgramIds) {
        const program = programs.find((p) => p.id === pid);
        if (!program) continue;

        const existing = scores.get(pid);
        if (existing) {
          existing.score += 1;
          if (!existing.ruleIds.includes(rule.id)) {
            existing.ruleIds.push(rule.id);
          }
        } else {
          scores.set(pid, {
            program,
            score: 1,
            ruleIds: [rule.id],
          });
        }
      }
    }

    const sorted = Array.from(scores.values()).sort(
      (a, b) => b.score - a.score
    );
    setResults(sorted);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runMatch();
  }

  const showEmptyState = touched && (!results || results.length === 0);

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

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-7">
        <div className="max-w-3xl space-y-3">
          <p className="text-base font-semibold tracking-[0.2em] uppercase text-[#005f63]">
            Guided match
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Not sure where to start? Try a guided match.
          </h2>
          <p className="text-base text-slate-800">
            In your own words, describe the kinds of work you enjoy, the
            subjects you like, or the environment you want to be in. This tool
            uses static rules from the BAP dataset to highlight CNC business
            programs that could be a good starting point.
          </p>
        </div>

        {/* Input + actions */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-5 lg:grid-cols-[2fr,3fr] items-start"
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
                className="inline-flex items-center rounded-md bg-[#d71920] px-5 py-3 text-base font-semibold text-white hover:bg-[#b8141b] shadow-sm hover:shadow-md transition"
              >
                See suggested programs
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100 transition"
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
              This is not an application or formal advising tool. It is a
              conversation starter based on the same static information used in
              the colourful program overview.
            </p>
          </div>

          {/* Results panel */}
          <div className="border border-slate-200 rounded-2xl bg-white/95 overflow-hidden shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 px-5 py-4">
              <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700">
                Suggested CNC programs
              </p>
              <p className="mt-2 text-base text-slate-800">
                Ordered from strongest to lighter match based on the interests
                you described and the rule set behind this tool.
              </p>
            </div>

            <div className="px-5 py-4 space-y-4 max-h-[380px] overflow-y-auto text-base">
              {!touched && (
                <p className="text-base text-slate-800">
                  Type a few sentences on the left and select{" "}
                  <span className="font-semibold">See suggested programs</span>{" "}
                  to view matches here.
                </p>
              )}

              {showEmptyState && (
                <p className="text-base text-slate-800">
                  There is not a strong match with the current rule set yet. You
                  can try adding more detail about the kinds of tasks you enjoy,
                  your preferred environment (office, hospitality, finance,
                  marketing) or whether you want to start working quickly and
                  stack later.
                </p>
              )}

              {results &&
                results.map((result) => {
                  const p = result.program;
                  const matchLabel = matchStrengthLabel(result.score);
                  return (
                    <div
                      key={p.id}
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
                            Score: {result.score}
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
                              Opportunities in the region
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
