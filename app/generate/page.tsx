"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  GoReleaseForm,
  INITIAL_GO_RELEASE_DATA,
  type GoReleaseFormData,
} from "@/components/forms/go-release-form";
import {
  NpmWrapperForm,
  INITIAL_NPM_WRAPPER_DATA,
  type NpmWrapperFormData,
} from "@/components/forms/npm-wrapper-form";
import { cn } from "@/lib/utils";

type ActiveForm = "go-release" | "npm-wrapper";

const FORM_OPTIONS: { id: ActiveForm; label: string; description: string }[] = [
  {
    id: "go-release",
    label: "Go Release",
    description: "Package a Go binary for npm distribution",
  },
  {
    id: "npm-wrapper",
    label: "NPM Wrapper",
    description: "Create an npm wrapper around an existing binary",
  },
];

export default function GeneratePage() {
  const [activeForm, setActiveForm] = React.useState<ActiveForm>("go-release");
  const [goData, setGoData] = React.useState<GoReleaseFormData>(
    INITIAL_GO_RELEASE_DATA
  );
  const [npmData, setNpmData] = React.useState<NpmWrapperFormData>(
    INITIAL_NPM_WRAPPER_DATA
  );

  const handleReset = () => {
    if (activeForm === "go-release") {
      setGoData(INITIAL_GO_RELEASE_DATA);
    } else {
      setNpmData(INITIAL_NPM_WRAPPER_DATA);
    }
  };

  const handleGenerate = () => {
    // Placeholder for API integration
    const payload = activeForm === "go-release" ? goData : npmData;
    console.log("Generating zip with:", { type: activeForm, ...payload });
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#050505] font-sans selection:bg-zinc-800">
      {/* Background Lighting — matches hero */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(255,255,255,0.04)_0%,_transparent_50%,_rgba(0,0,0,0.9)_100%)]" />

      {/* Page Content */}
      <div className="z-10 flex w-full max-w-6xl flex-col px-6 py-10 sm:px-8 md:px-12 md:py-16">
        {/* Back Link */}
        <Link
          href="/"
          className="group mb-12 inline-flex w-fit items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 12H5M12 19l-7-7 7-7"
            />
          </svg>
          Back to home
        </Link>

        {/* Page Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Generate your package
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Choose your workflow and fill in the required details to generate the
            wrapper zip.
          </p>
        </header>

        {/* Form Selector */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {FORM_OPTIONS.map((option) => {
            const isActive = activeForm === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveForm(option.id)}
                className={cn(
                  "group relative flex flex-col items-start rounded-xl border px-5 py-4 text-left transition-all cursor-pointer sm:px-6 sm:py-5",
                  isActive
                    ? "border-white/20 bg-white/[0.06] shadow-[0_0_30px_-10px_rgba(255,255,255,0.15)]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                )}
              >
                {/* Active Indicator Dot */}
                <div className="mb-3 flex items-center gap-2.5">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full border transition-all",
                      isActive
                        ? "border-white bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        : "border-zinc-600 bg-transparent"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-semibold tracking-tight transition-colors",
                      isActive ? "text-white" : "text-zinc-400"
                    )}
                  >
                    {option.label}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-[13px] leading-relaxed transition-colors",
                    isActive ? "text-zinc-400" : "text-zinc-600"
                  )}
                >
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Form Card */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">
            {/* Form Header inside card */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                {activeForm === "go-release" ? (
                  <svg
                    className="h-4 w-4 text-zinc-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 text-zinc-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  {activeForm === "go-release"
                    ? "Go Release Configuration"
                    : "NPM Wrapper Configuration"}
                </h2>
                <p className="text-xs text-zinc-500">
                  {activeForm === "go-release"
                    ? "Configure your Go binary packaging"
                    : "Set up the npm wrapper package"}
                </p>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Active Form */}
            {activeForm === "go-release" ? (
              <GoReleaseForm data={goData} onChange={setGoData} />
            ) : (
              <NpmWrapperForm data={npmData} onChange={setNpmData} />
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button variant="secondary" size="default" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" size="default" onClick={handleGenerate}>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Generate Zip
          </Button>
        </div>
      </div>
    </div>
  );
}
