"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PLATFORM_OPTIONS, type PlatformId } from "@/lib/platforms";

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
  const update = <Key extends keyof NpmWrapperFormData>(
    key: Key,
    value: NpmWrapperFormData[Key]
  ) => {
    onChange({ ...data, [key]: value });
  };

  const updateCommandName = (cliCommandName: string) => {
    onChange({
      ...data,
      cliCommandName,
      packageName: cliCommandName,
    });
  };

  const togglePlatform = (platformId: PlatformId, checked: boolean) => {
    const platforms = checked
      ? [...new Set([...data.platforms, platformId])]
      : data.platforms.filter((platform) => platform !== platformId);

    const assetUrls = { ...data.assetUrls };

    if (!checked) {
      delete assetUrls[platformId];
    } else if (!(platformId in assetUrls)) {
      assetUrls[platformId] = "";
    }

    onChange({
      ...data,
      platforms,
      assetUrls,
    });
  };

  const updateAssetUrl = (platformId: PlatformId, url: string) => {
    update("assetUrls", { ...data.assetUrls, [platformId]: url });
  };

  const selectedPlatforms = PLATFORM_OPTIONS.filter((platform) =>
    data.platforms.includes(platform.id)
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2.5">
          <Label htmlFor="npm-repo-url">Repository URL</Label>
          <Input
            id="npm-repo-url"
            placeholder="github.com/user/repo"
            value={data.repoUrl}
            onChange={(event) => update("repoUrl", event.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-cli-command">Binary Name</Label>
          <Input
            id="npm-cli-command"
            placeholder="mytool"
            value={data.cliCommandName}
            onChange={(event) => updateCommandName(event.target.value)}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="npm-version">Version</Label>
          <Input
            id="npm-version"
            placeholder="1.0.0"
            value={data.version}
            onChange={(event) => update("version", event.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Target Platforms</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PLATFORM_OPTIONS.map((platform) => {
              const isChecked = data.platforms.includes(platform.id);

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
                  className={
                    isChecked
                      ? "flex cursor-pointer items-center gap-3 rounded-lg border border-white/20 bg-white/[0.06] px-3.5 py-3 transition-colors"
                      : "flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                  }
                >
                  <Checkbox
                    id={`npm-platform-${platform.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      togglePlatform(platform.id, checked)
                    }
                  />
                  <span className="text-sm text-zinc-300">{platform.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {selectedPlatforms.length > 0 && (
          <div className="space-y-4 py-2">
            <Label className="text-zinc-400">Platform Asset URLs</Label>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {selectedPlatforms.map((platform) => (
                <div key={platform.id} className="space-y-2.5">
                  <Label
                    htmlFor={`npm-asset-${platform.id}`}
                    className="text-xs text-zinc-400"
                  >
                    {platform.label} URL
                  </Label>
                  <Input
                    id={`npm-asset-${platform.id}`}
                    placeholder={`https://.../${platform.id}-binary`}
                    value={data.assetUrls[platform.id] ?? ""}
                    onChange={(event) =>
                      updateAssetUrl(platform.id, event.target.value)
                    }
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
