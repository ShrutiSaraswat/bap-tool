// components/TimeComparisonStrip.tsx

export function TimeComparisonStrip() {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-6 sm:py-7">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-600 mb-3">
          How CNC business pathways compare
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Short associate certificates */}
          <div className="border border-slate-200 rounded-lg bg-slate-50 p-4 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#005f63]">
              Short CNC associate certificates
            </p>
            <p className="text-base font-semibold text-slate-900">
              Less than 1 year
            </p>
            <p className="text-xs text-slate-700">
              Examples: Business Fundamentals, Business Essentials, Hospitality
              and Guest Experience Management.
            </p>
            <ul className="mt-1 space-y-1.5 text-xs text-slate-700">
              <li>• Focused start on a specific area of business.</li>
              <li>• Designed to get you into the workforce sooner.</li>
              <li>• Can be stacked into longer CNC business credentials.</li>
            </ul>
          </div>

          {/* 1 year CNC Business Administration Certificate */}
          <div className="border border-slate-200 rounded-lg bg-white p-4 flex flex-col gap-2 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d71920]">
              CNC Business Administration Certificate
            </p>
            <p className="text-base font-semibold text-slate-900">
              About 1 year
            </p>
            <p className="text-xs text-slate-700">
              10 courses that build a broad foundation in accounting, marketing,
              economics and core business skills.
            </p>
            <ul className="mt-1 space-y-1.5 text-xs text-slate-700">
              <li>• Still shorter than a full 2 year or 4 year program.</li>
              <li>
                • Can ladder directly into the CNC Business Administration
                Diploma.
              </li>
              <li>• Helps you qualify for a wider range of business roles.</li>
            </ul>
          </div>

          {/* Typical 2 and 4 year paths */}
          <div className="border border-slate-200 rounded-lg bg-slate-50 p-4 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Typical 2 year and 4 year business paths
            </p>
            <p className="text-base font-semibold text-slate-900">
              2 years and 4 years
            </p>
            <p className="text-xs text-slate-700">
              These are longer programs offered by various institutions that go
              beyond the shorter CNC business credentials shown on this page.
            </p>
            <ul className="mt-1 space-y-1.5 text-xs text-slate-700">
              <li>• 2 year diploma or 4 year degree length.</li>
              <li>• More time before you can complete the full credential.</li>
              <li>
                • CNC business pathways can be used as a shorter starting point
                before deciding on longer study.
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-500 max-w-3xl">
          This tool focuses on shorter CNC business pathways so that students
          can see options that take less time than a traditional 2 year or 4
          year program, with the ability to stack into higher credentials later.
        </p>
      </div>
    </section>
  );
}
