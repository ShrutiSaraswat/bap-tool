// components/BySkillSection.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  CircleDollarSign,
  TrendingUp,
  Star,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

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

// Motion variants (used only for top block / empty states)
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
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

  // Example skills to show as quick tags if they exist
  const exampleSkills = useMemo(() => {
    if (!hasAnySkills) return [];
    const popular = [
      "customer service",
      "accounting",
      "marketing",
      "leadership",
    ];
    const found = popular.filter((p) =>
      allSkills.some((s) => s.toLowerCase() === p.toLowerCase())
    );
    if (found.length > 0) return found;
    return allSkills.slice(0, 4);
  }, [allSkills, hasAnySkills]);

  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-gradient-to-br from-[#f9fafb] via-white to-[#eff6ff] border-b border-slate-200 py-10 sm:py-12"
    >
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-28 top-8 h-52 w-52 rounded-full bg-[#005f63]/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-60 w-60 rounded-full bg-[#d71920]/10 blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 space-y-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Heading and explanation */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          variants={fadeUp}
        >
          <div className="space-y-2 max-w-3xl">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-[#005f63] flex items-center gap-2">
              Search by skills you will develop
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Start with what you are good at, or want to get better at.
            </h2>
            <p className="text-base text-slate-800">
              Choose a skill you want to build and see which CNC business
              programs focus on it. This is helpful when students know the kind
              of work they enjoy, but are not sure which credential to start
              with.
            </p>
          </div>

          {/* Skill search and select */}
          <div className="flex flex-col gap-3 min-w-[280px]">
            <label
              htmlFor="skill-search"
              className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700"
            >
              Skill search
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="skill-search"
                type="text"
                placeholder="Type to filter skills (customer service, accounting, marketing...)"
                className="block w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!hasAnySkills}
              />
            </div>

            <select
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63]"
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

            {hasAnySkills && exampleSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <p className="text-base text-slate-700">Try:</p>
                {exampleSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSkill(skill);
                    }}
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-base text-slate-800 hover:bg-slate-100 transition"
                  >
                    <Star className="h-4 w-4 mr-1 text-[#005f63]" />
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* If no skills at all in JSON */}
        {!hasAnySkills && (
          <motion.div
            className="border border-dashed border-slate-300 bg-white px-5 py-6 text-base text-slate-800 rounded-2xl shadow-sm"
            variants={fadeUp}
          >
            Skill outcomes have not been added to the data yet. When you include
            a field like{" "}
            <code className="px-1 py-0.5 bg-slate-100 rounded text-base">
              "skills": ["customer service", "basic accounting", ...]
            </code>{" "}
            for each program in <code className="text-base">programs.json</code>
            , this section will automatically let students search by those
            skills.
          </motion.div>
        )}

        {/* Normal empty state when there ARE skills but none selected */}
        {hasAnySkills && !selectedSkill && (
          <motion.div
            className="border border-dashed border-slate-300 bg-white px-5 py-6 text-base text-slate-800 rounded-2xl shadow-sm"
            variants={fadeUp}
          >
            Use the search box on the right to type a word like{" "}
            <span className="font-semibold">customer service</span>,{" "}
            <span className="font-semibold">accounting</span>,{" "}
            <span className="font-semibold">marketing</span> or{" "}
            <span className="font-semibold">leadership</span>. Then choose a
            skill from the list to see which CNC business programs help you
            develop it.
          </motion.div>
        )}

        {/* Results */}
        {hasAnySkills && selectedSkill && (
          <motion.div
            key={selectedSkill}
            className="border border-slate-200 rounded-2xl bg-white/95 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-100 via-white to-slate-100 px-5 py-4">
              <p className="text-base font-semibold uppercase tracking-[0.16em] text-slate-700 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#005f63]" />
                Programs that build this skill
              </p>
              <p className="mt-2 text-base text-slate-800">
                Showing CNC business programs that list{" "}
                <span className="font-semibold">{selectedSkill}</span> as a key
                skill outcome.
              </p>
            </div>

            <div className="px-5 py-4 space-y-3 max-h-[380px] overflow-y-auto">
              {programsForSkill.length === 0 && (
                <p className="text-base text-slate-800">
                  Skill information for this area will be added as the dataset
                  is completed.
                </p>
              )}

              {programsForSkill.map((p) => (
                <motion.div
                  key={p.id}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-base space-y-2 bg-slate-50/80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{p.name}</p>
                      {p.credentialType && (
                        <p className="text-base text-slate-700">
                          {p.credentialType}
                        </p>
                      )}
                    </div>
                    {p.timeCommitment?.label && (
                      <p className="text-base text-slate-700">
                        {p.timeCommitment.label}
                      </p>
                    )}
                  </div>

                  {p.overview && (
                    <p className="text-base text-slate-800">
                      {p.overview.length > 220
                        ? p.overview.slice(0, 217) + "..."
                        : p.overview}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {p.earningBand && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                        <CircleDollarSign className="h-4 w-4" />
                        <span>
                          {earningBandLabels[p.earningBand] ??
                            "Earning potential information available"}
                        </span>
                      </span>
                    )}
                    {p.opportunityBand && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-base text-sky-800">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          {opportunityLabels[p.opportunityBand] ??
                            "Opportunities in the region"}
                        </span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#005f63]/10 border border-[#005f63]/30 px-3 py-1 text-base text-[#005f63]">
                      <Star className="h-4 w-4" />
                      <span>Focus on {selectedSkill}</span>
                    </span>
                  </div>

                  {p.skills && p.skills.length > 1 && (
                    <p className="text-base text-slate-700 pt-1">
                      <span className="font-semibold">Other skills:</span>{" "}
                      {p.skills
                        .filter((s) => s !== selectedSkill)
                        .slice(0, 5)
                        .join(", ")}
                      {p.skills.length > 6 ? " ..." : ""}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
