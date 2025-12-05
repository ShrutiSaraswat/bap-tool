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

    // Expects /public/recommendation_rules.json
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
    <section id="guided-match" className="bg-slate-50 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-6">
        <div className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Not sure where to start? Try a guided match.
          </h2>
          <p className="mt-1 text-sm text-slate-700">
            In your own words, describe the kinds of work you enjoy, the
            subjects you like, or the environment you want to be in. This tool
            uses static rules from the BAP dataset to highlight CNC business
            programs that could be a good starting point.
          </p>
        </div>

        {/* Input + actions */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 lg:grid-cols-[2fr,3fr] items-start"
        >
          <div className="space-y-3">
            <label
              htmlFor="guided-text"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
            >
              Tell us a bit about you
            </label>
            <textarea
              id="guided-text"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63] resize-vertical"
              placeholder="For example: I like working with people in hotels or restaurants, I enjoy planning events, and I want a program that lets me start working sooner and possibly move into management later."
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-sm bg-[#d71920] text-white hover:bg-[#b8141b] transition"
              >
                See suggested programs
              </button>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-sm border border-slate-300 text-slate-800 hover:bg-slate-100 transition"
                onClick={() =>
                  setText(
                    "I like working with people, guests and visitors. I enjoy social media and events, and I want to start in a shorter business program that can lead to management later."
                  )
                }
              >
                Use an example
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              This is not an application or formal advising tool. It is a
              conversation starter based on the same static information used in
              the colourful program overview.
            </p>
          </div>

          {/* Results panel */}
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Suggested CNC programs
              </p>
              <p className="mt-1 text-xs text-slate-700">
                Ordered from strongest to lighter match based on the interests
                you described and the rule set behind this tool.
              </p>
            </div>

            <div className="px-4 py-3 space-y-3 max-h-[360px] overflow-y-auto text-sm">
              {!touched && (
                <p className="text-sm text-slate-700">
                  Type a few sentences on the left and select{" "}
                  <span className="font-semibold">See suggested programs</span>{" "}
                  to view matches here.
                </p>
              )}

              {showEmptyState && (
                <p className="text-sm text-slate-700">
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
                  return (
                    <div
                      key={p.id}
                      className="border border-slate-200 rounded-md px-3 py-2.5 text-xs sm:text-[13px] space-y-1.5 bg-slate-50/70"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {p.name}
                          </p>
                          {p.credentialType && (
                            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-600">
                              {p.credentialType}
                            </p>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Match strength: {result.score}
                        </div>
                      </div>

                      {p.overview && (
                        <p className="text-slate-700">
                          {p.overview.length > 220
                            ? p.overview.slice(0, 217) + "..."
                            : p.overview}
                        </p>
                      )}

                      {p.timeCommitment?.label && (
                        <p className="text-[11px] text-slate-700 mt-1">
                          Time commitment: {p.timeCommitment.label}
                        </p>
                      )}

                      {p.stackability?.stackMessage && (
                        <p className="text-[11px] text-slate-700">
                          Stackable pathway: {p.stackability.stackMessage}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {p.earningBand && (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] text-emerald-800">
                            💰{" "}
                            {earningBandLabels[p.earningBand] ??
                              "Earning potential information available"}
                          </span>
                        )}
                        {p.opportunityBand && (
                          <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-2.5 py-1 text-[11px] text-sky-800">
                            📈 Opportunities in the region
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
