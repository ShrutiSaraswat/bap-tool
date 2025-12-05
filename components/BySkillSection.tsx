// components/BySkillSection.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Program = {
  id: string;
  name: string;
  credentialType?: string;
  overview?: string;
  timeCommitment?: {
    label?: string;
    approxMonths?: number;
  };
  stackability?: {
    isStackable?: boolean;
    stackMessage?: string;
  };
  earningBand?: string;
  opportunityBand?: string;
  skills?: string[];
};

const earningBandLabels: Record<string, string> = {
  entry: "Entry (around $18-22/hr)",
  entry_to_medium: "Entry to medium ($20-26/hr)",
  medium: "Medium (around $24-30/hr)",
  medium_high: "Medium to high ($28-35+/hr)",
};

const opportunityLabels: Record<string, string> = {
  medium: "Some opportunities in the region",
  medium_high: "Good opportunities in the region",
  high: "Strong opportunities in the region",
  very_high: "Very strong and stable demand",
  broad: "Broad opportunities across sectors",
  emerging: "Emerging or growing area",
};

export function BySkillSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/programs.json")
      .then((res) => res.json())
      .then((data: Program[]) => setPrograms(data))
      .catch((err) => console.error("Error loading programs.json", err));
  }, []);

  // Collect unique skills from all programs
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    for (const p of programs) {
      p.skills?.forEach((s) => {
        if (s && s.trim()) set.add(s.trim());
      });
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [programs]);

  const filteredSkills = useMemo(() => {
    if (!searchTerm.trim()) return allSkills;
    const term = searchTerm.toLowerCase();
    return allSkills.filter((s) => s.toLowerCase().includes(term));
  }, [allSkills, searchTerm]);

  const programsForSkill = useMemo(() => {
    if (!selectedSkill) return [];
    return programs.filter((p) => p.skills?.includes(selectedSkill));
  }, [programs, selectedSkill]);

  const hasAnySkills = allSkills.length > 0;

  return (
    <section
      id="skills"
      className="bg-slate-50 border-b border-slate-200 py-8 sm:py-10"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-6">
        {/* Heading and explanation */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Search by skills you will develop
            </h2>
            <p className="mt-1 text-sm text-slate-700 max-w-2xl">
              Choose a skill you want to build and see which CNC business
              programs focus on it. This is helpful when students know the kind
              of work they enjoy, but are not sure which credential to start
              with.
            </p>
          </div>

          {/* Skill search and select */}
          <div className="flex flex-col gap-2 min-w-[260px]">
            <label
              htmlFor="skill-search"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
            >
              Skill
            </label>

            <input
              id="skill-search"
              type="text"
              placeholder="Type to filter skills (customer service, accounting...)"
              className="block w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!hasAnySkills}
            />

            <select
              className="block w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63]"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              disabled={!hasAnySkills}
            >
              {!hasAnySkills && (
                <option value="">
                  Skill information will be added to this dataset.
                </option>
              )}

              {hasAnySkills && (
                <>
                  <option value="">
                    {filteredSkills.length === 0
                      ? "No skills match this search"
                      : "Select a skill…"}
                  </option>
                  {filteredSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        {/* If no skills at all in JSON */}
        {!hasAnySkills && (
          <div className="border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-700">
            Skill outcomes have not been added to the data yet. When you include
            a{" "}
            <code className="px-1 py-0.5 bg-slate-100 rounded text-xs">
              "skills": ["customer service", "basic accounting", ...]
            </code>{" "}
            field for each program in <code>programs.json</code>, this section
            will automatically let students search by those skills.
          </div>
        )}

        {/* Normal empty state when there ARE skills but none selected */}
        {hasAnySkills && !selectedSkill && (
          <div className="border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-700">
            Use the box on the right to type a word like{" "}
            <span className="font-semibold">customer service</span>,{" "}
            <span className="font-semibold">accounting</span>,{" "}
            <span className="font-semibold">marketing</span> or{" "}
            <span className="font-semibold">leadership</span>. Then choose a
            skill from the list to see which CNC programs help you develop it.
          </div>
        )}

        {/* Results */}
        {hasAnySkills && selectedSkill && (
          <div className="border border-slate-200 rounded-lg bg-white">
            <div className="border-b border-slate-200 bg-slate-100 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Programs that build this skill
              </p>
              <p className="mt-1 text-xs text-slate-700">
                Showing CNC business programs that list{" "}
                <span className="font-semibold">{selectedSkill}</span> as a key
                skill outcome.
              </p>
            </div>

            <div className="px-4 py-3 space-y-3 max-h-[380px] overflow-y-auto">
              {programsForSkill.length === 0 && (
                <p className="text-sm text-slate-700">
                  Skill information for this area will be added as the dataset
                  is completed.
                </p>
              )}

              {programsForSkill.map((p) => (
                <div
                  key={p.id}
                  className="border border-slate-200 rounded-md px-3 py-2.5 text-xs sm:text-[13px] space-y-1.5 bg-slate-50/70"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{p.name}</p>
                      {p.credentialType && (
                        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-600">
                          {p.credentialType}
                        </p>
                      )}
                    </div>
                    {p.timeCommitment?.label && (
                      <p className="text-[11px] text-slate-700">
                        {p.timeCommitment.label}
                      </p>
                    )}
                  </div>

                  {p.overview && (
                    <p className="text-slate-700">
                      {p.overview.length > 200
                        ? p.overview.slice(0, 197) + "..."
                        : p.overview}
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
                        📈{" "}
                        {opportunityLabels[p.opportunityBand] ??
                          "Opportunities in the region"}
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-full bg-[#005f63]/10 border border-[#005f63]/30 px-2.5 py-1 text-[11px] text-[#005f63]">
                      ⭐ Focus on {selectedSkill}
                    </span>
                  </div>

                  {p.skills && p.skills.length > 1 && (
                    <p className="text-[11px] text-slate-600 pt-1">
                      Other skills:{" "}
                      {p.skills
                        .filter((s) => s !== selectedSkill)
                        .slice(0, 5)
                        .join(", ")}
                      {p.skills.length > 6 ? " ..." : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
