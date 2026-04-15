import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] font-sans selection:bg-zinc-800">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_40%,_rgba(255,255,255,0.06)_0%,_transparent_50%_,_rgba(0,0,0,0.9)_100%)]" />

      <main className="z-10 flex w-full max-w-5xl flex-col items-start justify-center px-8 md:px-12">
        <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-widest text-zinc-300 backdrop-blur-md">
          GO CLI PACKAGING TOOL
        </div>

        <h1 className="max-w-4xl tracking-tighter text-white">
          <span className="block text-5xl font-semibold sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[1.05]">
            Build in Go.
          </span>
          <span className="block text-5xl font-medium text-zinc-500 sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[1.05]">
            Ship with npm.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 opacity-90 sm:text-xl md:text-[22px] md:leading-9">
          Turn your Go binaries into installable npm packages with the release wiring already handled.
        </p>

        <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Link
            href="/generate"
            className="group flex h-12 items-center justify-center gap-2.5 rounded-full bg-white px-8 text-sm font-semibold text-black shadow-[0_0_40px_-15px_rgba(255,255,255,0.5)] transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-95 sm:h-14"
          >
            Start Generating
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="#"
            className="flex h-12 sm:h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-medium text-zinc-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            Learn More
          </Link>
        </div>
      </main>
    </div>
  );
}
