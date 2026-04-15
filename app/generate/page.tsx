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

  return {
    repo_url: data.repoUrl,
    binary_name: data.cliCommandName,
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
    <div className="relative flex min-h-screen flex-col items-center bg-[#09090b] px-6 py-12 font-sans text-zinc-50 selection:bg-zinc-800">
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      <div className="relative z-10 mt-4 w-full max-w-3xl space-y-8 md:mt-8">
        <div className="text-center space-y-3 pb-4">
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Generate your package
          </h1>
          <p className="mx-auto max-w-xl text-sm text-zinc-400">
            Choose your workflow and fill in the required details to generate
            the wrapper zip.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  "group relative flex cursor-pointer flex-col items-start rounded-xl border px-6 py-5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60",
                  isActive
                    ? "border-white/20 bg-white/[0.06] shadow-sm"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                )}
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full transition-all",
                      isActive
                        ? "bg-emerald-500"
                        : "bg-zinc-600 group-hover:bg-zinc-500"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium tracking-tight transition-colors",
                      isActive
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-zinc-300"
                    )}
                  >
                    {option.label}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs leading-relaxed transition-colors",
                    isActive
                      ? "text-zinc-400"
                      : "text-zinc-500 group-hover:text-zinc-400"
                  )}
                >
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        <Card className={cn(isGenerating && "opacity-60 pointer-events-none")}>
          <CardHeader>
            <CardTitle>
              {activeForm === "go-release"
                ? "Go Release Configuration"
                : "NPM Wrapper Configuration"}
            </CardTitle>
            <CardDescription>
              {activeForm === "go-release"
                ? "Configure your Go binary packaging details."
                : "Specify registry setup for the npm wrapper package."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Active Form */}
            {activeForm === "go-release" ? (
              <GoReleaseForm data={goData} onChange={setGoData} />
            ) : (
              <NpmWrapperForm data={npmData} onChange={setNpmData} />
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md bg-red-500/10 px-4 py-3 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end pt-4">
          <Button
            variant="secondary"
            size="sm"
            className="w-full gap-2 sm:w-auto"
            onClick={handleReset}
            disabled={isGenerating}
          >
            <RefreshCcw className="w-3.5 h-3.5 text-zinc-400" />
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="w-full gap-2 sm:w-auto"
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
  );
}
