// components/GuidedMatchSection.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import programsData from "../public/programs.json";
import programBandsData from "../public/programsBand.json";
import collegeBg from "../public/bg5.png";

type ProgramCourse = {
  code: string;
  title: string;
  note?: string;
};

type Program = {
  id: string;
  name: string;
  credentialType?: string;
  shortTagline?: string;
  overview?: string;
  region?: string;
  earningBand?: string;
  opportunityBand?: string;
  timeCommitment?: { label?: string; approxMonths?: number };
  stackability?: {
    isStackable?: boolean;
    stackLevel?: number;
    stackMessage?: string;
  };
  skills?: string[];
  courses?: ProgramCourse[];
  employmentSummary?: string;
  jobIds?: string[];
};

type ProgramBand = {
  programId: string;
  earningBandId?: string;
  opportunityBandId?: string;
};

type ProgramScore = {
  program: Program;
  score: number;
};

type TextEmbedding = {
  weights: Record<string, number>;
  norm: number;
};

function matchStrengthLabel(score: number): string {
  if (score >= 16) return "Strong match";
  if (score >= 8) return "Good match";
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

// Lightweight synonym map for user input (domain tuned)
const SYNONYMS: Record<string, string[]> = {
  customer: ["client", "guest", "patron"],
  guests: ["visitors", "tourists"],
  hospitality: ["hotel", "lodging", "tourism"],
  hotel: ["hospitality", "accommodation"],
  restaurant: ["food", "foodservice"],
  hr: ["human-resources", "humanresources", "people"],
  hiring: ["recruitment", "recruiting"],
  recruitment: ["hiring", "talent"],
  analytics: ["analysis", "data"],
  data: ["analytics", "analysis"],
  accounting: ["bookkeeping", "finance"],
  finance: ["financial", "banking"],
  entrepreneur: ["founder", "business-owner"],
  entrepreneurship: ["start-up", "startup", "founding"],
  marketing: ["promotion", "advertising", "branding"],
  // strengthened marketing-related synonyms
  social: ["social-media", "socialmedia", "marketing"],
  promotional: ["promotion", "marketing"],
  communications: ["marketing", "promotion", "social-media"],
  events: ["event-planning", "marketing"],
  office: ["administrative", "admin"],
  management: ["supervision", "leadership", "manager"],
};

// Simple intent patterns from phrases in the user text
const INTENT_PATTERNS: Record<string, string[]> = {
  fastJob: [
    "start working soon",
    "start working quickly",
    "shorter program",
    "short program",
    "quick program",
    "job ready",
    "job-ready",
    "entry level",
    "entry-level",
  ],
  management: [
    "move into management",
    "management role",
    "be a manager",
    "become a manager",
    "team lead",
    "supervisor",
    "leadership",
  ],
  marketing: [
    "social media",
    "digital marketing",
    "marketing",
    "advertising",
    "promotion",
    "branding",
  ],
  finance: [
    "finance",
    "financial",
    "accounting",
    "bookkeeping",
    "auditing",
    "auditor",
  ],
  data: [
    "data analytics",
    "data analysis",
    "analytics",
    "data analyst",
    "analyzing data",
    "data-driven",
  ],
  hospitality: [
    "hospitality",
    "hotel",
    "front desk",
    "guest service",
    "food and beverage",
    "restaurant",
  ],
  hr: [
    "human resources",
    "recruitment",
    "recruiting",
    "hiring",
    "staffing",
    "talent acquisition",
    "people and culture",
  ],
  smallBusiness: [
    "small business",
    "own business",
    "my own business",
    "entrepreneur",
    "entrepreneurship",
    "self employment",
    "self-employed",
    "self employment",
    "self-employment",
    "start a business",
  ],
  strongDemand: [
    "job security",
    "strong demand",
    "good demand",
    "good job prospects",
    "lots of jobs",
    "many jobs",
    "in demand",
    "stable work",
    "stable demand",
  ],
  highEarnings: [
    "good pay",
    "higher pay",
    "high pay",
    "good wages",
    "high wages",
    "good salary",
    "high salary",
    "better pay",
    "more money",
  ],
};

const earningBandLabels: Record<string, string> = {
  "earning-entry": "Entry ($18-22/hr approx.)",
  "earning-moderate": "Entry to medium ($20-26/hr approx.)",
  "earning-good": "Medium ($24-30/hr approx.)",
  "earning-strong": "Medium to high ($28-35+ /hr approx.)",
};

const opportunityLabels: Record<string, string> = {
  "opportunity-limited": "Some opportunities in the region",
  "opportunity-steady": "Good opportunities in the region",
  "opportunity-good": "Strong opportunities in the region",
  "opportunity-strong": "Very strong and stable demand",
};

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

// Expand user words with synonyms (only for user input, not programs)
function expandWords(words: string[]): string[] {
  const expanded = new Set<string>();
  for (const w of words) {
    expanded.add(w);
    const syns = SYNONYMS[w];
    if (syns) {
      for (const s of syns) {
        expanded.add(s);
      }
    }
  }
  return Array.from(expanded);
}

// Get the "core" user words (after normalization, stopwords, synonyms)
function getInputWords(text: string): string[] {
  const baseWords = splitWords(text);
  return expandWords(baseWords);
}

function detectIntents(text: string): Set<string> {
  const intents = new Set<string>();
  const lowered = text.toLowerCase();
  for (const key in INTENT_PATTERNS) {
    const patterns = INTENT_PATTERNS[key];
    if (patterns.some((p) => lowered.includes(p))) {
      intents.add(key);
    }
  }
  return intents;
}

// --- TF–IDF style embedding and cosine similarity (local semantic layer) ---

let CORPUS_IDF: Record<string, number> | null = null;

function ensureCorpusIdf(programs: Program[]) {
  if (CORPUS_IDF) return;

  const docFreq: Record<string, number> = {};
  const totalDocs = programs.length || 1;

  for (const program of programs) {
    const combinedText = [
      program.name || "",
      program.shortTagline || "",
      program.overview || "",
      program.employmentSummary || "",
      program.region || "",
      ...(program.skills || []),
      ...(program.courses?.map((c) => c.title) || []),
      ...(program.courses?.map((c) => c.note || "") || []),
    ]
      .filter(Boolean)
      .join(" ");

    const words = new Set(splitWords(combinedText));
    for (const w of words) {
      docFreq[w] = (docFreq[w] || 0) + 1;
    }
  }

  const idf: Record<string, number> = {};
  for (const term in docFreq) {
    const df = docFreq[term];
    idf[term] = Math.log(1 + totalDocs / (1 + df));
  }

  CORPUS_IDF = idf;
}

function createEmbeddingFromWords(words: string[]): TextEmbedding {
  if (!CORPUS_IDF) {
    CORPUS_IDF = {};
  }
  const idf = CORPUS_IDF;

  const weights: Record<string, number> = {};
  for (const w of words) {
    const idfVal = idf[w];
    if (!idfVal) continue;
    weights[w] = (weights[w] || 0) + idfVal; // TF * IDF
  }

  let normSquared = 0;
  for (const key in weights) {
    const val = weights[key];
    normSquared += val * val;
  }

  return {
    weights,
    norm: Math.sqrt(normSquared) || 0,
  };
}

function cosineSimilarity(a: TextEmbedding, b: TextEmbedding): number {
  if (!a.norm || !b.norm) return 0;

  let dot = 0;
  for (const term in a.weights) {
    const aVal = a.weights[term];
    const bVal = b.weights[term];
    if (bVal) {
      dot += aVal * bVal;
    }
  }

  return dot / (a.norm * b.norm);
}

// Static data from JSON imports
const PROGRAMS: Program[] = programsData as Program[];
const PROGRAM_BANDS: ProgramBand[] = programBandsData as ProgramBand[];

// Cache program embeddings so they are computed only once per program
const PROGRAM_EMBEDDINGS: Record<string, TextEmbedding> = {};

function getProgramEmbedding(program: Program): TextEmbedding {
  ensureCorpusIdf(PROGRAMS);

  const existing = PROGRAM_EMBEDDINGS[program.id];
  if (existing) return existing;

  const combinedText = [
    program.name || "",
    program.shortTagline || "",
    program.overview || "",
    program.employmentSummary || "",
    program.region || "",
    ...(program.skills || []),
    ...(program.courses?.map((c) => c.title) || []),
    ...(program.courses?.map((c) => c.note || "") || []),
  ]
    .filter(Boolean)
    .join(" ");

  const words = splitWords(combinedText);
  const embedding = createEmbeddingFromWords(words);
  PROGRAM_EMBEDDINGS[program.id] = embedding;
  return embedding;
}

function createInputEmbedding(input: string): TextEmbedding | null {
  ensureCorpusIdf(PROGRAMS);

  const words = getInputWords(input);
  if (!words.length) return null;
  return createEmbeddingFromWords(words);
}

// Map band ids / text to numeric levels for scoring
const EARNING_BAND_NUMERIC: Record<string, number> = {
  "earning-entry": 1,
  "earning-moderate": 2,
  "earning-good": 3,
  "earning-strong": 4,
};

const OPPORTUNITY_BAND_NUMERIC: Record<string, number> = {
  "opportunity-limited": 1,
  "opportunity-steady": 2,
  "opportunity-good": 3,
  "opportunity-strong": 4,
};

const TEXT_EARNING_NUMERIC: Record<string, number> = {
  entry_to_medium: 1.5,
  medium: 2,
  medium_high: 3,
};

const TEXT_OPPORTUNITY_NUMERIC: Record<string, number> = {
  medium: 2,
  medium_high: 3,
  high: 3,
  very_high: 4,
  broad: 2.5,
};

function getBandScores(program: Program): {
  earningLevel: number;
  opportunityLevel: number;
} {
  let earningLevel = 0;
  let opportunityLevel = 0;

  const pb = PROGRAM_BANDS.find((p) => p.programId === program.id);

  if (pb?.earningBandId && EARNING_BAND_NUMERIC[pb.earningBandId]) {
    earningLevel = EARNING_BAND_NUMERIC[pb.earningBandId];
  } else if (program.earningBand && TEXT_EARNING_NUMERIC[program.earningBand]) {
    earningLevel = TEXT_EARNING_NUMERIC[program.earningBand];
  }

  if (pb?.opportunityBandId && OPPORTUNITY_BAND_NUMERIC[pb.opportunityBandId]) {
    opportunityLevel = OPPORTUNITY_BAND_NUMERIC[pb.opportunityBandId];
  } else if (
    program.opportunityBand &&
    TEXT_OPPORTUNITY_NUMERIC[program.opportunityBand]
  ) {
    opportunityLevel = TEXT_OPPORTUNITY_NUMERIC[program.opportunityBand];
  }

  return { earningLevel, opportunityLevel };
}

// --- Keyword scoring (uses expanded user words + richer program fields) ---

function keywordScoreProgram(
  program: Program,
  input: string,
  inputWordsSet: Set<string>
): number {
  if (!input.trim()) return 0;

  const loweredInput = input.toLowerCase();
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
      const matches = skillWords.filter((w) => inputWordsSet.has(w)).length;
      if (matches > 0) {
        score += 1 + matches; // small boost per overlapping word
      }
    }
  }

  // 2) Program name overlap
  const nameWords = splitWords(program.name || "");
  const nameHits = nameWords.filter((w) => inputWordsSet.has(w)).length;
  if (nameHits > 0) {
    score += 1 + nameHits;
  }

  // 3) Overview overlap (lighter weight)
  if (program.overview) {
    const overviewWords = splitWords(program.overview);
    const overlap = overviewWords.filter((w) => inputWordsSet.has(w)).length;
    if (overlap > 0) {
      score += Math.min(3, overlap);
    }
  }

  // 4) Short tagline, employment summary, and course titles/notes (very descriptive)
  let extraText = "";
  if (program.shortTagline) extraText += " " + program.shortTagline;
  if (program.employmentSummary) extraText += " " + program.employmentSummary;
  if (program.courses && program.courses.length > 0) {
    for (const c of program.courses) {
      extraText += " " + (c.title || "");
      if (c.note) extraText += " " + c.note;
    }
  }

  if (extraText.trim()) {
    const extraWords = splitWords(extraText);
    const extraOverlap = extraWords.filter((w) => inputWordsSet.has(w)).length;
    if (extraOverlap > 0) {
      // Lower per-word weight but allow up to +4 from these fields
      score += Math.min(4, extraOverlap * 0.75);
    }
  }

  return score;
}

// --- Semantic scoring using cosine similarity between embeddings ---

function semanticScoreProgram(
  program: Program,
  inputEmbedding: TextEmbedding | null
): number {
  if (!inputEmbedding) return 0;
  const programEmbedding = getProgramEmbedding(program);
  const sim = cosineSimilarity(inputEmbedding, programEmbedding); // ~0–1
  // Scale to 0–12 for stronger influence
  return sim * 12;
}

// --- Intent-based tuning (fast job, management, domain areas, labour market bands) ---

function intentScoreProgram(program: Program, intents: Set<string>): number {
  if (!intents.size) {
    // Still lightly reward high opportunity / earnings as a default
    const { earningLevel, opportunityLevel } = getBandScores(program);
    return earningLevel * 0.15 + opportunityLevel * 0.15;
  }

  const combined = [
    program.name || "",
    program.shortTagline || "",
    program.overview || "",
    program.employmentSummary || "",
    ...(program.skills || []),
    ...(program.courses?.map((c) => c.title) || []),
    ...(program.courses?.map((c) => c.note || "") || []),
  ]
    .join(" ")
    .toLowerCase();

  let bonus = 0;

  // Fast job: favour shorter programs (by months or by "3 courses" style label)
  if (intents.has("fastJob")) {
    const months = program.timeCommitment?.approxMonths;
    const label = program.timeCommitment?.label?.toLowerCase() || "";
    if ((months && months <= 12) || label.includes("3 courses")) {
      bonus += 3;
    } else if ((months && months <= 18) || label.includes("10 courses")) {
      bonus += 1.5;
    }
  }

  // Management
  if (intents.has("management")) {
    if (
      combined.includes("management") ||
      combined.includes("manager") ||
      combined.includes("supervisor") ||
      combined.includes("leadership")
    ) {
      bonus += 4;
    }
  }

  // Marketing – calibrated so hospitality doesn't dominate pure marketing queries
  if (intents.has("marketing")) {
    const hasMarketingSignal =
      combined.includes("marketing") ||
      combined.includes("social media") ||
      combined.includes("digital marketing") ||
      combined.includes("promotion") ||
      combined.includes("advertising") ||
      combined.includes("branding");

    if (hasMarketingSignal) {
      let marketingBonus = 4;
      const isHospitalityProgram =
        (program.id && program.id.includes("hospitality")) ||
        combined.includes("hotel") ||
        combined.includes("accommodation") ||
        combined.includes("food and beverage") ||
        combined.includes("guest experience");

      // Hospitality programs get a smaller marketing bonus, so business/marketing
      // oriented programs rank above them on marketing-heavy inputs.
      if (isHospitalityProgram) {
        marketingBonus = 2;
      }

      bonus += marketingBonus;
    }
  }

  // Finance / accounting
  if (intents.has("finance")) {
    if (
      combined.includes("finance") ||
      combined.includes("financial") ||
      combined.includes("accounting") ||
      combined.includes("bookkeeping") ||
      combined.includes("audit")
    ) {
      bonus += 4;
    }
  }

  // Data / analytics
  if (intents.has("data")) {
    if (
      combined.includes("data analytics") ||
      combined.includes("data analysis") ||
      combined.includes("analytics") ||
      combined.includes("information systems") ||
      combined.includes("business intelligence")
    ) {
      bonus += 4;
    }
  }

  // Hospitality
  if (intents.has("hospitality")) {
    if (
      combined.includes("hospitality") ||
      combined.includes("hotel") ||
      combined.includes("accommodation") ||
      combined.includes("guest service") ||
      combined.includes("food and beverage")
    ) {
      bonus += 4;
    }
  }

  // HR / recruitment
  if (intents.has("hr")) {
    if (
      combined.includes("human resource") ||
      combined.includes("recruitment") ||
      combined.includes("recruiting") ||
      combined.includes("staffing") ||
      combined.includes("compensation")
    ) {
      bonus += 4;
    }
  }

  // Small business / entrepreneurship
  if (intents.has("smallBusiness")) {
    if (
      combined.includes("small business") ||
      combined.includes("entrepreneur") ||
      combined.includes("entrepreneurship") ||
      combined.includes("self employment") ||
      combined.includes("self-employment")
    ) {
      bonus += 4;
    }
  }

  // Labour market bands: earnings & demand
  const { earningLevel, opportunityLevel } = getBandScores(program);

  // High earnings preference
  if (earningLevel) {
    bonus += earningLevel * (intents.has("highEarnings") ? 1.1 : 0.15);
  }

  // Strong demand / job outlook preference
  if (opportunityLevel) {
    bonus += opportunityLevel * (intents.has("strongDemand") ? 1.1 : 0.15);
  }

  return bonus;
}

// --- Combined hybrid score (keyword + semantic + intent) ---

function scoreProgram(
  program: Program,
  input: string,
  inputEmbedding: TextEmbedding | null,
  inputWordsSet: Set<string>,
  intents: Set<string>
): number {
  const keywordScore = keywordScoreProgram(program, input, inputWordsSet);
  const semanticScore = semanticScoreProgram(program, inputEmbedding);
  const intentBonus = intentScoreProgram(program, intents);

  // Blend weights: tuned so content match dominates, labour-market & intent guide
  const blended = keywordScore * 0.5 + semanticScore * 0.35 + intentBonus * 1.0;

  return Math.round(blended);
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
  const [text, setText] = useState("");
  const [results, setResults] = useState<ProgramScore[] | null>(null);
  const [touched, setTouched] = useState(false);

  function runMatch() {
    const input = text.trim();
    setTouched(true);

    if (!input || PROGRAMS.length === 0) {
      setResults(null);
      return;
    }

    const inputWords = getInputWords(input);
    const inputWordsSet = new Set(inputWords);
    const intents = detectIntents(input);
    const inputEmbedding = createInputEmbedding(input);

    const scored: ProgramScore[] = PROGRAMS.map((program) => ({
      program,
      score: scoreProgram(
        program,
        input,
        inputEmbedding,
        inputWordsSet,
        intents
      ),
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

  function getProgramBand(programId: string) {
    return PROGRAM_BANDS.find((pb) => pb.programId === programId);
  }

  return (
    <section
      id="guided-match"
      className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-indigo-800/15 bg-dots py-10 sm:py-12 border-t border-gray-200"
    >
      {/* soft gradient background accents matching hero */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.16),transparent_65%)]" />
        <div className="hidden md:block absolute -left-40 top-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-200/60 to-purple-300/60 blur-3xl" />
        <div className="hidden md:block absolute -right-40 bottom-40 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-200/60 to-sky-200/60 blur-3xl" />
      </div>

      {/* soft background accent with college image */}
      {/* <div className="pointer-events-none absolute inset-0">
        <Image
          src={collegeBg}
          alt="College campus background"
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute -left-32 top-16 h-64 w-64 rounded-full bg-[#005f63]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#d71920]/10 blur-3xl" />
      </div> */}

      <motion.div
        className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-0 space-y-7"
        variants={sectionContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {/* Heading block */}
        <motion.div className="max-w-3xl space-y-3" variants={fadeChild}>
          <p className="text-base font-semibold tracking-[0.2em] uppercase text-indigo-600">
            Guided match
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Not sure where to start? Use the guided match.
          </h2>
          <p className="text-base text-gray-700">
            Describe the kind of business work you want to do or the experience
            you already have. The tool compares your interests with CNC&apos;s
            business programs and suggests a flexible starting point you can
            build into a certificate or diploma.
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
              className="text-base font-semibold uppercase tracking-[0.16em] text-gray-800"
            >
              Tell us a bit about you
            </label>
            <textarea
              id="guided-text"
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical backdrop-blur"
              placeholder="For example: I like working with people in hotels or restaurants, I enjoy planning events, and I want a program that lets me start working sooner and possibly move into management later."
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl cursor-pointer"
              >
                See Suggested Programs
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-indigo-100 bg-white/80 px-5 py-3 text-base font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition cursor-pointer"
                onClick={() =>
                  setText(
                    "I like working with people, guests and visitors. I enjoy social media and events, and I want to start in a shorter business program that can lead to management later."
                  )
                }
              >
                See an Example
              </button>
            </div>

            <p className="text-base text-gray-600">
              This is a planning tool to help you think about options. It does
              not replace speaking with CNC advising or submitting an
              application.
            </p>
          </div>

          {/* Results panel */}
          <motion.div
            className="border-4 border-slate-300 rounded-2xl bg-white/80 overflow-hidden shadow-2xl backdrop-blur-md"
            variants={fadeChild}
          >
            <div className="border-b-4 border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-pink-900/10 px-5 py-4">
              <p className="text-base font-semibold uppercase tracking-[0.16em] text-gray-800">
                Suggested CNC programs
              </p>
              <p className="mt-2 text-base text-gray-700">
                Results are ordered from strongest to lighter match based on how
                closely your description aligns with each program.
              </p>
            </div>

            <div className="px-5 py-4 space-y-4 max-h-[380px] overflow-y-auto text-base">
              {!touched && (
                <p className="text-base text-gray-700">
                  Type a few sentences and select{" "}
                  <span className="font-semibold">See Suggested Programs</span>{" "}
                  to view matches here.
                </p>
              )}

              {showEmptyState && (
                <p className="text-base text-gray-700">
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
                  const band = getProgramBand(p.id);
                  const earningLabel =
                    band?.earningBandId &&
                    earningBandLabels[band.earningBandId];
                  const opportunityLabel =
                    band?.opportunityBandId &&
                    opportunityLabels[band.opportunityBandId];

                  return (
                    <motion.div
                      key={p.id}
                      variants={resultItem}
                      initial="hidden"
                      animate="visible"
                      className="border border-indigo-100/80 rounded-xl px-4 py-3 bg-gradient-to-r from-indigo-50/70 via-white/80 to-pink-50/70 space-y-2"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {p.name}
                          </p>
                          {p.credentialType && (
                            <p className="text-base text-gray-700">
                              {p.credentialType}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-base font-semibold text-indigo-700">
                            {matchLabel}
                          </span>
                          <span className="text-base text-gray-600">
                            Match score: {result.score}
                          </span>
                        </div>
                      </div>

                      {p.overview && (
                        <p className="text-base text-gray-700">
                          {p.overview.length > 260
                            ? p.overview.slice(0, 257) + "..."
                            : p.overview}
                        </p>
                      )}

                      {p.timeCommitment?.label && (
                        <p className="text-base text-gray-700">
                          <span className="font-semibold">
                            Time commitment:
                          </span>{" "}
                          {p.timeCommitment.label}
                        </p>
                      )}

                      {p.stackability?.stackMessage && (
                        <p className="text-base text-gray-700">
                          <span className="font-semibold">
                            Stackable pathway:
                          </span>{" "}
                          {p.stackability.stackMessage}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {earningLabel && (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-base text-emerald-800">
                            💰
                            <span className="ml-1">{earningLabel}</span>
                          </span>
                        )}
                        {opportunityLabel && (
                          <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-base text-sky-800">
                            📈
                            <span className="ml-1">{opportunityLabel}</span>
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
