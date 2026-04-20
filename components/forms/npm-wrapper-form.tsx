"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PLATFORM_OPTIONS, type PlatformId } from "@/lib/platforms";
import { cn } from "@/lib/utils";

export interface NpmWrapperFormData {
  repoUrl: string;
  cliCommandName: string;
  packageName: string;
  license: string;
  description: string;
  version: string;
  platforms: string[];
  assetUrls: Record<string, string>;
}

export const INITIAL_NPM_WRAPPER_DATA: NpmWrapperFormData = {
  repoUrl: "",
  cliCommandName: "",
  packageName: "",
  license: "MIT",
  description: "",
  version: "",
  platforms: [],
  assetUrls: {},
};

interface NpmWrapperFormProps {
  data: NpmWrapperFormData;
  onChange: (data: NpmWrapperFormData) => void;
}

export function NpmWrapperForm({ data, onChange }: NpmWrapperFormProps) {
  const safeData: NpmWrapperFormData = {
    repoUrl: data.repoUrl ?? "",
    cliCommandName: data.cliCommandName ?? "",
    packageName: data.packageName ?? "",
    license: data.license ?? "MIT",
    description: data.description ?? "",
    version: data.version ?? "",
    platforms: data.platforms ?? [],
    assetUrls: data.assetUrls ?? {},
  };

  const update = <Key extends keyof NpmWrapperFormData>(
    key: Key,
    value: NpmWrapperFormData[Key]
  ) => {
    onChange({ ...safeData, [key]: value });
  };

  const updateCommandName = (cliCommandName: string) => {
    onChange({
      ...safeData,
      cliCommandName,
      description:
        safeData.description?.trim()
          ? safeData.description
          : `npm wrapper for ${cliCommandName}`,
    });
  };

  const togglePlatform = (platformId: PlatformId, checked: boolean) => {
    const platforms = checked
      ? [...new Set([...safeData.platforms, platformId])]
      : safeData.platforms.filter((platform) => platform !== platformId);

    const assetUrls = { ...safeData.assetUrls };

    if (checked && !(platformId in assetUrls)) {
      assetUrls[platformId] = "";
    }

    onChange({
      ...safeData,
      platforms,
      assetUrls,
    });
  };

  const updateAssetUrl = (platformId: PlatformId, url: string) => {
    update("assetUrls", { ...safeData.assetUrls, [platformId]: url });
  };

  const selectedPlatforms = PLATFORM_OPTIONS.filter((platform) =>
    safeData.platforms.includes(platform.id)
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2.5">
          <Label htmlFor="npm-repo-url" className="text-zinc-400 text-sm">Repository URL</Label>
          <Input
            id="npm-repo-url"
            placeholder="github.com/user/repo"
            value={safeData.repoUrl}
            onChange={(event) => update("repoUrl", event.target.value)}
            className="py-3 px-4 h-auto bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-white rounded-none transition-all"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-cli-command" className="text-zinc-400 text-sm">Binary Name</Label>
          <Input
            id="npm-cli-command"
            placeholder="mytool"
            value={safeData.cliCommandName}
            onChange={(event) => updateCommandName(event.target.value)}
            className="py-3 px-4 h-auto bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-white rounded-none transition-all"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-version" className="text-zinc-400 text-sm">Version</Label>
          <Input
            id="npm-version"
            placeholder="1.0.0"
            value={safeData.version}
            onChange={(event) => update("version", event.target.value)}
            className="py-3 px-4 h-auto bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-white rounded-none transition-all"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="npm-package-name" className="text-zinc-400 text-sm">Package Name</Label>
          <Input
            id="npm-package-name"
            placeholder="mytool-cli"
            value={safeData.packageName}
            onChange={(event) => update("packageName", event.target.value)}
            className="py-3 px-4 h-auto bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-white rounded-none transition-all"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-license" className="text-zinc-400 text-sm">License (optional)</Label>
          <Input
            id="npm-license"
            placeholder="MIT"
            value={safeData.license}
            onChange={(event) => update("license", event.target.value)}
            className="py-3 px-4 h-auto bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-white rounded-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="npm-description" className="text-zinc-400 text-sm">Description (optional)</Label>
        <textarea
          id="npm-description"
          placeholder={
            safeData.cliCommandName.trim()
              ? `npm wrapper for ${safeData.cliCommandName}`
              : "npm wrapper for <binary_name>"
          }
          value={safeData.description}
          onChange={(event) => update("description", event.target.value)}
          rows={6}
          className={cn(
            "w-full rounded-none border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500",
            "focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500",
            "transition-all resize-y"
          )}
        />
      </div>

      <Separator className="bg-zinc-800/50" />

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-zinc-400 text-sm">Target Platforms</Label>
          <div className="grid grid-cols-3 gap-4">
            {PLATFORM_OPTIONS.map((platform) => {
              const isChecked = safeData.platforms.includes(platform.id);

              return (
                <div
                  key={platform.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => togglePlatform(platform.id, !isChecked)}
                  onKeyDown={(event) => {
                    if (event.key === " " || event.key === "Enter") {
                      event.preventDefault();
                      togglePlatform(platform.id, !isChecked);
                    }
                  }}
                  className={cn(
                    "group flex cursor-pointer flex-col items-center justify-center rounded-none border p-4 transition-all outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
                    isChecked
                      ? "border-zinc-400 bg-zinc-800/50"
                      : "border-zinc-800 bg-transparent hover:border-zinc-700 hover:bg-zinc-900/30"
                  )}
                >
                  {platform.id === "linux" && <img src="https://files.svgcdn.io/flat-color-icons/linux.svg" alt="Linux" className={cn("w-7 h-7 mb-3 transition-all", isChecked ? "opacity-100 drop-shadow-sm" : "opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0")} />}
                  {platform.id === "darwin" && <img src="https://files.svgcdn.io/qlementine-icons/mac-16.svg" alt="macOS" className={cn("w-7 h-7 mb-3 transition-all", isChecked ? "opacity-100 drop-shadow-sm invert" : "opacity-50 grayscale invert group-hover:opacity-80")} />}
                  {platform.id === "windows" && <img src="https://files.svgcdn.io/devicon/windows8.svg" alt="Windows" className={cn("w-7 h-7 mb-3 transition-all", isChecked ? "opacity-100 drop-shadow-sm" : "opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0")} />}
                  <span className={cn("text-xs font-medium transition-colors", isChecked ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")}>{platform.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {selectedPlatforms.length > 0 && (
          <div className="space-y-4 py-2">
            <Label className="text-zinc-400 text-sm">Platform Asset URLs</Label>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {selectedPlatforms.map((platform) => (
                <div key={platform.id} className="space-y-2.5">
                  <Label
                    htmlFor={`npm-asset-${platform.id}`}
                    className="text-xs text-zinc-500"
                  >
                    {platform.label} URL
                  </Label>
                  <Input
                    id={`npm-asset-${platform.id}`}
                    placeholder={`https://.../${platform.id}-binary`}
                    value={safeData.assetUrls[platform.id] ?? ""}
                    onChange={(event) =>
                      updateAssetUrl(platform.id, event.target.value)
                    }
                    className="py-3 px-4 h-auto bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-white rounded-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
