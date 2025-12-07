// components/TimeComparisonInline.tsx
"use client";

import { Clock, Layers3 } from "lucide-react";

type TimeComparisonInlineProps = {
  approxMonths?: number | null;
  /**
   * Optional - how many courses are in one building block.
   * If not provided, defaults to 3.
   */
  courseCountPerBlock?: number | null;
};

/**
 * Helper so every place that talks about "X courses"
 * uses the client format:
 *   "One Semester (4 Months)/X Courses"
 */
export function formatCourseBlockLabel(courseCount?: number | null): string {
  const count = courseCount ?? 3; // default building block
  const plural = count === 1 ? "Course" : "Courses";
  return `One Semester (4 Months)/${count} ${plural}`;
}

export function TimeComparisonInline({
  approxMonths,
  courseCountPerBlock,
}: TimeComparisonInlineProps) {
  const hasMonths = typeof approxMonths === "number" && approxMonths > 0;

  const courseBlockLabel = formatCourseBlockLabel(courseCountPerBlock);

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1.4fr),minmax(0,1.6fr)] items-start">
      {/* Typical pace card */}
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-[#fef2f2] border border-[#fecaca]">
          <Clock className="h-4 w-4 text-[#b91c1c]" />
        </div>
        <div className="text-sm sm:text-base text-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-[0.16em] mb-1">
            Typical part time pace
          </p>
          {hasMonths ? (
            <p>
              About <span className="font-semibold">{approxMonths} months</span>{" "}
              to complete this credential at a steady part time pace.
            </p>
          ) : (
            <p>
              A steady part time pace lets you keep work and life in balance
              while you move through your credential.
            </p>
          )}
        </div>
      </div>

      {/* Course block / "3 courses" card */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-amber-200">
          <Layers3 className="h-4 w-4 text-amber-800" />
        </div>
        <div className="text-sm sm:text-base text-slate-800">
          <p className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-[0.16em] mb-1">
            One semester building block
          </p>
          <p>
            Think in small steps. Each block is{" "}
            <span className="font-semibold">{courseBlockLabel}</span>.
          </p>
          <p className="mt-1 font-semibold text-amber-900">
            Start with just one course, then add more as your time and energy
            allow.
          </p>
        </div>
      </div>
    </div>
  );
}
