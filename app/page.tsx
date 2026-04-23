"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden font-sans selection:bg-zinc-800"
      style={{ background: "var(--background)" }}
    >
      {/* Subtle radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 dark:bg-[radial-gradient(ellipse_at_30%_40%,_rgba(255,255,255,0.06)_0%,_transparent_50%_,_rgba(0,0,0,0.9)_100%)] bg-[radial-gradient(ellipse_at_30%_40%,_rgba(0,0,0,0.03)_0%,_transparent_50%)]" />

      {/* Theme toggle – top right */}
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <main className="z-10 flex w-full max-w-5xl flex-col items-start justify-center px-8 md:px-12">
        <div
          className="mb-8 inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-widest backdrop-blur-md"
          style={{
            border: "1px solid var(--badge-border)",
            background: "var(--badge-bg)",
            color: "var(--muted-foreground)",
          }}
        >
          GO CLI PACKAGING TOOL
        </div>

        <h1 className="max-w-4xl tracking-tighter" style={{ color: "var(--foreground)" }}>
          <span className="block text-5xl font-semibold sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[1.05]">
            Build in Go.
          </span>
          <span className="block text-5xl font-medium sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[1.05]" style={{ color: "var(--muted-foreground)" }}>
            Ship with npm.
          </span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed opacity-90 sm:text-xl md:text-[22px] md:leading-9" style={{ color: "var(--muted-foreground)" }}>
          Turn your Go binaries into installable npm packages with the release wiring already handled.
        </p>

        <div className="mt-12 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-start">
          <Link
            href="/generate"
            className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-full px-8 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 sm:h-14 sm:w-auto"
            style={{
              background: "var(--btn-primary-bg)",
              color: "var(--btn-primary-text)",
              boxShadow: "0 0 40px -15px var(--btn-primary-shadow)",
            }}
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
            className="flex h-12 w-full items-center justify-center rounded-full px-8 text-sm font-medium transition-all active:scale-95 sm:h-14 sm:w-auto"
            style={{
              border: "1px solid var(--badge-border)",
              background: "var(--badge-bg)",
              color: "var(--muted-foreground)",
            }}
          >
            Learn More
          </Link>
        </div>
      </main>
    </div>
  );
}
