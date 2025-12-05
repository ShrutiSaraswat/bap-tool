// components/ScrollToTopButton.tsx
"use client";

import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;

      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrolled = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      setProgress(scrolled);
      setIsVisible(scrollTop > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const hero =
      document.querySelector("#hero") || document.querySelector("#top");

    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={handleClick}
        className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-slate-200 hover:border-[#005f63] hover:shadow-xl transition-all duration-200"
        aria-label="Back to top"
      >
        {/* Progress ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 40 40"
        >
          {/* Background track */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          {/* Scroll progress */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="#005f63"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Inner circle + improved arrow icon */}
        <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-800">
            {/* Chevron up + stem for a more refined arrow */}
            <path
              d="M7 12l5-5 5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7v11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}
