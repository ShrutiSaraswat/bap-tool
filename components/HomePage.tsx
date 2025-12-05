// app/page.tsx
export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8">
      {/* We will build these sections one by one next */}
      <section id="programs" className="py-8 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          Business Administration Pathways at CNC
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-700 max-w-2xl">
          Here you will be able to explore CNC programs by program, job title,
          earning potential, and a guided match based on your interests. We will
          plug in the JSON data you added in the public folder in the next
          steps.
        </p>
      </section>
    </div>
  );
}
