"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PackagePlus, RefreshCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { generatePackage } from "@/lib/api";
import { mapPlatform, mapPlatformsList } from "@/lib/platforms";
import type { SessionData } from "@/lib/generated-result";
import {
  validateGoReleaseForm,
  validateNpmWrapperForm,
} from "@/lib/validation";

type ActiveForm = "go-release" | "npm-wrapper";
type GeneratedFiles = Record<string, string>;

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

function buildGoReleasePayload(data: GoReleaseFormData) {
  return {
    repo_url: data.repoUrl,
    binary_name: data.binaryName,
    platforms: mapPlatformsList(data.platforms),
    features: {
      npm_wrapper: false,
      goreleaser: true,
      github_actions: true,
    },
  };
}

function buildNpmWrapperPayload(data: NpmWrapperFormData) {
  const asset_urls = Object.fromEntries(
    data.platforms.map((platform) => [
      mapPlatform(platform),
      data.assetUrls[platform] ?? "",
    ])
  );

  const binaryName = data.cliCommandName.trim();
  const description = data.description.trim()
    ? data.description.trim()
    : `npm wrapper for ${binaryName}`;

  return {
    repo_url: data.repoUrl,
    binary_name: data.cliCommandName,
    package_name: data.packageName,
    license: data.license?.trim() || "MIT",
    description,
    version: data.version,
    platforms: mapPlatformsList(data.platforms),
    mode: "manual" as const,
    features: {
      npm_wrapper: true,
      goreleaser: false,
      github_actions: false,
    },
    asset_urls,
  };
}

function createSessionData(
  workflow: ActiveForm,
  summary: SessionData["summary"],
  files: GeneratedFiles
): SessionData {
  return {
    workflow,
    summary,
    files,
  };
}

function validateActiveForm(
  activeForm: ActiveForm,
  goData: GoReleaseFormData,
  npmData: NpmWrapperFormData
) {
  return activeForm === "go-release"
    ? validateGoReleaseForm(goData)
    : validateNpmWrapperForm(npmData);
}

export default function GeneratePage() {
  const router = useRouter();
  const [activeForm, setActiveForm] = React.useState<ActiveForm>("go-release");
  const [goData, setGoData] = React.useState<GoReleaseFormData>(
    INITIAL_GO_RELEASE_DATA
  );
  const [npmData, setNpmData] = React.useState<NpmWrapperFormData>(
    INITIAL_NPM_WRAPPER_DATA
  );

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleReset = () => {
    if (activeForm === "go-release") {
      setGoData(INITIAL_GO_RELEASE_DATA);
    } else {
      setNpmData(INITIAL_NPM_WRAPPER_DATA);
    }
    setError(null);
  };

  const handleGenerate = async () => {
    const validationError = validateActiveForm(activeForm, goData, npmData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const payload =
        activeForm === "go-release"
          ? buildGoReleasePayload(goData)
          : buildNpmWrapperPayload(npmData);

      const result = await generatePackage(payload);
      const sessionData = createSessionData(activeForm, payload, result.files);

      sessionStorage.setItem("generated-result", JSON.stringify(sessionData));
      router.push("/result");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to generate package"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-black px-6 py-12 font-sans text-zinc-50 selection:bg-zinc-800">
      <div className="w-full max-w-6xl mx-auto">
        <div className="relative md:absolute top-0 left-0 md:top-8 md:left-8 z-20 w-full md:w-auto mb-10 md:mb-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        <div className="mt-8 md:mt-24 grid md:grid-cols-[350px_1fr] gap-12">
          {/* Left Column: Workflow Selection */}
          <div className="md:sticky md:top-12 space-y-6 self-start">
            <h2 className="text-xl font-medium tracking-tight text-white mb-2">
              Choose your workflow
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {FORM_OPTIONS.map((option) => {
                const isActive = activeForm === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => {
                      setActiveForm(option.id);
                      setError(null);
                    }}
                    className={cn(
                      "group relative flex cursor-pointer flex-col items-start rounded-xl border p-5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60",
                      isActive
                        ? "border-zinc-400 bg-zinc-900/40"
                        : "border-zinc-800 bg-transparent hover:border-zinc-700"
                    )}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full transition-all flex-shrink-0",
                          isActive ? "bg-emerald-500" : "bg-zinc-700 group-hover:bg-zinc-600"
                        )}
                      />
                      <span
                        className={cn(
                          "text-base font-medium transition-colors",
                          isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm leading-relaxed transition-colors mt-1 pl-5",
                        isActive ? "text-zinc-400" : "text-zinc-600 group-hover:text-zinc-500"
                      )}
                    >
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Configuration & Actions */}
          <div className="space-y-8 md:pt-2">
            <div className="space-y-1 mb-8">
              <h2 className="text-2xl font-medium tracking-tight text-white">
                Configuration
              </h2>
              <p className="text-sm text-zinc-400">
                {activeForm === "go-release"
                  ? "Configure your Go binary packaging details."
                  : "Specify registry setup for the npm wrapper package."}
              </p>
            </div>

            <div className={cn(isGenerating && "opacity-60 pointer-events-none", "space-y-8")}>
              {/* Active Form */}
              {activeForm === "go-release" ? (
                <GoReleaseForm data={goData} onChange={setGoData} />
              ) : (
                <NpmWrapperForm data={npmData} onChange={setNpmData} />
              )}

              {error && (
                <div className="rounded-md bg-red-500/10 px-4 py-3 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-end pt-8 border-t border-zinc-800/50">
                <Button
                  variant="ghost"
                  className="w-full gap-2 sm:w-auto text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900 sm:min-w-32"
                  onClick={handleReset}
                  disabled={isGenerating}
                >
                  <RefreshCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  className={cn(
                    "w-full gap-2 sm:w-auto sm:min-w-32 font-bold uppercase tracking-wider text-xs",
                    "bg-white text-black border-2 border-white",
                    "shadow-[4px_4px_0_0_#52525b]",
                    "hover:bg-zinc-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#52525b]",
                    "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
                    "transition-all rounded-none"
                  )}
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <PackagePlus className="w-4 h-4" />
                      Generate ZIP
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
