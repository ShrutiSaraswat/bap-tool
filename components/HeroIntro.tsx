// components/HeroIntro.tsx
"use client";

export function HeroIntro() {
  return (
    <section className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-8 sm:py-10 lg:py-12 grid gap-8 lg:grid-cols-[3fr,2fr] items-center">
        {/* Left copy */}
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#005f63]">
            Business Administration Program (BAP) · CNC
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 leading-tight">
            Explore short, stackable{" "}
            <span className="text-[#d71920]">business pathways</span> at CNC.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-700 max-w-xl">
            Compare programs, jobs, earning potential and regional opportunities
            using the same labour-market information that the BAP team uses.
            Start with a short credential now, with options to stack into a
            1-year certificate or 2-year diploma later.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#programs"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-sm bg-[#d71920] text-white hover:bg-[#b8141b] transition"
            >
              Start with a program
            </a>
            <a
              href="#guided-match"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-sm border border-slate-300 text-slate-800 hover:bg-slate-100 transition"
            >
              Not sure? Try guided match
            </a>
          </div>

          <div className="mt-5 grid gap-3 text-xs sm:text-[13px] text-slate-700 sm:grid-cols-3 max-w-xl">
            <div className="border border-slate-200 bg-white px-3 py-2">
              <p className="font-semibold text-slate-900">
                3 associate certificates
              </p>
              <p>Focused starts in business, essentials and hospitality.</p>
            </div>
            <div className="border border-slate-200 bg-white px-3 py-2">
              <p className="font-semibold text-slate-900">
                1-year certificate option
              </p>
              <p>Shorter time commitment than 2 or 4-year degrees.</p>
            </div>
            <div className="border border-slate-200 bg-white px-3 py-2">
              <p className="font-semibold text-slate-900">
                Labour-market informed
              </p>
              <p>Uses NOC codes, wages and outlook for northern BC.</p>
            </div>
          </div>
        </div>

        {/* Right panel – simple CNC style card */}
        <div className="relative">
          <div className="absolute -inset-2 bg-[#005f63]/5 rounded-lg" />
          <div className="relative bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#005f63] text-white px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase">
              Directed Search
            </div>
            <div className="p-4 space-y-3 text-xs sm:text-sm">
              <p className="text-slate-800 font-medium">
                Choose how you want to explore:
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-[#d71920]" />
                  <span>
                    <strong>By program</strong> - see job prospects, earning
                    potential and regional opportunities.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-[#005f63]" />
                  <span>
                    <strong>By job title</strong> - find which CNC program leads
                    there.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-[#f4b41a]" />
                  <span>
                    <strong>By earning potential</strong> - compare wage bands.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>
                    <strong>Guided match</strong> - tell us a bit about yourself
                    and we suggest starting points.
                  </span>
                </li>
              </ul>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="#programs"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-sm bg-[#d71920] text-white hover:bg-[#b8141b] transition"
                >
                  Explore by program
                </a>
                <a
                  href="#jobs"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-sm border border-slate-300 text-slate-800 hover:bg-slate-100 transition"
                >
                  Explore by job title
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
