"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DistributorSelector } from "@/components/forms/distributor-selector";
import { INITIAL_AUR_FORM_DATA, type AurFormData } from "@/components/forms/aur-form";
import { INITIAL_GO_RELEASE_DATA, type GoReleaseFormData } from "@/components/forms/go-release-form";
import { INITIAL_NPM_WRAPPER_DATA, type NpmWrapperFormData } from "@/components/forms/npm-wrapper-form";
import { prefillFormData } from "@/lib/api";
import { useAppContext, type DistributorType, type PrefillResponse } from "@/lib/app-context";

function toUiPlatform(platform: string): string {
  const value = platform.toLowerCase();

  if (value.includes("linux")) return "linux";
  if (value.includes("darwin") || value.includes("mac")) return "darwin";
  if (value.includes("windows")) return "windows";

  return platform;
}

function toUiAssetUrls(assetUrls: Record<string, string> | undefined): Record<string, string> {
  if (!assetUrls) {
    return {};
  }

  return Object.entries(assetUrls).reduce<Record<string, string>>((accumulator, [platform, url]) => {
    accumulator[toUiPlatform(platform)] = url;
    return accumulator;
  }, {});
}

function buildNpmData(repoUrl: string, prefill: PrefillResponse): NpmWrapperFormData {
  const binaryName = prefill.binary_name?.trim() ?? "";
  const platforms = Array.isArray(prefill.platforms)
    ? prefill.platforms.map((platform) => toUiPlatform(platform))
    : [];

  return {
    ...INITIAL_NPM_WRAPPER_DATA,
    repoUrl,
    cliCommandName: binaryName,
    packageName: prefill.package_name?.trim() ?? "",
    license: prefill.license?.trim() || "MIT",
    description: prefill.description?.trim() ?? "",
    version: prefill.version?.trim() ?? "",
    platforms,
    assetUrls: toUiAssetUrls(prefill.asset_urls),
  };
}

function buildGoData(repoUrl: string, prefill: PrefillResponse): GoReleaseFormData {
  const binaryName = prefill.binary_name?.trim() ?? "";
  const platforms = Array.isArray(prefill.platforms)
    ? prefill.platforms.map((platform) => toUiPlatform(platform))
    : [];

  return {
    ...INITIAL_GO_RELEASE_DATA,
    repoUrl,
    binaryName,
    packageName: prefill.package_name?.trim() || binaryName,
    description: prefill.description?.trim() ?? "",
    platforms,
  };
}

function buildAurData(repoUrl: string, prefill: PrefillResponse): AurFormData {
  const binaryName = prefill.binary_name?.trim() ?? "";

  return {
    ...INITIAL_AUR_FORM_DATA,
    repoUrl,
    binaryName,
    version: prefill.version?.trim() ?? "",
    license: prefill.license?.trim() || "MIT",
    description: prefill.description?.trim() ?? "",
  };
}

export default function GeneratePage() {
  const router = useRouter();
  const {
    repoUrl,
    setRepoUrl,
    selectedDistributors,
    toggleDistributor,
    setActiveDistributor,
    setNpmWrapperData,
    setGoReleaserData,
    setAurData,
    prefillRepoUrl,
    setPrefillRepoUrl,
    setPrefillIssue,
  } = useAppContext();

  const [isContinuing, setIsContinuing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleContinue = async () => {
    const normalizedRepoUrl = repoUrl.trim();

    if (!normalizedRepoUrl) {
      setError("Repository URL is required.");
      return;
    }

    if (selectedDistributors.size === 0) {
      setError("Select at least one distributor.");
      return;
    }

    setError(null);
    setIsContinuing(true);

    try {
      setRepoUrl(normalizedRepoUrl);

      if (prefillRepoUrl !== normalizedRepoUrl) {
        const prefill = (await prefillFormData(normalizedRepoUrl)) as PrefillResponse;

        setNpmWrapperData(buildNpmData(normalizedRepoUrl, prefill));
        setGoReleaserData(buildGoData(normalizedRepoUrl, prefill));
        setAurData(buildAurData(normalizedRepoUrl, prefill));
        setPrefillRepoUrl(normalizedRepoUrl);
        setPrefillIssue(null);
      }

      const firstDistributor = Array.from(selectedDistributors)[0] ?? null;
      setActiveDistributor(firstDistributor as DistributorType | null);
      router.push("/result");
    } catch (prefillError) {
      setPrefillIssue(prefillError instanceof Error ? prefillError.message : "Prefill failed");

      setNpmWrapperData({
        ...INITIAL_NPM_WRAPPER_DATA,
        repoUrl: normalizedRepoUrl,
      });
      setGoReleaserData({
        ...INITIAL_GO_RELEASE_DATA,
        repoUrl: normalizedRepoUrl,
      });
      setAurData({
        ...INITIAL_AUR_FORM_DATA,
        repoUrl: normalizedRepoUrl,
      });
      setPrefillRepoUrl(null);

      const firstDistributor = Array.from(selectedDistributors)[0] ?? null;
      setActiveDistributor(firstDistributor as DistributorType | null);
      router.push("/result");
    } finally {
      setIsContinuing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-zinc-400 hover:text-white"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-lg font-medium tracking-wide">DRB99</h1>
          </div>

          <Button
            onClick={handleContinue}
            disabled={isContinuing || selectedDistributors.size === 0}
            className="h-9 border border-zinc-100 bg-zinc-100 px-5 text-zinc-900 hover:bg-white disabled:opacity-40"
          >
            {isContinuing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Prefilling...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </header>

      <main className="px-4 py-5 sm:px-6">
        <Card className="border-zinc-800 bg-zinc-950 rounded-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium uppercase tracking-wide text-zinc-300">Repository URL</CardTitle>
            <CardDescription className="text-zinc-500">This URL is used for prefill and generation context.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="repo-url" className="sr-only">
              Repository URL
            </Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(event) => {
                setRepoUrl(event.target.value);
                setError(null);
              }}
              className="h-11 border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-0 rounded-none"
            />
          </CardContent>
        </Card>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-300">Distributors</h2>
            <p className="text-xs text-zinc-500">Select one or more targets</p>
          </div>
          <DistributorSelector selected={selectedDistributors} onChange={toggleDistributor} />
        </section>

        {error && (
          <div className="mt-5 border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
