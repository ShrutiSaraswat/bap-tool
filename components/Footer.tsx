// components/CncFooter.tsx
"use client";

export function CncFooter() {
  return (
    <footer className="relative bg-slate-900 text-slate-100 border-t border-slate-800 overflow-hidden">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-44 w-44 rounded-full bg-[#005f63]/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-52 w-52 rounded-full bg-[#d71920]/40 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-3 sm:px-4 lg:px-0 py-6 sm:py-8 flex items-center justify-center">
        {/* Only copyright line kept as per client request */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <p className="text-base text-slate-400">
            © {new Date().getFullYear()} SkylerLoop and SkylerPathFinder.
          </p>
        </div>
      </div>
    </footer>
  );
}
