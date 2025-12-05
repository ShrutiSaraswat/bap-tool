// components/TimeComparisonInline.tsx

type TimeComparisonInlineProps = {
  approxMonths?: number;
};

export function TimeComparisonInline({
  approxMonths,
}: TimeComparisonInlineProps) {
  const TWO_YEAR = 24;
  const FOUR_YEAR = 48;

  const thisLabel = approxMonths
    ? `${approxMonths} months (this CNC pathway)`
    : "Less than 1 year (this CNC pathway)";

  let twoYearDiff = approxMonths ? TWO_YEAR - approxMonths : 12;
  let fourYearDiff = approxMonths ? FOUR_YEAR - approxMonths : 36;

  if (twoYearDiff < 0) twoYearDiff = 0;
  if (fourYearDiff < 0) fourYearDiff = 0;

  return (
    <div className="mt-2 border border-slate-200 rounded-md bg-white px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1">
        Time comparison
      </p>
      <div className="grid gap-2 sm:grid-cols-3 text-[11px] text-slate-700">
        <div>
          <p className="font-semibold text-slate-900">This CNC pathway</p>
          <p>{thisLabel}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Typical 2 year diploma</p>
          <p>About 24 months of study.</p>
          {twoYearDiff > 0 && (
            <p className="mt-0.5">
              This pathway is about {twoYearDiff} months shorter.
            </p>
          )}
        </div>
        <div>
          <p className="font-semibold text-slate-900">Typical 4 year degree</p>
          <p>About 48 months of study.</p>
          {fourYearDiff > 0 && (
            <p className="mt-0.5">
              This pathway is about {fourYearDiff} months shorter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
