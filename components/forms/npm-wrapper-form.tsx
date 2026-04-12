"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const PLATFORMS = [
  { id: "linux", label: "Linux" },
  { id: "darwin", label: "macOS" },
  { id: "windows", label: "Windows" },
];

export interface NpmWrapperFormData {
  repoUrl: string;
  cliCommandName: string;
  packageName: string;
  version: string;
  platforms: string[];
  assetUrls: Record<string, string>;
}

export const INITIAL_NPM_WRAPPER_DATA: NpmWrapperFormData = {
  repoUrl: "",
  cliCommandName: "",
  packageName: "",
  version: "",
  platforms: [],
  assetUrls: {},
};

interface NpmWrapperFormProps {
  data: NpmWrapperFormData;
  onChange: (data: NpmWrapperFormData) => void;
}

export function NpmWrapperForm({ data, onChange }: NpmWrapperFormProps) {
  const update = <K extends keyof NpmWrapperFormData>(
    key: K,
    value: NpmWrapperFormData[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  const togglePlatform = (platformId: string, checked: boolean) => {
    const nextPlatforms = checked
      ? [...new Set([...data.platforms, platformId])]
      : data.platforms.filter((p) => p !== platformId);
    
    // Only keep URLs for checked platforms
    const nextAssetUrls = { ...data.assetUrls };
    if (!checked) {
      delete nextAssetUrls[platformId];
    } else if (!nextAssetUrls[platformId]) {
        nextAssetUrls[platformId] = "";
    }

    onChange({
      ...data,
      platforms: nextPlatforms,
      assetUrls: nextAssetUrls,
    });
  };

  const updateAssetUrl = (platformId: string, url: string) => {
    update("assetUrls", { ...data.assetUrls, [platformId]: url });
  };

  return (
    <div className="space-y-8">
      {/* Main Settings */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2.5">
          <Label htmlFor="npm-repo-url">Repository URL</Label>
          <Input
            id="npm-repo-url"
            placeholder="github.com/user/repo"
            value={data.repoUrl || ""}
            onChange={(e) => update("repoUrl", e.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-cli-command">Binary Name</Label>
          <Input
            id="npm-cli-command"
            placeholder="mytool"
            value={data.cliCommandName}
            onChange={(e) => {
              update("cliCommandName", e.target.value);
              update("packageName", e.target.value);
            }}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-version">Version</Label>
          <Input
            id="npm-version"
            placeholder="1.0.0"
            value={data.version}
            onChange={(e) => update("version", e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* Platforms Settings */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Target Platforms</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PLATFORMS.map((platform) => {
              const isChecked = data.platforms.includes(platform.id);
              return (
                <div
                  key={platform.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => togglePlatform(platform.id, !isChecked)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      togglePlatform(platform.id, !isChecked);
                    }
                  }}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors ${
                    isChecked
                      ? "border-white/20 bg-white/[0.06]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <Checkbox
                    id={`npm-platform-${platform.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      togglePlatform(platform.id, !!checked)
                    }
                  />
                  <span className="text-sm text-zinc-300">{platform.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Asset URLs */}
        {data.platforms.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 ease-out py-2">
            <Label className="text-zinc-400">Platform Asset URLs</Label>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {PLATFORMS.filter((p) => data.platforms.includes(p.id)).map(
                (platform) => (
                  <div key={`asset-${platform.id}`} className="space-y-2.5">
                    <Label
                      htmlFor={`npm-asset-${platform.id}`}
                      className="text-xs text-zinc-400"
                    >
                      {platform.label} URL
                    </Label>
                    <Input
                      id={`npm-asset-${platform.id}`}
                      placeholder={`https://.../${platform.id}-binary`}
                      value={data.assetUrls[platform.id] || ""}
                      onChange={(e) => updateAssetUrl(platform.id, e.target.value)}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
