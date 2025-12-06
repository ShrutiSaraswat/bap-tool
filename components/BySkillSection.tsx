// components/BySkillSection.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  CircleDollarSign,
  TrendingUp,
  Star,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

import programsData from "../public/programs.json";
import programBandsData from "../public/programsBand.json";
import skillsData from "../public/skills.json";

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
  skills?: string[];
};

type ProgramBand = {
  programId: string;
  earningBandId?: string;
  opportunityBandId?: string;
};

type SkillCluster = {
  id: string;
  name: string;
  description: string;
  programIds: string[];
  jobIds?: string[];
};

const PROGRAMS: Program[] = programsData as Program[];
const PROGRAM_BANDS: ProgramBand[] = programBandsData as ProgramBand[];
const SKILL_CLUSTERS: SkillCluster[] = skillsData as SkillCluster[];

// Map to IDs used in programsBand.json / bands.json
const earningBandLabels: Record<string, string> = {
  "earning-entry": "Entry (around $18-22/hr)",
  "earning-moderate": "Entry to medium ($20-26/hr)",
  "earning-good": "Medium (around $24-30/hr)",
  "earning-strong": "Medium to high ($28-35+/hr)",
};

const opportunityLabels: Record<string, string> = {
  "opportunity-limited": "Some opportunities in the region",
  "opportunity-steady": "Good opportunities in the region",
  "opportunity-good": "Strong opportunities in the region",
  "opportunity-strong": "Very strong and stable demand",
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

function getProgramBand(programId: string) {
  return PROGRAM_BANDS.find((pb) => pb.programId === programId);
}

function getSkillsForProgram(programId: string): SkillCluster[] {
  return SKILL_CLUSTERS.filter((s) => s.programIds.includes(programId));
}

export function BySkillSection() {
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const hasAnySkills = SKILL_CLUSTERS.length > 0;

  // Filtered skills list from skills.json
  const filteredSkills = useMemo(() => {
    if (!hasAnySkills) return [] as SkillCluster[];
    if (!searchTerm.trim()) return SKILL_CLUSTERS;

    const term = searchTerm.toLowerCase();
    return SKILL_CLUSTERS.filter((skill) =>
      skill.name.toLowerCase().includes(term)
    );
  }, [searchTerm, hasAnySkills]);

  const selectedSkill = useMemo(
    () => SKILL_CLUSTERS.find((s) => s.id === selectedSkillId),
    [selectedSkillId]
  );

  const programsForSkill = useMemo(() => {
    if (!selectedSkill) return [];
    return PROGRAMS.filter((p) => selectedSkill.programIds.includes(p.id));
  }, [selectedSkill]);

  // Example skill quick tags
  const exampleSkills = useMemo(() => {
    if (!hasAnySkills) return [] as SkillCluster[];

    const patterns = [
      "customer service",
      "accounting",
      "marketing",
      "leadership",
    ];
    const picks: SkillCluster[] = [];

    for (const pattern of patterns) {
      const lowerPattern = pattern.toLowerCase();
      const found = SKILL_CLUSTERS.find(
        (s) =>
          s.name.toLowerCase().includes(lowerPattern) &&
          !picks.some((p) => p.id === s.id)
      );
      if (found) picks.push(found);
    }

    if (picks.length === 0) {
      return SKILL_CLUSTERS.slice(0, 4);
    }
    return picks;
  }, [hasAnySkills]);

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
          className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
          variants={fadeUp}
        >
          {/* LHS copy */}
          <div className="space-y-2 max-w-3xl">
            <p className="text-base font-semibold tracking-[0.18em] uppercase text-[#005f63] flex items-center gap-2">
              Search by skills you will develop
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Start with what you are good at, or want to get better at.
            </h2>
            <p className="text-base text-slate-800">
              Choose a skill you want to build and see which CNC business
              programs focus on it. This works well if you know the kind of work
              you enjoy, but are not sure which credential to start with.
            </p>
          </div>

          {/* RHS search and select */}
          <div className="flex w-full max-w-md flex-col gap-3 sm:pt-1">
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
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f63] focus:border-[#005f63] cursor-pointer disabled:cursor-default"
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              disabled={!hasAnySkills}
            >
              {!hasAnySkills && (
                <option value="">
                  Skill details for these programs are still being added.
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
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </>
              )}
            </select>

            {hasAnySkills && exampleSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">
                  <Sparkles className="h-3 w-3 text-[#005f63]" />
                  Try these popular skills
                </span>
                {exampleSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSkillId(skill.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-base text-slate-800 shadow-sm hover:border-[#005f63]/60 hover:text-[#005f63] hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#005f63]/10">
                      <Star className="h-3 w-3 text-[#005f63]" />
                    </span>
                    <span className="truncate max-w-[150px] text-left">
                      {skill.name}
                    </span>
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
            Skill information is still being added to this page. As more details
            become available, you will be able to search for programs using
            skills such as{" "}
            <span className="font-semibold">customer service</span>,{" "}
            <span className="font-semibold">basic accounting</span> and other
            business skills.
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
            key={selectedSkill.id}
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
                <span className="font-semibold">{selectedSkill.name}</span> as a
                key skill outcome.
              </p>
            </div>

            <div className="px-5 py-4 space-y-3 max-h-[380px] overflow-y-auto">
              {programsForSkill.length === 0 && (
                <p className="text-base text-slate-800">
                  Skill information for this area will be added as more data
                  becomes available.
                </p>
              )}

              {programsForSkill.map((p) => {
                const band = getProgramBand(p.id);
                const earningLabel =
                  band?.earningBandId && earningBandLabels[band.earningBandId];
                const opportunityLabel =
                  band?.opportunityBandId &&
                  opportunityLabels[band.opportunityBandId];

                const programSkills = getSkillsForProgram(p.id);
                const otherSkills = programSkills.filter(
                  (s) => s.id !== selectedSkill.id
                );

                return (
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
                      {earningLabel && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                          <CircleDollarSign className="h-4 w-4" />
                          <span>{earningLabel}</span>
                        </span>
                      )}
                      {opportunityLabel && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-base text-sky-800">
                          <TrendingUp className="h-4 w-4" />
                          <span>{opportunityLabel}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#005f63]/10 border border-[#005f63]/30 px-3 py-1 text-base text-[#005f63]">
                        <Star className="h-4 w-4" />
                        <span>Focus on {selectedSkill.name}</span>
                      </span>
                    </div>

                    {otherSkills.length > 0 && (
                      <p className="text-base text-slate-700 pt-1">
                        <span className="font-semibold">Other skills:</span>{" "}
                        {otherSkills
                          .slice(0, 5)
                          .map((s) => s.name)
                          .join(", ")}
                        {otherSkills.length > 5 ? " ..." : ""}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
